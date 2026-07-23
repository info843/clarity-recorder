// modules/ai-literacy-module.js
// CLARITY Universal App — AI Literacy vertical v2.15.0

export function createAiLiteracyModule({ $, state, api, show, setStep, getLocale, onFatal }) {
  const VERSION = '2.15.0';
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
      artifacts: 'Unified Report und Unified Zertifikat werden erstellt…',
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
      artifacts: 'Generating unified report and unified certificate…',
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

  async function pollTestCompletion(sessionId, { maxChecks = 6, intervalMs = 6500 } = {}) {
    for (let index = 0; index < maxChecks; index += 1) {
      if (index > 0) await sleep(intervalMs);
      try {
        const data = await api('v2AiLiteracyCompletionStatus', {
          body: baseBody({ sessionId })
        });
        if (data?.finalized) {
          return {
            ok: true,
            version: VERSION,
            session: data.session || {},
            response: data.response || {},
            result: data.result || {},
            finalAttempt: data.result?.finalAttempt === true,
            recoveredFromTimeout: true
          };
        }
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
      profileManagedExternally: true,
      noticesManagedExternally: true,
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
    }, { attempts: 1, delayMs: 1200 });
    sendInit(data);
    setStatus(t('ready'), 'ok');
    return data;
  }

  async function finalizeArtifacts(sessionId) {
    try {
      return await api('v2AiLiteracyFinalize', { body: baseBody({ sessionId }) });
    } catch (error) {
      // At this point both documents already exist. Final reconcile errors must
      // not hide participant downloads. Workspace Sync can safely replay the
      // idempotent reconcile if the queued job was not accepted.
      return {
        ok: isAmbiguousTransportError(error),
        finalized: false,
        ambiguousResponse: isAmbiguousTransportError(error),
        error: String(error?.message || error || '')
      };
    }
  }

  async function pollArtifacts(sessionId, { maxChecks = 8, intervalMs = 7000 } = {}) {
    let last = null;
    for (let index = 0; index < maxChecks; index += 1) {
      const attempt = index + 1;
      postToFrame({
        type: 'IB_USER_ARTIFACTS_POLLING',
        payload: { attempt, maxChecks, message: t('polling') }
      });
      if (index > 0) await sleep(intervalMs);
      try {
        last = await api('v2AiLiteracyArtifactStatus', {
          body: baseBody({ sessionId })
        });
        if (last?.unifiedReady) {
          await finalizeArtifacts(sessionId);
          postToFrame({
            type: 'IB_USER_ARTIFACTS_READY',
            payload: { ...last, recoveredFromTimeout: index > 0 }
          });
          setStatus(t('ready'), 'ok');
          return last;
        }
      } catch (_) {}
    }

    if (last?.legacyReady) {
      await finalizeArtifacts(sessionId);
      postToFrame({
        type: 'IB_USER_ARTIFACTS_PARTIAL',
        payload: {
          ...last,
          degradedFallback: true,
          message: locale() === 'de'
            ? 'Die Legacy-Dokumente sind verfügbar. Die Unified-Versionen werden weiter verarbeitet.'
            : 'Legacy documents are available. Unified versions are still processing.'
        }
      });
      return last;
    }

    postToFrame({
      type: 'IB_USER_ARTIFACTS_UNRESOLVED',
      payload: {
        message: locale() === 'de'
          ? 'Die Dokumente werden weiter verarbeitet. Nutze den Wiederholen-Button erst nach einer kurzen Wartezeit.'
          : 'The documents are still processing. Use the retry button only after a short wait.'
      }
    });
    return last;
  }

  async function waitForArtifactStage(sessionId, stage, { maxChecks = 6, intervalMs = 7000 } = {}) {
    for (let index = 0; index < maxChecks; index += 1) {
      if (index > 0) await sleep(intervalMs);
      try {
        const current = await api('v2AiLiteracyArtifactStatus', { body: baseBody({ sessionId }) });
        if (stage === 'legacy_report' && current?.legacyReportPdfUrl) return current;
        if (stage === 'unified_report' && current?.unifiedReportPdfUrl) return current;
        if (stage === 'legacy_certificate' && current?.legacyCertificatePdfUrl) return current;
        if (stage === 'unified_certificate' && current?.unifiedCertificatePdfUrl) return current;
        if (current?.unifiedReady) return current;
      } catch (_) {}
    }
    return null;
  }

  async function callDocumentStage(endpoint, sessionId, stage, errorDe, errorEn) {
    let responseLost = false;
    try {
      await api(endpoint, { body: baseBody({ sessionId }) });
    } catch (error) {
      if (!isAmbiguousTransportError(error)) throw error;
      responseLost = true;
    }
    if (responseLost) {
      const ready = await waitForArtifactStage(sessionId, stage);
      const stageReady = {
        legacy_report: ready?.legacyReportPdfUrl,
        unified_report: ready?.unifiedReportPdfUrl,
        legacy_certificate: ready?.legacyCertificatePdfUrl,
        unified_certificate: ready?.unifiedCertificatePdfUrl
      }[stage];
      if (!stageReady) throw new Error(locale() === 'de' ? errorDe : errorEn);
    }
  }

  async function runArtifactPipeline(sessionId, passStatus = '') {
    if (!sessionId || artifactPolling) return null;
    artifactPolling = true;
    try {
      setStatus(t('artifacts'), 'warn');
      postToFrame({
        type: 'IB_USER_ARTIFACTS_POLLING',
        payload: { attempt: 1, maxChecks: 8, message: t('artifacts') }
      });

      await callDocumentStage(
        'v2AiLiteracyReport', sessionId, 'legacy_report',
        'Der Legacy-Report konnte noch nicht bestätigt werden.',
        'The legacy report could not yet be confirmed.'
      );
      await callDocumentStage(
        'v2AiLiteracyUnifiedReport', sessionId, 'unified_report',
        'Der Unified Report konnte noch nicht bestätigt werden.',
        'The unified report could not yet be confirmed.'
      );

      if (String(passStatus || '').toLowerCase() === 'passed') {
        await callDocumentStage(
          'v2AiLiteracyCertificate', sessionId, 'legacy_certificate',
          'Das Legacy-Zertifikat konnte noch nicht bestätigt werden.',
          'The legacy certificate could not yet be confirmed.'
        );
        await callDocumentStage(
          'v2AiLiteracyUnifiedCertificate', sessionId, 'unified_certificate',
          'Das Unified Zertifikat konnte noch nicht bestätigt werden.',
          'The unified certificate could not yet be confirmed.'
        );
      }

      return await pollArtifacts(sessionId);
    } catch (error) {
      const messageText = normalizeError(error);
      setStatus(messageText, 'err');
      postToFrame({ type: 'IB_USER_ARTIFACTS_UNRESOLVED', payload: { message: messageText } });
      return null;
    } finally {
      artifactPolling = false;
    }
  }

  async function deliverTestResult(result = {}) {
    postToFrame({ type: 'IB_USER_TEST_RESULT', payload: result });
    setStatus(t('ready'), 'ok');
    const finalAttempt = result.finalAttempt === true || result.result?.finalAttempt === true || String(result.result?.passStatus || '').toLowerCase() === 'passed';
    if (finalAttempt) {
      await runArtifactPipeline(result.session?.sessionId || result.response?.sessionId || '', result.result?.passStatus || '');
    }
  }

  async function resumeCompletedWorkflow(data = {}) {
    if (completionRecoveryStarted || data?.artifactStatus?.unifiedReady) return;
    const recovered = recoveredTestResult(data);
    if (!recovered || !recovered.result?.finalAttempt) return;
    completionRecoveryStarted = true;
    try {
      await deliverTestResult(recovered);
    } finally {
      completionRecoveryStarted = false;
    }
  }

  async function handleMessage(message) {
    const type = message?.type;
    const payload = message?.payload || {};

    if (type === 'IB_USER_APP_READY' || type === 'IB_USER_REFRESH_ACCESS') {
      frameReady = true;
      const data = lastState || await loadStatus({ includeArtifacts: true });
      sendInit(data);
      await resumeCompletedWorkflow(data);
      return;
    }

    if (type === 'IB_USER_SAVE_PROFILE') {
      try {
        setStatus(t('profile'), 'warn');
        postToFrame({ type: 'IB_USER_LOADING', payload: { message: t('profile') } });
        const result = await apiWithTransportRetry('v2AiLiteracyProfile', {
          body: baseBody({ profile: payload.profile || {}, notices: payload.notices || {} })
        }, { attempts: 3, delayMs: 1800 });
        postToFrame({ type: 'IB_USER_PROFILE_SAVED', payload: result });
        sendInit(result.state || await loadStatus({ includeArtifacts: false }));
        setStatus(t('ready'), 'ok');
      } catch (error) {
        if (isAmbiguousTransportError(error)) {
          try {
            const recoveredState = await loadStatus({ includeArtifacts: false, forceProfileSync: true });
            const access = recoveredState?.bootstrap?.access || {};
            if (access?.uid || access?.participantId) {
              postToFrame({ type: 'IB_USER_PROFILE_SAVED', payload: { ok: true, state: recoveredState, recoveredFromTimeout: true } });
              sendInit(recoveredState);
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

    if (type === 'IB_USER_START_SESSION') {
      try {
        setStatus(t('training'), 'warn');
        postToFrame({ type: 'IB_USER_LOADING', payload: { message: t('training') } });
        const result = await api('v2AiLiteracyStart', { body: baseBody({}) });
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
        const result = await api('v2AiLiteracyTestStart', {
          body: baseBody({ sessionId: payload.sessionId || '' })
        });
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
        await deliverTestResult(result);
      } catch (error) {
        if (isAmbiguousTransportError(error)) {
          setStatus(locale() === 'de' ? 'Testergebnis wird serverseitig bestätigt…' : 'Confirming the test result on the server…', 'warn');
          const recovered = await pollTestCompletion(payload.sessionId || '');
          if (recovered) {
            await deliverTestResult(recovered);
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
      const passStatus = payload.passStatus || lastState?.bootstrap?.access?.passStatus || '';
      await runArtifactPipeline(sessionId, passStatus);
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
      if (frameReady) {
        sendInit(data);
        await resumeCompletedWorkflow(data);
      }
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
