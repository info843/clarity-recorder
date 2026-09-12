// Replace with the exact origin(s) of the Workspace HTML-component document
// that directly parents this nested iframe in Preview/Production.
// Use origins only (scheme + host + optional port), with no path/query/hash.
// Values are URL-normalized at runtime; invalid values and this placeholder
// keep the embed locked.
window.CLARITY_LIVE_CONFIG = Object.freeze({
  version: '1.1.0-current-binding',
  allowedParentOrigins: Object.freeze([
    'REPLACE_WITH_CURRENT_WORKSPACE_ORIGIN'
  ])
});
