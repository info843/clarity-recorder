// api/mux-asset.js
export default async function handler(req, res) {
  // CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { uploadId = '' } = req.query || {};
  const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
  if (!uploadId) return res.status(400).json({ error: 'missing_uploadId' });
  if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
    return res.status(500).json({ error: 'mux_env_missing' });
  }

  const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64');

  try {
    // Upload lesen → Asset-ID finden
    const ru = await fetch(`https://api.mux.com/video/v1/uploads/${uploadId}`, {
      headers: { Authorization: `Basic ${auth}` }
    });
    const ju = await ru.json();
    const assetId = ju?.data?.asset_id || null;

    let result = {
      uploadStatus: ju?.data?.status || null,
      assetStatus: null,
      playbackId: null,
      mp4Url: null,
    };

    if (!assetId) return res.status(200).json(result);

    // Asset lesen → Playback-ID / MP4 finden
    const ra = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
      headers: { Authorization: `Basic ${auth}` }
    });
    const ja = await ra.json();

    const playbackId = (ja?.data?.playback_ids || [])[0]?.id || null;
    const mp4 = (ja?.data?.tracks || [])
      .find(t => t?.type === 'video' && t?.max_width && t?.max_height && t?.status === 'ready' && t?.max_frame_rate)
      ? `https://stream.mux.com/${playbackId}.m3u8` // HLS
      : null;

    result.assetStatus = ja?.data?.status || null;
    result.playbackId = playbackId;
    result.mp4Url = mp4;

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'mux_asset_endpoint_error', message: String(err?.message || err) });
  }
}
