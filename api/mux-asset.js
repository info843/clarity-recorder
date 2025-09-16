// /api/mux-asset.js — prüft Upload->Asset und liefert Playback ID
export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const ALLOW = new Set([
    'https://interview.clarity-nvl.com',
    'https://clarity-recorder.vercel.app',
    'https://www.clarity-nvl.com'
  ]);
  const allowOrigin = ALLOW.has(origin) ? origin : 'https://interview.clarity-nvl.com';
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const ID = process.env.MUX_TOKEN_ID;
  const SECRET = process.env.MUX_TOKEN_SECRET;
  if (!ID || !SECRET) {
    return res.status(500).json({ ok:false, error_code:'env_missing' });
  }
  const auth = 'Basic ' + Buffer.from(`${ID}:${SECRET}`).toString('base64');

  const uploadId = String((req.query.uploadId || '')).trim();
  if (!uploadId) return res.status(400).json({ ok:false, error_code:'bad_params' });

  try {
    // 1) Upload-Status
    const upRes = await fetch(`https://api.mux.com/video/v1/uploads/${encodeURIComponent(uploadId)}`, {
      headers: { 'Authorization': auth }
    });
    const upJson = await upRes.json();
    const assetId = upJson?.data?.asset_id || null;

    if (!assetId) {
      return res.status(200).json({
        ok:true, assetStatus: upJson?.data?.status || 'preparing', playbackId:null, mp4Url:null
      });
    }

    // 2) Asset-Details
    const asRes = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
      headers: { 'Authorization': auth }
    });
    const asJson = await asRes.json();

    const playbackId = (asJson?.data?.playback_ids?.[0]?.id) || null;
    const status = asJson?.data?.status || 'preparing';

    return res.status(200).json({
      ok:true,
      assetStatus: status,
      playbackId,
      // HLS-Preview (Player nimmt eh die Blob-URL oder HLS):
      hls: playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : null,
      mp4Url: null // (MP4-Direct gibt Mux nur über separate Files API / static renditions; optional)
    });
  } catch (err) {
    return res.status(500).json({ ok:false, error_code:'mux_asset_exception', message:String(err?.message||err) });
  }
}
