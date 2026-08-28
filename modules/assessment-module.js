// CLARITY Assessment Universal App module v3.2.1 — Q10 freeze + Q20/Q30 terminal reconciliation
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
    transport: 'Die Serverantwort ist noch unklar. Der tatsächliche Status wird geprüft.', yourAnswer:'Ihre Antwort', questions:'Fragen',
    firstQuestionMissing:'Die erste Frage wurde noch nicht bereitgestellt. Der Status wird erneut geprüft.',
    technicalInterrupted:'Die Verarbeitung wurde technisch unterbrochen. Mit „Status erneut prüfen“ wird derselbe Vorgang ohne neue Abbuchung fortgesetzt.',
    readinessDelayed: 'Die Vorbereitung dauert länger als erwartet. Der Start bleibt gesperrt, bis alle Moduldaten vollständig geladen sind.',
    audioPreparing: 'Mikrofon und Audio-Modul werden vorbereitet …', audioReady: 'Mikrofon geprüft. Das Audio-Assessment ist bereit.',
    audioRecording: 'Audio-Assessment läuft. Bitte beantworten Sie jede Frage mündlich.',
    audioSaving: 'Ihre Audioantworten werden transkribiert und sicher gespeichert …',
    audioRetry: 'Eine Audioantwort konnte noch nicht gespeichert werden. Mit „Status erneut prüfen“ wird derselbe Vorgang ohne neue Abbuchung fortgesetzt.',
    microphoneRequired: 'Für das Audio-Assessment muss der Zugriff auf das Mikrofon erlaubt werden.',
    audioModuleUnavailable: 'Das Audio-Modul konnte nicht geladen werden. Bitte aktualisieren Sie die Seite. Es wurde noch keine Assessment-Session gestartet und kein Credit verbraucht.',
    mixPreparing: 'Mikrofon und Audio-Chat-Modul werden vorbereitet …', mixReady: 'Mikrofon geprüft. Audio + Chat ist bereit.',
    mixRecording: 'Mündlicher Teil Q1–Q7 läuft. Danach folgen Q8–Q10 im Chat.', mixHandover: 'Der mündliche Teil ist abgeschlossen. Der Chatteil Q8–Q10 wird geöffnet …',
    mixSaving: 'Audio und Antworten werden sicher gespeichert …', mixRetry: 'Der Audio- oder Chatteil konnte noch nicht vollständig gespeichert werden. Derselbe Vorgang kann ohne neue Abbuchung fortgesetzt werden.',
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
    transport: 'The server response is still unclear. The actual status is being checked.', yourAnswer:'Your answer', questions:'questions',
    firstQuestionMissing:'The first question has not been prepared yet. Status will be checked again.',
    technicalInterrupted:'Processing was interrupted technically. “Check status again” continues the same record without a new charge.',
    readinessDelayed: 'Preparation is taking longer than expected. Start remains locked until all module data is fully loaded.',
    audioPreparing: 'Preparing microphone and audio module …', audioReady: 'Microphone checked. The audio assessment is ready.',
    audioRecording: 'Audio assessment is running. Please answer each question verbally.',
    audioSaving: 'Your audio responses are being transcribed and stored securely …',
    audioRetry: 'An audio response has not been stored yet. “Check status again” continues the same record without a new charge.',
    microphoneRequired: 'Microphone access must be allowed for the audio assessment.',
    audioModuleUnavailable: 'The audio module could not be loaded. Refresh the page. No assessment session was started and no credit was consumed.',
    mixPreparing: 'Preparing microphone and Audio + Chat module …', mixReady: 'Microphone checked. Audio + Chat is ready.',
    mixRecording: 'Spoken part Q1–Q7 is running. Q8–Q10 will follow in chat.', mixHandover: 'The spoken part is complete. Opening chat questions Q8–Q10 …',
    mixSaving: 'Audio and responses are being stored securely …', mixRetry: 'The audio or chat part has not been stored completely. The same record can continue without a new charge.',
    videoPreparing: 'Preparing video consent, camera and microphone …', videoReady: 'Camera and microphone checked. The video assessment is ready.',
    videoRecording: 'Video assessment is running. Please answer each question verbally on camera.',
    videoSaving: 'Your video responses are being transcribed and stored securely …',
    videoRetry: 'A video response or the video recording has not been stored yet. “Check status again” continues the same record without a new charge.',
    videoConsentRequired: 'Confirm video and audio recording first. Camera and microphone are checked only after confirmation.',
    videoConsentLabel: 'I consent to video and audio recording for this CLARITY Assessment.',
    videoModuleUnavailable: 'The video module could not be loaded. Refresh the page. No assessment session was started and no credit was consumed.'
  }
});

const SUPPORTED_LANGUAGES = Object.freeze(['en','de','es','fr','it','pt','nl','pl','tr','ar']);
const normalizeLanguage = (value = '') => {
  const code = String(value || '').trim().toLowerCase().replace('_','-').split('-')[0];
  return SUPPORTED_LANGUAGES.includes(code) ? code : 'en';
};

