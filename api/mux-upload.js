// /api/mux-upload.js  (Vercel Node function)
// package.json sollte KEIN "type":"module" haben oder du nutzt import()-Syntax.
// Install: npm i formidable

const formidable = require('formidable');

function cors(res, origin) {
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function pickOrigin(req) {
  const allow = (process.env.ALLOW_ORIGINS || '').split(',').map(s=>s.trim()).filter(Boolean);
  const o = req.headers.origin || '';
  return allow.includes(o) ? o : (allow[0] || '*');
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

async function getMuxDirectUrl(uid) {
  const url = process.env.WIX_MUX_DIRECT_URL;
  if (!url) throw new Error('env_WIX_MUX_DIRECT_URL_missing');
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ uid })
  });
  const t = await r.text();
  let j = {};
  try { j = JSON.parse(t); } catch {}
  if (!r.ok || !j?.ok || !j?.upload?.url) {
    throw new Error(`wix_mux_direct_failed status=${r.status} body=${t.slice(0,300)}`);
  }
  return j.upload.url;
}

export const config = {
  api: {
    bodyParser: false, // wir parsen selbst (formidable)
  },
};

export default async function handler(req, res) {
  const origin = pickOrigin(req);
  cors(res, origin);

  if (req.method === 'OPTIONS') {
    res.status(204).end(); return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ ok:false, error:'USE_POST' }); return;
  }

  try {
    const { fields, file } = await parseMultipart(req);
    const uid = String(fields.uid || '').trim() || 'NO-UID';
    const companyId = String(fields.companyId || '').trim();

    const muxUrl = await getMuxDirectUrl(uid);

    // formidable gibt je nach Plattform file.filepath oder file._writeStream.path
    const fs = require('fs');
    const path = file.filepath || file._writeStream?.path || file.path;
    if (!path) throw new Error('file_path_missing');

    const stat = fs.statSync(path);
    const stream = fs.createReadStream(path);

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
    res.status(500).json({ ok:false, error: 'UPLOAD_ERROR', message: String(e?.message||e) });
  }
}
