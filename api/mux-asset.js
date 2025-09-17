// api/mux-asset.js
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization'
};

const MUX_BASE = 'https://api.mux.com/video/v1';

function basicAuth() {
  const id = process.env.MUX_TOKEN_ID || '';
  const secret = process.env.MUX_TOKEN_SECRET || '';
  return 'Basic ' + Buffer.from(id + ':' + secret).toString('base64');
}

async function fetchJson(url) {
  const r = await fetch(url, { headers: { 'Authorization': basicAuth() } });
  if (!r.ok) throw new Error(`mux_http_${r.status}`);
  return r.json();
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400');
    res.writeHead(204, CORS_HEADERS).end();
    return;
  }

  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json', ...CORS_HEADERS });
    res.end(JSON.stringify({ error: 'method_not_allowed' }));
    return;
  }

  try {
    const { uploadId = '' } = req.query || {};
    if (!uploadId) {
      res.writeHead(400, { 'Content-Type': 'application/json', ...CORS_HEADERS });
      res.end(JSON.stringify({ error: 'missing_uploadId' }));
      return;
    }

    // 1) Upload abfragen
    const up = await fetchJson(`${MUX_BASE}/uploads/${encodeURIComponent(uploadId)}`);
    const upData = up?.data;

    let assetStatus = 'waiting';
    let assetId = null;

    if (upData?.asset_id) {
      assetId = upData.asset_id;
      assetStatus = 'created';
    } else if (upData?.status === 'errored') {
      assetStatus = 'errored';
    }

    // 2) Falls Asset existiert → Details holen
    let playbackId = null;
    let mp4Url = null;

    if (assetId) {
      const a = await fetchJson(`${MUX_BASE}/assets/${assetId}`);
      const ad = a?.data;

      if (ad?.playback_ids?.length) {
        playbackId = ad.playback_ids[0].id;
      }
      // MP4-URL (wenn MP4 support eingeschaltet)
      if (ad?.static_renditions?.status === 'ready' && playbackId) {
        // öffentliche MP4 URL (progressiv)
        mp4Url = `https://stream.mux.com/${playbackId}/medium.mp4`;
      }
      assetStatus = ad?.status || assetStatus;
    }

    res.writeHead(200, { 'Content-Type': 'application/json', ...CORS_HEADERS });
    res.end(JSON.stringify({ ok: true, uploadId, assetId, assetStatus, playbackId, mp4Url }));
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'application/json', ...CORS_HEADERS });
    res.end(JSON.stringify({ error: 'server_error', message: String(e?.message || e) }));
  }
}
