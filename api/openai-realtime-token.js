// api/openai-realtime-token.js
// Vercel Serverless Function (Node 18+). Mintet kurzlebige Ephemeral Tokens für OpenAI Realtime WebRTC.
// Leg die Datei in dein bestehendes Vercel-Projekt (wo schon recorder/avatar-APIs liegen).

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { uid, companyId, lang, voice } = await parseBody(req);
    if (!process.env.OPENAI_API_KEY) {
      res.status(500).json({ error: 'OPENAI_API_KEY missing' });
      return;
    }

    // Optional: Ein paar einfache Assertions (UID/Company) – kannst du erweitern.
    if (!uid || !companyId) {
      res.status(400).json({ error: 'uid/companyId required' });
      return;
    }

    // Ephemeral Session anfordern
    const model = process.env.OPENAI_REALTIME_MODEL || 'gpt-4o-realtime-preview-2025-09-12';
    const expiresIn = 60; // Sekunden – kurzlebig halten
    const body = {
      model,
      voice: voice || 'verse',         // beliebig: alloy, verse, aria ...
      modalities: ['audio', 'text'],   // Realtime Audio + Text
      expires_in: expiresIn
    };

    const r = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      res.status(r.status).json({ error: 'Failed to mint realtime token', details: txt });
      return;
    }

    const data = await r.json();
    // data enthält z. B. { client_secret: { value, expires_at }, id, ... }
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

async function parseBody(req) {
  try {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const buf = Buffer.concat(chunks).toString('utf8');
    return JSON.parse(buf || '{}');
  } catch {
    return {};
  }
}
