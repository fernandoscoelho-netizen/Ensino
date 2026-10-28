// Arranque isolado. A porta de mensagens fica numa closure, fora do código do aluno.
export function runnerBoot(checkLesson, payload) {
  'use strict';
  let port=null,ran=false;
  const nativeTimeout=window.setTimeout.bind(window);
  const errors=[];
  const send=value=>{if(port)port.postMessage(value);};
  window.addEventListener('error',e=>{errors.push(e.message);send({type:'error',message:e.message});});
  window.addEventListener('unhandledrejection',e=>{const message=String(e.reason?.message||e.reason);errors.push(message);send({type:'error',message});});
  window.addEventListener('message',function initialise(e){
    if(ran||e.source!==parent||e.data!=='aurora-init'||!e.ports[0])return;
    ran=true;port=e.ports[0];port.start();
    let operations=0;
    const guard=()=>{if(++operations>20000)throw new Error('Execução interrompida: demasiadas iterações ou chamadas. Revê as condições e executa novamente.');};
    document.addEventListener('submit',e=>e.preventDefault());
    try{new Function(payload.guardName,payload.js)(guard);}catch(e){errors.push(e.message);send({type:'error',message:e.message});}
    nativeTimeout(async()=>{
      if(payload.validate){try{const rows=await checkLesson(payload.id,payload.html,document,window,payload.width);send({type:'result',rows,errors});}catch(e){send({type:'error',message:'Não foi possível concluir a verificação: '+e.message});send({type:'result',rows:[],errors:[e.message]});}}
      else send({type:'ready',errors});
    },40);
  });
}
