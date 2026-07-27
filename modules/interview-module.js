// modules/interview-module.js
// CLARITY Universal App - Interview module I1.7.2 v1.1.1
// Lost-response recovery for committed starts and idempotent chat messages.

const MODULE_VERSION='1.5.2-i4-0-2-start-transport-recovery';
const ACTION_TIMEOUT_MS=Object.freeze({preflight:14000,status:25000,audioToken:20000,start:45000,message:65000,finish:90000,retry:90000,audioChunk:90000,audioFinalize:140000,audioUploadStatus:30000,videoChunk:90000,videoFinalize:180000,videoUploadStatus:30000});
const FRAME_BY_MODE=Object.freeze({
  chat:`./modules/interview-chat.html?v=${MODULE_VERSION}`,
  audio:`./modules/interview-audio-recorder.html?v=${MODULE_VERSION}`,
  video:`./modules/interview-video-recorder.html?v=${MODULE_VERSION}`,
  audio_chat:`./modules/interview-mix-recorder.html?v=${MODULE_VERSION}&capture=video`,
  video_chat:`./modules/interview-mix-recorder.html?v=${MODULE_VERSION}&capture=video`,
  mix:`./modules/interview-mix-recorder.html?v=${MODULE_VERSION}&capture=video`
});

function normalizeMode(value){const mode=String(value||'chat').toLowerCase().replace(/[+\s-]+/g,'_');if(['text','written','structured_chat'].includes(mode))return'chat';if(['audio_only','voice'].includes(mode))return'audio';if(['video_only'].includes(mode))return'video';if(['chat_audio','audiochat','audio_chat'].includes(mode))return'mix';if(['chat_video','videochat','video_chat','hybrid','mix','mixed','mixed_mode'].includes(mode))return'mix';return mode}
function errorShape(error){return{code:String(error?.code||'INTERVIEW_MODULE_ERROR'),message:String(error?.message||error||'Interview module request failed.'),details:error?.details||null,transport:isTransportError(error)}}
function isTransportError(error){const value=`${error?.name||''} ${error?.code||''} ${error?.message||error||''}`.toLowerCase();return error instanceof TypeError||/failed to fetch|networkerror|network error|load failed|fetch failed|request timed out|interview_request_timeout/.test(value)}
function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms))}