// Participant-facing core copy. Media-only diagnostics inherit the complete
// English baseline when a locale does not override a specialist message.
const PARTICIPANT_COPY = Object.freeze({
  es: {
    assessment:{title:'CLARITY Assessment',eyebrow:'CLARITY Assessment · Escrito',badge:'Proceso seguro',intro:'Responda a las preguntas de la forma más concreta posible y con sus propias palabras. Los ejemplos ayudan a evaluar mejor sus respuestas.',notice:'Pulse Intro para enviar. Mayús + Intro inserta una nueva línea.',start:'Iniciar assessment',preparing:'Preparando el assessment …',ready:'El assessment está listo.',starting:'Iniciando el assessment …',send:'Enviar respuesta',finish:'Finalizar assessment',processing:'Sus respuestas se están evaluando y se está creando el informe. El estado se actualiza automáticamente.',completed:'Assessment finalizado',completedText:'Sus respuestas se enviaron de forma segura. La organización revisará el resultado en CLARITY Workspace. Puede cerrar esta ventana.',startTitle:'Preparación',startText:'Dedique tiempo suficiente a cada respuesta y aporte situaciones o ejemplos concretos cuando sea posible.'},
    snapshot:{title:'CLARITY Snapshot',eyebrow:'CLARITY Snapshot · Revisión breve',badge:'Proceso conciso',intro:'Responda a las preguntas breves acordadas con sus propias palabras.',notice:'El Snapshot es un resumen estructurado y no sustituye a un assessment completo.',start:'Iniciar Snapshot',preparing:'Preparando Snapshot …',ready:'Snapshot listo.',starting:'Iniciando Snapshot …',send:'Enviar respuesta',finish:'Finalizar Snapshot',processing:'Sus respuestas se están resumiendo. El estado se actualiza automáticamente.',completed:'Snapshot finalizado',completedText:'Sus respuestas se enviaron de forma segura. La organización recibe el resumen en CLARITY Workspace. Puede cerrar esta ventana.',startTitle:'Resumen breve',startText:'Responda de forma breve y concreta.'},
    placeholder:'Su respuesta …',answerRequired:'Introduzca una respuesta.',question:'Pregunta',answered:'respondidas',yourAnswer:'Su respuesta',questions:'preguntas',area:'Área',format:'Formato',shortCheck:'Revisión breve',scope:'Alcance',process:'Proceso',processRule:'Evaluación tras la última respuesta',retry:'Comprobar estado de nuevo',readinessDelayed:'La preparación está tardando más de lo previsto. El inicio permanece bloqueado hasta que todos los datos estén completos.',transport:'La respuesta del servidor aún no es concluyente. Se está comprobando el estado real.',firstQuestionMissing:'La primera pregunta aún no está preparada. Se volverá a comprobar el estado.',technicalInterrupted:'El procesamiento se interrumpió técnicamente. “Comprobar estado de nuevo” continúa el mismo proceso sin un nuevo cargo.'
  },
  fr: {
    assessment:{title:'CLARITY Assessment',eyebrow:'CLARITY Assessment · Écrit',badge:'Parcours sécurisé',intro:'Répondez aussi concrètement que possible et avec vos propres mots. Des exemples facilitent l’évaluation de vos réponses.',notice:'Appuyez sur Entrée pour envoyer. Maj + Entrée insère une nouvelle ligne.',start:'Démarrer l’assessment',preparing:'Préparation de l’assessment …',ready:'L’assessment est prêt.',starting:'Démarrage de l’assessment …',send:'Envoyer la réponse',finish:'Terminer l’assessment',processing:'Vos réponses sont en cours d’évaluation et le rapport est en cours de création. Le statut se met à jour automatiquement.',completed:'Assessment terminé',completedText:'Vos réponses ont été transmises en toute sécurité. L’organisation consultera le résultat dans CLARITY Workspace. Vous pouvez fermer cette fenêtre.',startTitle:'Préparation',startText:'Prenez suffisamment de temps pour chaque réponse et donnez si possible des situations ou exemples concrets.'},
    snapshot:{title:'CLARITY Snapshot',eyebrow:'CLARITY Snapshot · Vérification rapide',badge:'Parcours concis',intro:'Répondez aux courtes questions convenues avec vos propres mots.',notice:'Le Snapshot est un aperçu structuré et ne remplace pas un assessment complet.',start:'Démarrer le Snapshot',preparing:'Préparation du Snapshot …',ready:'Le Snapshot est prêt.',starting:'Démarrage du Snapshot …',send:'Envoyer la réponse',finish:'Terminer le Snapshot',processing:'Vos réponses sont en cours de synthèse. Le statut se met à jour automatiquement.',completed:'Snapshot terminé',completedText:'Vos réponses ont été transmises en toute sécurité. L’organisation reçoit la synthèse dans CLARITY Workspace. Vous pouvez fermer cette fenêtre.',startTitle:'Aperçu rapide',startText:'Répondez brièvement et concrètement.'},
    placeholder:'Votre réponse …',answerRequired:'Veuillez saisir une réponse.',question:'Question',answered:'répondues',yourAnswer:'Votre réponse',questions:'questions',area:'Domaine',format:'Format',shortCheck:'Vérification rapide',scope:'Étendue',process:'Processus',processRule:'Évaluation après la dernière réponse',retry:'Vérifier à nouveau le statut',readinessDelayed:'La préparation prend plus de temps que prévu. Le démarrage reste bloqué jusqu’au chargement complet des données.',transport:'La réponse du serveur reste incertaine. Le statut réel est en cours de vérification.',firstQuestionMissing:'La première question n’est pas encore prête. Le statut va être vérifié à nouveau.',technicalInterrupted:'Le traitement a été interrompu techniquement. « Vérifier à nouveau le statut » reprend le même processus sans nouveau débit.',audioPreparing:'Préparation du microphone et du module audio …',audioReady:'Microphone vérifié. L’assessment audio est prêt.',audioRecording:'L’assessment audio est en cours. Répondez oralement à chaque question.',audioSaving:'Vos réponses audio sont transcrites et enregistrées de manière sécurisée …',audioRetry:'Une réponse audio n’est pas encore enregistrée. La nouvelle vérification reprend le même processus sans nouveau débit.',microphoneRequired:'L’accès au microphone doit être autorisé pour l’assessment audio.'
  },
  it: {
    assessment:{title:'CLARITY Assessment',eyebrow:'CLARITY Assessment · Scritto',badge:'Procedura sicura',intro:'Risponda alle domande nel modo più concreto possibile e con parole proprie. Gli esempi facilitano la valutazione.',notice:'Premere Invio per inviare. Maiusc + Invio inserisce una nuova riga.',start:'Avvia assessment',preparing:'Preparazione assessment …',ready:'L’assessment è pronto.',starting:'Avvio assessment …',send:'Invia risposta',finish:'Completa assessment',processing:'Le risposte sono in fase di valutazione e il report è in creazione. Lo stato si aggiorna automaticamente.',completed:'Assessment completato',completedText:'Le risposte sono state inviate in modo sicuro. L’organizzazione esaminerà il risultato in CLARITY Workspace. Può chiudere questa finestra.',startTitle:'Preparazione',startText:'Dedichi tempo sufficiente a ogni risposta e fornisca situazioni o esempi concreti quando possibile.'},
    snapshot:{title:'CLARITY Snapshot',eyebrow:'CLARITY Snapshot · Verifica rapida',badge:'Procedura concisa',intro:'Risponda con parole proprie alle brevi domande concordate.',notice:'Lo Snapshot è una panoramica strutturata e non sostituisce un assessment completo.',start:'Avvia Snapshot',preparing:'Preparazione Snapshot …',ready:'Snapshot pronto.',starting:'Avvio Snapshot …',send:'Invia risposta',finish:'Completa Snapshot',processing:'Le risposte sono in fase di sintesi. Lo stato si aggiorna automaticamente.',completed:'Snapshot completato',completedText:'Le risposte sono state inviate in modo sicuro. L’organizzazione riceve la sintesi in CLARITY Workspace. Può chiudere questa finestra.',startTitle:'Panoramica rapida',startText:'Risponda in modo breve e concreto.'},
    placeholder:'La sua risposta …',answerRequired:'Inserisca una risposta.',question:'Domanda',answered:'risposte',yourAnswer:'La sua risposta',questions:'domande',area:'Area',format:'Formato',shortCheck:'Verifica rapida',scope:'Ambito',process:'Processo',processRule:'Valutazione dopo l’ultima risposta',retry:'Controlla di nuovo lo stato',readinessDelayed:'La preparazione richiede più tempo del previsto. L’avvio resta bloccato finché tutti i dati non sono completi.',transport:'La risposta del server non è ancora conclusiva. È in corso la verifica dello stato effettivo.',firstQuestionMissing:'La prima domanda non è ancora pronta. Lo stato verrà controllato di nuovo.',technicalInterrupted:'L’elaborazione è stata interrotta tecnicamente. Il nuovo controllo riprende lo stesso processo senza un nuovo addebito.'
  },
  pt: {
    assessment:{title:'CLARITY Assessment',eyebrow:'CLARITY Assessment · Escrito',badge:'Processo seguro',intro:'Responda às perguntas da forma mais concreta possível e com as suas próprias palavras. Exemplos ajudam na avaliação.',notice:'Prima Enter para enviar. Shift + Enter insere uma nova linha.',start:'Iniciar assessment',preparing:'A preparar o assessment …',ready:'O assessment está pronto.',starting:'A iniciar o assessment …',send:'Enviar resposta',finish:'Concluir assessment',processing:'As respostas estão a ser avaliadas e o relatório está a ser criado. O estado é atualizado automaticamente.',completed:'Assessment concluído',completedText:'As respostas foram enviadas em segurança. A organização analisará o resultado no CLARITY Workspace. Pode fechar esta janela.',startTitle:'Preparação',startText:'Reserve tempo suficiente para cada resposta e apresente situações ou exemplos concretos sempre que possível.'},
    snapshot:{title:'CLARITY Snapshot',eyebrow:'CLARITY Snapshot · Verificação rápida',badge:'Processo conciso',intro:'Responda às perguntas breves acordadas com as suas próprias palavras.',notice:'O Snapshot é uma visão estruturada e não substitui um assessment completo.',start:'Iniciar Snapshot',preparing:'A preparar o Snapshot …',ready:'Snapshot pronto.',starting:'A iniciar o Snapshot …',send:'Enviar resposta',finish:'Concluir Snapshot',processing:'As respostas estão a ser resumidas. O estado é atualizado automaticamente.',completed:'Snapshot concluído',completedText:'As respostas foram enviadas em segurança. A organização recebe o resumo no CLARITY Workspace. Pode fechar esta janela.',startTitle:'Visão rápida',startText:'Responda de forma breve e concreta.'},
    placeholder:'A sua resposta …',answerRequired:'Introduza uma resposta.',question:'Pergunta',answered:'respondidas',yourAnswer:'A sua resposta',questions:'perguntas',area:'Área',format:'Formato',shortCheck:'Verificação rápida',scope:'Âmbito',process:'Processo',processRule:'Avaliação após a última resposta',retry:'Verificar estado novamente',readinessDelayed:'A preparação está a demorar mais do que o previsto. O início permanece bloqueado até todos os dados estarem completos.',transport:'A resposta do servidor ainda não é conclusiva. O estado real está a ser verificado.',firstQuestionMissing:'A primeira pergunta ainda não está pronta. O estado será verificado novamente.',technicalInterrupted:'O processamento foi interrompido tecnicamente. A nova verificação continua o mesmo processo sem nova cobrança.'
  },
  nl: {
    assessment:{title:'CLARITY Assessment',eyebrow:'CLARITY Assessment · Schriftelijk',badge:'Veilig proces',intro:'Beantwoord de vragen zo concreet mogelijk en in uw eigen woorden. Voorbeelden maken de beoordeling beter navolgbaar.',notice:'Druk op Enter om te verzenden. Shift + Enter voegt een nieuwe regel toe.',start:'Assessment starten',preparing:'Assessment wordt voorbereid …',ready:'Assessment is gereed.',starting:'Assessment wordt gestart …',send:'Antwoord verzenden',finish:'Assessment afronden',processing:'Uw antwoorden worden beoordeeld en het rapport wordt gemaakt. De status wordt automatisch bijgewerkt.',completed:'Assessment afgerond',completedText:'Uw antwoorden zijn veilig verzonden. De organisatie bekijkt het resultaat in CLARITY Workspace. U kunt dit venster sluiten.',startTitle:'Voorbereiding',startText:'Neem voldoende tijd voor elk antwoord en geef waar mogelijk concrete situaties of voorbeelden.'},
    snapshot:{title:'CLARITY Snapshot',eyebrow:'CLARITY Snapshot · Korte check',badge:'Beknopt proces',intro:'Beantwoord de afgesproken korte vragen in uw eigen woorden.',notice:'De Snapshot is een kort gestructureerd overzicht en vervangt geen volledig assessment.',start:'Snapshot starten',preparing:'Snapshot wordt voorbereid …',ready:'Snapshot is gereed.',starting:'Snapshot wordt gestart …',send:'Antwoord verzenden',finish:'Snapshot afronden',processing:'Uw antwoorden worden samengevat. De status wordt automatisch bijgewerkt.',completed:'Snapshot afgerond',completedText:'Uw antwoorden zijn veilig verzonden. De organisatie ontvangt de samenvatting in CLARITY Workspace. U kunt dit venster sluiten.',startTitle:'Kort overzicht',startText:'Antwoord kort en concreet.'},
    placeholder:'Uw antwoord …',answerRequired:'Voer een antwoord in.',question:'Vraag',answered:'beantwoord',yourAnswer:'Uw antwoord',questions:'vragen',area:'Gebied',format:'Formaat',shortCheck:'Korte check',scope:'Omvang',process:'Proces',processRule:'Beoordeling na het laatste antwoord',retry:'Status opnieuw controleren',readinessDelayed:'De voorbereiding duurt langer dan verwacht. Start blijft geblokkeerd tot alle gegevens compleet zijn.',transport:'De serverreactie is nog niet eenduidig. De werkelijke status wordt gecontroleerd.',firstQuestionMissing:'De eerste vraag is nog niet gereed. De status wordt opnieuw gecontroleerd.',technicalInterrupted:'De verwerking werd technisch onderbroken. Opnieuw controleren hervat hetzelfde proces zonder nieuwe afschrijving.'
  },
  pl: {
    assessment:{title:'CLARITY Assessment',eyebrow:'CLARITY Assessment · Pisemny',badge:'Bezpieczny proces',intro:'Proszę odpowiadać możliwie konkretnie i własnymi słowami. Przykłady ułatwiają rzetelną ocenę odpowiedzi.',notice:'Enter wysyła odpowiedź. Shift + Enter dodaje nowy wiersz.',start:'Rozpocznij assessment',preparing:'Przygotowywanie assessmentu …',ready:'Assessment jest gotowy.',starting:'Uruchamianie assessmentu …',send:'Wyślij odpowiedź',finish:'Zakończ assessment',processing:'Odpowiedzi są analizowane, a raport jest tworzony. Status aktualizuje się automatycznie.',completed:'Assessment zakończony',completedText:'Odpowiedzi zostały bezpiecznie przesłane. Organizacja sprawdzi wynik w CLARITY Workspace. Można zamknąć to okno.',startTitle:'Przygotowanie',startText:'Proszę poświęcić każdej odpowiedzi wystarczająco dużo czasu i podawać konkretne sytuacje lub przykłady.'},
    snapshot:{title:'CLARITY Snapshot',eyebrow:'CLARITY Snapshot · Szybki przegląd',badge:'Krótki proces',intro:'Proszę odpowiedzieć własnymi słowami na uzgodnione krótkie pytania.',notice:'Snapshot to krótki uporządkowany przegląd, który nie zastępuje pełnego assessmentu.',start:'Rozpocznij Snapshot',preparing:'Przygotowywanie Snapshotu …',ready:'Snapshot jest gotowy.',starting:'Uruchamianie Snapshotu …',send:'Wyślij odpowiedź',finish:'Zakończ Snapshot',processing:'Odpowiedzi są podsumowywane. Status aktualizuje się automatycznie.',completed:'Snapshot zakończony',completedText:'Odpowiedzi zostały bezpiecznie przesłane. Organizacja otrzyma podsumowanie w CLARITY Workspace. Można zamknąć to okno.',startTitle:'Krótki przegląd',startText:'Proszę odpowiadać krótko i konkretnie.'},
    placeholder:'Twoja odpowiedź …',answerRequired:'Proszę wpisać odpowiedź.',question:'Pytanie',answered:'odpowiedzi',yourAnswer:'Twoja odpowiedź',questions:'pytań',area:'Obszar',format:'Format',shortCheck:'Szybki przegląd',scope:'Zakres',process:'Proces',processRule:'Analiza po ostatniej odpowiedzi',retry:'Sprawdź status ponownie',readinessDelayed:'Przygotowanie trwa dłużej niż oczekiwano. Start pozostaje zablokowany do czasu załadowania kompletnych danych.',transport:'Odpowiedź serwera nie jest jeszcze jednoznaczna. Trwa sprawdzanie rzeczywistego statusu.',firstQuestionMissing:'Pierwsze pytanie nie jest jeszcze gotowe. Status zostanie sprawdzony ponownie.',technicalInterrupted:'Przetwarzanie zostało technicznie przerwane. Ponowne sprawdzenie wznawia ten sam proces bez nowego obciążenia.'
  },
  tr: {
    assessment:{title:'CLARITY Assessment',eyebrow:'CLARITY Assessment · Yazılı',badge:'Güvenli süreç',intro:'Soruları mümkün olduğunca somut ve kendi sözlerinizle yanıtlayın. Örnekler yanıtların daha iyi değerlendirilmesini sağlar.',notice:'Göndermek için Enter’a basın. Shift + Enter yeni satır ekler.',start:'Assessment’ı başlat',preparing:'Assessment hazırlanıyor …',ready:'Assessment hazır.',starting:'Assessment başlatılıyor …',send:'Yanıtı gönder',finish:'Assessment’ı tamamla',processing:'Yanıtlarınız değerlendiriliyor ve rapor oluşturuluyor. Durum otomatik güncellenir.',completed:'Assessment tamamlandı',completedText:'Yanıtlarınız güvenli biçimde iletildi. Kuruluş sonucu CLARITY Workspace’te inceleyecek. Bu pencereyi kapatabilirsiniz.',startTitle:'Hazırlık',startText:'Her yanıt için yeterli zaman ayırın ve mümkünse somut durumlar veya örnekler verin.'},
    snapshot:{title:'CLARITY Snapshot',eyebrow:'CLARITY Snapshot · Hızlı kontrol',badge:'Kısa süreç',intro:'Kararlaştırılan kısa soruları kendi sözlerinizle yanıtlayın.',notice:'Snapshot kısa ve yapılandırılmış bir genel bakıştır; tam assessment’ın yerini almaz.',start:'Snapshot’ı başlat',preparing:'Snapshot hazırlanıyor …',ready:'Snapshot hazır.',starting:'Snapshot başlatılıyor …',send:'Yanıtı gönder',finish:'Snapshot’ı tamamla',processing:'Yanıtlarınız özetleniyor. Durum otomatik güncellenir.',completed:'Snapshot tamamlandı',completedText:'Yanıtlarınız güvenli biçimde iletildi. Kuruluş özeti CLARITY Workspace’te alır. Bu pencereyi kapatabilirsiniz.',startTitle:'Hızlı genel bakış',startText:'Kısa ve somut yanıt verin.'},
    placeholder:'Yanıtınız …',answerRequired:'Lütfen bir yanıt girin.',question:'Soru',answered:'yanıtlandı',yourAnswer:'Yanıtınız',questions:'soru',area:'Alan',format:'Biçim',shortCheck:'Hızlı kontrol',scope:'Kapsam',process:'Süreç',processRule:'Son yanıttan sonra değerlendirme',retry:'Durumu tekrar kontrol et',readinessDelayed:'Hazırlık beklenenden uzun sürüyor. Tüm veriler tamamlanana kadar başlatma kilitli kalır.',transport:'Sunucu yanıtı henüz kesin değil. Gerçek durum kontrol ediliyor.',firstQuestionMissing:'İlk soru henüz hazır değil. Durum tekrar kontrol edilecek.',technicalInterrupted:'İşlem teknik olarak kesintiye uğradı. Yeniden kontrol aynı süreci yeni ücret olmadan sürdürür.'
  }
});

