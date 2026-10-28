export function validateBank(input){
 if(input?.version!==1||!Array.isArray(input.questions)||input.questions.length>500)throw new Error('O banco deve ter version: 1 e um máximo de 500 perguntas.');
 const ids=new Set();const questions=input.questions.map(q=>{
  if(!q||typeof q.id!=='string'||!/^[-a-zA-Z0-9_]{1,80}$/.test(q.id)||ids.has(q.id))throw new Error('Cada pergunta precisa de um id único válido.');ids.add(q.id);
  if(!Number.isInteger(q.lesson)||q.lesson<1||q.lesson>12)throw new Error('A etapa de cada pergunta deve estar entre 1 e 12.');
  if(typeof q.prompt!=='string'||!q.prompt.trim()||q.prompt.length>2500)throw new Error('Enunciado vazio ou demasiado longo.');
  if(typeof q.explanation!=='string'||!q.explanation.trim()||q.explanation.length>3000)throw new Error('Cada pergunta precisa de uma explicação.');
  if(!Array.isArray(q.choices)||q.choices.length<2||q.choices.length>6)throw new Error('Cada pergunta precisa de 2 a 6 opções.');
  const cids=new Set();const choices=q.choices.map(c=>{if(typeof c.id!=='string'||!/^[-a-zA-Z0-9_]{1,20}$/.test(c.id)||cids.has(c.id)||typeof c.text!=='string'||!c.text.trim()||c.text.length>2000)throw new Error('Opções inválidas na pergunta '+q.id);cids.add(c.id);return{id:c.id,text:c.text};});
  if(!cids.has(q.correct))throw new Error('Resposta correta inexistente em '+q.id);
  return{id:q.id,lesson:q.lesson,prompt:q.prompt,choices,correct:q.correct,explanation:q.explanation,reference:String(q.reference||'').slice(0,500)};
 });
 for(let id=1;id<=12;id++)if(questions.filter(q=>q.lesson===id).length<2)throw new Error('A etapa '+id+' precisa de pelo menos duas perguntas.');
 return{version:1,questions};
}
export function shuffled(input,rng=Math.random){const result=[...input];for(let i=result.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
export function makeRound(bank,lesson,previous=null,rng=Math.random){
 const pool=bank.questions.filter(q=>q.lesson===lesson),unused=pool.filter(q=>!previous?.questionIds.includes(q.id));
 const selected=shuffled(unused.length>=2?unused:pool,rng).slice(0,2);const orders={};for(const q of selected)orders[q.id]=shuffled(q.choices.map(c=>c.id),rng);
 const history=previous?[...(previous.history||[]),{questionIds:previous.questionIds,orders:previous.orders,answers:previous.answers,round:previous.round}].slice(-20):[];
 return{questionIds:selected.map(q=>q.id),orders,answers:{},round:(previous?.round||0)+1,history};
}
export function cleanQuiz(value,bank){
 const result={};if(!value||typeof value!=='object')return result;
 function one(r,lesson){
  if(!r||!Array.isArray(r.questionIds)||r.questionIds.length!==2||new Set(r.questionIds).size!==2)return null;
  const questions=r.questionIds.map(id=>bank.questions.find(q=>q.id===id&&q.lesson===lesson));if(questions.some(q=>!q))return null;
  const orders={},answers={};for(const q of questions){const expected=q.choices.map(c=>c.id),saved=r.orders?.[q.id];orders[q.id]=Array.isArray(saved)&&saved.length===expected.length&&new Set(saved).size===expected.length&&saved.every(id=>expected.includes(id))?[...saved]:expected;
   const a=r.answers?.[q.id];if(a&&expected.includes(a.choice))answers[q.id]={choice:a.choice,at:String(a.at||'').slice(0,50)};
  }
  return{questionIds:[...r.questionIds],orders,answers,round:Math.max(1,Math.min(100000,Number(r.round)||1))};
 }
 for(let lesson=1;lesson<=12;lesson++){const r=one(value[lesson],lesson);if(r){r.history=(Array.isArray(value[lesson].history)?value[lesson].history:[]).slice(-20).map(h=>one(h,lesson)).filter(Boolean);result[lesson]=r;}}
 return result;
}
