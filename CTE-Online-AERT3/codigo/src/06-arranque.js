/* =========================================================
   CTE Online · arranque
   ========================================================= */
(function arrancar() {
  UI.imgLogo = new Image(); UI.imgLogo.src = LOGO_AERT3;
  $$('img[data-img="logo"]').forEach(i => i.src = LOGO_AERT3);
  $$('img[data-img="barra"]').forEach(i => i.src = BARRA_FIN);

  const toque = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  if (toque) document.body.classList.add('toque');

  $('#iNome').value = S.nome || '';
  $('#iQual').value = S.qual || 'normal';
  $('#iReduzir').checked = !!S.reduzir; $('#mReduzir').checked = !!S.reduzir;
  preencherAmostras();
  if (Object.keys(S.lv).length) $('#btnEntrar').textContent = 'Continuar';

  let ok = false;
  try {
    const t = document.createElement('canvas');
    if (t.getContext('webgl2') || t.getContext('webgl')) ok = Mundo.init($('#mundo'), { qualidade: S.qual, avatar: S.av });
  } catch (e) { ok = false; }
  if (!ok) {
    Mundo.pos.x = PLANTA.inicio.x; Mundo.pos.z = PLANTA.inicio.y;
    $('#avisoWebgl').hidden = false; $('#btnEntrar').disabled = true;
    $('#mundo').style.background = 'radial-gradient(circle at 70% 40%,#2d4b5b,#0f1e26)';
  } else {
    Mundo.teleporte(PLANTA.inicio.x, PLANTA.inicio.y, PLANTA.inicio.rot || 0);
    Mundo.aluno.position.set(Mundo.pos.x, 0, Mundo.pos.z);
    animarAluno(Mundo.aluno, 0, 0, 0);
    Mundo.vista = { pos: new THREE.Vector3(28, 17, -12), alvo: new THREE.Vector3(10.5, 0, 9) };
    Mundo.cam.position.copy(Mundo.vista.pos); Mundo.cam.lookAt(Mundo.vista.alvo);
    Object.entries(FX.luzes || {}).forEach(([id, on]) => Mundo.luz('m5', id, on));
    Object.entries(FX.snaps || {}).forEach(([mid, snap]) => { try { Mundo.efeito(mid, snap); } catch (e) {} });
    Mundo.atualizarSalas();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { Mundo.atualizarSalas(); Object.entries(FX.snaps || {}).forEach(([mid, snap]) => { try { Mundo.efeito(mid, snap); } catch (e) {} }); });
  }
  UI.atualizarHud();

  $('#iQual').addEventListener('change', e => { S.qual = e.target.value; guardar(); if (Mundo.pronto) Mundo.setQualidade(S.qual); });
  $('#iReduzir').addEventListener('change', e => { S.reduzir = UI.reduzir = e.target.checked; $('#mReduzir').checked = S.reduzir; guardar(); });
  $('#iNome').addEventListener('input', e => { S.nome = e.target.value; guardar(); });

  const term = $('#terminal');
  term.addEventListener('shown.bs.offcanvas', () => UI.ajustarFaixa());
  term.addEventListener('hidden.bs.offcanvas', () => { if (!UI.verSala) UI.fecharTerminal(); });
  $('#menuModal').addEventListener('hidden.bs.modal', () => { if (UI.modo === 'jogo' && !UI.terminalAberto) { Mundo.pausa = false; $('#mundo').focus({ preventScroll: true }); } });
  window.addEventListener('resize', () => UI.ajustarFaixa());
  Mapa2D.init();

  const mini = $('#minimapa');
  setInterval(() => { if (UI.modo === 'jogo' && !mini.hidden) Mapa2D.mini(mini); }, 150);
  mini.addEventListener('click', () => UI.abrirPlanta());

  /* joystick e botões de toque */
  const joy = $('#joy'), bola = joy.querySelector('i');
  let jid = null;
  joy.addEventListener('pointerdown', e => { jid = e.pointerId; joy.setPointerCapture(jid); mexer(e); });
  joy.addEventListener('pointermove', e => { if (e.pointerId === jid) mexer(e); });
  const soltar = () => { jid = null; Mundo.joy.x = 0; Mundo.joy.y = 0; bola.style.transform = ''; };
  joy.addEventListener('pointerup', soltar); joy.addEventListener('pointercancel', soltar);
  function mexer(e) {
    const b = joy.getBoundingClientRect(), r = b.width / 2;
    let dx = (e.clientX - b.left - r) / r, dy = (e.clientY - b.top - r) / r; const l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; }
    Mundo.joy.x = dx; Mundo.joy.y = -dy; bola.style.transform = `translate(${dx * r * 0.6}px,${dy * r * 0.6}px)`;
  }
})();
window.__cte = { UI, Mundo, MISSOES, avaliar, estado: () => S, PORTAS, Mapa2D, DP, SALAS };
