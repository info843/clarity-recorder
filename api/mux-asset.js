export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { uploadId } = req.query;
  if (!uploadId) return res.status(400).json({ error: 'missing_uploadId' });

  const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
  if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) return res.status(500).json({ error: 'mux_env_missing' });

  const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64');
  try {
    // Upload lookup
    const uRes = await fetch(`https://api.mux.com/video/v1/uploads/${uploadId}`, {
      headers: { Authorization: `Basic ${auth}` }
    });
    const uJson = await uRes.json();
    if (!uRes.ok) return res.status(uRes.status).json({ error: 'mux_upload_lookup_failed', detail: uJson });

    const assetId = uJson?.data?.asset_id || null;
    const assetStatus = uJson?.data?.status || null;

    let playbackId = null, mp4Url = null;
    if (assetId) {
      const aRes = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
        headers: { Authorization: `Basic ${auth}` }
      });
      const aJson = await aRes.json();
      if (aRes.ok) {
        playbackId = aJson?.data?.playback_ids?.[0]?.id || null;
        // .m3u8 Fallback (ok für Player)
        if (playbackId) mp4Url = `https://stream.mux.com/${playbackId}.m3u8`;

        // Falls Mux direkt MP4-Files liefert:
        const files = aJson?.data?.static_renditions?.files || [];
        const mp4 = files.find(f => f?.container === 'mp4');
        if (mp4?.url) mp4Url = mp4.url;
      }
    }

    res.status(200).json({ assetStatus, assetId, playbackId, mp4Url });
  } catch (e) {
    res.status(500).json({ error: 'mux_server_error', message: String(e) });
  }
}
