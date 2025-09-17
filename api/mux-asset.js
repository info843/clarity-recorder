// Erlaubte Origins (wie bei mux-upload):
const ALLOWED_APP_ORIGINS = [
  'https://interview.clarity-nvl.com',
  'https://clarity-recorder.vercel.app',
  'https://www.clarity-nvl.com',
  'https://clarity-nvl.com'
];

function getOrigin(req) {
  const o = req.headers?.origin || '';
  if (o) return o;
  const r = req.headers?.referer || '';
  try { return r ? new URL(r).origin : ''; } catch { return ''; }
}

function setCors(req, res) {
  const origin = getOrigin(req);
  if (ALLOWED_APP_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
}

function muxAuthHeader() {
  const id = process.env.MUX_TOKEN_ID;
  const sec = process.env.MUX_TOKEN_SECRET;
  if (!id || !sec) return null;
  return 'Basic ' + Buffer.from(id + ':' + sec).toString('base64');
}

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const uploadId = (req.query?.uploadId || '').toString().trim();
    if (!uploadId) {
      return res.status(400).json({ error: 'uploadId required' });
    }

    const auth = muxAuthHeader();
    if (!auth) {
      return res.status(500).json({ error: 'MUX credentials missing' });
    }

    // 1) Upload lesen
    const upRes = await fetch(`https://api.mux.com/video/v1/uploads/${uploadId}`, {
      headers: { Authorization: auth }
    });
    const upJson = await upRes.json().catch(() => ({}));

    if (!upRes.ok) {
      return res.status(upRes.status).json({
        error: 'mux-upload-fetch-failed',
        details: upJson
      });
    }

    const uploadStatus = upJson?.data?.status || 'unknown';
    const assetId = upJson?.data?.asset_id || null;

    // 2) Falls Asset da ist → Asset/Playback holen
    let assetStatus = null;
    let playbackId = null;

    if (assetId) {
      const asRes = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
        headers: { Authorization: auth }
      });
      const asJson = await asRes.json().catch(() => ({}));

      if (!asRes.ok) {
        return res.status(asRes.status).json({
          error: 'mux-asset-fetch-failed',
          details: asJson
        });
      }

      assetStatus = asJson?.data?.status || null;
      const p = asJson?.data?.playback_ids?.[0]?.id || null;
      playbackId = p || null;
    }

    return res.status(200).json({
      ok: true,
      uploadId,
      uploadStatus,        // e.g. "asset_created" | "ready" | ...
      assetId,             // kann null sein, bis Mux fertig ist
      assetStatus,         // e.g. "ready" | "preparing" | null
      playbackId,          // z.B. "abcd1234…"
      playbackUrl: playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : null
    });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
