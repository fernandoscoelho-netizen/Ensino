import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./dist',import.meta.url)),port=Number(process.env.AURORA_PORT)||4173;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.pdf':'application/pdf','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8'};
export const server=http.createServer(async(req,res)=>{
 try{
  if(req.url==='/__aurora_status'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({app:'missao-reentrada',pid:process.pid,token:process.env.AURORA_INSTANCE_TOKEN||null}));return;}
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  const data=await readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);
 }catch{if(!res.headersSent)res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Não encontrado');}
}).listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port));
