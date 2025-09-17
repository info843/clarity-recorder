export default async function handler(req, res) {
  // CORS
  if (req.method === 'OPTIONS') return res.status(204)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')
    .end();
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' }); // << gut zum Browser-Test
  }

  const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
  if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
    return res.status(500).json({ error: 'mux_env_missing' });
  }

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
          mp4_support: 'standard',
          encoding_tier: 'baseline'
        }
      })
    });

    const j = await r.json();
    if (!r.ok || !j?.data?.url) {
      return res.status(r.status || 500).json({ error: 'mux_create_failed', detail: j });
    }

    return res.status(200).json({
      uploadUrl: j.data.url,
      uploadId: j.data.id
    });
  } catch (err) {
    return res.status(500).json({ error: 'mux_request_failed', detail: String(err) });
  }
}
