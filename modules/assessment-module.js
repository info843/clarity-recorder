// CLARITY Assessment Universal App module v2.17.0
const COPY = Object.freeze({
  de: {
    snapshotTitle: 'CLARITY Snapshot',
    assessmentTitle: 'CLARITY Assessment',
    intro: 'Beantworten Sie die Fragen in eigenen Worten. Ihre Antworten werden strukturiert ausgewertet und in einem Bericht dokumentiert.',
    release: 'Dieser erste V2-Release verwendet den stabilen Chat-Modus. Audio, Video und Mix folgen in der nächsten Ausbaustufe.',
    start: 'Assessment starten',
    starting: 'Assessment wird gestartet …',
    send: 'Antwort senden',
    finish: 'Assessment abschließen',
    processing: 'Ihre Antworten werden ausgewertet und der Bericht wird erstellt. Bitte lassen Sie diese Seite geöffnet.',
    completed: 'Assessment abgeschlossen',
    completedText: 'Der Bericht steht zur Verfügung. Die Unified-Version wird im Hintergrund mit dem Workspace synchronisiert.',
    download: 'Bericht herunterladen',
    placeholder: 'Ihre Antwort …',
    answerRequired: 'Bitte geben Sie eine Antwort ein.',
    question: 'Frage',
    answered: 'beantwortet',
    area: 'Bereich',
    scope: 'Umfang',
    credit: 'Credit-Regel',
    creditRule: 'Einmaliger Verbrauch beim Start der Session',
    retry: 'Status erneut prüfen',
    legacy: 'Legacy-Fallback',
    unified: 'Unified',
    waitingReport: 'Bericht wird vorbereitet …',
    transport: 'Die Serverantwort ist noch unklar. Der tatsächliche Status wird geprüft.'
  },
  en: {
    snapshotTitle: 'CLARITY Snapshot',
    assessmentTitle: 'CLARITY Assessment',
    intro: 'Answer the questions in your own words. Your responses are evaluated in a structured way and documented in a report.',
    release: 'This first V2 release uses the stable chat mode. Audio, video and mixed modes follow in the next phase.',
    start: 'Start assessment',
    starting: 'Starting assessment …',
    send: 'Send answer',
    finish: 'Complete assessment',
    processing: 'Your responses are being evaluated and the report is being created. Keep this page open.',
    completed: 'Assessment completed',
    completedText: 'The report is available. The Unified version is synchronized with the Workspace in the background.',
    download: 'Download report',
    placeholder: 'Your answer …',
    answerRequired: 'Please enter an answer.',
    question: 'Question',
    answered: 'answered',
    area: 'Area',
    scope: 'Scope',
    credit: 'Credit rule',
    creditRule: 'Consumed once when the session starts',
    retry: 'Check status again',
    legacy: 'Legacy fallback',
    unified: 'Unified',
    waitingReport: 'Preparing report …',
    transport: 'The server response is still unclear. The actual status is being checked.'
  }
});

function isAmbiguous(error) {
  const value = `${error?.code || ''} ${error?.message || error || ''}`.toLowerCase();
  return /failed to fetch|network|timeout|timed out|http_50[234]|gateway|load failed/.test(value);
}

