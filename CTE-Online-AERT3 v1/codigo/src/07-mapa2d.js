/* =========================================================
   CTE Online · mapa 2D (jogável), comparação com a planta,
   verificação de ligações e dados editáveis.
   Usa a mesma grelha e os mesmos dados (DP) que a cena 3D.
   ========================================================= */
const COR_EST = { bloqueada: '#5b666b', disponivel: '#e2a82c', ligada: '#3fae74' };
const salaDeEspaco = id => Object.keys(SALAS).find(mid => SALAS[mid].espaco === id);
const ROTULO_ORIGEM = { medido: 'Medido à escala', cota: 'Cota', observado: 'Observado', interpretado: 'Interpretado', estimado: 'Estimado', derivado: 'Derivado', ficcional: 'Do jogo (ficcional)', proposta: 'Proposta' };
const NOME_TIPO = {
  mesa: 'Mesa', bancada_armario: 'Bancada com armário', bancada_tecnica: 'Bancada técnica', bancada_alta: 'Bancada alta', bancada_rodada: 'Bancada',
  mesa_professor: 'Mesa de professor', mesa_redonda: 'Mesa de professor (redonda)', mesa_diamond: 'Mesa Diamond', armario_curvo: 'Armário curvo',
  carro: 'Carro de tabuleiros', rover: 'Rover de tabuleiros', carregador: 'Carro de carregamento', ecra: 'Ecrã interativo'
};

