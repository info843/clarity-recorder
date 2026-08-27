// backend/appFeedback.jsw
// CLARITY Universal App Rating – v1.1.0 ACTIVE / DOWNSTREAM-ONLY
// Feedback is an optional, independently failing downstream signal. It never
// participates in product completion, closeout, billing, reporting or routing.

import { authenticateUniversalRuntimeFast } from 'backend/platformV2UniversalRuntime';
import {
  FEEDBACK_VERSION,
  buildRatingRecord,
  insertIdempotent,
  findExistingAppRating,
  assertSubmitNonce,
  stableHash,
  text,
  key,
  makeCodeError
} from 'backend/feedbackCore.js';

const VERSION = `${FEEDBACK_VERSION}-app-active-v1.1.0`;
const APP_FEEDBACK_WRITES_ENABLED = true;
const ELIGIBLE_RUNTIME_STATUSES = new Set(['processing', 'completed']);

export async function getAppFeedbackPreparation(input = {}) {
  const verified = await resolveVerifiedRuntime(input);
  const runtime = verified.runtime;
  const eligible = isEligible(runtime);
  // Only the first eligible browser probe needs the existing rating row.
  // Completion polling therefore does not create a repeated feedback-query loop.
  const existing = eligible && input.includeExisting !== false
    ? await findExistingAppRating(text(runtime.uid, '', 240)).catch(() => null)
    : null;
  const runtimeStatus = runtime.completedAt ? 'completed' : key(runtime.status, '', 40);

  return {
    ok: true,
    version: VERSION,
    writesEnabled: APP_FEEDBACK_WRITES_ENABLED,
    eligible,
    alreadySubmitted: Boolean(existing),
    feedbackId: existing?.feedbackId || existing?._id || '',
    runtimeStatus,
    context: {
      uid: text(runtime.uid, '', 240),
      productKey: key(runtime.productKey, '', 100),
      workflowKey: key(runtime.workflowKey, '', 140),
      mode: key(runtime.mode || runtime.workflowSnapshot?.mode, '', 40),
      qLevel: questionLevel(runtime),
      language: key(runtime.participantLang || runtime.userCommLang || runtime.configurationSnapshot?.userCommLang, 'en', 12)
    },
    automation: { ready: false, state: 'inactive' }
  };
}

export async function submitAppRating(input = {}) {
  if (!APP_FEEDBACK_WRITES_ENABLED) {
    throw makeCodeError(
      'APP_FEEDBACK_NOT_ENABLED',
      'Universal App feedback is prepared but intentionally not enabled in this release.'
    );
  }

  assertSubmitNonce(input);
  const verified = await resolveVerifiedRuntime(input);
  const runtime = verified.runtime;

  if (!isEligible(runtime)) {
    throw makeCodeError('APP_FEEDBACK_NOT_ELIGIBLE', 'App feedback is available only after processing has started.', {
      status: key(runtime.status, '', 40)
    });
  }

  const uid = text(runtime.uid, '', 240);
  const existing = await findExistingAppRating(uid);
  if (existing) {
    return {
      ok: true,
      version: VERSION,
      duplicate: true,
      feedbackId: existing.feedbackId || existing._id,
      entryType: 'rating'
    };
  }

  const candidate = runtime.candidateProfile || {};
  const displayName = [text(candidate.firstName, '', 100), text(candidate.lastName, '', 100)]
    .filter(Boolean)
    .join(' ');

  const item = buildRatingRecord({ ...input, submitNonce: appUidSubmitNonce(uid) }, {
    idPrefix: 'FBR-APP',
    sourceType: 'app',
    verificationLevel: 'workflow_verified',
    experienceArea: key(runtime.productKey, 'app', 100),
    productKey: runtime.productKey,
    workflowKey: runtime.workflowKey,
    qLevel: questionLevel(runtime),
    mode: runtime.mode || runtime.workflowSnapshot?.mode,
    language: runtime.participantLang || runtime.userCommLang || runtime.configurationSnapshot?.userCommLang,
    uid,
    unifiedLinkId: runtime.unifiedLinkId,
    runtimeAccessId: runtime.runtimeAccessId,
    sourceRecordId: runtime.sourceRecordId || runtime.sourceBinding?.sourceRecordId,
    sessionId: runtime.sessionId,
    resultId: runtime.resultId,
    companyId: runtime.companyId,
    relationship: 'participant',
    displayName,
    contactEmail: text(candidate.email, '', 240).toLowerCase(),
    sourcePage: 'universal_app',
    formVersion: 'app_rating_v1'
  });

  // Participant v1 dimensions: overall, process clarity, usability, technical experience.
  delete item.usefulnessRating;

  const saved = await insertIdempotent(item);
  return {
    ok: true,
    version: VERSION,
    duplicate: saved.duplicate === true,
    feedbackId: saved.feedbackId,
    entryType: 'rating',
    automation: { ready: false, state: 'inactive' }
  };
}

async function resolveVerifiedRuntime(input = {}) {
  const uid = text(input.uid, '', 240);
  const token = text(input.token || input.sessionToken, '', 10000);
  if (!uid) throw makeCodeError('APP_FEEDBACK_UID_REQUIRED', 'UID is required.');
  if (!token) throw makeCodeError('APP_FEEDBACK_TOKEN_REQUIRED', 'Universal App session token is required.');

  const auth = await authenticateUniversalRuntimeFast({ uid, token });
  if (auth?.ok !== true || !auth.runtime) {
    throw makeCodeError('APP_FEEDBACK_RUNTIME_UNVERIFIED', 'Universal App runtime could not be verified.');
  }
  return auth;
}

function isEligible(runtime = {}) {
  const status = key(runtime.status, '', 40);
  return ELIGIBLE_RUNTIME_STATUSES.has(status) || Boolean(runtime.completedAt);
}

function questionLevel(runtime = {}) {
  const count = Number(runtime.questionCount || runtime.workflowSnapshot?.questionCount || 0);
  if (!Number.isFinite(count) || count <= 0) return '';
  return `q${Math.round(count)}`;
}

function appUidSubmitNonce(uid = '') {
  const normalized = text(uid, '', 240);
  return [
    'APP-UID',
    stableHash(`app-rating-v1:a:${normalized}`),
    stableHash(`app-rating-v1:b:${normalized}`),
    stableHash(`app-rating-v1:c:${normalized}`),
    stableHash(`app-rating-v1:d:${normalized}`)
  ].join('-');
}
