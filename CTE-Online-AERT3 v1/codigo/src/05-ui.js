/* =========================================================
   CTE Online · estado, interface e terminal
   ========================================================= */
const KEY = 'cte-online-v1', KEY_FX = 'cte-online-fx';
const PALETAS = {
  camisola: ['#E2A82C', '#1F3D50', '#B3392A', '#3F8F6B', '#6B4FA0', '#F4F6F7'],
  cabelo: ['#1b120c', '#4a2d1a', '#8a5a2b', '#d9b26b', '#9a9a9a'],
  pele: ['#f3d2b8', '#e2b48f', '#c68e63', '#a0693f', '#7a4a2a', '#4e2f1c']
};
const novoEstado = () => ({ v: 1, nome: '', av: { camisola: '#E2A82C', cabelo: '#2b1d14', pele: '#c68e63' }, qual: 'normal', reduzir: false, unlockAll: false, pin: '', lv: {}, cel: {} });
function ler(k) { try { const t = localStorage.getItem(k); return t ? JSON.parse(t) : null; } catch (e) { return null; } }
function escrever(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
let S = (() => { const o = ler(KEY); return o && o.v === 1 ? Object.assign(novoEstado(), o) : novoEstado(); })();
let FX = ler(KEY_FX) || { snaps: {}, luzes: {} };
let tGuardar, tGuardarFx;
const guardar = () => { clearTimeout(tGuardar); tGuardar = setTimeout(() => escrever(KEY, S), 250); };
const guardarFx = () => { clearTimeout(tGuardarFx); tGuardarFx = setTimeout(() => escrever(KEY_FX, FX), 600); };
const ls = id => S.lv[id] || (S.lv[id] = { done: false, att: 0, hints: 0, expl: '', code: null, vals: null, blanks: null });

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const missao = id => MISSOES.find(m => m.id === id);

let audioCtx = null;
function som(tipo) {
  if (S.semSom) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notas = tipo === 'sala' ? [523, 659, 784, 1047] : tipo === 'erro' ? [220, 196] : [660, 880];
    notas.forEach((f, i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain(), t = audioCtx.currentTime + i * 0.11;
      o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.08, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t + 0.3);
    });
  } catch (e) {}
}

