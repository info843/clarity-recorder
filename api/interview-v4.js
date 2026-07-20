(() => {
  'use strict';

  const VERSION = '2.5.0';
  const API_ROOT = 'https://www.clarity-nvl.com/_functions';
  const RUNTIME_FILE = './live-v4.html';
  const PRIVACY_VERSION = 'candidate_privacy_v1';
  const MAX_TURN_BATCH = 25;
  const PROCESS_POLL_MS = 3500;
  const PROCESS_TIMEOUT_MS = 12 * 60 * 1000;
  const qs = new URLSearchParams(location.search);
  const uid = String(qs.get('uid') || '').trim().replace(/\s+/g, '');
  const debug = qs.get('debug') === '1';

  const state = {
    uid,
    token: '',
    tokenExpiresAt: null,
    invite: null,
    branding: null,
    lang: 'en',
    mode: 'video',
    mediaMode: 'video',
    hybrid: false,
    oralQuestionCount: 10,
    chatQuestionCount: 0,
    deviceSummary: {},
    preflightPassed: false,
    reserved: false,
    runtimeHello: false,
    runtimeReady: false,
    platformStartConfirmed: false,
    recordingEnabled: false,
    processingStarted: false,
    completed: false,
    sessionId: '',
    realtimeSessionId: '',
    startedAt: null,
    endedAt: null,
    turns: [],
    pendingTurns: [],
    turnSaving: false,
    candidateAudio: null,
    mux: null,
    chatHistory: [],
    chatMetrics: { messages: 0, totalChars: 0, totalWords: 0, startedAt: null },
    chatDone: false,
    selectedRating: 0,
    pollStartedAt: 0,
    finalizationRequested: false,
    unloadGuard: false,
    wakeLock: null,
    runtimeOrigin: location.origin
  };

  const I18N = {
    en: {
      secure:'Secure session', loadingTitle:'Preparing your interview', loadingText:'The secure interview link is being verified.', unavailableTitle:'Link unavailable', unavailableText:'This interview link is invalid, expired, already completed, or no longer available.', welcomeEyebrow:'CLARITY INTERVIEW', welcomeTitle:'Your structured interview', welcomeIntro:'You will speak with a clearly identified AI interviewer. The process is structured and the final decision remains with people.', position:'Position', format:'Format', depth:'Depth', language:'Language', recommendationTitle:'Recommended setup', recommendationText:'A desktop or laptop with a headset provides the best quality. Tablet and mobile use are supported when the device check passes.', continue:'Continue', profileTitle:'Candidate details and consent', profileText:'Enter your details and review the information before the technical check.', firstName:'First name', lastName:'Last name', email:'Email', consentGeneral:'I have read the candidate information and agree to participate in this structured AI-supported interview.', consentAudio:'I consent to microphone use, audio recording, transcription and analysis for this interview.', consentVideo:'I consent to camera use and video recording for this interview.', humanDecision:'CLARITY supports structured analysis. It does not make the final hiring decision. Human review remains required.', back:'Back', deviceCheck:'Run device check', preflightTitle:'Technical check', preflightText:'Microphone, camera, browser and network suitability are checked before the interview starts.', browser:'Browser', microphone:'Microphone', camera:'Camera', network:'Network', screen:'Screen', audioOutput:'Audio output', checking:'Checking…', allowPermissions:'Allow microphone and camera access when your browser asks.', retry:'Retry', startInterview:'Start interview', aiInterviewer:'AI INTERVIEWER', interviewerAudio:'Interviewer audio', preparing:'Preparing…', help:'Help', endInterview:'End interview', writtenPart:'WRITTEN PART', chatTitle:'Final written questions', chatText:'Answer the remaining questions in your own words. Submit one answer at a time.', chatPlaceholder:'Write your answer…', send:'Send', processingTitle:'Your interview is being processed', processingText:'The recording, transcript and report are being prepared. Keep this page open until completion is confirmed.', recordingSaved:'Recording saved', analysis:'Analysis', report:'Report', completeTitle:'Interview completed', completeText:'Your responses were submitted successfully. You may now close this window.', ratingTitle:'How was your experience?', ratingPlaceholder:'Optional feedback', submitRating:'Submit rating', helpTitle:'Interview help', helpText:'Stay on this page, speak naturally and allow short pauses. Check that your browser still has microphone and camera permission.', helpOne:'Use headphones when possible.', helpTwo:'Do not switch apps during the interview.', helpThree:'Use the end button only when necessary.', audio:'Audio', video:'Video', audioChat:'Audio + written part', videoChat:'Video + written part', ready:'Ready', listening:'Listening', aiSpeaking:'Interviewer is speaking', userSpeaking:'Listening to you', thinking:'Preparing the next question', processing:'Processing', connected:'Connected', reconnecting:'Reconnecting', formRequired:'Please complete all required fields and consents.', permissionFailed:'Microphone or camera permission was not granted. Check your browser settings and retry.', preflightGood:'Your device is ready for the interview.', preflightLimited:'The interview can start, but a desktop and headset may provide better quality.', startFailed:'The interview could not be started. No new credit was consumed before the secure start was confirmed.', reportPreparing:'Your interview was submitted. The report is still being prepared.', ratingSaved:'Thank you. Your rating was saved.', ratingError:'The rating could not be saved.', confirmEnd:'End the interview now? Your current recording will be submitted and the interview cannot be restarted.', noPosition:'Position not specified'
    },
    de: {
      secure:'Sichere Sitzung', loadingTitle:'Interview wird vorbereitet', loadingText:'Der sichere Interview-Link wird geprüft.', unavailableTitle:'Link nicht verfügbar', unavailableText:'Dieser Interview-Link ist ungültig, abgelaufen, bereits abgeschlossen oder nicht mehr verfügbar.', welcomeEyebrow:'CLARITY INTERVIEW', welcomeTitle:'Ihr strukturiertes Interview', welcomeIntro:'Sie sprechen mit einem klar gekennzeichneten KI-Interviewer. Der Ablauf ist strukturiert; die abschließende Entscheidung bleibt beim Menschen.', position:'Position', format:'Format', depth:'Tiefe', language:'Sprache', recommendationTitle:'Empfohlene Ausstattung', recommendationText:'Desktop oder Laptop mit Headset bietet die beste Qualität. Tablet und Smartphone werden unterstützt, wenn der Technikcheck erfolgreich ist.', continue:'Weiter', profileTitle:'Kandidatendaten und Einwilligung', profileText:'Geben Sie Ihre Daten ein und prüfen Sie die Hinweise vor dem Technikcheck.', firstName:'Vorname', lastName:'Nachname', email:'E-Mail', consentGeneral:'Ich habe die Kandidateninformationen gelesen und stimme der Teilnahme an diesem strukturierten KI-unterstützten Interview zu.', consentAudio:'Ich stimme der Mikrofonnutzung, Audioaufnahme, Transkription und Analyse für dieses Interview zu.', consentVideo:'Ich stimme der Kameranutzung und Videoaufnahme für dieses Interview zu.', humanDecision:'CLARITY unterstützt die strukturierte Analyse. CLARITY trifft keine abschließende Einstellungsentscheidung. Eine menschliche Prüfung bleibt erforderlich.', back:'Zurück', deviceCheck:'Technik prüfen', preflightTitle:'Technikcheck', preflightText:'Mikrofon, Kamera, Browser und Netzwerk werden vor dem Start geprüft.', browser:'Browser', microphone:'Mikrofon', camera:'Kamera', network:'Netzwerk', screen:'Bildschirm', audioOutput:'Audioausgabe', checking:'Prüfung läuft…', allowPermissions:'Erlauben Sie Mikrofon und Kamera, sobald Ihr Browser danach fragt.', retry:'Erneut prüfen', startInterview:'Interview starten', aiInterviewer:'KI-INTERVIEWER', interviewerAudio:'Interviewer-Audio', preparing:'Vorbereitung…', help:'Hilfe', endInterview:'Interview beenden', writtenPart:'SCHRIFTLICHER TEIL', chatTitle:'Letzte schriftliche Fragen', chatText:'Beantworten Sie die verbleibenden Fragen in Ihren eigenen Worten. Senden Sie jeweils eine Antwort.', chatPlaceholder:'Antwort eingeben…', send:'Senden', processingTitle:'Ihr Interview wird verarbeitet', processingText:'Aufnahme, Transkript und Report werden vorbereitet. Lassen Sie diese Seite geöffnet, bis der Abschluss bestätigt ist.', recordingSaved:'Aufnahme gespeichert', analysis:'Analyse', report:'Report', completeTitle:'Interview abgeschlossen', completeText:'Ihre Antworten wurden erfolgreich übermittelt. Sie können dieses Fenster jetzt schließen.', ratingTitle:'Wie war Ihre Erfahrung?', ratingPlaceholder:'Optionales Feedback', submitRating:'Bewertung senden', helpTitle:'Hilfe zum Interview', helpText:'Bleiben Sie auf dieser Seite, sprechen Sie natürlich und lassen Sie kurze Pausen zu. Prüfen Sie, ob Mikrofon- und Kamerarechte weiterhin aktiv sind.', helpOne:'Nutzen Sie nach Möglichkeit ein Headset.', helpTwo:'Wechseln Sie während des Interviews nicht in andere Apps.', helpThree:'Nutzen Sie den Beenden-Button nur wenn notwendig.', audio:'Audio', video:'Video', audioChat:'Audio + schriftlicher Teil', videoChat:'Video + schriftlicher Teil', ready:'Bereit', listening:'Ich höre zu', aiSpeaking:'Interviewer spricht', userSpeaking:'Ich höre Ihnen zu', thinking:'Nächste Frage wird vorbereitet', processing:'Verarbeitung', connected:'Verbunden', reconnecting:'Verbindung wird wiederhergestellt', formRequired:'Bitte füllen Sie alle Pflichtfelder aus und bestätigen Sie die erforderlichen Einwilligungen.', permissionFailed:'Mikrofon- oder Kamerazugriff wurde nicht erlaubt. Prüfen Sie die Browsereinstellungen und versuchen Sie es erneut.', preflightGood:'Ihr Gerät ist für das Interview bereit.', preflightLimited:'Das Interview kann starten. Desktop und Headset können jedoch eine bessere Qualität bieten.', startFailed:'Das Interview konnte nicht gestartet werden. Vor Bestätigung des sicheren Starts wurde kein neuer Credit verbraucht.', reportPreparing:'Ihr Interview wurde übermittelt. Der Report wird noch vorbereitet.', ratingSaved:'Vielen Dank. Ihre Bewertung wurde gespeichert.', ratingError:'Die Bewertung konnte nicht gespeichert werden.', confirmEnd:'Interview jetzt beenden? Die aktuelle Aufnahme wird übermittelt und das Interview kann nicht neu gestartet werden.', noPosition:'Position nicht angegeben'
    },
    es:{secure:'Sesión segura',loadingTitle:'Preparando la entrevista',loadingText:'Se está verificando el enlace seguro.',unavailableTitle:'Enlace no disponible',unavailableText:'El enlace no es válido, ha caducado o ya se utilizó.',welcomeEyebrow:'ENTREVISTA CLARITY',welcomeTitle:'Su entrevista estructurada',welcomeIntro:'Hablará con un entrevistador de IA claramente identificado. La decisión final sigue siendo humana.',position:'Puesto',format:'Formato',depth:'Profundidad',language:'Idioma',recommendationTitle:'Configuración recomendada',recommendationText:'Un ordenador con auriculares ofrece la mejor calidad. También se admiten tabletas y móviles si superan la prueba.',continue:'Continuar',profileTitle:'Datos y consentimiento',profileText:'Introduzca sus datos antes de la prueba técnica.',firstName:'Nombre',lastName:'Apellidos',email:'Correo electrónico',consentGeneral:'He leído la información y acepto participar en esta entrevista estructurada con apoyo de IA.',consentAudio:'Acepto el uso del micrófono, la grabación, transcripción y análisis.',consentVideo:'Acepto el uso de la cámara y la grabación de vídeo.',humanDecision:'CLARITY apoya el análisis estructurado. La decisión final requiere revisión humana.',back:'Atrás',deviceCheck:'Comprobar dispositivo',preflightTitle:'Prueba técnica',preflightText:'Se comprobarán el micrófono, la cámara, el navegador y la red.',browser:'Navegador',microphone:'Micrófono',camera:'Cámara',network:'Red',screen:'Pantalla',audioOutput:'Salida de audio',checking:'Comprobando…',allowPermissions:'Permita el acceso al micrófono y la cámara.',retry:'Reintentar',startInterview:'Iniciar entrevista',aiInterviewer:'ENTREVISTADOR IA',interviewerAudio:'Audio del entrevistador',preparing:'Preparando…',help:'Ayuda',endInterview:'Finalizar entrevista',writtenPart:'PARTE ESCRITA',chatTitle:'Últimas preguntas escritas',chatText:'Responda con sus propias palabras.',chatPlaceholder:'Escriba su respuesta…',send:'Enviar',processingTitle:'Procesando la entrevista',processingText:'Se están preparando la grabación, la transcripción y el informe.',recordingSaved:'Grabación guardada',analysis:'Análisis',report:'Informe',completeTitle:'Entrevista completada',completeText:'Sus respuestas se enviaron correctamente.',ratingTitle:'¿Cómo fue su experiencia?',ratingPlaceholder:'Comentario opcional',submitRating:'Enviar valoración',audio:'Audio',video:'Vídeo',audioChat:'Audio + parte escrita',videoChat:'Vídeo + parte escrita',ready:'Listo',listening:'Escuchando',aiSpeaking:'El entrevistador habla',userSpeaking:'Le estamos escuchando',thinking:'Preparando la siguiente pregunta',processing:'Procesando',connected:'Conectado',formRequired:'Complete los campos obligatorios y los consentimientos.',permissionFailed:'No se concedió permiso para el micrófono o la cámara.',preflightGood:'Su dispositivo está listo.',preflightLimited:'Puede comenzar, aunque un ordenador y auriculares pueden mejorar la calidad.',startFailed:'No se pudo iniciar la entrevista.',reportPreparing:'La entrevista se envió. El informe sigue en preparación.',ratingSaved:'Gracias. Se guardó su valoración.',ratingError:'No se pudo guardar la valoración.',confirmEnd:'¿Finalizar ahora la entrevista?',noPosition:'Puesto no especificado'},
    fr:{secure:'Session sécurisée',loadingTitle:'Préparation de l’entretien',loadingText:'Le lien sécurisé est en cours de vérification.',unavailableTitle:'Lien indisponible',unavailableText:'Ce lien est invalide, expiré ou déjà utilisé.',welcomeEyebrow:'ENTRETIEN CLARITY',welcomeTitle:'Votre entretien structuré',welcomeIntro:'Vous parlerez avec un intervieweur IA clairement identifié. La décision finale reste humaine.',position:'Poste',format:'Format',depth:'Profondeur',language:'Langue',recommendationTitle:'Configuration recommandée',recommendationText:'Un ordinateur avec casque offre la meilleure qualité. Tablettes et mobiles sont également pris en charge.',continue:'Continuer',profileTitle:'Informations et consentement',profileText:'Saisissez vos informations avant le test technique.',firstName:'Prénom',lastName:'Nom',email:'E-mail',consentGeneral:'J’ai lu les informations et j’accepte de participer à cet entretien structuré assisté par IA.',consentAudio:'J’accepte l’utilisation du microphone, l’enregistrement, la transcription et l’analyse.',consentVideo:'J’accepte l’utilisation de la caméra et l’enregistrement vidéo.',humanDecision:'CLARITY soutient l’analyse structurée. Une validation humaine reste nécessaire.',back:'Retour',deviceCheck:'Vérifier l’appareil',preflightTitle:'Test technique',preflightText:'Le microphone, la caméra, le navigateur et le réseau seront vérifiés.',browser:'Navigateur',microphone:'Microphone',camera:'Caméra',network:'Réseau',screen:'Écran',audioOutput:'Sortie audio',checking:'Vérification…',allowPermissions:'Autorisez l’accès au microphone et à la caméra.',retry:'Réessayer',startInterview:'Démarrer l’entretien',aiInterviewer:'INTERVIEWEUR IA',interviewerAudio:'Audio de l’intervieweur',preparing:'Préparation…',help:'Aide',endInterview:'Terminer l’entretien',writtenPart:'PARTIE ÉCRITE',chatTitle:'Dernières questions écrites',chatText:'Répondez avec vos propres mots.',chatPlaceholder:'Écrivez votre réponse…',send:'Envoyer',processingTitle:'Traitement de l’entretien',processingText:'L’enregistrement, la transcription et le rapport sont en préparation.',recordingSaved:'Enregistrement sauvegardé',analysis:'Analyse',report:'Rapport',completeTitle:'Entretien terminé',completeText:'Vos réponses ont été envoyées avec succès.',ratingTitle:'Comment s’est passée votre expérience ?',ratingPlaceholder:'Commentaire facultatif',submitRating:'Envoyer la note',audio:'Audio',video:'Vidéo',audioChat:'Audio + partie écrite',videoChat:'Vidéo + partie écrite',ready:'Prêt',listening:'À l’écoute',aiSpeaking:'L’intervieweur parle',userSpeaking:'Nous vous écoutons',thinking:'Préparation de la prochaine question',processing:'Traitement',connected:'Connecté',formRequired:'Complétez les champs obligatoires et les consentements.',permissionFailed:'L’accès au microphone ou à la caméra n’a pas été autorisé.',preflightGood:'Votre appareil est prêt.',preflightLimited:'Vous pouvez commencer, mais un ordinateur avec casque peut améliorer la qualité.',startFailed:'L’entretien n’a pas pu démarrer.',reportPreparing:'L’entretien a été envoyé. Le rapport est encore en préparation.',ratingSaved:'Merci. Votre note a été enregistrée.',ratingError:'La note n’a pas pu être enregistrée.',confirmEnd:'Terminer l’entretien maintenant ?',noPosition:'Poste non précisé'},
    it:{secure:'Sessione sicura',loadingTitle:'Preparazione del colloquio',loadingText:'Verifica del link sicuro in corso.',unavailableTitle:'Link non disponibile',unavailableText:'Il link non è valido, è scaduto o è già stato utilizzato.',welcomeEyebrow:'COLLOQUIO CLARITY',welcomeTitle:'Il tuo colloquio strutturato',welcomeIntro:'Parlerai con un intervistatore AI chiaramente identificato. La decisione finale rimane umana.',position:'Posizione',format:'Formato',depth:'Profondità',language:'Lingua',recommendationTitle:'Configurazione consigliata',recommendationText:'Un computer con cuffie offre la qualità migliore. Sono supportati anche tablet e smartphone.',continue:'Continua',profileTitle:'Dati e consenso',profileText:'Inserisci i tuoi dati prima del controllo tecnico.',firstName:'Nome',lastName:'Cognome',email:'E-mail',consentGeneral:'Ho letto le informazioni e accetto di partecipare a questo colloquio strutturato supportato dall’AI.',consentAudio:'Acconsento all’uso del microfono, alla registrazione, trascrizione e analisi.',consentVideo:'Acconsento all’uso della videocamera e alla registrazione video.',humanDecision:'CLARITY supporta l’analisi strutturata. È sempre necessaria una revisione umana.',back:'Indietro',deviceCheck:'Controlla dispositivo',preflightTitle:'Controllo tecnico',preflightText:'Verranno controllati microfono, videocamera, browser e rete.',browser:'Browser',microphone:'Microfono',camera:'Videocamera',network:'Rete',screen:'Schermo',audioOutput:'Uscita audio',checking:'Controllo…',allowPermissions:'Consenti l’accesso al microfono e alla videocamera.',retry:'Riprova',startInterview:'Avvia colloquio',aiInterviewer:'INTERVISTATORE AI',interviewerAudio:'Audio intervistatore',preparing:'Preparazione…',help:'Aiuto',endInterview:'Termina colloquio',writtenPart:'PARTE SCRITTA',chatTitle:'Ultime domande scritte',chatText:'Rispondi con parole tue.',chatPlaceholder:'Scrivi la risposta…',send:'Invia',processingTitle:'Elaborazione del colloquio',processingText:'Registrazione, trascrizione e report sono in preparazione.',recordingSaved:'Registrazione salvata',analysis:'Analisi',report:'Report',completeTitle:'Colloquio completato',completeText:'Le risposte sono state inviate correttamente.',ratingTitle:'Com’è stata la tua esperienza?',ratingPlaceholder:'Feedback facoltativo',submitRating:'Invia valutazione',audio:'Audio',video:'Video',audioChat:'Audio + parte scritta',videoChat:'Video + parte scritta',ready:'Pronto',listening:'In ascolto',aiSpeaking:'L’intervistatore sta parlando',userSpeaking:'Ti stiamo ascoltando',thinking:'Preparazione della prossima domanda',processing:'Elaborazione',connected:'Connesso',formRequired:'Completa i campi obbligatori e i consensi.',permissionFailed:'Permesso per microfono o videocamera non concesso.',preflightGood:'Il dispositivo è pronto.',preflightLimited:'Puoi iniziare, ma computer e cuffie possono migliorare la qualità.',startFailed:'Impossibile avviare il colloquio.',reportPreparing:'Il colloquio è stato inviato. Il report è ancora in preparazione.',ratingSaved:'Grazie. La valutazione è stata salvata.',ratingError:'Impossibile salvare la valutazione.',confirmEnd:'Terminare ora il colloquio?',noPosition:'Posizione non specificata'},
    pt:{},nl:{},pl:{},tr:{},ar:{},ru:{},zh:{}
  };

  // Fill less common UI languages from English while keeping the live interview language unchanged.
  ['pt','nl','pl','tr','ar','ru','zh'].forEach(code => { I18N[code] = { ...I18N.en, ...I18N[code] }; });

  const LANGUAGE_NAMES = {de:'Deutsch',en:'English',es:'Español',fr:'Français',it:'Italiano',pt:'Português',nl:'Nederlands',pl:'Polski',tr:'Türkçe',ar:'العربية',ru:'Русский',zh:'中文',ja:'日本語',ko:'한국어',cs:'Čeština',sv:'Svenska',no:'Norsk',da:'Dansk',fi:'Suomi',el:'Ελληνικά',ro:'Română',hu:'Magyar',uk:'Українська',he:'עברית',hi:'हिन्दी',id:'Bahasa Indonesia',ms:'Bahasa Melayu',th:'ไทย',vi:'Tiếng Việt'};

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const el = id => document.getElementById(id);
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const text = (value, fallback = '') => String(value ?? fallback).trim();
  const log = (...args) => { if (debug) console.log('[IV4]', ...args); };

  function t(key) {
    return I18N[state.lang]?.[key] || I18N.en[key] || key;
  }

  function normalizeLang(value) {
    const code = text(value || 'en').toLowerCase().replace('_','-').slice(0,2);
    return LANGUAGE_NAMES[code] ? code : 'en';
  }

  function setScreen(name) {
    $$('.screen').forEach(node => node.classList.remove('active'));
    const target = el(`screen${name}`);
    if (target) target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function applyI18n() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = ['ar','he'].includes(state.lang) ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
    $$('[data-i18n-placeholder]').forEach(node => { node.placeholder = t(node.dataset.i18nPlaceholder); });
  }

  function modeLabel(mode) {
    return t({audio:'audio',video:'video',audio_chat:'audioChat',video_chat:'videoChat'}[mode] || 'video');
  }

  function calculateQuestionSplit() {
    const total = Math.max(1, Number(state.invite?.questionCount || 10));
    if (!state.hybrid) return { oral: total, chat: 0 };
    const oral = Math.max(1, Math.min(total - 1, Math.ceil(total * 0.7)));
    return { oral, chat: total - oral };
  }

  function splitQuestionLines(raw) {
    return text(raw).split(/\r?\n+/).map(line => line.replace(/^\s*(?:Q?\d+[.)\-:]|[-*•])\s*/i,'').trim()).filter(Boolean);
  }

  function currentQuestionPlan() {
    return splitQuestionLines(state.invite?.finalQuestionsSnapshot || '');
  }

  function oralQuestionsText() {
    return currentQuestionPlan().slice(0, state.oralQuestionCount).join('\n');
  }

  function chatQuestionsText() {
    return currentQuestionPlan().slice(state.oralQuestionCount).join('\n');
  }

  function buildRuntimeContext() {
    const inv = state.invite || {};
    const fullPlan = currentQuestionPlan();
    return {
      uid: state.uid,
      linkId: state.uid,
      companyId: inv.companyId || '',
      companyName: inv.companyName || state.branding?.brandName || 'CLARITY',
      position: inv.position || '',
      mode: state.mediaMode,
      originalMode: state.mode,
      audioOnly: state.mediaMode === 'audio',
      noVideo: state.mediaMode === 'audio',
      lang: state.lang,
      userCommLang: state.lang,
      interviewLang: state.lang,
      interviewLanguage: state.lang,
      reportLang: inv.reportLang || state.lang,
      reportLanguage: inv.reportLang || state.lang,
      pdfLang: inv.reportLang || state.lang,
      voice: inv.voice || 'cedar',
      productType: 'interview',
      interviewMode: state.hybrid ? 'hybrid' : 'structured',
      hybridInterview: state.hybrid,
      questionSet: inv.questionSet || `Q${inv.questionCount || 10}`,
      questionCount: state.oralQuestionCount,
      totalQuestionCount: inv.questionCount || fullPlan.length || 10,
      chatQuestionCount: state.chatQuestionCount,
      customQuestionsText: oralQuestionsText(),
      finalQuestionsSnapshot: fullPlan.join('\n'),
      roleProfileText: inv.roleProfile || '',
      docsText: inv.docs || '',
      kbText: [inv.kbText,inv.companyInstructions,inv.analysisFocus].filter(Boolean).join('\n\n'),
      jobAd: inv.jobAd || '',
      snapshotLocked: inv.questionSnapshotLocked === true,
      questionSnapshotLocked: inv.questionSnapshotLocked === true,
      questionSnapshotSource: inv.questionSnapshotSource || '',
      customerQuestionCount: inv.customQuestionCount || 0,
      generatedQuestionCount: inv.generatedFillCount || 0,
      controlledInterview: true,
      controlledInterviewDriver: true,
      driverEnabled: true,
      strictSlotPlan: true,
      iv4SessionToken: state.token,
      candidateName: `${el('firstName').value} ${el('lastName').value}`.trim(),
      candidateEmail: el('email').value.trim().toLowerCase(),
      experienceVersion: VERSION
    };
  }

  function applyBranding() {
    const b = state.branding || {};
    const colors = b.colors || {};
    const root = document.documentElement.style;
    if (colors.primary) root.setProperty('--brand-primary', colors.primary);
    if (colors.secondary) root.setProperty('--brand-secondary', colors.secondary);
    if (colors.accent) root.setProperty('--brand-accent', colors.accent);
    if (colors.highlight) root.setProperty('--brand-highlight', colors.highlight);
    el('brandName').textContent = b.brandName || state.invite?.companyName || 'CLARITY';
    const logo = text(b.logo);
    if (logo && /^https:\/\//i.test(logo)) el('brandLogo').src = logo;
  }

  function hydrateSummary() {
    const inv = state.invite || {};
    el('summaryPosition').textContent = inv.position || t('noPosition');
    el('summaryMode').textContent = modeLabel(state.mode);
    el('summaryDepth').textContent = inv.questionSet || `Q${inv.questionCount || 10}`;
    el('summaryLanguage').textContent = LANGUAGE_NAMES[state.lang] || state.lang.toUpperCase();
    el('roomPosition').textContent = inv.position || 'CLARITY Interview';
    el('questionProgress').textContent = `Q 0 / ${state.oralQuestionCount}`;
    el('videoConsentRow').classList.toggle('hidden', state.mediaMode === 'audio');
    el('consentVideo').required = state.mediaMode === 'video';
  }

  async function fetchJson(url, options = {}, timeoutMs = 45000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      const bodyText = await response.text();
      let data = null;
      try { data = bodyText ? JSON.parse(bodyText) : {}; } catch (_) { throw new Error(`invalid_json_${response.status}`); }
      if (!response.ok || data?.ok === false) {
        const error = new Error(data?.message || data?.error || `request_failed_${response.status}`);
        error.code = data?.code || data?.error || `HTTP_${response.status}`;
        error.details = data?.details || null;
        throw error;
      }
      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  function apiGet(endpoint, params = {}, timeoutMs = 45000) {
    const url = new URL(`${API_ROOT}/${endpoint}`);
    Object.entries(params).forEach(([key,value]) => { if (value !== undefined && value !== null && value !== '') url.searchParams.set(key,String(value)); });
    return fetchJson(url.toString(), { headers: { Accept:'application/json' } }, timeoutMs);
  }

  function apiPost(endpoint, payload = {}, timeoutMs = 70000) {
    return fetchJson(`${API_ROOT}/${endpoint}`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', Accept:'application/json', ...(state.token ? { Authorization:`Bearer ${state.token}` } : {}) },
      body:JSON.stringify({ uid:state.uid, ...payload, ...(state.token ? { token:state.token } : {}) })
    }, timeoutMs);
  }

  async function clientEvent(type, payload = {}, level = 'info') {
    try {
      await apiPost('iv4ClientEvent', { type, level, message:type, payload, sessionId:state.sessionId, userAgent:navigator.userAgent, url:location.href }, 12000);
    } catch (_) {}
  }

  async function bootstrap() {
    if (!/^IV-/i.test(state.uid)) {
      showUnavailable('IV4_UID_REQUIRED');
      return;
    }
    try {
      const data = await apiGet('iv4Bootstrap', { uid:state.uid, deviceClass:deviceClass() });
      if (!data.available) {
        showUnavailable(data.availability?.status || 'unavailable');
        return;
      }
      state.token = data.sessionToken;
      state.tokenExpiresAt = data.tokenExpiresAt;
      state.invite = data.invite || {};
      state.branding = data.branding || {};
      state.lang = normalizeLang(state.invite.userCommLang || 'en');
      state.mode = state.invite.mode || 'video';
      state.mediaMode = state.invite.mediaMode || (state.mode.startsWith('audio') ? 'audio' : 'video');
      state.hybrid = state.invite.hybrid === true;
      const split = calculateQuestionSplit();
      state.oralQuestionCount = split.oral;
      state.chatQuestionCount = split.chat;
      applyI18n();
      applyBranding();
      hydrateSummary();
      setScreen('Welcome');
      await clientEvent('IV4_CLIENT_BOOTSTRAP_READY', { mode:state.mode, lang:state.lang, deviceClass:deviceClass() });
    } catch (error) {
      log('bootstrap failed', error);
      showUnavailable(error.code || error.message);
    }
  }

  function showUnavailable(reason) {
    setScreen('Unavailable');
    if (reason) el('unavailableMessage').textContent = `${t('unavailableText')} (${reason})`;
  }

  function deviceClass() {
    const width = Math.min(screen.width || innerWidth, innerWidth || screen.width);
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  function setCheck(name, status, detail) {
    const card = document.querySelector(`[data-check="${name}"]`);
    if (!card) return;
    card.classList.remove('pass','warn','fail');
    card.classList.add(status);
    card.querySelector('.check-symbol').textContent = status === 'pass' ? '✓' : status === 'warn' ? '!' : '×';
    card.querySelector('small').textContent = detail || '';
  }

  async function runPreflight() {
    state.preflightPassed = false;
    el('btnStartInterview').disabled = true;
    el('preflightError').classList.add('hidden');
    ['browser','microphone','camera','network','screen','audioOutput'].forEach(name => setCheck(name,'warn',t('checking')));

    const summary = {
      checkedAt:new Date().toISOString(),
      deviceClass:deviceClass(),
      userAgent:navigator.userAgent,
      platform:navigator.userAgentData?.platform || navigator.platform || '',
      screen:{ width:screen.width,height:screen.height,pixelRatio:devicePixelRatio || 1 },
      connection:{},
      permissions:{ microphone:false,camera:state.mediaMode === 'audio' },
      browserSupported:Boolean(navigator.mediaDevices?.getUserMedia && window.RTCPeerConnection && window.MediaRecorder)
    };

    setCheck('browser', summary.browserSupported ? 'pass':'fail', summary.browserSupported ? 'WebRTC + MediaRecorder' : 'Unsupported browser');
    const screenOk = innerWidth >= 340 && innerHeight >= 500;
    const screenOptimal = deviceClass() === 'desktop' || deviceClass() === 'tablet';
    setCheck('screen', screenOk ? (screenOptimal ? 'pass':'warn'):'fail', `${innerWidth} × ${innerHeight}px`);
    setCheck('audioOutput', 'pass', 'Browser audio available');

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      summary.connection = { effectiveType:connection.effectiveType || '',downlink:connection.downlink || 0,rtt:connection.rtt || 0,saveData:connection.saveData === true };
      const weak = connection.saveData || ['slow-2g','2g'].includes(connection.effectiveType) || (connection.downlink && connection.downlink < .8);
      setCheck('network', weak ? 'warn':'pass', `${connection.effectiveType || 'online'}${connection.downlink ? ` · ${connection.downlink} Mbps`:''}`);
    } else {
      setCheck('network', navigator.onLine ? 'pass':'fail', navigator.onLine ? 'Online':'Offline');
    }

    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio:{ echoCancellation:true,noiseSuppression:true,autoGainControl:true },
        video:state.mediaMode === 'video' ? { facingMode:'user',width:{ideal:1280},height:{ideal:720} } : false
      });
      summary.permissions.microphone = stream.getAudioTracks().length > 0;
      summary.permissions.camera = state.mediaMode === 'audio' || stream.getVideoTracks().length > 0;
      const micLabel = stream.getAudioTracks()[0]?.label || 'Microphone ready';
      const camLabel = state.mediaMode === 'audio' ? 'Not required' : (stream.getVideoTracks()[0]?.label || 'Camera ready');
      setCheck('microphone', summary.permissions.microphone ? 'pass':'fail', micLabel);
      setCheck('camera', summary.permissions.camera ? 'pass':'fail', camLabel);
    } catch (error) {
      summary.mediaError = `${error.name || 'MediaError'}: ${error.message || ''}`;
      setCheck('microphone','fail',error.name || 'Permission denied');
      setCheck('camera',state.mediaMode === 'audio' ? 'pass':'fail',state.mediaMode === 'audio' ? 'Not required':(error.name || 'Permission denied'));
      el('preflightError').textContent = t('permissionFailed');
      el('preflightError').classList.remove('hidden');
    } finally {
      stream?.getTracks()?.forEach(track => track.stop());
    }

    state.deviceSummary = summary;
    const criticalPass = summary.browserSupported && screenOk && summary.permissions.microphone && summary.permissions.camera && navigator.onLine;
    state.preflightPassed = criticalPass;
    el('btnStartInterview').disabled = !criticalPass;
    const result = el('preflightResult');
    result.querySelector('strong').textContent = criticalPass ? (screenOptimal ? t('preflightGood'):t('preflightLimited')) : t('permissionFailed');
    result.querySelector('p').textContent = criticalPass ? t('recommendationText') : t('allowPermissions');
    await clientEvent('IV4_DEVICE_PREFLIGHT', { ...summary, passed:criticalPass }, criticalPass ? 'info':'warning');
  }

  async function reserveAndStart() {
    if (!state.preflightPassed || state.reserved) return;
    const button = el('btnStartInterview');
    button.disabled = true;
    button.textContent = t('preparing');
    try {
      await apiPost('iv4Reserve', {
        firstName:el('firstName').value.trim(),
        lastName:el('lastName').value.trim(),
        email:el('email').value.trim().toLowerCase(),
        mode:state.mode,
        userCommLang:state.lang,
        reportLang:state.invite.reportLang || state.lang,
        userConsent:el('consentGeneral').checked,
        consentAudio:el('consentAudio').checked,
        consentVideo:state.mediaMode === 'audio' ? false : el('consentVideo').checked,
        privacyVersion:PRIVACY_VERSION,
        deviceSummary:state.deviceSummary
      });
      state.reserved = true;
      state.startedAt = new Date().toISOString();
      state.unloadGuard = true;
      requestWakeLock();
      setScreen('Room');
      el('connectionBadge').classList.remove('hidden');
      setConnection('warn',t('preparing'));
      initializeRuntime();
    } catch (error) {
      button.disabled = false;
      button.textContent = t('startInterview');
      el('preflightError').textContent = error.message || t('startFailed');
      el('preflightError').classList.remove('hidden');
    }
  }

  function initializeRuntime() {
    const frame = el('liveRuntime');
    const url = new URL(RUNTIME_FILE, location.href);
    url.searchParams.set('uid',state.uid);
    url.searchParams.set('companyId',state.invite.companyId || '');
    url.searchParams.set('lang',state.lang);
    url.searchParams.set('reportLang',state.invite.reportLang || state.lang);
    url.searchParams.set('mode',state.mediaMode);
    url.searchParams.set('autostart','0');
    url.searchParams.set('shell','1');
    url.searchParams.set('experience','v4');
    url.searchParams.set('parentOrigin',location.origin);
    url.searchParams.set('api',location.origin);
    if (state.mediaMode === 'audio') {
      url.searchParams.set('audioOnly','1');
      url.searchParams.set('noVideo','1');
    }
    if (debug) { url.searchParams.set('debug','1'); url.searchParams.set('debugUi','1'); }
    frame.src = url.toString();
  }

  function postRuntime(type,data={}) {
    const frame = el('liveRuntime');
    if (!frame?.contentWindow) return;
    frame.contentWindow.postMessage({type,data},state.runtimeOrigin);
  }

  async function requestWakeLock() {
    try {
      if (!('wakeLock' in navigator) || document.hidden || state.wakeLock) return;
      state.wakeLock = await navigator.wakeLock.request('screen');
      state.wakeLock.addEventListener('release', () => { state.wakeLock = null; });
    } catch (_) {}
  }

  async function releaseWakeLock() {
    try { await state.wakeLock?.release?.(); } catch (_) {}
    state.wakeLock = null;
  }

  function setConnection(kind,label) {
    const dot = el('connectionDot');
    dot.className = `dot ${kind === 'live' ? 'dot-live':kind === 'error'?'dot-error':'dot-warn'}`;
    el('connectionText').textContent = label;
  }

  function setAvatar(stateName, label, energy = null) {
    const avatar = el('avatar');
    avatar.dataset.state = stateName || 'thinking';
    if (Number.isFinite(energy)) avatar.style.setProperty('--energy',String(Math.max(0,Math.min(1,energy))));
    el('avatarLabel').textContent = label || ({ai_speaking:t('aiSpeaking'),user_speaking:t('userSpeaking'),listening:t('listening'),thinking:t('thinking'),processing:t('processing')}[stateName] || t('preparing'));
  }

  function liveTurnToReportTurn(turn) {
    return {
      ...turn,
      speaker:turn.speaker || turn.role,
      role:turn.role || turn.speaker,
      text:turn.cleanText || turn.originalText || turn.text || '',
      content:turn.cleanText || turn.originalText || turn.text || ''
    };
  }

  async function flushTurns(force=false) {
    if (state.turnSaving || (!force && state.pendingTurns.length < 6) || !state.pendingTurns.length) return;
    state.turnSaving = true;
    const batch = state.pendingTurns.splice(0,MAX_TURN_BATCH);
    try {
      await apiPost('iv4Turns', {
        sessionId:state.sessionId || state.uid,
        candidateName:`${el('firstName').value} ${el('lastName').value}`.trim(),
        candidateEmail:el('email').value.trim().toLowerCase(),
        turns:batch
      },45000);
    } catch (error) {
      state.pendingTurns.unshift(...batch);
      log('turn save failed',error);
    } finally {
      state.turnSaving=false;
      if (force && state.pendingTurns.length) await flushTurns(true);
    }
  }

  async function confirmBillableStart() {
    if (state.platformStartConfirmed) return true;
    try {
      const response = await apiPost('iv4ConfirmStart', {
        sessionId:state.sessionId || '',
        realtimeSessionId:state.realtimeSessionId || '',
        eventReference:`${state.uid}:iv4_prepared`
      },45000);
      state.platformStartConfirmed = response.safeToRecord !== false;
    } catch (error) {
      log('confirm start direct failed',error);
      for (let i=0;i<4 && !state.platformStartConfirmed;i+=1) {
        await sleep(1400 + i*500);
        try {
          const check = await apiPost('iv4StartState',{},25000);
          const result = check.result || {};
          state.platformStartConfirmed = result.creditConsumed === true || result.safeToRecord === true || ['started','processing','completed'].includes(String(result.linkStatus || result.status || '').toLowerCase());
        } catch (_) {}
      }
    }
    if (!state.platformStartConfirmed) {
      try { await apiPost('iv4ReleaseStartFailure',{reason:'platform_start_unconfirmed'},25000); } catch (_) {}
      setConnection('error',t('startFailed'));
      el('roomStatus').textContent=t('startFailed');
      postRuntime('clarity.live.stop',{reason:'platform_start_unconfirmed',force:true});
      return false;
    }
    state.recordingEnabled=true;
    setConnection('live',t('connected'));
    el('roomStatus').textContent=t('connected');
    postRuntime('clarity.live.record',{enabled:true});
    return true;
  }

  async function handleRuntimeMessage(event) {
    if (event.origin !== state.runtimeOrigin || event.source !== el('liveRuntime')?.contentWindow) return;
    const {type,data={}} = event.data || {};
    if (!type) return;
    log('runtime',type,data);

    if (type === 'clarity.live.hello') {
      state.runtimeHello=true;
      const ctx=buildRuntimeContext();
      postRuntime('clarity.live.context',ctx);
      postRuntime('clarity.live.record',{enabled:false});
      setTimeout(()=>postRuntime('clarity.live.start',ctx),350);
      return;
    }
    if (type === 'clarity.live.ready') {
      state.runtimeReady=true;
      const ctx=buildRuntimeContext();
      postRuntime('clarity.live.prime',ctx);
      setConnection('warn',t('preparing'));
      return;
    }
    if (type === 'clarity.live.prepared') {
      await confirmBillableStart();
      return;
    }
    if (type === 'clarity.live.turn') {
      const turn=liveTurnToReportTurn(data);
      state.turns.push(turn);
      state.pendingTurns.push(turn);
      if (turn.questionIndex > 0) el('questionProgress').textContent=`Q ${Math.min(turn.questionIndex,state.oralQuestionCount)} / ${state.oralQuestionCount}`;
      if (state.pendingTurns.length>=6) flushTurns(false);
      return;
    }
    if (type === 'clarity.avatar') {
      setAvatar(data.state || 'thinking',null);
      return;
    }
    if (type === 'clarity.avatar.level') {
      const level=Math.max(0,Math.min(1,Number(data.value)||0));
      if (data.source==='ai') el('aiLevel').style.width=`${level*100}%`;
      if (data.source==='user') el('userLevel').style.width=`${level*100}%`;
      if (data.source==='ai') setAvatar(el('avatar').dataset.state,null,level);
      return;
    }
    if (type === 'clarity.live.audio_wait') { el('roomStatus').textContent=t('preparing'); return; }
    if (type === 'clarity.live.audio_ready') { el('roomStatus').textContent=t('connected'); return; }
    if (type === 'clarity.live.error' || type === 'clarity.live.permission_error') {
      setConnection('error',data.message || t('startFailed'));
      el('roomStatus').textContent=data.message || t('startFailed');
      if (!state.platformStartConfirmed) {
        try { await apiPost('iv4ReleaseStartFailure',{reason:data.code || data.message || 'live_start_error'},25000); } catch (_) {}
      }
      await clientEvent('IV4_LIVE_ERROR',data,'error');
      return;
    }
    if (type === 'candidate-audio:finished') {
      if (Number(data.size||0) <= 1200*1024) state.candidateAudio=data;
      return;
    }
    if (type === 'clarity.live.processing_started' || type === 'clarity.live.ended') {
      state.processingStarted=true;
      state.endedAt=state.endedAt || new Date().toISOString();
      setAvatar('processing',t('processing'));
      setScreen('Processing');
      markProcess('processUpload','active');
      return;
    }
    if (type === 'recorder:finished') {
      state.mux=data;
      await handleRecorderFinished(data);
      return;
    }
    if (type === 'recorder:upload_error') {
      await clientEvent('IV4_RECORDER_UPLOAD_ERROR',data,'error');
      return;
    }
    if (type === 'clarity.live.handoff_ready') {
      state.handoffReady=true;
      return;
    }
    if (type === 'clarity.live.log' && debug) console.log('[LIVE]',data);
  }

  function markProcess(id,status) {
    const node=el(id); if (!node) return;
    node.classList.remove('active','done');
    if (status) node.classList.add(status);
  }

  async function handleRecorderFinished(payload) {
    if (state.finalizationRequested) return;
    state.finalizationRequested=true;
    setScreen('Processing');
    markProcess('processUpload','active');
    await flushTurns(true);
    try {
      const saved=await apiPost('iv4SaveMux',{
        durationMs:payload.durationMs||0,
        size:payload.size||0,
        uploadUrl:payload.uploadUrl||'',
        mux:payload.mux||{},
        realtimeSessionId:state.realtimeSessionId||''
      },70000);
      const result=saved.result||{};
      state.sessionId=result.sessionId || result.session?.sessionId || state.sessionId || state.uid;
      markProcess('processUpload','done');
      markProcess('processAnalysis','active');

      if (state.hybrid && state.chatQuestionCount>0) {
        await apiPost('iv4MixHandover',{sessionId:state.sessionId,mixPhase:'chat'},35000).catch(()=>null);
        await startChatPhase();
      } else {
        await finalizeMediaInterview();
      }
    } catch (error) {
      state.finalizationRequested=false;
      el('processingMessage').textContent=`${t('reportPreparing')} ${error.message || ''}`;
      await clientEvent('IV4_MUX_SAVE_OR_FINALIZE_ERROR',{message:error.message,code:error.code},'error');
      startStatusPolling();
    }
  }

  async function finalizeMediaInterview() {
    try {
      const media=state.mux?.mux || {};
      await apiPost('iv4Finalize',{
        sessionId:state.sessionId||state.uid,
        transcript:state.turns.slice(-240),
        candidateName:`${el('firstName').value} ${el('lastName').value}`.trim(),
        companyName:state.invite.companyName||'',
        position:state.invite.position||'',
        startedAt:state.startedAt,
        endedAt:state.endedAt||new Date().toISOString(),
        durationMs:state.mux?.durationMs||0,
        media,
        candidateAudio:state.candidateAudio||{}
      },105000);
      markProcess('processAnalysis','done');
      markProcess('processReport','active');
    } catch (error) {
      log('finalize returned error/timeout',error);
      el('processingMessage').textContent=t('reportPreparing');
    }
    startStatusPolling();
  }

  async function startChatPhase() {
    state.finalizationRequested=false;
    state.chatMetrics.startedAt=new Date().toISOString();
    try {
      const response=await apiPost('iv4ChatStart',{
        sessionId:state.sessionId||state.uid,
        payload:{
          questionCount:state.chatQuestionCount,
          chatQuestionsText:chatQuestionsText(),
          customQuestionsText:chatQuestionsText(),
          history:[],
          metrics:state.chatMetrics,
          mediaTranscript:state.turns
        }
      },70000);
      const result=response.result||{};
      state.chatHistory=result.history||[];
      setScreen('Chat');
      renderChat();
      el('chatInput').focus();
    } catch (error) {
      await clientEvent('IV4_CHAT_START_ERROR',{message:error.message},'error');
      setScreen('Processing');
      await finalizeMediaInterview();
    }
  }

  function renderChat() {
    const box=el('chatMessages');
    box.innerHTML='';
    state.chatHistory.forEach(item=>{
      const bubble=document.createElement('div');
      bubble.className=`bubble ${item.role==='user'?'user':'ai'}`;
      bubble.textContent=item.text||'';
      box.appendChild(bubble);
    });
    box.scrollTop=box.scrollHeight;
  }

  async function submitChatMessage(event) {
    event.preventDefault();
    const input=el('chatInput');
    const message=input.value.trim();
    if (!message || state.chatDone) return;
    const button=el('btnSendChat');
    button.disabled=true;
    input.disabled=true;
    const started=performance.now();
    state.chatMetrics.messages+=1;
    state.chatMetrics.totalChars+=message.length;
    state.chatMetrics.totalWords+=message.split(/\s+/).filter(Boolean).length;
    state.chatHistory.push({role:'user',text:message,ts:new Date().toISOString()});
    renderChat();
    input.value='';
    try {
      const response=await apiPost('iv4ChatMessage',{
        sessionId:state.sessionId||state.uid,
        payload:{
          message,
          history:state.chatHistory,
          questionCount:state.chatQuestionCount,
          chatQuestionsText:chatQuestionsText(),
          customQuestionsText:chatQuestionsText(),
          metrics:state.chatMetrics,
          lastMessageMetrics:{responseMs:Math.round(performance.now()-started),chars:message.length,words:message.split(/\s+/).filter(Boolean).length}
        }
      },70000);
      const result=response.result||{};
      state.chatHistory=result.history||state.chatHistory;
      state.chatDone=result.done===true;
      renderChat();
      if (state.chatDone) await finishChatPhase();
    } catch (error) {
      state.chatHistory.push({role:'assistant',text:error.message||'Message could not be sent.',ts:new Date().toISOString()});
      renderChat();
    } finally {
      if (!state.chatDone) {button.disabled=false;input.disabled=false;input.focus();}
    }
  }

  async function finishChatPhase() {
    setScreen('Processing');
    markProcess('processUpload','done');
    markProcess('processAnalysis','active');
    try {
      await apiPost('iv4ChatFinish',{
        sessionId:state.sessionId||state.uid,
        candidateName:`${el('firstName').value} ${el('lastName').value}`.trim(),
        payload:{
          history:state.chatHistory,
          questionCount:state.chatQuestionCount,
          metrics:state.chatMetrics,
          mediaTranscript:state.turns,
          startedAt:state.startedAt,
          endedAt:new Date().toISOString()
        }
      },110000);
      markProcess('processAnalysis','done');
      markProcess('processReport','active');
    } catch (error) {
      el('processingMessage').textContent=t('reportPreparing');
    }
    startStatusPolling();
  }

  function startStatusPolling() {
    if (!state.pollStartedAt) state.pollStartedAt=Date.now();
    const poll=async()=>{
      try {
        const status=await apiPost('iv4Status',{sessionId:state.sessionId||state.uid},30000);
        if (Array.isArray(status.pipelineStages)) {
          const analysisStage=status.pipelineStages.find(s=>s.key==='analysis');
          const reportStage=status.pipelineStages.find(s=>s.key==='report');
          if (analysisStage?.status==='ready' || analysisStage?.status==='completed' || analysisStage?.status==='indexed') markProcess('processAnalysis','done');
          if (reportStage?.status==='processing') markProcess('processReport','active');
        }
        if (status.reportReady || status.completed || status.verticalReady) {
          markProcess('processAnalysis','done');
          markProcess('processReport','done');
          postRuntime('clarity.live.processing_complete',{reportReady:true});
          completeExperience();
          return;
        }
        if (status.processing) {
          markProcess('processAnalysis','active');
          markProcess('processReport','active');
        }
      } catch (error) { log('status poll',error); }
      if (Date.now()-state.pollStartedAt < PROCESS_TIMEOUT_MS) setTimeout(poll,PROCESS_POLL_MS);
      else {
        el('processingMessage').textContent=t('reportPreparing');
        completeExperience(false);
      }
    };
    poll();
  }

  function completeExperience(reportReady=true) {
    if (state.completed) return;
    state.completed=true;
    state.unloadGuard=false;
    releaseWakeLock();
    state.endedAt=state.endedAt||new Date().toISOString();
    setScreen('Complete');
    setConnection('live',t('ready'));
    clientEvent('IV4_CLIENT_COMPLETED',{sessionId:state.sessionId,reportReady,experienceVersion:VERSION});
  }

  async function submitRating() {
    if (!state.selectedRating) return;
    const button=el('btnSubmitRating');
    button.disabled=true;
    try {
      await apiPost('iv4Rating',{sessionId:state.sessionId||state.uid,stars:state.selectedRating,note:el('ratingNote').value.trim()},30000);
      el('ratingStatus').textContent=t('ratingSaved');
    } catch (_) {
      button.disabled=false;
      el('ratingStatus').textContent=t('ratingError');
    }
  }

  function wireEvents() {
    el('btnWelcomeContinue').addEventListener('click',()=>setScreen('Profile'));
    el('btnProfileBack').addEventListener('click',()=>setScreen('Welcome'));
    el('candidateForm').addEventListener('submit',event=>{
      event.preventDefault();
      const valid=event.currentTarget.checkValidity() && (state.mediaMode==='audio' || el('consentVideo').checked);
      if (!valid) {
        el('formError').textContent=t('formRequired');
        el('formError').classList.remove('hidden');
        event.currentTarget.reportValidity();
        return;
      }
      el('formError').classList.add('hidden');
      setScreen('Preflight');
      runPreflight();
    });
    el('btnRetryPreflight').addEventListener('click',runPreflight);
    el('btnStartInterview').addEventListener('click',reserveAndStart);
    el('chatForm').addEventListener('submit',submitChatMessage);
    el('btnRoomHelp').addEventListener('click',()=>el('helpDialog').showModal());
    el('btnEndInterview').addEventListener('click',()=>{
      if (!confirm(t('confirmEnd'))) return;
      postRuntime('clarity.live.stop',{reason:'candidate_manual_end',force:true,manualAudioEnd:state.mediaMode==='audio',manualVideoEnd:state.mediaMode==='video'});
      state.processingStarted=true;
      setScreen('Processing');
      apiPost('iv4End',{sessionId:state.sessionId||state.uid,status:'processing',reason:'candidate_manual_end',endedAt:new Date().toISOString()},25000).catch(()=>null);
    });
    $$('#ratingStars button').forEach(button=>button.addEventListener('click',()=>{
      state.selectedRating=Number(button.dataset.star)||0;
      $$('#ratingStars button').forEach(star=>star.classList.toggle('active',Number(star.dataset.star)<=state.selectedRating));
    }));
    el('btnSubmitRating').addEventListener('click',submitRating);
    window.addEventListener('message',handleRuntimeMessage);
    window.addEventListener('beforeunload',event=>{if(state.unloadGuard&&!state.completed){event.preventDefault();event.returnValue='';}});
    document.addEventListener('visibilitychange',()=>{
      if (document.hidden && state.unloadGuard) clientEvent('IV4_PAGE_HIDDEN',{stage:state.processingStarted?'processing':'interview'},'warning');
      if (!document.hidden && state.unloadGuard) requestWakeLock();
    });
    window.addEventListener('offline',()=>setConnection('error','Offline'));
    window.addEventListener('online',()=>setConnection('warn',t('reconnecting')));
  }

  wireEvents();
  bootstrap();
})();
