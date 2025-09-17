const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
const Mux = require('@mux/mux-node');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // bei Bedarf auf https://www.clarity-nvl.com einschränken
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')  return res.status(405).json({ error: 'method_not_allowed' });

  if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
    return res.status(500).json({ error: 'mux_env_missing' });
  }

  try {
    const mux = new Mux({ tokenId: MUX_TOKEN_ID, tokenSecret: MUX_TOKEN_SECRET });

    const upload = await mux.video.uploads.create({
      new_asset_settings: { playback_policy: ['public'], video_quality: 'basic' },
      cors_origin: '*',
      test: false
    });

    return res.status(200).json({ uploadUrl: upload.url, uploadId: upload.id });
  } catch (e) {
    return res.status(500).json({ error: 'mux_create_failed', detail: e?.message || String(e) });
  }
};
