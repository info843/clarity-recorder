// api/mux-asset.js — final (ESM, CORS + Upload/Asset-Status)
const ALLOW_ORIGINS = [
  'https://interview.clarity-nvl.com',
  'https://www.clarity-nvl.com',
  'https://clarity-recorder.vercel.app'
];

function cors(req, res) {
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

function send(res, status, data) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') return send(res, 405, { ok:false, error:'method_not_allowed' });

  try {
    const uploadId = (req.query?.uploadId || '').toString();
    if (!uploadId) return send(res, 400, { ok:false, error:'missing_uploadId' });

    const id = process.env.MUX_TOKEN_ID;
    const secret = process.env.MUX_TOKEN_SECRET;
    if (!id || !secret) return send(res, 500, { ok:false, error:'mux_credentials_missing' });

    const auth = 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64');

    // Upload abfragen
    const upRes = await fetch(`https://api.mux.com/video/v1/uploads/${encodeURIComponent(uploadId)}`, {
      headers: { 'Authorization': auth }
    });
    const up = await upRes.json().catch(()=> ({}));
    if (!upRes.ok) return send(res, upRes.status || 502, { ok:false, error:'mux_upload_lookup_failed', detail: up });

    const assetId = up?.data?.asset_id || null;
    if (!assetId) {
      return send(res, 200, { ok:true, uploadId, assetStatus: up?.data?.status || 'preparing' });
    }

    // Asset abfragen
    const asRes = await fetch(`https://api.mux.com/video/v1/assets/${encodeURIComponent(assetId)}`, {
      headers: { 'Authorization': auth }
    });
    const as = await asRes.json().catch(()=> ({}));
    if (!asRes.ok) return send(res, asRes.status || 502, { ok:false, error:'mux_asset_lookup_failed', detail: as });

    const playbackId = as?.data?.playback_ids?.[0]?.id || null;
    const mp4Url     = playbackId ? `https://stream.mux.com/${playbackId}/medium.mp4` : null;

    return send(res, 200, {
      ok: true,
      uploadId,
      assetId,
      assetStatus: as?.data?.status || 'ready',
      playbackId,
      mp4Url
    });
  } catch (e) {
    return send(res, 500, { ok:false, error:'server_error', detail:String(e?.message||e) });
  }
}
