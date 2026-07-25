// CLARITY Assessment Universal App module v2.21.0 — E1.5 WORKSPACE-ONLY REPORT POLICY
// Compact state deltas, one closeout dispatch, status-only polling and immediate
// fallback-report availability while the Unified PDF finishes asynchronously.
const COPY = Object.freeze({
  de: {
    assessment: {
      title: 'CLARITY Assessment', eyebrow: 'CLARITY Assessment · Schriftlich', badge: 'Sicherer Ablauf',
      intro: 'Beantworten Sie die Fragen möglichst konkret und in Ihren eigenen Worten. Beispiele helfen dabei, Ihre Angaben nachvollziehbar einzuordnen.',
      notice: 'Mit Enter senden Sie Ihre Antwort. Shift + Enter fügt einen Zeilenumbruch ein.',
      start: 'Assessment starten', starting: 'Assessment wird gestartet …', send: 'Antwort senden', finish: 'Assessment abschließen',
      processing: 'Ihre Antworten werden ausgewertet und der Bericht wird erstellt. Der Status wird automatisch aktualisiert.',
      completed: 'Assessment abgeschlossen', completedText: 'Ihre Antworten wurden sicher übermittelt. Das Unternehmen verarbeitet das Ergebnis im CLARITY Workspace. Sie können dieses Fenster schließen.',
      startTitle: 'Vorbereitung', startText: 'Planen Sie für jede Antwort ausreichend Zeit ein und nennen Sie möglichst konkrete Situationen oder Beispiele.'
    },
    snapshot: {
      title: 'CLARITY Snapshot', eyebrow: 'CLARITY Snapshot · Kurzcheck', badge: 'Kompakter Ablauf',
      intro: 'Beantworten Sie die vereinbarten Kurzfragen in eigenen Worten. Der Snapshot fasst die Antworten anschließend kompakt zusammen.',
      notice: 'Der Snapshot ist ein kurzer strukturierter Überblick und ersetzt kein vollständiges Assessment.',
      start: 'Snapshot starten', starting: 'Snapshot wird gestartet …', send: 'Antwort senden', finish: 'Snapshot abschließen',
      processing: 'Ihre Antworten werden zusammengefasst. Der Status wird automatisch aktualisiert.',
      completed: 'Snapshot abgeschlossen', completedText: 'Ihre Antworten wurden sicher übermittelt. Das Unternehmen erhält die Zusammenfassung im CLARITY Workspace. Sie können dieses Fenster schließen.',
      startTitle: 'Kurzer Überblick', startText: 'Beantworten Sie die Fragen kurz und konkret. Je nach Umfang dauert der Snapshot nur wenige Minuten.'
    },
    download: 'Bericht herunterladen', placeholder: 'Ihre Antwort …', answerRequired: 'Bitte geben Sie eine Antwort ein.',
    question: 'Frage', answered: 'beantwortet', area: 'Bereich', format: 'Format', shortCheck: 'Kurzcheck', scope: 'Umfang', process: 'Ablauf',
    processRule: 'Auswertung nach der letzten Antwort', retry: 'Status erneut prüfen', report: 'Bericht',
    waitingReport: 'Der Bericht wird noch vorbereitet. Die Seite prüft den Status weiter.',
    transport: 'Die Serverantwort ist noch unklar. Der tatsächliche Status wird geprüft.'
  },
  en: {
    assessment: {
      title: 'CLARITY Assessment', eyebrow: 'CLARITY Assessment · Written', badge: 'Secure workflow',
      intro: 'Answer the questions as concretely as possible and in your own words. Examples help make your information easier to assess.',
      notice: 'Press Enter to send your answer. Shift + Enter inserts a new line.',
      start: 'Start assessment', starting: 'Starting assessment …', send: 'Send answer', finish: 'Complete assessment',
      processing: 'Your answers are being evaluated and the report is being created. The status updates automatically.',
      completed: 'Assessment completed', completedText: 'Your responses were submitted securely. The organisation will review the result in CLARITY Workspace. You can close this window.',
      startTitle: 'Preparation', startText: 'Take sufficient time for each answer and provide concrete situations or examples where possible.'
    },
    snapshot: {
      title: 'CLARITY Snapshot', eyebrow: 'CLARITY Snapshot · Quick check', badge: 'Concise workflow',
      intro: 'Answer the agreed short questions in your own words. The Snapshot then creates a concise summary.',
      notice: 'The Snapshot is a short structured overview and does not replace a full assessment.',
      start: 'Start Snapshot', starting: 'Starting Snapshot …', send: 'Send answer', finish: 'Complete Snapshot',
      processing: 'Your answers are being summarized. The status updates automatically.',
      completed: 'Snapshot completed', completedText: 'Your responses were submitted securely. The organisation receives the summary in CLARITY Workspace. You can close this window.',
      startTitle: 'Quick overview', startText: 'Answer briefly and concretely. Depending on the scope, the Snapshot takes only a few minutes.'
    },
    download: 'Download report', placeholder: 'Your answer …', answerRequired: 'Please enter an answer.',
    question: 'Question', answered: 'answered', area: 'Area', format: 'Format', shortCheck: 'Quick check', scope: 'Scope', process: 'Process',
    processRule: 'Evaluation after the final answer', retry: 'Check status again', report: 'Report',
    waitingReport: 'The report is still being prepared. This page continues checking the status.',
    transport: 'The server response is still unclear. The actual status is being checked.'
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

  const product = () => String(state.payload?.runtime?.productKey || '').toLowerCase();
  const L = () => {
    const base = COPY[getLocale() === 'de' ? 'de' : 'en'];
    return { ...base, ...(product() === 'snapshot' ? base.snapshot : base.assessment) };
  };
  const endpoint = (name) => `v2Assessment${name}`;

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
    `;
    document.head.appendChild(style);
  }

  function status(text, type = '') {
    const el = $('assessmentStatus');
    if (!el) return;
    el.textContent = text || '';
    el.className = `status ${type}`.trim();
  }

  function setBusy(value, button = null) {
    busy = value;
    ['assessmentStartBtn','assessmentSendBtn','assessmentFinishBtn','assessmentRetryBtn'].forEach((id) => {
      const el = $(id);
      if (el) el.disabled = value;
    });
    if (button) button.classList.toggle('busy', value);
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
    const phase = current.phase || 'not_started';
    const notStarted = phase === 'not_started';
    const running = phase === 'running';
    const processing = phase === 'processing';
    const completed = phase === 'completed';
    const failed = phase === 'failed';
    $('assessmentStartPanel').classList.toggle('hidden', !notStarted);
    $('assessmentChatPanel').classList.toggle('hidden', !(running || processing));
    $('assessmentProcessingPanel').classList.toggle('hidden', !(processing || failed));
    $('assessmentCompletePanel').classList.toggle('hidden', !completed);
    $('assessmentComposer').classList.toggle('hidden', !running);
    const allAnswered = Number(current.answeredCount || 0) >= Number(current.expectedAnswers || current.questionCount || 1);
    $('assessmentFinishBtn').classList.toggle('hidden', !running || !allAnswered);
    $('assessmentSendBtn').classList.toggle('hidden', !running || allAnswered);
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
      status('', '');
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

  async function start() {
    if (busy) return;
    setBusy(true, $('assessmentStartBtn'));
    status(L().starting, 'warn');
    try {
      const data = await api(endpoint('Start'), { body: { token: state.token, uid: state.uid } });
      render(data.state || data);
    } catch (error) {
      if (isAmbiguous(error)) {
        status(L().transport, 'warn');
        await pollStatus();
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
        $('assessmentComposer').classList.remove('hidden');
      }
    } finally {
      setBusy(false, $('assessmentFinishBtn'));
    }
  }

  async function retry() {
    if (busy) return;
    setBusy(true, $('assessmentRetryBtn'));
    try {
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
    $('assessmentStartBtn').textContent = copy.start;
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
    closeoutStarted = false;
    setStep('module');
    show('assessmentView');
    applyCopy();
    status('', '');
    try {
      const data = await readStatus({ includeInspection: false, includeHistory: true, includeReportLookup: false });
      if (data.phase === 'processing') {
        if (data.phase === 'processing') kickCloseout(false);
        await pollStatus();
      }
    } catch (error) {
      if (isAmbiguous(error)) await pollStatus();
      else if (onFatal) onFatal(error);
    }
  }

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

  return { activate, refresh: readStatus, destroy: clearPoll, applyLocale: applyCopy };
}
