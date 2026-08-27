// CLARITY Universal App — optional downstream feedback controller v1.1.0
// Every network call in this controller is isolated from product completion.

import { buildCandidateExperience } from './candidate-experience-content.js?v=1.0.0';

const VERSION = '1.1.0';
const DIMENSIONS = Object.freeze(['overallRating','clarityRating','usabilityRating','technicalRating']);
const PROCESSING_STATES = new Set(['processing','completed']);
const INELIGIBLE_POLL_MS = 30000;
const ELIGIBLE_POLL_MS = 5000;

function text(value, max = 5000) {
  return String(value ?? '').trim().slice(0, max);
}

function nonceFor(uid) {
  const storageKey = 'clarity-app-feedback-nonce:' + text(uid, 240);
  try {
    const existing = sessionStorage.getItem(storageKey);
    if (existing) return existing;
    const random = globalThis.crypto?.randomUUID?.() || (Date.now().toString(36) + '-' + Math.random().toString(36).slice(2));
    const value = 'APPFB-' + random;
    sessionStorage.setItem(storageKey, value);
    return value;
  } catch (_) {
    return 'APPFB-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
  }
}

export function createAppFeedbackController(context = {}) {
  const { $, state, api, getLocale, getBrandingMode } = context;
  let continuous = false;
  let inFlight = false;
  let timer = null;
  let observer = null;
  let eligibilityStartedAt = 0;
  let latestRuntimeStatus = '';
  let eligibilityConfirmed = false;
  let submitted = false;
  let skipped = false;
  let temporarilyHidden = false;
  let destroyed = false;
  let failedSubmissions = 0;
  const ratings = { overallRating:null, clarityRating:null, usabilityRating:null, technicalRating:null };

  const layer = () => $('appFeedbackLayer');
  const currentExperience = () => buildCandidateExperience({
    runtime:state.payload?.runtime || {},
    branding:state.payload?.branding || state.payload?.runtime?.brandingSnapshot || {},
    brandingMode:getBrandingMode?.() || 'clarity'
  }, getLocale?.() || state.locale || 'en');

  function setContent(id, value) {
    const element = $(id);
    if (element) element.textContent = value || '';
  }

  function setHidden(id, hidden) {
    const element = $(id);
    if (element) element.classList.toggle('hidden', Boolean(hidden));
  }

  function applyLocale() {
    const copy = currentExperience().feedback;
    setContent('feedbackProcessingEyebrow', copy.processingEyebrow);
    setContent('feedbackProcessingTitle', latestRuntimeStatus === 'completed' ? copy.completedTitle : copy.processingTitle);
    setContent('feedbackProcessingText', latestRuntimeStatus === 'completed' ? copy.completedText : copy.processingText);
    setContent('feedbackStageSaveLabel', copy.saveStage);
    setContent('feedbackStageProcessLabel', copy.processStage);
    setContent('feedbackStageCompleteLabel', copy.completeStage);
    setContent('feedbackQuestion', copy.question);
    setContent('feedbackOptionalText', copy.optional);
    setContent('feedbackAnonymousLabel', copy.anonymous);
    setContent('feedbackNamedLabel', copy.named);
    setContent('feedbackAnonymousInfo', copy.anonymousInfo);
    setContent('feedbackOverallLabel', copy.overall);
    setContent('feedbackClarityLabel', copy.clarity);
    setContent('feedbackUsabilityLabel', copy.usability);
    setContent('feedbackTechnicalLabel', copy.technical);
    setContent('feedbackCommentLabel', copy.comment);
    const comment = $('feedbackComment');
    if (comment) comment.placeholder = copy.commentPlaceholder;
    setContent('feedbackPublicUseText', copy.publicUse);
    setContent('feedbackPublicIdentityText', copy.publicIdentity);
    setContent('feedbackSubmitBtn', failedSubmissions ? copy.retry : copy.submit);
    setContent('feedbackSkipBtn', copy.skip);
    setContent('feedbackTechnicalBtn', copy.technicalStatus);
    setContent('feedbackReturnBtn', copy.returnToRating);
    setContent('feedbackCloseBtn', copy.close);
    document.querySelectorAll('[data-rating-dimension][data-rating-value]').forEach((button) => {
      const dimension = button.dataset.ratingDimension;
      const labelMap = {overallRating:copy.overall,clarityRating:copy.clarity,usabilityRating:copy.usability,technicalRating:copy.technical};
      button.setAttribute('aria-label', (labelMap[dimension] || '') + ': ' + button.dataset.ratingValue + '/5');
    });
    renderRatingState();
  }

  function renderRatingState() {
    document.querySelectorAll('[data-rating-dimension][data-rating-value]').forEach((button) => {
      const selected = Number(ratings[button.dataset.ratingDimension] || 0);
      const value = Number(button.dataset.ratingValue || 0);
      button.classList.toggle('selected', value <= selected);
      button.setAttribute('aria-checked', String(value === selected));
    });
  }

  function setIdentityMode() {
    const named = document.querySelector('input[name="feedbackIdentityMode"]:checked')?.value === 'named';
    setHidden('feedbackPublicIdentityRow', !named || !$('feedbackPublicUse')?.checked);
    if (!named && $('feedbackPublicIdentity')) $('feedbackPublicIdentity').checked = false;
  }

  function updateProcessState(status) {
    latestRuntimeStatus = String(status || '').toLowerCase();
    const complete = latestRuntimeStatus === 'completed';
    layer()?.classList.toggle('feedback-completed', complete);
    document.querySelectorAll('[data-feedback-stage]').forEach((stage) => {
      const name = stage.dataset.feedbackStage;
      const done = name === 'save' || complete || (name === 'process' && latestRuntimeStatus === 'processing');
      const active = !complete && name === 'process';
      stage.classList.toggle('done', done && !active);
      stage.classList.toggle('active', active);
    });
    setHidden('feedbackCloseBtn', !complete);
    applyLocale();
  }

  function showLayer(preparation = {}) {
    if (!layer()) return;
    const wasHidden = layer().classList.contains('hidden');
    const nextStatus = String(preparation.runtimeStatus || latestRuntimeStatus || 'processing').toLowerCase();
    if (temporarilyHidden && nextStatus !== 'completed') {
      updateProcessState(nextStatus);
      return;
    }
    temporarilyHidden = false;
    layer().classList.remove('hidden');
    layer().setAttribute('aria-hidden','false');
    $('feedbackReturnBtn')?.classList.add('hidden');
    document.body.classList.add('feedback-experience-active');
    if (!eligibilityStartedAt) eligibilityStartedAt = Date.now();
    updateProcessState(nextStatus);
    if (wasHidden) requestAnimationFrame(() => $('feedbackQuestion')?.focus({preventScroll:true}));
    if (preparation.alreadySubmitted === true && !submitted) {
      submitted = true;
      showResult(currentExperience().feedback.duplicate, 'ok');
    }
  }

  function hideLayerTemporarily() {
    if (!layer()) return;
    temporarilyHidden = true;
    layer().classList.add('hidden');
    layer().setAttribute('aria-hidden','true');
    $('feedbackReturnBtn')?.classList.remove('hidden');
    document.body.classList.remove('feedback-experience-active');
    requestAnimationFrame(() => $('feedbackReturnBtn')?.focus({preventScroll:true}));
  }

  function restoreLayer() {
    if (!layer()) return;
    temporarilyHidden = false;
    layer().classList.remove('hidden');
    layer().setAttribute('aria-hidden','false');
    $('feedbackReturnBtn')?.classList.add('hidden');
    document.body.classList.add('feedback-experience-active');
    requestAnimationFrame(() => $('feedbackQuestion')?.focus({preventScroll:true}));
  }

  function showResult(message, tone = 'ok') {
    setHidden('feedbackForm', true);
    setHidden('feedbackResult', false);
    setContent('feedbackResultMessage', message);
    const result = $('feedbackResult');
    result?.classList.toggle('error', tone === 'error');
    result?.classList.toggle('ok', tone !== 'error');
  }

  function showFormAgain() {
    setHidden('feedbackForm', false);
    setHidden('feedbackResult', true);
    setContent('feedbackMessage','');
  }

  function schedule(delayMs) {
    if (!continuous || destroyed || latestRuntimeStatus === 'completed') return;
    clearTimeout(timer);
    const hiddenDelay = document.hidden ? Math.max(60000, delayMs) : delayMs;
    timer = setTimeout(() => { void checkEligibility(); }, hiddenDelay);
  }

  async function checkEligibility() {
    if (destroyed || inFlight || !state.uid || !state.token) return;
    inFlight = true;
    try {
      const preparation = await api('v2AppFeedbackPreparation', {
        body:{uid:state.uid,token:state.token,includeExisting:!eligibilityConfirmed},
        timeoutMs:16000
      });
      if (preparation?.writesEnabled !== true) {
        continuous = false;
        return;
      }
      if (preparation?.eligible === true) {
        eligibilityConfirmed = true;
        continuous = true;
        showLayer(preparation);
        if (preparation.runtimeStatus === 'completed') continuous = false;
        else schedule(ELIGIBLE_POLL_MS);
      } else {
        const status = String(preparation?.runtimeStatus || '').toLowerCase();
        if (layer() && !layer().classList.contains('hidden') && !PROCESSING_STATES.has(status)) hideLayerTemporarily();
        schedule(INELIGIBLE_POLL_MS);
      }
    } catch (_) {
      // Rating preparation is deliberately fail-silent for the product flow.
      schedule(INELIGIBLE_POLL_MS);
    } finally {
      inFlight = false;
    }
  }

  function startMonitoring(options = {}) {
    if (destroyed) return;
    if (options.continuous !== false) continuous = true;
    clearTimeout(timer);
    void checkEligibility();
  }

  function triggerVerifiedCheckFromSignal(value = {}) {
    const phase = String(value?.phase || value?.status || value?.runtimeStatus || value?.state?.phase || value?.state?.status || '').toLowerCase();
    const action = String(value?.action || value?.payload?.action || value?.type || '').toLowerCase();
    if (PROCESSING_STATES.has(phase) || ['finish','finalize','submit','complete','completed'].includes(action)) startMonitoring({continuous:true});
  }

  async function submitRating() {
    if (submitted || skipped) return;
    const comment = text($('feedbackComment')?.value, 2000);
    const hasRating = DIMENSIONS.some((dimension) => Number(ratings[dimension]) >= 1 && Number(ratings[dimension]) <= 5);
    if (!hasRating && !comment) {
      setContent('feedbackMessage', currentExperience().feedback.empty);
      $('feedbackMessage')?.classList.add('error');
      return;
    }
    const button = $('feedbackSubmitBtn');
    if (button) button.disabled = true;
    setContent('feedbackMessage', currentExperience().feedback.sending);
    $('feedbackMessage')?.classList.remove('error');
    try {
      const identityMode = document.querySelector('input[name="feedbackIdentityMode"]:checked')?.value === 'named' ? 'named' : 'anonymous';
      const result = await api('v2AppRating', {
        body:{
          uid:state.uid,
          token:state.token,
          submitNonce:nonceFor(state.uid),
          identityMode,
          overallRating:ratings.overallRating,
          clarityRating:ratings.clarityRating,
          usabilityRating:ratings.usabilityRating,
          technicalRating:ratings.technicalRating,
          comment,
          publicUseAllowed:$('feedbackPublicUse')?.checked === true,
          publicIdentityAllowed:identityMode === 'named' && $('feedbackPublicIdentity')?.checked === true,
          timeToSubmitMs:eligibilityStartedAt ? Date.now() - eligibilityStartedAt : 0,
          language:getLocale?.() || state.locale || 'en'
        },
        timeoutMs:18000
      });
      submitted = true;
      failedSubmissions = 0;
      showResult(result?.duplicate === true ? currentExperience().feedback.duplicate : currentExperience().feedback.sent, 'ok');
    } catch (_) {
      failedSubmissions += 1;
      setContent('feedbackMessage', currentExperience().feedback.failed);
      $('feedbackMessage')?.classList.add('error');
      setContent('feedbackSubmitBtn', currentExperience().feedback.retry);
    } finally {
      if (button) button.disabled = false;
    }
  }

  function skipRating() {
    if (submitted) return;
    skipped = true;
    showResult(currentExperience().feedback.optional, 'ok');
  }

  function closePage() {
    try { window.close(); } catch (_) {}
    setTimeout(() => {
      setContent('feedbackResultMessage', currentExperience().feedback.closeFallback);
      setHidden('feedbackResult', false);
    }, 250);
  }

  function selectRating(dimension, value) {
    if (!DIMENSIONS.includes(dimension)) return;
    const normalized = Math.max(1, Math.min(5, Number(value) || 0));
    ratings[dimension] = normalized;
    renderRatingState();
    setContent('feedbackMessage','');
  }

  function wire() {
    document.querySelectorAll('[data-rating-dimension][data-rating-value]').forEach((button) => {
      button.addEventListener('click', () => selectRating(button.dataset.ratingDimension, button.dataset.ratingValue));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
        event.preventDefault();
        const delta = ['ArrowRight','ArrowUp'].includes(event.key) ? 1 : -1;
        selectRating(button.dataset.ratingDimension, Math.max(1,Math.min(5,Number(button.dataset.ratingValue)+delta)));
        const next = document.querySelector('[data-rating-dimension="' + button.dataset.ratingDimension + '"][data-rating-value="' + ratings[button.dataset.ratingDimension] + '"]');
        next?.focus();
      });
    });
    document.querySelectorAll('input[name="feedbackIdentityMode"]').forEach((input) => input.addEventListener('change',setIdentityMode));
    $('feedbackPublicUse')?.addEventListener('change',setIdentityMode);
    $('feedbackSubmitBtn')?.addEventListener('click', () => { void submitRating(); });
    $('feedbackSkipBtn')?.addEventListener('click',skipRating);
    $('feedbackTechnicalBtn')?.addEventListener('click',hideLayerTemporarily);
    $('feedbackReturnBtn')?.addEventListener('click',restoreLayer);
    $('feedbackCloseBtn')?.addEventListener('click',closePage);
    window.addEventListener('message',(event) => {
      if (event.origin && event.origin !== window.location.origin) return;
      triggerVerifiedCheckFromSignal(event.data?.data || event.data || {});
    });
    window.addEventListener('clarity:processing-started',(event) => triggerVerifiedCheckFromSignal(event.detail || {status:'processing'}));
    document.addEventListener('visibilitychange',() => {
      if (!document.hidden && continuous) void checkEligibility();
    });
    if (typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(() => {
        const visibleProcessing = ['assessmentProcessingPanel','cvProcessingView','vpProcessingView'].some((id) => {
          const element = $(id);
          return element && !element.classList.contains('hidden');
        });
        if (visibleProcessing) startMonitoring({continuous:true});
      });
      ['assessmentProcessingPanel','cvProcessingView','vpProcessingView'].forEach((id) => {
        const element = $(id);
        if (element) observer.observe(element,{attributes:true,attributeFilter:['class']});
      });
    }
    setIdentityMode();
    applyLocale();
  }

  function destroy() {
    destroyed = true;
    continuous = false;
    clearTimeout(timer);
    observer?.disconnect();
  }

  wire();
  return { version:VERSION, applyLocale, startMonitoring, probe:() => startMonitoring({continuous:false}), destroy, showFormAgain };
}
