import {EditorView,basicSetup} from 'codemirror';
import {html} from '@codemirror/lang-html';
import {css} from '@codemirror/lang-css';
import {javascript} from '@codemirror/lang-javascript';
import {oneDark} from '@codemirror/theme-one-dark';
import {challenges} from '../work/generated/challenges.js';
import {createCockpit} from './cockpit.js';
import {unlockTeacherVault} from './teacher-auth.js';
import {makePreviewDocument} from './preview.js';
import {download,zipFiles} from './export.js';
import defaultBank from './questions.json';
import {validateBank,makeRound,cleanQuiz} from './quiz.js';
import {createAmbientMusic,MUSIC_TITLE} from './ambient-music.js';
import {cleanStudent,isIdentified,sameStudent,studentFileStem,studentInitials} from './student.js';

const $=s=>document.querySelector(s), key='aurora-reentrada-v1';
const resource=file=>new URL(file,new URL(document.documentElement.dataset.resourceBase||'./',location.href)).href;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const defaults=()=>({version:1,current:1,student:{name:'',group:'',number:''},sessionStartedAt:null,firstOpenedAt:null,quiz:{},bank:null,drafts:{},completed:{},notes:{},hints:{},settings:{font:16,code:15,quality:'auto',reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,sound:false,musicVolume:20,explore:false}});
let state=defaults(),storageOK=true,editor,lang='html',busy=false,runSerial=0,activePort=null,activeCancel=null,saveTimer,toastTimer,space=null,cockpit=null,ambient=null,musicBusy=false,exteriorView=false,welcomeAnimation=null,welcomeGeneration=0,welcomeOpen=false,identifiedThisSession=false,teacherSession=null,teacherUntil=0,teacherTimer=null,teacherSensitive=false,teacherLoginBusy=false,teacherLoginGeneration=0,failedTeacherAttempts=0,teacherBlockedUntil=0;
try{const raw=localStorage.getItem(key);if(raw)state=normalise(JSON.parse(raw));}catch{storageOK=false;}
function normalise(v){
 if(v?.version!==1||!v.drafts||typeof v.drafts!=='object')throw new Error('Este ficheiro não é um progresso Aurora válido.');
 const n=defaults();n.student=cleanStudent(v.student);n.sessionStartedAt=typeof v.sessionStartedAt==='string'?v.sessionStartedAt.slice(0,50):null;n.firstOpenedAt=typeof v.firstOpenedAt==='string'?v.firstOpenedAt.slice(0,50):null;n.current=Math.max(1,Math.min(12,Number(v.current)||1));
 for(const c of challenges){const x=v.drafts[c.id];if(x){if(!['html','css','js'].every(k=>typeof x[k]==='string'&&x[k].length<=150000))throw new Error('Código inválido na etapa '+c.id);n.drafts[c.id]={html:x.html,css:x.css,js:x.js};}if(v.completed?.[c.id])n.completed[c.id]=String(v.completed[c.id]);n.notes[c.id]=String(v.notes?.[c.id]||'').slice(0,10000);n.hints[c.id]=Math.max(0,Math.min(3,Number(v.hints?.[c.id])||0));}
 if(v.bank)n.bank=validateBank(v.bank);n.quiz=cleanQuiz(v.quiz,n.bank||defaultBank);
 const s=v.settings||{};n.settings={font:[16,18,20].includes(s.font)?s.font:16,code:[15,16,18,20].includes(s.code)?s.code:15,quality:['auto','low','2d'].includes(s.quality)?s.quality:'auto',reduced:Boolean(s.reduced),sound:Boolean(s.sound),musicVolume:Number.isFinite(s.musicVolume)?Math.max(0,Math.min(100,s.musicVolume)):20,explore:Boolean(s.explore)};return n;
}
function draft(id=state.current){return state.drafts[id]??=structuredClone(challenges[id-1].starter);}
function save(){try{localStorage.setItem(key,JSON.stringify(state));$('#save-label').textContent='Guardado neste navegador';storageOK=true;}catch{storageOK=false;$('#save-label').textContent='Sem gravação local — exporta o trabalho';}}
function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(save,250);}
function explainError(message){const m=String(message);if(/Blocked a frame|cross-origin|localStorage/.test(m))return 'O código tentou aceder a dados fora do painel. Usa document para trabalhar nos elementos deste desafio.';if(/Cannot read properties of null/.test(m))return 'O seletor não encontrou o elemento. Confirma o id, a classe e a existência do elemento no HTML. Detalhe: '+m;if(/Unexpected token|Unexpected character|Unterminated/.test(m))return 'Há um erro de sintaxe. Verifica aspas, parênteses e chavetas. Detalhe: '+m;if(/is not defined/.test(m))return 'Foi utilizado um nome que não está definido. Confirma a variável ou função. Detalhe: '+m;return m;}
function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4500);}
function highest(){let n=1;while(n<12&&state.completed[n])n++;return n;}
function renderNav(){
 $('#mission-list').innerHTML=challenges.map(c=>{const done=Boolean(state.completed[c.id]),locked=!state.settings.explore&&c.id>highest();return '<button class="mission-step '+(c.id===state.current?'active ':'')+(done?'done':'')+'" data-id="'+c.id+'" '+(locked?'disabled ':'')+(c.id===state.current?'aria-current="step"':'')+'><span class="step-number">'+(done?'✓':String(c.id).padStart(2,'0'))+'</span><span><span class="step-label">'+esc(c.title)+'</span><span class="step-meta">'+esc(c.tag)+(locked?' · BLOQUEADO':'')+'</span></span></button>';}).join('');
 $('#mission-list').querySelectorAll('button').forEach(b=>b.onclick=()=>select(Number(b.dataset.id)));
 const count=Object.keys(state.completed).length;$('#progress-text').textContent=count+' / 12 sistemas recuperados';$('#progress-fill').style.width=(count/12*100)+'%';$('#flight-status').textContent=count===12?'Todos os sistemas recuperados':'Interface em recuperação';$('.status-indicator').classList.toggle('amber',count<12);
 updateCockpitTelemetry();renderStudent();
}
function mountEditor(){
 editor?.destroy();$('#editor').replaceChildren();
 const mode=lang==='html'?html():lang==='css'?css():javascript();
 editor=new EditorView({doc:draft()[lang],extensions:[basicSetup,mode,oneDark,EditorView.lineWrapping,EditorView.contentAttributes.of({'aria-label':'Código '+lang.toUpperCase(),spellcheck:'false'}),EditorView.updateListener.of(update=>{if(update.docChanged){draft()[lang]=update.state.doc.toString();if(state.completed[state.current]){delete state.completed[state.current];renderNav();$('#next-btn').hidden=true;$('#next-message').textContent='Código alterado. Volta a validar para confirmar esta etapa.';}scheduleSave();}})],parent:$('#editor')});
 document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.lang===lang)));$('#editor-info').textContent=lang.toUpperCase()+' · UTF-8';
}
async function select(id){
 if(busy)return;stopPreview();state.current=id;lang=id>=8&&id<=11?'js':id>=4&&id<=7?'css':'html';const c=challenges[id-1];draft();
 $('#stage-label').textContent='ETAPA '+String(id).padStart(2,'0')+' / 12 · '+c.tag;$('#challenge-title').textContent=c.title;$('#duration').textContent='◷ '+c.minutes+' min · estimativa';$('#story').textContent=c.story;$('#task').textContent=c.task;$('#objective').textContent=c.objective;$('#extension-text').textContent=c.extension;$('#notes').value=state.notes[id]||'';$('#preview-id').textContent=String(id).padStart(2,'0');$('#sebenta-link').textContent='Sebenta · pp. '+c.pages.join('–')+' ↗';$('#results').hidden=true;$('#hint-box').hidden=true;$('#hint-count').textContent=(state.hints[id]||0)+'/3';$('#next-btn').hidden=!state.completed[id];$('#next-btn').textContent=id===12?'Iniciar regresso à Terra →':'Próxima etapa →';$('#next-message').textContent=state.completed[id]?'Sistema validado. Podes continuar a missão.':'Experimenta, observa e melhora. Podes tentar as vezes que precisares.';$('#preview-width').value='auto';
 renderNav();mountEditor();renderQuiz();save();await execute(false);
}
function stopPreview(){runSerial++;activeCancel?.();activeCancel=null;activePort?.close();activePort=null;$('#frame-mount').replaceChildren();$('#preview-status').textContent='Pré-visualização interrompida. Podes executar novamente.';}
function runFrame(validate,width){
 const serial=++runSerial;activePort?.close();activePort=null;
 const mount=$('#frame-mount');mount.style.width=width==='auto'?'100%':width+'px';const frame=document.createElement('iframe');frame.title='Painel da cápsula — código do aluno';frame.setAttribute('sandbox','allow-scripts');frame.referrerPolicy='no-referrer';
 let src;try{src=makePreviewDocument(draft(),state.current,validate,width);}catch(e){return Promise.resolve({rows:[],errors:['JavaScript: '+e.message]});}
 return new Promise(resolve=>{
  let finished=false;const errors=[];const done=value=>{if(finished)return;finished=true;clearTimeout(timer);activeCancel=null;resolve(value);};
  activeCancel=()=>done({rows:[],errors:['Execução interrompida.']});
  const timer=setTimeout(()=>{frame.remove();done({rows:[],errors:['O painel não respondeu. Revê o código e executa novamente.']});},4000);
  frame.addEventListener('load',()=>{if(serial!==runSerial){done({rows:[],errors:['Execução substituída.']});return;}const channel=new MessageChannel();activePort=channel.port1;activePort.onmessage=e=>{if(serial!==runSerial)return;const m=e.data;if(m.type==='error'){errors.push(String(m.message));$('#preview-status').textContent='Erro: '+explainError(m.message);}if(m.type==='ready'||m.type==='result')done({rows:m.rows||[],errors:[...new Set([...errors,...(m.errors||[])])]});};activePort.start();frame.contentWindow.postMessage('aurora-init','*',[channel.port2]);},{once:true});
  frame.srcdoc=src;mount.replaceChildren(frame);
 });
}
async function execute(validate){
 if(busy)return;busy=true;$('#run-btn').disabled=true;$('#validate-btn').disabled=true;$('#preview-status').textContent=validate?'A verificar o sistema…':'A executar…';save();
 try{
  const id=state.current,widths=validate?(id===7?[1024,768,375]:[id===6?1024:$('#preview-width').value]):[$('#preview-width').value];let rows=[],errors=[];
  for(const w of widths){const r=await runFrame(validate,w);rows.push(...r.rows);errors.push(...r.errors);if(r.errors.length)break;}
  if(validate){
   const passed=rows.length>0&&rows.every(r=>r.ok)&&errors.length===0;
   $('#results').hidden=false;$('#results').innerHTML='<strong>'+(passed?'✓ Sistema recuperado':'Verificação de bordo')+'</strong><ul>'+rows.map(r=>'<li class="'+(r.ok?'pass':'fail')+'">'+(r.ok?'✓ ':'○ ')+esc(r.label)+'</li>').join('')+errors.map(e=>'<li class="fail">⚠ '+esc(explainError(e))+'</li>').join('')+'</ul>';
   if(passed){state.completed[id]=new Date().toISOString();$('#next-btn').hidden=false;$('#next-message').textContent=id===12?'Relatório verificado. O professor apreciará a reflexão.':'Sistema validado. A missão pode avançar.';beep();}else{delete state.completed[id];$('#next-btn').hidden=true;$('#next-message').textContent='Revê os critérios em falta. As pistas e a documentação estão disponíveis.';}
   renderNav();save();
   // A validação clica e muda estados; repõe a execução para exploração manual.
   await runFrame(false,$('#preview-width').value);
  }
  $('#preview-status').textContent=errors.length?'Erro: '+explainError(errors[0]):validate?'Verificação concluída. Painel reposto para exploração.':'Código executado. Experimenta o painel.';
 }finally{busy=false;$('#run-btn').disabled=false;$('#validate-btn').disabled=false;}
}
function beep(){if(!state.settings.sound)return;try{const ctx=new AudioContext(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=660;g.gain.setValueAtTime(.04,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.2);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.2);o.onended=()=>ctx.close();}catch{}}
function modal(title,body){$('#modal-title').textContent=title;$('#modal-body').innerHTML=body;if(!$('#modal').open)$('#modal').showModal();}
function library(){
 const c=challenges[state.current-1];modal('Biblioteca de bordo','<p>Consulta, interpreta e adapta. A sebenta orienta o percurso; a documentação ajuda-te a explorar cada conceito.</p><h3>Etapa '+c.id+' · '+esc(c.title)+'</h3><div class="library-card"><a href="'+resource('sebenta.pdf')+'#page='+c.pages[0]+'" target="_blank" rel="noopener">Abrir sebenta · páginas '+c.pages.join('–')+' ↗</a><small>Capítulo '+esc(c.chapter)+'. Cópia local do documento fornecido pelo professor.</small></div>'+c.docs.map(([t,u])=>'<div class="library-card"><a href="'+esc(u)+'" target="_blank" rel="noopener">'+esc(t)+' ↗</a><small>MDN · documentação prática. Localiza um exemplo, testa uma alteração e explica o resultado.</small></div>').join('')+'<h3>Referências normativas</h3><p><a href="https://html.spec.whatwg.org/" target="_blank" rel="noopener">HTML · WHATWG ↗</a> · <a href="https://www.w3.org/Style/CSS/" target="_blank" rel="noopener">CSS · W3C ↗</a></p><h3>Sem Internet?</h3><p>Os enunciados, as pistas, os exemplos iniciais e a sebenta estão incluídos. As páginas externas precisam de ligação. Para utilizar sem Internet, abre o index.html da cópia local.</p>');
}
function hints(){const id=state.current,n=Math.min(3,(state.hints[id]||0)+1);state.hints[id]=n;$('#hint-count').textContent=n+'/3';$('#hint-box').hidden=false;$('#hint-box').innerHTML='<strong>Pistas de manutenção</strong>'+challenges[id-1].hints.slice(0,n).map((h,i)=>'<p>'+(i+1)+'. '+esc(h)+'</p>').join('');save();}
function settings(){modal('Preferências da consola',
 '<div class="settings-row"><label for="font-setting">Tamanho do texto</label><select id="font-setting">'+[16,18,20].map(n=>'<option '+(state.settings.font===n?'selected':'')+'>'+n+'</option>').join('')+'</select></div>'+
 '<div class="settings-row"><label for="code-setting">Tamanho do código</label><select id="code-setting">'+[15,16,18,20].map(n=>'<option '+(state.settings.code===n?'selected':'')+'>'+n+'</option>').join('')+'</select></div>'+
 '<div class="settings-row"><label for="quality-setting">Ambiente gráfico</label><select id="quality-setting"><option value="auto">3D · normal</option><option value="low">3D · leve</option><option value="2d">2D · sem WebGL</option></select></div>'+
 '<div class="settings-row"><label for="motion-setting">Reduzir movimento</label><input type="checkbox" id="motion-setting" '+(state.settings.reduced?'checked':'')+'></div>'+
 '<div class="settings-row"><label for="sound-setting">Som de confirmação</label><input type="checkbox" id="sound-setting" '+(state.settings.sound?'checked':'')+'></div>'+
 musicSettingsMarkup()+
 '<p>As preferências são guardadas neste navegador. Podes também ampliar o editor ou o painel com o botão ⛶.</p>');
 $('#quality-setting').value=state.settings.quality;
 $('#music-settings-toggle').onclick=toggleMusic;
 $('#music-volume').oninput=e=>{state.settings.musicVolume=Number(e.target.value);ambient?.setVolume(state.settings.musicVolume);$('#music-volume-label').textContent=state.settings.musicVolume+'%';syncMusicUI();scheduleSave();};
 syncMusicUI();
 for(const [selector,k]of [['#font-setting','font'],['#code-setting','code'],['#quality-setting','quality'],['#motion-setting','reduced'],['#sound-setting','sound']])$(selector).onchange=e=>{state.settings[k]=e.target.type==='checkbox'?e.target.checked:['font','code'].includes(k)?Number(e.target.value):e.target.value;applySettings();save();};
}
async function applySettings(){
 document.documentElement.style.setProperty('--font-size',state.settings.font+'px');document.documentElement.style.setProperty('--code-size',state.settings.code+'px');document.body.classList.toggle('reduced-motion',state.settings.reduced);document.body.classList.toggle('mode-2d',state.settings.quality==='2d');cockpit?.setOptions(state.settings);
 if(state.settings.quality==='2d'){space?.setOptions(state.settings);return;}
 try{if(!space){const module=await import('./space.js');space=module.createSpace($('#space-canvas'),state.settings,()=>{state.settings.quality='2d';document.body.classList.add('mode-2d');toast('Vista 2D ativada. Todos os desafios continuam disponíveis.');});}else space.setOptions(state.settings);space?.setView(exteriorView?'exterior':'cockpit');space?.setRecovery(Object.keys(state.completed).length/12);space?.setPaused(welcomeOpen);}catch{document.body.classList.add('mode-2d');toast('Vista 2D ativada neste equipamento.');}
}
function teacherIsUnlocked(){return Boolean(teacherSession&&Date.now()<teacherUntil);}
function refreshTeacherSession(){if(!teacherSession)return;teacherUntil=Date.now()+5*60*1000;clearTimeout(teacherTimer);teacherTimer=setTimeout(()=>lockTeacher({message:true}),5*60*1000);}
function lockTeacher({message=false}={}){
 teacherSession=null;teacherUntil=0;teacherLoginGeneration++;clearTimeout(teacherTimer);teacherTimer=null;
 if(teacherSensitive){teacherSensitive=false;$('#modal-body').replaceChildren();$('#modal-title').textContent='Área do professor bloqueada';}
 if(message&&$('#modal').open){modal('Área do professor bloqueada','<p>A sessão do professor terminou. Introduz novamente a palavra-passe para continuar.</p><button class="primary" id="teacher-reenter">Voltar a autenticar</button>');$('#teacher-reenter').onclick=openTeacherAccess;}
}
function openTeacherAccess(){
 if(teacherIsUnlocked()){teacher();return;}
 lockTeacher();modal('Acesso reservado ao professor','<p>Introduz a palavra-passe do professor para consultar soluções, gerir o banco de perguntas e alterar as opções docentes.</p><form id="teacher-login"><label class="teacher-password-label" for="teacher-password">Palavra-passe do professor</label><input id="teacher-password" type="password" required maxlength="128" autocomplete="off" autofocus><p id="teacher-login-error" class="teacher-login-error" role="alert"></p><button class="primary" type="submit" id="teacher-unlock">Desbloquear área do professor</button></form><p class="teacher-lock-note">A área volta a bloquear ao fechar esta janela ou após cinco minutos de inatividade.</p>');
 const generation=teacherLoginGeneration;
 $('#teacher-login').onsubmit=async e=>{
  e.preventDefault();if(teacherLoginBusy)return;if(Date.now()<teacherBlockedUntil){$('#teacher-login-error').textContent='Aguarda alguns segundos antes de voltar a tentar.';return;}
  teacherLoginBusy=true;$('#teacher-unlock').disabled=true;const input=$('#teacher-password'),password=input.value;
  try{
   const payload=await unlockTeacherVault(password,globalThis.AURORA_TEACHER_VAULT);
   if(generation!==teacherLoginGeneration||!$('#modal').open)return;
   teacherSession=payload;failedTeacherAttempts=0;refreshTeacherSession();input.value='';teacher();
  }catch(error){
   if(generation!==teacherLoginGeneration||!$('#teacher-login-error'))return;
   failedTeacherAttempts++;if(failedTeacherAttempts>=5){teacherBlockedUntil=Date.now()+30000;failedTeacherAttempts=0;}
   $('#teacher-login-error').textContent=error.name==='OperationError'?'Palavra-passe incorreta. Tenta novamente.':error.message||'Não foi possível desbloquear a área.';input.value='';input.focus();
  }finally{teacherLoginBusy=false;if($('#teacher-unlock'))$('#teacher-unlock').disabled=false;}
 };
}
function teacher(){
 if(!teacherIsUnlocked()){openTeacherAccess();return;}
 const c=challenges[state.current-1],solution=teacherSession.solutions[c.id];teacherSensitive=true;
 modal('Área do professor','<div class="teacher-session-bar"><span>✓ Acesso do professor desbloqueado</span><button class="outline" id="teacher-lock">Bloquear agora</button></div><p>Missão complementar à sebenta · TIC MO3 · TEAC. Proposta para iniciantes, ajustável ao ritmo da turma.</p><div class="library-card"><strong>Preparação sugerida</strong><p>Prevê 7–10 aulas de 50 minutos, incluindo demonstração e revisão. Os 365 minutos estimados dos desafios não incluem todas as pausas e discussões. Valida o ritmo com a turma.</p><button class="inline-link" id="teacher-guide">Descarregar guia do professor ↓</button></div><div class="settings-row"><label for="explore-setting">Permitir explorar todas as etapas</label><input type="checkbox" id="explore-setting" '+(state.settings.explore?'checked':'')+'></div><p class="teacher-lock-note">Os materiais foram desbloqueados apenas nesta sessão. Fecha a área ou escolhe Bloquear agora antes de entregar o computador a um aluno.</p><h3>Etapa atual · '+esc(c.title)+'</h3><p>'+esc(c.objective)+'</p><details><summary>Consultar solução de referência</summary><pre>'+esc(solution.html)+'</pre><pre>'+esc(solution.css)+'</pre><pre>'+esc(solution.js)+'</pre><button id="copy-solution" class="outline">Carregar solução no editor</button></details><h3>Avaliação</h3><p>A validação automática verifica requisitos técnicos. A qualidade das escolhas, a autonomia e a reflexão exigem apreciação do professor. As pistas não reduzem a classificação automaticamente.</p>');
 bankTools();$('#teacher-lock').onclick=()=>lockTeacher({message:true});
 $('#teacher-guide').onclick=()=>{if(!teacherIsUnlocked()){openTeacherAccess();return;}const guide=teacherSession.guide.replace('href="../index.html"','href="'+esc(location.href.split('#')[0])+'"');download('guia-professor.html',guide,'text/html;charset=utf-8');};
 $('#explore-setting').onchange=e=>{if(!teacherIsUnlocked()){openTeacherAccess();return;}state.settings.explore=e.target.checked;renderNav();save();};
 $('#copy-solution').onclick=()=>{
  if(!teacherIsUnlocked()){openTeacherAccess();return;}
  modal('Carregar a solução?','<p>Esta ação substitui o código desta etapa. Exporta primeiro o trabalho que pretendes conservar.</p><button class="primary" id="confirm-solution">Substituir pelo exemplo do professor</button>');
  $('#confirm-solution').onclick=()=>{if(!teacherIsUnlocked()){openTeacherAccess();return;}state.drafts[c.id]=structuredClone(teacherSession.solutions[c.id]);delete state.completed[c.id];$('#modal').close();select(c.id);};
 };
}
function exportWork(){if(!isIdentified(state.student)){showWelcome({opening:false});return;}save();modal('Guardar e entregar o trabalho',studentSummary()+'<div class="library-card"><h3>Continuar a missão</h3><p>Guarda um ficheiro JSON com código, progresso, pistas e diário. Importa-o noutro computador para continuar.</p><button class="primary" id="download-json">↓ Descarregar progresso JSON</button></div><div class="library-card"><h3>Entregar o código</h3><p>Um ZIP com os ficheiros HTML, CSS e JavaScript de cada etapa, o diário e o progresso. Os ficheiros podem ser abertos num editor.</p><button class="outline" id="download-zip">↓ Descarregar código ZIP</button></div>');$('#download-json').onclick=()=>{download(studentFileStem(state.student)+'-progresso.json',JSON.stringify(state,null,2));toast('Progresso exportado.');};$('#download-zip').onclick=async()=>{const files={'identificacao.json':JSON.stringify({student:state.student,sessionStartedAt:state.sessionStartedAt,firstOpenedAt:state.firstOpenedAt},null,2),'progresso.json':JSON.stringify(state,null,2),'respostas-perguntas.json':JSON.stringify({quiz:state.quiz},null,2),'LEIA-ME.txt':studentText()+'\n\nMissão REENTRADA. Cada pasta contém index.html, estilo.css e script.js. Abre index.html no navegador. Recursos externos podem necessitar de Internet. O diário deve ser apreciado pelo professor.'};for(const c of challenges){const code=state.drafts[c.id]||c.starter,dir='etapa-'+String(c.id).padStart(2,'0')+'/';const doc=new DOMParser().parseFromString(code.html,'text/html');doc.head.insertAdjacentHTML('beforeend','<link rel="stylesheet" href="estilo.css">');const s=doc.createElement('script');s.src='script.js';doc.body.append(s);files[dir+'index.html']='<!doctype html>'+doc.documentElement.outerHTML;files[dir+'estilo.css']=code.css;files[dir+'script.js']=code.js;files[dir+'diario.txt']=state.notes[c.id]||'';}const blob=zipFiles(files);download(studentFileStem(state.student)+'-trabalho.zip',blob,'application/zip');toast('Código exportado em ZIP.');};}
function reset(){modal('Repor esta etapa?','<p>O código e a validação desta etapa serão substituídos pelo ponto de partida. As restantes etapas mantêm-se. Podes cancelar e exportar primeiro.</p><button class="outline" id="cancel-reset">Cancelar</button> <button class="primary" id="confirm-reset">Repor código inicial</button>');$('#cancel-reset').onclick=()=>$('#modal').close();$('#confirm-reset').onclick=()=>{delete state.drafts[state.current];delete state.completed[state.current];state.hints[state.current]=0;$('#modal').close();select(state.current);};}
function ending(){let stage=0,timer;const phases=[['Reentrada atmosférica','O escudo térmico protege a cápsula durante a descida.'],['Descida controlada','Os paraquedas abrem. A velocidade diminui.'],['Amaragem concluída','Bem-vindo à Terra. A equipa de recuperação está a caminho.']];document.body.classList.add('reentry');function draw(){const [title,text]=phases[stage];modal(title,'<div class="landing"><svg viewBox="0 0 180 150" aria-hidden="true"><path d="M30 55Q90 -15 150 55Z" fill="none" stroke="#79e3ef" stroke-width="2"/><path d="m30 55 48 55m72-55-48 55M90 20v90" stroke="#9db8ce" fill="none"/><path d="m78 110-10 18q22 15 44 0l-10-18Z" fill="#d7e6ee"/><path d="M5 140q20-10 40 0t40 0t40 0t40 0" stroke="#79e3ef" fill="none"/></svg><h3>'+title+'</h3><p>'+text+'</p>'+(stage<2?'<button class="outline" id="skip-ending">Avançar animação</button>':'<p>Exporta o teu código e o relatório para entregar ao professor.</p><button class="primary" id="finish-export">Exportar missão</button>')+'</div>');if(stage<2){$('#skip-ending').onclick=advance;if(!state.settings.reduced)timer=setTimeout(advance,3000);}else $('#finish-export').onclick=exportWork;}
 function advance(){clearTimeout(timer);stage=Math.min(2,stage+1);draw();}draw();$('#modal').addEventListener('close',()=>{clearTimeout(timer);document.body.classList.remove('reentry');},{once:true});}

