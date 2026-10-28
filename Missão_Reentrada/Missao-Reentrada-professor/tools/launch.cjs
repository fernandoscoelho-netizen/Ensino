const cp=require('node:child_process');const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),runtime=path.join(root,'.runtime'),file=path.join(runtime,'server.json'),url='http://127.0.0.1:'+(Number(process.env.AURORA_PORT)||4173);
async function status(){try{const r=await fetch(url+'/__aurora_status',{signal:AbortSignal.timeout(800)});return await r.json();}catch{return null;}}
(async()=>{
 const live=await status();
 if(process.argv.includes('--stop')){
  if(!fs.existsSync(file)){console.log('Não existe um servidor iniciado por este projeto.');return;}
  const owned=JSON.parse(fs.readFileSync(file,'utf8'));
  if(live?.app!=='missao-reentrada'||live.pid!==owned.pid||live.token!==owned.token){console.log('O servidor guardado já não está ativo.');return;}
  process.kill(owned.pid);fs.unlinkSync(file);console.log('Missão encerrada.');return;
 }
 if(live?.app!=='missao-reentrada'){
  const token=crypto.randomBytes(20).toString('hex');fs.mkdirSync(runtime,{recursive:true});
  const child=cp.spawn(process.execPath,['server.mjs'],{cwd:root,windowsHide:true,detached:true,stdio:'ignore',env:{...process.env,AURORA_INSTANCE_TOKEN:token}});child.unref();
  let ready=null;for(let i=0;i<30;i++){await new Promise(r=>setTimeout(r,200));ready=await status();if(ready?.token===token)break;}
  if(ready?.token!==token){try{process.kill(child.pid);}catch{}throw Error('Não foi possível abrir '+url+'. Verifica se a porta já está em utilização.');}
  fs.writeFileSync(file,JSON.stringify({pid:child.pid,token}));
 }
 console.log('Missão disponível em '+url);
 if(!process.argv.includes('--no-open')&&process.platform==='win32')cp.spawn('cmd.exe',['/c','start','',url],{windowsHide:true,stdio:'ignore'}).unref();
 else console.log('Abre este endereço no navegador.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
