// modules/interview-module.js
// CLARITY Universal App — Interview module I1.3 v1.0.1
// Lost-response recovery for committed starts and idempotent chat messages.

const MODULE_VERSION='1.0.1-i1-3';
const FRAME_BY_MODE=Object.freeze({
  chat:`./modules/interview-chat.html?v=${MODULE_VERSION}`,
  audio:'./modules/interview-audio-recorder.html?v=1.0.0',
  video:'./modules/interview-video-recorder.html?v=1.0.0',
  audio_chat:'./modules/interview-mix-recorder.html?v=1.0.0&capture=audio',
  video_chat:'./modules/interview-mix-recorder.html?v=1.0.0&capture=video',
  mix:'./modules/interview-mix-recorder.html?v=1.0.0&capture=video'
});

function normalizeMode(value){const mode=String(value||'chat').toLowerCase().replace(/[+\s-]+/g,'_');if(['text','written','structured_chat'].includes(mode))return'chat';if(['audio_only','voice'].includes(mode))return'audio';if(['video_only'].includes(mode))return'video';if(['chat_audio','audiochat'].includes(mode))return'audio_chat';if(['chat_video','videochat','hybrid'].includes(mode))return'video_chat';return mode}
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
  function initFrame(){if(!ready){pendingInit=true;return}pendingInit=false;send('INIT',{uid:state.uid,token:state.token,locale:getLocale(),runtime:runtime(),branding:state.payload?.branding||{},release:{chat:true,audio:false,video:false,mix:false},moduleVersion:MODULE_VERSION})}
  async function rawAction(name,payload={}){const endpoint={status:'v2InterviewStatus',start:'v2InterviewStart',message:'v2InterviewMessage',finish:'v2InterviewFinish',retry:'v2InterviewRetry'}[name];if(!endpoint)throw Object.assign(new Error(`Unknown Interview action '${name}'.`),{code:'INTERVIEW_ACTION_UNKNOWN'});return api(endpoint,{body:{token:state.token,uid:state.uid,...payload}})}
  async function recoverStatus(payload={},attempts=4){let lastError=null;for(let attempt=0;attempt<attempts;attempt+=1){if(attempt)await sleep(700*(attempt+1));try{return await rawAction('status',{sessionId:payload.sessionId||'',includeHistory:true})}catch(error){lastError=error;if(!isTransportError(error))throw error}}throw lastError||Object.assign(new Error('Interview recovery status could not be loaded.'),{code:'INTERVIEW_RECOVERY_FAILED'})}
  async function action(name,payload={}){
    try{return await rawAction(name,payload)}catch(firstError){
      if(!isTransportError(firstError))throw firstError;
      console.warn('[CLARITY INTERVIEW] Response transport interrupted; starting idempotent recovery.',{name,error:firstError?.message});
      if(name==='start'){
        await sleep(900);
        try{return await rawAction('start',payload)}catch(secondError){if(!isTransportError(secondError))throw secondError;const stateData=await recoverStatus(payload);if(stateData?.sessionId&&['running','processing','completed'].includes(String(stateData.phase||'')))return{ok:true,recovered:true,idempotentReplay:true,state:stateData,firstQuestion:stateData.currentQuestion||null};throw secondError}
      }
      if(name==='message'){
        await sleep(900);
        try{return await rawAction('message',payload)}catch(secondError){if(!isTransportError(secondError))throw secondError;const stateData=await recoverStatus(payload);if(payload.clientMessageId&&stateData?.lastProcessedClientMessageId===payload.clientMessageId)return{ok:true,recovered:true,idempotentReplay:true,done:Boolean(stateData.processing||stateData.completed),state:stateData,nextQuestion:stateData.currentQuestion||null};throw secondError}
      }
      if(name==='finish'){
        const stateData=await recoverStatus(payload);if(stateData?.processing||stateData?.completed)return{ok:true,recovered:true,state:stateData};throw firstError
      }
      if(name==='status')return recoverStatus(payload,5);
      throw firstError
    }
  }
  function wireMessages(){if(messageHandler)return;messageHandler=async(event)=>{if(event.origin!==location.origin||event.source!==frame?.contentWindow)return;const msg=event.data||{};if(msg.channel!=='CLARITY_INTERVIEW_V2')return;if(msg.type==='READY'){ready=true;initFrame();return}if(msg.type==='HEIGHT'){const h=Math.max(620,Math.min(1800,Number(msg.payload?.height||0)||800));frame.style.height=`${h}px`;return}if(msg.type==='FATAL'){onFatal?.(msg.payload||{});return}if(msg.type==='ACTION'){const requestId=String(msg.requestId||'');try{const data=await action(String(msg.action||''),msg.payload||{});send('RESPONSE',{requestId,ok:true,data})}catch(error){send('RESPONSE',{requestId,ok:false,error:errorShape(error)})}}};window.addEventListener('message',messageHandler)}
  async function activate(){if(active){initFrame();return}active=true;setStep('module');show('moduleView');const m=mode();const src=FRAME_BY_MODE[m]||FRAME_BY_MODE.chat;const host=shell();host.innerHTML='';frame=document.createElement('iframe');frame.id='interviewModuleFrame';frame.title='CLARITY Interview';frame.src=src;frame.allow='microphone; camera; autoplay; clipboard-read; clipboard-write';frame.referrerPolicy='no-referrer';frame.loading='eager';frame.style.cssText='display:block;width:100%;height:820px;border:0;background:#061326';host.appendChild(frame);wireMessages();frame.addEventListener('load',()=>{ready=false;setTimeout(initFrame,40)});$('startModuleBtn').disabled=true;$('statusBtn').classList.add('hidden')}
  function destroy(){if(messageHandler){window.removeEventListener('message',messageHandler);messageHandler=null}frame?.remove();frame=null;ready=false;active=false}
  return{activate,destroy,refresh(){if(active)send('REFRESH',{token:state.token,runtime:runtime()})},updateToken(){if(active)initFrame()}}
}
