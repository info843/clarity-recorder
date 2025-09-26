// /api/mux-upload.js  — Vercel Serverless Function (CommonJS)
const formidable = require('formidable');
const fs = require('fs');

function cors(res, origin) {
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function pickOrigin(req) {
  // optional: mehrere erlaubte Origins kommasepariert
  const allow = (process.env.MUX_CORS_ORIGIN || 'https://interview.clarity-nvl.com').split(',').map(s=>s.trim()).filter(Boolean);
  const o = req.headers.origin || '';
  return allow.includes(o) ? o : allow[0];
}

async function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false, maxFileSize: 1024 * 1024 * 1024 }); // 1GB
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      const file = files.file;
      if (!file) return reject(new Error('file_missing'));
      resolve({ fields, file });
    });
  });
}

async function createMuxDirectUpload() {
  const id = process.env.MUX_TOKEN_ID;
  const secret = process.env.MUX_TOKEN_SECRET;
  if (!id || !secret) throw new Error('env_mux_token_missing');

  const auth = Buffer.from(`${id}:${secret}`).toString('base64');
  const corsOrigin = (process.env.MUX_CORS_ORIGIN || 'https://interview.clarity-nvl.com').split(',')[0];

  const payload = {
    new_asset_settings: { playback_policy: ['public'] },
    cors_origin: corsOrigin
  };

  const r = await fetch('https://api.mux.com/video/v1/uploads', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const t = await r.text();
  let j = {};
  try { j = JSON.parse(t); } catch {}
  if (!r.ok || !j?.data?.url) {
    throw new Error(`mux_create_upload_failed status=${r.status} body=${t.slice(0,300)}`);
  }
  return j.data.url; // https://storage.mux.com/upload/...
}

export const config = { api: { bodyParser: false } };

module.exports = async function handler(req, res) {
  const origin = pickOrigin(req);
  cors(res, origin);

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ ok:false, error:'USE_POST' }); return; }

  try {
    const { fields, file } = await parseMultipart(req);
    const uid = String(fields.uid || '').trim() || 'NO-UID';
    const companyId = String(fields.companyId || '').trim();

    // 1) direkte Upload-URL bei Mux erzeugen
    const muxUrl = await createMuxDirectUpload();

    // 2) Datei-Stream lesen
    const path = file.filepath || file._writeStream?.path || file.path;
    if (!path) throw new Error('file_path_missing');

    const stat = fs.statSync(path);
    const stream = fs.createReadStream(path);

    // 3) direkt zu Mux hochladen (PUT)
    const put = await fetch(muxUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/webm',
        'Content-Length': String(stat.size)
      },
      body: stream
    });

    if (!put.ok) {
      const tt = await put.text().catch(()=>String(put.status));
      throw new Error(`mux_put_failed status=${put.status} body=${tt.slice(0,300)}`);
    }

    res.status(200).json({
      ok: true,
      uploadId: `${uid}-${Date.now()}`,
      bytes: stat.size,
      companyId
    });
  } catch (e) {
    res.status(500).json({ ok:false, error:'UPLOAD_ERROR', message:String(e?.message||e) });
  }
};