function currentBank(){return state.bank||defaultBank;}
function renderQuiz(){
 const id=state.current,bank=currentBank();if(!state.quiz[id])state.quiz[id]=makeRound(bank,id);const round=state.quiz[id];
 const questions=round.questionIds.map(qid=>bank.questions.find(q=>q.id===qid));let answered=0,correct=0;
 $('#quiz-questions').innerHTML=questions.map((q,index)=>{const answer=round.answers[q.id];if(answer){answered++;if(answer.choice===q.correct)correct++;}
 return '<fieldset class="quiz-question"><legend><span class="question-number">'+(index+1)+'</span><span>'+esc(q.prompt)+'</span></legend>'+round.orders[q.id].map(cid=>{const choice=q.choices.find(c=>c.id===cid);return '<label class="quiz-choice '+(answer&&cid===q.correct?'quiz-correct ':'')+(answer&&cid===answer.choice&&cid!==q.correct?'quiz-incorrect':'')+'"><input type="radio" name="quiz-'+q.id+'" value="'+esc(cid)+'" '+(answer?.choice===cid?'checked ':'')+(answer?'disabled':'')+'><span>'+esc(choice.text)+'</span></label>';}).join('')+(answer?'<div class="quiz-feedback '+(answer.choice===q.correct?'correct':'review')+'" role="status"><strong>'+(answer.choice===q.correct?'✓ Resposta correta':'↻ Revê este conceito')+'</strong><p>'+esc(q.explanation)+'</p><small>'+esc(q.reference)+'</small></div>':'<button class="outline quiz-check" data-question="'+q.id+'">Verificar resposta</button><span class="quiz-warning" id="warning-'+q.id+'" role="status"></span>')+'</fieldset>';
 }).join('');
 $('#quiz-score').textContent=answered+'/2 respondidas · '+correct+'/2 corretas';$('#quiz-round').textContent='RONDA '+round.round+' · '+bank.questions.filter(q=>q.lesson===id).length+' NO BANCO';
 document.querySelectorAll('.quiz-check').forEach(b=>b.onclick=()=>{const qid=b.dataset.question,checked=document.querySelector('input[name="quiz-'+qid+'"]:checked');if(!checked){$('#warning-'+qid).textContent='Seleciona uma opção antes de verificar.';return;}round.answers[qid]={choice:checked.value,at:new Date().toISOString()};renderQuiz();save();});
}
function newQuestions(){const id=state.current;state.quiz[id]=makeRound(currentBank(),id,state.quiz[id]);renderQuiz();save();toast('Nova ronda sorteada. As respostas anteriores ficaram no histórico.');}
function importBank(file){if(!teacherIsUnlocked()){openTeacherAccess();return;}if(!file)return;if(file.size>3000000){toast('O banco ultrapassa 3 MB.');return;}file.text().then(text=>{if(!teacherIsUnlocked()){openTeacherAccess();return;}const bank=validateBank(JSON.parse(text));modal('Substituir o banco de perguntas?','<p>O novo banco tem '+bank.questions.length+' perguntas. O código e a progressão da missão mantêm-se. As rondas de perguntas serão reiniciadas; exporta primeiro o progresso para conservar o histórico atual.</p><button class="primary" id="confirm-bank">Aplicar banco de perguntas</button>');$('#confirm-bank').onclick=()=>{if(!teacherIsUnlocked()){openTeacherAccess();return;}state.bank=bank;state.quiz={};renderQuiz();save();$('#modal').close();toast('Banco de perguntas atualizado.');};}).catch(e=>toast('Banco recusado: '+e.message));}
function bankTools(){
 if(!teacherIsUnlocked())return;
 const host=$('#modal-body');const section=document.createElement('section');section.innerHTML='<h3>Banco de perguntas</h3><p>'+currentBank().questions.length+' perguntas · duas por ronda e por etapa. As opções também são baralhadas. A ronda mantém-se ao atualizar a página.</p><button class="outline" id="bank-download">↓ Exportar banco JSON</button> <button class="outline" id="bank-import">↑ Carregar banco JSON</button><input type="file" id="bank-file" accept=".json,application/json" hidden><p>Para editar, altera o JSON e volta a carregá-lo. Cada pergunta tem id, lesson, prompt, choices, correct, explanation e reference. Inclui pelo menos duas perguntas por etapa. As respostas corretas são distribuídas com a aplicação; este recurso destina-se à prática formativa.</p>';host.append(section);$('#bank-download').onclick=()=>{if(!teacherIsUnlocked()){openTeacherAccess();return;}download('aurora-banco-perguntas.json',JSON.stringify(currentBank(),null,2));};$('#bank-import').onclick=()=>$('#bank-file').click();$('#bank-file').onchange=e=>importBank(e.target.files[0]);
}
$('#quiz-new').onclick=newQuestions;

