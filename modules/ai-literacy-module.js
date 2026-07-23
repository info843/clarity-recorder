// modules/ai-literacy-module.js
// CLARITY Universal App — AI Literacy vertical v2.12.0

export function createAiLiteracyModule({ $, state, api, show, setStep, getLocale, onFatal }) {
  const VERSION = '2.12.0';
  let active = false;
  let frameReady = false;
  let lastState = null;
  let artifactPolling = false;

  const frame = () => $('aiLiteracyFrame');
  const statusEl = () => $('aiLiteracyStatus');
  const locale = () => getLocale?.() || 'en';

  const TEXT = {
    de: {
      title: 'Training und Qualifikation',
      text: 'Absolvieren Sie das zugewiesene Training, den Wissenstest und den dokumentierten Qualifikationsnachweis.',
      seat: '1 Seat bei Trainingsstart',
      notice: 'Das Öffnen des Links sowie Profil- und Hinweisschritte verbrauchen keinen weiteren Seat. Der reservierte Seat wird beim tatsächlichen Trainingsstart genau einmal verbraucht.',
      preparing: 'AI-Literacy-Workflow wird vorbereitet…',
      ready: 'Training und Wissenstest sind bereit.',
      profile: 'Teilnehmerprofil wird gespeichert…',
      training: 'Training wird gestartet…',
      module: 'Modulfortschritt wird gespeichert…',
      test: 'Wissenstest wird vorbereitet…',
      finish: 'Wissenstest wird abgeschlossen…',
      artifacts: 'Report und Zertifikat werden erstellt…',
      polling: 'Dokumente werden nach einer verzögerten Antwort geprüft…',
      error: 'AI-Literacy-Aktion fehlgeschlagen.'
    },
    en: {
      title: 'Training and qualification',
      text: 'Complete the assigned training, knowledge test and documented qualification evidence.',
      seat: '1 seat at training start',
      notice: 'Opening the link and confirming profile or notices do not consume another seat. The reserved seat is consumed exactly once when training actually starts.',
      preparing: 'Preparing AI Literacy workflow…',
      ready: 'Training and knowledge test are ready.',
      profile: 'Saving participant profile…',
      training: 'Starting training…',
      module: 'Saving module progress…',
      test: 'Preparing knowledge test…',
      finish: 'Finalizing knowledge test…',
      artifacts: 'Generating report and certificate…',
      polling: 'Checking documents after a delayed response…',
      error: 'AI Literacy action failed.'
    }
  };

  function t(key) {
    const lang = locale() === 'de' ? 'de' : 'en';
    return TEXT[lang]?.[key] || TEXT.en[key] || key;
  }

  function setStatus(message, kind = '') {
    const el = statusEl();
    if (!el) return;
    el.textContent = message || '';
    el.className = `status${kind ? ` ${kind}` : ''}`;
  }

  function applyOuterLocale() {
    if ($('aiLiteracyTitle')) $('aiLiteracyTitle').textContent = t('title');
    if ($('aiLiteracyText')) $('aiLiteracyText').textContent = t('text');
    if ($('aiLiteracySeatRule')) $('aiLiteracySeatRule').textContent = t('seat');
    if ($('aiLiteracyNotice')) $('aiLiteracyNotice').textContent = t('notice');
  }

  function postToFrame(message) {
    [0, 180, 600, 1300].forEach((delay) => {
      setTimeout(() => {
        try { frame()?.contentWindow?.postMessage(message, '*'); } catch (_) {}
      }, delay);
    });
  }

  function baseBody(extra = {}) {
    return {
      token: state.token,
      uid: state.uid,
      userAgent: navigator.userAgent,
      ...extra
    };
  }

  function isAmbiguousTransportError(error) {
    const raw = String(error?.message || error || '').toLowerCase();
    return raw.includes('failed to fetch') || raw.includes('network') || raw.includes('timeout') || raw.includes('gateway') || raw.includes('http 502') || raw.includes('http 503') || raw.includes('http 504');
  }

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function apiWithTransportRetry(path, options, { attempts = 2, delayMs = 1600 } = {}) {
    let lastError = null;
    for (let attempt = 1; attempt <= Math.max(1, attempts); attempt += 1) {
      try {
        return await api(path, options);
      } catch (error) {
        lastError = error;
        if (!isAmbiguousTransportError(error) || attempt >= attempts) throw error;
        await sleep(delayMs * attempt);
      }
    }
    throw lastError;
  }

  function recoveredTestResult(data = {}) {
    const access = data?.bootstrap?.access || {};
    const session = data?.training?.session || data?.training?.previousAttempt || {};
    const rawPass = String(access.passStatus || session.passStatus || '').toLowerCase();
    const retakeAllowed = rawPass === 'retake_allowed';
    const passStatus = retakeAllowed ? 'failed' : rawPass;
    const complete = ['passed', 'failed'].includes(passStatus) || retakeAllowed;
    if (!complete) return null;
    return {
      session,
      result: {
        scorePercent: Number(access.scorePercent ?? session.scorePercent ?? 0),
        passThreshold: Number(session.passThreshold ?? access.metrics?.passThreshold ?? 80),
        passStatus,
        totalPoints: Number(session.totalPoints || 0),
        maxPoints: Number(session.maxPoints || 0),
        currentAttempt: Number(session.attemptNumber || access.attemptCount || 1),
        maxAttempts: Number(access.maxAttempts || data?.training?.trainingPath?.maxAttempts || 2),
        finalAttempt: !retakeAllowed,
        retakeAllowed
      },
      recoveredFromTimeout: true
    };
  }

  async function recoverStartedTraining() {
    try {
      const data = await apiWithTransportRetry('v2AiLiteracyStatus', {
        body: baseBody({ includeArtifacts: false, synchronizeProfile: false })
      }, { attempts: 2, delayMs: 900 });
      sendInit(data);
      const session = data?.training?.session || null;
      if (session && ['training_started', 'training_completed', 'test_started'].includes(String(session.status || '').toLowerCase())) {
        return { ok: true, version: VERSION, session, state: data, recoveredFromTimeout: true, commercial: { seatConsumed: data?.runtime?.seatConsumed === true, consumedNow: false, billableEvent: 'training_started' } };
      }
    } catch (_) {}
    return null;
  }

  async function recoverStartedTest(sessionId) {
    try {
      const data = await apiWithTransportRetry('v2AiLiteracyStatus', {
        body: baseBody({ includeArtifacts: false, includeQuestions: true, synchronizeProfile: false, sessionId })
      }, { attempts: 2, delayMs: 900 });
      sendInit(data);
      const training = data?.training || {};
      const session = training.session || null;
      const questions = Array.isArray(training.questions) ? training.questions : [];
      if (session && String(session.status || '').toLowerCase() === 'test_started' && questions.length) {
        return { ok: true, version: VERSION, session, training, questions, questionCount: questions.length, recoveredFromTimeout: true };
      }
    } catch (_) {}
    return null;
  }

  async function pollTestCompletion(sessionId, { maxChecks = 15, intervalMs = 4000 } = {}) {
    for (let index = 0; index < maxChecks; index += 1) {
      if (index > 0) await sleep(intervalMs);
      try {
        const data = await apiWithTransportRetry('v2AiLiteracyStatus', {
          body: baseBody({ includeArtifacts: false, synchronizeProfile: false, sessionId })
        }, { attempts: 2, delayMs: 900 });
        sendInit(data);
        const recovered = recoveredTestResult(data);
        if (recovered) return recovered;
      } catch (_) {}
    }
    return null;
  }

  function normalizeError(error) {
    const raw = String(error?.message || error || t('error'));
    const map = [
      ['uid_required', 'Access link is missing a UID.'],
      ['access_not_found', 'This access link could not be found.'],
      ['company_mismatch', 'This access link does not belong to this company.'],
      ['access_invalid', 'This access link is not valid.'],
      ['access_expired', 'This access link has expired.'],
      ['profile_not_completed', 'Please complete the participant profile first.'],
      ['training_not_completed', 'Please complete all required training modules first.'],
      ['max_attempts_reached', 'The maximum number of test attempts has been reached.'],
      ['answers_missing', 'Please answer all questions before finishing the test.'],
      ['retake_pending_no_artifact', 'Report generation is available after the final attempt or a passed result.']
    ];
    for (const [needle, message] of map) if (raw.toLowerCase().includes(needle)) return message;
    return raw;
  }

  function initPayload(data) {
    const bootstrap = data?.bootstrap || {};
    return {
      ...bootstrap,
      training: data?.training?.ok ? data.training : null,
      branding: data?.branding || state.payload?.branding || state.payload?.runtime?.brandingSnapshot || {},
      universalMode: true,
      commercial: bootstrap.commercial || {
        unitType: 'ai_literacy_seat',
        unitCost: 1,
        billableEvent: 'training_started',
        consumed: data?.runtime?.seatConsumed === true
      }
    };
  }

  function sendInit(data) {
    lastState = data;
    postToFrame({ type: 'IB_USER_INIT', payload: initPayload(data) });
  }

  async function loadStatus({ includeArtifacts = true, forceProfileSync = false } = {}) {
    setStatus(t('preparing'), 'warn');
    const data = await apiWithTransportRetry('v2AiLiteracyStatus', {
      body: baseBody({ includeArtifacts, synchronizeProfile: true, forceProfileSync })
    }, { attempts: 3, delayMs: 1200 });
    sendInit(data);
    setStatus(t('ready'), 'ok');
    return data;
  }

  async function pollArtifacts(sessionId, { maxChecks = 18, intervalMs = 5000 } = {}) {
    if (artifactPolling) return null;
    artifactPolling = true;
    let last = null;
    try {
      for (let index = 0; index < maxChecks; index += 1) {
        const attempt = index + 1;
        postToFrame({
          type: 'IB_USER_ARTIFACTS_POLLING',
          payload: {
            attempt,
            maxChecks,
            message: t('polling')
          }
        });
        if (index > 0) await new Promise((resolve) => setTimeout(resolve, intervalMs));
        try {
          last = await api('v2AiLiteracyArtifactStatus', {
            body: baseBody({ sessionId })
          });
          if (last?.ready) {
            postToFrame({
              type: 'IB_USER_ARTIFACTS_READY',
              payload: { ...last, recoveredFromTimeout: true }
            });
            await loadStatus({ includeArtifacts: true });
            return last;
          }
          if (last?.partial && attempt >= Math.min(maxChecks, 8)) {
            postToFrame({
              type: 'IB_USER_ARTIFACTS_PARTIAL',
              payload: { ...last, recoveredFromTimeout: true }
            });
            await loadStatus({ includeArtifacts: true });
            return last;
          }
        } catch (_) {}
      }
      postToFrame({
        type: 'IB_USER_ARTIFACTS_UNRESOLVED',
        payload: {
          message: locale() === 'de'
            ? 'Die Dokumentenerstellung dauert länger als erwartet. Die Download-Links konnten auf dieser Seite noch nicht bestätigt werden.'
            : 'Document generation is taking longer than expected. The download links could not yet be confirmed on this page.'
        }
      });
      return last;
    } finally {
      artifactPolling = false;
    }
  }

  async function handleMessage(message) {
    const type = message?.type;
    const payload = message?.payload || {};

    if (type === 'IB_USER_APP_READY' || type === 'IB_USER_REFRESH_ACCESS') {
      frameReady = true;
      await loadStatus({ includeArtifacts: true });
      return;
    }

    if (type === 'IB_USER_SAVE_PROFILE') {
      try {
        setStatus(t('profile'), 'warn');
        postToFrame({ type: 'IB_USER_LOADING', payload: { message: t('profile') } });
        const result = await api('v2AiLiteracyProfile', {
          body: baseBody({ profile: payload.profile || {}, notices: payload.notices || {} })
        });
        postToFrame({ type: 'IB_USER_PROFILE_SAVED', payload: result });
        sendInit(result.state || await loadStatus({ includeArtifacts: false }));
        setStatus(t('ready'), 'ok');
      } catch (error) {
        const messageText = normalizeError(error);
        setStatus(messageText, 'err');
        postToFrame({ type: 'IB_USER_ERROR', error: messageText });
      }
      return;
    }

    if (type === 'IB_USER_START_SESSION') {
      try {
        setStatus(t('training'), 'warn');
        postToFrame({ type: 'IB_USER_LOADING', payload: { message: t('training') } });
        const result = await apiWithTransportRetry('v2AiLiteracyStart', { body: baseBody({}) }, { attempts: 2, delayMs: 1800 });
        postToFrame({ type: 'IB_USER_SESSION_STARTED', payload: result });
        if (result.state) sendInit(result.state);
        setStatus(t('ready'), 'ok');
      } catch (error) {
        if (isAmbiguousTransportError(error)) {
          const recovered = await recoverStartedTraining();
          if (recovered) {
            postToFrame({ type: 'IB_USER_SESSION_STARTED', payload: recovered });
            setStatus(t('ready'), 'ok');
            return;
          }
        }
        const messageText = normalizeError(error);
        setStatus(messageText, 'err');
        postToFrame({ type: 'IB_USER_ERROR', error: messageText });
      }
      return;
    }

    if (type === 'IB_USER_COMPLETE_MODULE') {
      try {
        setStatus(t('module'), 'warn');
        const result = await api('v2AiLiteracyModule', {
          body: baseBody({
            sessionId: payload.sessionId || '',
            moduleId: payload.moduleId || '',
            timeSpentSeconds: Number(payload.timeSpentSeconds || 0)
          })
        });
        postToFrame({ type: 'IB_USER_MODULE_COMPLETED', payload: result });
        setStatus(t('ready'), 'ok');
      } catch (error) {
        if (isAmbiguousTransportError(error)) {
          try {
            const stateData = await loadStatus({ includeArtifacts: false });
            const recoveredSession = stateData?.training?.session || stateData?.training?.previousAttempt || null;
            if (recoveredSession) {
              postToFrame({ type: 'IB_USER_MODULE_COMPLETED', payload: { session: recoveredSession, allRequiredCompleted: stateData?.training?.progress?.allRequiredCompleted === true, recoveredFromTimeout: true } });
              setStatus(t('ready'), 'ok');
              return;
            }
          } catch (_) {}
        }
        const messageText = normalizeError(error);
        setStatus(messageText, 'err');
        postToFrame({ type: 'IB_USER_ERROR', error: messageText });
      }
      return;
    }

    if (type === 'IB_USER_START_TEST') {
      try {
        setStatus(t('test'), 'warn');
        postToFrame({ type: 'IB_USER_LOADING', payload: { message: t('test') } });
        const result = await apiWithTransportRetry('v2AiLiteracyTestStart', {
          body: baseBody({ sessionId: payload.sessionId || '' })
        }, { attempts: 2, delayMs: 1500 });
        postToFrame({ type: 'IB_USER_TEST_STARTED', payload: result });
        setStatus(t('ready'), 'ok');
      } catch (error) {
        if (isAmbiguousTransportError(error)) {
          const recovered = await recoverStartedTest(payload.sessionId || '');
          if (recovered) {
            postToFrame({ type: 'IB_USER_TEST_STARTED', payload: recovered });
            setStatus(t('ready'), 'ok');
            return;
          }
        }
        const messageText = normalizeError(error);
        setStatus(messageText, 'err');
        postToFrame({ type: 'IB_USER_ERROR', error: messageText });
      }
      return;
    }

    if (type === 'IB_USER_SAVE_ANSWER') {
      try {
        const result = await api('v2AiLiteracyAnswer', {
          body: baseBody({
            sessionId: payload.sessionId || '',
            questionId: payload.questionId || '',
            selectedKeys: payload.selectedKeys || []
          })
        });
        postToFrame({ type: 'IB_USER_ANSWER_SAVED', payload: result });
      } catch (error) {
        if (isAmbiguousTransportError(error)) {
          postToFrame({ type: 'IB_USER_ANSWER_SAVED', payload: { ok: true, recoveredFromTimeout: true } });
          return;
        }
        const messageText = normalizeError(error);
        setStatus(messageText, 'err');
        postToFrame({ type: 'IB_USER_ERROR', error: messageText });
      }
      return;
    }

    if (type === 'IB_USER_FINISH_TEST') {
      try {
        setStatus(t('finish'), 'warn');
        postToFrame({ type: 'IB_USER_LOADING', payload: { message: t('finish') } });
        const result = await api('v2AiLiteracyFinish', {
          body: baseBody({
            sessionId: payload.sessionId || '',
            answerMap: payload.answerMap || payload.answers || {}
          })
        });
        postToFrame({ type: 'IB_USER_TEST_RESULT', payload: result });
        setStatus(t('ready'), 'ok');
      } catch (error) {
        if (isAmbiguousTransportError(error)) {
          setStatus(locale() === 'de' ? 'Testergebnis wird nach verzögerter Antwort geprüft…' : 'Checking test result after a delayed response…', 'warn');
          const recovered = await pollTestCompletion(payload.sessionId || '');
          if (recovered) {
            postToFrame({ type: 'IB_USER_TEST_RESULT', payload: recovered });
            setStatus(t('ready'), 'ok');
            return;
          }
        }
        const messageText = normalizeError(error);
        setStatus(messageText, 'err');
        postToFrame({ type: 'IB_USER_ERROR', error: messageText });
      }
      return;
    }

    if (type === 'IB_USER_GENERATE_ARTIFACTS') {
      const sessionId = payload.sessionId || lastState?.training?.session?.sessionId || '';
      try {
        setStatus(t('artifacts'), 'warn');
        postToFrame({ type: 'IB_USER_LOADING', payload: { message: t('artifacts') } });
        const result = await api('v2AiLiteracyArtifacts', {
          body: baseBody({ sessionId })
        });
        postToFrame({ type: 'IB_USER_ARTIFACTS_READY', payload: result });
        await loadStatus({ includeArtifacts: true });
      } catch (error) {
        if (isAmbiguousTransportError(error)) {
          setStatus(t('polling'), 'warn');
          await pollArtifacts(sessionId);
        } else {
          const messageText = normalizeError(error);
          setStatus(messageText, 'err');
          postToFrame({ type: 'IB_USER_ERROR', error: messageText });
        }
      }
      return;
    }

    if (type === 'IB_USER_OPEN_ARTIFACT') {
      const url = String(payload.url || '').trim();
      if (/^https?:\/\//i.test(url)) window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  function wire() {
    window.addEventListener('message', async (event) => {
      if (!active || event.source !== frame()?.contentWindow) return;
      try { await handleMessage(event.data || {}); } catch (error) { onFatal?.(error); }
    });
  }

  async function activate() {
    active = true;
    applyOuterLocale();
    setStep('module');
    show('aiLiteracyView');
    setStatus(t('preparing'), 'warn');
    try {
      const data = await loadStatus({ includeArtifacts: true });
      if (frameReady) sendInit(data);
    } catch (error) {
      const messageText = normalizeError(error);
      setStatus(messageText, 'err');
      postToFrame({ type: 'IB_USER_ERROR', error: messageText });
    }
  }

  function applyLocale() {
    applyOuterLocale();
    if (lastState) sendInit(lastState);
  }

  wire();
  return { version: VERSION, activate, applyLocale, loadStatus };
}
