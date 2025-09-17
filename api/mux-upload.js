export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
  if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
    return res.status(500).json({ error: 'mux_env_missing' });
  }

  const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64');

  try {
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
        cors_origin: '*',
        upload_method: 'authenticated'
      })
    });

    const j = await r.json();
    if (!r.ok) return res.status(r.status).json(j);

    const data = j?.data || {};
    return res.status(200).json({
      uploadId: data.id,
      uploadUrl: data.url
    });
  } catch (e) {
    return res.status(500).json({ error: 'mux_upload_create_failed', detail: String(e) });
  }
}