const UI = {
  modo: 'inicio', reduzir: !!S.reduzir, imgLogo: null, terminalAberto: false, verSala: false, cur: null,

  feito: id => !!(S.lv[id] && S.lv[id].done),
  funciona(m) { return UI.feito(m.levels[0].id) && UI.feito(m.levels[1].id); },
  completa(m) { return m.levels.every(L => UI.feito(L.id)); },
  explica(m) { return m.levels.filter(L => S.lv[L.id] && (S.lv[L.id].expl || '').trim().length >= 40).length >= 2; },
  desbloqueada(mid) {
    if (S.unlockAll || mid === 'tut') return true;
    if (mid === 'm1') return UI.feito('tut1');
    if (mid === 'extra') return UI.funciona(M3);
    if (mid === 'final') return PRINCIPAIS.every(m => UI.funciona(m));
    const i = PRINCIPAIS.findIndex(m => m.id === mid);
    return i > 0 && UI.funciona(PRINCIPAIS[i - 1]);
  },
  estadoSala(mid) { const m = missao(mid); return UI.completa(m) ? 'ligada' : UI.desbloqueada(mid) ? 'disponivel' : 'bloqueada'; },
  nivelAberto(m, j) { return S.unlockAll || m.extra || j === 0 || UI.feito(m.levels[j - 1].id); },
  contagem() { let n = 0; PRINCIPAIS.forEach(m => m.levels.forEach(L => { if (UI.feito(L.id)) n++; })); return n; },
  msgBloqueio(mid) {
    if (mid === 'm1') return 'Conclui primeiro o tutorial, no terminal da entrada.';
    if (mid === 'extra') return 'O Lab Apoio 3.1 abre quando concluíres os níveis 1 e 2 da Sala E3.';
    if (mid === 'final') return 'O centro de controlo abre quando todas as salas tiverem os níveis 1 e 2 concluídos.';
    const i = PRINCIPAIS.findIndex(m => m.id === mid);
    return `Conclui os níveis 1 e 2 da ${PRINCIPAIS[i - 1].sala} para abrir esta sala.`;
  },

  toast(msg) { $('#toastTxt').textContent = msg; bootstrap.Toast.getOrCreateInstance($('#toast')).show(); },
  mostrarSala(nome) { $('#hudSala').textContent = nome || ''; },
  mostrarInteracao(it) {
    const box = $('#interacao');
    if (!it || UI.modo !== 'jogo') { box.hidden = true; return; }
    const m = missao(it.mid), st = UI.estadoSala(it.mid);
    $('#intT1').textContent = st === 'bloqueada' ? 'Terminal bloqueado' : 'Terminal · ' + m.title;
    $('#intT2').textContent = st === 'bloqueada' ? UI.msgBloqueio(it.mid) : (m.final ? 'Desafio final' : m.extra ? 'Desafios extra' : m.n ? 'Missão ' + m.n + ' · ' + m.learn : 'Tutorial');
    box.hidden = false;
  },
  atualizarHud() {
    const n = UI.contagem();
    $('#hudNome').textContent = S.nome || 'Aluno';
    $('#hudProg').textContent = `${n} de 24 níveis${UI.feito('final1') ? ' · final feito' : ''}`;
    $('#hudBarra').style.width = (n / 24 * 100) + '%';
    Mundo.atualizarSalas();
    if (UI.modo === 'planta') { if (Mapa2D.aba === 'ligacoes') Mapa2D.verificar(); Mapa2D.lateral(); Mapa2D.desenhar(); }
  },

  /* ---------- modos ---------- */
  entrar(modo) {
    S.nome = $('#iNome').value.trim(); S.qual = $('#iQual').value; S.reduzir = $('#iReduzir').checked; UI.reduzir = S.reduzir; guardar();
    $('#inicio').hidden = true;
    if (modo === 'planta' || !Mundo.pronto) return UI.abrirPlanta();
    UI.modo = 'jogo'; Mundo.vista = null; Mundo.olhar = null; Mundo.pausa = false;
    ['#hudEsq', '#hudDir', '#minimapa'].forEach(s => $(s).hidden = false);
    if (document.body.classList.contains('toque')) $('#toque').hidden = false;
    UI.atualizarHud();
    $('#mundo').focus({ preventScroll: true });
    if (!S.visto) { S.visto = true; guardar(); setTimeout(() => UI.toast('Entra no edifício e usa o terminal da entrada.'), 600); }
  },
  abrirPlanta() {
    UI.modoAntes = UI.modo === 'planta' ? UI.modoAntes : UI.modo;
    UI.modo = 'planta'; Mundo.pausa = true; $('#interacao').hidden = true;
    $('#btnFecharPlanta').hidden = !Mundo.pronto;
    ['#hudEsq', '#hudDir', '#minimapa'].forEach(s => $(s).hidden = true);
    $('#toque').hidden = !document.body.classList.contains('toque');
    Mapa2D.abrir();
  },
  fecharPlanta() {
    if (!Mundo.pronto) return;
    $('#planta').hidden = true; UI.modo = 'jogo'; Mundo.pausa = UI.terminalAberto; Mundo.cIni = false;
    ['#hudEsq', '#hudDir', '#minimapa'].forEach(s => $(s).hidden = false);
    if (document.body.classList.contains('toque')) $('#toque').hidden = false;
    $('#mundo').focus({ preventScroll: true });
  },

  /* ---------- terminal ---------- */
  abrirTerminal(mid, li) {
    const m = missao(mid);
    if (!UI.desbloqueada(mid)) { UI.toast(UI.msgBloqueio(mid)); som('erro'); return; }
    if (li == null) { li = m.extra ? -1 : m.levels.findIndex(L => !UI.feito(L.id)); if (li < 0 && !m.extra) li = 0; }
    if (li >= 0 && !UI.nivelAberto(m, li)) li = 0;
    UI.cur = { m, L: li >= 0 ? m.levels[li] : null, file: null, tel: UI.cur && UI.cur.tel };
    if (UI.cur.L) UI.cur.file = UI.cur.L.editable[0];
    UI.renderTerminal();
    Mundo.pausa = true; Mundo.focar(mid);
    UI.terminalAberto = true; UI.verSala = false; $('#vistaSala').hidden = true; $('#interacao').hidden = true; $('#minimapa').hidden = true; $('#toque').hidden = true;
    const oc = bootstrap.Offcanvas.getOrCreateInstance($('#terminal'));
    oc.show();
    UI.ajustarFaixa();
  },
  ajustarFaixa() {
    if (!UI.terminalAberto || UI.verSala) { Mundo.setFaixa(0); return; }
    const w = window.innerWidth, pw = $('#terminal').getBoundingClientRect().width || Math.min(1180, w * 0.74);
    Mundo.setFaixa(w >= 1280 && UI.modo !== 'planta' ? Math.max(0, Math.round(w - pw)) : 0);
  },
  fecharTerminal() {
    UI.terminalAberto = false; Mundo.setFaixa(0); Mundo.focar(null); Mundo.olhar = null;
    $('#vistaSala').hidden = true;
    if (UI.modo === 'jogo') { Mundo.pausa = false; $('#minimapa').hidden = false; if (document.body.classList.contains('toque')) $('#toque').hidden = false; $('#mundo').focus({ preventScroll: true }); UI.mostrarInteracao(Mundo.foco); }
    if (UI.modo === 'planta') { if (document.body.classList.contains('toque')) $('#toque').hidden = false; Mapa2D.desenhar(); }
  },

  renderTerminal() {
    const { m, L } = UI.cur;
    $('#tEyebrow').textContent = (m.final ? 'Desafio final' : m.extra ? 'Desafios extra' : m.n ? 'Missão ' + m.n : 'Tutorial') + ' · ' + m.sala;
    $('#tTitulo').textContent = m.title;
    const rotulo = (X, j) => m.extra ? X.tema : m.final ? 'Desafio final' : m.n === 0 ? 'Tutorial' : { explorar: 'Explorar', completar: 'Completar', construir: 'Construir', desafio: 'Desafio' }[X.kind];
    $('#tNiveis').innerHTML = (m.extra ? `<button class="nivel" data-acao="nivel" data-l="-1" aria-current="${!L}">Todos</button>` : '') + m.levels.map((X, j) => {
      const ab = UI.nivelAberto(m, j);
      return `<button class="nivel${UI.feito(X.id) ? ' feito' : ''}" data-acao="nivel" data-l="${j}" ${ab ? '' : 'disabled title="Conclui o nível anterior"'} aria-current="${X === L}"><span class="pt">${UI.feito(X.id) ? '✓' : j + 1}</span>${esc(rotulo(X, j))}</button>`;
    }).join('');
    if (!L) return UI.renderEscolhaExtra();
    const s = ls(L.id);
    const tabs = L.editable.map(f => ({ id: f, label: f === 'html' ? 'HTML' : f === 'css' ? 'CSS' : 'JavaScript', ro: false }));
    if (L.base && L.base.html && !L.editable.includes('html')) tabs.push({ id: 'ro-html', label: 'HTML', ro: true });
    if (L.base && L.base.css && !L.editable.includes('css')) tabs.push({ id: 'ro-css', label: 'CSS', ro: true });
    const auto = L.kind === 'explorar' || !L.editable.includes('js');
    const tipo = m.final ? 'Transferir o que aprendeste' : m.extra ? 'Desafio extra · ' + L.tema : 'Nível ' + (L.index + 1) + ' · ' + ({ explorar: 'Explorar', completar: 'Completar', construir: 'Construir', desafio: 'Desafio' }[L.kind]);
    $('#tCorpo').innerHTML = `<div class="bancada">
      <section class="painel p-missao" aria-label="Missão">
        <div class="painel-h"><span class="ttl">Missão</span><span class="tipo">${esc(tipo)}</span></div>
        <div class="painel-b">
          <h3>${esc(L.title)}</h3>
          <p><strong>Situação.</strong> ${fmt(L.sit)}</p>
          <p class="objetivo"><strong>Objetivo.</strong> ${fmt(L.obj)}</p>
          <div><h4 class="lbl">Requisitos</h4><ul class="reqs" id="tReqs">${L.req.map(r => `<li class="${s.done ? 'ok' : ''}"><span class="mk"></span><span>${fmt(r)}</span></li>`).join('')}</ul></div>
          <div id="tFeedback" class="feedback" role="status" aria-live="polite"></div>
          <div id="tSucesso"></div>
          <div class="pistas"><h4 class="lbl mb-0">Pistas${L.kind === 'desafio' ? ' · no desafio só há uma' : ''}</h4><div id="tPistas" class="pistas"></div><button class="btn btn-outline-primary btn-sm justify-self-start" style="justify-self:start" id="tPistaBtn" data-acao="pista"></button></div>
        </div>
      </section>
      <section class="painel p-codigo" aria-label="Código">
        <div class="painel-h"><span class="ttl">Código</span><div class="abas" role="tablist">${tabs.map(t => `<button class="aba" role="tab" data-acao="aba" data-f="${t.id}" aria-selected="${t.id === UI.cur.file}">${t.label}${t.ro ? ' <span class="ro">· só leitura</span>' : ''}</button>`).join('')}</div></div>
        <div class="painel-b" id="tCodigo"></div>
        <div class="acoes">
          <button class="btn btn-outline-primary btn-sm" data-acao="executar">Executar</button>
          <button class="btn btn-primary btn-sm" data-acao="testar" id="tTestar">Testar</button>
          ${L.kind === 'explorar' ? '' : '<button class="btn btn-link btn-sm text-secondary" data-acao="repor" id="tRepor">Repor código</button>'}
          <span class="dica">${auto ? 'O resultado atualiza enquanto escreves.' : 'O JavaScript corre quando carregas em Executar (Ctrl + Enter).'}</span>
        </div>
      </section>
      <section class="painel p-resultado" aria-label="Resultado">
        <div class="painel-h"><span class="ttl">Resultado</span><div class="seg" role="group" aria-label="Largura"><button data-acao="largura" data-w="largo" aria-pressed="${!UI.cur.tel}">Largo</button><button data-acao="largura" data-w="tel" aria-pressed="${!!UI.cur.tel}">Telemóvel</button></div></div>
        <div class="palco${UI.cur.tel ? ' tel' : ''}" id="tPalco"><iframe id="tPreview" sandbox="allow-scripts allow-forms" title="Resultado do teu código"></iframe></div>
        <div class="consola"><div class="consola-h">Consola</div><ol id="tConsola"><li class="c-vazio">Sem mensagens.</li></ol></div>
      </section>
    </div>`;
    UI.renderCodigo(); UI.renderPistas();
    if (s.done) UI.mostrarSucesso(false);
    UI.executar();
  },
  renderEscolhaExtra() {
    const m = UI.cur.m;
    $('#tCorpo').innerHTML = `<div class="painel"><div class="painel-b">
      <h3 class="h5 fw-bold mb-0">Seis desafios curtos, um de cada tema</h3>
      <p class="mb-0 text-secondary">São opcionais e podes fazê-los por qualquer ordem. Cada um vale a distinção «Curioso».</p>
      <div class="escolha-extra">${m.levels.map((X, j) => `<button class="${UI.feito(X.id) ? 'feito' : ''}" data-acao="nivel" data-l="${j}"><span class="eyebrow">${esc(X.tema)}${UI.feito(X.id) ? ' · feito' : ''}</span><strong>${esc(X.title)}</strong><span class="small text-secondary">${esc(X.obj)}</span></button>`).join('')}</div>
    </div></div>`;
  },

  valsDe(L) { const v = {}; L.controls.forEach(c => { v[c.id] = c.value; }); const s = ls(L.id); if (s.vals) Object.assign(v, s.vals); return v; },
  codigoAtual(L) {
    const s = ls(L.id), f = L.editable[0];
    if (L.kind === 'explorar') return { [f]: L.template(UI.valsDe(L)) };
    if (L.kind === 'completar') return { [f]: fillBlanks(L.code, s.blanks || {}) };
    const c = {}; L.editable.forEach(k => { c[k] = (s.code && s.code[k] != null) ? s.code[k] : (L.starter[k] || ''); });
    return c;
  },
  renderCodigo() {
    const { L } = UI.cur, s = ls(L.id), el = $('#tCodigo');
    let h = '';
    L.editable.forEach(f => {
      h += `<div class="vista-cod" data-vista="${f}" ${f === UI.cur.file ? '' : 'hidden'}>`;
      if (L.kind === 'explorar') {
        const v = UI.valsDe(L);
        h += `<div class="controlos">${L.controls.map(c => {
          if (c.type === 'select') return `<label class="ctl"><span>${esc(c.label)}</span><select id="c-${c.id}" data-c="${c.id}">${c.options.map(o => `<option value="${esc(o)}" ${String(v[c.id]) === String(o) ? 'selected' : ''}>${o === '' ? '(vazio)' : esc(o)}</option>`).join('')}</select></label>`;
          if (c.type === 'range') return `<label class="ctl"><span>${esc(c.label)} <output id="o-${c.id}">${esc(v[c.id])}${c.unit || ''}</output></span><input type="range" id="c-${c.id}" data-c="${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${esc(v[c.id])}"></label>`;
          return `<label class="ctl"><span>${esc(c.label)}</span><input type="text" id="c-${c.id}" data-c="${c.id}" value="${esc(v[c.id])}" placeholder="${esc(c.ph || '')}" autocomplete="off"></label>`;
        }).join('')}</div><pre class="fonte" id="tGerado"></pre>`;
      } else if (L.kind === 'completar') {
        const b = s.blanks || {}; let k = 0;
        h += `<pre class="fonte">` + L.code.split(/\{\{(\w+)\}\}/).map((p, i) => {
          if (i % 2 === 0) return esc(p);
          k++; const val = b[p] || '';
          return `<input class="lacuna${val ? ' cheia' : ''}" id="b-${p}" data-b="${p}" value="${esc(val)}" style="width:${Math.max(L.blanks[p] || 4, val.length) + 1.5}ch" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Espaço em branco ${k}">`;
        }).join('') + `</pre>`;
      } else {
        h += `<textarea class="editor" id="ed-${f}" data-ed="${f}" spellcheck="false" autocomplete="off" autocapitalize="off" wrap="off" aria-label="Editor de ${f === 'js' ? 'JavaScript' : f.toUpperCase()}">${esc(UI.codigoAtual(L)[f])}</textarea>`;
      }
      h += `</div>`;
    });
    if (L.base && L.base.html && !L.editable.includes('html')) h += `<div class="vista-cod" data-vista="ro-html" ${UI.cur.file === 'ro-html' ? '' : 'hidden'}><pre class="fonte so-leitura">${esc(L.base.html)}</pre></div>`;
    if (L.base && L.base.css && !L.editable.includes('css')) h += `<div class="vista-cod" data-vista="ro-css" ${UI.cur.file === 'ro-css' ? '' : 'hidden'}><pre class="fonte so-leitura">${esc(L.base.css)}</pre></div>`;
    el.innerHTML = h;
    if (L.kind === 'explorar') UI.atualizarGerado();
  },
  atualizarGerado() {
    const { L } = UI.cur, v = UI.valsDe(L), mv = {};
    Object.keys(v).forEach(k => { mv[k] = '\u0001' + v[k] + '\u0002'; });
    const g = $('#tGerado'); if (g) g.innerHTML = esc(L.template(mv)).replace(/\u0001/g, '<mark>').replace(/\u0002/g, '</mark>');
  },
  renderPistas() {
    const { L } = UI.cur, s = ls(L.id), n = Math.min(s.hints || 0, L.hints.length);
    const rot = ['Recordar o conceito', 'Sugestão', UI.cur.m.final ? 'Lista de verificação' : 'Exemplo semelhante'];
    $('#tPistas').innerHTML = L.hints.slice(0, n).map((h, i) => typeof h === 'string'
      ? `<div class="pista"><b>${rot[i]}</b><span>${fmt(h)}</span></div>`
      : `<div class="pista"><b>${rot[i]}</b><span>${fmt(h.t)}</span><pre>${esc(h.code)}</pre></div>`).join('');
    const b = $('#tPistaBtn');
    if (n >= L.hints.length) b.hidden = true; else { b.hidden = false; b.textContent = L.hints.length === 1 ? 'Mostrar a pista' : `Mostrar pista ${n + 1} de ${L.hints.length}`; }
  },
  log(kind, text) {
    const ol = $('#tConsola'); if (!ol) return;
    const e = ol.querySelector('.c-vazio'); if (e) e.remove();
    const li = document.createElement('li'); li.className = 'c-' + kind;
    li.textContent = (kind === 'error' ? 'Erro: ' : '') + text;
    ol.appendChild(li); ol.scrollTop = ol.scrollHeight;
  },
  executar() {
    if (!UI.cur || !UI.cur.L) return;
    const f = $('#tPreview'); if (!f) return;
    UI.previewToken = newToken('p');
    $('#tConsola').innerHTML = '<li class="c-vazio">Sem mensagens.</li>';
    f.srcdoc = buildDoc(UI.cur.L, UI.codigoAtual(UI.cur.L), 'preview', UI.previewToken);
  },
  feedback(kind, titulo, texto) { const fb = $('#tFeedback'); fb.className = 'feedback f-' + kind; fb.innerHTML = `<strong>${esc(titulo)}</strong>${fmt(texto)}`; },

  async testar() {
    const { m, L } = UI.cur, s = ls(L.id), btn = $('#tTestar');
    btn.disabled = true; btn.textContent = 'A testar…';
    s.att = (s.att || 0) + 1; guardar();
    UI.executar();
    const r = await avaliar(L, UI.codigoAtual(L), s.blanks || {});
    btn.disabled = false; btn.textContent = 'Testar';
    if (!UI.cur || UI.cur.L !== L) return;
    const lis = $$('#tReqs li');
    if (r.timeout) { lis.forEach(li => li.className = ''); UI.feedback('aviso', 'O teste não terminou.', 'O código demorou demasiado a correr. Pode haver um ciclo que nunca acaba. Revê o código e testa outra vez.'); return; }
    if (r.crash) { lis.forEach(li => li.className = 'falha'); UI.feedback('erro', 'Não foi possível verificar a página.', r.errors.length ? 'O navegador encontrou um erro: ' + r.errors[0] : 'Falta algum elemento que a missão espera. Confirma que não apagaste nem mudaste o nome a elementos do HTML fornecido.'); som('erro'); return; }
    r.items.forEach((it, i) => { if (lis[i]) lis[i].className = it.ok ? 'ok' : 'falha'; });
    if (!r.pass) {
      if (r.errors.length) UI.feedback('erro', 'O navegador encontrou um erro no teu código.', r.errors[0] + (r.errors.length > 1 ? ` (e mais ${r.errors.length - 1})` : '') + '. Corrige-o e testa outra vez.');
      else { const n = r.items.filter(i => i.ok).length; UI.feedback(n ? 'aviso' : 'erro', n ? `${n} de ${r.items.length} requisitos cumpridos.` : 'Ainda não está.', r.items.find(i => !i.ok).fix); }
      return;
    }
    const primeira = !s.done, antes = MISSOES.map(x => UI.desbloqueada(x.id));
    s.done = true;
    if (L.kind === 'construir' || L.kind === 'desafio') s.code = Object.assign({}, s.code || {}, UI.codigoAtual(L));
    guardar();
    UI.feedback('ok', 'Todos os requisitos cumpridos.', primeira ? 'O navegador mostra a página como pedido.' : 'Continua a funcionar.');
    som(UI.completa(m) && !S.cel[m.id] ? 'sala' : 'ok');
    UI.renderTerminalNiveis();
    UI.mostrarSucesso(primeira);
    if (primeira) {
      if (L.id === 'tut1') UI.toast('A porta do corredor abriu. Segue até ao Átrio: a Sala E1 fica à direita.');
      MISSOES.forEach((x, i) => { if (!antes[i] && UI.desbloqueada(x.id) && x.id !== 'm1') UI.toast(`${x.sala} desbloqueada.`); });
      if (UI.completa(m) && !S.cel[m.id]) { S.cel[m.id] = true; guardar(); setTimeout(() => UI.toast(m.final ? 'O portal do CTE está de volta. Parabéns!' : `${m.sala} está ligada.`), 400); }
    }
    UI.atualizarHud();
  },
  renderTerminalNiveis() {
    const { m } = UI.cur;
    $$('#tNiveis .nivel').forEach(b => {
      const j = +b.dataset.l; if (j < 0) return; const X = m.levels[j];
      b.classList.toggle('feito', UI.feito(X.id)); b.querySelector('.pt').textContent = UI.feito(X.id) ? '✓' : j + 1;
      b.disabled = !UI.nivelAberto(m, j); if (!b.disabled) b.removeAttribute('title');
    });
  },
  mostrarSucesso(fresco) {
    const { m, L } = UI.cur, s = ls(L.id), ultimo = m.extra || L.index === m.levels.length - 1;
    let nota = '';
    if (fresco && UI.completa(m)) nota = m.final ? 'O portal do CTE está completo.' : m.extra ? 'Fizeste todos os desafios extra.' : `${m.sala} ligada: vê o resultado na sala.`;
    else if (fresco && L.index === 1 && PRINCIPAIS.includes(m) && !UI.completa(m)) { const i = PRINCIPAIS.indexOf(m); nota = i < 5 ? `A ${PRINCIPAIS[i + 1].sala} ficou desbloqueada.` : 'Todas as salas principais têm os níveis 1 e 2 feitos.'; }
    $('#tSucesso').innerHTML = `<div class="sucesso">
      <p class="ganho mb-0">${m.final ? 'Desafio final concluído.' : 'Nível concluído.'}</p>
      ${nota ? `<p class="mb-0">${esc(nota)}</p>` : ''}
      <label for="tExpl" class="fw-bold">Explica a tua solução</label>
      <p class="small text-secondary mb-0">${esc(L.explain)}</p>
      <textarea id="tExpl" class="form-control" placeholder="Escreve por palavras tuas…">${esc(s.expl || '')}</textarea>
      <div class="d-flex flex-wrap gap-2">
        <button class="btn btn-outline-primary btn-sm" data-acao="guardarExpl">Guardar explicação</button>
        ${m.extra ? `<button class="btn btn-primary btn-sm" data-acao="nivel" data-l="-1">Outro desafio</button>` : ultimo ? `<button class="btn btn-primary btn-sm" data-acao="verSala">Ver na sala</button>` : `<button class="btn btn-primary btn-sm" data-acao="nivel" data-l="${L.index + 1}">Nível seguinte →</button>`}
      </div>
    </div>`;
  },

  /* ---------- relatório do professor ---------- */
  profAuth: false, confirmarApagar: false,
  abrirProfessor() { UI.profAuth = false; UI.confirmarApagar = false; UI.renderProf(); bootstrap.Modal.getOrCreateInstance($('#profModal')).show(); },
  renderProf() {
    const c = $('#profCorpo');
    if (!S.pin || !UI.profAuth) {
      c.innerHTML = `<form class="pin d-grid gap-2" id="pinForm" style="max-width:420px">
        <p class="mb-0">${S.pin ? 'Escreve o PIN do professor para ver o relatório.' : 'Define um PIN de 4 algarismos. Vai ser pedido sempre que abrires o relatório neste computador.'}</p>
        <label for="pinIn" class="fw-bold">PIN</label>
        <input id="pinIn" class="form-control" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" autocomplete="off">
        <div id="pinMsg" class="text-danger small" role="status"></div>
        <button class="btn btn-primary" type="submit">${S.pin ? 'Entrar' : 'Definir PIN'}</button>
      </form>`;
      setTimeout(() => $('#pinIn') && $('#pinIn').focus(), 300);
      return;
    }
    const linhas = MISSOES.flatMap(m => m.levels.map(L => {
      const s = S.lv[L.id] || {};
      return `<tr><td>${esc(m.sala)}</td><td>${esc(m.final ? 'Final' : m.extra ? L.tema : m.n === 0 ? 'Tutorial' : (L.index + 1) + ' · ' + { explorar: 'Explorar', completar: 'Completar', construir: 'Construir', desafio: 'Desafio' }[L.kind])}</td><td>${esc(L.title)}</td><td>${s.done ? 'Concluído' : s.att ? 'Em curso' : '—'}</td><td class="n">${s.att || 0}</td><td class="n">${Math.min(s.hints || 0, L.hints.length)}</td><td class="expl">${s.expl ? esc(s.expl) : '—'}</td></tr>`;
    })).join('');
    const d = (t, on) => `<span class="dist${on ? ' on' : ''}">${on ? '✓' : '○'} ${t}</span>`;
    const dist = PRINCIPAIS.map(m => `<tr><td>${esc(m.sala)} · ${esc(m.title)}</td><td>${d('Funciona', UI.funciona(m))}${d('Explica', UI.explica(m))}${d('Adapta', UI.feito(m.levels[2].id))}${d('Supera', UI.feito(m.levels[3].id))}</td></tr>`).join('')
      + `<tr><td>Lab Apoio 3.1 · Desafios extra</td><td>${EXTRA.levels.map(L => d('Curioso · ' + L.tema, UI.feito(L.id))).join('')}</td></tr>`
      + `<tr><td>Lab Apoio E6.1 · Desafio final</td><td>${d('Transfere', UI.feito('final1'))}</td></tr>`;
    c.innerHTML = `<div class="d-grid gap-4">
      <div><p class="eyebrow mb-1">Aluno</p><h3 class="h4 fw-bold mb-0">${esc(S.nome || 'Sem nome')}</h3><p class="text-secondary mb-0">${UI.contagem()} de 24 níveis principais · desafio final ${UI.feito('final1') ? 'concluído' : 'por concluir'}</p></div>
      <section><h4 class="h6 fw-bold">Distinções</h4><p class="small text-secondary">Funciona: Explorar e Completar. Explica: explicação com 40 ou mais caracteres em 2 níveis. Adapta: Construir. Supera: Desafio. Nenhuma distinção depende da rapidez.</p>
        <div class="table-responsive"><table class="table table-sm rel align-middle"><tbody>${dist}</tbody></table></div></section>
      <section><h4 class="h6 fw-bold">Níveis</h4><p class="small text-secondary">As tentativas contam cada vez que o aluno carrega em Testar. Errar não é penalizado: o número mostra onde houve mais dificuldade.</p>
        <div class="table-responsive"><table class="table table-sm table-striped rel"><thead><tr><th>Sala</th><th>Nível</th><th>Desafio</th><th>Estado</th><th class="text-end">Tentativas</th><th class="text-end">Pistas</th><th>Explicação do aluno</th></tr></thead><tbody>${linhas}</tbody></table></div></section>
      <section class="d-grid gap-2"><h4 class="h6 fw-bold mb-0">Código de progresso</h4><p class="small text-secondary mb-0">Copia este código para continuar noutro computador ou para recolher o trabalho do aluno.</p>
        <textarea id="expCod" class="form-control cod-prog" rows="3" readonly>${esc(UI.exportar())}</textarea>
        <div><button class="btn btn-outline-primary btn-sm" data-acao="copiar">Copiar código</button></div>
        <label for="impCod" class="fw-bold mt-2">Carregar um código de progresso</label>
        <textarea id="impCod" class="form-control cod-prog" rows="2" placeholder="Cola aqui um código começado por CTE1."></textarea>
        <div><button class="btn btn-primary btn-sm" data-acao="importar">Carregar</button></div></section>
      <section class="d-grid gap-2"><h4 class="h6 fw-bold mb-0">Opções</h4>
        <div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="oDesb" ${S.unlockAll ? 'checked' : ''}><label class="form-check-label" for="oDesb">Desbloquear todas as salas e níveis</label></div>
        <div class="d-flex flex-wrap gap-2 align-items-center">
          <button class="btn btn-outline-secondary btn-sm" data-acao="testeInterno">Verificar o jogo (teste interno)</button>
          <button class="btn btn-outline-secondary btn-sm" data-acao="mudarPin">Mudar o PIN</button>
          ${UI.confirmarApagar ? `<span class="confirmar"><span>Isto apaga todo o progresso deste aluno neste navegador.</span><button class="btn btn-danger btn-sm" data-acao="apagarSim">Apagar progresso</button><button class="btn btn-light btn-sm" data-acao="apagarNao">Cancelar</button></span>` : `<button class="btn btn-outline-danger btn-sm" data-acao="apagar">Apagar progresso…</button>`}
        </div>
        <div id="testeOut"></div></section>
    </div>`;
  },
  exportar() { try { const o = Object.assign({}, S); delete o.pin; return 'CTE1.' + btoa(unescape(encodeURIComponent(JSON.stringify(o)))); } catch (e) { return ''; } },
  importar(t) {
    t = (t || '').trim(); if (!t.startsWith('CTE1.')) throw new Error('formato');
    const o = JSON.parse(decodeURIComponent(escape(atob(t.slice(5)))));
    if (!o || o.v !== 1 || typeof o.lv !== 'object') throw new Error('formato');
    const pin = S.pin; S = Object.assign(novoEstado(), o); S.pin = pin; guardar();
  },
  async testeInterno() {
    const out = $('#testeOut'); out.innerHTML = '<p class="small mb-1">A verificar todos os níveis…</p><ol class="small mb-0" id="testeLista"></ol>';
    const lista = $('#testeLista'); let falhas = 0;
    const codigo = (L, src) => {
      const f = L.editable[0];
      if (L.kind === 'explorar') { const v = {}; L.controls.forEach(c => v[c.id] = c.value); Object.assign(v, src.vals || {}); return { [f]: L.template(v) }; }
      if (L.kind === 'completar') return { [f]: fillBlanks(L.code, src.blanks || {}) };
      const c = {}; L.editable.forEach(k => c[k] = (src.code && src.code[k] != null) ? src.code[k] : (L.starter[k] || '')); return c;
    };
    for (const m of MISSOES) for (const L of m.levels) {
      const a = await avaliar(L, codigo(L, {}), {}), b = await avaliar(L, codigo(L, L.sol), L.sol.blanks || {});
      const ok = !a.pass && b.pass; if (!ok) falhas++;
      const li = document.createElement('li');
      li.innerHTML = `${ok ? '✓' : '✗'} ${esc(m.sala)} · ${esc(L.title)} — partida ${a.pass ? '<b>passa (devia falhar)</b>' : 'falha'}, solução ${b.pass ? 'passa' : '<b>falha (devia passar)</b>'}`;
      li.dataset.id = L.id; li.dataset.ok = ok ? '1' : '0';
      lista.appendChild(li);
    }
    const p = document.createElement('p'); p.className = 'fw-bold mt-2 mb-0'; p.id = 'testeFim';
    p.textContent = falhas ? `${falhas} nível(is) com problemas.` : 'Todos os níveis estão corretos: o código de partida falha e a solução de referência passa.';
    out.appendChild(p);
  }
};

