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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { uploadId = '' } = req.query || {};
  if (!uploadId) return res.status(400).json({ error: 'missing_uploadId' });

  const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
  if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
    return res.status(500).json({ error: 'mux_env_missing' });
  }
  const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64');

  try {
    // Upload-Status abfragen
    const ru = await fetch(`https://api.mux.com/video/v1/uploads/${encodeURIComponent(uploadId)}`, {
      headers: { Authorization: `Basic ${auth}` }
    });
    const ju = await ru.json();

    const assetId = ju?.data?.asset_id || null;
    if (!assetId) {
      return res.status(200).json({ assetStatus: 'waiting', upload: ju?.data || null });
    }

    // Asset-Status abfragen
    const ra = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
      headers: { Authorization: `Basic ${auth}` }
    });
    const ja = await ra.json();

    const status = ja?.data?.status || 'unknown';
    const playbackId = ja?.data?.playback_ids?.[0]?.id || null;

    return res.status(200).json({
      assetStatus: status,
      playbackId
      // Für HLS: https://stream.mux.com/${playbackId}.m3u8
    });
  } catch (e) {
    return res.status(500).json({ error: 'mux_asset_lookup_failed', message: String(e) });
  }
}
