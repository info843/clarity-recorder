'use strict';

const {
  enforceRateLimit, mediaSecurityMode, publicError, requireUniversalClaims, requireUploadTicket,
  safeString, setSecurityHeaders, traceId
} = require('./_clarity-security');
const VERSION = '1.4.2-mux-contract-and-diagnostics';

function getMuxAuthHeader() {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  if (!tokenId || !tokenSecret) {
    throw Object.assign(new Error('MUX_ENV_MISSING'), { code:'MUX_ENV_MISSING', status:503 });
  }
  return `Basic ${Buffer.from(`${tokenId}:${tokenSecret}`).toString('base64')}`;
}

async function muxGet(path) {
  let response;
  try {
    response = await fetch(`https://api.mux.com${path}`, {
      method:'GET', headers:{ Authorization:getMuxAuthHeader(), 'Content-Type':'application/json' }
    });
  } catch (_) {
    throw Object.assign(new Error('MUX_API_TRANSPORT_FAILED'), {
      code:'MUX_API_TRANSPORT_FAILED', status:502, providerStatus:null
    });
  }
  const raw = await response.text();
  let json = null;
  try { json = raw ? JSON.parse(raw) : null; } catch (_) {}
  if (!response.ok) {
    const providerStatus = Number(response.status) || 0;
    const code = providerStatus === 400 ? 'MUX_API_REQUEST_INVALID'
      : providerStatus === 401 ? 'MUX_API_CREDENTIALS_INVALID'
      : providerStatus === 403 ? 'MUX_API_CREDENTIALS_FORBIDDEN'
      : providerStatus === 404 ? 'MUX_UPLOAD_NOT_FOUND'
      : providerStatus === 429 ? 'MUX_API_RATE_LIMITED'
      : providerStatus >= 500 ? 'MUX_API_UNAVAILABLE'
      : 'MUX_LOOKUP_FAILED';
    throw Object.assign(new Error('MUX_LOOKUP_FAILED'), {
      code,
      status:providerStatus === 404 ? 404
        : providerStatus === 429 ? 429
        : [401,403].includes(providerStatus) || providerStatus >= 500 ? 503
        : 502,
      providerStatus
    });
  }
  return json;
}

function requestBody(req) {
  if (req?.body && typeof req.body === 'object') return req.body;
  if (typeof req?.body !== 'string') return {};
  try { return JSON.parse(req.body); } catch (_) { return {}; }
}

function requestUploadId(req) {
  return safeString(req?.query?.uploadId || requestBody(req).uploadId, 240);
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
  const expectedPolicy = mediaSecurityMode() === 'standard' ? 'public' : 'signed';
  const selected = ids.find((item) => item?.policy === expectedPolicy);
  return { id:selected?.id || null, policy:expectedPolicy };
}

module.exports = async function handler(req, res) {
  const trace = traceId();
  const originAllowed = setSecurityHeaders(req, res, 'GET,POST');
  if (req.method === 'OPTIONS') return originAllowed ? res.status(204).end() : res.status(403).end();
  if (!originAllowed) return res.status(403).json({ ok:false, error:'ORIGIN_NOT_ALLOWED', traceId:trace });
  if (!['GET','POST'].includes(req.method)) {
    return res.status(405).json({ ok:false, error:'USE_GET_OR_POST', traceId:trace });
  }
  try {
    const claims = requireUniversalClaims(req);
    const uploadId = requestUploadId(req);
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
      securityMode:playback.policy === 'public' ? 'standard' : 'signed',
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
