// api/mux-upload.js

// Domains, die deine API (diese Route) aufrufen dürfen:
const ALLOWED_APP_ORIGINS = [
  'https://interview.clarity-nvl.com',          // geplante Subdomain
  'https://clarity-recorder.vercel.app',        // Production
  'https://www.clarity-nvl.com',
  'https://clarity-nvl.com'
];

function getRequestOrigin(req) {
  const o = req.headers?.origin || '';
  if (o) return o;
  const ref = req.headers?.referer || '';
  try { return ref ? new URL(ref).origin : ''; } catch { return ''; }
}

export default async function handler(req, res) {
  const origin = getRequestOrigin(req);
  const isAllowed = ALLOWED_APP_ORIGINS.includes(origin);

  // CORS
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();

  // Check ENV
  const id = process.env.MUX_TOKEN_ID;
  const secret = process.env.MUX_TOKEN_SECRET;
  if (!id || !secret) {
    return res.status(500).json({ error: 'MUX credentials missing' });
  }

  try {
    const { uid, companyId } = req.body || {};
    if (!uid || !companyId) {
      return res.status(400).json({ error: 'uid/companyId required' });
    }

    const muxCorsOrigin = isAllowed ? origin : 'https://interview.clarity-nvl.com';

    const r = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(id + ':' + secret).toString('base64')
      },
      body: JSON.stringify({
        new_asset_settings: {
          playback_policy: ['public'],
          cors_origin: muxCorsOrigin
        },
        passthrough: JSON.stringify({ uid, companyId })
      })
    });

    const json = await r.json();
    if (!r.ok) return res.status(r.status).json(json);

    res.status(200).json({
      uploadUrl: json?.data?.url,
      uploadId: json?.data?.id
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
