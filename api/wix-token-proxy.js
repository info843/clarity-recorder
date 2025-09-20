// Next.js Pages API route: /api/wix-token-proxy
// Proxy zu deiner Wix-Function, damit live.html same-origin ohne CORS arbeiten kann.

export default async function handler(req: any, res: any) {
  // CORS lockern (same-origin reicht eigentlich, aber so ist es robust)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  const WIX_URL = process.env.WIX_REALTIME_TOKEN_URL;
  if (!WIX_URL) {
    res.status(500).json({ ok: false, error: 'WIX_REALTIME_TOKEN_URL not set' });
    return;
  }

  // Body robust lesen (Next kann body schon geparst liefern oder als String)
  let payload: any = {};
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (e: any) {
    res.status(400).json({ ok: false, error: 'INVALID_JSON', detail: String(e?.message || e) });
    return;
  }

  try {
    // Origin header mitgeben, falls Wix-CORS später strenger wird
    const upstream = await fetch(WIX_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://interview.clarity-nvl.com',
      },
      body: JSON.stringify(payload)
    });

    const text = await upstream.text(); // immer erst Text lesen
    // Versuche JSON zurückzugeben; wenn nicht-JSON, melde sauber
    try {
      const json = JSON.parse(text);
      res.status(upstream.status).json(json);
    } catch {
      res.status(502).json({
        ok: false,
        error: 'UPSTREAM_NON_JSON',
        status: upstream.status,
        body: text.slice(0, 500)
      });
    }
  } catch (e: any) {
    res.status(502).json({ ok: false, error: 'UPSTREAM_FETCH_FAILED', detail: String(e?.message || e) });
  }
}
