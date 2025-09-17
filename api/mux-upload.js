// Serverless: Create a Mux Direct Upload URL
export default async function handler(req, res) {
  // CORS (Preflight)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
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

  try {
    const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64');

    // Optional: aus Body auslesen (uid/companyId nur für Logging oder spätere Persistenz)
    // const { uid, companyId, mode } = req.body || {};

    const r = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        new_asset_settings: {
          playback_policy: ['public'],
          mp4_support: 'standard'
        },
        cors_origin: '*' // oder deine Domain
      })
    });

    const j = await r.json();
    if (!r.ok || !j?.data?.url) {
      return res.status(400).json({ error: 'mux_upload_create_failed', detail: j });
    }

    const upload = j.data; // {id, url, ...}
    return res.status(200).json({
      uploadId: upload.id,
      uploadUrl: upload.url
    });
  } catch (e) {
    return res.status(500).json({ error: 'mux_upload_exception', message: String(e?.message || e) });
  }
}
