const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED = new Set(['pdf','doc','docx','txt','rtf']);

const COPY = {
  de: {
    eyebrow:'CV-Analyse', title:'Lebenslauf hochladen', text:'Wählen Sie ein unterstütztes Dokument. Der Upload verbraucht noch keinen Credit.',
    creditRule:'0 Credits bis zum Analysestart', dropTitle:'Lebenslauf auswählen oder hier ablegen', dropHelp:'PDF, DOC, DOCX, TXT oder RTF · maximal 8 MB',
    remove:'Entfernen', upload:'CV hochladen', start:(n)=>`Analyse starten · ${n} Credit${n===1?'':'s'}`, back:'Zurück',
    stageUploadTitle:'1 · Sicherer Upload', stageUploadText:'Noch kein Creditverbrauch', stageStartTitle:'2 · Analyse starten', stageStartText:'Verbraucht den reservierten Credit genau einmal',
    pending:'Ausstehend', selected:'Ausgewählt', uploading:'Wird hochgeladen', uploaded:'Bereit', starting:'Wird gestartet', consumed:'Credit bestätigt',
    privacy:'Ihr CV wird nur für den konfigurierten CLARITY-Workflow verarbeitet. Die endgültige Entscheidung bleibt beim Menschen.',
    invalidType:'Unterstützt werden PDF, DOC, DOCX, TXT und RTF.', tooLarge:'Die Datei darf maximal 8 MB groß sein.', uploadFailed:'Der CV-Upload konnte nicht abgeschlossen werden.',
    processingTitle:'CV-Analyse läuft', processingText:'Das Dokument wird extrahiert, strukturiert analysiert und für den CLARITY Workspace vorbereitet.',
    creditTitle:'Credit bestätigt', creditText:'Die reservierte Einheit wird bei analysis_started genau einmal verbraucht.', extractTitle:'Dokumentextraktion', extractText:'Die bereitgestellten CV-Informationen werden gelesen.',
    analysisTitle:'Strukturierte Analyse', analysisText:'Rollenfit, Stärken, Risiken und Interviewfragen.', reportTitle:'Einheitlicher Report', reportText:'Der konsistente CLARITY-Report wird erstellt.',
    workspaceTitle:'Workspace-Index', workspaceText:'Ergebnis und Assets werden im Unternehmens-Workspace veröffentlicht.', waiting:'Wartet', running:'Läuft', ready:'Bereit', failed:'Fehlgeschlagen',
    processingNotice:'Die Verarbeitung läuft serverseitig weiter. Ein vorübergehender Timeout bedeutet nicht automatisch, dass die Analyse fehlgeschlagen ist.',
    completeTitle:'CV-Analyse abgeschlossen', completeText:'Das Unternehmen kann das strukturierte Ergebnis und den Report jetzt im CLARITY Workspace prüfen.',
    document:'Dokument', status:'Status', complete:'Abgeschlossen', unifiedReport:'Einheitlicher Report', readyWorkspace:'Im Workspace bereit', reviewWorkspace:'Im Workspace zur Prüfung', credit:'Credit', consumedOnce:'Einmal verbraucht',
    review:'Das Ergebnis ist verfügbar, der Report wurde durch das Qualitäts-Gate jedoch zur menschlichen Prüfung markiert.', openReport:'Report öffnen', close:'Fenster schließen', retry:'Technisch erneut versuchen',
    noFile:'Bitte wählen Sie zuerst eine CV-Datei.', generic:'Der CV-Prozess konnte nicht abgeschlossen werden.', reportAvailable:'Report verfügbar', reportPending:'Report wird vorbereitet'
  },
  en: {
    eyebrow:'CV Analysis', title:'Upload your CV', text:'Select a supported document. Uploading the file does not consume a credit.',
    creditRule:'0 credits until analysis starts', dropTitle:'Choose a CV or drop it here', dropHelp:'PDF, DOC, DOCX, TXT or RTF · maximum 8 MB',
    remove:'Remove', upload:'Upload CV', start:(n)=>`Start analysis · ${n} credit${n===1?'':'s'}`, back:'Back',
    stageUploadTitle:'1 · Secure upload', stageUploadText:'No credit consumption', stageStartTitle:'2 · Start analysis', stageStartText:'Consumes the reserved credit exactly once',
    pending:'Pending', selected:'Selected', uploading:'Uploading', uploaded:'Ready', starting:'Starting', consumed:'Credit confirmed',
    privacy:'Your CV is processed only for the configured CLARITY workflow. Final decisions remain human-led.',
    invalidType:'Supported formats are PDF, DOC, DOCX, TXT and RTF.', tooLarge:'The file must not exceed 8 MB.', uploadFailed:'The CV upload could not be completed.',
    processingTitle:'CV Analysis is running', processingText:'The document is being extracted, structurally analysed and prepared for the CLARITY Workspace.',
    creditTitle:'Credit confirmed', creditText:'The reserved unit is consumed exactly once at analysis_started.', extractTitle:'Document extraction', extractText:'Reading the supplied CV information.',
    analysisTitle:'Structured analysis', analysisText:'Role fit, strengths, risks and interview questions.', reportTitle:'Unified report', reportText:'Creating the consistent CLARITY report.',
    workspaceTitle:'Workspace index', workspaceText:'Publishing result and assets to the company Workspace.', waiting:'Waiting', running:'Running', ready:'Ready', failed:'Failed',
    processingNotice:'Processing continues server-side. A temporary timeout does not automatically mean the analysis failed.',
    completeTitle:'CV Analysis completed', completeText:'The organisation can now review the structured result and report in the CLARITY Workspace.',
    document:'Document', status:'Status', complete:'Completed', unifiedReport:'Unified report', readyWorkspace:'Ready in Workspace', reviewWorkspace:'Review in Workspace', credit:'Credit', consumedOnce:'Consumed once',
    review:'The result is available, but the report quality gate marked it for human review.', openReport:'Open report', close:'Close window', retry:'Retry technical processing',
    noFile:'Select a CV file first.', generic:'The CV process could not be completed.', reportAvailable:'Report available', reportPending:'Report is being prepared'
  }
};

