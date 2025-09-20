// CJS, funktioniert in "Framework: Other" und allen Vercel-Setups
module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).end(JSON.stringify({
    ok: true,
    now: new Date().toISOString(),
    method: req.method
  }));
};
