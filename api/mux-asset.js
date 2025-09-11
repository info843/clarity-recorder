// api/mux-asset.js
export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).end();

    const { uploadId } = req.query || {};
    if (!uploadId) return res.status(400).json({ error: 'uploadId required' });

    const auth =
      'Basic ' +
      Buffer.from(
        (process.env.MUX_TOKEN_ID || '') + ':' + (process.env.MUX_TOKEN_SECRET || '')
      ).toString('base64');

    // 1) Upload nachschlagen -> asset_id / status holen
    const upRes = await fetch(`https://api.mux.com/video/v1/uploads/${uploadId}`, {
      headers: { Authorization: auth }
    });
    const upJson = await upRes.json();
    if (!upRes.ok) return res.status(upRes.status).json(upJson);

    const assetId = upJson?.data?.asset_id || null;
    const uploadStatus = upJson?.data?.status || 'unknown';

    // Asset noch nicht verknüpft -> wir können (noch) nichts abspielen
    if (!assetId) {
      return res.status(200).json({ status: uploadStatus, assetReady: false });
    }

    // 2) Asset nachschlagen -> status + playback_ids
    const asRes = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
      headers: { Authorization: auth }
    });
    const asJson = await asRes.json();
    if (!asRes.ok) return res.status(asRes.status).json(asJson);

    const playbackId = asJson?.data?.playback_ids?.[0]?.id || null;
    const assetStatus = asJson?.data?.status || 'unknown';

    return res.status(200).json({
      status: assetStatus,
      assetReady: assetStatus === 'ready',
      assetId,
      playbackId
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
