// api/mux-asset.js
// Liest zu einer uploadId den Upload-Status UND – wenn schon vorhanden –
// den zugehörigen Asset-Status inkl. playbackId aus.

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const { uploadId } = req.query || {};
    if (!uploadId) return res.status(400).json({ error: 'uploadId required' });

    const auth =
      'Basic ' +
      Buffer.from(
        (process.env.MUX_TOKEN_ID || '') + ':' + (process.env.MUX_TOKEN_SECRET || '')
      ).toString('base64');

    // 1) Upload abfragen
    const upRes = await fetch(`https://api.mux.com/video/v1/uploads/${uploadId}`, {
      method: 'GET',
      headers: { 'Authorization': auth }
    });
    const upJson = await upRes.json();
    if (!upRes.ok) return res.status(upRes.status).json(upJson);

    const uploadStatus = upJson?.data?.status || 'unknown';
    const assetId = upJson?.data?.asset_id || null;

    let assetStatus = null;
    let playbackId = null;

    // 2) Falls schon ein Asset existiert → Asset-Details holen
    if (assetId) {
      const aRes = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
        method: 'GET',
        headers: { 'Authorization': auth }
      });
      const aJson = await aRes.json();
      if (aRes.ok) {
        assetStatus = aJson?.data?.status || 'unknown';
        playbackId = aJson?.data?.playback_ids?.[0]?.id || null;
      } else {
        // Fehler beim Asset-Lookup trotzdem rückmelden – hilft beim Debugging im Frontend
        return res.status(aRes.status).json(aJson);
      }
    }

    return res.status(200).json({
      uploadId,
      uploadStatus,   // z.B. "asset_created" | "waiting" ...
      assetId,        // kann null sein, wenn Mux noch kein Asset angelegt hat
      assetStatus,    // z.B. "ready" | "preparing" | null
      playbackId      // vorhanden, sobald Asset "ready" und public
    });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