const FINAL_OPEN_COPY = Object.freeze({
  de:{prompt:'Möchten Sie abschließend noch etwas ergänzen, das durch die gestellten Fragen nicht abgedeckt wurde? Diese Ergänzung ist freiwillig.',placeholder:'Freiwillige Abschluss-Ergänzung …',save:'Ergänzung speichern',skip:'Ohne Ergänzung abschließen'},
  en:{prompt:'Would you like to add anything that was not covered by the questions? This final statement is voluntary.',placeholder:'Voluntary final statement …',save:'Save statement',skip:'Finish without statement'},
  es:{prompt:'¿Desea añadir algo que no se haya tratado en las preguntas? Esta declaración final es voluntaria.',placeholder:'Declaración final voluntaria …',save:'Guardar declaración',skip:'Finalizar sin declaración'},
  fr:{prompt:'Souhaitez-vous ajouter un élément qui n’a pas été abordé par les questions ? Cette déclaration finale est facultative.',placeholder:'Déclaration finale facultative …',save:'Enregistrer la déclaration',skip:'Terminer sans déclaration'},
  it:{prompt:'Desidera aggiungere qualcosa che non è stato trattato nelle domande? Questa dichiarazione finale è facoltativa.',placeholder:'Dichiarazione finale facoltativa …',save:'Salva dichiarazione',skip:'Termina senza dichiarazione'},
  pt:{prompt:'Gostaria de acrescentar algo que não tenha sido abordado nas perguntas? Esta declaração final é voluntária.',placeholder:'Declaração final voluntária …',save:'Guardar declaração',skip:'Concluir sem declaração'},
  nl:{prompt:'Wilt u nog iets toevoegen dat niet door de gestelde vragen is behandeld? Deze slotverklaring is vrijwillig.',placeholder:'Vrijwillige slotverklaring …',save:'Verklaring opslaan',skip:'Afronden zonder verklaring'},
  pl:{prompt:'Czy chcesz dodać coś, czego nie obejmowały zadane pytania? Ta wypowiedź końcowa jest dobrowolna.',placeholder:'Dobrowolna wypowiedź końcowa …',save:'Zapisz wypowiedź',skip:'Zakończ bez wypowiedzi'},
  tr:{prompt:'Sorularda ele alınmayan başka bir şey eklemek ister misiniz? Bu son ifade isteğe bağlıdır.',placeholder:'İsteğe bağlı son ifade …',save:'İfadeyi kaydet',skip:'İfade olmadan tamamla'}
});

