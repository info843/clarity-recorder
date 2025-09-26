// /api/mux-upload.js  (optional Fallback – z.B. Vercel/Node Serverless)
// Leitet an die www-Domain http-function weiter. Always-JSON.

export default async function handler(req, res) {
  const ALLOW = ['https://interview.clarity-nvl.com', 'https://www.clarity-nvl.com'];
  const origin = ALLOW.includes(req.headers.origin) ? req.headers.origin : ALLOW[0];
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'USE_POST' });

  try {
    const primary   = process.env.WIX_MUX_UPLOAD_URL || 'https://www.clarity-nvl.com/_functions/muxDirectUpload';
    const upstream  = await fetch(primary, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(req.body||{}) });
    let data = null; try { data = await upstream.json(); } catch {}
    return res.status(upstream.status).json(data ?? { ok:false, error:'UPSTREAM_NON_JSON', status: upstream.status });
  } catch (e) {
    return res.status(200).json({ ok:false, error:'PROXY_ERROR', message:String(e) });
  }
}
