// api/mux-upload.js  — final (CommonJS, Node 22, CORS + Mux direct upload)
const ALLOW_ORIGINS = [
  'https://interview.clarity-nvl.com',
  'https://www.clarity-nvl.com',
  'https://clarity-recorder.vercel.app',
];

function setCors(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOW_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24h
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

function json(res, status, data) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  if (setCors(req, res)) return; // preflight handled

  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'method_not_allowed' });
  }

  try {
    const { uid = '', companyId = '', mode = 'audio' } = (req.body || {});
    const id = process.env.MUX_TOKEN_ID;
    const secret = process.env.MUX_TOKEN_SECRET;
    if (!id || !secret) {
      return json(res, 500, { ok: false, error: 'mux_credentials_missing' });
    }

    const auth = 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64');

    // Create a Mux Direct Upload
    const r = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cors_origin: '*',                           // wir erlauben PUT von überall (PUT geht direkt zu GCS)
        new_asset_settings: {
          playback_policy: ['public'],              // wir brauchen PlaybackID
          mp4_support: 'standard',                  // damit wir später /medium.mp4 nutzen können
          passthrough: JSON.stringify({ uid, companyId, mode })
        },
        passthrough: JSON.stringify({ uid, companyId, mode }),
      }),
    });

    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j?.data?.url) {
      return json(res, 502, { ok: false, error: 'mux_upload_create_failed', detail: j });
    }

    return json(res, 200, {
      ok: true,
      uploadUrl: j.data.url,        // direkte PUT-URL (GCS)
      uploadId: j.data.id,          // Mux-Upload-ID
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: 'server_error', detail: String(e?.message || e) });
  }
};
