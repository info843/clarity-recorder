// CLARITY Assessment Universal App module v2.24.0 — E2.2 VIDEO Q10 READINESS + CONSENT
// Compact state deltas, one closeout dispatch, status-only polling and immediate
// fallback-report availability while the Unified PDF finishes asynchronously.
const COPY = Object.freeze({
  de: {
    assessment: {
      title: 'CLARITY Assessment', eyebrow: 'CLARITY Assessment · Schriftlich', badge: 'Sicherer Ablauf',
      intro: 'Beantworten Sie die Fragen möglichst konkret und in Ihren eigenen Worten. Beispiele helfen dabei, Ihre Angaben nachvollziehbar einzuordnen.',
      notice: 'Mit Enter senden Sie Ihre Antwort. Shift + Enter fügt einen Zeilenumbruch ein.',
      start: 'Assessment starten', preparing: 'Assessment wird vorbereitet …', ready: 'Assessment ist bereit.', starting: 'Assessment wird gestartet …', send: 'Antwort senden', finish: 'Assessment abschließen',
      processing: 'Ihre Antworten werden ausgewertet und der Bericht wird erstellt. Der Status wird automatisch aktualisiert.',
      completed: 'Assessment abgeschlossen', completedText: 'Ihre Antworten wurden sicher übermittelt. Das Unternehmen verarbeitet das Ergebnis im CLARITY Workspace. Sie können dieses Fenster schließen.',
      startTitle: 'Vorbereitung', startText: 'Planen Sie für jede Antwort ausreichend Zeit ein und nennen Sie möglichst konkrete Situationen oder Beispiele.'
    },
    snapshot: {
      title: 'CLARITY Snapshot', eyebrow: 'CLARITY Snapshot · Kurzcheck', badge: 'Kompakter Ablauf',
      intro: 'Beantworten Sie die vereinbarten Kurzfragen in eigenen Worten. Der Snapshot fasst die Antworten anschließend kompakt zusammen.',
      notice: 'Der Snapshot ist ein kurzer strukturierter Überblick und ersetzt kein vollständiges Assessment.',
      start: 'Snapshot starten', preparing: 'Snapshot wird vorbereitet …', ready: 'Snapshot ist bereit.', starting: 'Snapshot wird gestartet …', send: 'Antwort senden', finish: 'Snapshot abschließen',
      processing: 'Ihre Antworten werden zusammengefasst. Der Status wird automatisch aktualisiert.',
      completed: 'Snapshot abgeschlossen', completedText: 'Ihre Antworten wurden sicher übermittelt. Das Unternehmen erhält die Zusammenfassung im CLARITY Workspace. Sie können dieses Fenster schließen.',
      startTitle: 'Kurzer Überblick', startText: 'Beantworten Sie die Fragen kurz und konkret. Je nach Umfang dauert der Snapshot nur wenige Minuten.'
    },
    download: 'Bericht herunterladen', placeholder: 'Ihre Antwort …', answerRequired: 'Bitte geben Sie eine Antwort ein.',
    question: 'Frage', answered: 'beantwortet', area: 'Bereich', format: 'Format', shortCheck: 'Kurzcheck', scope: 'Umfang', process: 'Ablauf',
    processRule: 'Auswertung nach der letzten Antwort', retry: 'Status erneut prüfen', report: 'Bericht',
    waitingReport: 'Der Bericht wird noch vorbereitet. Die Seite prüft den Status weiter.',
    transport: 'Die Serverantwort ist noch unklar. Der tatsächliche Status wird geprüft.',
    readinessDelayed: 'Die Vorbereitung dauert länger als erwartet. Der Start bleibt gesperrt, bis alle Moduldaten vollständig geladen sind.',
    audioPreparing: 'Mikrofon und Audio-Modul werden vorbereitet …', audioReady: 'Mikrofon geprüft. Das Audio-Assessment ist bereit.',
    audioRecording: 'Audio-Assessment läuft. Bitte beantworten Sie jede Frage mündlich.',
    audioSaving: 'Ihre Audioantworten werden transkribiert und sicher gespeichert …',
    audioRetry: 'Eine Audioantwort konnte noch nicht gespeichert werden. Mit „Status erneut prüfen“ wird derselbe Vorgang ohne neue Abbuchung fortgesetzt.',
    microphoneRequired: 'Für das Audio-Assessment muss der Zugriff auf das Mikrofon erlaubt werden.',
    audioModuleUnavailable: 'Das Audio-Modul konnte nicht geladen werden. Bitte aktualisieren Sie die Seite. Es wurde noch keine Assessment-Session gestartet und kein Credit verbraucht.',
    videoPreparing: 'Video-Consent, Kamera und Mikrofon werden vorbereitet …', videoReady: 'Kamera und Mikrofon geprüft. Das Video-Assessment ist bereit.',
    videoRecording: 'Video-Assessment läuft. Bitte beantworten Sie jede Frage mündlich in die Kamera.',
    videoSaving: 'Ihre Videoantworten werden transkribiert und sicher gespeichert …',
    videoRetry: 'Eine Videoantwort oder die Videoaufnahme konnte noch nicht gespeichert werden. Mit „Status erneut prüfen“ wird derselbe Vorgang ohne neue Abbuchung fortgesetzt.',
    videoConsentRequired: 'Bitte bestätigen Sie die Video- und Audioaufnahme. Erst danach werden Kamera und Mikrofon geprüft.',
    videoConsentLabel: 'Ich stimme der Video- und Audioaufnahme für dieses CLARITY Assessment zu.',
    videoModuleUnavailable: 'Das Video-Modul konnte nicht geladen werden. Bitte aktualisieren Sie die Seite. Es wurde noch keine Assessment-Session gestartet und kein Credit verbraucht.'
  },
  en: {
    assessment: {
      title: 'CLARITY Assessment', eyebrow: 'CLARITY Assessment · Written', badge: 'Secure workflow',
      intro: 'Answer the questions as concretely as possible and in your own words. Examples help make your information easier to assess.',
      notice: 'Press Enter to send your answer. Shift + Enter inserts a new line.',
      start: 'Start assessment', preparing: 'Preparing assessment …', ready: 'Assessment is ready.', starting: 'Starting assessment …', send: 'Send answer', finish: 'Complete assessment',
      processing: 'Your answers are being evaluated and the report is being created. The status updates automatically.',
      completed: 'Assessment completed', completedText: 'Your responses were submitted securely. The organisation will review the result in CLARITY Workspace. You can close this window.',
      startTitle: 'Preparation', startText: 'Take sufficient time for each answer and provide concrete situations or examples where possible.'
    },
    snapshot: {
      title: 'CLARITY Snapshot', eyebrow: 'CLARITY Snapshot · Quick check', badge: 'Concise workflow',
      intro: 'Answer the agreed short questions in your own words. The Snapshot then creates a concise summary.',
      notice: 'The Snapshot is a short structured overview and does not replace a full assessment.',
      start: 'Start Snapshot', preparing: 'Preparing Snapshot …', ready: 'Snapshot is ready.', starting: 'Starting Snapshot …', send: 'Send answer', finish: 'Complete Snapshot',
      processing: 'Your answers are being summarized. The status updates automatically.',
      completed: 'Snapshot completed', completedText: 'Your responses were submitted securely. The organisation receives the summary in CLARITY Workspace. You can close this window.',
      startTitle: 'Quick overview', startText: 'Answer briefly and concretely. Depending on the scope, the Snapshot takes only a few minutes.'
    },
    download: 'Download report', placeholder: 'Your answer …', answerRequired: 'Please enter an answer.',
    question: 'Question', answered: 'answered', area: 'Area', format: 'Format', shortCheck: 'Quick check', scope: 'Scope', process: 'Process',
    processRule: 'Evaluation after the final answer', retry: 'Check status again', report: 'Report',
    waitingReport: 'The report is still being prepared. This page continues checking the status.',
    transport: 'The server response is still unclear. The actual status is being checked.',
    readinessDelayed: 'Preparation is taking longer than expected. Start remains locked until all module data is fully loaded.',
    audioPreparing: 'Preparing microphone and audio module …', audioReady: 'Microphone checked. The audio assessment is ready.',
    audioRecording: 'Audio assessment is running. Please answer each question verbally.',
    audioSaving: 'Your audio responses are being transcribed and stored securely …',
    audioRetry: 'An audio response has not been stored yet. “Check status again” continues the same record without a new charge.',
    microphoneRequired: 'Microphone access must be allowed for the audio assessment.',
    audioModuleUnavailable: 'The audio module could not be loaded. Refresh the page. No assessment session was started and no credit was consumed.',
    videoPreparing: 'Preparing video consent, camera and microphone …', videoReady: 'Camera and microphone checked. The video assessment is ready.',
    videoRecording: 'Video assessment is running. Please answer each question verbally on camera.',
    videoSaving: 'Your video responses are being transcribed and stored securely …',
    videoRetry: 'A video response or the video recording has not been stored yet. “Check status again” continues the same record without a new charge.',
    videoConsentRequired: 'Confirm video and audio recording first. Camera and microphone are checked only after confirmation.',
    videoConsentLabel: 'I consent to video and audio recording for this CLARITY Assessment.',
    videoModuleUnavailable: 'The video module could not be loaded. Refresh the page. No assessment session was started and no credit was consumed.'
  }
});

