// api/mux-asset.js
// GET /api/mux-asset?uploadId=...

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).end();

    if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
      return res.status(500).json({ error: 'MUX credentials missing' });
    }

    const { uploadId } = req.query || {};
    if (!uploadId) return res.status(400).json({ error: 'uploadId required' });

    const auth =
      'Basic ' +
      Buffer.from(process.env.MUX_TOKEN_ID + ':' + process.env.MUX_TOKEN_SECRET)
        .toString('base64');

    // 1) Upload nachschlagen
    const upRes = await fetch(`https://api.mux.com/video/v1/uploads/${uploadId}`, {
      headers: { Authorization: auth }
    });
    const upJson = await upRes.json();
    if (!upRes.ok) return res.status(upRes.status).json(upJson);

    const assetId = upJson?.data?.asset_id || null;
    const uploadStatus = upJson?.data?.status || 'unknown';

    // 2) Wenn noch kein Asset, liefern wir den Upload-Status zurück
    if (!assetId) {
      return res.status(200).json({ assetId: null, status: uploadStatus, playbackId: null });
    }

    // 3) Asset nachschlagen
    const asRes = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
      headers: { Authorization: auth }
    });
    const asJson = await asRes.json();
    if (!asRes.ok) return res.status(asRes.status).json(asJson);

    const status = asJson?.data?.status || 'unknown';
    const playbackId = (asJson?.data?.playback_ids || [])[0]?.id || null;

    return res.status(200).json({ assetId, status, playbackId });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
