/* =========================================================
   CTE Online · grelha de ocupação e mundo 3D (Three.js)
   Tudo é construído a partir de DP (dados da planta).
   ========================================================= */
const RES = 0.05, GX0 = -1, GZ0 = -12, GXN = 25.5, GZN = 24;
const GW = Math.ceil((GXN - GX0) / RES), GH = Math.ceil((GZN - GZ0) / RES);
const VOID = 0, WALK = 1, WALL = 2, BLOCK = 3, PROP = 4, WIN = 5;
const grid = new Uint8Array(GW * GH);
const gi = (x, z) => { const i = Math.floor((x - GX0) / RES), j = Math.floor((z - GZ0) / RES); return (i < 0 || j < 0 || i >= GW || j >= GH) ? -1 : j * GW + i; };
const gAt = (x, z) => { const k = gi(x, z); return k < 0 ? VOID : grid[k]; };
function gFill(r, v, cond) {
  const i0 = Math.max(0, Math.round((r[0] - GX0) / RES)), i1 = Math.min(GW, Math.round((r[2] - GX0) / RES));
  const j0 = Math.max(0, Math.round((r[1] - GZ0) / RES)), j1 = Math.min(GH, Math.round((r[3] - GZ0) / RES));
  const changed = [];
  for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) {
    const k = j * GW + i;
    if (!cond || cond(grid[k])) { if (grid[k] !== v) changed.push(k); grid[k] = v; }
  }
  return changed;
}
function gFillPoly(pts, v) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const i0 = Math.floor((Math.min(...xs) - GX0) / RES), i1 = Math.ceil((Math.max(...xs) - GX0) / RES);
  const j0 = Math.floor((Math.min(...ys) - GZ0) / RES), j1 = Math.ceil((Math.max(...ys) - GZ0) / RES);
  for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) {
    const x = GX0 + (i + 0.5) * RES, y = GZ0 + (j + 0.5) * RES;
    let inside = false;
    for (let a = 0, b = pts.length - 1; a < pts.length; b = a++) {
      const [xa, ya] = pts[a], [xb, yb] = pts[b];
      if ((ya > y) !== (yb > y) && x < (xb - xa) * (y - ya) / (yb - ya) + xa) inside = !inside;
    }
    const k = j * GW + i;
    if (inside && grid[k] === WALK) grid[k] = v;
  }
}
function gFillFn(r, fn, v) {
  const i0 = Math.floor((r[0] - GX0) / RES), i1 = Math.ceil((r[2] - GX0) / RES);
  const j0 = Math.floor((r[1] - GZ0) / RES), j1 = Math.ceil((r[3] - GZ0) / RES);
  for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) {
    const x = GX0 + (i + 0.5) * RES, y = GZ0 + (j + 0.5) * RES, k = j * GW + i;
    if (grid[k] === WALK && fn(x, y)) grid[k] = v;
  }
}
const inRect = (r, x, z) => x >= r[0] && x <= r[2] && z >= r[1] && z <= r[3];
function espacoEm(x, z) { return PLANTA.espacos.find(s => s.rects.some(r => inRect(r, x, z))) || null; }
const centroR = r => [(r[0] + r[2]) / 2, (r[1] + r[3]) / 2];
const arcoDentro = (a, x, y) => { const d = Math.hypot(x - a.c[0], y - a.c[1]); const ang = Math.atan2(x - a.c[0], -(y - a.c[1])) * 180 / Math.PI; return d >= a.raioInt && d <= a.raioExt && Math.abs(ang) <= a.angulo; };

/* ---------- construção da grelha a partir dos dados ---------- */
const PORTAS = {};
(function construirGrelha() {
  PLANTA.volumes.forEach(r => gFill(r, WALL));
  PLANTA.espacos.forEach(s => s.rects.forEach(r => gFill(r, s.tipoJogo === 'bloqueado' ? BLOCK : WALK)));
  PLANTA.exterior.forEach(r => gFill(r, WALK, v => v === VOID));
  if (PLANTA.rampa) gFill(PLANTA.rampa, WALK, v => v === VOID);
  // janelas: células de parede marcadas para recorte
  DP.janelas.forEach(j => {
    const a = Math.min(j.face_interior, j.face_exterior), b = Math.max(j.face_interior, j.face_exterior);
    gFill(j.eixo === 'x' ? [j.de, a, j.ate, b] : [a, j.de, b, j.ate], WIN, v => v === WALL);
  });
  PLANTA.portas.forEach(p => {
    const vista = p.liga.includes('escadas');   // vão aberto para ver as escadas, sem passagem
    const ch = vista ? gFill(p.ab, BLOCK, v => v === WALL || v === WIN) : p.jogavel === false ? [] : gFill(p.ab, WALK, v => v === WALL || v === WIN);
    let x0 = 1e9, z0 = 1e9, x1 = -1e9, z1 = -1e9;
    ch.forEach(k => { const i = k % GW, j = (k / GW) | 0; x0 = Math.min(x0, GX0 + i * RES); x1 = Math.max(x1, GX0 + (i + 1) * RES); z0 = Math.min(z0, GZ0 + j * RES); z1 = Math.max(z1, GZ0 + (j + 1) * RES); });
    if (!ch.length) { [x0, z0, x1, z1] = p.ab; }
    const vertical = (p.ab[2] - p.ab[0]) < (p.ab[3] - p.ab[1]);
    // lado para onde a folha abre: para dentro da sala (ou da entrada)
    const cx = (p.ab[0] + p.ab[2]) / 2, cz = (p.ab[1] + p.ab[3]) / 2;
    const lados = vertical ? [[-1, 0], [1, 0]] : [[0, -1], [0, 1]];
    const peso = n => { const e = espacoEm(cx + n[0] * 0.5, cz + n[1] * 0.5); if (!e) return 0; return e.tipoJogo === 'sala' ? 3 : e.id === 'entrada' ? 2 : e.tipoJogo === 'bloqueado' ? 2.5 : 1; };
    const lado = peso(lados[0]) >= peso(lados[1]) ? lados[0] : lados[1];
    PORTAS[p.id] = { ...p, box: [x0, z0, x1, z1], vertical, lado, vistaAberta: vista, trancada: p.jogavel === false && !vista, abertura: (p.jogavel === false && !vista) ? 0 : 1 };
  });
  // obstáculos: mobiliário observado, elementos a construir, objetos do jogo
  DP.mobiliario.forEach(m => {
    if (m.quad) gFillPoly(m.quad, PROP);
    else if (m.arco) gFillFn(m.r, (x, y) => arcoDentro(m.arco, x, y), PROP);
    else if (m.c && m.raio) { const rr = m.raio * (m.tipo === 'mesa_diamond' ? 0.86 : 1); gFillFn([m.c[0] - rr, m.c[1] - rr, m.c[0] + rr, m.c[1] + rr], (x, y) => Math.hypot(x - m.c[0], y - m.c[1]) <= rr, PROP); }
    else if (m.r) gFill(m.r, PROP, v => v === WALK);
  });
  (DP.a_construir || []).concat(DP.existente_sem_tipo || []).forEach(c => gFill(c.r, PROP, v => v === WALK));
  if (SALAS.m6 && SALAS.m6.impressora) gFill(SALAS.m6.impressora.r, PROP, v => v === WALK);
  (DP.limites.barreiras || []).forEach(b => gFill(b.r, BLOCK, v => v === WALK || v === VOID));
})();

function caixasGulosas(tipo) {
  const vis = new Uint8Array(GW * GH), out = [];
  for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) {
    const k = j * GW + i;
    if (vis[k] || grid[k] !== tipo) continue;
    let w = 1; while (i + w < GW && !vis[k + w] && grid[k + w] === tipo) w++;
    let h = 1, ok = true;
    while (ok && j + h < GH) { for (let t = 0; t < w; t++) { const kk = (j + h) * GW + i + t; if (vis[kk] || grid[kk] !== tipo) { ok = false; break; } } if (ok) h++; }
    for (let a = 0; a < h; a++) for (let t = 0; t < w; t++) vis[(j + a) * GW + i + t] = 1;
    out.push([GX0 + i * RES, GZ0 + j * RES, GX0 + (i + w) * RES, GZ0 + (j + h) * RES]);
  }
  return out;
}

/* ---------- texturas ---------- */
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d'); draw(ctx, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  t.userData = { canvas: c, ctx };
  return t;
}
function redraw(tex, draw) { const { canvas, ctx } = tex.userData; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); draw(ctx, canvas.width, canvas.height); tex.needsUpdate = true; }
const FONT = '"Atkinson Hyperlegible","Segoe UI",system-ui,sans-serif';
function wrapText(ctx, text, x, y, maxW, lh, maxLines) {
  const words = String(text).split(/\s+/); let line = '', n = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];
    if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, y + n * lh); line = words[i]; n++; if (maxLines && n >= maxLines) return n; }
    else line = test;
  }
  if (line) { ctx.fillText(line, x, y + n * lh); n++; }
  return n;
}
let semente = 7;
const rnd = () => (semente = (semente * 16807) % 2147483647) / 2147483647;
function texRepetida(tamanhoM, draw, px = 512) {
  const t = canvasTex(px, px, draw);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.userData.tam = tamanhoM;
  return t;
}
const TEX = {};
function prepararTexturas() {
  TEX.vinil = texRepetida(2.0, (c, w, h) => {
    c.fillStyle = '#c3ccd0'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { c.fillStyle = `rgba(${rnd() < .5 ? '60,72,78' : '255,255,255'},${0.05 + rnd() * 0.08})`; const s = 1 + rnd() * 3; c.fillRect(rnd() * w, rnd() * h, s, s); }
    c.strokeStyle = 'rgba(70,82,88,.35)'; c.lineWidth = 2; c.strokeRect(1, 1, w - 2, h - 2);
  });
  TEX.terrazo = texRepetida(1.2, (c, w, h) => {
    c.fillStyle = '#d8d1c3'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 1800; i++) { const g = rnd(); c.fillStyle = g < .35 ? 'rgba(120,108,92,.55)' : g < .7 ? 'rgba(250,248,240,.7)' : 'rgba(150,160,158,.5)'; c.beginPath(); c.arc(rnd() * w, rnd() * h, 1 + rnd() * 3.5, 0, 7); c.fill(); }
    c.strokeStyle = 'rgba(140,130,115,.6)'; c.lineWidth = 3; c.strokeRect(0, 0, w / 2, h / 2); c.strokeRect(w / 2, 0, w / 2, h / 2); c.strokeRect(0, h / 2, w / 2, h / 2); c.strokeRect(w / 2, h / 2, w / 2, h / 2);
  });
  TEX.calcada = texRepetida(1.6, (c, w, h) => {
    c.fillStyle = '#bdb8ae'; c.fillRect(0, 0, w, h);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const v = 175 + Math.floor(rnd() * 30); c.fillStyle = `rgb(${v},${v - 4},${v - 12})`; c.fillRect(x * w / 4 + 3, y * h / 4 + 3, w / 4 - 6, h / 4 - 6);
    }
    for (let i = 0; i < 1500; i++) { c.fillStyle = `rgba(80,76,70,${rnd() * 0.12})`; c.fillRect(rnd() * w, rnd() * h, 2, 2); }
  });
  TEX.relva = texRepetida(4, (c, w, h) => {
    c.fillStyle = '#7e9c6f'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) { c.strokeStyle = `rgba(${rnd() < .5 ? '60,90,45' : '160,185,120'},${0.15 + rnd() * 0.25})`; const x = rnd() * w, y = rnd() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (rnd() - .5) * 4, y - 3 - rnd() * 5); c.stroke(); }
  });
  TEX.madeira = texRepetida(1.0, (c, w, h) => {
    c.fillStyle = '#c9a77c'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) { c.strokeStyle = `rgba(120,80,40,${0.06 + rnd() * 0.1})`; c.lineWidth = 1 + rnd() * 3; const y = rnd() * h; c.beginPath(); c.moveTo(0, y); c.bezierCurveTo(w * .3, y + (rnd() - .5) * 20, w * .7, y + (rnd() - .5) * 20, w, y); c.stroke(); }
  }, 256);
  TEX.construir = texRepetida(0.6, (c, w, h) => {
    c.fillStyle = '#e9e6e0'; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(200,53,42,.28)'; c.lineWidth = 3;
    for (let i = -h; i < w; i += 96) { c.beginPath(); c.moveTo(i, h); c.lineTo(i + h, 0); c.stroke(); }
  }, 256);
}
function planoUV(w, d) {
  const g = new THREE.PlaneGeometry(w, d);
  return g;
}
function escalarUV(g, sx, sy) { const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * sx, uv.getY(i) * sy); uv.needsUpdate = true; return g; }

