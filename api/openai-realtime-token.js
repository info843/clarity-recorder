// api/openai-realtime-token.js
// Vercel Serverless Function – mintet OpenAI Realtime Ephemeral Tokens.
// Variante A (default): benutzt OPENAI_API_KEY (bei Vercel).
// Variante B (Proxy): wenn WIX_REALTIME_TOKEN_URL gesetzt ist, holt dort das Token (Wix HTTP function mit Key im Wix Secret Manager).

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const body = await readJson(req);
    const { uid, companyId, lang, voice } = body || {};
    if (!uid || !companyId) {
      res.status(400).json({ error: 'uid/companyId required' });
      return;
    }

    // PROXY zu Wix? (Key bleibt in Wix)
    if (process.env.WIX_REALTIME_TOKEN_URL) {
      const r = await fetch(process.env.WIX_REALTIME_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-internal': process.env.WIX_SHARED_SECRET || '' },
        body: JSON.stringify({ uid, companyId, lang, voice })
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j?.token) {
        res.status(r.status || 500).json({ error: 'Proxy to Wix failed', details: j });
        return;
      }
      res.status(200).json(j);
      return;
    }

    // Direkter Weg (empfohlen): Vercel hält den OpenAI Key
    if (!process.env.OPENAI_API_KEY) {
      res.status(500).json({ error: 'OPENAI_API_KEY missing' });
      return;
    }

    const model = process.env.OPENAI_REALTIME_MODEL || 'gpt-4o-realtime-preview-2025-09-12';
    const expiresIn = 60; // Sekunden

    const rr = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        voice: voice || 'verse',
        modalities: ['audio', 'text'],
        expires_in: expiresIn
      })
    });

    if (!rr.ok) {
      const txt = await rr.text().catch(() => '');
      res.status(rr.status).json({ error: 'Failed to mint token', details: txt });
      return;
    }

    const data = await rr.json();
    res.status(200).json({
      ok: true,
      token: data?.client_secret?.value || null,
      expiresAt: data?.client_secret?.expires_at || null,
      model
    });
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
}

async function readJson(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); }
  catch { return {}; }
}
