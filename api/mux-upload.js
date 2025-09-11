// api/mux-upload.js

// Domains, die deine App (Client) auf diese API zugreifen lassen
const ALLOWED_APP_ORIGINS = [
  'https://interview.clarity-nvl.com',
  'https://clarity-recorder.vercel.app',
  'https://www.clarity-nvl.com',
  'https://clarity-nvl.com'
];

function getRequestOrigin(req) {
  const o = req.headers?.origin || '';
  if (o) return o;
  const r = req.headers?.referer || '';
  try { return r ? new URL(r).origin : ''; } catch { return ''; }
}

function jsonSafe(body) {
  try { return JSON.parse(body); } catch { return body; }
}

export default async function handler(req, res) {
  // --- CORS ---
  const origin = getRequestOrigin(req);
  const isAllowed = ALLOWED_APP_ORIGINS.includes(origin);
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();

  // --- ENV check (häufigste Fehlerquelle) ---
  const id = process.env.MUX_TOKEN_ID;
  const secret = process.env.MUX_TOKEN_SECRET;
  if (!id || !secret) {
    return res.status(500).json({ error: 'MUX credentials missing (check Environment Variables & redeploy)' });
  }

  try {
    const { uid, companyId } = req.body || {};
    if (!uid || !companyId) {
      return res.status(400).json({ error: 'uid/companyId required' });
    }

    // Für Browser-Direktupload: die Origin, von der PUT kommen darf
    const corsOrigin = isAllowed ? origin : 'https://interview.clarity-nvl.com';

    // WICHTIG: cors_origin ist TOP-LEVEL (nicht in new_asset_settings)!
    const payload = {
      cors_origin: corsOrigin,
      new_asset_settings: {
        playback_policy: ['public']
      },
      passthrough: JSON.stringify({ uid, companyId })
    };

    const r = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':
          'Basic ' + Buffer.from(id + ':' + secret).toString('base64')
      },
      body: JSON.stringify(payload)
    });

    const text = await r.text();                 // erst Text lesen…
    const data = jsonSafe(text);                 // …dann JSON versuchen

    if (!r.ok) {
      // Fehler von Mux transparent durchreichen
      return res.status(r.status).json(
        typeof data === 'string' ? { error: data } : data
      );
    }

    // Erfolg: Upload-URL & -ID zurück
    const url = data?.data?.url;
    const uploadId = data?.data?.id;
    if (!url || !uploadId) {
      return res.status(502).json({ error: 'Unexpected Mux response', data });
    }

    res.status(200).json({ uploadUrl: url, uploadId });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
