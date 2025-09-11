// /api/mux-asset.js
export default async function handler(req, res) {
  // Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ error: 'Method not allowed. Use GET.', method: req.method || '' });
  }

  try {
    const uploadId = req.query?.uploadId;
    if (!uploadId) return res.status(400).json({ error: 'uploadId required' });

    if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
      return res.status(500).json({ error: 'MUX credentials missing' });
    }

    const auth =
      'Basic ' +
      Buffer.from(
        process.env.MUX_TOKEN_ID + ':' + process.env.MUX_TOKEN_SECRET
      ).toString('base64');

    // Upload nachschlagen
    const upRes = await fetch(
      `https://api.mux.com/video/v1/uploads/${uploadId}`,
      { headers: { Authorization: auth } }
    );
    const upJson = await upRes.json().catch(() => ({}));
    if (!upRes.ok) return res.status(upRes.status).json(upJson);

    const assetId = upJson?.data?.asset_id || null;
    const uploadStatus = upJson?.data?.status || 'unknown';

    let playbackId = null;
    if (assetId) {
      const aRes = await fetch(
        `https://api.mux.com/video/v1/assets/${assetId}`,
        { headers: { Authorization: auth } }
      );
      const aJson = await aRes.json().catch(() => ({}));
      if (!aRes.ok) return res.status(aRes.status).json(aJson);

      playbackId = aJson?.data?.playback_ids?.[0]?.id || null;
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      assetId,
      status: assetId ? 'asset_ready' : uploadStatus,
      playbackId
    });
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ error: String(e) });
  }
}
