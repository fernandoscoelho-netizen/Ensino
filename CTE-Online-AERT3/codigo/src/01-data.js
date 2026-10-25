/* =========================================================
   CTE Online · dados da planta
   DADOS_PLANTA vem de dados/cte-planta.json (gerado a partir do PDF).
   O professor pode editar os dados no separador «Dados» do mapa 2D;
   a versão editada fica neste navegador e substitui a original.
   ========================================================= */
const DADOS_KEY = 'cte-online-dados-v1';
const DP = (() => {
  try {
    const t = localStorage.getItem(DADOS_KEY);
    if (t) { const o = JSON.parse(t); if (o && o.versao === 1 && Array.isArray(o.espacos)) { o.__editado = true; return o; } }
  } catch (e) {}
  return DADOS_PLANTA;
})();

const ORIGENS = {
  medido: 'Medido à escala 1:100 no PDF',
  cota: 'Cota escrita na planta ou na legenda',
  observado: 'Desenhado na planta (posição medida)',
  interpretado: 'Leitura do desenho com alguma ambiguidade',
  estimado: 'Valor estimado (a planta não o define); editável',
  derivado: 'Calculado a partir de outros dados',
  fotografia: 'Observado em fotografia do espaço; posição indicada pelo professor, medidas aproximadas',
  ficcional: 'Acrescentado para o jogo',
  proposta: 'Função pedagógica proposta, não confirmada'
};
const alt = (o, d) => (o && typeof o === 'object' && 'v' in o) ? o.v : (typeof o === 'number' ? o : d);

/* Espaços: «sala» e «laboratorio» são salas; «fora_de_jogo» não se visita */
const PLANTA = {
  bloco: DP.bloco.r,
  volumes: (DP.volumes && DP.volumes.rects) || [DP.bloco.r],
  exterior: DP.exterior.rects,
  rampa: DP.exterior.rampa && DP.exterior.rampa.r,
  peDireito: alt(DP.alturas.peDireito, 3.0),
  alturaPorta: alt(DP.alturas.porta, 2.1),
  peitoril: alt(DP.alturas.janelaPeitoril, 0.9),
  alturaJanela: alt(DP.alturas.janelaAltura, 1.6),
  espacos: DP.espacos.map(e => ({ ...e, tipoJogo: e.tipo === 'fora_de_jogo' ? 'bloqueado' : (e.tipo === 'circulacao' ? 'circulacao' : 'sala') })),
  portas: DP.portas.map(p => ({ ...p, ab: p.vao })),
  inicio: { x: DP.inicio.x, y: DP.inicio.y, rot: DP.inicio.rot || 0 }
};

/* Onde fica cada missão (consola ficcional, ecrã observado ou do jogo) */
const SALAS = {};
const PORTA_DE = {};
DP.missoes.forEach(ms => {
  const c = DP.consolas.find(k => k.missao === ms.id);
  if (!c) return;
  const S = { espaco: ms.espaco, funcao: ms.funcao, consola: { x: c.parede[0], y: c.parede[1], n: c.normal }, ponto: { x: c.ponto[0], y: c.ponto[1] }, raio: c.raio || 1.2 };
  const obs = ms.ecra && DP.ecras_observados.find(e => e.espaco === ms.ecra);
  if (obs) {
    const r = obs.r, n = obs.normal;
    const vertical = (r[2] - r[0]) < (r[3] - r[1]);
    S.ecra = { tipo: 'observado', id: obs.id, r, n, w: alt(obs.largura, 2.02) - 0.1, h: alt(obs.alturaEcra, 1.07), y0: alt(obs.centro, 1.45),
      x: vertical ? (n[0] > 0 ? r[0] + 0.18 : r[2] - 0.18) : (r[0] + r[2]) / 2,
      y: vertical ? (r[1] + r[3]) / 2 : (n[1] > 0 ? r[1] + 0.18 : r[3] - 0.18) };
  } else {
    const f = DP.ficcionais.ecras_jogo.find(e => e.missao === ms.id);
    if (f) S.ecra = { tipo: 'ficcional', x: f.parede[0], y: f.parede[1], n: f.normal, w: f.largura, h: f.altura, y0: f.centro };
  }
  SALAS[ms.id] = S;
  PORTA_DE[ms.id] = ms.porta || null;
});
if (DP.ficcionais.luzes_m5 && SALAS.m5) SALAS.m5.zonas = DP.ficcionais.luzes_m5.zonas.map(z => ({ id: z.id, x: z.c[0], y: z.c[1] }));
if (DP.ficcionais.impressora_m6 && SALAS.m6) { const r = DP.ficcionais.impressora_m6.r; SALAS.m6.impressora = { r, x: (r[0] + r[2]) / 2, y: (r[1] + r[3]) / 2 }; }
if (DP.ficcionais.caixas_m3 && SALAS.m3) {
  const b = DP.mobiliario.find(m => m.id === DP.ficcionais.caixas_m3.sobre);
  if (b && b.r) SALAS.m3.bancada = { r: b.r, alt: alt(b.altura, 0.9) };
}

