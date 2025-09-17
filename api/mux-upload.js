const ALLOWED_APP_ORIGINS = [
  'https://interview.clarity-nvl.com',
  'https://www.clarity-nvl.com',
  'https://clarity-nvl.com',
  'https://clarity-recorder.vercel.app'
];

function getRequestOrigin(req) {
  const o = req.headers?.origin || '';
  if (o) return o;
  const r = req.headers?.referer || '';
  try { return r ? new URL(r).origin : ''; } catch { return ''; }
}

export default async function handler(req, res) {
  const origin = getRequestOrigin(req);
  const isAllowed = ALLOWED_APP_ORIGINS.includes(origin);

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')  return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { uid, companyId, mode } = req.body || {};
    if (!uid || !companyId) return res.status(400).json({ error: 'uid/companyId required' });

    const id  = process.env.MUX_TOKEN_ID || '';
    const sec = process.env.MUX_TOKEN_SECRET || '';
    if (!id || !sec) return res.status(500).json({ error: 'MUX credentials missing' });

    const auth = 'Basic ' + Buffer.from(id + ':' + sec).toString('base64');

    const muxRes = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': auth },
      body: JSON.stringify({
        cors_origin: isAllowed ? origin : 'https://interview.clarity-nvl.com',
        new_asset_settings: {
          playback_policy: ['public'],
          mp4_support: 'standard'
        },
        passthrough: JSON.stringify({ uid, companyId, mode })
      })
    });

    const json = await muxRes.json().catch(() => ({}));
    if (!muxRes.ok) return res.status(muxRes.status).json(json);

    return res.status(200).json({
      uploadUrl: json?.data?.url,
      uploadId: json?.data?.id
    });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
