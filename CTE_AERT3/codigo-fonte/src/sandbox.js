import {instrument} from './instrument.js';
import {validate} from './validation.js';
import p5source from 'p5/lib/p5.min.js?raw';
const escScript=s=>s.replace(/<\/script/gi,'<\\/script');
let assets;
export async function brandData(){if(!assets)assets=Promise.all(['logo-cte.png','rodape.png'].map(async name=>{const b=await(await fetch(`/assets/${name}`)).blob();return new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b);});}));return assets;}
export function safeHTML(html,brands){const doc=new DOMParser().parseFromString(html,'text/html');doc.querySelectorAll('script,iframe,object,embed,base,link,meta,style').forEach(e=>e.remove());for(const el of doc.querySelectorAll('*'))for(const a of [...el.attributes])if(a.name.startsWith('on')||a.name==='srcdoc'||/javascript:/i.test(a.value))el.removeAttribute(a.name);doc.querySelectorAll('img[data-brand]').forEach(e=>{e.src=brands[e.dataset.brand==='logo'?0:1];});return doc.body.innerHTML;}
export async function runCode(host,mission,code,{verify=false,width=800}={}){
 host.replaceChildren();const token=crypto.randomUUID();let js;
 try{js=instrument(code.js);}catch(e){return {rows:[{ok:false,message:`JavaScript: ${e.message}`}],error:e.message};}
 const brands=await brandData(),html=safeHTML(code.html,brands),css=code.css.replace(/<\/style/gi,'');
 const frame=document.createElement('iframe');frame.title=`Pré-visualização ${width}px`;frame.sandbox='allow-scripts';frame.style.width=width+'px';frame.style.height='390px';frame.referrerPolicy='no-referrer';host.append(frame);
 const runtime=`const __cteToken=${JSON.stringify(token)};let __cteTicks=0,__cteStart=performance.now();function __cteReset(){__cteTicks=0;__cteStart=performance.now()}function __cteBudget(){if(++__cteTicks>50000||performance.now()-__cteStart>400)throw new Error('Execução interrompida: verifica ciclos e recursão.')}const __cteSend=(type,data)=>parent.postMessage({cte:__cteToken,type,data},'*');addEventListener('error',e=>__cteSend('error',String(e.message)));addEventListener('unhandledrejection',e=>__cteSend('error',String(e.reason)));for(const type of ['click','keydown','input','pointerdown'])addEventListener(type,__cteReset,true);const __cteRAF=requestAnimationFrame;window.requestAnimationFrame=cb=>__cteRAF(t=>{__cteReset();cb(t)});document.addEventListener('submit',e=>e.preventDefault());`;
 const test=verify?`setTimeout(async()=>{try{__cteReset();const rows=await (${validate.toString()})(${JSON.stringify(mission.id)});__cteSend('result',rows)}catch(e){__cteSend('result',[{ok:false,message:e.message}])}},350);`:`setTimeout(()=>__cteSend('result',[]),100);`;
 const csp="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; media-src 'none'; form-action 'none';";
 return new Promise(resolve=>{
  let error=null,done=false;const timer=setTimeout(()=>finish({rows:[{ok:false,message:'Tempo de execução excedido. Reduz o trabalho feito pelo código.'}],error:'timeout'}),4500);
  function finish(result){if(done)return;done=true;clearTimeout(timer);window.removeEventListener('message',onMessage);resolve(result);}
  function onMessage(e){if(e.source!==frame.contentWindow||e.data?.cte!==token)return;if(e.data.type==='error')error=String(e.data.data).slice(0,500);if(e.data.type==='result'&&Array.isArray(e.data.data)){const rows=e.data.data.filter(r=>typeof r.ok==='boolean'&&typeof r.message==='string');if(error)rows.push({ok:false,message:error});finish({rows,error});}}
  window.addEventListener('message',onMessage);
  frame.srcdoc=`<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${csp}"><style>body{font:16px system-ui;margin:16px;color:#17394b}button{cursor:pointer}img{max-width:100%}${css}</style></head><body>${html}<script>${runtime}<\/script>${mission.id==='p5'?`<script>${escScript(p5source)}<\/script>`:''}<script>${escScript(js)}<\/script><script>${test}<\/script></body></html>`;
 });
}
