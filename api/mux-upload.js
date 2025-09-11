// /api/mux-upload.js

// Wer darf diese API aufrufen?
const ALLOWED_APP_ORIGINS = [
  'https://clarity-recorder.vercel.app',
  'https://interview.clarity-nvl.com',
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

  // CORS
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // Preflight
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: 'Method not allowed. Use POST.', method: req.method || '' });
  }

  try {
    if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
      return res.status(500).json({ error: 'MUX credentials missing' });
    }

    const { uid, companyId } = req.body || {};
    if (!uid || !companyId) {
      return res.status(400).json({ error: 'uid/companyId required' });
    }

    const corsOrigin = isAllowed ? origin : 'https://interview.clarity-nvl.com';
    const auth =
      'Basic ' +
      Buffer.from(
        process.env.MUX_TOKEN_ID + ':' + process.env.MUX_TOKEN_SECRET
      ).toString('base64');

    const r = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: auth },
      body: JSON.stringify({
        new_asset_settings: { playback_policy: ['public'], cors_origin: corsOrigin },
        passthrough: JSON.stringify({ uid, companyId })
      })
    });

    const json = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(r.status).json({ error: 'mux_error', detail: json });

    return res.status(200).json({
      uploadUrl: json?.data?.url,
      uploadId: json?.data?.id
    });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
