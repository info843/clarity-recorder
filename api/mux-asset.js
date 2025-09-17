const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
const Mux = require('@mux/mux-node');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const uploadId = (req.query && (req.query.uploadId || req.query.uploadid)) || '';
  if (!uploadId) return res.status(400).json({ error: 'missing_uploadId' });

  try {
    const mux = new Mux({ tokenId: MUX_TOKEN_ID, tokenSecret: MUX_TOKEN_SECRET });

    const upload = await mux.video.uploads.retrieve(uploadId);
    if (!upload?.asset_id) {
      return res.status(200).json({ assetStatus: upload?.status || 'waiting' });
    }

    const asset = await mux.video.assets.retrieve(upload.asset_id);
    const playbackId = asset?.playback_ids?.[0]?.id || null;
    const mp4Url = playbackId ? `https://stream.mux.com/${playbackId}/medium.mp4` : null;

    return res.status(200).json({
      assetStatus: asset?.status || 'unknown',
      playbackId,
      mp4Url
    });
  } catch (e) {
    return res.status(500).json({ error: 'mux_asset_failed', detail: e?.message || String(e) });
  }
};
