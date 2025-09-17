// api/mux-asset.js

// Serverless: Poll upload -> asset; return playbackId + mp4Url (wenn verfügbar)
export default async function handler(req, res) {
  // CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return res.status(204).end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
  if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
    return res.status(500).json({ error: 'mux_env_missing' });
  }

  const uploadId = (req.query?.uploadId || '').trim();
  if (!uploadId) return res.status(400).json({ error: 'missing_uploadId' });

  const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64');

  try {
    // 1) Upload lesen
    const ru = await fetch(`https://api.mux.com/video/v1/uploads/${uploadId}`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });
    const ju = await ru.json();
    if (!ru.ok) return res.status(400).json({ error: 'mux_upload_fetch_failed', detail: ju });

    const upload = ju?.data;
    const assetId = upload?.asset_id || upload?.asset?.id || null;
    // upload?.status: 'asset_created' / 'ready' / 'errored' etc.
    if (!assetId) {
      return res.status(200).json({ assetStatus: upload?.status || 'pending' });
    }

    // 2) Asset lesen
    const ra = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });
    const ja = await ra.json();
    if (!ra.ok) return res.status(400).json({ error: 'mux_asset_fetch_failed', detail: ja });

    const asset = ja?.data;
    const playbackId = asset?.playback_ids?.[0]?.id || null;
    // mp4_url geht über playbackId wenn mp4_support=standard:
    const mp4Url = playbackId ? `https://stream.mux.com/${playbackId}/medium.mp4` : null;

    return res.status(200).json({
      assetStatus: asset?.status || 'ready',
      playbackId,
      mp4Url
    });
  } catch (e) {
    return res.status(500).json({ error: 'mux_asset_exception', message: String(e?.message || e) });
  }
}
