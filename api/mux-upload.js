// api/mux-upload.js

// --- Domains, die deine Seite (Client) sein dürfen ---
const ALLOWED_APP_ORIGINS = [
  'https://interview.clarity-nvl.com',   // deine Subdomain (geplant)
  'https://clarity-recorder.vercel.app', // aktuelle Testdomain
  'https://www.clarity-nvl.com',
  'https://clarity-nvl.com'
];

// Origin sauber ermitteln
function getRequestOrigin(req) {
  const o = req.headers?.origin || '';
  if (o) return o;
  const ref = req.headers?.referer || '';
  try { return ref ? new URL(ref).origin : ''; } catch { return ''; }
}

// Immer JSON antworten
function json(res, status, data) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.send(JSON.stringify(data));
}

export default async function handler(req, res) {
  const origin = getRequestOrigin(req);
  const isAllowed = ALLOWED_APP_ORIGINS.includes(origin);

  // CORS setzen (nur für erlaubte Origins)
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // Preflight
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') return res.status(405).end();

  // Minimal-Checks & klare Fehlermeldungen
  if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    return json(res, 500, {
      error: 'MUX credentials missing',
      hint: 'Bitte MUX_TOKEN_ID und MUX_TOKEN_SECRET in Vercel > Project > Environment Variables setzen.'
    });
  }

  try {
    const { uid, companyId } = req.body || {};
    if (!uid || !companyId) {
      return json(res, 400, { error: 'uid/companyId required' });
    }

    // Für Mux: Von dieser Origin dürfen Browser direkt hochladen
    const muxCorsOrigin = isAllowed ? origin : 'https://interview.clarity-nvl.com';

    const r = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':
          'Basic ' +
          Buffer.from(process.env.MUX_TOKEN_ID + ':' + process.env.MUX_TOKEN_SECRET)
            .toString('base64')
      },
      body: JSON.stringify({
        new_asset_settings: {
          playback_policy: ['public'],
          cors_origin: muxCorsOrigin
        },
        // eigene Metadaten wiederfindbar in Mux
        passthrough: JSON.stringify({ uid, companyId })
      })
    });

    // Mux kann Text/JSON liefern -> immer erst als Text lesen
    const raw = await r.text();
    let jsonBody = {};
    try { jsonBody = JSON.parse(raw); } catch {
      return json(res, r.status || 502, {
        error: 'MUX returned non-JSON response',
        status: r.status,
        body: raw?.slice(0, 400)
      });
    }

    if (!r.ok) {
      // Mux Fehler sauber durchreichen
      return json(res, r.status, { error: 'mux_error', mux: jsonBody });
    }

    const uploadUrl = jsonBody?.data?.url;
    const uploadId  = jsonBody?.data?.id;

    if (!uploadUrl || !uploadId) {
      return json(res, 502, { error: 'invalid_mux_response', mux: jsonBody });
    }

    return json(res, 200, { uploadUrl, uploadId });
  } catch (e) {
    return json(res, 500, { error: String(e) });
  }
}
