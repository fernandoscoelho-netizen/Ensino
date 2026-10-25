/* =========================================================
   CTE Online · motor de verificação
   A página do aluno corre numa iframe isolada (sandbox).
   ========================================================= */

/* Corre DENTRO da iframe: erros, consola, imagens, API da sala e fotografias da página */
function mwHook(cfg) {
  var T = cfg.token;
  function send(type, data) { try { parent.postMessage({ __mw: T, type: type, data: data }, '*'); } catch (e) {} }
  window.__mwErrors = [];
  window.__cteCalls = [];
  window.addEventListener('error', function (e) {
    var ln = e.lineno ? e.lineno - cfg.offset : 0;
    var m = (e.message || 'Erro') + (ln > 0 && cfg.offset > 0 ? ' (linha ' + ln + ')' : '');
    window.__mwErrors.push(m); send('error', m);
  });
  ['log', 'info', 'warn', 'error'].forEach(function (k) {
    var o = console[k];
    console[k] = function () {
      var p = [];
      for (var i = 0; i < arguments.length; i++) {
        var x = arguments[i];
        try { p.push(typeof x === 'object' && x !== null ? JSON.stringify(x) : String(x)); } catch (_) { p.push(String(x)); }
      }
      send('log', { k: k, t: p.join(' ') });
      try { o.apply(console, arguments); } catch (_) {}
    };
  });
  function api(f, extra) { var o = { f: f }; for (var k in extra) o[k] = extra[k]; window.__cteCalls.push(o); send('api', o); }
  window.cte = {
    luz: function (id, ligada) { api('luz', { id: String(id), on: !!ligada }); },
    porta: function (id, aberta) { api('porta', { id: String(id), on: !!aberta }); },
    ecra: function (texto) { api('ecra', { texto: String(texto).slice(0, 80) }); },
    som: function (nome) { api('som', { nome: String(nome) }); }
  };
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var h = (a.getAttribute('href') || '').trim();
    if (h.charAt(0) === '#' && h.length > 1) return;
    e.preventDefault();
    send('log', { k: 'info', t: h ? 'Esta ligação abriria: ' + h : 'Esta ligação não tem endereço (href).' });
  }, true);
  function fixImgs() {
    var list = document.querySelectorAll('img');
    for (var i = 0; i < list.length; i++) {
      var img = list[i], s = (img.getAttribute('src') || '').trim();
      if (!s || /^(data:|blob:)/.test(s)) continue;
      var key = s.split('/').pop();
      img.setAttribute('data-mw-src', key in cfg.imgs ? key : 'imagem.svg');
      img.src = cfg.imgs[key] || cfg.imgs['imagem.svg'];
    }
  }
  document.addEventListener('DOMContentLoaded', fixImgs);
  if (cfg.mode !== 'preview') return;
  window.addEventListener('submit', function (e) {
    if (!e.defaultPrevented) {
      e.preventDefault();
      send('log', { k: 'warn', t: 'O formulário foi enviado e a página teria recarregado. Usa evento.preventDefault() para o impedir.' });
    }
  });
  function snap() {
    if (!document.body) return;
    var els = document.body.querySelectorAll('*'), out = [];
    for (var i = 0; i < els.length && out.length < 260; i++) {
      var el = els[i];
      if (/^(SCRIPT|STYLE|BR|OPTION|HEAD|META|TITLE)$/.test(el.tagName)) continue;
      var b = el.getBoundingClientRect();
      if (b.width < 2 || b.height < 2) continue;
      var s = getComputedStyle(el);
      if (s.visibility === 'hidden' || s.display === 'none' || parseFloat(s.opacity) === 0) continue;
      var own = '';
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) own = el.tagName === 'SELECT' ? (el.options[el.selectedIndex] || {}).text || '' : (el.type === 'password' ? '••••' : (el.value || el.placeholder || ''));
      else for (var c = el.firstChild; c; c = c.nextSibling) if (c.nodeType === 3) own += c.nodeValue;
      own = own.replace(/\s+/g, ' ').trim().slice(0, 60);
      out.push({
        t: el.tagName.toLowerCase(), id: el.id || '', c: typeof el.className === 'string' ? el.className : '',
        x: b.left + scrollX, y: b.top + scrollY, w: b.width, h: b.height,
        bg: s.backgroundColor, fg: s.color, bw: parseFloat(s.borderTopWidth) || 0, bc: s.borderTopColor,
        br: parseFloat(s.borderTopLeftRadius) || 0, fs: parseFloat(s.fontSize) || 14, fw: s.fontWeight,
        ta: s.textAlign, tx: own, src: el.tagName === 'IMG' ? (el.getAttribute('data-mw-src') || '') : ''
      });
    }
    send('snap', {
      w: Math.max(document.documentElement.scrollWidth, innerWidth), h: Math.max(document.documentElement.scrollHeight, innerHeight),
      vw: innerWidth, bodyBg: getComputedStyle(document.body).backgroundColor, els: out
    });
  }
  var t;
  function later() { clearTimeout(t); t = setTimeout(snap, 140); }
  window.addEventListener('load', function () {
    later();
    try { new MutationObserver(later).observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true }); } catch (e) {}
  });
  ['click', 'input', 'change', 'submit'].forEach(function (ev) { document.addEventListener(ev, later, true); });
  window.addEventListener('resize', later);
}