const Mapa2D = {
  aba: 'mapa', vista: null, modoComp: 'sobrepor', opac: 0.55, camadas: { arq: true, mob: true, constr: true, jogo: true, limites: true, rotulos: true, alcance: false },
  seguir: true, sel: null, img: null, alc: null,

  init() {
    this.cv = $('#plantaCanvas');
    this.img = new Image(); this.img.src = PLANTA_REF_IMG;
    this.img.onload = () => this.desenhar();
    const cv = this.cv;
    let drag = null, pinch = null;
    const pts = new Map();
    cv.addEventListener('pointerdown', e => {
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      cv.setPointerCapture(e.pointerId);
      if (pts.size === 1) drag = { x: e.clientX, y: e.clientY, moved: 0 };
      if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: this.vista.s }; drag = null; }
    });
    cv.addEventListener('pointermove', e => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && pts.size === 2) {
        const [a, b] = [...pts.values()], d = Math.hypot(a.x - b.x, a.y - b.y), r = cv.getBoundingClientRect();
        this.zoomEm((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, (pinch.s * d / pinch.d) / this.vista.s); return;
      }
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY; drag.moved += Math.abs(dx) + Math.abs(dy);
      if (drag.moved > 4) { this.vista.ox += dx; this.vista.oy += dy; this.seguir = false; this.desenhar(); }
    });
    const fim = e => {
      pts.delete(e.pointerId);
      if (pts.size < 2) pinch = null;
      if (drag && drag.moved <= 4 && e.type === 'pointerup') this.clique(e);
      if (pts.size === 0) drag = null;
    };
    cv.addEventListener('pointerup', fim); cv.addEventListener('pointercancel', fim);
    cv.addEventListener('wheel', e => { e.preventDefault(); const r = cv.getBoundingClientRect(); this.zoomEm(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.0015)); }, { passive: false });
    document.addEventListener('keydown', e => {
      if (UI.modo !== 'planta' || UI.terminalAberto || this.aba !== 'mapa') return;
      if (e.target.closest && e.target.closest('input,textarea,select')) return;
      if ((e.code === 'KeyE' || e.code === 'Enter') && Mundo.foco) { e.preventDefault(); Mundo.keys = {}; UI.abrirTerminal(Mundo.foco.mid); }
    });
    $('#mapaAbas').addEventListener('click', e => { const b = e.target.closest('[data-aba]'); if (b) this.mudarAba(b.dataset.aba); });
    $('#mapaCamadas').addEventListener('change', e => { const k = e.target.dataset.camada; if (k) { this.camadas[k] = e.target.checked; this.desenhar(); } });
    $('#mapaOpac').addEventListener('input', e => { this.opac = +e.target.value / 100; this.desenhar(); });
    $('#mapaModoComp').addEventListener('click', e => { const b = e.target.closest('[data-modo]'); if (!b) return; this.modoComp = b.dataset.modo; $$('#mapaModoComp [data-modo]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); this.ajustar(); this.desenhar(); });
    $('#mapaZoom').addEventListener('click', e => {
      const b = e.target.closest('[data-z]'); if (!b) return;
      const r = this.cv.getBoundingClientRect();
      if (b.dataset.z === 'mais') this.zoomEm(r.width / 2, r.height / 2, 1.4);
      else if (b.dataset.z === 'menos') this.zoomEm(r.width / 2, r.height / 2, 1 / 1.4);
      else if (b.dataset.z === 'ajustar') { this.ajustar(); this.desenhar(); }
      else if (b.dataset.z === 'aluno') { this.seguir = true; this.centrarAluno(3.2); this.desenhar(); }
    });
    window.addEventListener('resize', () => { if (UI.modo === 'planta') { this.ajustarCanvas(); this.desenhar(); } });
    this.ultimo = performance.now();
    requestAnimationFrame(t => this.loop(t));
  },

  abrir() {
    $('#planta').hidden = false;
    this.ajustarCanvas();
    if (!this.vista) this.ajustar();
    this.mudarAba(this.aba);
  },
  mudarAba(a) {
    if (a !== this.aba) this.sel = null;
    const eraLado = this.aba === 'comparar' && this.modoComp === 'lado';
    this.aba = a;
    if (eraLado !== (a === 'comparar' && this.modoComp === 'lado') && this.vista) this.ajustar();
    $$('#mapaAbas [data-aba]').forEach(b => { b.classList.toggle('active', b.dataset.aba === a); b.setAttribute('aria-selected', String(b.dataset.aba === a)); });
    $('#mapaComp').hidden = a !== 'comparar';
    $('#mapaDicaJogo').hidden = a !== 'mapa';
    this.camadas.alcance = a === 'ligacoes';
    const cb = $('[data-camada="alcance"]'); if (cb) cb.checked = this.camadas.alcance;
    if (a === 'ligacoes') this.verificar();
    this.lateral();
    this.desenhar();
  },
  ajustarCanvas() {
    const cv = this.cv, dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = cv.clientWidth, H = cv.clientHeight;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    this.dpr = dpr;
  },
  ajustar() {
    const W = this.cv.clientWidth, H = this.cv.clientHeight, b = [-1.2, -11.4, 23.8, 23.0];
    const lado = this.aba === 'comparar' && this.modoComp === 'lado' ? 2 : 1;
    const s = Math.min((W / lado - 24) / (b[2] - b[0]), (H - 24) / (b[3] - b[1]));
    this.vista = { s, ox: (W / lado - (b[2] - b[0]) * s) / 2 - b[0] * s, oy: (H - (b[3] - b[1]) * s) / 2 - b[1] * s };
    this.seguir = false;
  },
  zoomEm(px, py, f) {
    const v = this.vista, ns = Math.max(4, Math.min(260, v.s * f)), k = ns / v.s;
    const lado = this.aba === 'comparar' && this.modoComp === 'lado' && px > this.cv.clientWidth / 2 ? this.cv.clientWidth / 2 : 0;
    v.ox = (px - lado) - ((px - lado) - v.ox) * k; v.oy = py - (py - v.oy) * k; v.s = ns;
    this.seguir = false; this.desenhar();
  },
  centrarAluno(sMin) {
    const v = this.vista, W = this.cv.clientWidth, H = this.cv.clientHeight;
    if (sMin && v.s < sMin * 10) v.s = sMin * 10;
    v.ox = W / 2 - Mundo.pos.x * v.s; v.oy = H / 2 - Mundo.pos.z * v.s;
  },

  /* ---------- ciclo do modo jogável ---------- */
  loop(now) {
    requestAnimationFrame(t => this.loop(t));
    const dt = Math.min(0.05, (now - this.ultimo) / 1000); this.ultimo = now;
    if (UI.modo !== 'planta' || UI.terminalAberto || this.aba !== 'mapa') return;
    const k = Mundo.keys;
    const ix = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0) + Mundo.joy.x;
    const iz = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0) + Mundo.joy.y;
    if (Math.abs(ix) + Math.abs(iz) < 0.05 && Mundo.vel < 0.01) return;
    Mundo.passo(dt, ix, iz, false);
    if (this.seguir) this.centrarAluno();
    this.desenhar();
  },

  /* ---------- desenho ---------- */
  desenhar() {
    if (UI.modo !== 'planta' || !this.vista) return;
    this.ajustarCanvas();
    const cv = this.cv, c = cv.getContext('2d'), W = cv.clientWidth, H = cv.clientHeight;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.fillStyle = '#e9eef0'; c.fillRect(0, 0, W, H);
    if (this.aba === 'comparar') {
      if (this.modoComp === 'lado') {
        c.save(); c.beginPath(); c.rect(0, 0, W / 2, H); c.clip(); this.ref(c, 1); this.etiqueta(c, 10, 10, 'Planta de referência (PDF)'); c.restore();
        c.save(); c.beginPath(); c.rect(W / 2, 0, W / 2, H); c.clip(); c.translate(W / 2, 0); this.mapa(c, { jogo: true }); this.etiqueta(c, 10, 10, 'Mapa interpretado'); c.restore();
        c.fillStyle = '#14232b'; c.fillRect(W / 2 - 1, 0, 2, H);
      } else {
        this.ref(c, 1);
        c.globalAlpha = this.opac; this.mapa(c, { semFundo: true }); c.globalAlpha = 1;
      }
    } else {
      this.mapa(c, { jogo: this.aba === 'mapa' });
    }
    if (this.sel) this.destacar(c, this.sel);
  },
  etiqueta(c, x, y, t) { c.font = `700 12px ${FONT}`; const w = c.measureText(t).width + 16; c.fillStyle = 'rgba(20,35,43,.85)'; c.fillRect(x, y, w, 24); c.fillStyle = '#fff'; c.fillText(t, x + 8, y + 16); },
  ref(c, a) {
    const b = DP.meta.imagem_referencia.limites, v = this.vista;
    if (this.img && this.img.complete && this.img.naturalWidth) { c.globalAlpha = a; c.drawImage(this.img, v.ox + b[0] * v.s, v.oy + b[1] * v.s, (b[2] - b[0]) * v.s, (b[3] - b[1]) * v.s); c.globalAlpha = 1; }
  },
  mapa(c, o = {}) {
    const v = this.vista, s = v.s, P = (x, y) => [v.ox + x * s, v.oy + y * s];
    const R = (r, cor, linha, lw = 1) => { const [a, b] = P(r[0], r[1]); if (cor) { c.fillStyle = cor; c.fillRect(a, b, (r[2] - r[0]) * s, (r[3] - r[1]) * s); } if (linha) { c.strokeStyle = linha; c.lineWidth = lw; c.strokeRect(a, b, (r[2] - r[0]) * s, (r[3] - r[1]) * s); } };
    const Cm = this.camadas;
    if (!o.semFundo) {
      PLANTA.exterior.forEach(r => R(r, '#d6d2c8'));
      if (PLANTA.rampa) R(PLANTA.rampa, '#cfc9bc', '#9b958a');
    }
    // espaços
    PLANTA.espacos.forEach(e => {
      const mid = salaDeEspaco(e.id), st = mid ? UI.estadoSala(mid) : null;
      let cor = e.tipoJogo === 'bloqueado' ? '#b9c0c2' : e.tipoJogo === 'circulacao' ? '#f3efe5' : '#fbfcfc';
      if (o.jogo && st) cor = { bloqueada: '#dfe3e4', disponivel: '#fff3d4', ligada: '#ddf1e4' }[st];
      e.rects.forEach(r => R(r, cor));
      if (e.tipoJogo === 'bloqueado' && Cm.limites) e.rects.forEach(r => { const [a, b] = P(r[0], r[1]); c.save(); c.beginPath(); c.rect(a, b, (r[2] - r[0]) * s, (r[3] - r[1]) * s); c.clip(); c.strokeStyle = 'rgba(179,57,42,.35)'; c.lineWidth = 1.5; for (let k = -2000; k < 2000; k += 9) { c.beginPath(); c.moveTo(a + k, b); c.lineTo(a + k + 400, b + 400); c.stroke(); } c.restore(); });
    });
    if (this.camadas.alcance && this.alc) this.desenharAlcance(c);
    // paredes e janelas
    if (Cm.arq) {
      caixasGulosas(WALL).forEach(r => R(r, '#36444a'));
      caixasGulosas(WIN).forEach(r => R(r, '#8fc8de', '#36444a', 1));
      // escadas: degraus
      (DP.escadas.lancos || []).forEach(l => {
        const r = l.r; R(r, '#d9d3c7', '#7d878a');
        c.strokeStyle = '#7d878a'; c.lineWidth = 1;
        for (let k = 1; k < l.degraus; k++) { const y = r[1] + k * (r[3] - r[1]) / l.degraus; const [a, b] = P(r[0], y); c.beginPath(); c.moveTo(a, b); c.lineTo(a + (r[2] - r[0]) * s, b); c.stroke(); }
      });
      // portas: vão + folha + arco
      Object.values(PORTAS).forEach(p => {
        const b = p.box;
        if (p.jogavel === false && !p.vistaAberta) { R(p.ab, '#8f989b'); return; }
        if (p.vistaAberta) { R(b, '#d9d3c7'); return; }
        R(b, p.trancada && o.jogo ? '#d1503d' : '#f3efe5');
        if (!p.folhas || s < 8) return;
        c.strokeStyle = p.trancada && o.jogo ? '#b3392a' : '#55626a'; c.lineWidth = 1.2;
        const n = p.folhas, span = p.vertical ? b[3] - b[1] : b[2] - b[0], L = span / n;
        for (let k = 0; k < n; k++) {
          const sg = k === 0 ? 1 : -1;
          let hx, hy, ex, ey, a0, a1;
          if (p.vertical) { hx = p.lado[0] > 0 ? b[2] : b[0]; hy = k === 0 ? b[1] : b[3]; ex = hx + p.lado[0] * L; ey = hy; }
          else { hy = p.lado[1] > 0 ? b[3] : b[1]; hx = k === 0 ? b[0] : b[2]; ex = hx; ey = hy + p.lado[1] * L; }
          const [ha, hb] = P(hx, hy), [ea, eb] = P(ex, ey);
          c.beginPath(); c.moveTo(ha, hb); c.lineTo(ea, eb); c.stroke();
          const ang0 = Math.atan2(eb - hb, ea - ha);
          const ang1 = p.vertical ? Math.atan2(sg * L * s, 0) : Math.atan2(0, sg * L * s);
          c.setLineDash([3, 3]); c.beginPath(); c.arc(ha, hb, L * s, Math.min(ang0, ang1), Math.max(ang0, ang1)); if (Math.abs(ang0 - ang1) > Math.PI) { c.beginPath(); c.arc(ha, hb, L * s, Math.max(ang0, ang1), Math.min(ang0, ang1) + Math.PI * 2); } c.stroke(); c.setLineDash([]);
        }
      });
    }
    // mobiliário observado
    if (Cm.mob) {
      const cores = { ecra: '#2f6f3f', bancada_tecnica: '#c56d15', bancada_armario: '#2a46c8', mesa: '#6f8c9c', mesa_professor: '#5c4a98', bancada_alta: '#2f7f3a', bancada_rodada: '#8a2f8a', carro: '#c42cc4', carregador: '#8e6bd6', rover: '#1f9a9a', mesa_redonda: '#0aa6b8', mesa_diamond: '#a85a5a', armario_curvo: '#a19a12' };
      DP.mobiliario.forEach(m => {
        c.strokeStyle = cores[m.tipo] || '#555'; c.fillStyle = (cores[m.tipo] || '#555') + '22'; c.lineWidth = 1.4;
        if (m.quad) { c.beginPath(); m.quad.forEach((q, i) => { const [a, b] = P(q[0], q[1]); i ? c.lineTo(a, b) : c.moveTo(a, b); }); c.closePath(); c.fill(); c.stroke(); }
        else if (m.arco) { const a = m.arco, [cx, cy] = P(a.c[0], a.c[1]), A = a.angulo * Math.PI / 180; c.beginPath(); c.arc(cx, cy, a.raioExt * s, -Math.PI / 2 - A, -Math.PI / 2 + A); c.arc(cx, cy, a.raioInt * s, -Math.PI / 2 + A, -Math.PI / 2 - A, true); c.closePath(); c.fill(); c.stroke(); }
        else if (m.c && m.raio) { const [cx, cy] = P(m.c[0], m.c[1]); c.beginPath(); if (m.tipo === 'mesa_diamond') { for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; const [x, y] = [cx + Math.cos(a) * m.raio * s * 0.92, cy + Math.sin(a) * m.raio * s * 0.92]; k ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath(); } else c.arc(cx, cy, m.raio * s, 0, Math.PI * 2); c.fill(); c.stroke(); }
        else if (m.r) { const [a, b] = P(m.r[0], m.r[1]); c.fillRect(a, b, (m.r[2] - m.r[0]) * s, (m.r[3] - m.r[1]) * s); c.strokeRect(a, b, (m.r[2] - m.r[0]) * s, (m.r[3] - m.r[1]) * s); }
      });
      if (s > 9) {
        c.strokeStyle = '#7b8a90'; c.lineWidth = 1;
        DP.cadeiras.lista.forEach(ch => { const [x, y] = P(ch.c[0], ch.c[1]), r = 0.2 * s; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.moveTo(x - Math.sin(ch.rot) * r, y - Math.cos(ch.rot) * r); c.lineTo(x - Math.sin(ch.rot) * r * 1.8, y - Math.cos(ch.rot) * r * 1.8); c.stroke(); });
      }
      (DP.quadros_eletricos || []).forEach(q => R(q.r, '#cdbb85'));
    }
    if (Cm.constr) {
      (DP.a_construir || []).forEach(k => { const [a, b] = P(k.r[0], k.r[1]); R(k.r, 'rgba(255,255,255,.6)', '#c8352a', 1.6); c.save(); c.beginPath(); c.rect(a, b, (k.r[2] - k.r[0]) * s, (k.r[3] - k.r[1]) * s); c.clip(); c.strokeStyle = 'rgba(200,53,42,.6)'; c.lineWidth = 1; c.beginPath(); c.moveTo(a, b); c.lineTo(a + (k.r[2] - k.r[0]) * s, b + (k.r[3] - k.r[1]) * s); c.moveTo(a + (k.r[2] - k.r[0]) * s, b); c.lineTo(a, b + (k.r[3] - k.r[1]) * s); c.stroke(); c.restore(); });
      (DP.existente_sem_tipo || []).forEach(k => R(k.r, 'rgba(120,130,134,.25)', '#5d686c', 1.2));
    }
    // limites
    if (Cm.limites) (DP.limites.barreiras || []).forEach(b => R(b.r, '#e2a82c', '#8a5f00', 1));
    // objetos do jogo
    if (Cm.jogo) {
      Object.entries(SALAS).forEach(([mid, S]) => {
        const st = UI.estadoSala(mid), [x, y] = P(S.consola.x, S.consola.y), [px, py] = P(S.ponto.x, S.ponto.y);
        c.strokeStyle = 'rgba(226,168,44,.55)'; c.setLineDash([4, 3]); c.lineWidth = 1.2; c.beginPath(); c.arc(px, py, S.raio * s, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
        const t = Math.max(7, 0.3 * s); c.fillStyle = COR_EST[st]; c.strokeStyle = '#14232b'; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(x, y - t); c.lineTo(x + t, y); c.lineTo(x, y + t); c.lineTo(x - t, y); c.closePath(); c.fill(); c.stroke();
        if (S.ecra && S.ecra.tipo === 'ficcional') { const e = S.ecra, n = e.n, hw = e.w / 2; const r = n[0] ? [e.x - 0.06, e.y - hw, e.x + 0.06, e.y + hw] : [e.x - hw, e.y - 0.06, e.x + hw, e.y + 0.06]; R(r, '#e2a82c'); }
        if (S.zonas) S.zonas.forEach(z => { const [a, b] = P(z.x, z.y); c.strokeStyle = '#e2a82c'; c.beginPath(); c.arc(a, b, 0.35 * s, 0, Math.PI * 2); c.stroke(); });
        if (S.impressora) R(S.impressora.r, 'rgba(226,168,44,.4)', '#e2a82c', 1.2);
      });
    }
    // rótulos
    if (Cm.rotulos) {
      c.textBaseline = 'top';
      PLANTA.espacos.forEach(e => {
        const r = e.rects[0], [a, b] = P(r[0], r[1]), wpx = (r[2] - r[0]) * s;
        if (wpx < 46 && e.tipoJogo !== 'sala') return;
        if (e.tipoJogo === 'bloqueado' && e.id !== 'escadas') return;
        const big = wpx > 150, mid = salaDeEspaco(e.id), m = mid ? missao(mid) : null;
        c.fillStyle = '#14232b';
        // o rótulo tem de caber no espaço: reduz a letra, depois abrevia, senão omite
        const nome = e.nome.replace(' (acesso ao piso superior)', '').replace(' (função não indicada)', '');
        const curto = nome.replace(/^Sala /, '').replace(/^Lab(oratório)? (de )?Apoio /i, 'Lab ').replace(/^Corredor$/, 'Corr.');
        const cabe = wpx - 10;
        let feito = false;
        for (const [t, f] of [[nome, big ? 15 : 11], [nome, 9], [curto, 11], [curto, 9]]) {
          c.font = `700 ${f}px ${FONT}`;
          if (c.measureText(t).width <= cabe) { c.fillText(t, a + 6, b + 5); feito = true; break; }
        }
        if (!feito) return;
        if (m && o.jogo && big) { c.fillStyle = '#7a5600'; c.font = `600 12px ${FONT}`; c.fillText('No jogo: ' + m.title, a + 6, b + 24); const n = m.levels.filter(L => UI.feito(L.id)).length; c.fillStyle = '#4f646e'; c.fillText(`${n} de ${m.levels.length} níveis`, a + 6, b + 40); }
      });
      c.textBaseline = 'alphabetic';
    }
    // aluno
    if (o.jogo || this.aba !== 'comparar') {
      const [px, py] = P(Mundo.pos.x, Mundo.pos.z), r = Math.max(5, 0.28 * s);
      c.fillStyle = '#ffffff'; c.beginPath(); c.arc(px, py, r + 2, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#1f3d50'; c.beginPath(); c.arc(px, py, r, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#e2a82c'; c.lineWidth = 3; c.beginPath(); c.moveTo(px, py); c.lineTo(px + Math.sin(Mundo.yaw) * r * 1.9, py + Math.cos(Mundo.yaw) * r * 1.9); c.stroke();
    }
  },
  desenharAlcance(c) {
    const v = this.vista, s = v.s, a = this.alc;
    c.fillStyle = 'rgba(63,174,116,.28)';
    const passo = 4;   // células (20 cm) para desenhar depressa
    for (let j = 0; j < GH; j += passo) for (let i = 0; i < GW; i += passo) if (a[j * GW + i]) c.fillRect(v.ox + (GX0 + i * RES) * s, v.oy + (GZ0 + j * RES) * s, passo * RES * s + 0.5, passo * RES * s + 0.5);
  },
  destacar(c, el) {
    const v = this.vista, s = v.s, P = (x, y) => [v.ox + x * s, v.oy + y * s];
    const r = el.bbox; if (!r) return;
    const [a, b] = P(r[0], r[1]);
    c.strokeStyle = '#e2a82c'; c.lineWidth = 3; c.setLineDash([6, 4]); c.strokeRect(a - 3, b - 3, (r[2] - r[0]) * s + 6, (r[3] - r[1]) * s + 6); c.setLineDash([]);
  },

  /* ---------- clique: navegar (mapa) ou consultar (comparar) ---------- */
  pontoMundo(e) {
    const r = this.cv.getBoundingClientRect(), v = this.vista;
    let px = e.clientX - r.left;
    if (this.aba === 'comparar' && this.modoComp === 'lado' && px > r.width / 2) px -= r.width / 2;
    return [(px - v.ox) / v.s, (e.clientY - r.top - v.oy) / v.s];
  },
  clique(e) {
    const [x, y] = this.pontoMundo(e);
    const el = this.elementoEm(x, y);
    this.sel = el; this.lateral(); this.desenhar();
    if (this.aba !== 'mapa') return;
    const esp = espacoEm(x, y); if (!esp) return;
    const mid = salaDeEspaco(esp.id);
    if (mid && UI.desbloqueada(mid) && (!el || el.tipo === 'espaco' || el.tipo === 'consola')) {
      const S = SALAS[mid];
      Mundo.teleporte(S.ponto.x, S.ponto.y, Math.atan2(S.consola.x - S.ponto.x, S.consola.y - S.ponto.y));
      Mundo.foco = Mundo.interativos.find(i => i.mid === mid) || null;
      this.desenhar();
      UI.abrirTerminal(mid);
    } else if (mid && !UI.desbloqueada(mid)) UI.toast(UI.msgBloqueio(mid));
  },
  elementoEm(x, y) {
    const near = (r, m = 0) => x >= r[0] - m && x <= r[2] + m && y >= r[1] - m && y <= r[3] + m;
    for (const [mid, S] of Object.entries(SALAS)) {
      if (Math.hypot(x - S.consola.x, y - S.consola.y) < 0.45) return { tipo: 'consola', titulo: 'Consola de missão', bbox: [S.consola.x - 0.3, S.consola.y - 0.3, S.consola.x + 0.3, S.consola.y + 0.3], linhas: [['Missão', missao(mid).title], ['Origem', ROTULO_ORIGEM.ficcional], ['Posição', 'calculada junto à porta, com chão livre e alcançável']] };
    }
    for (const m of DP.mobiliario) {
      let b = m.r; if (m.quad) { const xs = m.quad.map(q => q[0]), ys = m.quad.map(q => q[1]); b = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; }
      if (m.c && m.raio && !b) b = [m.c[0] - m.raio, m.c[1] - m.raio, m.c[0] + m.raio, m.c[1] + m.raio];
      if (b && near(b, 0.02)) {
        const dim = m.r ? `${(m.r[2] - m.r[0]).toFixed(2)} × ${(m.r[3] - m.r[1]).toFixed(2)} m` : m.raio ? `raio ${m.raio} m` : '—';
        return { tipo: 'movel', titulo: NOME_TIPO[m.tipo] || m.tipo, bbox: b, linhas: [['Legenda', m.codigo], ['Descrição', m.descricao], ['Em planta', dim + ' · ' + ROTULO_ORIGEM.medido], ['Altura', `${alt(m.altura, '?')} m · ${ROTULO_ORIGEM[m.altura && m.altura.origem] || ''}`], ['Origem', ROTULO_ORIGEM[m.origem] + (m.fonte ? ' (' + m.fonte + ')' : '')], ...(m.nota ? [['Nota', m.nota]] : [])] };
      }
    }
    for (const k of (DP.a_construir || [])) if (near(k.r)) return { tipo: 'construir', titulo: 'Elemento a construir', bbox: k.r, linhas: [['Tipo', 'não especificado na planta'], ['Em planta', `${(k.r[2] - k.r[0]).toFixed(2)} × ${(k.r[3] - k.r[1]).toFixed(2)} m`], ['Altura', `${alt(k.altura)} m · ${ROTULO_ORIGEM.estimado}`], ['Origem', 'Legenda «Construir»']] };
    for (const k of (DP.existente_sem_tipo || [])) if (near(k.r)) return { tipo: 'existente', titulo: 'Elemento existente', bbox: k.r, linhas: [['Nota', k.nota], ['Altura', `${alt(k.altura)} m · ${ROTULO_ORIGEM.estimado}`]] };
    for (const p of Object.values(PORTAS)) if (near(p.ab, 0.1)) return { tipo: 'porta', titulo: 'Porta ' + p.id.replace('p_', ''), bbox: p.ab, linhas: [['Liga', p.liga.map(id => (PLANTA.espacos.find(e => e.id === id) || { nome: id }).nome).join(' ↔ ')], ['Largura', `${p.largura} m · ${ROTULO_ORIGEM.medido}`], ['Altura', `${PLANTA.alturaPorta} m · ${ROTULO_ORIGEM.estimado}`], ['Origem', ROTULO_ORIGEM[p.origem]], ['Nota', p.nota], ['No jogo', p.jogavel === false ? 'fechada (fora da área de jogo)' : p.trancada ? 'trancada até concluíres a sala anterior' : 'aberta']] };
    for (const j of DP.janelas) { const a = Math.min(j.face_interior, j.face_exterior), b = Math.max(j.face_interior, j.face_exterior); const r = j.eixo === 'x' ? [j.de, a, j.ate, b] : [a, j.de, b, j.ate]; if (near(r, 0.15)) return { tipo: 'janela', titulo: 'Janela · fachada ' + j.fachada.replace('_', ' '), bbox: r, linhas: [['Largura', `${(j.ate - j.de).toFixed(2)} m · ${ROTULO_ORIGEM.medido}`], ['Peitoril e altura', `${PLANTA.peitoril} m e ${PLANTA.alturaJanela} m · ${ROTULO_ORIGEM.estimado}`], ['Origem', ROTULO_ORIGEM[j.origem]]] }; }
    const esp = espacoEm(x, y);
    if (esp) {
      const area = esp.rects.reduce((a, r) => a + (r[2] - r[0]) * (r[3] - r[1]), 0), mid = salaDeEspaco(esp.id), ms = DP.missoes.find(m => m.espaco === esp.id);
      return { tipo: 'espaco', titulo: esp.nome, bbox: esp.rects.reduce((a, r) => [Math.min(a[0], r[0]), Math.min(a[1], r[1]), Math.max(a[2], r[2]), Math.max(a[3], r[3])], [1e9, 1e9, -1e9, -1e9]),
        linhas: [['Área', `≈ ${area.toFixed(1)} m² · ${ROTULO_ORIGEM.medido}`], ['Nome', esp.nome_origem], ['Pé-direito', `${PLANTA.peDireito} m · ${ROTULO_ORIGEM.estimado}`], ...(esp.tipo === 'fora_de_jogo' ? [['No jogo', 'fora da área de jogo']] : []), ...(ms ? [['Função no jogo', ms.funcao + ' · ' + ROTULO_ORIGEM.proposta]] : [])] };
    }
    return null;
  },

  /* ---------- verificação de ligações (mesma grelha do jogo) ---------- */
  verificar() {
    const rad = Math.ceil(0.28 / RES), livre = new Uint8Array(GW * GH);
    // célula livre se todo o quadrado do raio do aluno for caminhável
    const walk = new Uint8Array(GW * GH);
    for (let k = 0; k < GW * GH; k++) walk[k] = grid[k] === WALK ? 1 : 0;
    Object.values(PORTAS).forEach(p => { if (p.trancada && p.jogavel !== false) {} });
    const rowOk = new Uint8Array(GW * GH);
    for (let j = 0; j < GH; j++) { let run = 0; for (let i = 0; i < GW; i++) { run = walk[j * GW + i] ? run + 1 : 0; rowOk[j * GW + i] = run >= 2 * rad - 1 ? 1 : 0; } }
    for (let i = 0; i < GW; i++) { let run = 0; for (let j = 0; j < GH; j++) { run = rowOk[j * GW + i] ? run + 1 : 0; if (run >= 2 * rad - 1) livre[(j - rad + 1) * GW + (i - rad + 1)] = 1; } }
    const alc = new Uint8Array(GW * GH);
    const si = Math.floor((DP.inicio.x - GX0) / RES), sj = Math.floor((DP.inicio.y - GZ0) / RES);
    const fila = new Int32Array(GW * GH); let h = 0, t = 0;
    const k0 = sj * GW + si; alc[k0] = 1; fila[t++] = k0;
    while (h < t) {
      const k = fila[h++], i = k % GW, j = (k / GW) | 0;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const ni = i + di, nj = j + dj; if (ni < 0 || nj < 0 || ni >= GW || nj >= GH) continue;
        const nk = nj * GW + ni; if (!alc[nk] && livre[nk]) { alc[nk] = 1; fila[t++] = nk; }
      }
    }
    this.alc = alc;
    const em = (x, y) => alc[Math.floor((y - GZ0) / RES) * GW + Math.floor((x - GX0) / RES)];
    const espacos = PLANTA.espacos.filter(e => e.tipoJogo !== 'bloqueado').map(e => {
      let ok = false;
      e.rects.forEach(r => { for (let y = r[1] + 0.1; y < r[3] && !ok; y += 0.1) for (let x = r[0] + 0.1; x < r[2]; x += 0.1) if (em(x, y)) { ok = true; break; } });
      return { nome: e.nome, ok };
    });
    const consolas = Object.entries(SALAS).map(([mid, S]) => ({ nome: (PLANTA.espacos.find(e => e.id === S.espaco) || {}).nome + ' · consola', ok: !!em(S.ponto.x, S.ponto.y) }));
    const ligacoes = PLANTA.portas.map(p => ({ id: p.id, txt: p.liga.map(id => (PLANTA.espacos.find(e => e.id === id) || { nome: id === 'exterior' ? 'Exterior' : id }).nome).join(' ↔ '), jogavel: p.jogavel !== false }));
    this.resultado = { espacos, consolas, ligacoes, fora: PLANTA.espacos.filter(e => e.tipoJogo === 'bloqueado').map(e => e.nome) };
  },

  /* ---------- painel lateral ---------- */
  lateral() {
    const el = $('#mapaLado'), a = this.aba;
    const leg = (cor, t, tipo = 'q') => `<li><i class="lg lg-${tipo}" style="--c:${cor}"></i>${t}</li>`;
    let h = '';
    if (this.sel) {
      h += `<section class="ficha"><div class="d-flex justify-content-between align-items-start gap-2"><h3 class="h6 fw-bold mb-1">${esc(this.sel.titulo)}</h3><button class="btn btn-sm btn-link p-0" data-acao="mapaLimparSel" aria-label="Fechar a ficha">✕</button></div><dl class="mb-0">${this.sel.linhas.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></section>`;
    }
    if (a === 'mapa') {
      h += `<section><h3 class="h6 fw-bold">Mapa jogável</h3><p class="small mb-2">Anda com <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> (para cima é o topo da folha). Junto a uma consola ◆, carrega em <kbd>E</kbd>. Clicar numa sala aberta leva-te à consola.</p>
        <ul class="legenda-mapa">${leg('#fff3d4', 'Sala disponível')}${leg('#ddf1e4', 'Sala ligada')}${leg('#dfe3e4', 'Sala bloqueada')}${leg('#d1503d', 'Porta trancada pelo progresso')}${leg('#e2a82c', 'Consola do jogo (ficcional)', 'd')}${leg('#b9c0c2', 'Fora da área de jogo', 'x')}</ul></section>`;
    } else if (a === 'comparar') {
      h += `<section><h3 class="h6 fw-bold">Comparar com a planta</h3><p class="small mb-2">A planta de referência é o PDF original, posicionado à mesma escala. Usa a roda do rato ou os botões para aproximar. Clica num elemento para ver de onde vem cada medida.</p>
        <ul class="legenda-mapa">${leg('#36444a', 'Paredes (volume − espaços − vãos)')}${leg('#8fc8de', 'Janelas observadas')}${leg('#6f8c9c', 'Mobiliário observado (cor da legenda)', 'o')}${leg('#c8352a', 'Elemento «a construir»', 'o')}${leg('#e2a82c', 'Objetos do jogo (ficcionais)', 'd')}</ul>
        <p class="small text-secondary mb-0">${esc(DP.meta.aviso)}</p></section>`;
    } else if (a === 'ligacoes') {
      const R = this.resultado || { espacos: [], consolas: [], ligacoes: [], fora: [] };
      const okTodos = R.espacos.every(x => x.ok) && R.consolas.every(x => x.ok);
      const li = x => `<li class="${x.ok ? 'ok' : 'falha'}"><span>${x.ok ? '✓' : '✗'}</span>${esc(x.nome)}</li>`;
      h += `<section><h3 class="h6 fw-bold">Verificação de ligações</h3>
        <p class="small mb-2 ${okTodos ? 'text-success' : 'text-danger'} fw-bold">${okTodos ? 'Todos os espaços jogáveis e todas as consolas são alcançáveis a partir do início.' : 'Há espaços ou consolas que não são alcançáveis.'}</p>
        <p class="small text-secondary mb-2">Pesquisa na grelha de 5 cm, com o raio do aluno (0,28 m), com todas as portas jogáveis abertas. A área verde no mapa é a alcançável.</p>
        <h4 class="lbl">Espaços</h4><ul class="verif">${R.espacos.map(li).join('')}</ul>
        <h4 class="lbl">Consolas</h4><ul class="verif">${R.consolas.map(li).join('')}</ul>
        <h4 class="lbl">Portas e ligações</h4><ul class="verif">${R.ligacoes.map(l => `<li class="${l.jogavel ? 'ok' : 'neutro'}"><span>${l.jogavel ? '↔' : '■'}</span>${esc(l.txt)}${l.jogavel ? '' : ' · fechada'}</li>`).join('')}</ul>
        <h4 class="lbl">Fora da área de jogo</h4><p class="small mb-0">${R.fora.map(esc).join(' · ')}. As escadas ficam visíveis como referência, com barreira e sinal.</p></section>`;
    } else if (a === 'dados') {
      const cont = {}; const somar = o => { if (o && o.origem) cont[o.origem] = (cont[o.origem] || 0) + 1; };
      DP.espacos.forEach(somar); DP.portas.forEach(somar); DP.janelas.forEach(somar); DP.mobiliario.forEach(somar); (DP.a_construir || []).forEach(somar); Object.values(DP.alturas).forEach(somar); DP.missoes.forEach(somar); DP.consolas.forEach(somar);
      h += `<section><h3 class="h6 fw-bold">Dados e origem</h3>
        <p class="small mb-2">Tudo o que o jogo desenha vem destes dados: espaços, paredes, portas, janelas, obstáculos, posição inicial, consolas e missões. Cada valor indica a sua origem.</p>
        <ul class="verif">${Object.entries(cont).map(([k, n]) => `<li class="neutro"><span>${n}</span>${esc(ROTULO_ORIGEM[k] || k)}</li>`).join('')}</ul>
        <p class="small mb-2">Fonte: ${esc(DP.meta.fonte)}. Escala validada: ${DP.meta.validacao_escala.map(v => `cota ${v.cota} mm ↔ ${v.medido.toFixed(2)} m`).join(', ')}.</p>
        <p class="small mb-2"><b>Não legível ou não definido na planta:</b> ${DP.meta.nao_legivel.map(esc).join('; ')}.</p>
        ${DP.__editado ? '<p class="small fw-bold text-warning-emphasis mb-2">Estás a usar dados editados neste navegador.</p>' : ''}
        <label for="mapaJson" class="lbl">Dados (JSON editável)</label>
        <textarea id="mapaJson" class="form-control font-monospace" rows="9" spellcheck="false"></textarea>
        <div id="mapaJsonMsg" class="small mt-1" role="status"></div>
        <div class="d-flex flex-wrap gap-2 mt-2"><button class="btn btn-outline-primary btn-sm" data-acao="dadosCopiar">Copiar</button><button class="btn btn-primary btn-sm" data-acao="dadosAplicar">Aplicar alterações</button><button class="btn btn-outline-secondary btn-sm" data-acao="dadosRepor">Repor dados originais</button></div>
        <p class="small text-secondary mt-2 mb-0">Exemplos: mudar <code>alturas.peDireito.v</code>, mover uma consola em <code>consolas</code>, ou corrigir o vão de uma porta em <code>portas</code>. Ao aplicar, o jogo recarrega com os novos dados.</p></section>`;
    }
    el.innerHTML = h;
    if (a === 'dados') $('#mapaJson').value = JSON.stringify(Object.assign({}, DP, { __editado: undefined }), null, 1);
  },
  aplicarDados() {
    const msg = $('#mapaJsonMsg');
    let o;
    try { o = JSON.parse($('#mapaJson').value); } catch (e) { msg.className = 'small mt-1 text-danger'; msg.textContent = 'O JSON tem um erro de sintaxe: ' + e.message; return; }
    const falta = ['versao', 'meta', 'alturas', 'bloco', 'espacos', 'portas', 'janelas', 'mobiliario', 'cadeiras', 'escadas', 'inicio', 'limites', 'consolas', 'missoes', 'ficcionais', 'ecras_observados', 'exterior'].filter(k => !(k in o));
    if (falta.length) { msg.className = 'small mt-1 text-danger'; msg.textContent = 'Faltam campos obrigatórios: ' + falta.join(', ') + '.'; return; }
    try { localStorage.setItem(DADOS_KEY, JSON.stringify(o)); } catch (e) { msg.className = 'small mt-1 text-danger'; msg.textContent = 'Não foi possível guardar neste navegador.'; return; }
    msg.className = 'small mt-1 text-success'; msg.textContent = 'Dados guardados. A recarregar…';
    setTimeout(() => location.reload(), 400);
  },

  /* ---------- minimapa (HUD) ---------- */
  mini(cv) {
    const dpr = Math.min(2, window.devicePixelRatio || 1), W = cv.clientWidth, H = cv.clientHeight; if (!W) return;
    if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
    const b = [-0.6, -4.2, 23.2, 22.9], s = Math.min((W - 12) / (b[2] - b[0]), (H - 12) / (b[3] - b[1]));
    const ox = (W - (b[2] - b[0]) * s) / 2 - b[0] * s, oy = (H - (b[3] - b[1]) * s) / 2 - b[1] * s;
    const R = (r, cor) => { c.fillStyle = cor; c.fillRect(ox + r[0] * s, oy + r[1] * s, (r[2] - r[0]) * s, (r[3] - r[1]) * s); };
    PLANTA.volumes.forEach(r => R(r, '#59656a'));
    PLANTA.espacos.forEach(e => { const mid = salaDeEspaco(e.id); const cor = e.tipoJogo === 'bloqueado' ? '#8c979a' : e.tipoJogo === 'circulacao' ? '#ece6d8' : mid ? { bloqueada: '#3d474b', disponivel: '#e2a82c', ligada: '#3fae74' }[UI.estadoSala(mid)] : '#c9d2d0'; e.rects.forEach(r => R(r, cor)); });
    Object.values(PORTAS).forEach(p => { if (p.jogavel !== false) R(p.box, p.trancada ? '#b3392a' : '#ece6d8'); });
    const px = ox + Mundo.pos.x * s, py = oy + Mundo.pos.z * s;
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(px, py, 4.5, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#e2a82c'; c.beginPath(); c.arc(px, py, 3.2, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#ffffff'; c.lineWidth = 2; c.beginPath(); c.moveTo(px, py); c.lineTo(px + Math.sin(Mundo.yaw) * 10, py + Math.cos(Mundo.yaw) * 10); c.stroke();
  }
};
Mundo.interativos = Object.keys(SALAS).map(mid => ({ x: SALAS[mid].ponto.x, z: SALAS[mid].ponto.y, r: SALAS[mid].raio, mid }));
