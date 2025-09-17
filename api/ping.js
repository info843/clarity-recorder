export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')
    .end();

  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({ ok: true, where: 'serverless', time: Date.now() });
}
