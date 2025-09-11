// api/mux-upload.js

// Domains, die deine API (diese Route) aufrufen dürfen:
const ALLOWED_APP_ORIGINS = [
  'https://interview.clarity-nvl.com',          // deine Subdomain (geplant)
  'https://clarity-recorder.vercel.app',        // aktuelle Testdomain
  'https://www.clarity-nvl.com',
  'https://clarity-nvl.com'
];

// kleine Hilfsfunktion, um die Origin sauber zu ermitteln
function getRequestOrigin(req) {
  const hdrOrigin = req.headers?.origin || '';
  if (hdrOrigin) return hdrOrigin;
  const ref = req.headers?.referer || '';
  try { return ref ? new URL(ref).origin : ''; } catch { return ''; }
}

export default async function handler(req, res) {
  const origin = getRequestOrigin(req);
  const isAllowed = ALLOWED_APP_ORIGINS.includes(origin);

  // CORS-Header (damit deine Seite diese API aufrufen darf)
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // Preflight beantworten
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { uid, companyId } = req.body || {};
    if (!uid || !companyId) {
      return res.status(400).json({ error: 'uid/companyId required' });
    }

    // Für Mux: Von welcher Origin dürfen Browser den Direkt-Upload machen?
    // Wenn die anfragende Origin erlaubt ist, nimm die – sonst fallback auf deine Ziel-Subdomain.
    const muxCorsOrigin = isAllowed
      ? origin
      : 'https://interview.clarity-nvl.com';

    const r = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':
          'Basic ' +
          Buffer.from(
            process.env.MUX_TOKEN_ID + ':' + process.env.MUX_TOKEN_SECRET
          ).toString('base64')
      },
      body: JSON.stringify({
        new_asset_settings: {
          playback_policy: ['public'],
          cors_origin: muxCorsOrigin
        },
        // Hilfsdaten, die du später bei Mux wiederfinden kannst:
        passthrough: JSON.stringify({ uid, companyId })
      })
    });

    const json = await r.json();
    if (!r.ok) {
      // Mux-Fehler durchreichen, damit du sie im Browser/Logs siehst
      return res.status(r.status).json(json);
    }

    // Upload-URL und -ID an den Client zurückgeben
    res.status(200).json({
      uploadUrl: json.data.url,
      uploadId: json.data.id
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