function isAmbiguous(error) {
  const value = `${error?.code || ''} ${error?.message || error || ''}`.toLowerCase();
  return /failed to fetch|network|timeout|timed out|http_50[234]|gateway|load failed/.test(value);
}

function normalizeUiState(input = {}) {
  const next = { ...(input || {}) };
  const hasReport = next.report?.available === true ||
    Boolean(
      next.report?.preferredPdfUrl ||
      next.report?.unifiedPdfUrl ||
      next.report?.legacyPdfUrl
    );

  const retryPending =
    next.retryPending === true ||
    ['queued', 'processing', 'retry_wait', 'leased']
      .includes(String(next.closeoutStatus || '').toLowerCase());

  if (next.completed === true || hasReport) {
    next.phase = 'completed';
    next.completed = true;
    next.failed = false;
  } else if (next.phase === 'failed' && retryPending) {
    next.phase = 'processing';
    next.failed = false;
  }

  return next;
}

function shouldAdoptState(current, next) {
  if (!current) return true;
  const currentPhase = String(current.phase || '');
  const nextPhase = String(next.phase || '');
  if (currentPhase === 'completed' && nextPhase !== 'completed') return false;
  if (nextPhase === 'failed' && (
    current.completed === true ||
    current.report?.available === true ||
    next.report?.available === true
  )) return false;
  return true;
}

function mergeHistory(base = [], delta = []) {
  const out = Array.isArray(base) ? [...base] : [];
  const seen = new Set(out.map((item) => [item?.role, item?.questionIndex, item?.text].join('|')));
  for (const item of (Array.isArray(delta) ? delta : [])) {
    const signature = [item?.role, item?.questionIndex, item?.text].join('|');
    if (!item?.text || seen.has(signature)) continue;
    seen.add(signature);
    out.push(item);
  }
  return out.slice(-200);
}