/* =========================================================
   Imagens que as páginas dos alunos podem usar
   ========================================================= */
function makeArt(kind) {
  const W = 480, H = 260;
  let s = '';
  if (kind === 'sala') {
    s += `<rect width="${W}" height="${H}" fill="#e7eef2"/><rect y="190" width="${W}" height="70" fill="#c9d6dc"/>`;
    s += `<rect x="150" y="30" width="180" height="100" rx="6" fill="#1f3d50"/><rect x="160" y="40" width="160" height="80" fill="#8fc2d8"/>`;
    for (let i = 0; i < 3; i++) {
      const x = 40 + i * 145;
      s += `<rect x="${x}" y="170" width="120" height="12" rx="3" fill="#7a5a3a"/><rect x="${x + 30}" y="132" width="56" height="36" rx="4" fill="#2b3b44"/><rect x="${x + 34}" y="136" width="48" height="28" fill="#9ed3c4"/>`;
    }
  } else if (kind === 'equipamento') {
    s += `<rect width="${W}" height="${H}" fill="#f1efe8"/><rect x="150" y="40" width="180" height="170" rx="10" fill="#2b2b2a"/><rect x="170" y="60" width="140" height="110" fill="#d9e2e6"/><rect x="215" y="120" width="50" height="30" fill="#e2a82c"/><path d="M240 70 v40" stroke="#1f3d50" stroke-width="6"/><rect x="170" y="180" width="140" height="14" rx="4" fill="#1f3d50"/>`;
  } else if (kind === 'cte') {
    s += `<rect width="${W}" height="${H}" fill="#eef3f5"/><path d="M240 20 L340 120 L240 220 L140 120 Z" fill="#1f3d50"/><path d="M240 60 L290 150 L200 170 Z" fill="#ffffff"/><path d="M240 60 L290 150 L250 145 Z" fill="#c9cdd0"/>`;
    s += `<circle cx="120" cy="60" r="22" fill="#2b2b2a"/><circle cx="370" cy="200" r="22" fill="#2b2b2a"/><path d="M135 75 L180 120 M355 185 L310 140" stroke="#2b2b2a" stroke-width="16"/>`;
  } else {
    s += `<rect width="${W}" height="${H}" fill="#e6ecea"/><path d="M60 200 L170 100 L250 170 L320 120 L420 200 Z" fill="#9fbfb4"/><circle cx="360" cy="70" r="26" fill="#e2a82c"/><text x="240" y="240" font-family="sans-serif" font-size="16" text-anchor="middle" fill="#536664">imagem de exemplo</text>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${s}</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
const IMGS = { 'sala.svg': makeArt('sala'), 'equipamento.svg': makeArt('equipamento'), 'cte.svg': makeArt('cte'), 'imagem.svg': makeArt('imagem') };
