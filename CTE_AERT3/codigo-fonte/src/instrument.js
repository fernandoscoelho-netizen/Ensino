import {parse} from 'acorn';
import {full} from 'acorn-walk';
export function instrument(source){
 const ast=parse(source,{ecmaVersion:2022,sourceType:'script'}),edits=[],guard=';__cteBudget();';
 full(ast,n=>{
  if(n.type==='CallExpression'&&n.callee.type==='Identifier'&&['eval','Function'].includes(n.callee.name))throw new Error('Usa funções normais; eval e Function não estão disponíveis.');
  if(n.type==='NewExpression'&&n.callee.name==='Function')throw new Error('Construtores de código dinâmico não estão disponíveis.');
  if(n.type==='MemberExpression'&&((n.property.name??n.property.value)==='constructor'))throw new Error('Acesso a constructor não está disponível neste editor.');
  if(['ForStatement','ForInStatement','ForOfStatement','WhileStatement','DoWhileStatement'].includes(n.type)){
   const b=n.body;if(b.type==='BlockStatement')edits.push([b.start+1,guard]);else{edits.push([b.start,'{'+guard]);edits.push([b.end,'}']);}
  }
  if(['FunctionDeclaration','FunctionExpression','ArrowFunctionExpression'].includes(n.type)){
   if(n.body.type==='BlockStatement')edits.push([n.body.start+1,guard]);
   else{edits.push([n.body.start,'(__cteBudget(),(']);edits.push([n.body.end,'))']);}
  }
 });
 for(const [at,text]of edits.sort((a,b)=>b[0]-a[0]))source=source.slice(0,at)+text+source.slice(at);
 return source;
}
