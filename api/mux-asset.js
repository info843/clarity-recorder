const ALLOWED_APP_ORIGINS = [
  'https://interview.clarity-nvl.com',
  'https://www.clarity-nvl.com',
  'https://clarity-nvl.com',
  'https://clarity-recorder.vercel.app'
];

function getOrigin(req) {
  const o = req.headers?.origin || '';
  if (o) return o;
  const r = req.headers?.referer || '';
  try { return r ? new URL(r).origin : ''; } catch { return ''; }
}
function setCors(req, res) {
  const origin = getOrigin(req);
  if (ALLOWED_APP_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
}
function muxAuthHeader() {
  const id = process.env.MUX_TOKEN_ID;
  const sec = process.env.MUX_TOKEN_SECRET;
  if (!id || !sec) return null;
  return 'Basic ' + Buffer.from(id + ':' + sec).toString('base64');
}
async function readJsonSafe(res) {
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  const t = await res.text();
  return { raw: t };
}

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const uploadId = (req.query?.uploadId || '').toString().trim();
    if (!uploadId) return res.status(400).json({ error: 'uploadId required' });

    const auth = muxAuthHeader();
    if (!auth) return res.status(500).json({ error: 'MUX credentials missing' });

    const upRes  = await fetch(`https://api.mux.com/video/v1/uploads/${uploadId}`, { headers: { Authorization: auth } });
    const upJson = await readJsonSafe(upRes);
    if (!upRes.ok) return res.status(upRes.status).json({ error:'mux-upload-fetch-failed', details: upJson });

    const uploadStatus = upJson?.data?.status || 'unknown';
    const assetId = upJson?.data?.asset_id || null;

    let assetStatus = null, playbackId = null, playbackUrl = null, mp4Url = null;

    if (assetId) {
      const asRes  = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, { headers: { Authorization: auth } });
      const asJson = await readJsonSafe(asRes);
      if (!asRes.ok) return res.status(asRes.status).json({ error:'mux-asset-fetch-failed', details: asJson });

      assetStatus = asJson?.data?.status || null;
      playbackId  = asJson?.data?.playback_ids?.[0]?.id || null;
      playbackUrl = playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : null;

      const flRes  = await fetch(`https://api.mux.com/video/v1/assets/${assetId}/files`, { headers: { Authorization: auth } });
      const flJson = await readJsonSafe(flRes);
      if (flRes.ok && Array.isArray(flJson?.data)) {
        const mp4 = flJson.data.find(f => f?.type === 'video' && f?.ext === 'mp4' && f?.status === 'ready');
        if (mp4?.url) mp4Url = mp4.url;
      }
    }

    return res.status(200).json({ ok:true, uploadId, uploadStatus, assetId, assetStatus, playbackId, playbackUrl, mp4Url });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