function ext(name=''){const m=String(name).toLowerCase().match(/\.([a-z0-9]{1,10})$/);return m?m[1]:''}
function fmtBytes(n=0){const x=Number(n)||0;if(x<1024)return`${x} B`;if(x<1024*1024)return`${(x/1024).toFixed(1)} KB`;return`${(x/1024/1024).toFixed(2)} MB`}
function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
function fileDataUrl(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result||''));r.onerror=()=>reject(r.error||new Error('FILE_READ_FAILED'));r.readAsDataURL(file)})}

export function createCvModule(context){
  const { $, state, api, show, setStep, getLocale, onFatal } = context;
  let selectedFile=null;
  let lastStatus=null;
  let wired=false;
  let polling=false;

  const tr=(key,...args)=>{const lang=getLocale()==='de'?'de':'en';const value=COPY[lang][key]??COPY.en[key]??key;return typeof value==='function'?value(...args):value};
  const setText=(id,value)=>{const el=$(id);if(el)el.textContent=value};
  const setBusy=(id,busy)=>{const el=$(id);if(!el)return;el.disabled=!!busy;el.classList.toggle('busy',!!busy)};
  const stage=(selector,status,label)=>{const el=document.querySelector(selector);if(!el)return;el.classList.remove('active','done','failed');if(status)el.classList.add(status);const em=el.querySelector('em');if(em)em.textContent=label||''};
  const units=()=>Math.max(1,Number(state.payload?.runtime?.requiredUnits||1));

  function applyLocale(){
    const values={cvEyebrow:'eyebrow',cvTitle:'title',cvText:'text',cvCreditRule:'creditRule',cvDropTitle:'dropTitle',cvDropHelp:'dropHelp',cvRemoveFileBtn:'remove',cvUploadBtn:'upload',cvBackBtn:'back',cvStageUploadTitle:'stageUploadTitle',cvStageUploadText:'stageUploadText',cvStageStartTitle:'stageStartTitle',cvStageStartText:'stageStartText',cvPrivacyNote:'privacy',cvProcessingTitle:'processingTitle',cvProcessingText:'processingText',cvProcessCreditTitle:'creditTitle',cvProcessCreditText:'creditText',cvProcessExtractTitle:'extractTitle',cvProcessExtractText:'extractText',cvProcessAnalysisTitle:'analysisTitle',cvProcessAnalysisText:'analysisText',cvProcessReportTitle:'reportTitle',cvProcessReportText:'reportText',cvProcessWorkspaceTitle:'workspaceTitle',cvProcessWorkspaceText:'workspaceText',cvProcessingNotice:'processingNotice',cvCompleteTitle:'completeTitle',cvCompleteText:'completeText',cvCompleteFileLabel:'document',cvCompleteStatusLabel:'status',cvCompleteStatus:'complete',cvCompleteReportLabel:'unifiedReport',cvCompleteCreditLabel:'credit',cvCompleteCredit:'consumedOnce',cvReviewText:'review',cvCandidateReportLink:'openReport',cvCloseBtn:'close'};
    Object.entries(values).forEach(([id,key])=>setText(id,tr(key)));
    setText('cvStartBtn',tr('start',units()));
    if(!selectedFile&&!lastStatus?.cv?.sourcePresent)stage('[data-stage="upload"]','',tr('pending'));
    if(!lastStatus?.cv?.billableEventOccurred)stage('[data-stage="start"]','',tr('pending'));
  }

  function chooseFile(file){
    if(!file)return;
    if(!ACCEPTED.has(ext(file.name))){alert(tr('invalidType'));return}
    if(file.size>MAX_BYTES){alert(tr('tooLarge'));return}
    selectedFile=file;
    $('cvFileCard').classList.remove('hidden');
    setText('cvFileName',file.name);setText('cvFileMeta',`${fmtBytes(file.size)} · ${file.type||ext(file.name).toUpperCase()}`);
    $('cvUploadBtn').disabled=false;
    stage('[data-stage="upload"]','active',tr('selected'));
  }

  function clearFile(){selectedFile=null;$('cvFileInput').value='';$('cvFileCard').classList.add('hidden');$('cvUploadBtn').disabled=true;if(!lastStatus?.cv?.sourcePresent)stage('[data-stage="upload"]','',tr('pending'))}

  async function refresh(){
    const data=await api('v2CvStatus',{body:{token:state.token,uid:state.uid}});
    lastStatus=data;renderStatus(data);return data;
  }

  function renderStatus(data){
    const cv=data?.cv||{};
    if(cv.sourcePresent){
      setText('cvFileName',cv.fileName||'CV');setText('cvFileMeta',`${fmtBytes(cv.fileSizeBytes)} · ${cv.mimeType||''}`);
      $('cvFileCard').classList.remove('hidden');$('cvUploadBtn').disabled=true;$('cvStartBtn').disabled=!!cv.billableEventOccurred;
      stage('[data-stage="upload"]','done',tr('uploaded'));
    }
    if(cv.billableEventOccurred)stage('[data-stage="start"]','done',tr('consumed'));
    else if(cv.sourcePresent)stage('[data-stage="start"]','active',tr('pending'));
    setText('cvStartBtn',tr('start',units()));
    renderProcessingStages(data);
  }

  function renderProcessingStages(data){
    const cv=data?.cv||{},phase=cv.phase||'';
    const all=['credit','extract','analysis','report','workspace'];
    all.forEach(name=>stage(`[data-process-stage="${name}"]`,'',tr('waiting')));
    let progress=8;
    if(cv.billableEventOccurred){stage('[data-process-stage="credit"]','done',tr('ready'));progress=20}
    if(['processing','report_processing','completed'].includes(phase)){
      stage('[data-process-stage="extract"]',phase==='processing'?'active':'done',phase==='processing'?tr('running'):tr('ready'));progress=phase==='processing'?42:58;
      stage('[data-process-stage="analysis"]',phase==='processing'?'active':'done',phase==='processing'?tr('running'):tr('ready'));
    }
    if(['report_processing','completed'].includes(phase)){
      stage('[data-process-stage="extract"]','done',tr('ready'));stage('[data-process-stage="analysis"]','done',tr('ready'));
      stage('[data-process-stage="report"]',phase==='report_processing'?'active':'done',phase==='report_processing'?tr('running'):tr('ready'));progress=phase==='report_processing'?78:92;
    }
    if(phase==='completed'){
      stage('[data-process-stage="report"]','done',tr('ready'));stage('[data-process-stage="workspace"]','done',tr('ready'));progress=100;
    }else if(data?.pipeline?.stages?.some(s=>s.key==='workspace'&&['indexed','ready'].includes(s.status))){stage('[data-process-stage="workspace"]','done',tr('ready'));progress=Math.max(progress,96)}
    if(phase==='failed_technical'){
      const current=cv.errorStage==='unified_report'?'report':'analysis';stage(`[data-process-stage="${current}"]`,'failed',tr('failed'));
    }
    $('cvProcessingBar').style.width=`${progress}%`;
  }

  async function upload(){
    if(!selectedFile){alert(tr('noFile'));return}
    setBusy('cvUploadBtn',true);stage('[data-stage="upload"]','active',tr('uploading'));
    try{
      const dataUrl=await fileDataUrl(selectedFile);
      const result=await api('v2CvUpload',{body:{token:state.token,uid:state.uid,fileName:selectedFile.name,mimeType:selectedFile.type||'',base64:dataUrl}});
      lastStatus=result;renderStatus(result);$('cvStartBtn').disabled=false;stage('[data-stage="upload"]','done',tr('uploaded'));
    }catch(error){stage('[data-stage="upload"]','failed',tr('failed'));alert(error?.message||tr('uploadFailed'))}
    finally{setBusy('cvUploadBtn',false);$('cvUploadBtn').disabled=!!lastStatus?.cv?.sourcePresent}
  }

  async function startAnalysis(){
    setBusy('cvStartBtn',true);stage('[data-stage="start"]','active',tr('starting'));
    try{
      const started=await api('v2CvStart',{body:{token:state.token,uid:state.uid}});lastStatus=started;renderStatus(started);stage('[data-stage="start"]','done',tr('consumed'));show('cvProcessingView');
      api('v2CvProcess',{body:{token:state.token,uid:state.uid}}).catch(()=>null);
      await pollUntilTerminal();
    }catch(error){stage('[data-stage="start"]','failed',tr('failed'));alert(error?.message||tr('generic'));await refresh().catch(()=>null)}
    finally{setBusy('cvStartBtn',false)}
  }

  async function pollUntilTerminal(){
    if(polling)return;polling=true;
    try{
      for(let attempt=0;attempt<120;attempt+=1){
        const data=await refresh();const phase=data?.cv?.phase;
        if(phase==='completed'){renderComplete(data);return}
        if(phase==='failed_technical'){renderFailure(data);return}
        await sleep(2500);
      }
      throw new Error(getLocale()==='de'?'Die Verarbeitung dauert länger. Öffnen Sie den Link später erneut, um den Status zu prüfen.':'Processing is taking longer. Reopen the link later to check the status.');
    }catch(error){alert(error?.message||tr('generic'))}
    finally{polling=false}
  }

  function renderComplete(data){
    lastStatus=data;const cv=data.cv||{};
    setText('cvCompleteFile',cv.fileName||'CV');setText('cvCompleteStatus',tr('complete'));
    setText('cvCompleteReport',cv.reportReviewRequired?tr('reviewWorkspace'):tr('readyWorkspace'));
    $('cvReviewNotice').classList.toggle('hidden',!cv.reportReviewRequired);
    const link=$('cvCandidateReportLink');
    if(cv.candidateReportAccess&&cv.preferredReportUrl){link.href=cv.preferredReportUrl;link.classList.remove('hidden')}else{link.classList.add('hidden')}
    setStep('module');show('cvCompleteView');
  }

  function renderFailure(data){
    lastStatus=data;const cv=data.cv||{};show('cvProcessingView');renderProcessingStages(data);
    let retry=$('cvRetryBtn');
    if(!retry){retry=document.createElement('button');retry.id='cvRetryBtn';retry.className='btn primary';retry.type='button';$('cvProcessingView').appendChild(retry);retry.addEventListener('click',retryProcessing)}
    retry.textContent=tr('retry');retry.classList.remove('hidden');
    const message=cv.errorMessage||tr('generic');
    const note=$('cvProcessingNotice');if(note)note.textContent=message;
  }

  async function retryProcessing(){
    const btn=$('cvRetryBtn');if(btn){btn.disabled=true;btn.classList.add('busy')}
    try{show('cvProcessingView');api('v2CvRetry',{body:{token:state.token,uid:state.uid}}).catch(()=>null);await pollUntilTerminal()}
    catch(error){alert(error?.message||tr('generic'))}
    finally{if(btn){btn.disabled=false;btn.classList.remove('busy')}}
  }

  async function activate(){
    applyLocale();
    try{
      const data=await refresh();const phase=data?.cv?.phase;
      if(phase==='completed'){renderComplete(data);return}
      if(['processing','report_processing'].includes(phase)){show('cvProcessingView');api('v2CvProcess',{body:{token:state.token,uid:state.uid}}).catch(()=>null);await pollUntilTerminal();return}
      if(phase==='failed_technical'){renderFailure(data);return}
      show('cvView');
    }catch(error){onFatal(error)}
  }

  function wire(){
    if(wired)return;wired=true;
    $('cvFileInput').addEventListener('change',event=>chooseFile(event.target.files?.[0]));
    const zone=$('cvDropZone');
    ['dragenter','dragover'].forEach(type=>zone.addEventListener(type,event=>{event.preventDefault();zone.classList.add('drag')}));
    ['dragleave','drop'].forEach(type=>zone.addEventListener(type,event=>{event.preventDefault();zone.classList.remove('drag')}));
    zone.addEventListener('drop',event=>chooseFile(event.dataTransfer?.files?.[0]));
    $('cvRemoveFileBtn').addEventListener('click',clearFile);$('cvUploadBtn').addEventListener('click',upload);$('cvStartBtn').addEventListener('click',startAnalysis);
    $('cvBackBtn').addEventListener('click',()=>show('moduleView'));$('cvCloseBtn').addEventListener('click',()=>window.close());
  }

  wire();applyLocale();
  return { activate, applyLocale, refresh };
}
