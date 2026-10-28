import { parse } from 'acorn';
import { checkLesson } from './lesson-checks.js';
import { runnerBoot } from './runner.js';

export function instrument(source,guardName) {
  if(source.length>100000)throw new Error('O ficheiro JavaScript ultrapassa o limite de 100 000 caracteres.');
  const ast=parse(source,{ecmaVersion:'latest',sourceType:'script'}),edits=[];
  const insert=(at,text)=>edits.push({at,text});
  function walk(n){
    if(!n||typeof n!=='object')return;
    if(['ForStatement','ForInStatement','ForOfStatement','WhileStatement','DoWhileStatement'].includes(n.type)){
      const b=n.body;if(b.type==='BlockStatement')insert(b.start+1,guardName+'();');else{insert(b.start,'{'+guardName+'();');insert(b.end,'}');}
    }
    if(['FunctionDeclaration','FunctionExpression','ArrowFunctionExpression'].includes(n.type)){
      const b=n.body;if(b.type==='BlockStatement')insert(b.start+1,guardName+'();');else{insert(b.start,'('+guardName+'(),(');insert(b.end,'))');}
    }
    for(const [k,v] of Object.entries(n)){if(k==='start'||k==='end')continue;if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')walk(v);}
  }
  walk(ast);edits.sort((a,b)=>b.at-a.at);let out=source;for(const e of edits)out=out.slice(0,e.at)+e.text+out.slice(e.at);return out;
}
export function makePreviewDocument(code,id,validate=false,width=null){
  const nonce=Array.from(crypto.getRandomValues(new Uint8Array(16)),byte=>byte.toString(16).padStart(2,'0')).join('');
  const guardName='__aurora_'+nonce;
  const js=instrument(code.js,guardName);
  const doc=new DOMParser().parseFromString(code.html,'text/html');
  doc.querySelectorAll('script,iframe,object,embed,base,link,meta[http-equiv]').forEach(e=>e.remove());
  doc.querySelectorAll('*').forEach(e=>{for(const a of [...e.attributes])if(a.name.toLowerCase().startsWith('on')||(['href','src','action'].includes(a.name)&&/^\s*javascript:/i.test(a.value)))e.removeAttribute(a.name);});
  const policy=doc.createElement('meta');policy.httpEquiv='Content-Security-Policy';policy.content="default-src 'none'; script-src 'nonce-"+nonce+"' 'unsafe-eval'; style-src 'unsafe-inline'; img-src data: blob:; base-uri 'none'; form-action 'none';";doc.head.prepend(policy);
  const css=doc.createElement('style');css.textContent=code.css;doc.head.append(css);
  const payload=JSON.stringify({id,html:code.html,js,guardName,validate,width:Number(width)||null}).replaceAll('<',String.fromCharCode(92)+'u003c');
  const boot='('+runnerBoot.toString()+')('+checkLesson.toString()+','+payload+');';
  return '<!doctype html>'+doc.documentElement.outerHTML.replace('</body>','<script nonce="'+nonce+'">'+boot+'</script></body>');
}