/* Utilitários entregues às funções de verificação (também correm na iframe) */
function mwHelpers() {
  var Z = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
  function q(s, root) { return (root || document).querySelector(s); }
  function qa(s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); }
  function r(el) { return el ? el.getBoundingClientRect() : Z; }
  function cs(el) { return el ? getComputedStyle(el) : {}; }
  function text(el) { return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }
  function overflow() { return document.documentElement.scrollWidth > window.innerWidth + 1; }
  function rgba(c) {
    var m = String(c || '').match(/rgba?\(([^)]+)\)/);
    if (!m) return [0, 0, 0, 0];
    var p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  }
  function lum(c) {
    var a = rgba(c).slice(0, 3).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  function bgOf(el) {
    for (var e = el; e && e.nodeType === 1; e = e.parentElement) {
      var b = getComputedStyle(e).backgroundColor;
      if (rgba(b)[3] > 0) return b;
    }
    return 'rgb(255, 255, 255)';
  }
  return {
    q: q, qa: qa, r: r, cs: cs, text: text, overflow: overflow, bgOf: bgOf,
    alpha: function (c) { return rgba(c)[3]; },
    same: function (a, b) { var x = rgba(a), y = rgba(b); return Math.abs(x[0] - y[0]) < 2 && Math.abs(x[1] - y[1]) < 2 && Math.abs(x[2] - y[2]) < 2 && Math.abs(x[3] - y[3]) < 0.05; },
    contrast: function (a, b) { var l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); },
    ok: function (c, fix) { return { ok: !!c, fix: fix }; },
    wait: function (ms) { return new Promise(function (res) { setTimeout(res, ms); }); },
    num: function (t) { var m = String(t).match(/-?\d+(?:[.,]\d+)?/); return m ? parseFloat(m[0].replace(',', '.')) : NaN; },
    submit: function (form) { var e = new Event('submit', { bubbles: true, cancelable: true }); form.dispatchEvent(e); return e.defaultPrevented; },
    change: function (el, v) { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); },
    visible: function (el) {
      if (!el || el.hidden) return false;
      var s = getComputedStyle(el); if (s.display === 'none' || s.visibility === 'hidden') return false;
      var b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0;
    },
    menu: function () {
      var m = q('.menu'), lg = q('.logo'), ul = q('.ligacoes'), as = qa('.ligacoes a');
      var mr = r(m), lr = r(lg), ur = r(ul), st = cs(m);
      var pl = (parseFloat(st.paddingLeft) || 0) + (parseFloat(st.borderLeftWidth) || 0);
      var pr = (parseFloat(st.paddingRight) || 0) + (parseFloat(st.borderRightWidth) || 0);
      var a0 = as.length ? r(as[0]) : Z, aN = as.length ? r(as[as.length - 1]) : Z;
      var inRow = !!(m && lg && ul) && ur.top < lr.bottom - 2 && ur.left >= lr.right - 1;
      var left = Math.abs(lr.left - (mr.left + pl)) < 4;
      var right = Math.abs((mr.right - pr) - aN.right) < 4 && a0.left - lr.right > 30;
      var cy = Math.abs((lr.top + lr.height / 2) - (a0.top + a0.height / 2)) < 2.5;
      var linksRow = as.length > 1 && Math.abs(r(as[0]).top - r(as[1]).top) < 2 && r(as[1]).left > r(as[0]).right - 1;
      var gap = as.length > 1 ? r(as[1]).left - r(as[0]).right : 0;
      var fits = !overflow() && as.every(function (a) { return r(a).right <= window.innerWidth + 1; }) && lr.right <= window.innerWidth + 1;
      return { inRow: inRow, left: left, right: right, cy: cy, linksRow: linksRow, gap: gap, fits: fits };
    },
    mural: function () {
      var m = q('.mural'), st = cs(m), mr = r(m);
      var all = qa('.cartao'), d = q('.destaque');
      var normal = all.filter(function (c) { return !c.classList.contains('destaque'); });
      var lefts = {}; normal.forEach(function (c) { lefts[Math.round(r(c).left)] = 1; });
      var ws = normal.map(function (c) { return r(c).width; });
      var pl = (parseFloat(st.paddingLeft) || 0) + (parseFloat(st.borderLeftWidth) || 0);
      var pr = (parseFloat(st.paddingRight) || 0) + (parseFloat(st.borderRightWidth) || 0);
      var inner = mr.width - pl - pr;
      var rightMost = normal.length ? Math.max.apply(null, normal.map(function (c) { return r(c).right; })) : 0;
      var gap = parseFloat(st.columnGap); if (isNaN(gap)) gap = 0;
      var rowGap = parseFloat(st.rowGap); if (isNaN(rowGap)) rowGap = 0;
      return {
        isGrid: /grid/.test(st.display || ''), cols: Object.keys(lefts).length,
        equal: ws.length > 0 && Math.max.apply(null, ws) - Math.min.apply(null, ws) < 2,
        fills: Math.abs(rightMost - (mr.right - pr)) < 3,
        gap: gap, rowGap: rowGap, cw: normal.length ? r(normal[0]).width : 0, dw: r(d).width, inner: inner,
        full: d ? Math.abs(r(d).width - inner) < 3 : false
      };
    }
  };
}