/* ---------- eventos da interface ---------- */
function preencherAmostras() {
  Object.keys(PALETAS).forEach(k => {
    const box = $(`.amostras[data-av="${k}"]`);
    box.innerHTML = PALETAS[k].map(c => `<button class="amostra" style="background:${c}" data-av="${k}" data-cor="${c}" aria-label="${k} ${c}" aria-pressed="${S.av[k].toLowerCase() === c.toLowerCase()}"></button>`).join('');
  });
}
function aplicarAvatar() {
  if (!Mundo.aluno) return;
  const m = Mundo.aluno.userData.mats; m.camisola.color.set(S.av.camisola); m.cabelo.color.set(S.av.cabelo); m.pele.color.set(S.av.pele);
}

document.addEventListener('click', async e => {
  const el = e.target.closest('[data-acao],[data-av].amostra'); if (!el) return;
  if (el.classList.contains('amostra')) { S.av[el.dataset.av] = el.dataset.cor; guardar(); preencherAmostras(); aplicarAvatar(); return; }
  const a = el.dataset.acao;
  if (a === 'entrar') return UI.entrar('3d');
  if (a === 'entrarPlanta') return UI.entrar('planta');
  if (a === 'usar') { if (Mundo.foco) UI.abrirTerminal(Mundo.foco.mid); return; }
  if (a === 'planta') { bootstrap.Modal.getOrCreateInstance($('#menuModal')).hide(); return UI.abrirPlanta(); }
  if (a === 'fecharPlanta') return UI.fecharPlanta();
  if (a === 'menu') { Mundo.pausa = true; return bootstrap.Modal.getOrCreateInstance($('#menuModal')).show(); }
  if (a === 'continuar') return bootstrap.Modal.getOrCreateInstance($('#menuModal')).hide();
  if (a === 'camara') { bootstrap.Modal.getOrCreateInstance($('#menuModal')).hide(); Mundo.trocarVista(); return; }
  if (a === 'voltarEntrada') { bootstrap.Modal.getOrCreateInstance($('#menuModal')).hide(); Mundo.teleporte(13.2, -2.4, 0); return; }
  if (a === 'personagem') { bootstrap.Modal.getOrCreateInstance($('#menuModal')).hide(); UI.modo = 'inicio'; Mundo.pausa = true; ['#hudEsq', '#hudDir', '#minimapa', '#toque', '#interacao'].forEach(s => $(s).hidden = true); $('#inicio').hidden = false; $('#btnEntrar').textContent = 'Continuar'; return; }
  if (a === 'professor') { bootstrap.Modal.getOrCreateInstance($('#menuModal')).hide(); return UI.abrirProfessor(); }
  if (a === 'creditos') { bootstrap.Modal.getOrCreateInstance($('#menuModal')).hide(); return bootstrap.Modal.getOrCreateInstance($('#creditosModal')).show(); }
  if (a === 'verSala') {
    UI.verSala = true; Mundo.setFaixa(0);
    bootstrap.Offcanvas.getOrCreateInstance($('#terminal')).hide();
    $('#vistaSala').hidden = false; return;
  }
  if (a === 'mapaLimparSel') { Mapa2D.sel = null; Mapa2D.lateral(); Mapa2D.desenhar(); return; }
  if (a === 'dadosCopiar') { const ta = $('#mapaJson'); try { await navigator.clipboard.writeText(ta.value); UI.toast('Dados copiados.'); } catch (err) { ta.focus(); ta.select(); UI.toast('Seleciona o texto e copia-o com Ctrl + C.'); } return; }
  if (a === 'dadosAplicar') return Mapa2D.aplicarDados();
  if (a === 'dadosRepor') { try { localStorage.removeItem(DADOS_KEY); } catch (e) {} UI.toast('Dados originais repostos. A recarregar…'); setTimeout(() => location.reload(), 400); return; }
  if (a === 'voltarTerminal') { UI.verSala = false; $('#vistaSala').hidden = true; bootstrap.Offcanvas.getOrCreateInstance($('#terminal')).show(); setTimeout(UI.ajustarFaixa, 350); return; }
  if (!UI.cur && !['copiar', 'importar', 'testeInterno', 'apagar', 'apagarSim', 'apagarNao', 'mudarPin'].includes(a)) return;
  if (a === 'nivel') { if (el.disabled) return; const j = +el.dataset.l; UI.cur.L = j >= 0 ? UI.cur.m.levels[j] : null; if (UI.cur.L) UI.cur.file = UI.cur.L.editable[0]; UI.renderTerminal(); return; }
  if (a === 'aba') { UI.cur.file = el.dataset.f; $$('.aba').forEach(t => t.setAttribute('aria-selected', String(t.dataset.f === UI.cur.file))); $$('.vista-cod').forEach(v => v.hidden = v.dataset.vista !== UI.cur.file); return; }
  if (a === 'largura') { UI.cur.tel = el.dataset.w === 'tel'; $('#tPalco').classList.toggle('tel', UI.cur.tel); $$('.seg button').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.w === 'tel') === UI.cur.tel))); return; }
  if (a === 'executar') return UI.executar();
  if (a === 'testar') return UI.testar();
  if (a === 'pista') { const s = ls(UI.cur.L.id); s.hints = Math.min((s.hints || 0) + 1, UI.cur.L.hints.length); guardar(); UI.renderPistas(); return; }
  if (a === 'repor') {
    if (el.dataset.armado !== '1') { el.dataset.armado = '1'; el.textContent = 'Confirmar: repor código'; el.classList.replace('text-secondary', 'text-danger'); setTimeout(() => { if (el.isConnected) { el.dataset.armado = ''; el.textContent = 'Repor código'; el.classList.replace('text-danger', 'text-secondary'); } }, 4000); return; }
    const s = ls(UI.cur.L.id); s.code = null; s.blanks = null; guardar(); UI.renderCodigo(); UI.executar(); return;
  }
  if (a === 'guardarExpl') { ls(UI.cur.L.id).expl = $('#tExpl').value; guardar(); UI.toast('Explicação guardada.'); return; }
  if (a === 'copiar') { const ta = $('#expCod'); try { await navigator.clipboard.writeText(ta.value); UI.toast('Código copiado.'); } catch (err) { ta.focus(); ta.select(); UI.toast('Seleciona o código e copia-o com Ctrl + C.'); } return; }
  if (a === 'importar') { try { UI.importar($('#impCod').value); UI.toast('Progresso carregado.'); preencherAmostras(); aplicarAvatar(); UI.atualizarHud(); UI.renderProf(); } catch (err) { UI.toast('Este código não é válido. Confirma que copiaste o código todo, começado por CTE1.'); } return; }
  if (a === 'testeInterno') { el.disabled = true; await UI.testeInterno(); el.disabled = false; return; }
  if (a === 'apagar') { UI.confirmarApagar = true; return UI.renderProf(); }
  if (a === 'apagarNao') { UI.confirmarApagar = false; return UI.renderProf(); }
  if (a === 'apagarSim') { const keep = { nome: S.nome, av: S.av, pin: S.pin, qual: S.qual }; S = Object.assign(novoEstado(), keep); FX = { snaps: {}, luzes: {} }; escrever(KEY_FX, FX); guardar(); UI.confirmarApagar = false; UI.toast('Progresso apagado.'); UI.atualizarHud(); return UI.renderProf(); }
  if (a === 'mudarPin') { S.pin = ''; UI.profAuth = false; guardar(); return UI.renderProf(); }
});
document.addEventListener('submit', e => {
  if (e.target.id !== 'pinForm') return;
  e.preventDefault();
  const v = $('#pinIn').value.trim();
  if (!/^\d{4}$/.test(v)) { $('#pinMsg').textContent = 'O PIN tem de ter 4 algarismos.'; return; }
  if (!S.pin) { S.pin = v; guardar(); UI.profAuth = true; return UI.renderProf(); }
  if (v === S.pin) { UI.profAuth = true; return UI.renderProf(); }
  $('#pinMsg').textContent = 'PIN errado. Tenta outra vez.';
});
document.addEventListener('change', e => {
  if (e.target.id === 'oDesb') { S.unlockAll = e.target.checked; guardar(); UI.atualizarHud(); UI.toast(S.unlockAll ? 'Todas as salas estão desbloqueadas.' : 'As salas voltam a abrir por ordem.'); }
  if (e.target.id === 'mReduzir') { S.reduzir = UI.reduzir = e.target.checked; $('#iReduzir').checked = S.reduzir; guardar(); }
});
const executarDepois = debounce(() => UI.executar(), 450);
document.addEventListener('input', e => {
  const t = e.target; if (!UI.cur || !UI.cur.L) return;
  const L = UI.cur.L, s = ls(L.id);
  if (t.dataset.c) {
    s.vals = Object.assign({}, s.vals || {}, { [t.dataset.c]: t.value });
    const ctl = L.controls.find(c => c.id === t.dataset.c), out = $('#o-' + t.dataset.c); if (out) out.textContent = t.value + (ctl.unit || '');
    guardar(); UI.atualizarGerado(); executarDepois();
  } else if (t.dataset.b) {
    s.blanks = Object.assign({}, s.blanks || {}, { [t.dataset.b]: t.value });
    t.style.width = Math.max(L.blanks[t.dataset.b] || 4, t.value.length) + 1.5 + 'ch'; t.classList.toggle('cheia', !!t.value);
    guardar(); if (!L.editable.includes('js')) executarDepois();
  } else if (t.dataset.ed) {
    s.code = Object.assign({}, s.code || {}, { [t.dataset.ed]: t.value });
    guardar(); if (!L.editable.includes('js')) executarDepois();
  }
});
document.addEventListener('keydown', e => {
  const ta = e.target;
  if (UI.terminalAberto && (e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); UI.executar(); return; }
  if (ta.matches && ta.matches('textarea.editor')) {
    if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); ta.setRangeText('  ', ta.selectionStart, ta.selectionEnd, 'end'); ta.dispatchEvent(new Event('input', { bubbles: true })); }
    else if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
      const st = ta.selectionStart, line = ta.value.slice(0, st).split('\n').pop();
      const ind = (line.match(/^\s*/) || [''])[0] + (/[{(\[>]\s*$/.test(line) && !/^\s*<\//.test(line) ? '  ' : '');
      if (ind) { e.preventDefault(); ta.setRangeText('\n' + ind, st, ta.selectionEnd, 'end'); ta.dispatchEvent(new Event('input', { bubbles: true })); }
    }
    return;
  }
  if (e.target.closest && e.target.closest('input,textarea,select')) return;
  if (document.querySelector('.modal.show')) return;
  if (e.key === 'Escape' && UI.modo === 'jogo' && !UI.terminalAberto) { e.preventDefault(); Mundo.pausa = true; bootstrap.Modal.getOrCreateInstance($('#menuModal')).show(); }
  if ((e.key === 'm' || e.key === 'M') && !UI.terminalAberto) { e.preventDefault(); if (UI.modo === 'planta') UI.fecharPlanta(); else if (UI.modo === 'jogo') UI.abrirPlanta(); }
});

/* mensagens das páginas dos alunos */
mwListeners.push(d => {
  if (!UI.cur || d.__mw !== UI.previewToken) return;
  const mid = UI.cur.m.id;
  if (d.type === 'error') UI.log('error', d.data);
  else if (d.type === 'log') UI.log(d.data.k === 'log' ? 'log' : d.data.k, d.data.t);
  else if (d.type === 'snap') { if (Mundo.pronto) Mundo.efeito(mid, d.data); FX.snaps[mid] = d.data; guardarFx(); }
  else if (d.type === 'api') {
    if (d.data.f === 'luz') { if (Mundo.pronto) Mundo.luz('m5', d.data.id, d.data.on); FX.luzes[d.data.id] = d.data.on; guardarFx(); if (Mundo.pronto) Mundo.efeito('m5', FX.snaps.m5 || { els: [] }); }
    else if (d.data.f === 'ecra') UI.toast(d.data.texto);
    else if (d.data.f === 'som') som('ok');
  }
});
