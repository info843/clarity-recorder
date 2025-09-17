// api/mux-upload.js
export default async function handler(req, res) {
  // CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
  if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
    return res.status(500).json({ error: 'mux_env_missing' });
  }

  // A: Request-Body (optional Infos zum Logging)
  let meta = {};
  try { meta = req.body || {}; } catch (_) {}

  // B: Aufruf an Mux – Direct Upload anlegen
  try {
    const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64');

    const createBody = {
      new_asset_settings: {
        playback_policy: ['public'],
        mp4_support: 'standard',
        passthrough: JSON.stringify({
          uid: meta.uid || null,
          companyId: meta.companyId || null,
          mode: meta.mode || null,
        }),
      },
      cors_origin: '*',
      // optional: upload domain whitelisten, z.B. "https://interview.clarity-nvl.com"
      // cors_origin: "https://interview.clarity-nvl.com",
    };

    const r = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createBody),
    });

    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j?.data?.id || !j?.data?.url) {
      return res.status(r.status || 400).json({
        error: 'mux_create_failed',
        status: r.status,
        mux: j
      });
    }

    // C: Upload-Daten zurück an den Client
    return res.status(200).json({
      uploadId: j.data.id,
      uploadUrl: j.data.url,
    });
  } catch (err) {
    return res.status(500).json({ error: 'mux_upload_endpoint_error', message: String(err?.message || err) });
  }
}
