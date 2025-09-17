export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ ok: true, where: 'serverless', ts: Date.now() });
}