const AREA_COPY = Object.freeze({
  en:{aptitude:'Cognitive abilities',personality:'Personality',skills:'Professional skills',language:'Language proficiency',general:'General'},
  de:{aptitude:'Kognitive Fähigkeiten',personality:'Persönlichkeit',skills:'Fachliche Kompetenzen',language:'Sprachkompetenz',general:'Allgemein'},
  es:{aptitude:'Capacidades cognitivas',personality:'Personalidad',skills:'Competencias profesionales',language:'Competencia lingüística',general:'General'},
  fr:{aptitude:'Capacités cognitives',personality:'Personnalité',skills:'Compétences professionnelles',language:'Compétence linguistique',general:'Général'},
  it:{aptitude:'Capacità cognitive',personality:'Personalità',skills:'Competenze professionali',language:'Competenza linguistica',general:'Generale'},
  pt:{aptitude:'Capacidades cognitivas',personality:'Personalidade',skills:'Competências profissionais',language:'Competência linguística',general:'Geral'},
  nl:{aptitude:'Cognitieve vaardigheden',personality:'Persoonlijkheid',skills:'Professionele competenties',language:'Taalvaardigheid',general:'Algemeen'},
  pl:{aptitude:'Zdolności poznawcze',personality:'Osobowość',skills:'Kompetencje zawodowe',language:'Kompetencje językowe',general:'Ogólne'},
  tr:{aptitude:'Bilişsel yetenekler',personality:'Kişilik',skills:'Mesleki yetkinlikler',language:'Dil yeterliliği',general:'Genel'},
  ar:{aptitude:'القدرات المعرفية',personality:'الشخصية',skills:'الكفاءات المهنية',language:'الكفاءة اللغوية',general:'عام'}
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
  let hybridChatActive = false;
  let hybridHandoverStarted = false;
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
  let failedFinalOpenDecision = null;

  const product = () => String(state.payload?.runtime?.productKey || '').toLowerCase();
  const participantLanguage = () => normalizeLanguage(
    current?.runtime?.userCommLang ||
    current?.userCommLang ||
    state.payload?.runtime?.userCommLang ||
    state.payload?.runtime?.participantLang ||
    state.payload?.runtime?.workflowSnapshot?.userCommLang ||
    state.payload?.link?.userCommLang ||
    getLocale()
  );
  const reportLanguage = () => normalizeLanguage(
    current?.runtime?.reportLang ||
    current?.reportLang ||
    state.payload?.runtime?.reportLang ||
    state.payload?.runtime?.workflowSnapshot?.reportLang ||
    state.payload?.link?.reportLang ||
    'en'
  );
  const runtimeMode = () => {
    const raw = String(current?.mode || state.payload?.runtime?.mode || state.payload?.runtime?.workflowSnapshot?.mode || 'chat').toLowerCase().replace(/[+\s-]+/g, '_');
    if (['chat_audio','audiochat'].includes(raw)) return 'audio_chat';
    if (['chat_video','videochat','mix','mixmode'].includes(raw)) return 'video_chat';
    return raw;
  };
  const isAudioChatMode = () => product() === 'assessment' && runtimeMode() === 'audio_chat';
  const isVideoChatMode = () => product() === 'assessment' && runtimeMode() === 'video_chat';
  const isAudioMode = () => product() === 'assessment' && ['audio','audio_chat'].includes(runtimeMode());
  const isVideoMode = () => product() === 'assessment' && ['video','video_chat'].includes(runtimeMode());
  const isHybridMode = () => isAudioChatMode() || isVideoChatMode();
  const isMediaMode = () => isAudioMode() || isVideoMode();
  const assessmentMediaMode = () => isVideoChatMode() ? 'video_chat' : isAudioChatMode() ? 'audio_chat' : isVideoMode() ? 'video' : 'audio';
  const totalQuestionCount = () => { const value=Number(current?.questionCount||current?.media?.questionCount||state.payload?.runtime?.questionCount||state.payload?.runtime?.workflowSnapshot?.questionCount||10);return[10,20,30].includes(value)?value:10 };
  const scaledFinalOpenRequired = () => product() === 'assessment' && totalQuestionCount() > 10;
  const completedSlots = (data=current) => Number(data?.completedSlotCount ?? data?.answeredCount ?? 0);
  const finalOpenPending = (data=current) => scaledFinalOpenRequired() && completedSlots(data) >= Number(data?.expectedAnswers||data?.questionCount||totalQuestionCount()) && data?.finalOpenCompleted !== true;
  const hybridSlotContract = () => { const total=totalQuestionCount();const media=Number(current?.media?.mediaQuestionCount||current?.mediaQuestionCount||(total===10?7:Math.ceil(total*.7)));return{total,media,chat:total-media,chatStart:media+1} };
  const hybridStatus = (kind='recording') => { const slots=hybridSlotContract();const values={de:{recording:`Mündlicher Teil Q1–Q${slots.media} läuft. Danach folgen Q${slots.chatStart}–Q${slots.total} im Chat.`,handover:`Der mündliche Teil ist abgeschlossen. Der Chatteil Q${slots.chatStart}–Q${slots.total} wird geöffnet …`,ready:`Der Chatteil Q${slots.chatStart}–Q${slots.total} ist bereit.`},en:{recording:`Spoken part Q1–Q${slots.media} is running. Q${slots.chatStart}–Q${slots.total} will follow in chat.`,handover:`The spoken part is complete. Opening chat questions Q${slots.chatStart}–Q${slots.total} …`,ready:`Chat questions Q${slots.chatStart}–Q${slots.total} are ready.`},es:{recording:`La parte oral Q1–Q${slots.media} está en curso. Después siguen Q${slots.chatStart}–Q${slots.total} en el chat.`,handover:`La parte oral ha terminado. Se abren las preguntas Q${slots.chatStart}–Q${slots.total} en el chat …`,ready:`Las preguntas Q${slots.chatStart}–Q${slots.total} del chat están listas.`},fr:{recording:`La partie orale Q1–Q${slots.media} est en cours. Q${slots.chatStart}–Q${slots.total} suivront dans le chat.`,handover:`La partie orale est terminée. Ouverture des questions Q${slots.chatStart}–Q${slots.total} dans le chat …`,ready:`Les questions Q${slots.chatStart}–Q${slots.total} du chat sont prêtes.`},it:{recording:`La parte orale Q1–Q${slots.media} è in corso. Seguiranno Q${slots.chatStart}–Q${slots.total} nella chat.`,handover:`La parte orale è terminata. Apertura delle domande Q${slots.chatStart}–Q${slots.total} nella chat …`,ready:`Le domande Q${slots.chatStart}–Q${slots.total} della chat sono pronte.`},pt:{recording:`A parte oral Q1–Q${slots.media} está em curso. Depois seguem Q${slots.chatStart}–Q${slots.total} no chat.`,handover:`A parte oral terminou. A abrir as perguntas Q${slots.chatStart}–Q${slots.total} no chat …`,ready:`As perguntas Q${slots.chatStart}–Q${slots.total} do chat estão prontas.`},nl:{recording:`Het mondelinge deel Q1–Q${slots.media} loopt. Daarna volgen Q${slots.chatStart}–Q${slots.total} in de chat.`,handover:`Het mondelinge deel is afgerond. Chatvragen Q${slots.chatStart}–Q${slots.total} worden geopend …`,ready:`Chatvragen Q${slots.chatStart}–Q${slots.total} zijn klaar.`},pl:{recording:`Trwa część ustna Q1–Q${slots.media}. Następnie pojawią się Q${slots.chatStart}–Q${slots.total} na czacie.`,handover:`Część ustna została zakończona. Otwieranie pytań Q${slots.chatStart}–Q${slots.total} na czacie …`,ready:`Pytania Q${slots.chatStart}–Q${slots.total} na czacie są gotowe.`},tr:{recording:`Sözlü bölüm Q1–Q${slots.media} devam ediyor. Ardından sohbette Q${slots.chatStart}–Q${slots.total} gelecek.`,handover:`Sözlü bölüm tamamlandı. Sohbet soruları Q${slots.chatStart}–Q${slots.total} açılıyor …`,ready:`Sohbet soruları Q${slots.chatStart}–Q${slots.total} hazır.`}};return(values[participantLanguage()]||values.en)[kind] };
  const mediaCopy = (audioKey, videoKey) => isHybridMode() ? (audioKey==='audioRecording'?hybridStatus('recording'):L()[audioKey.replace(/^audio/,'mix')] || L()[audioKey]) : isVideoMode() ? L()[videoKey] : L()[audioKey];
  const L = () => {
    const language = participantLanguage();
    const base = COPY.en;
    const localized = language === 'de' ? COPY.de : (PARTICIPANT_COPY[language] || {});
    const productCopy = product() === 'snapshot'
      ? { ...base.snapshot, ...localized.snapshot }
      : { ...base.assessment, ...localized.assessment };
    return { ...base, ...localized, ...productCopy };
  };
  const finalOpenCopy = () => FINAL_OPEN_COPY[participantLanguage()] || FINAL_OPEN_COPY.en;
  const endpoint = (name) => `v2Assessment${name}`;
  const ASSESSMENT_RECORDER_RELEASE = '4.1.1-video-card-parity';
  const MEDIA_RECORDER_ROUTES = Object.freeze({
    audio: [`/modules/assessment-audio-recorder.html?v=${ASSESSMENT_RECORDER_RELEASE}`, `/liveAssessment.html?v=${ASSESSMENT_RECORDER_RELEASE}`],
    video: [`/modules/assessment-video-recorder.html?v=${ASSESSMENT_RECORDER_RELEASE}`, `/liveAssessment.html?v=${ASSESSMENT_RECORDER_RELEASE}`],
    audio_chat: [`/modules/assessment-audio-chat-recorder.html?v=${ASSESSMENT_RECORDER_RELEASE}`, `/liveAssessment.html?v=${ASSESSMENT_RECORDER_RELEASE}`],
    video_chat: [`/modules/assessment-video-chat-recorder.html?v=${ASSESSMENT_RECORDER_RELEASE}`, `/modules/assessment-audio-chat-recorder.html?v=${ASSESSMENT_RECORDER_RELEASE}`, `/liveAssessment.html?v=${ASSESSMENT_RECORDER_RELEASE}`]
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
      token: state.token,
      branding: state.payload?.branding || runtime.brandingSnapshot || {},
      companyId: resolvedCompanyId(),
      sessionId: String(current?.sessionId || '').trim(),
      mode: assessmentMediaMode(),
      assessmentMode: assessmentMediaMode(),
      mediaMode: isVideoMode() ? 'video' : 'audio',
      productKey: 'assessment',
      productType: 'modul1',
      moduleArea: current?.moduleArea || runtime.moduleArea || runtime.configurationSnapshot?.moduleArea || 'personality',
      questionCount: Number(current?.questionCount || media.questionCount || questions.length || 10),
      totalQuestionCount: Number(current?.questionCount || media.questionCount || questions.length || 10),
      mediaQuestionCount: isHybridMode() ? hybridSlotContract().media : Number(current?.questionCount || media.questionCount || questions.length || 10),
      chatQuestionCount: isHybridMode() ? hybridSlotContract().chat : 0,
      chatSlotStartIndex: isHybridMode() ? hybridSlotContract().chatStart : 0,
      chatSlotEndIndex: isHybridMode() ? hybridSlotContract().total : 0,
      hybridAssessment: isHybridMode(),
      conversationContract: scaledFinalOpenRequired() ? 'linear_main_questions_final_open_v1' : '',
      adaptiveFollowUpsEnabled: false,
      finalOpenRequired: scaledFinalOpenRequired(),
      assessmentQuestionSnapshot: questions,
      questions,
      position: runtime.position || runtime.configurationSnapshot?.position || '',
      userCommLang: participantLanguage(),
      reportLang: reportLanguage(),
      lang: participantLanguage(),
      startQuestionIndex: Math.max(1, completedSlots(current) + 1)
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
      mode: assessmentMediaMode(),
      audioOnly: isVideoMode() ? '0' : '1',
      autostart: '0',
      lang: participantLanguage(),
      reportLang: reportLanguage()
    });
    return `${route}?${query.toString()}`;
  }

  function loadMediaRecorderRoute(index = 0) {
    if (!mediaFrame) return;
    clearMediaLoadTimer();
    mediaIframeReady = false;
    mediaPrepared = false;
    mediaRouteIndex = Math.max(0, Number(index || 0));
    const routes = MEDIA_RECORDER_ROUTES[assessmentMediaMode()];
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
      heading.textContent = isAudioChatMode() ? 'Audio + Chat Assessment' : isVideoMode() ? 'Video Assessment' : 'Audio Assessment';
      mediaFrame = document.createElement('iframe');
      mediaFrame.id = 'clarityAssessmentMediaFrame';
      mediaFrame.title = isAudioChatMode() ? 'CLARITY Audio + Chat Assessment' : isVideoMode() ? 'CLARITY Video Assessment' : 'CLARITY Audio Assessment';
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
    hybridChatActive = false;
    hybridHandoverStarted = false;
    mediaTurnChain = Promise.resolve();
    mediaTurnCount = 0;
    mediaFatalError = null;
    lastMediaResultPayload = null;
    failedMediaTurns.clear();
    failedFinalOpenDecision = null;
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
      language: participantLanguage(),
      companyId: resolvedCompanyId(),
      noSpeechDetected: payload.noSpeechDetected === true,
      responseStatus: payload.noSpeechDetected === true ? 'no_speech_detected' : payload.noResponse === true ? 'participant_skipped' : 'answered',
      voiceDetected: payload.voiceDetected !== false,
      voiceActivityMs: Number(payload.voiceActivityMs || 0),
      finalOpen: payload.finalOpen === true,
      finalOpenSkipped: payload.finalOpenSkipped === true,
      turnType: payload.finalOpen === true ? 'final_open' : String(payload.turnType || 'main_answer')
      ,completionMethod: String(payload.completionMethod || 'manual_button'),
      turnControlEvents: Array.isArray(payload.turnControlEvents) ? payload.turnControlEvents.slice(0,20) : []
    };
    const saved = await withMediaRetry(() => api(endpoint('MediaTurn'), { body }), 3);
    failedMediaTurns.delete(questionIndex);
    mediaTurnCount = Math.max(mediaTurnCount, Number(saved?.state?.completedSlotCount ?? saved?.state?.answeredCount ?? questionIndex));
    if (saved?.state) render(saved.state);
    return saved;
  }

  async function persistFinalOpenDecision(message = '', skipped = false, source = 'media') {
    const data = await api(endpoint('Message'), {
      body: {
        token:state.token,
        uid:state.uid,
        sessionId:current?.sessionId || '',
        message:String(message || '').trim(),
        finalOpen:true,
        finalOpenSkipped:skipped === true,
        turnType:'final_open',
        captureSource:source
      }
    });
    const next = data.state || data;
    render(next);
    return next;
  }

  async function reconcileMissingMediaSlots() {
    if (!isMediaMode() || product() !== 'assessment' || ![10,20,30].includes(totalQuestionCount())) return null;
    const saved = await withMediaRetry(() => api(endpoint('MediaTurn'), {
      body: {
        token:state.token,
        uid:state.uid,
        sessionId:current?.sessionId || '',
        reconcileMissingSlots:true,
        recorderCompleted:true,
        expectedAnswers:Number(current?.expectedAnswers || current?.questionCount || totalQuestionCount()),
        captureSource:isVideoMode() ? 'video' : 'audio',
        idempotencyKey:`${state.uid}:assessment-slot-reconciliation-v1`
      }
    }), 3);
    if (saved?.state) render(saved.state);
    return saved;
  }

  async function settleFailedTurnsAfterReconciliation() {
    const pending = [...failedMediaTurns.values()];
    for (const payload of pending) {
      try {
        await persistMediaTurn(payload);
      } catch (error) {
        // Main slots are already represented by the server-side
        // transcription_failed marker. A voluntary final statement still has
        // to be retried because it is a separate participant decision.
        if (payload?.finalOpen === true) throw error;
        failedMediaTurns.delete(Number(payload.questionIndex || 0));
      }
    }
    if (failedFinalOpenDecision) {
      const decision = failedFinalOpenDecision;
      await persistFinalOpenDecision(decision.message, decision.skipped, decision.source);
      failedFinalOpenDecision = null;
    }
    if (!failedMediaTurns.size && !failedFinalOpenDecision) mediaFatalError = null;
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
      const error = new Error(participantLanguage() === 'de'
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
      mode: assessmentMediaMode(),
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
        const error = new Error(participantLanguage() === 'de'
          ? (isVideoMode() ? 'Die Video-Datei wird noch verarbeitet. Bitte prüfen Sie den Status erneut.' : 'Die Audio-Datei wird noch verarbeitet. Bitte prüfen Sie den Status erneut.')
          : (isVideoMode() ? 'The video file is still processing. Please check the status again.' : 'The audio file is still processing. Please check the status again.'));
        error.code = 'ASSESSMENT_MEDIA_RESULT_TIMEOUT';
        error.retryable = true;
        reject(error);
      }, timeoutMs))
    ]);
  }

  async function beginHybridChatHandover() {
    if (!isHybridMode() || hybridHandoverStarted) return;
    hybridHandoverStarted = true;
    status(hybridStatus('handover'), 'warn');
    try {
      const runtimeAccessId = String(state.payload?.runtime?.runtimeAccessId || state.uid || '').trim();
      const data = await api(endpoint('Start'), { body: { token:state.token, uid:state.uid, sessionId:current?.sessionId||'', handoverToChat:true, idempotencyKey:`${runtimeAccessId}:assessment-${assessmentMediaMode()}-handover` } });
      hybridChatActive = true;
      mediaRecordStarted = false;
      mediaShell?.classList.add('hidden');
      render(data.state || data);
      status(hybridStatus('ready'), 'ok');
      $('assessmentInput')?.focus();
    } catch (error) {
      hybridHandoverStarted = false;
      mediaFatalError = error;
      status(error.message || L().mixRetry, 'err');
      $('assessmentRetryBtn')?.classList.remove('hidden');
    }
  }

  async function finalizeMediaAssessment() {
    if (!isMediaMode() || mediaFinalizeStarted || !mediaEnded) return;
    mediaFinalizeStarted = true;
    status(mediaCopy('audioSaving','videoSaving'), 'warn');
    try {
      await mediaTurnChain;
      await waitForMediaResult();
      await reconcileMissingMediaSlots();
      await settleFailedTurnsAfterReconciliation();
      if (failedMediaTurns.size || failedFinalOpenDecision) {
        const error = mediaFatalError || new Error(mediaCopy('audioRetry','videoRetry'));
        error.code = error.code || 'ASSESSMENT_MEDIA_TURNS_INCOMPLETE';
        error.retryable = true;
        throw error;
      }
      const expected = isHybridMode() ? hybridSlotContract().media : Number(current?.expectedAnswers || current?.questionCount || 10);
      const refreshed = await readStatus({ includeHistory: false, includeReportLookup: false });
      if (completedSlots(refreshed) < expected) {
        const error = new Error(mediaCopy('audioRetry','videoRetry'));
        error.code = 'ASSESSMENT_MEDIA_TRANSCRIPTS_INCOMPLETE';
        error.retryable = true;
        throw error;
      }
      mediaFinalizeStarted = false;
      if (isHybridMode()) await beginHybridChatHandover();
      else await finish();
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
    if (!pending.length && !failedFinalOpenDecision && !mediaFatalError && !lastMediaResultPayload) return false;
    mediaFatalError = null;
    status(mediaCopy('audioSaving','videoSaving'), 'warn');
    if (failedFinalOpenDecision) {
      const decision = failedFinalOpenDecision;
      await persistFinalOpenDecision(decision.message, decision.skipped, decision.source);
      failedFinalOpenDecision = null;
    }
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
      if (data.finalOpen === true && data.noSpeechDetected === true) {
        failedFinalOpenDecision = { message:'', skipped:true, source:isVideoMode() ? 'video' : 'audio' };
        mediaTurnChain = mediaTurnChain
          .then(() => persistFinalOpenDecision('', true, isVideoMode() ? 'video' : 'audio'))
          .then(() => { failedFinalOpenDecision = null; })
          .catch((error) => {
            mediaFatalError = error;
            status(error.message || mediaCopy('audioRetry','videoRetry'), 'err');
          });
        return;
      }
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

    if (type === 'clarity.assessment.v2.oral_completed') {
      mediaEnded = true;
      status(hybridStatus('handover'), 'warn');
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
    const labels = AREA_COPY[participantLanguage()] || AREA_COPY.en;
    return labels[normalized] || value || labels.general;
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
      label.textContent = entry.role === 'assistant' ? (entry.questionIndex ? `${L().question} ${entry.questionIndex}` : 'CLARITY') : L().yourAnswer;
      const body = document.createElement('p');
      body.textContent = entry.text || '';
      row.append(label, body);
      box.append(row);
    });
    box.scrollTop = box.scrollHeight;
  }

  function renderMeta(data) {
    $('assessmentArea').textContent = product() === 'snapshot' ? L().shortCheck : areaLabel(data.moduleArea || 'personality');
    $('assessmentScope').textContent = `${data.questionCount || 0} ${L().questions}`;
    $('assessmentCredit').textContent = L().processRule;
    const answered = Number(data.usableAnswerCount ?? data.answeredCount ?? 0);
    const completed = Number(data.completedSlotCount ?? answered);
    const expected = Math.max(1, Number(data.expectedAnswers || data.questionCount || 1));
    const pct = Math.min(100, Math.round((completed / expected) * 100));
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
    adoptReadiness(current);
    const phase = current.phase || 'not_started';
    const notStarted = phase === 'not_started';
    const running = phase === 'running';
    const processing = phase === 'processing';
    const completed = phase === 'completed';
    const failed = phase === 'failed';
    if (isHybridMode() && ['chat','processing','completed'].includes(String(current.hybridPhase||'').toLowerCase())) hybridChatActive = true;
    const media = isMediaMode();
    const video = isVideoMode();
    const mediaStage = media && !(isHybridMode() && hybridChatActive);
    $('assessmentView')?.classList.toggle('media-mode', mediaStage);
    $('assessmentView')?.classList.toggle('video-mode', video);
    if (video) ensureVideoConsentControl();
    if (media) ensureMediaFrame();
    videoConsentControl?.classList.toggle('hidden', !video || !notStarted);
    mediaShell?.classList.toggle('hidden', !mediaStage || processing || completed || failed);
    $('assessmentStartPanel').classList.toggle('hidden', !notStarted);
    $('assessmentChatPanel').classList.toggle('hidden', mediaStage || !(running || processing));
    $('assessmentProcessingPanel').classList.toggle('hidden', !(processing || failed));
    $('assessmentCompletePanel').classList.toggle('hidden', !completed);
    $('assessmentComposer').classList.toggle('hidden', mediaStage || !running);
    const allAnswered = completedSlots(current) >= Number(current.expectedAnswers || current.questionCount || 1);
    const closingPending = finalOpenPending(current);
    const displayHistory = [...(current.history || [])];
    if (closingPending) displayHistory.push({ role:'assistant', text:finalOpenCopy().prompt, questionIndex:0, turnType:'final_open_prompt' });
    if (current.finalOpenCompleted === true && current.finalOpenUsed === true && current.finalOpenAnswer) displayHistory.push({ role:'user', text:current.finalOpenAnswer, questionIndex:0, turnType:'final_open' });
    renderHistory(displayHistory);
    $('assessmentFinishBtn').classList.toggle('hidden', mediaStage || !running || !allAnswered);
    $('assessmentSendBtn').classList.toggle('hidden', mediaStage || !running || (allAnswered && !closingPending));
    if ($('assessmentInput')) $('assessmentInput').placeholder = closingPending ? finalOpenCopy().placeholder : L().placeholder;
    if ($('assessmentSendBtn')) $('assessmentSendBtn').textContent = closingPending ? finalOpenCopy().save : L().send;
    if ($('assessmentFinishBtn')) $('assessmentFinishBtn').textContent = closingPending ? finalOpenCopy().skip : L().finish;
    if (mediaStage && running && mediaRecordStarted) status(mediaCopy('audioRecording','videoRecording'), 'ok');
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
      status(L().technicalInterrupted, 'err');
    } else if (processing) {
      status(L().processing, 'warn');
    } else if (running) {
      status(mediaStage && mediaRecordStarted ? mediaCopy('audioRecording','videoRecording') : '', mediaStage && mediaRecordStarted ? 'ok' : '');
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
          status(participantLanguage() === 'de'
            ? 'Der verfügbare Bericht kann geöffnet werden. Die Unified-Version wird weiterhin im Hintergrund erstellt.'
            : 'The available report can be opened. The unified version continues processing in the background.', 'warn');
        } else {
          status(participantLanguage() === 'de'
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
        const error = new Error(L().firstQuestionMissing);
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
    const closingAnswer = finalOpenPending(current);
    let autoFinish = false;
    setBusy(true, $('assessmentSendBtn'));
    try {
      const data = await api(endpoint('Message'), {
        body: { token: state.token, uid: state.uid, sessionId: current?.sessionId || '', message, finalOpen:closingAnswer, turnType:closingAnswer?'final_open':'main_answer', captureSource:'chat' }
      });
      input.value = '';
      const next = data.state || data;
      render(next);
      autoFinish = next.done === true || (closingAnswer && next.finalOpenCompleted === true) || (
        next.finalOpenRequired !== true && completedSlots(next) >= Number(next.expectedAnswers || next.questionCount || Number.MAX_SAFE_INTEGER)
      );
    } catch (error) {
      if (isAmbiguous(error)) {
        status(L().transport, 'warn');
        const recovered = await readStatus({ includeHistory: false, includeReportLookup: false }).catch(() => null);
        autoFinish = recovered && (recovered.done === true || (closingAnswer && recovered.finalOpenCompleted === true) || (
          recovered.finalOpenRequired !== true && completedSlots(recovered) >= Number(recovered.expectedAnswers || recovered.questionCount || Number.MAX_SAFE_INTEGER)
        ));
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
        body: { token: state.token, uid: state.uid, sessionId: current?.sessionId || '', finalOpenSkipped:finalOpenPending(current) }
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
    $('assessmentTitle').textContent = isAudioChatMode() ? 'CLARITY Assessment · Audio + Chat' : copy.title;
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
