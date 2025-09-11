export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { uid, companyId } = req.body || {};
    if (!uid || !companyId) return res.status(400).json({ error: 'uid/companyId required' });

    const r = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer
          .from(process.env.MUX_TOKEN_ID + ':' + process.env.MUX_TOKEN_SECRET)
          .toString('base64')
      },
      body: JSON.stringify({
        new_asset_settings: { playback_policy: ['public'] },
        // für ersten Test gern weglassen oder auf deine Subdomain setzen:
        // cors_origin: 'https://interview.clarity-nvl.com',
        passthrough: JSON.stringify({ uid, companyId })
      })
    });

    const json = await r.json();
    if (!r.ok) return res.status(r.status).json(json);

    res.status(200).json({ uploadUrl: json.data.url, uploadId: json.data.id });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
