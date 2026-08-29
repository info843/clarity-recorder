'use strict';

const crypto = require('crypto');

const TOKEN_AUDIENCE = 'clarity-universal-app';
const TOKEN_ISSUER = 'clarity-nvl';
const UPLOAD_TICKET_TTL_SECONDS = 3 * 60 * 60;
const buckets = new Map();

function safeString(value, max = 500) {
  return String(value ?? '').trim().slice(0, max);
}

function base64UrlDecode(value) {
  const raw = safeString(value, 20000).replace(/-/g, '+').replace(/_/g, '/');
  const padded = raw + '='.repeat((4 - (raw.length % 4)) % 4);
  return Buffer.from(padded, 'base64');
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64url');
}

function timingSafeTextEqual(left, right) {
  const a = Buffer.from(String(left || ''), 'utf8');
  const b = Buffer.from(String(right || ''), 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function bearerToken(req) {
  const raw = safeString(req?.headers?.authorization || req?.headers?.Authorization, 12000);
  const match = raw.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

function universalSecret() {
  const secret = safeString(process.env.CLARITY_UNIVERSAL_SESSION_SECRET, 4000);
  if (secret.length < 32) throw securityError('MEDIA_AUTH_CONFIGURATION_MISSING', 503);
  return secret;
}

function mediaTicketSecret() {
  const secret = safeString(process.env.CLARITY_MEDIA_TICKET_SECRET, 4000) || universalSecret();
  if (secret.length < 32) throw securityError('MEDIA_TICKET_CONFIGURATION_MISSING', 503);
  return secret;
}

function securityError(code, status = 401) {
  const error = new Error(code);
  error.code = code;
  error.status = status;
  return error;
}

function verifyHmacJwt(token, secret, expected = {}) {
  const parts = safeString(token, 20000).split('.');
  if (parts.length !== 3) throw securityError('TOKEN_INVALID');
  let header;
  let claims;
  try {
    header = JSON.parse(base64UrlDecode(parts[0]).toString('utf8'));
    claims = JSON.parse(base64UrlDecode(parts[1]).toString('utf8'));
  } catch (_) {
    throw securityError('TOKEN_INVALID');
  }
  if (header?.alg !== 'HS256' || header?.typ && header.typ !== 'JWT') {
    throw securityError('TOKEN_ALGORITHM_INVALID');
  }
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${parts[0]}.${parts[1]}`)
    .digest('base64url');
  if (!timingSafeTextEqual(parts[2], expectedSignature)) throw securityError('TOKEN_SIGNATURE_INVALID');
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(Number(claims?.exp)) || Number(claims.exp) <= now - 30) throw securityError('TOKEN_EXPIRED');
  if (Number.isFinite(Number(claims?.nbf)) && Number(claims.nbf) > now + 30) throw securityError('TOKEN_NOT_ACTIVE');
  if (expected.audience && claims?.aud !== expected.audience) throw securityError('TOKEN_AUDIENCE_INVALID');
  if (expected.issuer && claims?.iss !== expected.issuer) throw securityError('TOKEN_ISSUER_INVALID');
  if (expected.scope && claims?.scope !== expected.scope) throw securityError('TOKEN_SCOPE_INVALID');
  return claims;
}

function requireUniversalClaims(req) {
  const token = bearerToken(req);
  if (!token) throw securityError('MEDIA_AUTH_REQUIRED');
  const claims = verifyHmacJwt(token, universalSecret(), {
    audience: TOKEN_AUDIENCE,
    issuer: TOKEN_ISSUER,
    scope: 'clarity_universal_app'
  });
  const normalized = {
    uid: safeString(claims.uid, 240),
    companyId: safeString(claims.companyId, 180),
    runtimeAccessId: safeString(claims.runtimeAccessId, 240),
    unifiedLinkId: safeString(claims.unifiedLinkId, 240),
    productKey: safeString(claims.productKey, 80),
    nonce: safeString(claims.nonce, 500)
  };
  if (!normalized.uid || !normalized.companyId || !normalized.runtimeAccessId || !normalized.nonce) {
    throw securityError('MEDIA_AUTH_CLAIMS_INCOMPLETE');
  }
  return normalized;
}

function signUploadTicket(payload) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify({
    scope: 'clarity_mux_upload',
    uploadId: safeString(payload.uploadId, 240),
    uid: safeString(payload.uid, 240),
    companyId: safeString(payload.companyId, 180),
    runtimeAccessId: safeString(payload.runtimeAccessId, 240),
    mode: safeString(payload.mode, 40),
    iat: now,
    exp: now + UPLOAD_TICKET_TTL_SECONDS
  }));
  const signature = crypto.createHmac('sha256', mediaTicketSecret()).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function requireUploadTicket(req, claims, uploadId) {
  const ticket = safeString(
    req?.headers?.['x-clarity-upload-ticket'] || req?.headers?.['X-Clarity-Upload-Ticket'],
    12000
  );
  if (!ticket) throw securityError('UPLOAD_TICKET_REQUIRED');
  const ticketClaims = verifyHmacJwt(ticket, mediaTicketSecret(), { scope: 'clarity_mux_upload' });
  const checks = [
    [ticketClaims.uploadId, uploadId],
    [ticketClaims.uid, claims.uid],
    [ticketClaims.companyId, claims.companyId],
    [ticketClaims.runtimeAccessId, claims.runtimeAccessId]
  ];
  if (checks.some(([left, right]) => safeString(left, 500) !== safeString(right, 500))) {
    throw securityError('UPLOAD_TICKET_MISMATCH', 403);
  }
  return ticketClaims;
}

function allowedOrigins() {
  return (process.env.MUX_CORS_ORIGIN ||
    'https://interview.clarity-nvl.com,https://www.clarity-nvl.com')
    .split(',')
    .map((value) => value.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

function setSecurityHeaders(req, res, methods) {
  const origin = safeString(req?.headers?.origin, 500).replace(/\/+$/, '');
  const allowed = allowedOrigins();
  if (origin && allowed.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', `${methods},OPTIONS`);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Clarity-Upload-Ticket');
  res.setHeader('Access-Control-Max-Age', '600');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Vary', 'Origin');
  return !origin || allowed.includes(origin);
}

function traceId() {
  return `SEC-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
}

function enforceRateLimit(key, limit, windowMs) {
  const now = Date.now();
  const bucketKey = safeString(key, 1000);
  const previous = buckets.get(bucketKey);
  const current = !previous || previous.resetAt <= now
    ? { count: 0, resetAt: now + windowMs }
    : previous;
  current.count += 1;
  buckets.set(bucketKey, current);
  if (buckets.size > 5000) {
    for (const [entryKey, entry] of buckets) if (entry.resetAt <= now) buckets.delete(entryKey);
  }
  if (current.count > limit) {
    const error = securityError('RATE_LIMITED', 429);
    error.retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    throw error;
  }
  return current;
}

function publicError(res, error, fallbackCode, trace) {
  const status = Number(error?.status) || 500;
  if (error?.retryAfter) res.setHeader('Retry-After', String(error.retryAfter));
  return res.status(status).json({
    ok: false,
    error: safeString(error?.code || fallbackCode, 120),
    message: status >= 500 ? 'The secure media service is temporarily unavailable.' : 'The media request could not be authorized.',
    retryable: status === 429 || status >= 500,
    traceId: trace
  });
}

module.exports = {
  enforceRateLimit,
  publicError,
  requireUniversalClaims,
  requireUploadTicket,
  safeString,
  setSecurityHeaders,
  signUploadTicket,
  traceId
};