function musicSettingsMarkup(){return '<section class="music-settings"><h3>Música ambiente</h3><p><strong>'+MUSIC_TITLE+'</strong> · acordes lentos, reverberação suave e notas espaçadas. Sem voz ou percussão.</p><button class="outline" id="music-settings-toggle" aria-pressed="false">Ligar música</button><div class="music-volume-row"><label for="music-volume">Volume da música</label><output id="music-volume-label" for="music-volume">'+state.settings.musicVolume+'%</output></div><input id="music-volume" type="range" min="0" max="100" step="1" value="'+state.settings.musicVolume+'"><p id="music-status" role="status"></p><small>A música começa quando a ligas e pausa ao sair deste separador. Funciona sem Internet.</small></section>';}
function syncMusicUI(){
 const playing=Boolean(ambient?.playing),button=$('#music-toggle');
 button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',playing?'Desligar música ambiente':'Ligar música ambiente');button.title=(playing?'Desligar':'Ligar')+' música ambiente · '+MUSIC_TITLE;button.dataset.audioState=playing?'playing':'stopped';button.disabled=musicBusy;$('#music-label').textContent=playing?'Música ligada':'Música';
 if($('#music-settings-toggle')){$('#music-settings-toggle').textContent=playing?'Desligar música':'Ligar música';$('#music-settings-toggle').setAttribute('aria-pressed',String(playing));$('#music-settings-toggle').disabled=musicBusy;$('#music-status').textContent=playing?'A tocar: '+MUSIC_TITLE+' · volume '+state.settings.musicVolume+'%.':'Música desligada. Escolhe Ligar música para começar.';}
}
async function toggleMusic(){
 if(musicBusy)return;
 if(ambient?.playing){ambient.stop();syncMusicUI();return;}
 musicBusy=true;syncMusicUI();
 try{if(!ambient)ambient=createAmbientMusic({volume:state.settings.musicVolume,onState:syncMusicUI});ambient.setVolume(state.settings.musicVolume);await ambient.start();}catch(e){toast(e.message||'Não foi possível iniciar a música neste navegador.');}finally{musicBusy=false;syncMusicUI();}
}
$('#music-toggle').onclick=toggleMusic;
document.addEventListener('visibilitychange',()=>{if(document.hidden)ambient?.stop();});


