// api/mux-upload.js
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization'
};

const MUX_BASE = 'https://api.mux.com/video/v1';

function basicAuth() {
  const id = process.env.MUX_TOKEN_ID || '';
  const secret = process.env.MUX_TOKEN_SECRET || '';
  return 'Basic ' + Buffer.from(id + ':' + secret).toString('base64');
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400');
    res.writeHead(204, CORS_HEADERS).end();
    return;
  }

  if (req.method === 'GET') {
    // Debug-Hook: zeigt, dass die Route existiert (für deinen 404-Test im Browser)
    res.writeHead(200, { 'Content-Type': 'application/json', ...CORS_HEADERS });
    res.end(JSON.stringify({ ok: true, route: 'mux-upload' }));
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json', ...CORS_HEADERS });
    res.end(JSON.stringify({ error: 'method_not_allowed' }));
    return;
  }

  try {
    const { uid = '', companyId = '', mode = 'video' } = req.body || {};

    // Erstelle Direct Upload bei Mux
    const createResp = await fetch(`${MUX_BASE}/uploads`, {
      method: 'POST',
      headers: {
        'Authorization': basicAuth(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cors_origin: '*',
        new_asset_settings: {
          playback_policy: ['public'],
          mp4_support: 'standard',
          passthrough: JSON.stringify({ uid, companyId, mode }).slice(0, 255)
        }
      })
    });

    if (!createResp.ok) {
      const errText = await createResp.text();
      res.writeHead(400, { 'Content-Type': 'application/json', ...CORS_HEADERS });
      res.end(JSON.stringify({ error: 'mux_upload_create_failed', detail: errText.slice(0, 500) }));
      return;
    }

    const j = await createResp.json();
    const upload = j?.data;
    res.writeHead(200, { 'Content-Type': 'application/json', ...CORS_HEADERS });
    res.end(JSON.stringify({
      ok: true,
      uploadUrl: upload?.url || '',
      uploadId: upload?.id || ''
    }));
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'application/json', ...CORS_HEADERS });
    res.end(JSON.stringify({ error: 'server_error', message: String(e?.message || e) }));
  }
}
