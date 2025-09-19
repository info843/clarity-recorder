// api/wix-token-proxy.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const WIX_URL = process.env.WIX_REALTIME_TOKEN_URL; 
// Beispiel ENV: https://www.clarity-nvl.com/_functions/openai/realtimeToken

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS für lokale Tests optional; same-origin braucht's nicht
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).json({ ok: true });

  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });

  try {
    if (!WIX_URL) return res.status(500).json({ ok: false, error: 'WIX_REALTIME_TOKEN_URL not set' });

    const r = await fetch(WIX_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {}),
    });

    const text = await r.text();
    res.setHeader('Content-Type', 'application/json');
    res.status(r.status).send(text); // 1:1 durchreichen
  } catch (e:any) {
    res.status(500).json({ ok: false, error: e?.message || 'proxy failed' });
  }
}
