'use strict';

const {
  enforceRateLimit, publicError, requireUniversalClaims, requireUploadTicket,
  safeString, setSecurityHeaders, traceId
} = require('./_clarity-security');
const VERSION = '1.2.0-signed-playback-status';

function getMuxAuthHeader() {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  if (!tokenId || !tokenSecret) {
    throw Object.assign(new Error('MUX_ENV_MISSING'), { code:'MUX_ENV_MISSING', status:503 });
  }
  return `Basic ${Buffer.from(`${tokenId}:${tokenSecret}`).toString('base64')}`;
}

async function muxGet(path) {
  const response = await fetch(`https://api.mux.com${path}`, {
    method:'GET', headers:{ Authorization:getMuxAuthHeader(), 'Content-Type':'application/json' }
  });
  const raw = await response.text();
  let json = null;
  try { json = raw ? JSON.parse(raw) : null; } catch (_) {}
  if (!response.ok) {
    throw Object.assign(new Error('MUX_LOOKUP_FAILED'), {
      code:response.status === 404 ? 'MUX_UPLOAD_NOT_FOUND' : 'MUX_LOOKUP_FAILED',
      status:response.status === 404 ? 404 : 502,
      providerStatus:response.status
    });
  }
  return json;
}

function passthroughObject(value) {
  try { return value ? JSON.parse(value) : {}; } catch (_) { return {}; }
}

function assertMuxOwnership(value, claims) {
  const pt = passthroughObject(value);
  if (!pt.uid || !pt.companyId || !pt.runtimeAccessId ||
      safeString(pt.uid, 240) !== claims.uid ||
      safeString(pt.companyId, 180) !== claims.companyId ||
      safeString(pt.runtimeAccessId, 240) !== claims.runtimeAccessId ||
      safeString(pt.sessionId, 240) !== claims.runtimeAccessId) {
    throw Object.assign(new Error('MUX_OBJECT_FORBIDDEN'), { code:'MUX_OBJECT_FORBIDDEN', status:403 });
  }
}

function authorizedPlaybackId(asset) {
  const ids = Array.isArray(asset?.playback_ids) ? asset.playback_ids : [];
  const expectedPolicy = process.env.CLARITY_MUX_ENFORCE_SIGNED_PLAYBACK === '0' ? 'public' : 'signed';
  const selected = ids.find((item) => item?.policy === expectedPolicy);
  return { id:selected?.id || null, policy:expectedPolicy };
}

module.exports = async function handler(req, res) {
  const trace = traceId();
  const originAllowed = setSecurityHeaders(req, res, 'GET');
  if (req.method === 'OPTIONS') return originAllowed ? res.status(204).end() : res.status(403).end();
  if (!originAllowed) return res.status(403).json({ ok:false, error:'ORIGIN_NOT_ALLOWED', traceId:trace });
  if (req.method !== 'GET') return res.status(405).json({ ok:false, error:'USE_GET', traceId:trace });
  try {
    const claims = requireUniversalClaims(req);
    const uploadId = safeString(req.query?.uploadId, 240);
    if (!uploadId) throw Object.assign(new Error('UPLOAD_ID_REQUIRED'), { code:'UPLOAD_ID_REQUIRED', status:400 });
    requireUploadTicket(req, claims, uploadId);
    enforceRateLimit(`mux-status:${claims.runtimeAccessId}`, 180, 15 * 60 * 1000);
    const uploadJson = await muxGet(`/video/v1/uploads/${encodeURIComponent(uploadId)}`);
    const upload = uploadJson?.data || {};
    const assetId = safeString(upload.asset_id, 240) || null;
    if (!assetId) {
      return res.status(200).json({
        ok:true, provider:'mux', uploadId, uploadStatus:upload.status || 'waiting',
        assetStatus:'waiting', assetId:null, playbackId:null, durationSec:null, version:VERSION, traceId:trace
      });
    }
    const assetJson = await muxGet(`/video/v1/assets/${encodeURIComponent(assetId)}`);
    const asset = assetJson?.data || {};
    assertMuxOwnership(asset.passthrough, claims);
    const playback = authorizedPlaybackId(asset);
    const playbackId = playback.id;
    const assetStatus = asset.status === 'ready' ? 'ready' : asset.status === 'errored' ? 'errored' : 'processing';
    if (assetStatus === 'ready' && !playbackId) {
      throw Object.assign(new Error('AUTHORIZED_PLAYBACK_ID_MISSING'), { code:'AUTHORIZED_PLAYBACK_ID_MISSING', status:502 });
    }
    return res.status(200).json({
      ok:true, provider:'mux', uploadId, uploadStatus:upload.status || '', assetId,
      assetStatus, playbackId, playbackPolicy:playback.policy,
      durationSec:Number.isFinite(Number(asset.duration)) ? Number(asset.duration) : null,
      staticRenditionsStatus:safeString(asset?.static_renditions?.status, 80), version:VERSION, traceId:trace
    });
  } catch (error) {
    console.error('[CLARITY MEDIA SECURITY] mux status rejected', {
      traceId:trace, code:safeString(error?.code || 'MUX_ASSET_LOOKUP_ERROR', 120),
      providerStatus:Number(error?.providerStatus) || null
    });
    return publicError(res, error, 'MUX_ASSET_LOOKUP_ERROR', trace);
  }
};