function mwRunCheck(cfg, helpers, check) {
  window.addEventListener('load', function () {
    var tries = 0;
    function ready(fn) { if ((document.documentElement.getBoundingClientRect().width > 0 && window.innerWidth > 0) || tries++ > 40) fn(); else setTimeout(function () { ready(fn); }, 50); }
    setTimeout(function () { ready(function () {
      var T = helpers();
      Promise.resolve().then(function () { return check(T); }).then(function (items) {
        parent.postMessage({ __mw: cfg.token, type: 'result', data: items, errors: window.__mwErrors || [] }, '*');
      }, function (e) {
        parent.postMessage({ __mw: cfg.token, type: 'result', data: null, crash: String(e && e.message || e), errors: window.__mwErrors || [] }, '*');
      });
    }); }, 80);
  });
}

const BASE_CSS = `*{box-sizing:border-box}
body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;margin:0;padding:16px;color:#1b2526;background:#fff;line-height:1.45}
img{max-width:100%;height:auto}`;

function fillBlanks(code, b) { return code.replace(/\{\{(\w+)\}\}/g, (m, k) => (b && b[k] ? String(b[k]).trim() : '')); }

function buildDoc(L, code, mode, token) {
  const ed = L.editable, b = L.base || {};
  const html = ed.includes('html') ? code.html : (b.html || '');
  const css = ed.includes('css') ? code.css : '';
  const js = ed.includes('js') ? code.js : (b.js || '');
  const cfg = { token, mode, offset: 0, imgs: IMGS };
  const hook = () => '<script>(' + mwHook.toString() + ')(' + JSON.stringify(cfg) + ');<\/script>';
  const head = '<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Resultado</title><style>' + BASE_CSS + '\n' + (b.css || '') + '</style><style>\n' + (css || '') + '\n</style>';
  let doc = head + hook() + '</head><body>\n' + (html || '') + '\n';
  if (js) {
    cfg.offset = (doc + '<script>\n').split('\n').length - 1;
    doc = head + hook() + '</head><body>\n' + (html || '') + '\n<script>\n' + js + '\n<\/script>';
  }
  if (L.after) doc += '<script>' + L.after + '<\/script>';
  if (mode === 'test') doc += '<script>(' + mwRunCheck.toString() + ')(' + JSON.stringify({ token }) + ',' + mwHelpers.toString() + ',' + L.check.toString() + ');<\/script>';
  return doc + '</body></html>';
}

let mwSeq = 0;
const mwPending = {};
const mwListeners = [];
window.addEventListener('message', e => {
  const d = e.data; if (!d || typeof d !== 'object' || !d.__mw) return;
  if (mwPending[d.__mw] && d.type === 'result') { mwPending[d.__mw](d); return; }
  mwListeners.forEach(fn => fn(d));
});
function newToken(p) { return p + (++mwSeq) + Math.random().toString(36).slice(2, 7); }

function testAt(L, code, w) {
  return new Promise(res => {
    const token = newToken('t');
    const f = document.createElement('iframe');
    f.setAttribute('sandbox', 'allow-scripts allow-forms');
    f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
    f.className = 'testframe'; f.style.width = w + 'px';
    const tm = setTimeout(() => { if (mwPending[token]) mwPending[token]({ timeout: true }); }, 6000);
    mwPending[token] = d => { clearTimeout(tm); delete mwPending[token]; f.remove(); res(d); };
    f.srcdoc = buildDoc(L, code, 'test', token);
    document.body.appendChild(f);
  });
}

/* Corre os testes de um nível e devolve o veredicto */
async function avaliar(L, code, blanks) {
  const pre = L.precheck ? L.precheck(blanks || {}) : null;
  const results = [];
  for (const w of (L.widths || [800])) results.push(await testAt(L, code, w));
  if (results.some(r => r.timeout)) return { timeout: true };
  const errors = [...new Set(results.flatMap(r => r.errors || []))];
  if (results.some(r => !r.data)) return { crash: true, errors };
  const items = L.req.map((_, i) => {
    let ok = true, fix = '';
    results.forEach(r => { const it = r.data[i]; if (!it || !it.ok) { ok = false; if (!fix) fix = (it && it.fix) || 'Requisito por cumprir.'; } });
    return { ok, fix };
  });
  if (pre) { items[pre.i] = { ok: false, fix: pre.msg }; }
  return { items, errors, pre, pass: items.every(it => it.ok) && !errors.length };
}
