// Looks up Upload + Asset in Mux by uploadId and returns playback info

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();

  const uploadId = String(req.query.uploadId || '').trim();
  if (!uploadId) return res.status(400).json({ ok: false, error: 'missing_uploadId' });

  if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    return res.status(500).json({ ok: false, error: 'missing_env' });
  }

  const basic = Buffer.from(`${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`).toString('base64');

  async function muxGet(path) {
    const r = await fetch(`https://api.mux.com${path}`, { headers: { 'Authorization': `Basic ${basic}` } });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw { code: 'mux_http_error', status: r.status, body: j };
    return j?.data;
  }

  try {
    const upload = await muxGet(`/video/v1/uploads/${uploadId}`);
    const status = upload?.status || 'unknown';
    const assetId = upload?.asset_id || null;

    let playbackId = null, mp4Url = null, assetStatus = status;

    if (assetId) {
      const asset = await muxGet(`/video/v1/assets/${assetId}`);
      assetStatus = asset?.status || status;
      playbackId = asset?.playback_ids?.[0]?.id || null;
      if (playbackId) {
        // public playback -> MP4 URL ableitbar
        mp4Url = `https://stream.mux.com/${playbackId}/medium.mp4`;
      }
    }

    return res.status(200).json({ ok: true, assetStatus, playbackId, mp4Url });
  } catch (e) {
    return res.status(400).json({ ok: false, error: 'mux_lookup_failed', detail: e });
  }
}
