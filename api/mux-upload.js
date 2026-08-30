'use strict';

const {
  enforceRateLimit, publicError, requireUniversalClaims, safeString,
  setSecurityHeaders, signUploadTicket, traceId
} = require('./_clarity-security');

const ALLOWED_MODES = new Set(['audio', 'video', 'mix']);
const VERSION = '1.2.0-dynamic-origin-signed-playback';

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > 32 * 1024) {
      const error = Object.assign(new Error('REQUEST_TOO_LARGE'), { code:'REQUEST_TOO_LARGE', status:413 });
      throw error;
    }
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); }
  catch (_) { throw Object.assign(new Error('INVALID_JSON'), { code:'INVALID_JSON', status:400 }); }
}

function buildPassthrough({ claims, mode }) {
  return JSON.stringify({
    uid: claims.uid,
    companyId: claims.companyId,
    runtimeAccessId: claims.runtimeAccessId,
    unifiedLinkId: claims.unifiedLinkId,
    productKey: claims.productKey,
    sessionId: claims.runtimeAccessId,
    mode,
    source: 'clarity-universal-app-v2'
  });
}

async function createMuxDirectUpload({ claims, mode, corsOrigin }) {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  if (!tokenId || !tokenSecret) {
    throw Object.assign(new Error('MUX_ENV_MISSING'), { code:'MUX_ENV_MISSING', status:503 });
  }
  const auth = Buffer.from(`${tokenId}:${tokenSecret}`).toString('base64');
  const uploadOrigin = safeString(corsOrigin || process.env.MUX_UPLOAD_CORS_ORIGIN || 'https://interview.clarity-nvl.com', 500).replace(/\/+$/, '');
  // Production is secure by default. Public playback remains available only as
  // an explicit, temporary rollback setting.
  const playbackPolicy = process.env.CLARITY_MUX_ENFORCE_SIGNED_PLAYBACK === '0' ? 'public' : 'signed';
  const response = await fetch('https://api.mux.com/video/v1/uploads', {
    method: 'POST',
    headers: { Authorization:`Basic ${auth}`, 'Content-Type':'application/json' },
    body: JSON.stringify({
      cors_origin: uploadOrigin,
      timeout: 3600,
      new_asset_settings: {
        playback_policies: [playbackPolicy],
        passthrough: buildPassthrough({ claims, mode }),
        video_quality: 'basic',
        static_renditions: [{ resolution:'highest' }, { resolution:'audio-only' }]
      }
    })
  });
  const raw = await response.text();
  let json = null;
  try { json = raw ? JSON.parse(raw) : null; } catch (_) {}
  if (!response.ok || !json?.data?.url || !json?.data?.id) {
    throw Object.assign(new Error('MUX_CREATE_UPLOAD_FAILED'), {
      code:'MUX_CREATE_UPLOAD_FAILED', status:502, providerStatus:response.status
    });
  }
  return {
    uploadId:json.data.id, uploadUrl:json.data.url,
    status:json.data.status || 'waiting', timeout:json.data.timeout || null, playbackPolicy
  };
}

module.exports = async function handler(req, res) {
  const trace = traceId();
  const originAllowed = setSecurityHeaders(req, res, 'POST');
  if (req.method === 'OPTIONS') return originAllowed ? res.status(204).end() : res.status(403).end();
  if (!originAllowed) return res.status(403).json({ ok:false, error:'ORIGIN_NOT_ALLOWED', traceId:trace });
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'USE_POST', traceId:trace });
  try {
    const claims = requireUniversalClaims(req);
    const body = await readJson(req);
    const mode = safeString(body.mode || 'video', 40).toLowerCase();
    if (!ALLOWED_MODES.has(mode)) {
      throw Object.assign(new Error('MODE_INVALID'), { code:'MODE_INVALID', status:400 });
    }
    enforceRateLimit(`mux-upload:${claims.runtimeAccessId}`, 6, 15 * 60 * 1000);
    const requestOrigin = safeString(req?.headers?.origin || req?.headers?.Origin, 500).replace(/\/+$/, '');
    const mux = await createMuxDirectUpload({ claims, mode, corsOrigin:requestOrigin });
    const uploadTicket = signUploadTicket({ ...claims, uploadId:mux.uploadId, mode });
    return res.status(200).json({
      ok:true, provider:'mux', uploadId:mux.uploadId, uploadUrl:mux.uploadUrl,
      uploadTicket, uploadStatus:mux.status, timeout:mux.timeout,
      playbackPolicy:mux.playbackPolicy, version:VERSION, traceId:trace
    });
  } catch (error) {
    console.error('[CLARITY MEDIA SECURITY] mux upload rejected', {
      traceId:trace, code:safeString(error?.code || 'MUX_UPLOAD_CREATE_ERROR', 120),
      providerStatus:Number(error?.providerStatus) || null
    });
    return publicError(res, error, 'MUX_UPLOAD_CREATE_ERROR', trace);
  }
};
