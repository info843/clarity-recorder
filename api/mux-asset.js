// api/mux-asset.js
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const { uploadId } = req.query || {};
    if (!uploadId) return res.status(400).json({ error: 'uploadId required' });

    const auth =
      'Basic ' +
      Buffer.from(
        process.env.MUX_TOKEN_ID + ':' + process.env.MUX_TOKEN_SECRET
      ).toString('base64');

    // 1) Upload nachschlagen
    const upRes = await fetch(`https://api.mux.com/video/v1/uploads/${uploadId}`, {
      headers: { Authorization: auth }
    });
    const upJson = await upRes.json();
    if (!upRes.ok) return res.status(upRes.status).json(upJson);

    const assetId = upJson?.data?.asset_id || null;          // kann noch null sein
    const uploadStatus = upJson?.data?.status || 'unknown';  // 'asset_created' | 'ready' | ...

    // 2) Asset (falls vorhanden) nachschlagen
    let playbackId = null;
    let assetStatus = 'processing';
    if (assetId) {
      const aRes = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
        headers: { Authorization: auth }
      });
      const aJson = await aRes.json();
      if (!aRes.ok) return res.status(aRes.status).json(aJson);

      assetStatus = aJson?.data?.status || 'unknown';        // 'ready' wenn fertig
      playbackId = aJson?.data?.playback_ids?.[0]?.id || null;
    }

    return res.status(200).json({
      uploadId,
      uploadStatus,
      assetId,
      assetStatus,
      playbackId
    });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
