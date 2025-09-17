// File: api/mux-upload.js
// Serverless (Vercel) – erzeugt eine Direct-Upload-URL bei Mux

export default async function handler(req, res) {
// --- CORS (inkl. Preflight)
if (req.method === 'OPTIONS') {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
res.setHeader('Access-Control-Max-Age', '86400');
return res.status(204).end();
}
res.setHeader('Access-Control-Allow-Origin', '*');

// Nur POST zulassen
if (req.method !== 'POST') {
return res.status(405).json({ error: 'method_not_allowed' });
}

// ENV prüfen
const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
return res.status(500).json({ error: 'mux_env_missing' });
}

// Basic-Auth für Mux
const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64');

// =========================================================
// SCHRITT A — Origin für Mux fest verdrahten (häufigster 400-Fehler)
//  - Mux verlangt eine exakte Origin (Schema + Host, kein Slash)
//  - Wenn du später von Wix aus triggerst, ggf. auf 'https://www.clarity-nvl.com' ändern
const FIXED_ORIGIN = 'https://interview.clarity-nvl.com';

// Request-Body für Mux (minimal & gültig)
const uploadBody = {
cors_origin: FIXED_ORIGIN,
new_asset_settings: { playback_policy: ['public'] }
};
// =========================================================

try {
// Anfrage an Mux
const muxResp = await fetch('https://api.mux.com/video/v1/uploads', {
method: 'POST',
headers: {
Authorization: `Basic ${auth}`,
Content-Type': 'application/json'
},
body: JSON.stringify(uploadBody)
});

// Antwort (als Text holen, danach versuchen zu parsen)
const text = await muxResp.text();
let json;
try { json = text ? JSON.parse(text) : {}; }
catch { json = { raw: text }; }

// =========================================================
// SCHRITT B — Fehler sauber nach vorne durchreichen
if (!muxResp.ok) {
// Hier siehst du im Client exakt, was Mux bemängelt (cors_origin etc.)
return res.status(muxResp.status).json({
error: 'mux_api_error',
muxStatus: muxResp.status,
muxBody: json
});
}
// =========================================================

// =========================================================
// SCHRITT C — Erfolgsantwort für den Recorder
//  - Mux liefert { data: { id, url, ... } }
const data = json?.data || {};
return res.status(200).json({
uploadId: data.id || null,
uploadUrl: data.url || null,
mux: json
});
// =========================================================
} catch (err) {
// Netz-/Runtime-Fehler
return res.status(500).json({
error: 'mux_request_failed',
message: err?.message || String(err)
});
}
}
