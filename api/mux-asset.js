// /api/mux-asset.js
// CLARITY Interview – Mux Upload/Asset Status Endpoint
// Zweck:
// 1. Fragt echte Mux uploadId ab
// 2. Holt daraus assetId
// 3. Holt Asset-Status, playbackId, duration, static renditions
// 4. Gibt stabile Daten für Wix DB + Dashboard zurück

function setCors(req, res) {
  const allowed = (process.env.MUX_CORS_ORIGIN ||
    'https://interview.clarity-nvl.com,https://www.clarity-nvl.com'
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const origin = req.headers.origin || '';
  const allowOrigin = allowed.includes(origin) ? origin : allowed[0];

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');
}

function getMuxAuthHeader() {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;

  if (!tokenId || !tokenSecret) {
    throw new Error('MUX_ENV_MISSING');
  }

  return `Basic ${Buffer.from(`${tokenId}:${tokenSecret}`).toString('base64')}`;
}

async function muxGet(path) {
  const response = await fetch(`https://api.mux.com${path}`, {
    method: 'GET',
    headers: {
      Authorization: getMuxAuthHeader(),
      'Content-Type': 'application/json'
    }
  });

  const text = await response.text();
  let json = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!response.ok) {
    throw new Error(`MUX_GET_FAILED ${path} status=${response.status} body=${text.slice(0, 500)}`);
  }

  return json;
}

function pickPlaybackId(asset) {
  const ids = Array.isArray(asset?.playback_ids) ? asset.playback_ids : [];

  const publicId = ids.find((x) => x.policy === 'public')?.id;
  const firstId = ids[0]?.id;

  return publicId || firstId || null;
}

function buildPlaybackUrl(playbackId) {
  return playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : '';
}

function pickStaticRenditionUrls(playbackId, asset) {
  if (!playbackId) {
    return {
      downloadUrl: '',
      audioOnlyUrl: '',
      staticRenditionsStatus: ''
    };
  }

  const staticData = asset?.static_renditions || {};
  const files = Array.isArray(staticData.files) ? staticData.files : [];
  const staticStatus = staticData.status || '';

  let videoFile = null;
  let audioFile = null;

  for (const file of files) {
    const name = String(file.name || '');
    const type = String(file.type || '');
    const ext = String(file.ext || '');

    if (!videoFile && (type === 'video' || name.endsWith('.mp4') || ext === 'mp4')) {
      videoFile = file;
    }

    if (!audioFile && (type === 'audio' || name.endsWith('.m4a') || ext === 'm4a')) {
      audioFile = file;
    }
  }

  // Standard-Mux-Pfade für static renditions.
  // Falls Mux im Asset bereits konkrete Namen liefert, nutzen wir diese.
  const videoName = videoFile?.name || 'highest.mp4';
  const audioName = audioFile?.name || 'audio.m4a';

  return {
    downloadUrl: `https://stream.mux.com/${playbackId}/${videoName}`,
    audioOnlyUrl: `https://stream.mux.com/${playbackId}/${audioName}`,
    staticRenditionsStatus: staticStatus
  };
}

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'USE_GET' });
  }

  try {
    const uploadId = String(req.query.uploadId || '').trim();

    if (!uploadId) {
      return res.status(400).json({ ok: false, error: 'UPLOAD_ID_REQUIRED' });
    }

    const uploadJson = await muxGet(`/video/v1/uploads/${encodeURIComponent(uploadId)}`);
    const upload = uploadJson?.data || {};

    const assetId = upload.asset_id || null;

    if (!assetId) {
      return res.status(200).json({
        ok: true,
        uploadId,
        uploadStatus: upload.status || 'waiting',
        assetStatus: 'waiting',
        assetId: null,
        playbackId: null,
        playbackUrl: '',
        downloadUrl: '',
        audioOnlyUrl: '',
        durationSec: null,
        message: 'Mux upload exists, but no asset has been created yet.'
      });
    }

    const assetJson = await muxGet(`/video/v1/assets/${encodeURIComponent(assetId)}`);
    const asset = assetJson?.data || {};

    const playbackId = pickPlaybackId(asset);
    const playbackUrl = buildPlaybackUrl(playbackId);
    const staticUrls = pickStaticRenditionUrls(playbackId, asset);

    const normalizedStatus =
      asset.status === 'ready'
        ? 'ready'
        : asset.status === 'errored'
          ? 'errored'
          : 'processing';

    return res.status(200).json({
      ok: true,
      provider: 'mux',
      uploadId,
      uploadStatus: upload.status || '',
      assetId,
      assetStatus: normalizedStatus,
      rawAssetStatus: asset.status || '',
      playbackId,
      playbackUrl,
      downloadUrl: normalizedStatus === 'ready' ? staticUrls.downloadUrl : '',
      audioOnlyUrl: normalizedStatus === 'ready' ? staticUrls.audioOnlyUrl : '',
      staticRenditionsStatus: staticUrls.staticRenditionsStatus,
      durationSec: asset.duration ? Number(asset.duration) : null,
      createdAt: asset.created_at || null,
      passthrough: asset.passthrough || ''
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'MUX_ASSET_LOOKUP_ERROR',
      message: String(error?.message || error)
    });
  }
};
