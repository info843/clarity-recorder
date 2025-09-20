// /api/wix-token-proxy.ts  (Vercel Serverless Function)
// Forwardet POST an deine Wix-Function und gibt deren JSON 1:1 zurück.
// Erwartet ENV: WIX_REALTIME_TOKEN_URL (z.B. https://www.clarity-nvl.com/_functions/openai/realtimeToken)

export default async function handler(req: any, res: any) {
  // CORS (für lokale Tests / Sicherheit unkritisch, weil wir same-origin aufrufen)
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

  // Body robust lesen
  let payload: any = {};
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    // falls body als Stream kommt
    try {
      const chunks: Buffer[] = [];
      for await (const c of req) chunks.push(c);
      const raw = Buffer.concat(chunks).toString('utf8');
      payload = raw ? JSON.parse(raw) : {};
    } catch (e: any) {
      res.status(400).json({ ok: false, error: 'INVALID_JSON', detail: String(e?.message || e) });
      return;
    }
  }

  try {
    // Wichtig: Origin-Header setzen, damit Wix-CORS (falls aktiv) sauber greift
    const f = await fetch(WIX_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Die „öffentliche“ Origin deines Interview-Hosts:
        'Origin': 'https://interview.clarity-nvl.com'
      },
      body: JSON.stringify(payload)
    });

    const text = await f.text();

    // Versuche JSON zu liefern; wenn nicht parsbar, als 502 + Text zurückgeben
    try {
      const json = JSON.parse(text);
      res.status(f.status).json(json);
    } catch {
      res.status(502).json({ ok: false, error: 'UPSTREAM_NON_JSON', status: f.status, body: text.slice(0, 400) });
    }
  } catch (e: any) {
    res.status(502).json({ ok: false, error: 'UPSTREAM_FETCH_FAILED', detail: String(e?.message || e) });
  }
}
