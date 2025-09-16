// api/mux-asset.js  — final (CommonJS, Node 22, CORS + upload/asset lookup)
const ALLOW_ORIGINS = [
  'https://interview.clarity-nvl.com',
  'https://www.clarity-nvl.com',
  'https://clarity-recorder.vercel.app',
];

function setCors(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOW_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') { res.status(204).end(); return true; }
  return false;
}

function json(res, status, data) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  if (setCors(req, res)) return; // preflight handled

  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, error: 'method_not_allowed' });
  }

  try {
    const uploadId = (req.query?.uploadId || '').toString();
    if (!uploadId) return json(res, 400, { ok: false, error: 'missing_uploadId' });

    const id = process.env.MUX_TOKEN_ID;
    const secret = process.env.MUX_TOKEN_SECRET;
    if (!id || !secret) {
      return json(res, 500, { ok: false, error: 'mux_credentials_missing' });
    }
    const auth = 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64');

    // 1) Upload abfragen
    const upRes = await fetch(`https://api.mux.com/video/v1/uploads/${encodeURIComponent(uploadId)}`, {
      headers: { 'Authorization': auth }
    });
    const up = await upRes.json().catch(() => ({}));
    if (!upRes.ok) {
      return json(res, 502, { ok: false, error: 'mux_upload_lookup_failed', detail: up });
    }

    const assetId = up?.data?.asset_id || null;
    if (!assetId) {
      // Noch kein Asset angelegt
      return json(res, 200, {
        ok: true,
        uploadId,
        assetStatus: up?.data?.status || 'preparing'
      });
    }

    // 2) Asset abfragen
    const assetRes = await fetch(`https://api.mux.com/video/v1/assets/${encodeURIComponent(assetId)}`, {
      headers: { 'Authorization': auth }
    });
    const asset = await assetRes.json().catch(() => ({}));
    if (!assetRes.ok) {
      return json(res, 502, { ok: false, error: 'mux_asset_lookup_failed', detail: asset });
    }

    const playbackId = asset?.data?.playback_ids?.[0]?.id || null;
    // MP4-URL (wenn mp4_support:standard): Static Rendition
    const mp4Url = playbackId ? `https://stream.mux.com/${playbackId}/medium.mp4` : null;

    return json(res, 200, {
      ok: true,
      uploadId,
      assetId,
      assetStatus: asset?.data?.status || 'ready',
      playbackId,
      mp4Url
    });

  } catch (e) {
    return json(res, 500, { ok: false, error: 'server_error', detail: String(e?.message || e) });
  }
};
