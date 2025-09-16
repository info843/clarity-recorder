// /api/mux-upload.js  — robust mit CORS & klaren Fehlercodes
export default async function handler(req, res) {
  // ---- CORS
  const origin = req.headers.origin || '';
  const ALLOW = new Set([
    'https://interview.clarity-nvl.com',
    'https://clarity-recorder.vercel.app',
    'https://www.clarity-nvl.com'
  ]);
  const allowOrigin = ALLOW.has(origin) ? origin : 'https://interview.clarity-nvl.com';
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ ok:false, error_code:'method_not_allowed' });
  }

  // ---- Env / Auth
  const ID = process.env.MUX_TOKEN_ID;
  const SECRET = process.env.MUX_TOKEN_SECRET;
  if (!ID || !SECRET) {
    return res.status(500).json({
      ok:false, error_code:'env_missing',
      message:'MUX_TOKEN_ID or MUX_TOKEN_SECRET missing in Production env'
    });
  }
  const auth = 'Basic ' + Buffer.from(`${ID}:${SECRET}`).toString('base64');

  // ---- Body
  let body;
  try {
    body = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
  } catch (_) {
    return res.status(400).json({ ok:false, error_code:'bad_json' });
  }

  const uid = String(body.uid || '').trim();
  const companyId = String(body.companyId || '').trim();
  const mode = (String(body.mode || 'video').toLowerCase());
  if (!uid || !companyId || !['audio','video'].includes(mode)) {
    return res.status(400).json({ ok:false, error_code:'bad_params', detail:{ uid, companyId, mode } });
  }

  // ---- Mux: create Direct Upload
  try {
    const createRes = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cors_origin: 'https://interview.clarity-nvl.com',
        new_asset_settings: {
          playback_policy: ['public'],
          // nice to have: audio-only Assets als baseline encoden
          encoding_tier: 'baseline'
        }
      })
    });

    const createJson = await createRes.json().catch(() => ({}));
    if (!createRes.ok || !createJson?.data?.url) {
      return res.status(400).json({
        ok:false,
        error_code:'mux_upload_create_failed',
        mux_status:createRes.status,
        mux_body:createJson || null
      });
    }

    const { id: uploadId, url: uploadUrl } = createJson.data;
    return res.status(200).json({ ok:true, uploadId, uploadUrl });
  } catch (err) {
    return res.status(500).json({
      ok:false, error_code:'mux_create_exception', message:String(err?.message||err)
    });
  }
}