/* ---------- miniatura da página do aluno ---------- */
const IMG_CACHE = {};
Object.keys(IMGS).forEach(k => { const im = new Image(); im.src = IMGS[k]; IMG_CACHE[k] = im; });
function desenharPagina(ctx, W, H, snap, crop, opts = {}) {
  ctx.fillStyle = opts.fundo || '#ffffff'; ctx.fillRect(0, 0, W, H);
  if (!snap) {
    ctx.fillStyle = '#7d8b90'; ctx.font = `600 ${Math.round(H * 0.07)}px ${FONT}`; ctx.textAlign = 'center';
    ctx.fillText(opts.vazio || 'À espera do teu código…', W / 2, H / 2); ctx.textAlign = 'left'; return;
  }
  const c = crop || { x: 0, y: 0, w: snap.w, h: Math.min(snap.h, snap.w * H / W) };
  const s = Math.min(W / c.w, H / c.h), ox = (W - c.w * s) / 2, oy = (H - c.h * s) / 2;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  const bodyBg = snap.bodyBg && !/rgba\(0, 0, 0, 0\)|transparent/.test(snap.bodyBg) ? snap.bodyBg : '#ffffff';
  ctx.fillStyle = bodyBg; ctx.fillRect(ox, oy, c.w * s, c.h * s);
  ctx.translate(ox, oy); ctx.scale(s, s); ctx.translate(-c.x, -c.y);
  const visivel = e => e.x + e.w > c.x && e.x < c.x + c.w && e.y + e.h > c.y && e.y < c.y + c.h;
  snap.els.forEach(e => {
    if (!visivel(e)) return;
    const r = Math.min(e.br, e.w / 2, e.h / 2);
    const path = () => { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(e.x, e.y, e.w, e.h, r); else ctx.rect(e.x, e.y, e.w, e.h); };
    if (e.bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(e.bg)) { ctx.fillStyle = e.bg; path(); ctx.fill(); }
    if (e.t === 'img') { const im = IMG_CACHE[e.src] || IMG_CACHE['imagem.svg']; if (im && im.complete) { try { ctx.drawImage(im, e.x, e.y, e.w, e.h); } catch (_) {} } }
    if (/^(input|select|textarea)$/.test(e.t) && (!e.bg || /rgba\(0, 0, 0, 0\)/.test(e.bg))) { ctx.fillStyle = '#ffffff'; path(); ctx.fill(); ctx.strokeStyle = '#8a969a'; ctx.lineWidth = 1; path(); ctx.stroke(); }
    if (e.bw > 0 && e.bc && !/rgba\(0, 0, 0, 0\)/.test(e.bc)) { ctx.strokeStyle = e.bc; ctx.lineWidth = e.bw; path(); ctx.stroke(); }
  });
  snap.els.forEach(e => {
    if (!e.tx || !visivel(e)) return;
    ctx.fillStyle = e.fg || '#1b2526';
    ctx.font = `${+e.fw >= 600 ? 700 : 400} ${e.fs}px ${FONT}`;
    ctx.textBaseline = 'top';
    const pad = /^(input|select|textarea|button)$/.test(e.t) ? 6 : 0;
    const x = e.ta === 'center' ? e.x + e.w / 2 : e.x + pad;
    ctx.textAlign = e.ta === 'center' ? 'center' : 'left';
    const lines = Math.max(1, Math.floor(e.h / (e.fs * 1.3)));
    wrapText(ctx, e.tx, x, e.y + Math.max(0, Math.min(pad, (e.h - e.fs) / 2)), Math.max(20, e.w - pad * 2), e.fs * 1.35, lines);
    ctx.textAlign = 'left';
  });
  ctx.restore();
}

/* ---------- humanoide ---------- */
function criarAluno(av) {
  const g = new THREE.Group();
  const mat = (c, r = 0.75) => new THREE.MeshStandardMaterial({ color: c, roughness: r });
  const pele = mat(av.pele, 0.6), camisola = mat(av.camisola, 0.85), calcas = mat('#2b3440', 0.85), sapatos = mat('#1c1f22', 0.5), cabelo = mat(av.cabelo, 0.7), mochila = mat('#1f3d50', 0.7);
  const parts = {};
  const perna = lado => {
    const p = new THREE.Group(); p.position.set(0.1 * lado, 0.86, 0);
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.62, 4, 10), calcas); m.position.y = -0.4; p.add(m);
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.08, 0.25), sapatos); s.position.set(0, -0.82, 0.04); p.add(s);
    g.add(p); return p;
  };
  const braco = lado => {
    const p = new THREE.Group(); p.position.set(0.25 * lado, 1.38, 0);
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.46, 4, 10), camisola); m.position.y = -0.27; p.add(m);
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.058, 12, 10), pele); h.position.y = -0.56; p.add(h);
    p.rotation.z = 0.08 * lado; g.add(p); return p;
  };
  parts.pe = perna(-1); parts.pd = perna(1); parts.be = braco(-1); parts.bd = braco(1);
  const tronco = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.34, 6, 14), camisola);
  tronco.position.y = 1.15; tronco.scale.set(1, 1, 0.72); g.add(tronco); parts.tronco = tronco;
  const pesc = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.08, 10), pele); pesc.position.y = 1.47; g.add(pesc);
  const cab = new THREE.Group(); cab.position.y = 1.6; g.add(cab); parts.cab = cab;
  cab.add(new THREE.Mesh(new THREE.SphereGeometry(0.125, 18, 14), pele));
  const cb = new THREE.Mesh(new THREE.SphereGeometry(0.133, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), cabelo); cb.rotation.x = -0.25; cab.add(cb);
  const olho = x => { const o = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), mat('#15191c', 0.3)); o.position.set(x, 0.01, 0.115); cab.add(o); };
  olho(-0.045); olho(0.045);
  const mo = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.36, 0.13), mochila); mo.position.set(0, 1.16, -0.17); g.add(mo);
  const mark = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.1), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
  mark.rotation.set(0, Math.PI, Math.PI / 4); mark.position.set(0, 1.2, -0.236); g.add(mark);
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  g.userData.parts = parts; g.userData.mats = { pele, camisola, cabelo };
  return g;
}
function animarAluno(g, fase, amp, t) {
  const p = g.userData.parts;
  const s = Math.sin(fase) * 0.65 * amp;
  p.pe.rotation.x = s; p.pd.rotation.x = -s; p.be.rotation.x = -s * 0.9; p.bd.rotation.x = s * 0.9;
  const resp = Math.sin(t * 1.8) * 0.006 * (1 - amp);
  p.tronco.position.y = 1.15 + Math.abs(Math.cos(fase)) * 0.03 * amp + resp;
  p.cab.position.y = 1.6 + Math.abs(Math.cos(fase)) * 0.03 * amp + resp;
}

/* ---------- lotes de geometria repetida (InstancedMesh) ---------- */
function Lote(scene) {
  const grupos = new Map(), o = new THREE.Object3D();
  const geo = { box: new THREE.BoxGeometry(1, 1, 1), cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 20), cyl6: new THREE.CylinderGeometry(0.5, 0.5, 1, 6) };
  const add = (g, mat, x, y, z, sx, sy, sz, ry = 0, rx = 0) => {
    const key = g + '|' + mat.uuid;
    if (!grupos.has(key)) grupos.set(key, { g, mat, m: [] });
    o.position.set(x, y, z); o.rotation.set(rx, ry, 0); o.scale.set(sx, sy, sz); o.updateMatrix();
    grupos.get(key).m.push(o.matrix.clone());
  };
  return {
    box: (mat, x, y, z, sx, sy, sz, ry, rx) => add('box', mat, x, y, z, sx, sy, sz, ry, rx),
    cyl: (mat, x, y, z, r, h, seis) => add(seis ? 'cyl6' : 'cyl', mat, x, y, z, r * 2, h, r * 2),
    fechar(sombra = true) {
      const out = [];
      grupos.forEach(({ g, mat, m }) => {
        const im = new THREE.InstancedMesh(geo[g], mat, m.length);
        m.forEach((mx, i) => im.setMatrixAt(i, mx));
        im.instanceMatrix.needsUpdate = true; im.castShadow = sombra; im.receiveShadow = true;
        scene.add(im); out.push(im);
      });
      return out;
    }
  };
}

/* =========================================================
   Mundo
   ========================================================= */
