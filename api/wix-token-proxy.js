// /api/wix-token-proxy.js
export default async function handler(req, res) {
  const ALLOW = ['https://interview.clarity-nvl.com', 'https://www.clarity-nvl.com'];
  const origin = ALLOW.includes(req.headers.origin) ? req.headers.origin : ALLOW[0];
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'USE_POST' });
  }

  try {
    const url = process.env.WIX_REALTIME_TOKEN_URL; // z.B. https://www.clarity-nvl.com/_functions/realtimeToken
    if (!url) return res.status(500).json({ ok: false, error: 'ENV_WIX_REALTIME_TOKEN_URL_MISSING' });

    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });

    // Wenn Wix mal kein JSON zurückschickt, nicht mit 502 scheitern:
    let data = null;
    try { data = await upstream.json(); } catch { /* ignore */ }

    return res.status(upstream.status).json(
      data ?? { ok: false, error: 'UPSTREAM_NON_JSON', status: upstream.status }
    );
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'PROXY_ERROR', message: String(e) });
  }
}