function studentSummary(){const s=state.student;return '<div class="student-summary"><strong>'+esc(s.name)+'</strong><span>Turma '+esc(s.group)+(s.number?' · N.º '+esc(s.number):'')+'</span></div>';}
function studentText(){const s=state.student;return 'Aluno: '+s.name+'\nTurma: '+s.group+(s.number?'\nNúmero: '+s.number:'')+'\nSessão iniciada: '+(state.sessionStartedAt||'');}
function renderStudent(){const s=state.student;$('#student-avatar').textContent=studentInitials(s);$('#student-avatar').setAttribute('aria-label',isIdentified(s)?'Identificação do aluno: '+s.name:'Identificar aluno');$('#student-name').textContent=s.name||'Aluno por identificar';$('#student-group').textContent=s.group?'Turma '+s.group+(s.number?' · N.º '+s.number:''):'Identifica-te para registar o trabalho.';}
function hasWork(){return Object.keys(state.completed).length>0||Object.values(state.notes).some(n=>String(n).trim())||Object.entries(state.drafts).some(([id,code])=>['html','css','js'].some(k=>code[k]!==challenges[Number(id)-1]?.starter[k]));}
function cleanupOpening(){welcomeGeneration++;welcomeAnimation?.dispose();welcomeAnimation=null;space?.setPaused(false);cockpit?.setPaused(false);$('#modal').classList.remove('welcome-dialog');}
function commitStudent(student,fresh=false){
 if(fresh){const bank=state.bank,settings={...state.settings,explore:false};state=defaults();state.bank=bank;state.settings=settings;}
 state.student=student;state.sessionStartedAt=new Date().toISOString();state.firstOpenedAt??=state.sessionStartedAt;identifiedThisSession=true;welcomeOpen=false;cleanupOpening();$('#close-modal').hidden=false;$('#modal').close();renderStudent();save();select(state.current);
}
function confirmStudentChange(student){
 cleanupOpening();modal('Confirmar a identificação','<p>O trabalho guardado está identificado como <strong>'+esc(state.student.name)+'</strong>, turma '+esc(state.student.group)+'.</p><p>Se é outro aluno, exporta o trabalho anterior e começa uma nova missão. Se estás apenas a corrigir os dados, podes manter este trabalho.</p><div class="profile-actions"><button class="outline" id="profile-export-old">Exportar trabalho anterior</button><button class="outline" id="profile-correct">Corrigir dados e manter trabalho</button><button class="primary" id="profile-new">Começar nova missão</button><button class="text-button" id="profile-back">Voltar</button></div>');$('#close-modal').hidden=!identifiedThisSession;$('#profile-export-old').onclick=()=>download(studentFileStem(state.student)+'-progresso.json',JSON.stringify(state,null,2));$('#profile-correct').onclick=()=>commitStudent(student);$('#profile-new').onclick=()=>commitStudent(student,true);$('#profile-back').onclick=()=>showWelcome({opening:false});
}
function showWelcome({opening=false}={}){
 cleanupOpening();welcomeOpen=true;space?.setPaused(true);cockpit?.setPaused(true);const s=state.student;
 const visual=opening?'<div class="opening-scene" id="opening-scene"><div class="opening-stars"></div><svg class="opening-fallback" viewBox="0 0 700 220" aria-hidden="true"><circle cx="570" cy="300" r="235" fill="#295f83"/><path d="M317 115 334 65Q350 25 366 65l17 50q-33 15-66 0" fill="#dbe8ee"/><path d="M317 115q33 15 66 0l4 13q-37 15-74 0Z" fill="#152a3e"/><path d="M330 76h11v9h-11m29-9h11v9h-11" fill="#1b617d"/></svg><canvas id="opening-canvas" aria-hidden="true"></canvas><div class="opening-caption"><span class="live-dot"></span><span id="opening-status">Aproximação à cápsula Aurora…</span></div><button id="intro-skip" type="button" class="outline">Saltar animação</button></div>':'';
 modal(opening?'Bem-vindo à missão':'Identificação do aluno',visual+'<div class="welcome-copy"><div class="eyebrow">CÁPSULA AURORA · TERMINAL DO OPERADOR</div><h3>Identifica-te para entrar a bordo.</h3><p>Estes dados identificam o teu progresso e os ficheiros que entregas ao professor.</p>'+(hasWork()&&!isIdentified(s)?'<p class="anonymous-work">Existe trabalho local sem identificação. Será associado aos dados que indicares.</p>':'')+'<form id="student-form"><div class="student-field"><label for="student-input-name">Nome do aluno</label><input id="student-input-name" name="student-name" autofocus required minlength="2" maxlength="80" autocomplete="name" value="'+esc(s.name)+'" placeholder="O teu nome"></div><div class="student-fields-row"><div class="student-field"><label for="student-input-group">Turma</label><input id="student-input-group" name="student-group" required maxlength="40" value="'+esc(s.group)+'" placeholder="Ex.: TEAC 1"></div><div class="student-field"><label for="student-input-number">N.º na turma <span>(opcional)</span></label><input id="student-input-number" name="student-number" inputmode="numeric" pattern="[0-9]{1,6}" maxlength="6" value="'+esc(s.number)+'" placeholder="Ex.: 12"></div></div><button class="primary" type="submit" id="enter-mission">'+(opening?'Entrar na cápsula →':'Guardar identificação')+'</button></form><p class="identity-local-note">Registo local neste navegador. Exporta o progresso no fim da aula.</p></div>');
 $('#modal').classList.add('welcome-dialog');$('#close-modal').hidden=!identifiedThisSession;
 $('#student-form').onsubmit=e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;const student=cleanStudent({name:$('#student-input-name').value,group:$('#student-input-group').value,number:$('#student-input-number').value});if(!isIdentified(student))return;if(isIdentified(state.student)&&!sameStudent(state.student,student)&&hasWork())confirmStudentChange(student);else commitStudent(student);};
 if(opening){const generation=welcomeGeneration;let skipped=false;const ready=()=>{if(!$('#opening-status'))return;$('#opening-status').textContent='Cápsula Aurora pronta. Identifica-te para entrar.';$('#intro-skip').hidden=true;};$('#intro-skip').onclick=()=>{skipped=true;welcomeAnimation?.skip();ready();};import('./space.js').then(module=>{if(!welcomeOpen||generation!==welcomeGeneration||!$('#opening-canvas'))return;welcomeAnimation=module.createOpening($('#opening-canvas'),{...state.settings,reduced:state.settings.reduced||skipped},ready);if(welcomeAnimation.supported)$('#opening-scene').classList.add('opening-has-3d');}).catch(ready);}
}
function updateCockpitTelemetry(){const count=Object.keys(state.completed).length;$('#hud-systems').textContent=count+'/12';$('#hud-systems-bar').style.width=(count/12*100)+'%';$('#hud-comms').textContent=state.completed[8]?'LIGAÇÃO ATIVA':'EM ESPERA';$('#hud-route').textContent=state.completed[10]?'CONFIRMADA':'POR VALIDAR';$('#hud-comms-card').classList.toggle('recovered',Boolean(state.completed[8]));$('#hud-route-card').classList.toggle('recovered',Boolean(state.completed[10]));space?.setRecovery(count/12);}
$('#student-avatar').onclick=()=>showWelcome({opening:false});$('#student-edit').onclick=()=>showWelcome({opening:false});
$('#view-toggle').onclick=()=>{exteriorView=!exteriorView;document.body.classList.toggle('exterior-view',exteriorView);$('#view-toggle').textContent=exteriorView?'◈ Vista da cabine':'◈ Vista exterior';$('#view-toggle').setAttribute('aria-pressed',String(exteriorView));space?.setView(exteriorView?'exterior':'cockpit');};
$('#modal').addEventListener('cancel',e=>{if(welcomeOpen&&!identifiedThisSession)e.preventDefault();});
$('#modal').addEventListener('close',()=>{if(welcomeOpen){welcomeOpen=false;cleanupOpening();}$('#close-modal').hidden=false;});

