// /api/mux-upload.js
export default async function handler(req, res) {
  // CORS erlauben (Wix + Vercel-Domain)
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
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error_code:'method_not_allowed' });

  // Env prüfen
  const ID = process.env.MUX_TOKEN_ID;
  const SECRET = process.env.MUX_TOKEN_SECRET;
  if (!ID || !SECRET) {
    return res.status(500).json({ ok:false, error_code:'env_missing', message:'MUX_TOKEN_* missing in Production env' });
  }
  const auth = 'Basic ' + Buffer.from(`${ID}:${SECRET}`).toString('base64');

  // Body lesen
  let body = {};
  try { body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}'); }
  catch { return res.status(400).json({ ok:false, error_code:'bad_json' }); }

  const uid = String(body.uid || '').trim();
  const companyId = String(body.companyId || '').trim();
  const mode = String(body.mode || 'video').toLowerCase();
  if (!uid || !companyId || !['audio','video'].includes(mode)) {
    return res.status(400).json({ ok:false, error_code:'bad_params', detail:{ uid, companyId, mode } });
  }

  // >>> WICHTIG: exakt den anfragenden Origin an Mux weiterreichen (vermeidet 422 wegen CORS)
  const corsOriginForMux = origin && /^https?:\/\//.test(origin) ? origin : 'https://interview.clarity-nvl.com';

  try {
    const createRes = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        cors_origin: corsOriginForMux,       // <— dynamisch
        new_asset_settings: {
          playback_policy: ['public']
          // encoding_tier: 'baseline'   // optional – zur Sicherheit weggelassen
        }
      })
    });

    const createJson = await createRes.json().catch(() => ({}));

    // Mux-Status 1:1 nach außen geben, damit du ihn im Browser siehst (401/422 usw.)
    if (!createRes.ok || !createJson?.data?.url) {
      return res.status(createRes.status || 400).json({
        ok:false,
        error_code:'mux_upload_create_failed',
        mux_status:createRes.status,
        mux_body:createJson || null,
        echo:{ cors_origin:corsOriginForMux }
      });
    }

    const { id: uploadId, url: uploadUrl } = createJson.data;
    return res.status(200).json({ ok:true, uploadId, uploadUrl, echo:{ cors_origin:corsOriginForMux } });
  } catch (err) {
    return res.status(500).json({ ok:false, error_code:'mux_create_exception', message:String(err?.message||err) });
  }
}
