// api/mux-upload.js

// Which web origins are allowed to call this API:
const ALLOWED_APP_ORIGINS = [
  'https://clarity-recorder.vercel.app',       // your current test domain
  'https://interview.clarity-nvl.com',         // your subdomain (planned)
  'https://www.clarity-nvl.com',
  'https://clarity-nvl.com'
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

  // CORS for this API route
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')  return res.status(405).end();

  try {
    const { uid, companyId } = req.body || {};
    if (!uid || !companyId) {
      return res.status(400).json({ error: 'uid/companyId required' });
    }

    // IMPORTANT: cors_origin is a TOP-LEVEL property on the upload, not inside new_asset_settings.
    const corsOriginForMux = isAllowed ? origin : 'https://interview.clarity-nvl.com';

    const auth =
      'Basic ' +
      Buffer.from(
        (process.env.MUX_TOKEN_ID || '') + ':' + (process.env.MUX_TOKEN_SECRET || '')
      ).toString('base64');

    const r = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth
      },
      body: JSON.stringify({
        // 👇 top-level CORS
        cors_origin: corsOriginForMux,

        // asset settings
        new_asset_settings: {
          playback_policy: ['public']
        },

        // passthrough for your bookkeeping
        passthrough: JSON.stringify({ uid, companyId })
      })
    });

    const json = await r.json();
    if (!r.ok) {
      // Forward Mux error for easier debugging in the browser
      return res.status(r.status).json(json);
    }

    // Success → give the browser the direct upload URL
    res.status(200).json({
      uploadUrl: json.data?.url,
      uploadId:  json.data?.id
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
