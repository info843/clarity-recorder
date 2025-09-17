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

  // Nimm die echte Origin wenn vorhanden, sonst deine Domain
  const origin =
    req.headers.origin ||
    'https://interview.clarity-nvl.com';

  const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64');

  // Minimaler, von Mux sicher akzeptierter Body
  const body = {
    cors_origin: origin,                        // keine Wildcard
    new_asset_settings: {
      playback_policy: ['public']
      // mp4_support NICHT setzen → manche Pläne/Endpunkte weigern sich sonst
    }
  };

  try {
    const r = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const j = await r.json().catch(() => ({}));

    if (!r.ok || !j?.data?.url || !j?.data?.id) {
      // Reiche die Mux-Fehlerinformationen transparent zurück
      return res.status(400).json({
        error: 'mux_api_error',
        muxStatus: r.status,
        muxBody: j
      });
    }

    return res.status(200).json({
      uploadId: j.data.id,
      uploadUrl: j.data.url
    });
  } catch (e) {
    return res.status(500).json({ error: 'mux_upload_create_failed', message: String(e) });
  }
}
