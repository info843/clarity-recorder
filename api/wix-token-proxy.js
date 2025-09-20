// ESM
export default async function handler(req, res) {
  // CORS (eigentlich nicht nötig bei same-origin, schadet aber nicht)
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

  let payload = {};
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (e) {
    res.status(400).json({ ok: false, error: 'INVALID_JSON', detail: String(e?.message || e) });
    return;
  }

  try {
    const upstream = await fetch(WIX_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://interview.clarity-nvl.com' // optional
      },
      body: JSON.stringify(payload)
    });

    const text = await upstream.text();
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
  } catch (e) {
    res.status(502).json({ ok: false, error: 'UPSTREAM_FETCH_FAILED', detail: String(e?.message || e) });
  }
}
