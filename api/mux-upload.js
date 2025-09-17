export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
  if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) return res.status(500).json({ error: 'mux_env_missing' });

  try {
    const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64');

    const r = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cors_origin: '*',
        new_asset_settings: {
          playback_policy: ['public'],
          mp4_support: 'standard'
        }
      })
    });

    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: 'mux_upload_create_failed', detail: j });

    const upload = j?.data;
    return res.status(200).json({ uploadUrl: upload?.url, uploadId: upload?.id });
  } catch (e) {
    return res.status(500).json({ error: 'mux_server_error', message: String(e) });
  }
}
