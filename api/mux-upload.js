// Creates a Mux Direct Upload URL for the recorder
// Requires env vars on *this* Vercel project: MUX_TOKEN_ID, MUX_TOKEN_SECRET

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const ORIGIN = req.headers.origin || 'https://interview.clarity-nvl.com';
  const { uid = '', companyId = '', mode = 'video' } = (req.body && typeof req.body === 'object') ? req.body : {};

  if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    return res.status(500).json({ ok: false, error: 'missing_env', hint: 'Set MUX_TOKEN_ID and MUX_TOKEN_SECRET in Vercel > Project > Settings > Environment Variables' });
  }

  const basic = Buffer.from(`${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`).toString('base64');

  try {
    // Create Direct Upload
    const r = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cors_origin: ORIGIN, // must match the iframe/page origin
        // (alternativ: "*" erlaubt alle Origins; ORIGIN ist enger & sicherer)
        new_asset_settings: {
          playback_policy: ['public'],
          mp4_support: 'standard',
          passthrough: JSON.stringify({ uid, companyId, mode }).slice(0, 255)
        },
        timeout: 3600
      })
    });

    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      return res.status(400).json({
        ok: false,
        error: 'mux_upload_create_failed',
        detail: j,
        origin: ORIGIN
      });
    }

    const upload = j?.data;
    return res.status(200).json({
      ok: true,
      uploadUrl: upload?.url || '',
      uploadId: upload?.id || '',
      origin: ORIGIN
    });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: 'mux_upload_unexpected',
      message: String(e && e.message || e)
    });
  }
}