export function createAssessmentModule(ctx) {
  const { $, state, api, show, setStep, getLocale, onFatal } = ctx;
  let busy = false;
  let polling = false;
  let pollTimer = 0;
  let current = null;
  let closeoutStarted = false;

  const L = () => COPY[getLocale() === 'de' ? 'de' : 'en'];
  const product = () => String(state.payload?.runtime?.productKey || '').toLowerCase();
  const endpoint = (name) => `v2Assessment${name}`;

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
  }

  function renderHistory(history = []) {
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
    $('assessmentArea').textContent = data.moduleArea || 'personality';
    $('assessmentScope').textContent = `${data.questionCount || 0} ${getLocale() === 'de' ? 'Fragen' : 'questions'}`;
    $('assessmentCredit').textContent = L().creditRule;
    const answered = Number(data.answeredCount || 0);
    const expected = Math.max(1, Number(data.expectedAnswers || data.questionCount || 1));
    const pct = Math.min(100, Math.round((answered / expected) * 100));
    $('assessmentProgressBar').style.width = `${pct}%`;
    $('assessmentProgressText').textContent = `${answered} / ${expected} ${L().answered}`;
  }

  function render(data) {
    current = data || current || {};
    renderMeta(current);
    renderHistory(current.history || []);
    const phase = current.phase || 'not_started';
    const notStarted = phase === 'not_started';
    const running = phase === 'running';
    const processing = phase === 'processing';
    const completed = phase === 'completed';
    $('assessmentStartPanel').classList.toggle('hidden', !notStarted);
    $('assessmentChatPanel').classList.toggle('hidden', !(running || processing));
    $('assessmentProcessingPanel').classList.toggle('hidden', !processing);
    $('assessmentCompletePanel').classList.toggle('hidden', !completed);
    $('assessmentComposer').classList.toggle('hidden', !running);
    const allAnswered = Number(current.answeredCount || 0) >= Number(current.expectedAnswers || current.questionCount || 1);
    $('assessmentFinishBtn').classList.toggle('hidden', !running || !allAnswered);
    $('assessmentSendBtn').classList.toggle('hidden', !running || allAnswered);
    if (completed) {
      closeoutStarted = true;
      const url = current.report?.preferredPdfUrl || current.report?.unifiedPdfUrl || current.report?.legacyPdfUrl || '';
      const source = current.report?.preferredSource === 'unified' ? L().unified : L().legacy;
      $('assessmentReportSource').textContent = source;
      $('assessmentReportBtn').disabled = !url;
      $('assessmentReportBtn').dataset.url = url;
      status(url ? L().completedText : L().waitingReport, url ? 'ok' : 'warn');
      clearPoll();
    } else if (processing) {
      status(L().processing, 'warn');
    } else if (running) {
      status('', '');
    }
  }

  async function readStatus(includeInspection = false) {
    const data = await api(endpoint('Status'), {
      body: { token: state.token, uid: state.uid, sessionId: current?.sessionId || '', includeInspection }
    });
    render(data.state || data);
    return data.state || data;
  }

  async function pollStatus(attempt = 0) {
    if (polling && attempt === 0) return;
    polling = true;
    try {
      const next = await readStatus(attempt >= 2);
      if (next.phase === 'completed' && next.report?.available) {
        clearPoll();
        return;
      }
      if (attempt >= 15) {
        polling = false;
        status(L().waitingReport, 'warn');
        return;
      }
    } catch (error) {
      if (!isAmbiguous(error) && attempt >= 2) {
        polling = false;
        status(error.message || String(error), 'err');
        return;
      }
    }
    pollTimer = window.setTimeout(() => pollStatus(attempt + 1), 5000);
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
        const recovered = await readStatus(false).catch(() => null);
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
      if ((data.state || data).phase !== 'completed') await pollStatus();
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
      render(data.state || data);
      if ((data.state || data).phase === 'processing') await pollStatus();
    } catch (error) { status(error.message || String(error), 'err'); }
    finally { setBusy(false, $('assessmentRetryBtn')); }
  }

  function applyCopy() {
    const copy = L();
    $('assessmentTitle').textContent = product() === 'snapshot' ? copy.snapshotTitle : copy.assessmentTitle;
    $('assessmentText').textContent = copy.intro;
    $('assessmentReleaseText').textContent = copy.release;
    $('assessmentStartBtn').textContent = copy.start;
    $('assessmentSendBtn').textContent = copy.send;
    $('assessmentFinishBtn').textContent = copy.finish;
    $('assessmentRetryBtn').textContent = copy.retry;
    $('assessmentInput').placeholder = copy.placeholder;
    $('assessmentAreaLabel').textContent = copy.area;
    $('assessmentScopeLabel').textContent = copy.scope;
    $('assessmentCreditLabel').textContent = copy.credit;
    $('assessmentProcessingText').textContent = copy.processing;
    $('assessmentCompleteTitle').textContent = copy.completed;
    $('assessmentCompleteText').textContent = copy.completedText;
    $('assessmentReportBtn').textContent = copy.download;
  }

  async function activate() {
    clearPoll();
    closeoutStarted = false;
    setStep('module');
    show('assessmentView');
    applyCopy();
    status('', '');
    try {
      const data = await readStatus(true);
      if (data.phase === 'processing' || (data.phase === 'completed' && !data.report?.available)) await pollStatus();
    } catch (error) {
      if (isAmbiguous(error)) await pollStatus();
      else if (onFatal) onFatal(error);
    }
  }

  $('assessmentStartBtn')?.addEventListener('click', start);
  $('assessmentSendBtn')?.addEventListener('click', send);
  $('assessmentFinishBtn')?.addEventListener('click', finish);
  $('assessmentRetryBtn')?.addEventListener('click', retry);
  $('assessmentReportBtn')?.addEventListener('click', () => {
    const url = $('assessmentReportBtn').dataset.url || '';
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  });
  $('assessmentInput')?.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); send(); }
  });

  return { activate, refresh: readStatus, destroy: clearPoll, applyLocale: applyCopy };
}
