'use strict';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  return res.status(410).json({
    ok:false,
    error:'legacy_endpoint_retired',
    message:'This page or endpoint is no longer available. Use the current CLARITY Universal App link.'
  });
};
