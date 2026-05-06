// /api/mux-upload.js
// CLARITY Interview – Mux Direct Upload Endpoint

function pickOrigin(req) {
  const allowed = (process.env.MUX_CORS_ORIGIN ||
    'https://interview.clarity-nvl.com,https://www.clarity-nvl.com'
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const origin = req.headers.origin || '';
  return allowed.includes(origin) ? origin : allowed[0];
}

function setCors(req, res) {
  const origin = pickOrigin(req);
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);

  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function safeString(value, fallback = '') {
  return String(value || fallback).trim();
}

function buildPassthrough({ uid, companyId, sessionId, mode }) {
  return JSON.stringify({
    uid: safeString(uid),
    companyId: safeString(companyId),
    sessionId: safeString(sessionId),
    mode: safeString(mode, 'video'),
    source: 'clarity-interview',
    createdAt: new Date().toISOString()
  });
}

async function createMuxDirectUpload({ uid, companyId, sessionId, mode }) {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;

  if (!tokenId || !tokenSecret) {
    throw new Error('MUX_ENV_MISSING');
  }

  const auth = Buffer.from(`${tokenId}:${tokenSecret}`).toString('base64');
  const corsOrigin = (process.env.MUX_UPLOAD_CORS_ORIGIN || 'https://interview.clarity-nvl.com').trim();

  const payload = {
    cors_origin: corsOrigin,
    new_asset_settings: {
      playback_policy: ['public'],
      passthrough: buildPassthrough({ uid, companyId, sessionId, mode }),
      video_quality: 'basic',
      static_renditions: [
        { resolution: 'highest' },
        { resolution: 'audio-only' }
      ]
    }
  };

  const response = await fetch('https://api.mux.com/video/v1/uploads', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();
  let json = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!response.ok || !json?.data?.url || !json?.data?.id) {
    throw new Error(
      `MUX_CREATE_UPLOAD_FAILED status=${response.status} body=${text.slice(0, 500)}`
    );
  }

  return {
    uploadId: json.data.id,
    uploadUrl: json.data.url,
    status: json.data.status || 'waiting',
    timeout: json.data.timeout || null
  };
}

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'USE_POST' });
  }

  try {
    const body = await readJson(req);

    const uid = safeString(body.uid);
    const companyId = safeString(body.companyId);
    const sessionId = safeString(body.sessionId || body.uid);
    const mode = safeString(body.mode, 'video');

    if (!uid) {
      return res.status(400).json({ ok: false, error: 'UID_REQUIRED' });
    }

    if (!companyId) {
      return res.status(400).json({ ok: false, error: 'COMPANY_ID_REQUIRED' });
    }

    const mux = await createMuxDirectUpload({ uid, companyId, sessionId, mode });

    return res.status(200).json({
      ok: true,
      provider: 'mux',
      uid,
      companyId,
      sessionId,
      mode,
      uploadId: mux.uploadId,
      uploadUrl: mux.uploadUrl,
      uploadStatus: mux.status,
      timeout: mux.timeout
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'MUX_UPLOAD_CREATE_ERROR',
      message: String(error?.message || error)
    });
  }
};
