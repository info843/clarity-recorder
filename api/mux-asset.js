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
  if (req.method !== 'GET') return res.status(405).json({ ok:false, error_code:'method_not_allowed' });

  const ID = process.env.MUX_TOKEN_ID;
  const SECRET = process.env.MUX_TOKEN_SECRET;
  if (!ID || !SECRET) {
    return res.status(500).json({ ok:false, error_code:'env_missing' });
  }
  const auth = 'Basic ' + Buffer.from(`${ID}:${SECRET}`).toString('base64');

  const uploadId = String(req.query.uploadId || '').trim();
  if (!uploadId) return res.status(400).json({ ok:false, error_code:'missing_uploadId' });

  try {
    // Upload abfragen
    const upRes = await fetch(`https://api.mux.com/video/v1/uploads/${encodeURIComponent(uploadId)}`, {
      headers: { 'Authorization': auth, 'Accept':'application/json' }
    });
    const upJson = await upRes.json().catch(()=> ({}));

    const assetId = upJson?.data?.asset_id || null;
    if (!assetId) {
      return res.status(200).json({ ok:true, assetStatus: upJson?.data?.status || 'waiting', playbackId:null, mp4Url:null });
    }

    // Asset abfragen
    const asRes = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
      headers: { 'Authorization': auth, 'Accept':'application/json' }
    });
    const asJson = await asRes.json().catch(()=> ({}));
    const playbackId = (asJson?.data?.playback_ids?.[0]?.id) || null;

    let mp4Url = null;
    if (playbackId) {
      // Direktlink; für echte Produktion evtl. über signed URLs nachdenken
      mp4Url = `https://stream.mux.com/${playbackId}/medium.mp4`;
    }

    return res.status(200).json({
      ok:true,
      assetStatus: asJson?.data?.status || 'unknown',
      playbackId,
      mp4Url
    });
  } catch (e) {
    return res.status(500).json({ ok:false, error_code:'mux_query_exception', message:String(e?.message||e) });
  }
}