export function createInterviewModule(ctx){
  const{$,state,api,show,setStep,getLocale,onFatal}=ctx;
  let active=false;let frame=null;let ready=false;let pendingInit=false;let messageHandler=null;
  const runtime=()=>state.payload?.runtime||{};
  const mode=()=>normalizeMode(runtime().mode||runtime().workflowSnapshot?.mode||'chat');
  function shell(){let host=document.getElementById('interviewModuleShell');if(host)return host;host=document.createElement('section');host.id='interviewModuleShell';host.className='interview-module-shell';host.style.cssText='margin-top:18px;min-height:620px;border:1px solid rgba(91,92,240,.2);border-radius:24px;overflow:hidden;background:#061326;box-shadow:0 24px 70px rgba(5,18,38,.18)';const moduleView=$('moduleView');moduleView.appendChild(host);return host}
  function send(type,payload={}){if(!frame?.contentWindow)return;frame.contentWindow.postMessage({channel:'CLARITY_INTERVIEW_V2',type,payload},location.origin)}
  function initFrame(){if(!ready){pendingInit=true;return}pendingInit=false;send('INIT',{uid:state.uid,token:state.token,locale:getLocale(),runtime:runtime(),branding:state.payload?.branding||{},release:{chat:true,audio:mode()==='audio',video:mode()==='video',mix:mode()==='mix'},moduleVersion:MODULE_VERSION,debug:new URLSearchParams(location.search).get('debug')==='1'})}
  async function rawAction(name,payload={}){
    const endpoint={preflight:'v2InterviewPreflight',status:'v2InterviewStatus',start:'v2InterviewStart',message:'v2InterviewMessage',finish:'v2InterviewFinish',retry:'v2InterviewRetry',audioToken:'v2InterviewAudioToken',audioChunk:'v2InterviewAudioChunk',audioFinalize:'v2InterviewAudioFinalize',audioUploadStatus:'v2InterviewAudioUploadStatus',videoChunk:'v2InterviewAudioChunk',videoFinalize:'v2InterviewAudioFinalize',videoUploadStatus:'v2InterviewAudioUploadStatus'}[name];
    if(!endpoint)throw Object.assign(new Error(`Unknown Interview action '${name}'.`),{code:'INTERVIEW_ACTION_UNKNOWN'});
    const timeoutMs=ACTION_TIMEOUT_MS[name]||90000;
    const startedAt=Date.now();
    console.info(`[CLARITY INTERVIEW MODULE] action started ${JSON.stringify({name,endpoint,timeoutMs,uid:state.uid,moduleVersion:MODULE_VERSION})}`);
    try{
      const data=await api(endpoint,{body:{token:state.token,uid:state.uid,clientModuleVersion:MODULE_VERSION,...payload},timeoutMs});
      console.info(`[CLARITY INTERVIEW MODULE] action completed ${JSON.stringify({name,endpoint,durationMs:Date.now()-startedAt,moduleVersion:MODULE_VERSION})}`);
      return data
    }catch(error){
      console.error(`[CLARITY INTERVIEW MODULE] action failed ${JSON.stringify({name,endpoint,code:error?.code||'',message:error?.message||'',details:error?.details||null,durationMs:Date.now()-startedAt,moduleVersion:MODULE_VERSION})}`);
      throw error
    }
  }
  async function recoverStatus(payload={},attempts=4){let lastError=null;for(let attempt=0;attempt<attempts;attempt+=1){if(attempt)await sleep(700*(attempt+1));try{return await rawAction('status',{sessionId:payload.sessionId||'',includeHistory:true})}catch(error){lastError=error;if(!isTransportError(error))throw error}}throw lastError||Object.assign(new Error('Interview recovery status could not be loaded.'),{code:'INTERVIEW_RECOVERY_FAILED'})}
  async function recoverCommittedStart(payload={},firstError=null){
    const startedAt=Date.now();
    const delays=[650,850,1050,1250,1500,1800,2200,2600,3000,3500,4000,4500];
    let lastState=null;let lastError=firstError;
    for(let attempt=0;attempt<delays.length;attempt+=1){
      await sleep(delays[attempt]);
      try{
        const stateData=await rawAction('status',{sessionId:payload.sessionId||'',includeHistory:true});
        lastState=stateData;
        const phase=String(stateData?.phase||stateData?.status||'').toLowerCase();
        const committed=Boolean(stateData?.sessionId)&&['running','processing','completed'].includes(phase);
        console.info(`[CLARITY INTERVIEW MODULE] start recovery status ${JSON.stringify({attempt:attempt+1,phase,sessionId:stateData?.sessionId||'',committed,durationMs:Date.now()-startedAt,moduleVersion:MODULE_VERSION})}`);
        if(committed)return{ok:true,recovered:true,idempotentReplay:true,state:stateData,firstQuestion:stateData.currentQuestion||null,diagnostics:{startRecoveryAttempts:attempt+1,startRecoveryDurationMs:Date.now()-startedAt}};
        if(String(stateData?.startStatus||'').toLowerCase()==='failed'){
          throw Object.assign(new Error(stateData?.startErrorMessage||'Interview start could not be committed.'),{code:stateData?.startErrorCode||'INTERVIEW_START_COMMIT_FAILED',details:{state:stateData}})
        }
      }catch(error){
        lastError=error;
        if(!isTransportError(error))throw error
      }
    }
    const error=Object.assign(new Error('The Interview start is still being committed. Please use reconnect once; no second credit will be consumed.'),{code:'INTERVIEW_START_COMMIT_RECOVERY_TIMEOUT',details:{lastPhase:lastState?.phase||lastState?.status||'',sessionId:lastState?.sessionId||'',durationMs:Date.now()-startedAt,originalError:firstError?.message||'',lastError:lastError?.message||''}});
    throw error
  }
  async function action(name,payload={}){
    try{return await rawAction(name,payload)}catch(firstError){
      if(!isTransportError(firstError))throw firstError;
      console.warn('[CLARITY INTERVIEW] Response transport interrupted; starting idempotent recovery.',{name,error:firstError?.message});
      if(name==='start'){
        // Wix can terminate the HTTP response while the canonical commercial
        // commit is still completing. A single successful status read may still
        // report phase=created, so keep polling until the same idempotent start
        // reaches running/processing/completed. Never issue a hidden second start.
        return recoverCommittedStart(payload,firstError)
      }
      if(name==='message'){
        await sleep(900);
        try{return await rawAction('message',payload)}catch(secondError){if(!isTransportError(secondError))throw secondError;const stateData=await recoverStatus(payload);if(payload.clientMessageId&&stateData?.lastProcessedClientMessageId===payload.clientMessageId)return{ok:true,recovered:true,idempotentReplay:true,done:Boolean(stateData.processing||stateData.completed),state:stateData,nextQuestion:stateData.currentQuestion||null};throw secondError}
      }
      if(name==='finish'){
        const stateData=await recoverStatus(payload);if(stateData?.processing||stateData?.completed)return{ok:true,recovered:true,state:stateData};throw firstError
      }
      if(name==='audioFinalize'||name==='videoFinalize'){for(let attempt=0;attempt<8;attempt+=1){await sleep(1200);try{const media=await rawAction(name==='videoFinalize'?'videoUploadStatus':'audioUploadStatus',{sessionId:payload.sessionId||'',uploadId:payload.uploadId||''});if(media?.ready)return{ok:true,recovered:true,idempotentReplay:true,...media}}catch(_){}}throw firstError}
      if(name==='audioChunk')throw firstError;
      // Voice preparation is user-visible and explicitly retryable in the
      // recorder UI. Do not launch hidden overlapping retries after a timeout.
      if(name==='audioToken'||name==='preflight')throw firstError
      if(name==='status')return recoverStatus(payload,5);
      throw firstError
    }
  }
  function wireMessages(){if(messageHandler)return;messageHandler=async(event)=>{if(event.origin!==location.origin||event.source!==frame?.contentWindow)return;const msg=event.data||{};if(msg.channel!=='CLARITY_INTERVIEW_V2')return;if(msg.type==='READY'){ready=true;initFrame();return}if(msg.type==='HEIGHT'){const h=Math.max(620,Math.min(1800,Number(msg.payload?.height||0)||800));frame.style.height=`${h}px`;return}if(msg.type==='FATAL'){onFatal?.(msg.payload||{});return}if(msg.type==='ACTION'){const envelope=(msg.payload&&typeof msg.payload==='object'&&(msg.payload.requestId||msg.payload.action))?msg.payload:msg;const requestId=String(envelope.requestId||msg.requestId||'');const actionName=String(envelope.action||msg.action||'');const actionPayload=(envelope.payload&&typeof envelope.payload==='object')?envelope.payload:{};if(!requestId||!actionName){console.error(`[CLARITY INTERVIEW MODULE] invalid action envelope ${JSON.stringify({requestId,actionName,hasOuterPayload:Boolean(msg.payload),moduleVersion:MODULE_VERSION})}`);if(requestId)send('RESPONSE',{requestId,ok:false,error:{code:'INTERVIEW_ACTION_ENVELOPE_INVALID',message:'Interview action message was incomplete.',details:{actionName,moduleVersion:MODULE_VERSION},transport:false}});return}console.info(`[CLARITY INTERVIEW MODULE] action envelope received ${JSON.stringify({requestId,actionName,legacyNested:envelope===msg.payload,moduleVersion:MODULE_VERSION})}`);try{const data=await action(actionName,actionPayload);send('RESPONSE',{requestId,ok:true,data})}catch(error){send('RESPONSE',{requestId,ok:false,error:errorShape(error)})}}};window.addEventListener('message',messageHandler)}
  async function activate(){if(active){initFrame();return}active=true;setStep('module');show('moduleView');const m=mode();const src=FRAME_BY_MODE[m]||FRAME_BY_MODE.chat;const host=shell();host.innerHTML='';frame=document.createElement('iframe');frame.id='interviewModuleFrame';frame.title='CLARITY Interview';frame.src=src;frame.allow='microphone; camera; autoplay';frame.setAttribute('allow','microphone; camera; autoplay');frame.referrerPolicy='no-referrer';frame.loading='eager';frame.style.cssText='display:block;width:100%;height:820px;border:0;background:#061326';host.appendChild(frame);wireMessages();frame.addEventListener('load',()=>{ready=false;setTimeout(initFrame,40)});$('startModuleBtn').disabled=true;$('statusBtn').classList.add('hidden')}
  function destroy(){if(messageHandler){window.removeEventListener('message',messageHandler);messageHandler=null}frame?.remove();frame=null;ready=false;active=false}
  return{activate,destroy,refresh(){if(active)send('REFRESH',{token:state.token,runtime:runtime(),branding:state.payload?.branding||{}})},updateToken(){if(active)initFrame()}}
}
