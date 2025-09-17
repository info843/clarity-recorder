export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { uploadId } = req.query || {};
  const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
  if (!uploadId) return res.status(400).json({ error: 'missing_uploadId' });
  if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
    return res.status(500).json({ error: 'mux_env_missing' });
  }

  const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64');

  try {
    // Upload abfragen
    const ru = await fetch(`https://api.mux.com/video/v1/uploads/${uploadId}`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });
    const ju = await ru.json();
    if (!ru.ok) return res.status(ru.status).json(ju);

    const assetId = ju?.data?.asset_id;
    if (!assetId) {
      return res.status(200).json({ assetStatus: ju?.data?.status || 'waiting' });
    }

    // Asset abfragen
    const ra = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });
    const ja = await ra.json();
    if (!ra.ok) return res.status(ra.status).json(ja);

    const playbackId = ja?.data?.playback_ids?.[0]?.id || null;
    let mp4Url = null;
    // einfache MP4-URL (Delivery via playback_id)
    if (playbackId) mp4Url = `https://stream.mux.com/${playbackId}.m3u8`;

    return res.status(200).json({
      assetStatus: ja?.data?.status || 'unknown',
      playbackId,
      mp4Url
    });
  } catch (e) {
    return res.status(500).json({ error: 'mux_asset_poll_failed', detail: String(e) });
  }
}