const Mundo = {
  pronto: false, pausa: true, qualidade: 'normal',
  keys: {}, joy: { x: 0, y: 0 }, camYaw: 0, camPitch: 0.52, camDist: 4.8, primeira: false,
  pos: { x: PLANTA.inicio.x, z: PLANTA.inicio.y }, yaw: 0, vel: 0, fase: 0, t: 0,
  salas: {}, folhas: {}, interativos: [], foco: null, vista: null, faixa: 0, ecrasMonitor: [], pisos: {},

  init(canvas, opts) {
    this.canvas = canvas;
    this.qualidade = opts.qualidade || 'normal';
    let r;
    try { r = new THREE.WebGLRenderer({ canvas, antialias: this.qualidade !== 'baixa', powerPreference: 'high-performance' }); }
    catch (e) { return false; }
    this.r = r;
    r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    const sc = this.scene = new THREE.Scene();
    sc.fog = new THREE.Fog('#dfe8ec', 40, 95);
    this.cam = new THREE.PerspectiveCamera(58, 1, 0.05, 220);
    this.hemi = new THREE.HemisphereLight('#f4f8ff', '#8d9a8f', 1.25); sc.add(this.hemi);
    const sol = this.sol = new THREE.DirectionalLight('#fff3df', 2.2);
    sol.position.set(-6, 22, -12); sol.target.position.set(11, 0, 9); sc.add(sol, sol.target);
    Object.assign(sol.shadow.camera, { left: -17, right: 17, top: 19, bottom: -19, near: 1, far: 60 });
    sol.shadow.bias = -0.0006; sol.shadow.normalBias = 0.02;
    sol.shadow.camera.updateProjectionMatrix();
    this.ambiente();
    prepararTexturas();
    this.construir();
    this.aluno = criarAluno(opts.avatar);
    sc.add(this.aluno);
    this.setQualidade(this.qualidade);
    this.ligarEventos();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.pronto = true;
    this.ultimo = performance.now();
    requestAnimationFrame(t => this.loop(t));
    return true;
  },

  ambiente() {
    // céu em gradiente
    const ceu = canvasTex(2, 256, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#7fa7c9'); g.addColorStop(0.48, '#cfe0ea'); g.addColorStop(0.5, '#e6ece9'); g.addColorStop(1, '#c7cfc6'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(150, 24, 16), new THREE.MeshBasicMaterial({ map: ceu, side: THREE.BackSide, fog: false, depthWrite: false }));
    dome.position.set(11, 0, 8); this.scene.add(dome);
    // mapa de ambiente para reflexos suaves (sala genérica iluminada)
    try {
      const pm = new THREE.PMREMGenerator(this.r);
      const env = new THREE.Scene();
      const caixa = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 10), new THREE.MeshBasicMaterial({ color: '#9aa4a8', side: THREE.BackSide }));
      env.add(caixa);
      const painel = (x, y, z, w, h, cor) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: cor, side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m); };
      painel(0, 2.9, 0, 6, 6, '#ffffff'); painel(4.9, 0.5, 0, 4, 2, '#d7e6ff'); painel(-4.9, 0.5, 0, 4, 2, '#fff1dc');
      this.envMap = pm.fromScene(env, 0.04).texture;
      pm.dispose();
    } catch (e) { this.envMap = null; }
  },

  mat(cor, opts = {}) {
    return new THREE.MeshStandardMaterial(Object.assign({ color: cor, roughness: 0.8, metalness: 0, envMapIntensity: 0.6 }, opts));
  },

  construir() {
    const sc = this.scene, H = PLANTA.peDireito, M = this.M = {};
    M.parede = this.mat('#eceee9', { roughness: 0.92 });
    M.paredeTopo = this.mat('#4c575b', { roughness: 0.9 });
    M.lambrim = this.mat('#cfdcda', { roughness: 0.85 });
    M.rodape = this.mat('#3e484c', { roughness: 0.6 });
    M.caixilho = this.mat('#3a4246', { roughness: 0.4, metalness: 0.5 });
    M.vidro = new THREE.MeshStandardMaterial({ color: '#a9cfe0', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.32, envMapIntensity: 1.4, depthWrite: false });
    M.peitoril = this.mat('#d8d6cf', { roughness: 0.5 });
    M.nucleo = this.mat('#7f898c', { roughness: 0.9 });
    // pavimentos
    const piso = (r, tex, y, cor) => {
      const w = r[2] - r[0], d = r[3] - r[1];
      const g = escalarUV(planoUV(w, d), w / tex.userData.tam, d / tex.userData.tam);
      const m = new THREE.Mesh(g, this.mat(cor || '#ffffff', { map: tex, roughness: 0.75, envMapIntensity: 0.4 }));
      m.rotation.x = -Math.PI / 2; m.position.set((r[0] + r[2]) / 2, y, (r[1] + r[3]) / 2); m.receiveShadow = true; sc.add(m); return m;
    };
    const relva = new THREE.Mesh(escalarUV(new THREE.PlaneGeometry(120, 120), 30, 30), this.mat('#ffffff', { map: TEX.relva, roughness: 1 }));
    relva.rotation.x = -Math.PI / 2; relva.position.set(11, -0.03, 8); relva.receiveShadow = true; sc.add(relva);
    PLANTA.exterior.forEach(r => piso(r, TEX.calcada, -0.01));
    if (PLANTA.rampa) piso(PLANTA.rampa, TEX.calcada, -0.005, '#d9d4c9');
    PLANTA.volumes.forEach(r => piso(r, TEX.terrazo, -0.006, '#8c9396'));
    PLANTA.espacos.forEach(s => {
      s.meshes = s.rects.map(r => piso(r, s.tipoJogo === 'sala' ? TEX.vinil : TEX.terrazo, 0.001, s.tipoJogo === 'bloqueado' ? '#6d7578' : '#ffffff'));
    });
    // paredes, lambrim, rodapé e topos
    const L = Lote(sc);
    const paredes = caixasGulosas(WALL), janelasG = caixasGulosas(WIN);
    const ext = (r, e) => [r[0] - e, r[1] - e, r[2] + e, r[3] + e];
    paredes.forEach(r => {
      const [cx, cz] = centroR(r), w = r[2] - r[0], d = r[3] - r[1];
      L.box(M.parede, cx, H / 2, cz, w, H, d);
      L.box(M.paredeTopo, cx, H + 0.012, cz, w, 0.024, d);
      const e = ext(r, 0.008); L.box(M.lambrim, cx, 0.55, cz, e[2] - e[0], 1.1, e[3] - e[1]);
      const e2 = ext(r, 0.016); L.box(M.rodape, cx, 0.05, cz, e2[2] - e2[0], 0.1, e2[3] - e2[1]);
    });
    // janelas: peitoril e verga de parede, vidro e caixilho
    const pe = PLANTA.peitoril, ja = PLANTA.alturaJanela, topo = Math.min(H, pe + ja);
    janelasG.forEach(r => {
      const [cx, cz] = centroR(r), w = r[2] - r[0], d = r[3] - r[1];
      L.box(M.parede, cx, pe / 2, cz, w, pe, d);
      L.box(M.parede, cx, (topo + H) / 2, cz, w, H - topo, d);
      L.box(M.paredeTopo, cx, H + 0.012, cz, w, 0.024, d);
      const e = ext(r, 0.008); L.box(M.lambrim, cx, Math.min(1.1, pe) / 2, cz, e[2] - e[0], Math.min(1.1, pe), e[3] - e[1]);
      L.box(M.peitoril, cx, pe + 0.015, cz, w + (w > d ? 0 : 0.12), 0.03, d + (w > d ? 0.12 : 0));
    });
    DP.janelas.forEach(j => {
      const a = Math.min(j.face_interior, j.face_exterior), b = Math.max(j.face_interior, j.face_exterior), m = (a + b) / 2;
      const len = j.ate - j.de, c = (j.de + j.ate) / 2, yc = pe + ja / 2;
      const pane = (x, z, sx, sz) => this.vidros.push([x, z, sx, sz, yc]);
      this.vidros = this.vidros || [];
      if (j.eixo === 'x') {
        L.box(M.caixilho, c, pe + 0.03, m, len, 0.06, 0.08); L.box(M.caixilho, c, topo - 0.03, m, len, 0.06, 0.08);
        L.box(M.caixilho, j.de + 0.03, yc, m, 0.06, ja, 0.08); L.box(M.caixilho, j.ate - 0.03, yc, m, 0.06, ja, 0.08);
        for (let k = 1; k < Math.round(len / 0.95); k++) L.box(M.caixilho, j.de + k * len / Math.round(len / 0.95), yc, m, 0.05, ja, 0.07);
        pane(c, m, len, 0.012);
      } else {
        L.box(M.caixilho, m, pe + 0.03, c, 0.08, 0.06, len); L.box(M.caixilho, m, topo - 0.03, c, 0.08, 0.06, len);
        L.box(M.caixilho, m, yc, j.de + 0.03, 0.08, ja, 0.06); L.box(M.caixilho, m, yc, j.ate - 0.03, 0.08, ja, 0.06);
        for (let k = 1; k < Math.round(len / 0.95); k++) L.box(M.caixilho, m, yc, j.de + k * len / Math.round(len / 0.95), 0.07, ja, 0.05);
        pane(m, c, 0.012, len);
      }
    });
    // vergas das portas e aros
    const hp = PLANTA.alturaPorta;
    Object.values(PORTAS).forEach(p => {
      const b = p.box, [cx, cz] = centroR(b), w = b[2] - b[0], d = b[3] - b[1];
      if (p.jogavel !== false || p.vistaAberta) {
        L.box(M.parede, cx, (hp + H) / 2, cz, w, H - hp, d);
        L.box(M.paredeTopo, cx, H + 0.012, cz, w, 0.024, d);
        // aro
        if (p.vertical) { L.box(M.caixilho, cx, hp + 0.03, cz, w + 0.04, 0.06, d); L.box(M.caixilho, cx, hp / 2, b[1] + 0.025, w + 0.04, hp, 0.05); L.box(M.caixilho, cx, hp / 2, b[3] - 0.025, w + 0.04, hp, 0.05); }
        else { L.box(M.caixilho, cx, hp + 0.03, cz, w, 0.06, d + 0.04); L.box(M.caixilho, b[0] + 0.025, hp / 2, cz, 0.05, hp, d + 0.04); L.box(M.caixilho, b[2] - 0.025, hp / 2, cz, 0.05, hp, d + 0.04); }
      }
    });
    L.fechar(true);
    // vidros (instâncias transparentes, sem sombra)
    const V = Lote(sc); (this.vidros || []).forEach(([x, z, sx, sz, yc]) => V.box(M.vidro, x, yc, z, sx, PLANTA.alturaJanela - 0.12, sz));
    V.fechar(false).forEach(m => { m.renderOrder = 2; });
    this.folhasPortas();
    this.nucleoEscadas();
    this.mobiliario();
    this.tetos();
    this.exterior();
    this.objetosJogo();
  },

  /* ---------- portas (folhas com dobradiça) ---------- */
  folhasPortas() {
    const sc = this.scene, hp = PLANTA.alturaPorta;
    const madeira = this.mat('#ffffff', { map: TEX.madeira, roughness: 0.55 });
    const fechada = this.mat('#6d7a80', { roughness: 0.6 });
    Object.values(PORTAS).forEach(p => {
      if (!p.folhas || p.id === 'p_exterior') return;
      const b = p.box, n = p.folhas;
      const span = p.vertical ? b[3] - b[1] : b[2] - b[0];
      const larg = span / n - 0.02;
      // face da parede do lado para onde a porta abre
      const faceX = p.vertical ? (p.lado[0] > 0 ? b[2] : b[0]) : null;
      const faceZ = p.vertical ? null : (p.lado[1] > 0 ? b[3] : b[1]);
      const leaves = [];
      for (let k = 0; k < n; k++) {
        const pivot = new THREE.Group();
        const geo = new THREE.BoxGeometry(p.vertical ? 0.045 : larg, hp - 0.02, p.vertical ? larg : 0.045);
        const leaf = new THREE.Mesh(geo, p.jogavel === false && !p.vistaAberta ? fechada : madeira);
        leaf.castShadow = true; leaf.receiveShadow = true;
        const sinal = k === 0 ? 1 : -1;   // segunda folha abre ao contrário
        if (p.vertical) {
          const z0 = k === 0 ? b[1] + 0.01 : b[3] - 0.01;
          pivot.position.set(faceX - p.lado[0] * 0.03, (hp - 0.02) / 2, z0);
          leaf.position.set(0, 0, sinal * larg / 2);
        } else {
          const x0 = k === 0 ? b[0] + 0.01 : b[2] - 0.01;
          pivot.position.set(x0, (hp - 0.02) / 2, faceZ - p.lado[1] * 0.03);
          leaf.position.set(sinal * larg / 2, 0, 0);
        }
        // puxador
        const pux = new THREE.Mesh(new THREE.BoxGeometry(p.vertical ? 0.06 : 0.12, 0.03, p.vertical ? 0.12 : 0.06), this.mat('#c9ced0', { metalness: 0.8, roughness: 0.3 }));
        if (p.vertical) pux.position.set(0, -0.05, sinal * (larg - 0.1)); else pux.position.set(sinal * (larg - 0.1), -0.05, 0);
        pivot.add(leaf); pivot.add(pux); sc.add(pivot);
        // ângulo aberto: para o lado da sala
        const abre = p.vertical ? -p.lado[0] * sinal * 1.45 : p.lado[1] * sinal * 1.45;
        leaves.push({ pivot, abre });
      }
      this.folhas[p.id] = leaves;
      if (p.jogavel === false && !p.vistaAberta) this.sinalFechado(p);
    });
  },
  sinalFechado(p) {
    const b = p.box, [cx, cz] = centroR(b);
    const esp = p.liga.map(id => PLANTA.espacos.find(s => s.id === id)).find(s => s && s.tipoJogo !== 'bloqueado');
    if (!esp) return;
    const n = p.vertical ? [espacoEm(b[0] - 0.3, cz) === esp ? -1 : 1, 0] : [0, espacoEm(cx, b[1] - 0.3) === esp ? -1 : 1];
    const fx = p.vertical ? (n[0] < 0 ? b[0] : b[2]) : cx, fz = p.vertical ? cz : (n[1] < 0 ? b[1] : b[3]);
    const nome = (PLANTA.espacos.find(s => p.liga.includes(s.id) && s.tipoJogo === 'bloqueado') || {}).nome || 'Espaço técnico';
    this.placa(fx, fz, n, 0.62, 0.32, 1.55, (c, w, h) => {
      c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#b3392a'; c.fillRect(0, 0, w, h * 0.12);
      c.fillStyle = '#14232b'; c.font = `700 ${h * 0.17}px ${FONT}`; wrapText(c, nome, w * 0.06, h * 0.36, w * 0.88, h * 0.19, 2);
      c.fillStyle = '#b3392a'; c.font = `700 ${h * 0.14}px ${FONT}`; c.fillText('Fora da área de jogo', w * 0.06, h * 0.9);
    }, 384);
  },

  /* ---------- escadas e núcleo (referência espacial, sem acesso) ---------- */
  nucleoEscadas() {
    const sc = this.scene, E = DP.escadas, H = PLANTA.peDireito;
    const L = Lote(sc);
    const degrau = this.mat('#b9b2a4', { roughness: 0.7 }), focinho = this.mat('#5b6468', { roughness: 0.5 });
    const esp = alt(E.espelho, 0.17), cob = alt(E.cobertor, 0.30);
    let altura = 0;
    const lancoDir = E.lancos.find(l => l.id === 'lanco_dir'), lancoEsq = E.lancos.find(l => l.id === 'lanco_esq');
    if (lancoDir) {   // sobe para baixo na folha
      const r = lancoDir.r, n = lancoDir.degraus;
      for (let k = 0; k < n; k++) {
        altura = (k + 1) * esp; const z0 = r[1] + k * cob;
        L.box(degrau, (r[0] + r[2]) / 2, altura / 2, z0 + cob / 2, r[2] - r[0], altura, cob);
        L.box(focinho, (r[0] + r[2]) / 2, altura - 0.01, z0 + 0.02, r[2] - r[0], 0.02, 0.04);
      }
    }
    const pat = E.patamar && E.patamar.r;
    if (pat) { altura += esp; L.box(degrau, (pat[0] + pat[2]) / 2, altura / 2, (pat[1] + pat[3]) / 2, pat[2] - pat[0], altura, pat[3] - pat[1]); }
    if (lancoEsq) {   // sobe para cima na folha
      const r = lancoEsq.r, n = lancoEsq.degraus;
      for (let k = 0; k < n; k++) {
        const h = Math.min(H + 0.6, altura + (k + 1) * esp), z1 = r[3] - k * cob;
        L.box(degrau, (r[0] + r[2]) / 2, h / 2, z1 - cob / 2, r[2] - r[0], h, cob);
      }
    }
    // guarda entre lanços
    if (lancoDir && lancoEsq) L.box(this.mat('#8f9aa0', { metalness: 0.6, roughness: 0.35 }), (lancoEsq.r[2] + lancoDir.r[0]) / 2, H * 0.6, (lancoDir.r[1] + lancoDir.r[3]) / 2, 0.05, 1.0, lancoDir.r[3] - lancoDir.r[1]);
    // tetos dos compartimentos fechados
    PLANTA.espacos.filter(s => s.tipoJogo === 'bloqueado' && s.id !== 'escadas' && s.id !== 'arrecadacao').forEach(s => s.rects.forEach(r => {
      const [cx, cz] = centroR(r); L.box(this.M.nucleo, cx, H - 0.02, cz, r[2] - r[0], 0.04, r[3] - r[1]);
    }));
    L.fechar(true);
  },

  /* ---------- mobiliário observado (cores da legenda) ---------- */
  mobiliario() {
    const sc = this.scene, L = Lote(sc), H = PLANTA.peDireito;
    const M = {
      branco: this.mat('#eef0ee', { roughness: 0.5 }), madeira: this.mat('#ffffff', { map: TEX.madeira, roughness: 0.5 }),
      metal: this.mat('#8c969b', { metalness: 0.7, roughness: 0.35 }), escuro: this.mat('#2f383c', { roughness: 0.5 }),
      cinza: this.mat('#c6cdd0', { roughness: 0.55 }), azul: this.mat('#3b6f8f', { roughness: 0.6 }), tabuleiro: this.mat('#e2a82c', { roughness: 0.6 }),
      tabuleiro2: this.mat('#5aa0c8', { roughness: 0.6 }), verde: this.mat('#7cae7a', { roughness: 0.6 }),
      estofo: this.mat('#2d4a5a', { roughness: 0.9 }), luz: new THREE.MeshStandardMaterial({ color: '#fff6dc', emissive: '#fff1c8', emissiveIntensity: 0.8 }),
      construir: this.mat('#ffffff', { map: TEX.construir, roughness: 0.85 }),
      existente: this.mat('#a7b0b3', { roughness: 0.7 }), pelicula: new THREE.MeshStandardMaterial({ color: '#dfe8ec', roughness: 0.2, transparent: true, opacity: 0.55 }),
      quadroEl: this.mat('#cdbb85', { metalness: 0.3, roughness: 0.45 })
    };
    this.Mmob = M;
    const ecraOff = this.mat('#0f1517', { roughness: 0.25, metalness: 0.2 });
    const pernas = (r, h, mat = M.metal, ins = 0.05) => {
      [[r[0] + ins, r[1] + ins], [r[2] - ins, r[1] + ins], [r[0] + ins, r[3] - ins], [r[2] - ins, r[3] - ins]].forEach(([x, z]) => L.box(mat, x, h / 2, z, 0.04, h, 0.04));
    };
    const tampo = (r, h, mat, esp = 0.03) => { const [cx, cz] = centroR(r); L.box(mat, cx, h - esp / 2, cz, r[2] - r[0], esp, r[3] - r[1]); };
    // cadeira mais próxima de um ponto (para orientar monitores)
    const cadeiras = DP.cadeiras.lista;
    const ladoUtilizador = (r) => {
      const [cx, cz] = centroR(r); let best = null;
      cadeiras.forEach(c => { const d = Math.hypot(c.c[0] - cx, c.c[1] - cz); if (d < 1.4 && (!best || d < best.d)) best = { d, x: c.c[0], z: c.c[1] }; });
      if (!best) return null;
      const w = r[2] - r[0], d = r[3] - r[1];
      return w >= d ? [0, Math.sign(best.z - cz) || 1] : [Math.sign(best.x - cx) || 1, 0];
    };
    DP.mobiliario.forEach(m => {
      const h = alt(m.altura, 0.75);
      if (m.r && !m.quad && !m.c && !m.arco) {
        const r = m.r, [cx, cz] = centroR(r), w = r[2] - r[0], d = r[3] - r[1];
        switch (m.tipo) {
          case 'mesa': tampo(r, h, M.branco); pernas(r, h - 0.03); break;
          case 'bancada_armario': tampo(r, h, M.madeira, 0.035); L.box(M.cinza, cx, (h - 0.04) / 2, cz, w - 0.06, h - 0.04, d - 0.1); break;
          case 'bancada_tecnica': {
            tampo(r, h, M.madeira, 0.035); pernas(r, h - 0.035, M.escuro, 0.04);
            const u = ladoUtilizador(r);
            if (u) {
              // prateleira (SBGCPU) e monitor no suporte indicado na legenda (monitor inferido)
              const lx = w >= d, back = lx ? (u[1] > 0 ? r[1] + 0.08 : r[3] - 0.08) : (u[0] > 0 ? r[0] + 0.08 : r[2] - 0.08);
              if (/SBGCPU/.test(m.codigo)) { if (lx) { L.box(M.branco, cx, h + 0.42, back, w - 0.04, 0.025, 0.22); L.box(M.luz, cx, h + 0.405, back, w - 0.1, 0.01, 0.05); } else { L.box(M.branco, back, h + 0.42, cz, 0.22, 0.025, d - 0.04); L.box(M.luz, back, h + 0.405, cz, 0.05, 0.01, d - 0.1); } }
              const mx = lx ? cx : back + u[0] * 0.08, mz = lx ? back + u[1] * 0.08 : cz;
              L.box(M.escuro, mx, h + 0.06, mz, 0.18, 0.02, 0.14);
              L.box(M.escuro, mx, h + 0.15, mz, 0.03, 0.18, 0.03);
              this.ecrasMonitor.push({ x: mx, z: mz, y: h + 0.31, rot: Math.atan2(u[0], u[1]), espaco: m.espaco });
            }
            break;
          }
          case 'bancada_alta': tampo(r, h, M.madeira, 0.04); pernas(r, h - 0.04, M.escuro, 0.06); L.box(M.escuro, cx, 0.25, cz, w - 0.15, 0.04, 0.04); break;
          case 'mesa_professor': {
            const lx = w >= d, tw = lx ? Math.min(1.4, w) : d, tr = lx ? [r[0] + 0.05, cz - 0.35, r[0] + 0.05 + 1.4, cz + 0.35] : [cx - 0.35, r[1] + 0.05, cx + 0.35, r[1] + 0.05 + 1.4];
            tampo(tr, h, M.madeira); pernas(tr, h - 0.03, M.escuro);
            const pr = lx ? [tr[2], cz - 0.3, tr[2] + 0.5, cz + 0.3] : [cx - 0.3, tr[3], cx + 0.3, tr[3] + 0.5];
            const [px, pz] = centroR(pr); L.box(M.cinza, px, 0.55, pz, pr[2] - pr[0], 1.1, pr[3] - pr[1]);
            break;
          }
          case 'carro': L.box(M.cinza, cx, h / 2, cz, w, h, d); for (let k = 0; k < 4; k++) L.box(k % 2 ? M.tabuleiro2 : M.tabuleiro, cx, 0.2 + k * 0.17, cz, w + 0.012, 0.07, d - 0.06); break;
          case 'rover': L.box(M.cinza, cx, h / 2 + 0.05, cz, w, h - 0.1, d); for (let k = 0; k < 3; k++) L.box(M.tabuleiro2, cx, 0.3 + k * 0.2, cz, w + 0.012, 0.09, d - 0.08); [[r[0] + 0.06, r[1] + 0.06], [r[2] - 0.06, r[3] - 0.06], [r[0] + 0.06, r[3] - 0.06], [r[2] - 0.06, r[1] + 0.06]].forEach(([x, z]) => L.cyl(M.escuro, x, 0.03, z, 0.03, 0.06)); break;
          case 'carregador': L.box(M.azul, cx, h / 2, cz, w, h, d); L.box(M.escuro, cx, h - 0.02, cz, w + 0.01, 0.04, d + 0.01); break;
          case 'ecra': {
            // suporte com pés (largura medida) e ecrã; a face do ecrã é usada pelo jogo
            const lx = w >= d, nrm = m.normal || (DP.ecras_observados.find(e => e.id === m.id) || {}).normal || [0, 1];
            // o ecrã fica a 0,18 m do bordo do lado da parede; os postes ficam atrás dele
            if (lx) { const ys = nrm[1] > 0 ? r[1] + 0.18 : r[3] - 0.18, yp = ys - nrm[1] * 0.08; L.box(M.escuro, r[0] + 0.5, 0.03, cz, 0.05, 0.06, d); L.box(M.escuro, r[2] - 0.5, 0.03, cz, 0.05, 0.06, d); L.box(M.escuro, r[0] + 0.5, 0.75, yp, 0.06, 1.5, 0.06); L.box(M.escuro, r[2] - 0.5, 0.75, yp, 0.06, 1.5, 0.06); }
            else { const xs = nrm[0] > 0 ? r[0] + 0.18 : r[2] - 0.18, xp = xs - nrm[0] * 0.08; L.box(M.escuro, cx, 0.03, r[1] + 0.5, w, 0.06, 0.05); L.box(M.escuro, cx, 0.03, r[3] - 0.5, w, 0.06, 0.05); L.box(M.escuro, xp, 0.75, r[1] + 0.5, 0.06, 1.5, 0.06); L.box(M.escuro, xp, 0.75, r[3] - 0.5, 0.06, 1.5, 0.06); }
            break;
          }
          default: tampo(r, h, M.branco); pernas(r, h - 0.03);
        }
      } else if (m.quad) {
        const q = m.quad, cx = q.reduce((a, p) => a + p[0], 0) / 4, cz = q.reduce((a, p) => a + p[1], 0) / 4;
        const lw = Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]), ld = Math.hypot(q[2][0] - q[1][0], q[2][1] - q[1][1]);
        const ang = -Math.atan2(q[1][1] - q[0][1], q[1][0] - q[0][0]);
        L.box(M.madeira, cx, h - 0.015, cz, lw, 0.03, ld, ang);
        const c = Math.cos(-ang), s = Math.sin(-ang);
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { const lx = a * (lw / 2 - 0.06), lz = b * (ld / 2 - 0.06); L.box(M.metal, cx + lx * c - lz * s, (h - 0.03) / 2, cz + lx * s + lz * c, 0.04, h - 0.03, 0.04); });
      } else if (m.tipo === 'mesa_redonda') {
        L.cyl(M.branco, m.c[0], h - 0.015, m.c[1], m.raio, 0.03); L.cyl(M.metal, m.c[0], (h - 0.03) / 2, m.c[1], 0.035, h - 0.03); L.cyl(M.metal, m.c[0], 0.015, m.c[1], 0.22, 0.03);
      } else if (m.tipo === 'mesa_diamond') {
        L.cyl(M.verde, m.c[0], h - 0.015, m.c[1], m.raio * 0.92, 0.03, true); L.cyl(M.metal, m.c[0], (h - 0.03) / 2, m.c[1], 0.05, h - 0.03); L.cyl(M.metal, m.c[0], 0.015, m.c[1], 0.35, 0.03);
      } else if (m.arco) {
        const a = m.arco, sh = new THREE.Shape(), A = a.angulo * Math.PI / 180;
        // ângulos medidos a partir de «para cima na folha»; no plano x/z do 3D
        const p0 = -Math.PI / 2 - A, p1 = -Math.PI / 2 + A;
        sh.absarc(0, 0, a.raioExt, p0, p1, false); sh.absarc(0, 0, a.raioInt, p1, p0, true);
        const g = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: false, curveSegments: 40 });
        g.rotateX(Math.PI / 2); g.translate(a.c[0], h, a.c[1]);
        const mesh = new THREE.Mesh(g, M.madeira); mesh.castShadow = true; mesh.receiveShadow = true; sc.add(mesh);
      }
    });
    // elementos a construir (tipo não especificado) e existentes sem tipo
    const arestas = new THREE.LineBasicMaterial({ color: '#c8352a' }), caixaE = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
    (DP.a_construir || []).forEach(c => {
      const [cx, cz] = centroR(c.r), h = alt(c.altura, 0.9), w = c.r[2] - c.r[0], d = c.r[3] - c.r[1];
      L.box(M.construir, cx, h / 2, cz, w, h, d);
      const e = new THREE.LineSegments(caixaE, arestas); e.position.set(cx, h / 2, cz); e.scale.set(w + 0.004, h + 0.004, d + 0.004); sc.add(e);
    });
    (DP.existente_sem_tipo || []).forEach(c => {
      const [cx, cz] = centroR(c.r), h = alt(c.altura, 0.9);
      if (/PELÍCULA/i.test(c.nota || '')) L.box(M.pelicula, cx, 1.0, cz, c.r[2] - c.r[0], 2.0, c.r[3] - c.r[1]);
      else L.box(M.existente, cx, h / 2, cz, c.r[2] - c.r[0], h, c.r[3] - c.r[1]);
    });
    (DP.quadros_eletricos || []).forEach(q => { const [cx, cz] = centroR(q.r), hc = alt(DP.alturas.quadroEletrico, 1.3); L.box(M.quadroEl, cx, hc, cz, Math.max(0.12, q.r[2] - q.r[0]) + 0.02, 0.6, Math.max(0.12, q.r[3] - q.r[1]) + 0.02); });
    // cadeiras observadas (orientadas para a mesa mais próxima)
    const sa = alt(DP.alturas.cadeiraAssento, 0.45), se = alt(DP.alturas.cadeiraEncosto, 0.85);
    DP.cadeiras.lista.forEach(c => {
      const [x, z] = c.c, a = c.rot, s = Math.sin(a), co = Math.cos(a);
      L.box(M.estofo, x, sa, z, 0.44, 0.05, 0.42, a);
      L.box(M.estofo, x - s * 0.2, (sa + se) / 2 + 0.02, z - co * 0.2, 0.42, se - sa, 0.04, a);
      L.cyl(M.metal, x, sa / 2, z, 0.025, sa);
      L.cyl(M.escuro, x, 0.03, z, 0.24, 0.03);
    });
    L.fechar(true);
    // monitores (inferidos do «suporte para monitor» da legenda); acendem quando a sala liga
    const geoMon = new THREE.BoxGeometry(0.56, 0.34, 0.03);
    this.monitores = {};
    this.ecrasMonitor.forEach(e => {
      const k = e.espaco; if (!this.monitores[k]) this.monitores[k] = [];
      this.monitores[k].push(e);
    });
    this.matMonOff = ecraOff;
    this.matMonOn = new THREE.MeshStandardMaterial({ color: '#0f1517', emissive: '#4f9bd0', emissiveIntensity: 0.9, roughness: 0.3 });
    this.monitorMesh = {};
    const o = new THREE.Object3D();
    Object.entries(this.monitores).forEach(([k, lista]) => {
      const im = new THREE.InstancedMesh(geoMon, ecraOff, lista.length);
      lista.forEach((e, i) => { o.position.set(e.x, e.y, e.z); o.rotation.set(-0.08, e.rot + Math.PI, 0); o.scale.set(1, 1, 1); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
      im.castShadow = true; sc.add(im); this.monitorMesh[k] = im;
    });
  },

  /* ---------- tetos (só visíveis de baixo) e luminárias ---------- */
  tetos() {
    const H = PLANTA.peDireito, sc = this.scene;
    const teto = this.mat('#f2f3f0', { roughness: 0.95 });
    this.lumOn = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fffaf0', emissiveIntensity: 1.2 });
    this.lumOff = this.mat('#d9dcda', { roughness: 0.6 });
    this.lumMesh = {};
    const geo = new THREE.PlaneGeometry(1.2, 0.6), o = new THREE.Object3D();
    PLANTA.espacos.filter(s => s.tipoJogo !== 'bloqueado' && s.id !== 'entrada').forEach(s => {
      const pos = [];
      s.rects.forEach(r => {
        const g = new THREE.Mesh(new THREE.PlaneGeometry(r[2] - r[0], r[3] - r[1]), teto);
        g.rotation.x = Math.PI / 2; g.position.set((r[0] + r[2]) / 2, H, (r[1] + r[3]) / 2); sc.add(g);
        const nx = Math.max(1, Math.floor((r[2] - r[0]) / 2.4)), nz = Math.max(1, Math.floor((r[3] - r[1]) / 2.4));
        for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) pos.push([r[0] + (i + 0.5) * (r[2] - r[0]) / nx, r[1] + (j + 0.5) * (r[3] - r[1]) / nz]);
      });
      const im = new THREE.InstancedMesh(geo, s.tipoJogo === 'circulacao' ? this.lumOn : this.lumOff, pos.length);
      pos.forEach(([x, z], i) => { o.position.set(x, H - 0.01, z); o.rotation.set(Math.PI / 2, 0, 0); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
      sc.add(im); this.lumMesh[s.id] = im;
    });
  },

  /* ---------- exterior: rampa, árvores, limites ---------- */
  exterior() {
    const sc = this.scene, L = Lote(sc);
    const tronco = this.mat('#6b5440', { roughness: 0.9 }), copa = this.mat('#5f8a4f', { roughness: 0.9, flatShading: true }), copa2 = this.mat('#76a05f', { roughness: 0.9, flatShading: true });
    const arvores = [[3, -6], [5.5, -9], [21, -7], [24, -3], [-3, 4], [-4, 11], [-3, 18], [26, 6], [26, 14], [25.5, 21], [4, 26], [12, 27], [19, 26.5], [-2.5, -4]];
    const geoCopa = new THREE.IcosahedronGeometry(1, 1);
    arvores.forEach(([x, z], i) => {
      L.cyl(tronco, x, 1.1, z, 0.13, 2.2);
      const m = new THREE.Mesh(geoCopa, i % 2 ? copa : copa2); m.position.set(x, 3.0, z); m.scale.set(1.5, 1.7, 1.5); m.castShadow = true; sc.add(m);
    });
    // rampa: guardas
    if (PLANTA.rampa) { const r = PLANTA.rampa; const g = this.mat('#9aa3a7', { metalness: 0.6, roughness: 0.35 }); L.box(g, (r[0] + r[2]) / 2, 0.9, r[1] + 0.03, r[2] - r[0], 0.04, 0.04); L.box(g, (r[0] + r[2]) / 2, 0.9, r[3] - 0.03, r[2] - r[0], 0.04, 0.04); for (let x = r[0] + 0.2; x < r[2]; x += 1) { L.box(g, x, 0.45, r[1] + 0.03, 0.04, 0.9, 0.04); L.box(g, x, 0.45, r[3] - 0.03, 0.04, 0.9, 0.04); } }
    // vedações baixas nos limites da área exterior (objeto do jogo)
    const ved = this.mat('#e2a82c', { roughness: 0.6 }), poste = this.mat('#2b2b2a', { roughness: 0.6 });
    (DP.limites.barreiras || []).filter(b => b.id.startsWith('b_ext')).forEach(b => {
      const r = b.r, [cx, cz] = centroR(r), w = r[2] - r[0], d = r[3] - r[1];
      L.box(ved, cx, 0.75, cz, Math.max(w, 0.05), 0.08, Math.max(d, 0.05)); L.box(ved, cx, 0.4, cz, Math.max(w, 0.05), 0.08, Math.max(d, 0.05));
      const len = Math.max(w, d), n = Math.ceil(len / 2);
      for (let k = 0; k <= n; k++) { const t = k / n; L.box(poste, w > d ? r[0] + t * w : cx, 0.45, w > d ? cz : r[1] + t * d, 0.07, 0.9, 0.07); }
    });
    L.fechar(true);
    (DP.limites.barreiras || []).filter(b => b.id.startsWith('b_ext')).forEach(b => {
      const r = b.r, [cx, cz] = centroR(r), w = r[2] - r[0], d = r[3] - r[1];
      const n = w > d ? [0, 1] : (cx < 10 ? [1, 0] : [-1, 0]);
      this.placa(cx + (w > d ? 0 : n[0] * 0.06), cz + (w > d ? 0.06 : 0), n, 1.3, 0.34, 1.05, (c, W, Hh) => { c.fillStyle = '#e2a82c'; c.fillRect(0, 0, W, Hh); c.fillStyle = '#2a1d00'; c.font = `700 ${Hh * 0.36}px ${FONT}`; c.fillText('Limite da área de jogo', W * 0.05, Hh * 0.62); }, 512);
    });
  },

  /* placa plana encostada a uma parede: (x, z) na face, n = normal [nx, nz] */
  placa(x, z, n, w, h, y, draw, res = 512) {
    const tex = canvasTex(res, Math.round(res * h / w), draw);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
    m.position.set(x + n[0] * 0.03, y, z + n[1] * 0.03);
    m.rotation.y = Math.atan2(n[0], n[1]);
    this.scene.add(m); m.userData.tex = tex; return m;
  },

  /* ---------- objetos do jogo (ficcionais), com acabamento âmbar ---------- */
  objetosJogo() {
    const sc = this.scene, F = DP.ficcionais;
    this.M.ambar = new THREE.MeshStandardMaterial({ color: '#e2a82c', emissive: '#e2a82c', emissiveIntensity: 0.35, roughness: 0.4 });
    this.M.consola = this.mat('#1f3d50', { roughness: 0.45 });
    // logótipo na entrada e totem com a barra de financiamento
    if (F.placa_logo) {
      const p = F.placa_logo, logo = new Image(); logo.src = LOGO_AERT3;
      const pl = this.placa(p.parede[0], p.parede[1], p.normal, p.largura, p.altura, p.centro, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); }, 512);
      logo.onload = () => redraw(pl.userData.tex, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.drawImage(logo, w * 0.08, h * 0.08, w * 0.84, h * 0.84); });
    }
    if (F.totem_financiamento) {
      const t = F.totem_financiamento, barra = new Image(); barra.src = BARRA_FIN;
      const grp = new THREE.Group(); grp.position.set(t.c[0], 0, t.c[1]); sc.add(grp);
      const pm = this.mat('#2b2b2a'); [-1.2, 1.2].forEach(x => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.2, 0.08), pm); p.position.set(x, 0.6, 0.04); p.castShadow = true; grp.add(p); });
      const fundo = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.85, 0.06), this.mat('#ffffff')); fundo.position.set(0, 1.55, 0.04); fundo.castShadow = true; grp.add(fundo);
      const tex = canvasTex(2048, 640, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); });
      const face = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.8125), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
      face.position.set(0, 1.55, 0.005); face.rotation.y = Math.PI; grp.add(face);
      barra.onload = () => redraw(tex, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#1f3d50'; c.font = `700 ${h * 0.13}px ${FONT}`; c.fillText('Centro Tecnológico Especializado · AERT3', w * 0.04, h * 0.24); const bw = w * 0.92, bh = bw * barra.height / barra.width; c.drawImage(barra, w * 0.04, h * 0.36, bw, bh); });
    }
    // escadas: fita, postes e sinal de limite
    (DP.limites.barreiras || []).filter(b => b.id === 'b_escadas').forEach(b => {
      const r = b.r, [cx, cz] = centroR(r), w = r[2] - r[0];
      const pm = this.mat('#2b2b2a'); [r[0] + 0.05, r[2] - 0.05].forEach(x => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.0, 10), pm); p.position.set(x, 0.5, cz); sc.add(p); const base = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.04, 16), pm); base.position.set(x, 0.02, cz); sc.add(base); });
      const fita = canvasTex(256, 32, (c, w, h) => { for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? '#ffffff' : '#c8352a'; c.beginPath(); c.moveTo(i * 24 - 16, h); c.lineTo(i * 24, 0); c.lineTo(i * 24 + 24, 0); c.lineTo(i * 24 + 8, h); c.fill(); } });
      fita.wrapS = THREE.RepeatWrapping; fita.repeat.set(3, 1);
      [0.95, 0.6].forEach(y => { const f = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.1, 0.07), new THREE.MeshBasicMaterial({ map: fita, side: THREE.DoubleSide })); f.position.set(cx, y, cz); sc.add(f); });
      this.placa(cx, r[1] - 0.02, [0, -1], 1.25, 0.62, 1.55, (c, W, Hh) => {
        c.fillStyle = '#ffffff'; c.fillRect(0, 0, W, Hh); c.fillStyle = '#c8352a'; c.fillRect(0, 0, W, Hh * 0.2);
        c.fillStyle = '#ffffff'; c.font = `700 ${Hh * 0.13}px ${FONT}`; c.fillText('LIMITE DA ÁREA DE JOGO', W * 0.05, Hh * 0.14);
        c.fillStyle = '#14232b'; c.font = `700 ${Hh * 0.12}px ${FONT}`; c.fillText('Escadas para o piso superior', W * 0.05, Hh * 0.42);
        c.font = `400 ${Hh * 0.1}px ${FONT}`; wrapText(c, 'O piso superior não está documentado na planta e não faz parte do jogo.', W * 0.05, Hh * 0.6, W * 0.9, Hh * 0.13, 3);
      }, 512);
    });
    // quadro de missões e sinal de orientação no átrio
    if (F.quadro_missoes) { const q = F.quadro_missoes; this.quadroMissoes = this.placa(q.parede[0], q.parede[1], q.normal, q.largura, q.altura, q.centro, (c, w, h) => this.desenharQuadroMissoes(c, w, h)); this.moldura(q.parede[0], q.parede[1], q.normal, q.largura, q.altura, q.centro); }
    if (F.sinal_orientacao) {
      const s = F.sinal_orientacao;
      this.placa(s.parede[0], s.parede[1], s.normal, s.largura, s.altura, s.centro, (c, w, h) => {
        c.fillStyle = '#1f3d50'; c.fillRect(0, 0, w, h); c.fillStyle = '#e2a82c'; c.fillRect(0, h - 6, w, 6);
        // a placa olha para quem vem da entrada (topo da folha): à esquerda dessa pessoa ficam E1–E3, à direita E4–E6 e os laboratórios
        const esq = s.esquerda || '← E1 · E2 · E3', dir = s.direita || 'E4 · E5 · E6 →', lab = s.labs || 'Labs de apoio E6.1 e 3.1 →';
        let f = h * 0.3; c.font = `700 ${f}px ${FONT}`;
        while (f > 10 && c.measureText(esq).width + c.measureText(dir).width > w * 0.86) { f -= 1; c.font = `700 ${f}px ${FONT}`; }
        c.fillStyle = '#ffffff'; c.fillText(esq, w * 0.04, h * 0.45); c.textAlign = 'right'; c.fillText(dir, w * 0.96, h * 0.45);
        c.fillStyle = '#c9d6dc'; c.font = `500 ${h * 0.2}px ${FONT}`; c.fillText(lab, w * 0.96, h * 0.83); c.textAlign = 'left';
      }, 512);
    }
    Object.keys(SALAS).forEach(mid => this.prepararSala(mid));
    Object.entries(PORTA_DE).forEach(([mid, pid]) => { if (pid && PORTAS[pid]) this.sinalPorta(mid, PORTAS[pid]); });
  },
  moldura(x, z, n, w, h, y) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(Math.abs(n[0]) ? 0.04 : w + 0.1, h + 0.1, Math.abs(n[0]) ? w + 0.1 : 0.04), this.M.ambar);
    m.position.set(x + n[0] * 0.015, y, z + n[1] * 0.015); this.scene.add(m);
  },

  prepararSala(mid) {
    const S = SALAS[mid], sc = this.scene, o = { mid };
    this.salas[mid] = o;
    // ecrã: observado (Promethean) ou do jogo (moldura âmbar)
    const E = S.ecra;
    if (E) {
      const n = E.n, res = 1024;
      if (E.tipo === 'observado') {
        const caixa = new THREE.Mesh(new THREE.BoxGeometry(Math.abs(n[0]) ? 0.08 : E.w + 0.08, E.h + 0.08, Math.abs(n[0]) ? E.w + 0.08 : 0.08), this.mat('#1b2124', { roughness: 0.4 }));
        caixa.position.set(E.x - n[0] * 0.02, E.y0, E.y - n[1] * 0.02); caixa.castShadow = true; sc.add(caixa);
        o.quadro = this.placa(E.x + n[0] * 0.0, E.y + n[1] * 0.0, n, E.w, E.h, E.y0, (c, w, h) => { c.fillStyle = '#10181b'; c.fillRect(0, 0, w, h); }, res);
      } else {
        this.moldura(E.x, E.y, n, E.w, E.h, E.y0);
        o.quadro = this.placa(E.x + n[0] * 0.02, E.y + n[1] * 0.02, n, E.w, E.h, E.y0, (c, w, h) => { c.fillStyle = '#10181b'; c.fillRect(0, 0, w, h); }, res);
      }
      o.quadroCentro = new THREE.Vector3(E.x + n[0] * 0.05, E.y0, E.y + n[1] * 0.05); o.normal = n;
    }
    // consola de missão (ficcional): painel de parede
    const C = S.consola, n = C.n;
    const grp = new THREE.Group(); grp.position.set(C.x + n[0] * 0.06, 1.25, C.y + n[1] * 0.06); grp.rotation.y = Math.atan2(n[0], n[1]); sc.add(grp);
    const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.86, 0.1), this.M.consola); corpo.castShadow = true; grp.add(corpo);
    const aro = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.04, 0.11), this.M.ambar); aro.position.y = -0.45; grp.add(aro);
    const aro2 = aro.clone(); aro2.position.y = 0.45; grp.add(aro2);
    const ecraTex = canvasTex(512, 640, (c, w, h) => this.desenharTerminal(c, w, h, mid));
    const ecra = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.675), new THREE.MeshBasicMaterial({ map: ecraTex, toneMapped: false }));
    ecra.position.z = 0.052; grp.add(ecra);
    o.terminal = grp; o.ecraTex = ecraTex;
    // objetos de cada missão
    if (S.bancada) {
      o.caixas = [];
      for (let i = 0; i < 10; i++) {
        const cx = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#e2a82c', emissive: '#e2a82c', emissiveIntensity: 0.25, roughness: 0.5 }));
        cx.visible = false; cx.castShadow = true; sc.add(cx); o.caixas.push(cx);
      }
    }
    if (S.zonas) {
      o.zonas = {};
      const H = DP.ficcionais.luzes_m5.altura || 2.6;
      S.zonas.forEach(z => {
        const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.28, 0.12, 24), new THREE.MeshStandardMaterial({ color: '#30383b', emissive: '#000000', roughness: 0.4 }));
        lamp.position.set(z.x, H, z.y); sc.add(lamp);
        const anel = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.025, 8, 32), this.M.ambar); anel.rotation.x = Math.PI / 2; anel.position.set(z.x, H + 0.06, z.y); sc.add(anel);
        const fio = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, PLANTA.peDireito - H, 6), this.mat('#30383b')); fio.position.set(z.x, (PLANTA.peDireito + H) / 2, z.y); sc.add(fio);
        const luz = new THREE.PointLight('#ffe7a8', 0, 5.5, 1.6); luz.position.set(z.x, H - 0.15, z.y); sc.add(luz);
        const poca = new THREE.Mesh(new THREE.CircleGeometry(1.1, 32), new THREE.MeshBasicMaterial({ color: '#ffe9a8', transparent: true, opacity: 0, depthWrite: false }));
        poca.rotation.x = -Math.PI / 2; poca.position.set(z.x, 0.012, z.y); sc.add(poca);
        const cone = new THREE.Mesh(new THREE.ConeGeometry(1.05, H - 0.1, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#fff3c4', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
        cone.position.set(z.x, (H - 0.1) / 2, z.y); sc.add(cone);
        o.zonas[z.id] = { lamp, poca, cone, luz, on: false };
      });
    }
    if (S.impressora) {
      const p = S.impressora, r = p.r, w = r[2] - r[0], d = r[3] - r[1];
      const imp = new THREE.Mesh(new THREE.BoxGeometry(w, 0.95, d), this.mat('#d8dcd9', { roughness: 0.5 })); imp.position.set(p.x, 0.475, p.y); imp.castShadow = true; sc.add(imp);
      const tira = new THREE.Mesh(new THREE.BoxGeometry(w + 0.01, 0.04, d + 0.01), this.M.ambar); tira.position.set(p.x, 0.9, p.y); sc.add(tira);
      const fenda = new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, 0.03, 0.06), this.mat('#2b2b2a')); fenda.position.set(p.x, 0.8, r[1] - 0.01); sc.add(fenda);
      const ct = canvasTex(512, 320, (c, w2, h2) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w2, h2); });
      const cartao = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.21), new THREE.MeshBasicMaterial({ map: ct, side: THREE.DoubleSide, toneMapped: false }));
      cartao.rotation.x = -Math.PI / 2; cartao.position.set(p.x, 0.97, p.y); cartao.visible = false; sc.add(cartao);
      o.cartao = cartao; o.cartaoTex = ct; o.imp = p;
    }
  },

  sinalPorta(mid, p) {
    const b = p.box, cx = (b[0] + b[2]) / 2, cz = (b[1] + b[3]) / 2;
    const fora = p.liga.map(id => PLANTA.espacos.find(s => s.id === id)).find(s => s && s.tipoJogo === 'circulacao');
    let n;
    if (p.vertical) { const d = espacoEm(b[0] - 0.3, cz) === fora ? -1 : 1; n = [d, 0]; }
    else { const d = espacoEm(cx, b[1] - 0.3) === fora ? -1 : 1; n = [0, d]; }
    const fx = p.vertical ? (n[0] < 0 ? b[0] : b[2]) : cx, fz = p.vertical ? cz : (n[1] < 0 ? b[1] : b[3]);
    const s = this.placa(fx, fz, n, 1.3, 0.42, 2.48, () => {}, 512);
    s.renderOrder = 1;
    this.salas[mid].sinal = s;
  },

  desenharTerminal(c, w, h, mid) {
    const m = MISSOES.find(x => x.id === mid), st = UI.estadoSala(mid);
    const cor = { bloqueada: '#d1503d', disponivel: '#e2a82c', ligada: '#3fae74' }[st];
    c.fillStyle = '#0f2531'; c.fillRect(0, 0, w, h);
    c.fillStyle = cor; c.fillRect(0, 0, w, 16);
    c.fillStyle = '#9fb7c2'; c.font = `700 ${h * 0.055}px ${FONT}`;
    c.fillText(m.final ? 'DESAFIO FINAL' : m.extra ? 'DESAFIOS EXTRA' : m.n === 0 ? 'TUTORIAL' : 'MISSÃO ' + m.n, 30, h * 0.14);
    c.fillStyle = '#ffffff'; c.font = `700 ${h * 0.085}px ${FONT}`; wrapText(c, m.title, 30, h * 0.3, w - 60, h * 0.1, 3);
    c.fillStyle = '#e2a82c'; c.font = `600 ${h * 0.045}px ${FONT}`; c.fillText('Consola do jogo', 30, h * 0.66);
    c.fillStyle = cor; c.font = `700 ${h * 0.065}px ${FONT}`;
    c.fillText(st === 'ligada' ? 'Sala ligada' : st === 'disponivel' ? 'Carrega em E' : 'Bloqueada', 30, h * 0.88);
  },

  desenharQuadroMissoes(c, w, h) {
    c.fillStyle = '#0f2531'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#ffffff'; c.font = `700 ${h * 0.085}px ${FONT}`; c.fillText('Quadro de missões', 24, h * 0.12);
    MISSOES.filter(m => m.id !== 'tut').forEach((m, i) => {
      const y = h * 0.2 + i * (h * 0.095), st = UI.estadoSala(m.id);
      c.fillStyle = { bloqueada: '#d1503d', disponivel: '#e2a82c', ligada: '#3fae74' }[st];
      c.beginPath(); c.arc(36, y + h * 0.03, h * 0.022, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#dce7ec'; c.font = `600 ${h * 0.055}px ${FONT}`; c.fillText(`${m.sala} · ${m.title}`, 60, y + h * 0.05);
      const n = m.levels.filter(L => UI.feito(L.id)).length;
      c.fillStyle = '#9fb7c2'; c.textAlign = 'right'; c.fillText(`${n}/${m.levels.length}`, w - 24, y + h * 0.05); c.textAlign = 'left';
    });
  },

  /* ---------- estado das salas ---------- */
  atualizarTrancas() {
    Object.keys(SALAS).forEach(mid => { const pid = PORTA_DE[mid]; if (pid) this.trancar(pid, UI.estadoSala(mid) === 'bloqueada'); });
    this.trancar('p_entrada', !UI.feito('tut1'));
    if (PORTAS.p_31_e3) this.trancar('p_31_e3', UI.estadoSala('extra') === 'bloqueada');
  },
  atualizarSalas() {
    this.atualizarTrancas();
    if (!this.pronto) return;
    Object.keys(SALAS).forEach(mid => {
      const o = this.salas[mid], st = UI.estadoSala(mid), S = SALAS[mid];
      redraw(o.ecraTex, (c, w, h) => this.desenharTerminal(c, w, h, mid));
      const esp = PLANTA.espacos.find(s => s.id === S.espaco);
      if (esp && esp.meshes && esp.tipoJogo === 'sala') esp.meshes.forEach(m => m.material.color.set(st === 'ligada' ? '#ffffff' : st === 'disponivel' ? '#c9cfd1' : '#68737a'));
      if (this.lumMesh[S.espaco]) this.lumMesh[S.espaco].material = st === 'ligada' ? this.lumOn : this.lumOff;
      if (this.monitorMesh[S.espaco]) this.monitorMesh[S.espaco].material = st === 'ligada' ? this.matMonOn : this.matMonOff;
      if (o.sinal) {
        const m = MISSOES.find(x => x.id === mid);
        redraw(o.sinal.userData.tex, (c, w, h) => {
          c.fillStyle = '#1f3d50'; c.fillRect(0, 0, w, h);
          c.fillStyle = { bloqueada: '#d1503d', disponivel: '#e2a82c', ligada: '#3fae74' }[st];
          c.beginPath(); c.arc(h * 0.36, h * 0.36, h * 0.15, 0, Math.PI * 2); c.fill();
          c.fillStyle = '#ffffff'; c.font = `700 ${h * 0.3}px ${FONT}`; c.fillText(esp ? esp.nome : m.sala, h * 0.68, h * 0.44);
          c.fillStyle = '#e2a82c'; c.font = `600 ${h * 0.19}px ${FONT}`; c.fillText('No jogo: ' + m.title, h * 0.2, h * 0.82);
        });
      }
      const pid = PORTA_DE[mid];
      if (pid) this.trancar(pid, st === 'bloqueada');
    });
    this.trancar('p_entrada', !UI.feito('tut1'));
    if (PORTAS.p_31_e3) this.trancar('p_31_e3', UI.estadoSala('extra') === 'bloqueada');
    if (this.quadroMissoes) redraw(this.quadroMissoes.userData.tex, (c, w, h) => this.desenharQuadroMissoes(c, w, h));
  },
  trancar(pid, t) { const p = PORTAS[pid]; if (p && p.jogavel !== false) p.trancada = t; },

  /* ---------- efeitos do código do aluno ---------- */
  efeito(mid, snap) {
    const o = this.salas[mid]; if (!o || !snap || !o.quadro) return;
    const find = f => snap.els.find(f), all = f => snap.els.filter(f);
    const hasC = (e, c) => (' ' + e.c + ' ').indexOf(' ' + c + ' ') >= 0;
    const tex = o.quadro.userData.tex;
    if (mid === 'm1') {
      const zonas = ['header', 'nav', 'main', 'footer'];
      redraw(tex, (c, w, h) => {
        c.fillStyle = '#10181b'; c.fillRect(0, 0, w, h);
        c.fillStyle = '#9fb7c2'; c.font = `700 ${h * 0.07}px ${FONT}`; c.fillText('ESTRUTURA DA PÁGINA', w * 0.04, h * 0.12);
        zonas.forEach((z, i) => {
          const on = !!find(e => e.t === z), y = h * 0.18 + i * h * 0.2;
          c.fillStyle = on ? ['#1f6f8b', '#e2a82c', '#3fae74', '#7a5a9e'][i] : '#263238'; c.fillRect(w * 0.04, y, w * 0.4, h * 0.16);
          c.fillStyle = on ? '#ffffff' : '#56666d'; c.font = `700 ${h * 0.08}px ${FONT}`; c.fillText('<' + z + '>', w * 0.07, y + h * 0.11);
        });
        c.save(); c.translate(w * 0.48, h * 0.12); desenharPagina(c, w * 0.5, h * 0.84, snap); c.restore();
      });
    } else if (mid === 'm2') {
      const box = find(e => hasC(e, 'paineis'));
      redraw(tex, (c, w, h) => desenharPagina(c, w, h, snap, box ? { x: box.x - 10, y: box.y - 10, w: box.w + 20, h: box.h + 20 } : null));
    } else if (mid === 'm3') {
      const cont = find(e => hasC(e, 'menu')) || find(e => hasC(e, 'cartoes'));
      redraw(tex, (c, w, h) => desenharPagina(c, w, h, snap, cont ? { x: cont.x, y: cont.y, w: cont.w, h: Math.max(cont.h, 40) } : null));
      if (!cont || !o.caixas || !SALAS.m3.bancada) return;
      let itens = all(e => (e.t === 'a' || hasC(e, 'logo') || hasC(e, 'cartao')) && e.x >= cont.x - 1 && e.x + e.w <= cont.x + cont.w + 1 && e.y >= cont.y - 1 && e.y + e.h <= cont.y + cont.h + 1);
      itens = itens.filter((e, i, arr) => !(e.t === 'a' && hasC(e, 'logo') && arr.some(x => x !== e && hasC(x, 'logo')))).slice(0, 10);
      // bancada observada: o comprimento maior recebe o eixo horizontal do menu
      const b = SALAS.m3.bancada, r = b.r, lx = (r[2] - r[0]) >= (r[3] - r[1]);
      const len = (lx ? r[2] - r[0] : r[3] - r[1]) - 0.06, esc = len / cont.w;
      const n = SALAS.m3.ecra ? SALAS.m3.ecra.n : [1, 0];
      o.caixas.forEach((cx, i) => {
        const e = itens[i]; if (!e) { cx.visible = false; return; }
        const w = Math.max(0.05, e.w * esc), hh = Math.max(0.05, Math.min(0.28, e.h * esc));
        const t = (e.x - cont.x + e.w / 2) * esc;
        // visto do lado da câmara (oposto ao ecrã), a esquerda do menu fica à esquerda
        const along = lx ? (n[1] > 0 ? r[2] - 0.03 - t : r[0] + 0.03 + t) : (n[0] > 0 ? r[3] - 0.03 - t : r[1] + 0.03 + t);
        if (lx) cx.scale.set(w * 0.94, hh, 0.32); else cx.scale.set(0.32, hh, w * 0.94);
        const y = b.alt + hh / 2 + Math.min(0.25, (e.y - cont.y) * esc);
        cx.userData.alvo = lx ? new THREE.Vector3(along, y, (r[1] + r[3]) / 2) : new THREE.Vector3((r[0] + r[2]) / 2, y, along);
        if (!cx.visible) cx.position.copy(cx.userData.alvo).add(new THREE.Vector3(0, 0.8, 0));
        cx.visible = true;
        cx.material.color.set(hasC(e, 'logo') ? '#1f3d50' : hasC(e, 'cartao') ? '#f5f7f6' : '#e2a82c');
      });
    } else if (mid === 'm4') {
      const cont = find(e => hasC(e, 'mural')) || find(e => hasC(e, 'horario'));
      redraw(tex, (c, w, h) => desenharPagina(c, w, h, snap, cont ? { x: cont.x - 8, y: cont.y - 8, w: cont.w + 16, h: cont.h + 16 } : null, { fundo: '#e9eef0' }));
    } else if (mid === 'm5') {
      const tot = find(e => e.id === 'total');
      redraw(tex, (c, w, h) => {
        c.fillStyle = '#10181b'; c.fillRect(0, 0, w, h);
        c.fillStyle = '#9fb7c2'; c.font = `700 ${h * 0.08}px ${FONT}`; c.fillText('SALA E5 · ENERGIA', w * 0.05, h * 0.15);
        const ligadas = Object.values(o.zonas || {}).filter(z => z.on).length;
        c.fillStyle = '#ffd166'; c.font = `700 ${h * 0.2}px ${FONT}`;
        c.fillText(tot ? tot.tx.replace(/^Consumo:\s*/, '') : `${ligadas} de 3 zonas`, w * 0.05, h * 0.5);
        c.fillStyle = '#c9d6dc'; c.font = `500 ${h * 0.08}px ${FONT}`; c.fillText(`Zonas de luz ligadas: ${ligadas}`, w * 0.05, h * 0.8);
      });
    } else if (mid === 'm6') {
      const res = find(e => e.id === 'resumo'), msg = find(e => e.id === 'mensagem');
      redraw(tex, (c, w, h) => desenharPagina(c, w, h, snap));
      if (res && res.tx) this.imprimir(o, res.tx);
      else if (msg && hasC(msg, 'sucesso') && msg.tx) this.imprimir(o, msg.tx);
    } else {
      redraw(tex, (c, w, h) => desenharPagina(c, w, h, snap));
    }
  },
  imprimir(o, texto) {
    if (!o.cartao) return;
    if (o.cartao.userData.texto === texto && o.cartao.visible) return;
    o.cartao.userData.texto = texto;
    const logo = UI.imgLogo;
    redraw(o.cartaoTex, (c, w, h) => {
      c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#1f3d50'; c.fillRect(0, 0, w, h * 0.24);
      c.fillStyle = '#ffffff'; c.font = `700 ${h * 0.11}px ${FONT}`; c.fillText('CARTÃO DE ACESSO · CTE', w * 0.05, h * 0.16);
      if (logo && logo.complete) c.drawImage(logo, w * 0.72, h * 0.32, h * 0.5, h * 0.5);
      c.fillStyle = '#1b2526'; c.font = `700 ${h * 0.1}px ${FONT}`; wrapText(c, texto, w * 0.05, h * 0.45, w * 0.62, h * 0.13, 3);
    });
    o.cartao.visible = true; o.cartao.userData.t0 = this.t;
  },
  luz(mid, id, on) { const o = this.salas[mid]; if (!o || !o.zonas || !o.zonas[id]) return; o.zonas[id].on = on; },

  /* ---------- câmara de destaque (terminal aberto) ---------- */
  focar(mid) { this.vistaMid = mid || null; this.vista = mid ? {} : null; if (this.aluno) this.aluno.visible = !mid && !this.primeira; },
  calcVista(mid) {
    const o = this.salas[mid], S = SALAS[mid], asp = this.cam.aspect;
    if (!o.quadroCentro) return { pos: new THREE.Vector3(S.ponto.x, 2.4, S.ponto.y), alvo: new THREE.Vector3(S.consola.x, 1.2, S.consola.y), fov: 60 };
    const n = o.normal, c = o.quadroCentro;
    if (mid === 'm5' && S.zonas) {
      const r = PLANTA.espacos.find(e => e.id === S.espaco).rects[0];
      return { pos: new THREE.Vector3(r[2] - 1.1, 2.45, r[3] - 0.9), alvo: new THREE.Vector3((r[0] + r[2]) / 2 - 0.6, 0.9, (r[1] + r[3]) / 2 - 1.4), fov: asp < 0.9 ? 88 : 72 };
    }
    const r = PLANTA.espacos.find(e => e.id === S.espaco).rects.reduce((a, b) => (inRect(b, c.x, c.z) ? b : a), PLANTA.espacos.find(e => e.id === S.espaco).rects[0]);
    let D = n[0] > 0 ? r[2] - c.x : n[0] < 0 ? c.x - r[0] : n[1] > 0 ? r[3] - c.z : c.z - r[1];
    D = Math.max(2.2, D - 0.35);
    const tanV = Math.tan(THREE.MathUtils.degToRad(29)), w = S.ecra.w * 1.15, need = (w / 2) / (tanV * asp) + 0.2;
    let dist = Math.min(need, D), fov = 58;
    if (need > D) fov = Math.min(96, THREE.MathUtils.radToDeg(2 * Math.atan(((w / 2) / D) / asp)));
    dist = Math.max(dist, Math.min(2.6, D));
    const yy = mid === 'm3' ? 2.3 : 2.05;
    return { pos: new THREE.Vector3(c.x + n[0] * dist, yy, c.z + n[1] * dist), alvo: new THREE.Vector3(c.x, mid === 'm3' ? c.y - 0.35 : c.y, c.z), fov };
  },
  setFaixa(px) { this.faixa = px; this.resize(); },
  setQualidade(q) {
    this.qualidade = q;
    const r = this.r;
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, q === 'alta' ? 2 : q === 'normal' ? 1.25 : 1));
    r.shadowMap.enabled = q !== 'baixa'; this.sol.castShadow = q !== 'baixa';
    const sz = q === 'alta' ? 2048 : 1024;
    if (this.sol.shadow.mapSize.x !== sz) { this.sol.shadow.mapSize.set(sz, sz); if (this.sol.shadow.map) { this.sol.shadow.map.dispose(); this.sol.shadow.map = null; } }
    r.shadowMap.type = q === 'alta' ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
    this.scene.environment = q === 'baixa' ? null : this.envMap;
    this.scene.traverse(o => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.needsUpdate = true); });
    this.resize();
  },

  /* ---------- eventos de entrada ---------- */
  ligarEventos() {
    const cv = this.canvas;
    let drag = null;
    cv.addEventListener('pointerdown', e => { if (e.pointerType === 'touch' && e.clientX < window.innerWidth * 0.45) return; drag = { x: e.clientX, y: e.clientY, id: e.pointerId }; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => {
      if (!drag || drag.id !== e.pointerId) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY;
      this.camYaw -= dx * 0.006; this.camPitch = Math.max(this.primeira ? -0.9 : 0.12, Math.min(1.25, this.camPitch + dy * 0.004));
    });
    cv.addEventListener('pointerup', () => { drag = null; });
    cv.addEventListener('pointercancel', () => { drag = null; });
    cv.addEventListener('wheel', e => { e.preventDefault(); this.camDist = Math.max(2.4, Math.min(9, this.camDist + e.deltaY * 0.004)); }, { passive: false });
    window.addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable],.offcanvas,.modal')) return;
      this.keys[e.code] = true;
      if (this.pausa || e.repeat) return;
      if ((e.code === 'KeyE' || e.code === 'Enter') && this.foco) { e.preventDefault(); this.keys = {}; UI.abrirTerminal(this.foco.mid); }
      if (e.code === 'KeyV') this.trocarVista();
    });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });
    window.addEventListener('blur', () => { this.keys = {}; });
  },
  resize() {
    if (!this.r) return;
    const w = window.innerWidth, h = window.innerHeight;
    this.r.setSize(w, h, false);
    const vw = this.faixa > 0 ? this.faixa : w;
    this.cam.aspect = vw / h; this.cam.updateProjectionMatrix();
  },

  livre(x, z, raio = 0.28) {
    for (let a = 0; a < 8; a++) {
      const px = x + Math.cos(a * Math.PI / 4) * raio, pz = z + Math.sin(a * Math.PI / 4) * raio;
      if (gAt(px, pz) !== WALK) return false;
      for (const p of Object.values(PORTAS)) if (p.trancada && inRect(p.box, px, pz)) return false;
    }
    return gAt(x, z) === WALK;
  },
  solidoCamara(x, z, y) {
    if (y > PLANTA.peDireito + 0.4) return false;
    const v = gAt(x, z);
    if (v === WALL || v === BLOCK || v === WIN) return true;
    for (const p of Object.values(PORTAS)) if (inRect(p.box, x, z) && (y > PLANTA.alturaPorta || p.trancada)) return true;
    return false;
  },
  trocarVista() { this.primeira = !this.primeira; this.aluno.visible = !this.primeira; if (!this.primeira) this.camPitch = Math.max(0.3, this.camPitch); UI.toast(this.primeira ? 'Vista na primeira pessoa' : 'Vista na terceira pessoa'); },
  teleporte(x, z, yaw = 0) { this.pos.x = x; this.pos.z = z; this.yaw = yaw; this.camYaw = yaw; const e = espacoEm(x, z); this.salaAtual = e ? e.nome : 'Exterior'; UI.mostrarSala(this.salaAtual); this.cIni = false; },

  /* ---------- ciclo ---------- */
  loop(now) {
    requestAnimationFrame(t => this.loop(t));
    const dt = Math.min(0.05, (now - this.ultimo) / 1000); this.ultimo = now;
    if (UI.modo === 'planta') return;
    if (this.pausa && !this.vista) return;
    if (UI.terminalAberto && !UI.verSala && this.faixa === 0) return;
    if (this.vista && this.pausa) { this.salto = (this.salto || 0) + 1; if (this.salto % 2) return; }
    this.t += dt;
    if (!this.pausa) this.mover(dt);
    this.animarObjetos(dt);
    this.posicionarCamara(dt);
    const r = this.r, w = window.innerWidth, h = window.innerHeight;
    if (this.faixa > 0) { r.setScissorTest(true); r.setViewport(0, 0, this.faixa, h); r.setScissor(0, 0, this.faixa, h); }
    else { r.setScissorTest(false); r.setViewport(0, 0, w, h); }
    r.render(this.scene, this.cam);
  },
  passo(dt, ix, iz, relativoCamara = true) {
    const len = Math.hypot(ix, iz);
    if (len > 1) { ix /= len; iz /= len; }
    const corre = this.keys.ShiftLeft || this.keys.ShiftRight;
    const vmax = (corre ? 3.6 : 2.1) * Math.min(1, len);
    let dx, dz;
    if (relativoCamara) { const fw = [Math.sin(this.camYaw), Math.cos(this.camYaw)], rt = [-Math.cos(this.camYaw), Math.sin(this.camYaw)]; dx = fw[0] * iz + rt[0] * ix; dz = fw[1] * iz + rt[1] * ix; }
    else { dx = ix; dz = -iz; }
    this.vel += ((len > 0.05 ? vmax : 0) - this.vel) * Math.min(1, dt * 10);
    if (len > 0.05) {
      const alvo = Math.atan2(dx, dz);
      let d = alvo - this.yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
      this.yaw += d * Math.min(1, dt * 12);
      const n = Math.hypot(dx, dz) || 1, sx = dx / n * this.vel * dt, sz = dz / n * this.vel * dt;
      if (this.livre(this.pos.x + sx, this.pos.z + sz)) { this.pos.x += sx; this.pos.z += sz; }
      else if (this.livre(this.pos.x + sx, this.pos.z)) this.pos.x += sx;
      else if (this.livre(this.pos.x, this.pos.z + sz)) this.pos.z += sz;
    }
    let melhor = null, dm = 1e9;
    this.interativos.forEach(it => { const d = Math.hypot(it.x - this.pos.x, it.z - this.pos.z); if (d < it.r && d < dm) { dm = d; melhor = it; } });
    if ((melhor && melhor.mid) !== (this.foco && this.foco.mid)) { this.foco = melhor; UI.mostrarInteracao(melhor); }
    const esp = espacoEm(this.pos.x, this.pos.z);
    const nome = esp ? esp.nome : (this.pos.z < -3.5 ? 'Exterior' : '');
    if (nome !== this.salaAtual) { this.salaAtual = nome; UI.mostrarSala(nome); }
  },
  mover(dt) {
    const k = this.keys;
    const ix = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0) + this.joy.x;
    const iz = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0) + this.joy.y;
    this.passo(dt, ix, iz, true);
    const amp = Math.min(1, this.vel / 2.1);
    this.fase += dt * (5 + this.vel * 2.4) * (amp > 0.05 ? 1 : 0);
    this.aluno.position.set(this.pos.x, 0, this.pos.z);
    this.aluno.rotation.y = this.yaw;
    animarAluno(this.aluno, this.fase, amp, this.t);
    if (k.KeyQ) this.camYaw += dt * 1.8;
    if (k.KeyR) this.camYaw -= dt * 1.8;
  },
  animarObjetos(dt) {
    const red = UI.reduzir;
    Object.values(this.salas).forEach(o => {
      if (o.caixas) o.caixas.forEach(c => { if (c.visible && c.userData.alvo) c.position.lerp(c.userData.alvo, red ? 1 : Math.min(1, dt * 5)); });
      if (o.zonas) Object.values(o.zonas).forEach(z => {
        const alvo = z.on ? 1 : 0; z.v = (z.v || 0) + (alvo - (z.v || 0)) * (red ? 1 : Math.min(1, dt * 6));
        z.lamp.material.emissive.setRGB(1.0 * z.v, 0.86 * z.v, 0.45 * z.v);
        z.poca.material.opacity = 0.5 * z.v; z.cone.material.opacity = 0.1 * z.v; z.luz.intensity = 6 * z.v;
      });
      if (o.cartao && o.cartao.visible) {
        const k = Math.min(1, (this.t - (o.cartao.userData.t0 || 0)) / (red ? 0.01 : 1.2));
        o.cartao.position.set(o.imp.x, 0.97 - 0.04 * (1 - k), o.imp.y - k * 0.32);
      }
    });
    Object.entries(this.folhas).forEach(([id, leaves]) => {
      const p = PORTAS[id], alvo = p.trancada ? 0 : 1;
      p.abertura += (alvo - p.abertura) * (red ? 1 : Math.min(1, dt * 3));
      leaves.forEach(l => { l.pivot.rotation.y = l.abre * p.abertura; });
    });
  },
  posicionarCamara(dt) {
    const cam = this.cam;
    const setFov = f => { if (Math.abs(cam.fov - f) > 0.05) { cam.fov = f; cam.updateProjectionMatrix(); } };
    if (this.vista) {
      const v = this.vistaMid ? this.calcVista(this.vistaMid) : this.vista;
      const k = UI.reduzir || cam.position.distanceTo(v.pos) > 5 ? 1 : Math.min(1, dt * 3);
      if (k === 1) this.olhar = v.alvo.clone();
      cam.position.lerp(v.pos, k);
      this.olhar = (this.olhar || v.alvo.clone()).lerp(v.alvo, k);
      setFov(v.fov || 58); cam.lookAt(this.olhar); return;
    }
    setFov(58);
    const alvo = new THREE.Vector3(this.pos.x, 1.45, this.pos.z);
    if (this.primeira) {
      cam.position.set(this.pos.x, 1.58, this.pos.z);
      const p = -Math.max(-0.9, Math.min(0.9, this.camPitch - 0.52));
      cam.lookAt(this.pos.x + Math.sin(this.camYaw) * Math.cos(p), 1.58 + Math.sin(p), this.pos.z + Math.cos(this.camYaw) * Math.cos(p));
      this.olhar = null; return;
    }
    const d = this.camDist;
    const bate = pitch => {
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      for (let s = 0.35; s <= d; s += 0.1) {
        const x = alvo.x - Math.sin(this.camYaw) * cp * s, y = alvo.y + sp * s, z = alvo.z - Math.cos(this.camYaw) * cp * s;
        if (this.solidoCamara(x, z, y)) return s;
      }
      return null;
    };
    let pitch = this.camPitch, hit = bate(pitch);
    while (hit !== null && pitch < 1.32) { pitch += 0.06; hit = bate(pitch); }
    this.pitchEf = this.pitchEf == null ? pitch : this.pitchEf + (pitch - this.pitchEf) * (UI.reduzir ? 1 : Math.min(1, dt * 6));
    const pe = Math.max(this.pitchEf, pitch - 0.25);
    let dist = d;
    const h2 = bate(pe); if (h2 !== null) dist = Math.max(0.6, h2 - 0.2);
    const cp = Math.cos(pe), sp = Math.sin(pe);
    const dir = new THREE.Vector3(-Math.sin(this.camYaw) * cp, sp, -Math.cos(this.camYaw) * cp);
    const want = alvo.clone().addScaledVector(dir, dist);
    const k = UI.reduzir ? 1 : Math.min(1, dt * 9);
    cam.position.lerp(want, this.cIni ? k : 1); this.cIni = true;
    this.olhar = (this.olhar || alvo.clone()).lerp(alvo, Math.min(1, dt * 12));
    cam.lookAt(this.olhar);
  }
};