export function createAssessmentModule(ctx) {
  const { $, state, api, show, setStep, getLocale, onFatal } = ctx;
  let busy = false;
  let polling = false;
  let pollTimer = 0;
  let current = null;
  let closeoutStarted = false;
  let pollStartedAt = 0;
  let fallbackAllowed = false;
  let closeoutKickInFlight = false;
  let closeoutKickSessionId = '';
  let lastHistorySignature = '';
  let unifiedInspectionPolls = 0;
  let moduleReady = false;
  let readinessTimer = 0;
  let readinessStartedAt = 0;
  let readinessAttempt = 0;
  let mediaFrame = null;
  let mediaShell = null;
  let mediaIframeReady = false;
  let mediaPrepared = false;
  let mediaRecordStarted = false;
  let mediaEnded = false;
  let mediaFinalizeStarted = false;
  let mediaTurnChain = Promise.resolve();
  let mediaTurnCount = 0;
  let mediaResultDeferred = null;
  let mediaResultPromise = null;
  let mediaResultResolve = null;
  let mediaResultReject = null;
  let mediaFatalError = null;
  let mediaLoadTimer = 0;
  let mediaRouteIndex = 0;
  let lastMediaResultPayload = null;
  let videoConsentControl = null;
  const failedMediaTurns = new Map();

  const product = () => String(state.payload?.runtime?.productKey || '').toLowerCase();
  const runtimeMode = () => String(current?.mode || state.payload?.runtime?.mode || state.payload?.runtime?.workflowSnapshot?.mode || 'chat').toLowerCase().replace(/[+\s-]+/g, '_');
  const isAudioMode = () => product() === 'assessment' && runtimeMode() === 'audio';
  const isVideoMode = () => product() === 'assessment' && runtimeMode() === 'video';
  const isMediaMode = () => isAudioMode() || isVideoMode();
  const mediaCopy = (audioKey, videoKey) => isVideoMode() ? L()[videoKey] : L()[audioKey];
  const L = () => {
    const base = COPY[getLocale() === 'de' ? 'de' : 'en'];
    return { ...base, ...(product() === 'snapshot' ? base.snapshot : base.assessment) };
  };
  const endpoint = (name) => `v2Assessment${name}`;
  const MEDIA_RECORDER_ROUTES = Object.freeze({
    audio: ['/modules/assessment-audio-recorder.html', '/live.assessment.html'],
    video: ['/modules/assessment-video-recorder.html', '/live.assessment.html']
  });

  function resolvedCompanyId() {
    const runtime = state.payload?.runtime || {};
    return String(
      current?.runtime?.companyId ||
      current?.companyId ||
      runtime.companyId ||
      state.payload?.companyId ||
      state.payload?.link?.companyId ||
      runtime.brandingSnapshot?.companyId ||
      state.payload?.brandingSnapshot?.companyId ||
      ''
    ).trim();
  }

  function createDeferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
  }

  function mediaRuntimeContext() {
    const runtime = state.payload?.runtime || {};
    const media = current?.media || {};
    const questions = Array.isArray(media.questions)
      ? media.questions.map((item, index) => ({
          index: Number(item?.index || index + 1),
          question: String(item?.question || item?.text || '').trim(),
          text: String(item?.question || item?.text || '').trim(),
          source: String(item?.source || 'clarity_ai')
        })).filter((item) => item.question)
      : [];
    return {
      uid: state.uid,
      linkId: state.uid,
      companyId: resolvedCompanyId(),
      sessionId: String(current?.sessionId || '').trim(),
      mode: isVideoMode() ? 'video' : 'audio',
      assessmentMode: isVideoMode() ? 'video' : 'audio',
      productKey: 'assessment',
      productType: 'modul1',
      moduleArea: current?.moduleArea || runtime.moduleArea || runtime.configurationSnapshot?.moduleArea || 'personality',
      questionCount: Number(current?.questionCount || media.questionCount || questions.length || 10),
      totalQuestionCount: Number(current?.questionCount || media.questionCount || questions.length || 10),
      mediaQuestionCount: Number(current?.questionCount || media.questionCount || questions.length || 10),
      assessmentQuestionSnapshot: questions,
      questions,
      position: runtime.position || runtime.configurationSnapshot?.position || '',
      userCommLang: getLocale(),
      reportLang: runtime.reportLang || getLocale(),
      lang: getLocale(),
      startQuestionIndex: Math.max(1, Number(current?.answeredCount || 0) + 1)
    };
  }

  function postToMedia(type, data = {}) {
    try {
      mediaFrame?.contentWindow?.postMessage?.({ type, data }, window.location.origin);
    } catch (_) {
      try { mediaFrame?.contentWindow?.postMessage?.({ type, data }, '*'); } catch (_) {}
    }
  }

  function clearMediaLoadTimer() {
    if (mediaLoadTimer) window.clearTimeout(mediaLoadTimer);
    mediaLoadTimer = 0;
  }

  function mediaRecorderUrl(route) {
    const runtime = state.payload?.runtime || {};
    const query = new URLSearchParams({
      uid: state.uid,
      companyId: resolvedCompanyId(),
      mode: isVideoMode() ? 'video' : 'audio',
      audioOnly: isVideoMode() ? '0' : '1',
      autostart: '0',
      lang: getLocale(),
      reportLang: String(runtime.reportLang || getLocale())
    });
    return `${route}?${query.toString()}`;
  }

  function loadMediaRecorderRoute(index = 0) {
    if (!mediaFrame) return;
    clearMediaLoadTimer();
    mediaIframeReady = false;
    mediaPrepared = false;
    mediaRouteIndex = Math.max(0, Number(index || 0));
    const routes = MEDIA_RECORDER_ROUTES[isVideoMode() ? 'video' : 'audio'];
    const route = routes[mediaRouteIndex];
    if (!route) {
      const error = new Error(isVideoMode() ? L().videoModuleUnavailable : L().audioModuleUnavailable);
      error.code = isVideoMode() ? 'ASSESSMENT_VIDEO_MODULE_NOT_DEPLOYED' : 'ASSESSMENT_AUDIO_MODULE_NOT_DEPLOYED';
      error.retryable = true;
      mediaFatalError = error;
      mediaFrame.style.display = 'none';
      syncButtonStates();
      status(error.message, 'err');
      return;
    }

    mediaFrame.style.display = 'none';
    mediaFrame.src = mediaRecorderUrl(route);
    mediaLoadTimer = window.setTimeout(() => {
      mediaLoadTimer = 0;
      if (mediaIframeReady) return;
      if (mediaRouteIndex + 1 < routes.length) {
        loadMediaRecorderRoute(mediaRouteIndex + 1);
        return;
      }
      const error = new Error(isVideoMode() ? L().videoModuleUnavailable : L().audioModuleUnavailable);
      error.code = isVideoMode() ? 'ASSESSMENT_VIDEO_MODULE_NOT_DEPLOYED' : 'ASSESSMENT_AUDIO_MODULE_NOT_DEPLOYED';
      error.retryable = true;
      mediaFatalError = error;
      mediaFrame.style.display = 'none';
      syncButtonStates();
      status(error.message, 'err');
    }, 7000);
  }

  function ensureMediaFrame() {
    if (!isMediaMode()) return null;
    if (mediaFrame?.isConnected) return mediaFrame;

    mediaShell = document.getElementById('clarityAssessmentMediaShell');
    if (!mediaShell) {
      mediaShell = document.createElement('section');
      mediaShell.id = 'clarityAssessmentMediaShell';
      mediaShell.className = 'clarity-assessment-media-shell';
      const heading = document.createElement('div');
      heading.className = 'clarity-assessment-media-heading';
      heading.textContent = isVideoMode() ? (getLocale() === 'de' ? 'Video-Assessment' : 'Video assessment') : (getLocale() === 'de' ? 'Audio-Assessment' : 'Audio assessment');
      mediaFrame = document.createElement('iframe');
      mediaFrame.id = 'clarityAssessmentMediaFrame';
      mediaFrame.title = isVideoMode() ? (getLocale() === 'de' ? 'CLARITY Video-Assessment' : 'CLARITY video assessment') : (getLocale() === 'de' ? 'CLARITY Audio-Assessment' : 'CLARITY audio assessment');
      mediaFrame.allow = isVideoMode() ? 'camera; microphone; autoplay' : 'microphone; autoplay';
      mediaFrame.referrerPolicy = 'strict-origin-when-cross-origin';
      mediaFrame.loading = 'eager';
      mediaShell.append(heading, mediaFrame);
      loadMediaRecorderRoute(0);

      const startPanel = $('assessmentStartPanel');
      const parent = startPanel?.parentNode || $('assessmentView');
      if (parent && startPanel) parent.insertBefore(mediaShell, startPanel);
      else parent?.appendChild?.(mediaShell);
    } else {
      mediaFrame = mediaShell.querySelector('iframe');
    }
    return mediaFrame;
  }

  function videoConsentAccepted() {
    return !isVideoMode() || videoConsentControl?.querySelector('input')?.checked === true;
  }

  function ensureVideoConsentControl() {
    if (!isVideoMode()) return null;
    if (videoConsentControl?.isConnected) return videoConsentControl;
    videoConsentControl = document.createElement('section');
    videoConsentControl.id = 'clarityAssessmentVideoConsent';
    videoConsentControl.className = 'clarity-assessment-video-consent';
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'clarityAssessmentVideoConsentCheckbox';
    const copy = document.createElement('span');
    copy.textContent = L().videoConsentLabel;
    label.append(checkbox, copy);
    videoConsentControl.append(label);
    const startPanel = $('assessmentStartPanel');
    startPanel?.parentNode?.insertBefore(videoConsentControl, startPanel);
    checkbox.addEventListener('change', () => {
      syncButtonStates();
      if (checkbox.checked) {
        ensureMediaFrame();
        if (mediaIframeReady) {
          postToMedia('clarity.live.context', mediaRuntimeContext());
          postToMedia('clarity.live.prepare', { enabled:true });
          status(L().videoPreparing, 'warn');
        }
      } else {
        mediaPrepared = false;
        status(L().videoConsentRequired, 'warn');
      }
    });
    return videoConsentControl;
  }

  function requestMediaPreparation() {
    if (!isMediaMode() || !mediaIframeReady) return;
    if (isVideoMode() && !videoConsentAccepted()) {
      status(L().videoConsentRequired, 'warn');
      return;
    }
    postToMedia('clarity.live.context', mediaRuntimeContext());
    postToMedia('clarity.live.prepare', { enabled:true });
    status(mediaCopy('audioPreparing','videoPreparing'), 'warn');
  }

  function resetMediaState({ keepFrame = true } = {}) {
    clearMediaLoadTimer();
    mediaRouteIndex = 0;
    mediaIframeReady = false;
    mediaPrepared = false;
    mediaRecordStarted = false;
    mediaEnded = false;
    mediaFinalizeStarted = false;
    mediaTurnChain = Promise.resolve();
    mediaTurnCount = 0;
    mediaFatalError = null;
    lastMediaResultPayload = null;
    failedMediaTurns.clear();
    const deferred = createDeferred();
    mediaResultDeferred = deferred;
    mediaResultPromise = deferred.promise;
    mediaResultResolve = deferred.resolve;
    mediaResultReject = deferred.reject;
    if (!keepFrame && mediaShell) {
      try { mediaShell.remove(); } catch (_) {}
      mediaShell = null;
      mediaFrame = null;
    }
  }

  async function withMediaRetry(operation, maxAttempts = 3) {
    let lastError = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        return await operation(attempt);
      } catch (error) {
        lastError = error;
        const retryable = isAmbiguous(error) ||
          error?.retryable === true ||
          error?.details?.retryable === true ||
          ['ASSESSMENT_TRANSCRIPTION_RATE_LIMITED','ASSESSMENT_TRANSCRIPTION_FAILED']
            .includes(String(error?.code || ''));
        if (!retryable || attempt >= maxAttempts) throw error;
        await new Promise((resolve) => window.setTimeout(resolve, 900 * attempt));
      }
    }
    throw lastError || new Error('Assessment media operation failed.');
  }

  async function persistMediaTurn(payload = {}) {
    const questionIndex = Number(payload.questionIndex || 0);
    if (!questionIndex || !payload.dataUrl) throw new Error('Assessment media answer payload is incomplete.');
    const body = {
      token: state.token,
      uid: state.uid,
      sessionId: current?.sessionId || '',
      questionIndex,
      question: payload.question || '',
      dataUrl: payload.dataUrl,
      mimeType: payload.mimeType || 'audio/webm',
      durationMs: Number(payload.durationMs || 0),
      mediaTurnId: payload.mediaTurnId || `${state.uid}:${isVideoMode() ? 'video' : 'audio'}-slot:${questionIndex}`,
      idempotencyKey: payload.mediaTurnId || `${state.uid}:${isVideoMode() ? 'video' : 'audio'}-slot:${questionIndex}`,
      captureSource: isVideoMode() ? 'video' : 'audio',
      language: getLocale(),
      companyId: resolvedCompanyId(),
      noSpeechDetected: payload.noSpeechDetected === true,
      voiceDetected: payload.voiceDetected !== false,
      voiceActivityMs: Number(payload.voiceActivityMs || 0)
    };
    const saved = await withMediaRetry(() => api(endpoint('MediaTurn'), { body }), 3);
    failedMediaTurns.delete(questionIndex);
    mediaTurnCount = Math.max(mediaTurnCount, Number(saved?.state?.answeredCount || questionIndex));
    if (saved?.state) render(saved.state);
    return saved;
  }

  async function persistMediaResult(payload = {}) {
    if (payload?.mux?.error && !payload?.mux?.playbackId && !payload?.mux?.downloadUrl && !payload?.mux?.audioOnlyUrl) {
      const error = new Error(payload.mux.error);
      error.code = 'ASSESSMENT_MEDIA_UPLOAD_FAILED';
      error.retryable = true;
      throw error;
    }
    const companyId = resolvedCompanyId();
    if (!companyId) {
      const error = new Error(getLocale() === 'de'
        ? 'Der Unternehmenskontext des Medien-Assessments ist noch nicht vollständig geladen.'
        : 'The Assessment company context has not finished loading.');
      error.code = 'ASSESSMENT_COMPANY_CONTEXT_MISSING';
      error.retryable = true;
      throw error;
    }
    const body = {
      ...payload,
      token: state.token,
      uid: state.uid,
      companyId,
      sessionId: current?.sessionId || payload.sessionId || '',
      mode: isVideoMode() ? 'video' : 'audio',
      platformManaged: true
    };
    return withMediaRetry(() => api(endpoint('MediaResult'), { body }), 3);
  }

  async function waitForMediaResult(timeoutMs = 150000) {
    if (!mediaResultPromise) {
      const deferred = createDeferred();
      mediaResultDeferred = deferred;
      mediaResultPromise = deferred.promise;
      mediaResultResolve = deferred.resolve;
      mediaResultReject = deferred.reject;
    }
    return Promise.race([
      mediaResultPromise,
      new Promise((_, reject) => window.setTimeout(() => {
        const error = new Error(getLocale() === 'de'
          ? (isVideoMode() ? 'Die Video-Datei wird noch verarbeitet. Bitte prüfen Sie den Status erneut.' : 'Die Audio-Datei wird noch verarbeitet. Bitte prüfen Sie den Status erneut.')
          : (isVideoMode() ? 'The video file is still processing. Please check the status again.' : 'The audio file is still processing. Please check the status again.'));
        error.code = 'ASSESSMENT_MEDIA_RESULT_TIMEOUT';
        error.retryable = true;
        reject(error);
      }, timeoutMs))
    ]);
  }

  async function finalizeMediaAssessment() {
    if (!isMediaMode() || mediaFinalizeStarted || !mediaEnded) return;
    mediaFinalizeStarted = true;
    status(mediaCopy('audioSaving','videoSaving'), 'warn');
    try {
      await mediaTurnChain;
      if (failedMediaTurns.size) {
        const error = new Error(mediaCopy('audioRetry','videoRetry'));
        error.code = 'ASSESSMENT_MEDIA_TURNS_INCOMPLETE';
        error.retryable = true;
        throw error;
      }
      await waitForMediaResult();
      const expected = Number(current?.expectedAnswers || current?.questionCount || 10);
      const refreshed = await readStatus({ includeHistory: false, includeReportLookup: false });
      if (Number(refreshed?.answeredCount || 0) < expected) {
        const error = new Error(mediaCopy('audioRetry','videoRetry'));
        error.code = 'ASSESSMENT_MEDIA_TRANSCRIPTS_INCOMPLETE';
        error.retryable = true;
        throw error;
      }
      mediaFinalizeStarted = false;
      await finish();
    } catch (error) {
      mediaFinalizeStarted = false;
      mediaFatalError = error;
      closeoutStarted = false;
      $('assessmentProcessingPanel')?.classList.remove('hidden');
      $('assessmentRetryBtn')?.classList.remove('hidden');
      status(error.message || mediaCopy('audioRetry','videoRetry'), 'err');
    }
  }

  async function retryFailedMedia() {
    if (!isMediaMode()) return false;
    const pending = [...failedMediaTurns.values()];
    if (!pending.length && !mediaFatalError && !lastMediaResultPayload) return false;
    mediaFatalError = null;
    status(mediaCopy('audioSaving','videoSaving'), 'warn');
    for (const payload of pending) {
      await persistMediaTurn(payload);
    }
    if (lastMediaResultPayload) {
      const saved = await persistMediaResult(lastMediaResultPayload);
      if (saved?.state) render(saved.state);
      mediaResultResolve?.(saved);
      mediaResultPromise = Promise.resolve(saved);
      lastMediaResultPayload = null;
    }
    mediaFinalizeStarted = false;
    await finalizeMediaAssessment();
    return true;
  }

  function handleMediaMessage(event) {
    if (!isMediaMode() || !mediaFrame || event.source !== mediaFrame.contentWindow) return;
    const message = event?.data || {};
    const type = String(message.type || '');
    const data = message.data || message.payload || {};

    if (type === 'clarity.live.ready') {
      clearMediaLoadTimer();
      mediaIframeReady = true;
      mediaFrame.style.display = 'block';
      postToMedia('clarity.live.context', mediaRuntimeContext());
      requestMediaPreparation();
      return;
    }

    if (type === 'clarity.live.prepared') {
      mediaPrepared = true;
      postToMedia('clarity.live.context', mediaRuntimeContext());
      syncButtonStates();
      status(moduleReady ? mediaCopy('audioReady','videoReady') : L().preparing, moduleReady ? 'ok' : 'warn');
      return;
    }

    if (type === 'candidate-audio:slot-finished') {
      const questionIndex = Number(data.questionIndex || 0);
      failedMediaTurns.set(questionIndex, data);
      mediaTurnChain = mediaTurnChain
        .then(() => persistMediaTurn(data))
        .catch((error) => {
          mediaFatalError = error;
          status(error.message || mediaCopy('audioRetry','videoRetry'), 'err');
        });
      return;
    }

    if (type === 'candidate-audio:error' || type === 'clarity.live.error') {
      const error = new Error(String(data.message || L().microphoneRequired));
      error.code = String(data.code || (isVideoMode() ? 'ASSESSMENT_VIDEO_DEVICE_ERROR' : 'ASSESSMENT_AUDIO_DEVICE_ERROR'));
      error.retryable = true;
      mediaFatalError = error;
      if (!mediaRecordStarted) {
        mediaPrepared = false;
        syncButtonStates();
      }
      status(error.message, 'err');
      return;
    }

    if (type === 'recorder:finished') {
      lastMediaResultPayload = data;
      const operation = persistMediaResult(data)
        .then((saved) => {
          if (saved?.state) render(saved.state);
          mediaResultResolve?.(saved);
          lastMediaResultPayload = null;
          return saved;
        })
        .catch((error) => {
          mediaFatalError = error;
          mediaResultReject?.(error);
          status(error.message || mediaCopy('audioRetry','videoRetry'), 'err');
          throw error;
        });
      mediaResultPromise = operation;
      // The promise is intentionally retained for finalizeMediaAssessment(). Attach a
      // terminal observer so a recorder failure is not emitted as an unhandled rejection.
      operation.catch(() => null);
      return;
    }

    if (type === 'clarity.live.ended') {
      mediaEnded = true;
      $('assessmentProcessingPanel')?.classList.remove('hidden');
      status(mediaCopy('audioSaving','videoSaving'), 'warn');
      window.setTimeout(() => finalizeMediaAssessment(), 100);
    }
  }

  function areaLabel(value) {
    const normalized = String(value || '').toLowerCase();
    const de = getLocale() === 'de';
    const labels = de
      ? { aptitude: 'Kognitive Fähigkeiten', personality: 'Persönlichkeit', skills: 'Fachliche Kompetenzen', language: 'Sprachkompetenz' }
      : { aptitude: 'Cognitive abilities', personality: 'Personality', skills: 'Professional skills', language: 'Language proficiency' };
    return labels[normalized] || value || (de ? 'Allgemein' : 'General');
  }

  function reportIdentity() {
    return { token: state.token, uid: state.uid, sessionId: current?.sessionId || '', resultId: current?.report?.resultId || '' };
  }


  function ensureAssessmentStyles() {
    if (document.getElementById('clarity-assessment-contrast-v218')) return;
    const style = document.createElement('style');
    style.id = 'clarity-assessment-contrast-v218';
    style.textContent = `
      #assessmentView .assessment-meta-grid>div{background:#f8fafc!important;border-color:#d7e1ef!important}
      #assessmentView .assessment-meta-grid span{color:#475467!important}
      #assessmentView .assessment-meta-grid strong{color:#101828!important}
      #assessmentView .assessment-message{box-shadow:0 12px 28px rgba(2,12,27,.18)}
      #assessmentView .assessment-message.assistant{background:linear-gradient(145deg,#102a4e,#0b1d3a)!important;border-color:rgba(34,211,238,.58)!important;color:#f4f8ff!important}
      #assessmentView .assessment-message.user{background:linear-gradient(145deg,#253b86,#73256f)!important;border-color:rgba(236,72,153,.62)!important;color:#ffffff!important}
      #assessmentView .assessment-message span{color:#9eeaf5!important}
      #assessmentView .assessment-message.user span{color:#ffd3ef!important}
      #assessmentView .assessment-message p{color:inherit!important}
      #assessmentView .assessment-composer textarea{background:#ffffff!important;color:#101828!important;caret-color:#101828!important;border-color:#cbd5e1!important}
      #assessmentView .assessment-composer textarea::placeholder{color:#667085!important;opacity:1}
      #assessmentView .assessment-composer textarea:focus{border-color:#22d3ee!important;box-shadow:0 0 0 4px rgba(34,211,238,.14)!important}
      #assessmentView .clarity-assessment-media-shell{margin:18px 0;border:1px solid rgba(34,211,238,.28);border-radius:24px;overflow:hidden;background:#071526;box-shadow:0 20px 48px rgba(2,12,27,.28)}
      #assessmentView .clarity-assessment-media-heading{padding:14px 18px;color:#f8fafc;font-weight:800;border-bottom:1px solid rgba(148,163,184,.18)}
      #assessmentView .clarity-assessment-media-shell iframe{display:block;width:100%;min-height:560px;border:0;background:#fff}
      #assessmentView.media-mode #assessmentMessages,#assessmentView.media-mode #assessmentComposer{display:none!important}
      #assessmentView.media-mode .clarity-assessment-media-shell.hidden{display:none!important}
      #assessmentView.video-mode .clarity-assessment-media-shell iframe{min-height:680px}
      #assessmentView .clarity-assessment-video-consent{margin:16px 0;padding:16px 18px;border:1px solid rgba(34,211,238,.34);border-radius:18px;background:rgba(7,21,38,.72);color:#f8fafc}
      #assessmentView .clarity-assessment-video-consent label{display:flex;gap:12px;align-items:flex-start;font-weight:700;line-height:1.45;cursor:pointer}
      #assessmentView .clarity-assessment-video-consent input{margin-top:3px;width:18px;height:18px;accent-color:#22d3ee}
    `;
    document.head.appendChild(style);
  }

  function status(text, type = '') {
    const el = $('assessmentStatus');
    if (!el) return;
    el.textContent = text || '';
    el.className = `status ${type}`.trim();
  }

  function startAllowed() {
    return current?.phase === 'not_started' &&
      current?.readiness?.startAllowed === true &&
      moduleReady === true &&
      (!isMediaMode() || (mediaIframeReady === true && mediaPrepared === true && videoConsentAccepted()));
  }

  function syncButtonStates() {
    const startButton = $('assessmentStartBtn');
    if (startButton) {
      startButton.disabled = busy || !startAllowed();
      startButton.setAttribute('aria-disabled', startButton.disabled ? 'true' : 'false');
      startButton.setAttribute('aria-busy', busy ? 'true' : 'false');
      startButton.textContent = startAllowed() ? L().start : (isMediaMode() ? mediaCopy('audioPreparing','videoPreparing') : L().preparing);
    }
    ['assessmentSendBtn','assessmentFinishBtn','assessmentRetryBtn'].forEach((id) => {
      const el = $(id);
      if (el) el.disabled = busy;
    });
  }

  function setBusy(value, button = null) {
    busy = value;
    syncButtonStates();
    if (button) button.classList.toggle('busy', value);
  }

  function clearReadinessPoll() {
    if (readinessTimer) window.clearTimeout(readinessTimer);
    readinessTimer = 0;
    readinessStartedAt = 0;
    readinessAttempt = 0;
  }

  function adoptReadiness(data = {}) {
    const phase = String(data.phase || current?.phase || 'not_started');
    const readiness = data.readiness || current?.readiness || {};
    moduleReady = phase === 'not_started' && readiness.startAllowed === true;
    syncButtonStates();
    if (phase === 'not_started') {
      if (moduleReady && (!isMediaMode() || (mediaPrepared && videoConsentAccepted()))) status(isMediaMode() ? mediaCopy('audioReady','videoReady') : L().ready, 'ok');
      else if (!busy) status(isVideoMode() && !videoConsentAccepted() ? L().videoConsentRequired : (isMediaMode() ? mediaCopy('audioPreparing','videoPreparing') : L().preparing), 'warn');
    } else {
      clearReadinessPoll();
    }
  }

  function clearPoll() {
    if (pollTimer) window.clearTimeout(pollTimer);
    pollTimer = 0;
    polling = false;
    pollStartedAt = 0;
  }

  function renderHistory(history = []) {
    const signature = (Array.isArray(history) ? history : []).map((item) => `${item?.role || ''}|${item?.questionIndex || 0}|${item?.text || ''}`).join('¶');
    if (signature === lastHistorySignature) return;
    lastHistorySignature = signature;
    const box = $('assessmentMessages');
    box.replaceChildren();
    history.forEach((entry) => {
      const row = document.createElement('div');
      row.className = `assessment-message ${entry.role === 'assistant' ? 'assistant' : 'user'}`;
      const label = document.createElement('span');
      label.textContent = entry.role === 'assistant' ? (entry.questionIndex ? `${L().question} ${entry.questionIndex}` : 'CLARITY') : (getLocale() === 'de' ? 'Ihre Antwort' : 'Your answer');
      const body = document.createElement('p');
      body.textContent = entry.text || '';
      row.append(label, body);
      box.append(row);
    });
    box.scrollTop = box.scrollHeight;
  }

  function renderMeta(data) {
    $('assessmentArea').textContent = product() === 'snapshot' ? L().shortCheck : areaLabel(data.moduleArea || 'personality');
    $('assessmentScope').textContent = `${data.questionCount || 0} ${getLocale() === 'de' ? 'Fragen' : 'questions'}`;
    $('assessmentCredit').textContent = L().processRule;
    const answered = Number(data.answeredCount || 0);
    const expected = Math.max(1, Number(data.expectedAnswers || data.questionCount || 1));
    const pct = Math.min(100, Math.round((answered / expected) * 100));
    $('assessmentProgressBar').style.width = `${pct}%`;
    $('assessmentProgressText').textContent = `${answered} / ${expected} ${L().answered}`;
  }

  function render(data) {
    const next = normalizeUiState(data || current || {});
    if (!shouldAdoptState(current, next)) return;
    const previous = current || {};
    const history = Array.isArray(next.history)
      ? next.history
      : mergeHistory(previous.history || [], next.historyDelta || []);
    current = {
      ...previous,
      ...next,
      report: { ...(previous.report || {}), ...(next.report || {}) },
      timing: { ...(previous.timing || {}), ...(next.timing || {}) },
      history
    };
    renderMeta(current);
    renderHistory(current.history || []);
    adoptReadiness(current);
    const phase = current.phase || 'not_started';
    const notStarted = phase === 'not_started';
    const running = phase === 'running';
    const processing = phase === 'processing';
    const completed = phase === 'completed';
    const failed = phase === 'failed';
    const media = isMediaMode();
    const video = isVideoMode();
    $('assessmentView')?.classList.toggle('media-mode', media);
    $('assessmentView')?.classList.toggle('video-mode', video);
    if (video) ensureVideoConsentControl();
    if (media) ensureMediaFrame();
    videoConsentControl?.classList.toggle('hidden', !video || !notStarted);
    mediaShell?.classList.toggle('hidden', !media || processing || completed || failed);
    $('assessmentStartPanel').classList.toggle('hidden', !notStarted);
    $('assessmentChatPanel').classList.toggle('hidden', media || !(running || processing));
    $('assessmentProcessingPanel').classList.toggle('hidden', !(processing || failed));
    $('assessmentCompletePanel').classList.toggle('hidden', !completed);
    $('assessmentComposer').classList.toggle('hidden', media || !running);
    const allAnswered = Number(current.answeredCount || 0) >= Number(current.expectedAnswers || current.questionCount || 1);
    $('assessmentFinishBtn').classList.toggle('hidden', media || !running || !allAnswered);
    $('assessmentSendBtn').classList.toggle('hidden', media || !running || allAnswered);
    if (media && running && mediaRecordStarted) status(mediaCopy('audioRecording','videoRecording'), 'ok');
    if (completed) {
      closeoutStarted = true;
      clearPoll();

      const source = $('assessmentReportSource');
      const button = $('assessmentReportBtn');
      if (source) source.classList.add('hidden');
      if (button) button.classList.add('hidden');
      const reportRow = button?.closest?.('.assessment-report-card, .report-card, .actions, .assessment-report-row');
      if (reportRow) reportRow.classList.add('hidden');

      status(L().completedText, 'ok');
    } else if (failed) {
      status(getLocale() === 'de' ? 'Die Verarbeitung wurde technisch unterbrochen. Mit „Status erneut prüfen“ wird derselbe Vorgang ohne neue Abbuchung fortgesetzt.' : 'Processing was interrupted technically. “Check status again” continues the same record without a new charge.', 'err');
    } else if (processing) {
      status(L().processing, 'warn');
    } else if (running) {
      status(media && mediaRecordStarted ? mediaCopy('audioRecording','videoRecording') : '', media && mediaRecordStarted ? 'ok' : '');
    }
  }

  function kickCloseout(force = false) {
    const sessionId = current?.sessionId || '';
    if (!sessionId || closeoutKickInFlight) return;
    if (!force && closeoutKickSessionId === sessionId) return;

    closeoutKickSessionId = sessionId;
    closeoutKickInFlight = true;

    // Process is a non-blocking 202 trigger. Polling remains the only source of
    // participant-facing status and never starts a second worker automatically.
    Promise.resolve(api(endpoint('Process'), {
      body: {
        token: state.token,
        uid: state.uid,
        sessionId
      }
    }))
      .then((data) => {
        if (data?.state?.phase === 'completed') render(data.state);
      })
      .catch(() => {})
      .finally(() => {
        closeoutKickInFlight = false;
      });
  }

  async function readStatus(options = {}) {
    const data = await api(endpoint('Status'), {
      body: {
        token: state.token,
        uid: state.uid,
        sessionId: current?.sessionId || '',
        includeInspection: options.includeInspection === true,
        includeHistory: options.includeHistory === true,
        includeReportLookup: options.includeReportLookup === true
      }
    });
    render(data.state || data);
    return data.state || data;
  }

  async function pollStatus(attempt = 0) {
    if (polling && attempt === 0) return;
    polling = true;
    if (!pollStartedAt) pollStartedAt = Date.now();
    try {
      const completedWithFallback = current?.phase === 'completed' && current?.report?.available === true;
      const includeInspection = completedWithFallback && !current?.report?.unifiedReady && (unifiedInspectionPolls++ % 2 === 0);
      const next = await readStatus({
        includeInspection,
        includeHistory: false,
        includeReportLookup: completedWithFallback || includeInspection
      });

      if (next.phase === 'completed') {
        clearPoll();
        return;
      }

      if (Date.now() - pollStartedAt >= 5 * 60 * 1000) {
        polling = false;
        if (next.report?.available) {
          status(getLocale() === 'de'
            ? 'Der verfügbare Bericht kann geöffnet werden. Die Unified-Version wird weiterhin im Hintergrund erstellt.'
            : 'The available report can be opened. The unified version continues processing in the background.', 'warn');
        } else {
          status(getLocale() === 'de'
            ? 'Die Verarbeitung läuft weiter. Sie können diese Seite später mit demselben Link erneut öffnen.'
            : 'Processing continues. You can reopen this page later using the same link.', 'warn');
        }
        return;
      }
    } catch (error) {
      if (!isAmbiguous(error) && attempt >= 3) {
        polling = false;
        status(error.message || String(error), 'err');
        return;
      }
    }

    const delay = attempt < 6 ? 4000 : attempt < 18 ? 8000 : 12000;
    pollTimer = window.setTimeout(() => pollStatus(attempt + 1), delay);
  }

  async function pollReadiness() {
    if (readinessTimer || moduleReady || current?.phase !== 'not_started') return;
    if (!readinessStartedAt) readinessStartedAt = Date.now();

    try {
      const next = await readStatus({
        includeInspection: false,
        includeHistory: false,
        includeReportLookup: false
      });
      adoptReadiness(next);
      if (moduleReady || next.phase !== 'not_started') {
        clearReadinessPoll();
        return;
      }
    } catch (error) {
      if (!isAmbiguous(error) && String(error?.code || '') !== 'ASSESSMENT_MODULE_NOT_READY') {
        status(error.message || String(error), 'err');
      }
    }

    if (Date.now() - readinessStartedAt > 45000) {
      status(L().readinessDelayed, 'warn');
      readinessTimer = window.setTimeout(() => {
        readinessTimer = 0;
        pollReadiness();
      }, 5000);
      return;
    }

    const delay = readinessAttempt < 5 ? 900 : readinessAttempt < 12 ? 1600 : 2600;
    readinessAttempt += 1;
    readinessTimer = window.setTimeout(() => {
      readinessTimer = 0;
      pollReadiness();
    }, delay);
  }

  async function start() {
    if (busy) return;
    if (!startAllowed()) {
      moduleReady = false;
      syncButtonStates();
      status(isVideoMode() && !videoConsentAccepted() ? L().videoConsentRequired : (isMediaMode() ? mediaCopy('audioPreparing','videoPreparing') : L().preparing), 'warn');
      if (isMediaMode()) { ensureMediaFrame(); requestMediaPreparation(); }
      pollReadiness();
      return;
    }

    clearReadinessPoll();
    setBusy(true, $('assessmentStartBtn'));
    status(L().starting, 'warn');
    try {
      const runtimeAccessId = String(state.payload?.runtime?.runtimeAccessId || state.uid || '').trim();
      const data = await api(endpoint('Start'), {
        body: {
          token: state.token,
          uid: state.uid,
          idempotencyKey: `${runtimeAccessId}:assessment-start`,
          mediaConsent: isVideoMode() ? {
            accepted: videoConsentAccepted(),
            audioAccepted: videoConsentAccepted(),
            videoAccepted: videoConsentAccepted(),
            acceptedAt: new Date().toISOString(),
            version: 'assessment_media_consent_v1'
          } : undefined
        }
      });
      const next = data.state || data;
      const firstQuestion = data.firstQuestion || data.chat?.firstQuestion ||
        (Array.isArray(next.history) ? next.history.find(item => item?.role === 'assistant' && item?.text) : null);
      if (next.phase === 'running' && !String(firstQuestion?.text || '').trim()) {
        const error = new Error(getLocale() === 'de'
          ? 'Die erste Frage wurde noch nicht bereitgestellt. Der Status wird erneut geprüft.'
          : 'The first question has not been prepared yet. Status will be checked again.');
        error.code = 'ASSESSMENT_START_QUESTION_MISSING';
        throw error;
      }
      render(next);
      if (isMediaMode() && next.phase === 'running') {
        mediaRecordStarted = true;
        postToMedia('clarity.live.context', mediaRuntimeContext());
        postToMedia('clarity.live.record', { enabled: true, sessionId: next.sessionId || current?.sessionId || '' });
        status(mediaCopy('audioRecording','videoRecording'), 'ok');
      }
    } catch (error) {

      if (String(error?.code || '') === 'ASSESSMENT_MODULE_NOT_READY') {
        moduleReady = false;
        if (error?.details?.readiness) {
          current = { ...(current || {}), readiness: error.details.readiness, phase: 'not_started' };
        }
        syncButtonStates();
        status(isVideoMode() && !videoConsentAccepted() ? L().videoConsentRequired : (isMediaMode() ? mediaCopy('audioPreparing','videoPreparing') : L().preparing), 'warn');
        pollReadiness();
      } else if (isAmbiguous(error) || String(error?.code || '') === 'ASSESSMENT_START_QUESTION_MISSING') {
        status(L().transport, 'warn');
        const recovered = await readStatus({ includeHistory: true, includeReportLookup: false }).catch(() => null);
        if (recovered?.phase === 'not_started') pollReadiness();
        else if (recovered?.phase === 'running' && isMediaMode()) {
          mediaRecordStarted = true;
          postToMedia('clarity.live.context', mediaRuntimeContext());
          postToMedia('clarity.live.record', { enabled:true, sessionId:recovered.sessionId || current?.sessionId || '' });
          status(mediaCopy('audioRecording','videoRecording'), 'ok');
        } else if (recovered?.phase === 'processing') await pollStatus();
      } else {
        status(error.message || String(error), 'err');
      }
    } finally {
      setBusy(false, $('assessmentStartBtn'));
    }
  }

  async function send() {
    if (busy) return;
    const input = $('assessmentInput');
    const message = input.value.trim();
    if (!message) return status(L().answerRequired, 'warn');
    let autoFinish = false;
    setBusy(true, $('assessmentSendBtn'));
    try {
      const data = await api(endpoint('Message'), {
        body: { token: state.token, uid: state.uid, sessionId: current?.sessionId || '', message }
      });
      input.value = '';
      const next = data.state || data;
      render(next);
      autoFinish = next.done === true ||
        Number(next.answeredCount || 0) >= Number(next.expectedAnswers || next.questionCount || Number.MAX_SAFE_INTEGER);
    } catch (error) {
      if (isAmbiguous(error)) {
        status(L().transport, 'warn');
        const recovered = await readStatus({ includeHistory: false, includeReportLookup: false }).catch(() => null);
        autoFinish = recovered && (
          recovered.done === true ||
          Number(recovered.answeredCount || 0) >= Number(recovered.expectedAnswers || recovered.questionCount || Number.MAX_SAFE_INTEGER)
        );
      } else status(error.message || String(error), 'err');
    } finally {
      setBusy(false, $('assessmentSendBtn'));
      input.focus();
    }
    if (autoFinish) {
      window.setTimeout(() => finish(), 80);
    }
  }

  async function finish() {
    if (busy || closeoutStarted) return;
    closeoutStarted = true;
    setBusy(true, $('assessmentFinishBtn'));
    $('assessmentComposer').classList.add('hidden');
    $('assessmentProcessingPanel').classList.remove('hidden');
    status(L().processing, 'warn');
    try {
      const data = await api(endpoint('Finish'), {
        body: { token: state.token, uid: state.uid, sessionId: current?.sessionId || '' }
      });
      render(data.state || data);
      if ((data.state || data).phase !== 'completed') {
        kickCloseout(false);
        await pollStatus();
      }
    } catch (error) {
      if (isAmbiguous(error)) {
        status(L().transport, 'warn');
        await pollStatus();
      } else {
        closeoutStarted = false;
        status(error.message || String(error), 'err');
        if (!isMediaMode()) $('assessmentComposer').classList.remove('hidden');
      }
    } finally {
      setBusy(false, $('assessmentFinishBtn'));
    }
  }

  async function retry() {
    if (busy) return;
    setBusy(true, $('assessmentRetryBtn'));
    try {
      if (isMediaMode() && await retryFailedMedia()) return;
      const data = await api(endpoint('Retry'), { body: { token: state.token, uid: state.uid, sessionId: current?.sessionId || '' } });
      const next = data.state || data;
      render(next);
      if (next.phase === 'processing' || (next.phase === 'completed' && !next.report?.unifiedReady)) {
        kickCloseout(true);
        await pollStatus();
      }
    } catch (error) {
      if (isAmbiguous(error)) await pollStatus();
      else status(error.message || String(error), 'err');
    } finally { setBusy(false, $('assessmentRetryBtn')); }
  }


  function applyCopy() {
    const copy = L();
    ensureAssessmentStyles();
    $('assessmentTitle').textContent = copy.title;
    $('assessmentText').textContent = copy.intro;
    $('assessmentReleaseText').textContent = copy.notice;
    $('assessmentStartBtn').textContent = startAllowed() ? copy.start : (isMediaMode() ? mediaCopy('audioPreparing','videoPreparing') : copy.preparing);
    $('assessmentSendBtn').textContent = copy.send;
    $('assessmentFinishBtn').textContent = copy.finish;
    $('assessmentRetryBtn').textContent = copy.retry;
    $('assessmentInput').placeholder = copy.placeholder;
    $('assessmentAreaLabel').textContent = product() === 'snapshot' ? copy.format : copy.area;
    $('assessmentScopeLabel').textContent = copy.scope;
    $('assessmentCreditLabel').textContent = copy.process;
    $('assessmentProcessingText').textContent = copy.processing;
    $('assessmentCompleteTitle').textContent = copy.completed;
    $('assessmentCompleteText').textContent = copy.completedText;
    if ($('assessmentReportBtn')) $('assessmentReportBtn').classList.add('hidden');
    if ($('assessmentReportSource')) $('assessmentReportSource').classList.add('hidden');

    const eyebrow = document.querySelector('#assessmentView .assessment-head .eyebrow span:last-child');
    if (eyebrow) eyebrow.textContent = copy.eyebrow;
    const badge = document.querySelector('#assessmentView .assessment-head > .pill');
    if (badge) badge.textContent = copy.badge;
    const startTitle = document.querySelector('#assessmentView .assessment-start-card strong');
    const startText = document.querySelector('#assessmentView .assessment-start-card p');
    if (startTitle) startTitle.textContent = copy.startTitle;
    if (startText) startText.textContent = copy.startText;
  }

  async function activate() {
    clearPoll();
    clearReadinessPoll();
    closeoutStarted = false;
    moduleReady = false;
    resetMediaState({ keepFrame: false });
    setStep('module');
    show('assessmentView');
    applyCopy();
    syncButtonStates();
    status(isVideoMode() ? L().videoConsentRequired : L().preparing, 'warn');
    try {
      const data = await readStatus({ includeInspection: false, includeHistory: true, includeReportLookup: false });
      adoptReadiness(data);
      if (isMediaMode() && data.phase === 'not_started') {
        if (isVideoMode()) ensureVideoConsentControl();
        ensureMediaFrame();
        requestMediaPreparation();
      }
      if (data.phase === 'not_started' && !startAllowed()) {
        pollReadiness();
      } else if (data.phase === 'processing') {
        kickCloseout(false);
        await pollStatus();
      }
    } catch (error) {
      if (isAmbiguous(error)) pollReadiness();
      else if (onFatal) onFatal(error);
    }
  }

  window.addEventListener('message', handleMediaMessage);

  $('assessmentStartBtn')?.addEventListener('click', start);
  $('assessmentSendBtn')?.addEventListener('click', send);
  $('assessmentFinishBtn')?.addEventListener('click', finish);
  $('assessmentRetryBtn')?.addEventListener('click', retry);
  $('assessmentInput')?.addEventListener('keydown', (event) => {
    if (event.isComposing) return;
    // Enter submits; Shift+Enter keeps the expected multi-line behavior.
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!busy) send();
    }
  });

  return {
    activate,
    refresh: readStatus,
    destroy() { clearPoll(); clearReadinessPoll(); window.removeEventListener('message', handleMediaMessage); resetMediaState({ keepFrame:false }); },
    applyLocale: applyCopy
  };
}
