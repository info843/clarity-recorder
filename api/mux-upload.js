// api/mux-upload.js — final (ESM, Node on Vercel, CORS + OPTIONS)
const ALLOW_ORIGINS = [
  'https://interview.clarity-nvl.com',
  'https://www.clarity-nvl.com',
  'https://clarity-recorder.vercel.app'
];

function cors(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOW_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

function send(res, status, data) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return send(res, 405, { ok:false, error:'method_not_allowed' });

  try {
    const { uid = '', companyId = '', mode = 'audio' } = req.body || {};
    const id = process.env.MUX_TOKEN_ID;
    const secret = process.env.MUX_TOKEN_SECRET;
    if (!id || !secret) return send(res, 500, { ok:false, error:'mux_credentials_missing' });

    const auth = 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64');

    // Mux Direct Upload erzeugen (CORS auf dem Upload selbst setzen)
    const r = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cors_origin: '*', // PUT geht direkt zu GCS; hier reicht *
        new_asset_settings: {
          playback_policy: ['public'],
          mp4_support: 'standard',
          passthrough: JSON.stringify({ uid, companyId, mode })
        },
        passthrough: JSON.stringify({ uid, companyId, mode })
      })
    });

    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j?.data?.url) {
      return send(res, r.status || 502, { ok:false, error:'mux_upload_create_failed', detail:j });
    }

    return send(res, 200, {
      ok: true,
      uploadUrl: j.data.url,
      uploadId:  j.data.id
    });
  } catch (e) {
    return send(res, 500, { ok:false, error:'server_error', detail:String(e?.message||e) });
  }
}
