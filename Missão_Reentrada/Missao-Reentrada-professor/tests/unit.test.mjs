import test from 'node:test'; import assert from 'node:assert/strict'; import {instrument} from '../src/preview.js'; import {zipFiles} from '../src/export.js';
function run(code){let count=0;new Function('__guard',instrument(code,'__guard'))(()=>{if(++count>1000)throw Error('limite');});}
test('interrompe ciclos infinitos',()=>{for(const code of ['while(true) {}','for(;;);','do {} while(true);'])assert.throws(()=>run(code),/limite/);});
test('preserva valores e funções',()=>{run('let n=0; for(let i=0;i<10;i++) n+=i; globalThis.__test=n;');assert.equal(globalThis.__test,45);run('const f=x=>x+1; globalThis.__test=f(3);');assert.equal(globalThis.__test,4);delete globalThis.__test;});
test('interrompe recursão',()=>assert.throws(()=>run('function f(){return f();} f();'),/limite/));
test('preserva texto e comentários',()=>{run("const s=\"while(true){}\"; // for(;;)\nglobalThis.__test=s;");assert.equal(globalThis.__test,'while(true){}');delete globalThis.__test;});
test('rejeita erros de sintaxe',()=>assert.throws(()=>instrument('const = ;','__guard'),SyntaxError));
test('exporta ZIP válido',async()=>{const z=zipFiles({'etapa-01/index.html':'Olá, Terra!'});const b=new Uint8Array(await z.arrayBuffer());assert.equal(new DataView(b.buffer).getUint32(0,true),0x04034b50);assert.equal(new DataView(b.buffer).getUint32(b.length-22,true),0x06054b50);});