$('#run-btn').onclick=()=>execute(false);$('#validate-btn').onclick=()=>execute(true);$('#stop-btn').onclick=stopPreview;$('#hint-btn').onclick=hints;$('#reset-btn').onclick=reset;$('#library-nav').onclick=library;$('#lesson-doc').onclick=library;$('#mission-nav').onclick=()=>$('#workspace').focus();$('#teacher-nav').onclick=openTeacherAccess;$('#settings-btn').onclick=settings;$('#close-modal').onclick=()=>$('#modal').close();$('#sebenta-link').onclick=()=>window.open(resource('sebenta.pdf')+'#page='+challenges[state.current-1].pages[0],'_blank','noopener');$('#export-btn').onclick=exportWork;$('#import-btn').onclick=()=>$('#import-file').click();$('#preview-width').onchange=()=>execute(false);$('#notes').oninput=e=>{state.notes[state.current]=e.target.value;scheduleSave();};
$('#import-file').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>12000000)throw new Error('O ficheiro ultrapassa 12 MB.');const next=normalise(JSON.parse(await f.text()));modal('Importar progresso?','<p>O progresso importado vai substituir o que está neste navegador. Exporta primeiro o trabalho atual se precisares de o conservar.</p><button class="primary" id="confirm-import">Importar e continuar</button>');$('#confirm-import').onclick=()=>{state=next;save();applySettings();$('#modal').close();select(state.current);toast('Progresso recuperado.');};}catch(err){toast('Importação recusada: '+err.message);}e.target.value='';};
$('#next-btn').onclick=()=>state.current===12?ending():select(state.current+1);
for(const [selector,panel]of [['#expand-editor','.editor-panel'],['#expand-preview','.preview-panel']])$(selector).onclick=()=>{const e=$(panel);e.classList.toggle('expanded');$(selector).setAttribute('aria-label',e.classList.contains('expanded')?'Reduzir painel':'Ampliar painel');};
document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{lang=b.dataset.lang;mountEditor();});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();execute(false);}if(e.key==='Escape')document.querySelectorAll('.expanded').forEach(x=>x.classList.remove('expanded'));});
window.addEventListener('pagehide',()=>{lockTeacher();save();ambient?.dispose();cockpit?.dispose();space?.dispose();});
$('#modal').addEventListener('close',()=>lockTeacher());
for(const event of ['pointerdown','keydown'])$('#modal').addEventListener(event,()=>{if(teacherIsUnlocked())refreshTeacherSession();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)lockTeacher();});
async function initialise(){cockpit=createCockpit($('#flight-deck'),state.settings);syncMusicUI();await select(state.current);await applySettings();renderStudent();showWelcome({opening:true});if(!storageOK)toast('A gravação local não está disponível. Exporta o progresso regularmente.');}
initialise().catch(error=>toast('Não foi possível iniciar a consola: '+error.message));
