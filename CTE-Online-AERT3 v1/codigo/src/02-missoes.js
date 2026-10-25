/* =========================================================
   CTE Online · missões e níveis
   Cada função check corre isolada na página do aluno:
   não pode usar nada de fora (recebe T com utilitários).
   ========================================================= */

const TUT_CSS = `body{background:#0f2531;color:#fff;display:grid;place-items:center;min-height:90vh;text-align:center}
h1{font-size:2.2rem;margin:0 0 8px;color:#ffd166}
p{color:#c9d6dc;margin:0}`;

const M1_CSS = `header{border-bottom:3px solid #1f3d50;padding-bottom:8px;margin-bottom:12px}
h1{margin:0 0 4px;font-size:1.6rem;color:#1f3d50}
h2{font-size:1.15rem;margin:14px 0 6px}
img{display:block;border-radius:8px;margin:8px 0;width:100%;max-width:420px}
nav{display:flex;gap:14px;margin:6px 0}
a{color:#1f3d50;font-weight:700}
li{margin:2px 0}
footer{margin-top:16px;padding-top:8px;border-top:1px solid #c9d6dc;color:#536664;font-size:.9rem}`;

const M2_HTML = `<h1 class="titulo">Sala E2 · Projetos</h1>
<p>Três equipas trabalham nesta sala. Cada painel mostra o projeto de uma equipa.</p>
<section class="paineis">
  <article class="painel" id="robotica">
    <h2>Robótica</h2>
    <p>Um robô que segue linhas e evita obstáculos.</p>
  </article>
  <article class="painel destaque" id="multimedia">
    <h2>Multimédia</h2>
    <p>Um vídeo de apresentação do CTE para o dia aberto.</p>
  </article>
  <article class="painel" id="redes">
    <h2>Redes</h2>
    <p>A rede sem fios da sala, com segurança reforçada.</p>
  </article>
</section>`;
const M2_CSS = `body{background:#f4f6f7}
.titulo{margin:0 0 6px}
.paineis{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-top:12px}
.painel h2{margin:0 0 6px;font-size:1.1rem}
.painel p{margin:0}`;

const M3_HTML = `<nav class="menu">
  <a class="logo" href="#">CTE · AERT3</a>
  <ul class="ligacoes">
    <li><a href="#salas">Salas</a></li>
    <li><a href="#horarios">Horários</a></li>
    <li><a href="#projetos">Projetos</a></li>
    <li><a href="#inscricoes">Inscrições</a></li>
  </ul>
</nav>
<main class="conteudo">
  <h1>Portal do CTE</h1>
  <p>Escolhe uma opção no menu.</p>
</main>`;
const M3_CSS = `body{padding:0}
.menu{background:#1f3d50;padding:10px 16px}
.logo{color:#fff;font-weight:800;font-size:1.4rem;text-decoration:none;padding:6px 0;white-space:nowrap}
.ligacoes{list-style:none;margin:0;padding:0}
.ligacoes a{display:block;color:#fff;text-decoration:none;padding:6px 12px;border-radius:6px;background:rgba(255,255,255,.14)}
.conteudo{padding:16px}`;
const M3_CARDS_HTML = `<h1>Workshops da Sala E3</h1>
<section class="cartoes">
  <article class="cartao">
    <h3>Impressão 3D</h3>
    <p>Do modelo digital à peça real.</p>
    <button>Inscrever</button>
  </article>
  <article class="cartao">
    <h3>Robótica com Arduino</h3>
    <p>Sensores, motores e um robô que segue linhas pelo chão da sala, programado por ti.</p>
    <button>Inscrever</button>
  </article>
  <article class="cartao">
    <h3>Edição de vídeo</h3>
    <p>Grava, corta e publica um vídeo curto sobre o CTE.</p>
    <button>Inscrever</button>
  </article>
</section>`;
const M3_CARDS_CSS = `h1{margin:0 0 12px;font-size:1.5rem;color:#1f3d50}
.cartao{background:#fff;border:2px solid #cfe0db;border-radius:10px;padding:12px}
.cartao h3{margin:0 0 6px}
.cartao p{margin:0 0 12px}
button{font:inherit;background:#1f3d50;color:#fff;border:0;border-radius:6px;padding:8px 12px}`;

const M4_HTML = `<h1>Mural do CTE</h1>
<section class="mural">
  <article class="cartao">
    <span class="data">5 nov</span>
    <h3>Clube de Robótica</h3>
    <p>Montagem de um braço robótico.</p>
  </article>
  <article class="cartao destaque">
    <span class="data">12 nov</span>
    <h3>Dia Aberto do CTE</h3>
    <p>As salas E1 a E6 abrem às famílias, com demonstrações.</p>
  </article>
  <article class="cartao">
    <span class="data">19 nov</span>
    <h3>Hackathon</h3>
    <p>24 horas para criar uma aplicação.</p>
  </article>
  <article class="cartao">
    <span class="data">26 nov</span>
    <h3>Impressão 3D</h3>
    <p>Workshop na Sala E3.</p>
  </article>
  <article class="cartao">
    <span class="data">3 dez</span>
    <h3>Visita de estudo</h3>
    <p>Visita a uma empresa de software.</p>
  </article>
  <article class="cartao">
    <span class="data">Até 10 dez</span>
    <h3>Jornal digital</h3>
    <p>Envia a tua notícia sobre o CTE.</p>
  </article>
</section>`;
const M4_CSS = `h1{margin:0 0 12px;font-size:1.5rem;color:#1f3d50}
.cartao{background:#f3f7f6;border:2px solid #cfe0db;border-radius:10px;padding:12px}
.cartao h3{margin:4px 0}
.cartao p{margin:0;font-size:.95rem}
.data{font-size:.78rem;font-weight:700;color:#1f3d50;text-transform:uppercase;letter-spacing:.04em}
.destaque{background:#fff4d6;border-color:#e2a82c}`;
const M4_HOR_HTML = `<h1>Horário da Sala E4</h1>
<div class="horario">
  <div class="dia">Seg</div>
  <div class="dia">Ter</div>
  <div class="dia">Qua</div>
  <div class="dia">Qui</div>
  <div class="dia">Sex</div>
  <div class="aula">Programação</div>
  <div class="aula dupla">Projeto (2 tempos)</div>
  <div class="aula">Redes</div>
  <div class="aula">Inglês</div>
  <div class="aula">Matemática</div>
  <div class="aula">Português</div>
  <div class="aula">Sistemas</div>
  <div class="aula">Ed. Física</div>
  <div class="aula">Multimédia</div>
</div>`;
const M4_HOR_CSS = `h1{margin:0 0 12px;font-size:1.5rem;color:#1f3d50}
.dia{background:#1f3d50;color:#fff;font-weight:700;padding:6px;text-align:center;border-radius:6px}
.aula{background:#eef3f5;border:1px solid #c9d6dc;padding:8px;border-radius:6px}
.dupla{background:#fff4d6;border-color:#e2a82c}`;

const M5_CSS = `h1{margin:0 0 12px;font-size:1.5rem;color:#1f3d50}
#total{font-size:1.4rem;font-weight:700}
.zona{padding:20px;border-radius:8px;background:#2b3b44;color:#9aa5a8;font-weight:700;transition:background .3s}
.zona.acesa{background:#ffe9a8;color:#3a2a00}
.zonas{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.botoes{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
button{font:inherit;background:#1f3d50;color:#fff;border:0;border-radius:6px;padding:8px 12px;cursor:pointer}
#zona-a{margin:8px 0}
label{font-weight:600;display:block;margin-bottom:4px}
input{font:inherit;padding:6px;width:120px}
.barra{height:18px;background:#e6ecea;border-radius:9px;overflow:hidden;max-width:360px}
#ocupacao{height:100%;width:0;background:#e2a82c}`;

const M6_FORM = `<h1>Inscrições nos workshops</h1>
<form id="inscricao" novalidate>
  <label for="nome">Nome completo</label>
  <input id="nome" autocomplete="off">
  <label for="email">Email</label>
  <input id="email" type="email" autocomplete="off">
  <label for="ano">Ano</label>
  <select id="ano">
    <option value="">Escolhe o ano</option>
    <option>10.º ano</option>
    <option>11.º ano</option>
    <option>12.º ano</option>
  </select>
  <label for="workshop">Workshop</label>
  <select id="workshop">
    <option>Impressão 3D</option>
    <option>Robótica com Arduino</option>
    <option>Edição de vídeo</option>
    <option>Redes e cibersegurança</option>
  </select>
  <button type="submit">Inscrever</button>
</form>
<p id="mensagem" role="status"></p>
<section id="resumo" hidden></section>`;
const M6_CSS = `h1{margin:0 0 12px;font-size:1.5rem;color:#1f3d50}
form{display:grid;gap:6px;max-width:340px}
label{font-weight:600;margin-top:4px}
input,select,button{font:inherit;padding:6px}
button{background:#1f3d50;color:#fff;border:0;border-radius:6px;padding:8px;margin-top:8px;cursor:pointer}
.erro{color:#b3392a;font-weight:700}
.sucesso{color:#21734a;font-weight:700}
#resumo{margin-top:8px;padding:10px;border:2px solid #21734a;border-radius:8px;background:#e0f0e6;max-width:340px}
table{border-collapse:collapse;width:100%;max-width:420px}
th,td{text-align:left;padding:6px 8px;border-bottom:1px solid #ccd}
tr.ok td:nth-child(2){color:#21734a;font-weight:700}
tr.falha{background:#f7e3df}
tr.falha td:nth-child(2){color:#b3392a;font-weight:700}
#inscritos li{margin:2px 0}`;

/* ---------------------------------------------------------
   Tutorial
   --------------------------------------------------------- */
const TUT = {
  id: 'tut', n: 0, sala: 'Entrada', title: 'Primeiro contacto', learn: 'Movimento, terminal e a primeira etiqueta HTML',
  levels: [{
    id: 'tut1', kind: 'completar', editable: ['html'], title: 'Acordar o portal',
    sit: 'O ecrã da entrada está apagado e a porta do corredor está trancada.',
    obj: 'Completa a etiqueta para que o texto passe a ser o título principal da página. Depois carrega em Testar.',
    base: { css: TUT_CSS },
    req: ['«Bem-vindo ao CTE» é o título principal (`<h1>`)', 'A etiqueta de abertura e a de fecho coincidem'],
    code: `<{{a}}>Bem-vindo ao CTE</{{b}}>
<p>Centro Tecnológico Especializado · AERT3</p>`,
    blanks: { a: 2, b: 2 },
    precheck: b => {
      const a = (b.a || '').trim(), c = (b.b || '').trim();
      return a !== c ? { i: 1, msg: `A etiqueta abre com <${a || '…'}> e fecha com </${c || '…'}>. As duas têm de ter o mesmo nome.` } : null;
    },
    hints: [
      'Uma etiqueta HTML abre com `<nome>` e fecha com `</nome>`. O título mais importante de uma página chama-se `h1`.',
      'Escreve `h1` nos dois espaços.',
      { t: 'Numa página da biblioteca, ficaria assim:', code: '<h1>Biblioteca</h1>' }
    ],
    check: function (T) {
      var h = T.q('h1');
      return [
        T.ok(h && /Bem-vindo ao CTE/.test(T.text(h)), 'O texto ainda não é o título principal. O título principal usa a etiqueta h1.'),
        T.ok(true, '')
      ];
    },
    sol: { blanks: { a: 'h1', b: 'h1' } },
    explain: 'O que mudou na página quando usaste h1? Para que serve a etiqueta de fecho?'
  }]
};

/* ---------------------------------------------------------
   M1 · Sala E1 · HTML
   --------------------------------------------------------- */
const M1 = {
  id: 'm1', n: 1, sala: 'Sala E1', title: 'Ligar a sala', learn: 'Estrutura HTML, elementos semânticos e atributos',
  levels: [
    {
      id: 'm1l1', kind: 'explorar', editable: ['html'], title: 'Uma página sem forma',
      sit: 'A página da Sala E1 perdeu a estrutura: o título, a lista de equipamento e a ligação aparecem como texto solto.',
      obj: 'Usa os controlos para escolher os elementos e os atributos certos. Repara no que muda no código, na página e no quadro da sala.',
      base: { css: M1_CSS },
      req: ['O título principal usa `<h1>`', 'O equipamento está numa lista (`<ul>` ou `<ol>`)', 'A imagem tem texto alternativo (`alt`)', 'A ligação tem um endereço completo (`href`)'],
      controls: [
        { id: 'tit', label: 'Elemento do título', type: 'select', options: ['p', 'h2', 'h1'], value: 'p' },
        { id: 'lista', label: 'Contentor da lista', type: 'select', options: ['div', 'ul', 'ol'], value: 'div' },
        { id: 'alt', label: 'Texto alternativo da imagem', type: 'text', value: '', ph: 'Descreve a imagem' },
        { id: 'href', label: 'Endereço da ligação', type: 'select', options: ['', '#', 'https://cte.exemplo.pt/reservas'], value: '' }
      ],
      template: v => `<header>
  <${v.tit}>Sala E1</${v.tit}>
  <p>Laboratório de informática do CTE, com 24 postos de trabalho.</p>
</header>
<main>
  <img src="sala.svg" alt="${String(v.alt).replace(/"/g, '&quot;')}">
  <h2>Equipamento</h2>
  <${v.lista}>
    <li>24 computadores</li>
    <li>Quadro interativo</li>
    <li>Impressora 3D</li>
  </${v.lista}>
  <a href="${v.href}">Reservar a sala</a>
</main>`,
      hints: [
        'Cada elemento HTML diz ao navegador o que o conteúdo é. Um título não é só texto grande: é `<h1>`. Uma lista agrupa itens `<li>`.',
        'Experimenta `h1` no título e `ul` ou `ol` na lista. Escreve no alt uma frase que descreva a imagem e escolhe um endereço começado por `https://`.',
        { t: 'Numa página da cantina, ficaria assim:', code: '<h1>Cantina</h1>\n<ul>\n  <li>Sopa de legumes</li>\n</ul>\n<img src="cantina.svg" alt="Tabuleiro com sopa e pão">\n<a href="https://www.exemplo.pt">Ver ementa</a>' }
      ],
      check: function (T) {
        var h1 = T.q('header h1'), list = T.q('main ul, main ol'), img = T.q('main img'), a = T.q('main a');
        var alt = img ? (img.getAttribute('alt') || '').trim() : '';
        var href = a ? (a.getAttribute('href') || '').trim() : '';
        return [
          T.ok(h1 && T.text(h1), 'O título da página ainda não é o título principal. Qual é o elemento de título mais importante?'),
          T.ok(list && T.qa('li', list).length >= 3, 'O equipamento ainda não está numa lista. Os itens <li> precisam de um contentor de lista.'),
          T.ok(alt.length >= 5, 'A imagem precisa de um texto alternativo que a descreva, para quem não a consegue ver.'),
          T.ok(/^https?:\/\/\S+\.\S+/.test(href), 'A ligação ainda não leva a lado nenhum. O href deve ter um endereço completo, começado por https://.')
        ];
      },
      sol: { vals: { tit: 'h1', lista: 'ul', alt: 'Sala com bancadas e computadores', href: 'https://cte.exemplo.pt/reservas' } },
      explain: 'Porque é que a imagem precisa de um texto alternativo? Que diferença notaste entre ul e ol?'
    },
    {
      id: 'm1l2', kind: 'completar', editable: ['html'], title: 'Zonas da página',
      sit: 'A página tem conteúdo, mas faltam os elementos que dizem que papel tem cada zona: cabeçalho, navegação e rodapé.',
      obj: 'Preenche os espaços com os elementos semânticos e os atributos em falta. O quadro da sala acende cada zona que reconhecer.',
      base: { css: M1_CSS },
      req: ['O cabeçalho usa `<header>` e contém o título', 'As ligações estão numa navegação (`<nav>`)', 'A imagem tem `src` e `alt`', 'O rodapé usa `<footer>`'],
      code: `<{{a}}>
  <h1>Sala E1</h1>
  <p>Laboratório de informática do CTE.</p>
</{{a2}}>
<{{b}}>
  <a href="#equipamento">Equipamento</a>
  <a href="#horario">Horário</a>
</nav>
<main>
  <img {{c}}="sala.svg" {{d}}="Sala com bancadas e computadores">
  <h2 id="equipamento">Equipamento</h2>
  <ul>
    <li>24 computadores</li>
    <li>Quadro interativo</li>
    <li>Impressora 3D</li>
  </ul>
</main>
<{{e}}>CTE · AERT3 · Escola Secundária de Rio Tinto</footer>`,
      blanks: { a: 6, a2: 6, b: 3, c: 3, d: 3, e: 6 },
      precheck: b => {
        const t = k => (b[k] || '').trim();
        return t('a') !== t('a2') ? { i: 0, msg: `O cabeçalho abre com <${t('a') || '…'}> e fecha com </${t('a2') || '…'}>. Abertura e fecho têm de coincidir.` } : null;
      },
      hints: [
        'Os elementos semânticos dizem que papel tem cada zona: `<header>` (cabeçalho), `<nav>` (navegação), `<main>` (conteúdo principal), `<footer>` (rodapé). Os atributos escrevem-se `nome="valor"`.',
        'Usa `header`, `nav` e `footer`. A imagem precisa de `src` (o ficheiro) e `alt` (a descrição).',
        { t: 'Numa página do ginásio, ficaria assim:', code: '<header>\n  <h1>Ginásio</h1>\n</header>\n<nav>\n  <a href="#horario">Horário</a>\n</nav>\n<footer>Escola</footer>' }
      ],
      check: function (T) {
        var img = T.q('main img');
        var src = img ? (img.getAttribute('data-mw-src') || img.getAttribute('src') || '') : '';
        var alt = img ? (img.getAttribute('alt') || '').trim() : '';
        var nav = T.q('nav');
        return [
          T.ok(T.q('header h1'), 'O título e a descrição têm de ficar dentro do elemento de cabeçalho: header.'),
          T.ok(nav && T.qa('a', nav).length >= 2, 'As duas ligações ainda não estão num elemento de navegação. Repara na etiqueta de fecho que já existe.'),
          T.ok(src && alt, 'A imagem precisa de dois atributos: um com o ficheiro a mostrar e outro com a descrição.'),
          T.ok(T.q('footer') && T.text(T.q('footer')).length > 3, 'A última linha é o rodapé da página. Que elemento semântico se usa para o rodapé?')
        ];
      },
      sol: { blanks: { a: 'header', a2: 'header', b: 'nav', c: 'src', d: 'alt', e: 'footer' } },
      explain: 'Para que servem header, nav, main e footer, se a página parece igual sem eles?'
    },
    {
      id: 'm1l3', kind: 'construir', editable: ['html'], title: 'A página da Sala E1',
      sit: 'A Sala E1 precisa de uma página nova no portal do CTE, feita de raiz.',
      obj: 'Escreve o HTML com cabeçalho, navegação, zona principal (imagem sala.svg e lista de equipamento) e rodapé.',
      base: { css: M1_CSS },
      starter: { html: `<!-- Página da Sala E1
     Precisa de:
     - cabeçalho com título e descrição
     - navegação com 2 ligações
     - zona principal com a imagem sala.svg e uma lista de equipamento
     - rodapé -->

` },
      req: ['Há um `<header>` com um título `<h1>`', 'Há uma `<nav>` com pelo menos 2 ligações', 'O `<main>` tem uma imagem com `src` e `alt` descritivo', 'Uma lista com pelo menos 3 equipamentos', 'Há um `<footer>` com texto'],
      hints: [
        'Uma página bem estruturada divide-se em zonas: `header`, `nav`, `main` e `footer`. Cada zona tem os seus elementos lá dentro.',
        'Vais precisar de: `header` com `h1` e `p`; `nav` com dois `a href="#…"`; `main` com `img src="sala.svg" alt="…"` e `ul` com `li`; `footer`.',
        { t: 'Esqueleto (preenche com o teu conteúdo):', code: '<header>\n  <h1>…</h1>\n  <p>…</p>\n</header>\n<nav>\n  <a href="#…">…</a>\n</nav>\n<main>\n  <img src="…" alt="…">\n  <ul>\n    <li>…</li>\n  </ul>\n</main>\n<footer>…</footer>' }
      ],
      check: function (T) {
        var nav = T.q('nav'), img = T.q('main img');
        var alt = img ? (img.getAttribute('alt') || '').trim() : '';
        var src = img ? (img.getAttribute('data-mw-src') || img.getAttribute('src') || '') : '';
        var list = T.q('main ul, main ol');
        return [
          T.ok(T.q('header h1') && T.text(T.q('header h1')), 'Falta um <header> com um título <h1> lá dentro.'),
          T.ok(nav && T.qa('a[href]', nav).length >= 2, 'Falta uma <nav> com pelo menos duas ligações <a href="…">.'),
          T.ok(src && alt.length >= 5, 'Dentro de <main>, falta uma imagem com src (usa sala.svg) e um alt que a descreva.'),
          T.ok(list && T.qa('li', list).length >= 3, 'Falta, dentro de <main>, uma lista com pelo menos 3 itens <li>.'),
          T.ok(T.q('footer') && T.text(T.q('footer')).length > 2, 'Falta um <footer> com texto no fim da página.')
        ];
      },
      sol: { code: { html: '<header><h1>Sala E1</h1><p>Laboratório de informática.</p></header><nav><a href="#eq">Equipamento</a><a href="#hor">Horário</a></nav><main><img src="sala.svg" alt="Sala com computadores"><ul><li>24 computadores</li><li>Quadro interativo</li><li>Impressora 3D</li></ul></main><footer>CTE · AERT3</footer>' } },
      explain: 'Como dividiste a página? Que elemento escolheste para cada zona e porquê?'
    },
    {
      id: 'm1l4', kind: 'desafio', editable: ['html'], title: 'Quatro erros no horário',
      sit: 'Alguém publicou o horário da Sala E1 com pressa. A página parece quase certa, mas tem quatro erros de HTML.',
      obj: 'Encontra e corrige os quatro erros, sem apagar conteúdo.',
      base: { css: M1_CSS },
      starter: { html: `<!-- Esta página tem 4 erros. Encontra-os e corrige-os. -->
<header>
  <h1>Horário da Sala E1</h1>
</header>
<main>
  <img src="sala.svg" alt="">
  <h3>Segunda-feira</h3>
  <ul>
    <li>9h00 · Programação</li>
    <li>11h00 · Redes</li>
  <ul>
  <a>Reservar a sala</a>
</main>
` },
      req: ['A imagem tem texto alternativo', 'Os títulos descem um nível de cada vez (`h1` → `h2`)', 'A lista abre e fecha corretamente (só existe uma lista)', 'A ligação tem um endereço (`href`)'],
      hints: [
        'O navegador tenta «adivinhar» o que querias quando o HTML tem erros, por isso a página pode parecer quase certa. Verifica as etiquetas de fecho (têm uma barra), os atributos obrigatórios e a ordem dos títulos.'
      ],
      check: function (T) {
        var img = T.q('img'), alt = img ? (img.getAttribute('alt') || '').trim() : '';
        var hs = T.qa('h1,h2,h3,h4,h5,h6'), order = hs.length > 1;
        for (var i = 1; i < hs.length; i++) { if (+hs[i].tagName[1] > +hs[i - 1].tagName[1] + 1) order = false; }
        var a = T.q('a'), href = a ? (a.getAttribute('href') || '').trim() : '';
        return [
          T.ok(alt.length >= 5, 'A imagem continua sem descrição.'),
          T.ok(order, 'Depois de um h1 não pode vir logo um h3: os títulos descem um nível de cada vez.'),
          T.ok(T.qa('ul').length === 1, 'Há uma lista dentro de outra lista. Uma das etiquetas que devia fechar a lista está a abrir uma nova.'),
          T.ok(href && href !== '#', 'A ligação «Reservar a sala» não tem destino.')
        ];
      },
      sol: { code: { html: '<header><h1>Horário da Sala E1</h1></header><main><img src="sala.svg" alt="Sala com computadores"><h2>Segunda-feira</h2><ul><li>9h00 · Programação</li><li>11h00 · Redes</li></ul><a href="https://cte.exemplo.pt/reservas">Reservar a sala</a></main>' } },
      explain: 'Que erro foi mais difícil de encontrar? Porque é que o navegador não o mostrou?'
    }
  ]
};

/* ---------------------------------------------------------
   M2 · Sala E2 · CSS base
   --------------------------------------------------------- */
const M2 = {
  id: 'm2', n: 2, sala: 'Sala E2', title: 'Dar cor ao espaço', learn: 'CSS: seletores, cores, tipografia e modelo de caixa',
  levels: [
    {
      id: 'm2l1', kind: 'explorar', editable: ['css'], title: 'Painéis cinzentos',
      sit: 'Os painéis dos projetos da Sala E2 estão sem cor, sem espaço interior e quase ilegíveis.',
      obj: 'Experimenta cores, espaço interior e bordas até os painéis ficarem legíveis e organizados. Os painéis da parede da sala mudam contigo.',
      base: { html: M2_HTML, css: M2_CSS },
      req: ['Os painéis têm cor de fundo', 'O texto tem bom contraste com o fundo (pelo menos 4,5 para 1)', 'Há pelo menos 12px de espaço interior (`padding`)', 'Os painéis têm borda visível e cantos arredondados'],
      controls: [
        { id: 'bg', label: 'background-color', type: 'select', options: ['transparent', '#ffffff', '#1f3d50', '#e2a82c', '#d5e7df'], value: 'transparent' },
        { id: 'fg', label: 'color', type: 'select', options: ['#9aa5a8', '#1b2526', '#ffffff'], value: '#9aa5a8' },
        { id: 'p', label: 'padding', type: 'range', min: 0, max: 32, step: 2, value: 0, unit: 'px' },
        { id: 'bw', label: 'largura da borda', type: 'range', min: 0, max: 6, step: 1, value: 0, unit: 'px' },
        { id: 'bc', label: 'cor da borda', type: 'select', options: ['#1f3d50', '#e2a82c', '#2b2b2a'], value: '#1f3d50' },
        { id: 'r', label: 'border-radius', type: 'range', min: 0, max: 24, step: 2, value: 0, unit: 'px' }
      ],
      template: v => `.painel {
  background-color: ${v.bg};
  color: ${v.fg};
  padding: ${v.p}px;
  border: ${v.bw}px solid ${v.bc};
  border-radius: ${v.r}px;
}`,
      hints: [
        'Cada regra CSS tem um seletor (`.painel`) e declarações `propriedade: valor;`. O modelo de caixa tem conteúdo, `padding` (espaço interior), `border` (borda) e `margin` (espaço exterior).',
        'Para ler bem, o texto e o fundo precisam de contraste: texto escuro em fundo claro, ou texto branco em fundo escuro. Um `padding` de 16px e um `border-radius` de 8px resultam bem.',
        { t: 'Num aviso da cantina, ficaria assim:', code: '.aviso {\n  background-color: #fff4d6;\n  color: #1b2526;\n  padding: 20px;\n  border: 3px solid #e2a82c;\n  border-radius: 12px;\n}' }
      ],
      check: function (T) {
        var ps = T.qa('.painel'), p = ps[0], st = T.cs(p);
        var bgOk = T.alpha(st.backgroundColor) > 0;
        var con = ps.every(function (el) { return T.contrast(T.cs(el).color, T.bgOf(el)) >= 4.5; });
        return [
          T.ok(bgOk, 'Os painéis ainda não têm cor de fundo.'),
          T.ok(con, 'O texto é difícil de ler: a cor do texto e a do fundo são parecidas.'),
          T.ok(parseFloat(st.paddingTop) >= 12, 'O texto está colado à borda. Aumenta o espaço interior.'),
          T.ok(parseFloat(st.borderTopWidth) >= 1 && parseFloat(st.borderTopLeftRadius) >= 4, 'Falta uma borda visível ou os cantos arredondados.')
        ];
      },
      sol: { vals: { bg: '#1f3d50', fg: '#ffffff', p: '16', bw: '2', bc: '#e2a82c', r: '10' } },
      explain: 'Porque é que o texto cinzento sobre branco não passou? O que é o padding?'
    },
    {
      id: 'm2l2', kind: 'completar', editable: ['css'], title: 'Seletores trocados',
      sit: 'As regras de estilo da Sala E2 perderam os seletores e algumas propriedades.',
      obj: 'Completa cada regra seguindo o comentário que está por cima dela.',
      base: { html: M2_HTML, css: M2_CSS },
      req: ['Todos os parágrafos têm `line-height: 1.6`', 'Os painéis têm 16px de espaço interior e borda', 'Só o painel `#multimedia` tem fundo amarelo', 'O título tem cor azul-petróleo e 30px'],
      code: `/* todos os parágrafos */
{{s1}} {
  line-height: 1.6;
}

/* os elementos com a classe painel */
{{s2}} {
  padding: 16px;
  border: 2px solid #1f3d50;
  background-color: #ffffff;
}

/* o elemento com o id multimedia */
{{s3}} {
  background-color: #fff4d6;
}

.titulo {
  {{p1}}: #1f3d50;   /* cor do texto */
  {{p2}}: 30px;      /* tamanho da letra */
}`,
      blanks: { s1: 2, s2: 8, s3: 11, p1: 6, p2: 10 },
      hints: [
        'Um seletor escolhe os elementos a estilizar: o nome do elemento (`p`), uma classe com ponto (`.painel`) ou um id com cardinal (`#multimedia`).',
        'Os seletores são `p`, `.painel` e `#multimedia`. A cor do texto é `color` e o tamanho da letra é `font-size`.',
        { t: 'Noutra página, ficaria assim:', code: 'li {\n  margin: 4px;\n}\n.aviso {\n  padding: 8px;\n}\n#topo {\n  background-color: #eee;\n}\nh1 {\n  color: navy;\n  font-size: 40px;\n}' }
      ],
      check: function (T) {
        var ps = T.qa('p');
        var lh = ps.length && ps.every(function (p) { var s = T.cs(p); return Math.abs(parseFloat(s.lineHeight) / parseFloat(s.fontSize) - 1.6) < 0.03; });
        var pa = T.cs(T.q('#robotica'));
        var mm = T.cs(T.q('#multimedia')), rb = T.cs(T.q('#robotica'));
        var tt = T.cs(T.q('.titulo'));
        return [
          T.ok(lh, 'Os parágrafos ainda não têm a entrelinha pedida. Que seletor escolhe todos os elementos p?'),
          T.ok(parseFloat(pa.paddingTop) === 16 && parseFloat(pa.borderTopWidth) === 2, 'Os painéis não têm o espaço interior e a borda. Uma classe escreve-se com ponto.'),
          T.ok(T.same(mm.backgroundColor, 'rgb(255, 244, 214)') && T.same(rb.backgroundColor, 'rgb(255, 255, 255)'), 'O fundo amarelo devia aplicar-se só ao painel com id multimedia. Um id escreve-se com cardinal (#).'),
          T.ok(T.same(tt.color, 'rgb(31, 61, 80)') && parseFloat(tt.fontSize) === 30, 'Faltam as propriedades do título: a cor do texto e o tamanho da letra.')
        ];
      },
      sol: { blanks: { s1: 'p', s2: '.painel', s3: '#multimedia', p1: 'color', p2: 'font-size' } },
      explain: 'Qual é a diferença entre um seletor de classe e um seletor de id? Quando usarias cada um?'
    },
    {
      id: 'm2l3', kind: 'construir', editable: ['css'], title: 'Estilo das equipas',
      sit: 'As equipas querem painéis com identidade própria, mas legíveis.',
      obj: 'Escreve o CSS dos painéis, do painel em destaque e do título. Escolhe as tuas cores.',
      base: { html: M2_HTML, css: M2_CSS },
      starter: { css: `/* Estiliza os painéis da Sala E2.
   Lembra-te: .classe, #id, propriedade: valor; */
.painel {

}

.destaque {

}

.titulo {

}
` },
      req: ['Todos os painéis têm pelo menos 12px de espaço interior', 'Todos os painéis têm borda visível e cantos arredondados (6px ou mais)', 'O painel em destaque tem um fundo diferente dos outros', 'O texto de todos os painéis tem bom contraste (4,5 para 1)', 'O título principal tem letra maior do que 24px'],
      hints: [
        'O modelo de caixa: conteúdo, `padding`, `border` e `margin`. As cores podem ser escritas em hexadecimal (`#1f3d50`) ou com nomes (`white`).',
        'Em `.painel`: `padding`, `border` e `border-radius`. Em `.destaque`: `background-color`. Em `.titulo`: `font-size`. Confirma que a cor do texto contrasta com o fundo.',
        { t: 'Num cartão de outro site, ficaria assim:', code: '.cartao {\n  padding: 14px;\n  border: 1px solid #333;\n  border-radius: 8px;\n}\n.cartao-especial {\n  background-color: #e0f0e6;\n}' }
      ],
      check: function (T) {
        var ps = T.qa('.painel'), d = T.q('.destaque'), r = T.q('#robotica');
        return [
          T.ok(ps.every(function (p) { var s = T.cs(p); return Math.min(parseFloat(s.paddingTop), parseFloat(s.paddingLeft), parseFloat(s.paddingRight), parseFloat(s.paddingBottom)) >= 12; }), 'Há painéis com menos de 12px de espaço interior.'),
          T.ok(ps.every(function (p) { var s = T.cs(p); return parseFloat(s.borderTopWidth) >= 1 && s.borderTopStyle !== 'none' && parseFloat(s.borderTopLeftRadius) >= 6; }), 'Todos os painéis precisam de uma borda visível e de cantos arredondados (6px ou mais).'),
          T.ok(!T.same(T.bgOf(d), T.bgOf(r)), 'O painel em destaque tem o mesmo fundo que os outros.'),
          T.ok(ps.every(function (p) { return T.qa('h2,p', p).every(function (x) { return T.contrast(T.cs(x).color, T.bgOf(x)) >= 4.5; }); }), 'Há texto com pouco contraste num dos painéis.'),
          T.ok(parseFloat(T.cs(T.q('.titulo')).fontSize) > 24, 'O título principal precisa de letra maior do que 24px.')
        ];
      },
      sol: { code: { css: '.painel{padding:16px;border:2px solid #1f3d50;border-radius:10px;background:#fff}.destaque{background-color:#fff4d6}.titulo{font-size:30px}' } },
      explain: 'Como escolheste as cores? Como confirmaste que o texto se lê bem?'
    },
    {
      id: 'm2l4', kind: 'desafio', editable: ['css'], title: 'Regras que não funcionam',
      sit: 'Alguém escreveu os estilos da Sala E2, mas nenhuma regra parece funcionar.',
      obj: 'Há quatro erros. Corrige-os sem apagar regras: os painéis normais ficam verde-claros, o destaque amarelo, os títulos azul-petróleo e todos com 16px de espaço interior.',
      base: { html: M2_HTML, css: M2_CSS },
      starter: { css: `/* Os estilos não estão a funcionar. Há 4 erros.
   Encontra-os e corrige-os sem apagar regras. */
#paineis .painel {
  background-color: #d5e7df;
}

.painel destaque {
  background-color: #fff4d6;
}

.painel h2 {
  colour: #1f3d50;
}

.painel {
  padding: 16;
  border: 2px solid #1f3d50;
}
` },
      req: ['Os painéis normais têm fundo verde-claro (`#d5e7df`)', 'O painel em destaque tem fundo amarelo (`#fff4d6`)', 'Os títulos dos painéis são azul-petróleo (`#1f3d50`)', 'Os painéis têm 16px de espaço interior'],
      hints: [
        'Quando uma regra não se aplica, confirma: o seletor corresponde mesmo ao HTML (classe com ponto, id com cardinal)? A propriedade está bem escrita? O valor tem unidade? Se duas regras competem pelo mesmo elemento, ganha a mais específica.'
      ],
      check: function (T) {
        return [
          T.ok(T.same(T.cs(T.q('#robotica')).backgroundColor, 'rgb(213, 231, 223)'), 'Os painéis normais continuam sem o fundo verde-claro. O seletor corresponde ao HTML?'),
          T.ok(T.same(T.cs(T.q('#multimedia')).backgroundColor, 'rgb(255, 244, 214)'), 'O painel em destaque não está amarelo. Repara no seletor e em quem ganha quando duas regras competem.'),
          T.ok(T.same(T.cs(T.q('#robotica h2')).color, 'rgb(31, 61, 80)'), 'Os títulos não mudaram de cor. A propriedade está bem escrita?'),
          T.ok(parseFloat(T.cs(T.q('#robotica')).paddingTop) === 16, 'O espaço interior não se aplica. O valor está completo?')
        ];
      },
      sol: { code: { css: '.paineis .painel{background-color:#d5e7df}.painel.destaque{background-color:#fff4d6}.painel h2{color:#1f3d50}.painel{padding:16px;border:2px solid #1f3d50}' } },
      explain: 'Que erro te deu mais trabalho? Como descobriste porque é que o destaque não ficava amarelo?'
    }
  ]
};

/* ---------------------------------------------------------
   M3 · Sala E3 · Flexbox
   --------------------------------------------------------- */
const M3 = {
  id: 'm3', n: 3, sala: 'Sala E3', title: 'Arrumar as bancadas', learn: 'Flexbox: display, justify-content, align-items, gap e flex-wrap',
  levels: [
    {
      id: 'm3l1', kind: 'explorar', editable: ['css'], title: 'O menu empilhado',
      sit: 'O logótipo e as ligações do menu do portal aparecem empilhados. Na sala, as caixas da bancada estão à mesma desordem.',
      obj: 'Coloca o logótipo à esquerda, as ligações à direita e todos os elementos centrados na vertical. Vê as caixas da bancada a acompanhar.',
      base: { html: M3_HTML, css: M3_CSS + '\n.ligacoes{display:flex;gap:8px}' },
      req: ['O logótipo e as ligações estão na mesma linha', 'Logótipo à esquerda, ligações à direita', 'Tudo centrado na vertical'],
      controls: [
        { id: 'd', label: 'display', type: 'select', options: ['block', 'flex'], value: 'block' },
        { id: 'j', label: 'justify-content', type: 'select', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'], value: 'flex-start' },
        { id: 'a', label: 'align-items', type: 'select', options: ['stretch', 'flex-start', 'center', 'flex-end'], value: 'stretch' }
      ],
      template: v => `.menu {
  display: ${v.d};
  justify-content: ${v.j};
  align-items: ${v.a};
}`,
      hints: [
        'Com `display: flex`, um elemento passa a ser um contentor flexível e coloca os filhos lado a lado, ao longo de um eixo principal (horizontal).',
        '`justify-content` distribui o espaço no eixo principal (horizontal). `align-items` alinha os filhos no eixo transversal (vertical).',
        { t: 'Num rodapé, ficaria assim:', code: '.rodape {\n  display: flex;\n  justify-content: space-around;\n  align-items: flex-end;\n}' }
      ],
      check: function (T) {
        var s = T.menu();
        return [
          T.ok(s.inRow, 'O logótipo e as ligações ainda estão empilhados. O contentor .menu precisa de colocar os filhos em linha.'),
          T.ok(s.inRow && s.left && s.right, 'Os elementos já estão em linha. Falta distribuir o espaço entre o logótipo e o grupo de ligações.'),
          T.ok(s.inRow && s.cy, 'O logótipo e as ligações não estão centrados na vertical. Experimenta outro valor de align-items.')
        ];
      },
      sol: { vals: { d: 'flex', j: 'space-between', a: 'center' } },
      explain: 'O que faz justify-content e o que faz align-items? Em que eixo trabalha cada um?'
    },
    {
      id: 'm3l2', kind: 'completar', editable: ['css'], title: 'Dois contentores',
      sit: 'Agora até as ligações aparecem umas por baixo das outras.',
      obj: 'Completa as regras dos dois contentores flexíveis: .menu e .ligacoes.',
      base: { html: M3_HTML, css: M3_CSS },
      req: ['Logótipo e ligações na mesma linha, nos extremos', 'Tudo centrado na vertical', 'As ligações ficam lado a lado', 'Há pelo menos 8px entre ligações'],
      code: `.menu {
  display: {{d}};
  justify-content: {{j}};
  align-items: {{a}};
}

.ligacoes {
  display: {{d2}};
  gap: {{g}};
}`,
      blanks: { d: 5, j: 13, a: 7, d2: 5, g: 5 },
      hints: [
        'O menu tem dois contentores flexíveis: `.menu` (logótipo e grupo de ligações) e `.ligacoes` (as quatro ligações). Cada um organiza os seus filhos.',
        'Para afastar os extremos usa `space-between`; para centrar na vertical, `center`. O `gap` precisa de unidade, por exemplo `12px`.',
        { t: 'Numa barra de ferramentas, ficaria assim:', code: '.barra {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-end;\n}\n.icones {\n  display: flex;\n  gap: 4px;\n}' }
      ],
      check: function (T) {
        var s = T.menu();
        return [
          T.ok(s.inRow && s.left && s.right, s.inRow ? 'Os elementos já estão em linha. Falta distribuir o espaço entre o logótipo e o grupo de ligações.' : 'O logótipo e as ligações ainda estão empilhados. Revê o display do .menu.'),
          T.ok(s.inRow && s.cy, 'O logótipo e as ligações não estão centrados na vertical.'),
          T.ok(s.linksRow, 'As ligações continuam umas por baixo das outras. O contentor .ligacoes também precisa de ser flexível.'),
          T.ok(s.linksRow && s.gap >= 8, 'As ligações estão coladas. O gap precisa de um número e de uma unidade, por exemplo 12px.')
        ];
      },
      sol: { blanks: { d: 'flex', j: 'space-between', a: 'center', d2: 'flex', g: '12px' } },
      explain: 'Porque é que o menu precisa de dois contentores flexíveis?'
    },
    {
      id: 'm3l3', kind: 'construir', editable: ['css'], title: 'Menu no telemóvel',
      sit: 'Muitos alunos abrem o portal do CTE no telemóvel e o menu sai do ecrã.',
      obj: 'Escreve as regras do menu de raiz e adapta-o a ecrãs estreitos. Usa o botão Telemóvel, por cima do resultado.',
      base: { html: M3_HTML, css: M3_CSS },
      starter: { css: `/* Escreve as regras do menu. */
.menu {

}

.ligacoes {

}

/* Num ecrã estreito, o menu tem de caber sem sair para o lado.
   Podes usar flex-wrap e/ou uma regra @media. */
@media (max-width: 480px) {

}
` },
      widths: [900, 360],
      req: ['Ecrã largo: logótipo à esquerda, ligações à direita', 'Ecrã largo: tudo centrado na vertical', 'As ligações ficam lado a lado', 'Telemóvel (360px): nada sai do ecrã'],
      hints: [
        'Num ecrã estreito não há espaço para tudo numa linha. `flex-wrap: wrap` deixa os elementos passarem para a linha seguinte. Uma regra `@media (max-width: 480px) { … }` só se aplica a ecrãs estreitos.',
        'Reutiliza o que fizeste no nível 2 e acrescenta `flex-wrap: wrap` ao `.menu` e às `.ligacoes`. Dentro do `@media` podes usar `flex-direction: column` no `.menu`.',
        { t: 'Numa galeria de fotografias, ficaria assim:', code: '.galeria {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n@media (max-width: 480px) {\n  .galeria { flex-direction: column; }\n}' }
      ],
      check: function (T) {
        var s = T.menu(), wide = window.innerWidth > 600;
        return [
          T.ok(!wide || (s.inRow && s.left && s.right), 'No ecrã largo, o logótipo deve ficar à esquerda e as ligações à direita, na mesma linha.'),
          T.ok(!wide || (s.inRow && s.cy), 'No ecrã largo, o logótipo e as ligações não estão centrados na vertical.'),
          T.ok(s.linksRow, wide ? 'As ligações não estão lado a lado no ecrã largo.' : 'No telemóvel, as ligações ficaram umas por baixo das outras. Deixa-as lado a lado e a mudar de linha quando for preciso.'),
          T.ok(wide || s.fits, 'No telemóvel, o menu sai do ecrã. Experimenta flex-wrap: wrap.')
        ];
      },
      sol: { code: { css: '.menu{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}.ligacoes{display:flex;gap:8px;flex-wrap:wrap}' } },
      explain: 'O que muda no menu quando o ecrã fica estreito? Que propriedade resolveu o problema?'
    },
    {
      id: 'm3l4', kind: 'desafio', editable: ['css'], title: 'Cartões dos workshops',
      sit: 'Os cartões dos workshops da Sala E3 estão empilhados, e os botões «Inscrever» ficam desalinhados porque os textos têm tamanhos diferentes.',
      obj: 'Coloca os três cartões lado a lado, com a mesma altura, e o botão de cada cartão sempre no fundo.',
      base: { html: M3_CARDS_HTML, css: M3_CARDS_CSS },
      starter: { css: `/* Os cartões ficam lado a lado, com a mesma altura,
   e o botão de cada cartão fica sempre no fundo. */
.cartoes {

}

.cartao {

}
` },
      widths: [900],
      req: ['Os cartões estão lado a lado', 'Há pelo menos 12px entre cartões', 'Os cartões têm a mesma altura', 'O botão fica no fundo de cada cartão'],
      hints: [
        'Num contentor flexível, os filhos ficam com a mesma altura. Se o próprio cartão também for flexível, em coluna (`flex-direction: column`), uma margem automática no botão (`margin-top: auto`) ocupa o espaço livre e empurra-o para o fundo.'
      ],
      check: function (T) {
        var cs = T.qa('.cartao'), bs = T.qa('.cartao button');
        var row = cs.length === 3 && cs.every(function (c) { return Math.abs(T.r(c).top - T.r(cs[0]).top) < 2; }) && T.r(cs[1]).left > T.r(cs[0]).right - 1;
        var gap = cs.length > 1 ? T.r(cs[1]).left - T.r(cs[0]).right : 0;
        var eqH = row && cs.every(function (c) { return Math.abs(T.r(c).height - T.r(cs[0]).height) < 2; });
        var bottom = eqH && cs.every(function (c, i) { var s = T.cs(c); return T.r(c).bottom - T.r(bs[i]).bottom <= parseFloat(s.paddingBottom) + parseFloat(s.borderBottomWidth) + 2; });
        return [
          T.ok(row, 'Os cartões continuam empilhados.'),
          T.ok(row && gap >= 12, 'Os cartões estão colados. Falta espaço entre eles.'),
          T.ok(eqH, 'Os cartões não têm todos a mesma altura.'),
          T.ok(bottom, 'Os botões não estão todos no fundo dos cartões. O espaço livre de cada cartão tem de ficar por cima do botão.')
        ];
      },
      sol: { code: { css: '.cartoes{display:flex;gap:16px}.cartao{display:flex;flex-direction:column;flex:1}.cartao button{margin-top:auto}' } },
      explain: 'Porque é que o botão foi para o fundo do cartão? O que faz margin-top: auto num contentor flexível?'
    }
  ]
};

/* ---------------------------------------------------------
   M4 · Sala E4 · Grid
   --------------------------------------------------------- */
const M4 = {
  id: 'm4', n: 4, sala: 'Sala E4', title: 'Montar o mural', learn: 'Grid: colunas, fr, gap, grid-column, repeat, auto-fit e minmax',
  levels: [
    {
      id: 'm4l1', kind: 'explorar', editable: ['css'], title: 'Cartões empilhados',
      sit: 'Os cartões do mural do CTE estão empilhados, colados uns aos outros. O mural da parede está igual.',
      obj: 'Organiza o mural numa grelha de 3 colunas iguais que ocupe toda a largura, com espaço entre cartões.',
      base: { html: M4_HTML, css: M4_CSS },
      req: ['O mural é uma grelha', 'Três colunas por linha', 'Colunas iguais que ocupam a largura toda', 'Pelo menos 16px entre cartões'],
      controls: [
        { id: 'd', label: 'display', type: 'select', options: ['block', 'grid'], value: 'block' },
        { id: 'c', label: 'grid-template-columns', type: 'select', options: ['1fr', '1fr 1fr', '200px 200px 200px', '1fr 2fr 1fr', 'repeat(3, 1fr)'], value: '1fr' },
        { id: 'g', label: 'gap', type: 'range', min: 0, max: 40, step: 4, value: 0, unit: 'px' }
      ],
      template: v => `.mural {
  display: ${v.d};
  grid-template-columns: ${v.c};
  gap: ${v.g}px;
}`,
      hints: [
        '`display: grid` transforma o contentor numa grelha. `grid-template-columns` diz quantas colunas existem e qual a largura de cada uma.',
        'A unidade `fr` reparte o espaço livre: `1fr 1fr` são duas colunas iguais. `repeat(3, 1fr)` é o mesmo que `1fr 1fr 1fr`. O `gap` afasta os cartões.',
        { t: 'Numa galeria de duas colunas, ficaria assim:', code: '.galeria {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 24px;\n}' }
      ],
      check: function (T) {
        var g = T.mural();
        return [
          T.ok(g.isGrid, 'Os cartões continuam empilhados. O contentor .mural ainda não é uma grelha.'),
          T.ok(g.isGrid && g.cols === 3, 'A grelha tem de ter 3 colunas. Olha para o valor de grid-template-columns.'),
          T.ok(g.cols === 3 && g.equal && g.fills, 'As colunas têm de ter a mesma largura e ocupar o mural todo. A unidade fr divide o espaço disponível.'),
          T.ok(g.isGrid && g.gap >= 16, 'Os cartões estão demasiado juntos. Aumenta o gap para pelo menos 16px.')
        ];
      },
      sol: { vals: { d: 'grid', c: 'repeat(3, 1fr)', g: '16' } },
      explain: 'Porque é que 200px 200px 200px não ocupa o mural todo, e repeat(3, 1fr) ocupa?'
    },
    {
      id: 'm4l2', kind: 'completar', editable: ['css'], title: 'O cartão em destaque',
      sit: 'O Dia Aberto do CTE é o evento do mês e merece mais espaço no mural.',
      obj: 'Completa a grelha de 3 colunas e faz o cartão em destaque ocupar 2 colunas.',
      base: { html: M4_HTML, css: M4_CSS },
      req: ['O mural é uma grelha', 'Três colunas iguais', 'Pelo menos 12px entre cartões', 'O cartão em destaque ocupa 2 colunas'],
      code: `.mural {
  display: {{d}};
  grid-template-columns: repeat({{n}}, 1fr);
  gap: {{g}};
}

.destaque {
  grid-column: span {{s}};
}`,
      blanks: { d: 5, n: 2, g: 5, s: 2 },
      hints: [
        'Os filhos de uma grelha podem ocupar mais do que uma coluna. `grid-column: span 2` estica um elemento por duas colunas.',
        'O mural tem 3 colunas. O destaque deve ocupar `span 2`. O gap precisa de unidade, por exemplo `16px`.',
        { t: 'Numa grelha de fotografias, ficaria assim:', code: '.fotos {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 8px;\n}\n.foto-grande {\n  grid-column: span 3;\n}' }
      ],
      check: function (T) {
        var g = T.mural();
        return [
          T.ok(g.isGrid, 'O contentor .mural ainda não é uma grelha.'),
          T.ok(g.isGrid && g.cols === 3 && g.equal, 'A grelha precisa de 3 colunas iguais. Quantas vezes se repete 1fr?'),
          T.ok(g.isGrid && g.gap >= 12, 'Os cartões estão demasiado juntos. O gap precisa de número e unidade, por exemplo 16px.'),
          T.ok(g.cols === 3 && Math.abs(g.dw - (2 * g.cw + g.gap)) < 3, 'O cartão em destaque tem de ocupar exatamente 2 colunas.')
        ];
      },
      sol: { blanks: { d: 'grid', n: '3', g: '16px', s: '2' } },
      explain: 'Como é que a grelha decide onde colocar o cartão em destaque e os cartões seguintes?'
    },
    {
      id: 'm4l3', kind: 'construir', editable: ['css'], title: 'Mural para todos os ecrãs',
      sit: 'O mural aparece no quadro interativo da sala e no telemóvel dos alunos.',
      obj: 'Cria uma grelha que decide sozinha quantas colunas cabem. O cartão em destaque ocupa sempre a linha toda. Testa com o botão Telemóvel.',
      base: { html: M4_HTML, css: M4_CSS },
      starter: { css: `/* O mural tem de se adaptar ao espaço disponível,
   sem dizeres um número fixo de colunas. */
.mural {

}

.destaque {

}
` },
      widths: [900, 360],
      req: ['É uma grelha com pelo menos 12px entre cartões', 'Ecrã largo (900px): pelo menos 3 cartões por linha', 'Telemóvel (360px): um cartão por linha', 'O cartão em destaque ocupa a linha toda', 'Nada sai do ecrã'],
      hints: [
        'Uma grelha pode decidir sozinha quantas colunas cabem. `repeat(auto-fit, minmax(200px, 1fr))` cria tantas colunas de pelo menos 200px quantas couberem.',
        'Para o destaque ocupar a linha toda, seja qual for o número de colunas, usa as linhas da grelha: `grid-column: 1 / -1` vai da primeira à última linha.',
        { t: 'Numa montra de produtos, ficaria assim:', code: '.produtos {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 12px;\n}\n.aviso {\n  grid-column: 1 / -1;\n}' }
      ],
      check: function (T) {
        var g = T.mural(), wide = window.innerWidth > 600;
        return [
          T.ok(g.isGrid && g.gap >= 12 && g.rowGap >= 12, 'O mural tem de ser uma grelha com espaço (gap) de pelo menos 12px.'),
          T.ok(!wide || g.cols >= 3, 'No ecrã largo cabem pelo menos 3 cartões por linha. A grelha ainda não aproveita o espaço.'),
          T.ok(wide || g.cols === 1, 'No telemóvel, cada cartão deve ocupar uma linha. Usa colunas com largura mínima (minmax).'),
          T.ok(g.full, wide ? 'No ecrã largo, o cartão em destaque não ocupa a linha toda.' : 'No telemóvel, o cartão em destaque não ocupa a largura toda.'),
          T.ok(!T.overflow(), 'Há conteúdo a sair do ecrã. Confirma que o destaque não cria colunas a mais.')
        ];
      },
      sol: { code: { css: '.mural{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}.destaque{grid-column:1 / -1}' } },
      explain: 'Como é que a tua grelha decide o número de colunas? O que faz 1 / -1?'
    },
    {
      id: 'm4l4', kind: 'desafio', editable: ['css'], title: 'O horário da sala',
      sit: 'O horário semanal da Sala E4 aparece numa coluna só. A aula de Projeto dura dois tempos seguidos.',
      obj: 'Organiza o horário numa grelha de 5 colunas (uma por dia) e faz a aula de Projeto ocupar duas linhas.',
      base: { html: M4_HOR_HTML, css: M4_HOR_CSS },
      starter: { css: `/* Uma coluna por dia (segunda a sexta).
   A aula de Projeto (.dupla) ocupa dois tempos seguidos. */
.horario {

}

.dupla {

}
` },
      widths: [900],
      req: ['5 colunas iguais, uma por dia', 'Os dias ficam todos na primeira linha', 'Há pelo menos 6px entre células', 'O Projeto ocupa dois tempos (duas linhas)'],
      hints: [
        'Uma grelha também tem linhas. Tal como `grid-column: span 2` estica um elemento por duas colunas, `grid-row: span 2` estica-o por duas linhas.'
      ],
      check: function (T) {
        var h = T.q('.horario'), st = T.cs(h), dias = T.qa('.dia'), aulas = T.qa('.aula'), d = T.q('.dupla');
        var lefts = {}; dias.forEach(function (x) { lefts[Math.round(T.r(x).left)] = 1; });
        var ws = dias.map(function (x) { return T.r(x).width; });
        var five = Object.keys(lefts).length === 5 && Math.max.apply(null, ws) - Math.min.apply(null, ws) < 2;
        var top = dias.every(function (x) { return Math.abs(T.r(x).top - T.r(dias[0]).top) < 2; });
        var cg = parseFloat(st.columnGap) || 0, rg = parseFloat(st.rowGap) || 0;
        var dupla = five && Math.abs(T.r(d).top - T.r(aulas[0]).top) < 2 && Math.abs(T.r(d).bottom - T.r(aulas[5]).bottom) < 2;
        return [
          T.ok(/grid/.test(st.display) && five, 'O horário precisa de 5 colunas iguais, uma por dia.'),
          T.ok(five && top, 'Os cinco dias têm de ficar na primeira linha.'),
          T.ok(/grid/.test(st.display) && cg >= 6 && rg >= 6, 'As células estão coladas. Falta espaço entre elas.'),
          T.ok(dupla, 'A aula de Projeto ainda ocupa um só tempo.')
        ];
      },
      sol: { code: { css: '.horario{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.dupla{grid-row:span 2}' } },
      explain: 'Como é que as outras aulas se reorganizaram quando o Projeto passou a ocupar duas linhas?'
    }
  ]
};

/* ---------------------------------------------------------
   M5 · Sala E5 · JavaScript e DOM
   --------------------------------------------------------- */
const M5 = {
  id: 'm5', n: 5, sala: 'Sala E5', title: 'Acender as luzes', learn: 'JavaScript: variáveis, operações, eventos e DOM',
  levels: [
    {
      id: 'm5l1', kind: 'explorar', editable: ['js'], title: 'Quanto gasta a sala?',
      sit: 'Antes de ligar a energia, a escola quer saber quanto gasta a Sala E5 num dia de aulas.',
      obj: 'Calcula o consumo de 24 computadores ligados durante 5 horas e mostra-o com duas casas decimais. O valor aparece no ecrã da sala.',
      base: { html: `<h1>Consumo da Sala E5</h1>
<p>Cada computador gasta 0,12 kWh por hora.</p>
<p id="total">Consumo: —</p>`, css: M5_CSS },
      req: ['O cálculo dá o consumo de 24 computadores em 5 horas', 'O consumo aparece com duas casas decimais'],
      controls: [
        { id: 'c', label: 'computadores', type: 'range', min: 1, max: 30, step: 1, value: 1, unit: '' },
        { id: 'h', label: 'horas', type: 'range', min: 1, max: 8, step: 1, value: 1, unit: '' },
        { id: 'op', label: 'operação', type: 'select', options: ['+', '*'], value: '+' },
        { id: 'f', label: 'como mostrar', type: 'select', options: ['total', 'Math.round(total)', 'total.toFixed(2)'], value: 'total' }
      ],
      template: v => `// Quanto gastam 24 computadores ligados durante 5 horas?
const consumoPorHora = 0.12;  // kWh de um computador
const computadores = ${v.c};
const horas = ${v.h};
const total = consumoPorHora ${v.op} computadores ${v.op} horas;

document.querySelector('#total').textContent =
  'Consumo: ' + ${v.f} + ' kWh';`,
      hints: [
        'Uma variável guarda um valor com um nome: `const horas = 5`. Com os operadores `+ - * /` fazes contas com essas variáveis.',
        'O consumo total é consumo × computadores × horas, por isso a operação é `*`. As contas com casas decimais nem sempre são exatas (0.12 × 24 × 5 dá 14.399999…), por isso usa `toFixed(2)`.',
        { t: 'Para o custo de bilhetes, ficaria assim:', code: 'const preco = 2.5;\nconst pessoas = 3;\nconst custo = preco * pessoas;\nconsole.log(custo.toFixed(2)); // "7.50"' }
      ],
      check: function (T) {
        var t = T.text(T.q('#total')), n = T.num(t);
        var fix = 'O valor ainda não é o consumo de 24 computadores durante 5 horas. Confirma os números e a operação.';
        if (Math.abs(n - 29.12) < 0.001) fix = 'Estás a somar. Que operação dá o total quando muitas máquinas gastam o mesmo durante várias horas?';
        if (n === 14) fix = 'O valor foi arredondado para um número inteiro e perdeu as casas decimais.';
        return [
          T.ok(Math.abs(n - 14.4) < 0.001, fix),
          T.ok(/14[.,]40\s*kWh/.test(t), Math.abs(n - 14.4) < 0.001 ? 'O valor está certo, mas aparece com casas decimais a mais (14.399999…). Mostra-o com duas casas.' : 'Quando o cálculo estiver certo, mostra o consumo com duas casas decimais.')
        ];
      },
      sol: { vals: { c: '24', h: '5', op: '*', f: 'total.toFixed(2)' } },
      explain: 'Porque é que o resultado aparece como 14.399999 sem toFixed(2)?'
    },
    {
      id: 'm5l2', kind: 'completar', editable: ['js'], title: 'O interruptor da zona A',
      sit: 'O botão da zona A da Sala E5 não faz nada.',
      obj: 'Completa o código para que o botão ligue e desligue a zona A, mostre o estado e acenda a luz verdadeira da sala (com `cte.luz`).',
      base: { html: `<h1>Iluminação da Sala E5</h1>
<div class="zona" id="zona-a">Zona A</div>
<button id="luz-a">Ligar ou desligar a zona A</button>
<p>Estado: <span id="estado-a">Desligada</span></p>`, css: M5_CSS },
      req: ['O botão responde ao clique', 'A zona acende e apaga (classe `acesa`)', 'O estado mostra «Ligada» e «Desligada»'],
      code: `const botao = document.querySelector('{{s}}');
const estado = document.querySelector('#estado-a');

botao.addEventListener('{{ev}}', function () {
  const zona = document.querySelector('#zona-a');
  zona.classList.{{m}}('acesa');
  const acesa = zona.classList.contains('acesa');
  estado.{{p}} = acesa ? 'Ligada' : 'Desligada';
  cte.luz('a', acesa);
});`,
      blanks: { s: 7, ev: 5, m: 6, p: 11 },
      hints: [
        'Um evento é algo que acontece na página (um clique, uma tecla). `addEventListener` diz que função corre quando esse evento acontece. `classList` junta ou tira classes de um elemento.',
        'O seletor do botão é `#luz-a` e o evento de clique chama-se `click`. `classList.toggle` junta a classe se não existir e tira-a se existir. O texto de um elemento muda-se com `textContent`.',
        { t: 'Num botão de modo escuro, ficaria assim:', code: "const b = document.querySelector('#tema');\nb.addEventListener('click', function () {\n  document.body.classList.toggle('escuro');\n  b.textContent = 'Tema trocado';\n});" }
      ],
      check: async function (T) {
        var b = T.q('#luz-a'), z = T.q('#zona-a'), e = T.q('#estado-a');
        if (!b) return [T.ok(false, 'O botão #luz-a desapareceu.'), T.ok(false, ''), T.ok(false, '')];
        b.click(); await T.wait(30);
        var on1 = z.classList.contains('acesa'), t1 = T.text(e);
        b.click(); await T.wait(30);
        var on2 = z.classList.contains('acesa'), t2 = T.text(e);
        return [
          T.ok(on1 || t1 !== 'Desligada', 'Quando se clica no botão, nada acontece. Confirma o seletor do botão e o nome do evento.'),
          T.ok(on1 && !on2, 'A zona não acende e apaga. Que método de classList junta a classe e, no clique seguinte, a tira?'),
          T.ok(t1 === 'Ligada' && t2 === 'Desligada', 'O texto do estado não muda. Que propriedade guarda o texto de um elemento?')
        ];
      },
      sol: { blanks: { s: '#luz-a', ev: 'click', m: 'toggle', p: 'textContent' } },
      explain: 'O que acontece, passo a passo, quando se clica no botão?'
    },
    {
      id: 'm5l3', kind: 'construir', editable: ['js'], title: 'Painel de luzes',
      sit: 'A Sala E5 tem três zonas de luz. O painel tem três botões, mas nenhum código.',
      obj: 'Cada botão liga e desliga a sua zona, avisa a sala com `cte.luz(\'a\', true)` e atualiza o contador de zonas ligadas.',
      base: { html: `<h1>Painel de luzes</h1>
<div class="zonas">
  <div class="zona" id="zona-a">Zona A</div>
  <div class="zona" id="zona-b">Zona B</div>
  <div class="zona" id="zona-c">Zona C</div>
</div>
<div class="botoes">
  <button id="luz-a">Zona A</button>
  <button id="luz-b">Zona B</button>
  <button id="luz-c">Zona C</button>
</div>
<p id="contador">Zonas ligadas: 0</p>`, css: M5_CSS },
      starter: { js: `// Cada botão (#luz-a, #luz-b, #luz-c) liga e desliga a sua zona
// (#zona-a, #zona-b, #zona-c) com a classe "acesa".
// Depois avisa a sala: cte.luz('a', true) ou cte.luz('a', false)
// e atualiza o #contador: "Zonas ligadas: 2"

` },
      req: ['Cada botão acende a sua zona', 'Carregar outra vez apaga a zona', 'O contador mostra quantas zonas estão ligadas', 'A sala recebe o aviso (`cte.luz`)'],
      hints: [
        'Podes repetir o código do nível 2 para cada botão, ou criar uma função que recebe a letra da zona. `document.querySelectorAll(\'.zona.acesa\').length` conta as zonas ligadas.',
        'Para cada letra: `addEventListener(\'click\', …)`, `classList.toggle(\'acesa\')`, `cte.luz(letra, acesa)` e, no fim, atualiza o texto do `#contador` com a contagem.',
        { t: 'Uma função reutilizável, noutro contexto:', code: "function ligarAlarme(letra) {\n  const el = document.querySelector('#alarme-' + letra);\n  el.classList.toggle('ativo');\n}\ndocument.querySelector('#botao-1')\n  .addEventListener('click', function () { ligarAlarme('1'); });" }
      ],
      check: async function (T) {
        var za = T.q('#zona-a'), zb = T.q('#zona-b'), zc = T.q('#zona-c'), c = T.q('#contador');
        function on(z) { return z.classList.contains('acesa'); }
        T.q('#luz-a').click(); await T.wait(20); var n1 = T.num(T.text(c));
        T.q('#luz-b').click(); await T.wait(20);
        T.q('#luz-c').click(); await T.wait(20); var all = on(za) && on(zb) && on(zc); var n3 = T.num(T.text(c));
        T.q('#luz-b').click(); await T.wait(20); var off = on(za) && !on(zb) && on(zc); var n2 = T.num(T.text(c));
        var calls = window.__cteCalls || [];
        var luz = ['a', 'b', 'c'].every(function (l) { return calls.some(function (x) { return x.f === 'luz' && x.id === l && x.on === true; }); }) && calls.some(function (x) { return x.f === 'luz' && x.id === 'b' && x.on === false; });
        return [
          T.ok(all, 'Nem todos os botões acendem a sua zona.'),
          T.ok(all && off, 'Carregar outra vez no botão B não apagou a zona B.'),
          T.ok(n1 === 1 && n3 === 3 && n2 === 2, 'O contador não mostra o número certo de zonas ligadas.'),
          T.ok(luz, 'A sala não recebe os avisos. Chama cte.luz(letra, acesa) depois de mudar a zona.')
        ];
      },
      sol: { code: { js: "function trocar(l){const z=document.querySelector('#zona-'+l);z.classList.toggle('acesa');cte.luz(l,z.classList.contains('acesa'));document.querySelector('#contador').textContent='Zonas ligadas: '+document.querySelectorAll('.zona.acesa').length;}\n['a','b','c'].forEach(function(l){document.querySelector('#luz-'+l).addEventListener('click',function(){trocar(l);});});" } },
      explain: 'Como evitaste escrever o mesmo código três vezes? Se não evitaste, como o farias?'
    },
    {
      id: 'm5l4', kind: 'desafio', editable: ['js'], title: 'Lugares livres',
      sit: 'A Sala E5 tem 24 lugares. A porta mostra quantos estão livres, mas o contador está parado.',
      obj: 'Sempre que o número de alunos presentes muda, mostra os lugares livres e ajusta a barra de ocupação (em percentagem).',
      base: { html: `<h1>Lugares na Sala E5</h1>
<label for="presentes">Alunos presentes</label>
<input id="presentes" type="number" min="0" max="24" value="0">
<p id="livres">Lugares livres: 24</p>
<div class="barra"><div id="ocupacao"></div></div>`, css: M5_CSS },
      starter: { js: `// A sala tem 24 lugares.
// Quando o valor de #presentes muda, atualiza #livres
// ("Lugares livres: 14") e a largura de #ocupacao (em %).

` },
      req: ['Com 10 alunos, aparecem 14 lugares livres', 'Com 24 alunos, aparecem 0 lugares livres', 'A barra mostra a ocupação em percentagem'],
      hints: [
        'O evento `input` acontece sempre que o valor de um campo muda. O valor chega como texto: converte-o com `Number()`. A largura de um elemento muda-se com `elemento.style.width = valor + \'%\'`.'
      ],
      check: async function (T) {
        var p = T.q('#presentes'), l = T.q('#livres'), o = T.q('#ocupacao'), barra = T.q('.barra');
        function pct() { return T.r(o).width / T.r(barra).width; }
        T.change(p, '10'); await T.wait(30); var a = T.num(T.text(l)), pa = pct();
        T.change(p, '24'); await T.wait(30); var b = T.num(T.text(l)), pb = pct();
        T.change(p, '6'); await T.wait(30); var pc = pct();
        return [
          T.ok(a === 14, 'Ao escrever 10, devia aparecer «Lugares livres: 14». O campo precisa de um evento que reaja à mudança.'),
          T.ok(b === 0, 'Com 24 alunos, os lugares livres deviam ser 0.'),
          T.ok(Math.abs(pa - 10 / 24) < 0.02 && Math.abs(pb - 1) < 0.02 && Math.abs(pc - 0.25) < 0.02, 'A barra não acompanha a ocupação. A largura é presentes ÷ 24 × 100, em %.')
        ];
      },
      sol: { code: { js: "const p=document.querySelector('#presentes');p.addEventListener('input',function(){const n=Number(p.value);document.querySelector('#livres').textContent='Lugares livres: '+(24-n);document.querySelector('#ocupacao').style.width=(n/24*100)+'%';});" } },
      explain: 'Que evento usaste e porquê? Como calculaste a percentagem?'
    }
  ]
};

/* ---------------------------------------------------------
   M6 · Sala E6 · Formulários
   --------------------------------------------------------- */
const M6 = {
  id: 'm6', n: 6, sala: 'Sala E6', title: 'Abrir as inscrições', learn: 'Formulários, condições, evento submit e mensagens de feedback',
  levels: [
    {
      id: 'm6l1', kind: 'explorar', editable: ['js'], title: 'Nomes de uma letra',
      sit: 'O terminal de inscrições da Sala E6 aceita nomes com uma só letra.',
      obj: 'Ajusta a condição para aceitar apenas nomes com pelo menos 3 letras. A tabela do resultado mostra os testes.',
      base: { html: `<h1>Verificar nomes</h1>
<p>A função validarNome é testada com estes nomes:</p>
<table id="testes">
  <thead><tr><th>Nome</th><th>Resultado</th><th>Esperado</th></tr></thead>
  <tbody></tbody>
</table>`, css: M6_CSS },
      after: `(function(){
  var casos=[['Ana','válido'],['Rui','válido'],['Maria Silva','válido'],['Al','inválido'],['','inválido'],['  Jo  ','inválido']];
  var tb=document.querySelector('#testes tbody');
  casos.forEach(function(c){
    var r; try { r = validarNome(c[0]); } catch(e) { r = 'erro'; }
    var tr=document.createElement('tr'); tr.className = r===c[1] ? 'ok' : 'falha';
    tr.innerHTML='<td>«'+c[0]+'»</td><td>'+r+'</td><td>'+c[1]+'</td>';
    tb.appendChild(tr);
  });
})();`,
      req: ['Nomes com 3 ou mais letras são válidos', 'Nomes mais curtos são inválidos'],
      controls: [
        { id: 'op', label: 'comparação', type: 'select', options: ['<', '>', '>=', '==='], value: '<' },
        { id: 'n', label: 'número de letras', type: 'range', min: 0, max: 6, step: 1, value: 1, unit: '' }
      ],
      template: v => `function validarNome(nome) {
  if (nome.trim().length ${v.op} ${v.n}) {
    return 'válido';
  } else {
    return 'inválido';
  }
}`,
      hints: [
        'Uma condição (`if`) escolhe entre dois caminhos. A comparação dá verdadeiro ou falso: `>`, `>=`, `<`, `===`.',
        '`trim()` tira os espaços das pontas e `length` conta os caracteres. «Pelo menos 3» escreve-se `>= 3` (ou `> 2`).',
        { t: 'Para verificar a idade de voto, ficaria assim:', code: "function podeVotar(idade) {\n  if (idade >= 18) {\n    return 'sim';\n  } else {\n    return 'não';\n  }\n}" }
      ],
      check: function (T) {
        var rows = T.qa('#testes tbody tr');
        var ok = function (i) { return rows[i] && rows[i].className === 'ok'; };
        return [
          T.ok(rows.length === 6 && ok(0) && ok(1) && ok(2), 'Há nomes com 3 ou mais letras a serem recusados. Olha para as linhas vermelhas da tabela.'),
          T.ok(rows.length === 6 && ok(3) && ok(4) && ok(5), 'Há nomes demasiado curtos a serem aceites. Olha para as linhas vermelhas da tabela.')
        ];
      },
      sol: { vals: { op: '>=', n: '3' } },
      explain: 'Que comparação escolheste? Porque é que «  Jo  » é inválido?'
    },
    {
      id: 'm6l2', kind: 'completar', editable: ['js'], title: 'Enviar sem recarregar',
      sit: 'O formulário de inscrição recarrega a página e aceita emails sem @.',
      obj: 'Completa o código que trata o envio do formulário e mostra mensagens de erro ou de sucesso.',
      base: { html: M6_FORM, css: M6_CSS },
      req: ['Aparece uma mensagem ao submeter', 'A página não recarrega (`preventDefault`)', 'Um email sem @ é recusado', 'Uma inscrição válida mostra sucesso'],
      code: `const form = document.querySelector('#inscricao');
const mensagem = document.querySelector('#mensagem');

form.addEventListener('{{ev}}', function (evento) {
  evento.{{pd}}();
  const nome = document.querySelector('#nome').value.trim();
  const email = document.querySelector('#email').value.trim();

  if (nome.length < 3) {
    mensagem.textContent = 'Escreve o teu nome completo.';
    mensagem.className = 'erro';
  } else if ({{cond}}) {
    mensagem.textContent = 'O email tem de ter @.';
    mensagem.className = 'erro';
  } else {
    mensagem.textContent = 'Inscrição recebida, ' + nome + '!';
    mensagem.className = '{{cls}}';
  }
});`,
      blanks: { ev: 6, pd: 14, cond: 22, cls: 7 },
      hints: [
        'Quando se envia um formulário acontece o evento `submit`. Por defeito, o navegador recarrega a página; `evento.preventDefault()` impede isso.',
        "O evento é `submit` e o método é `preventDefault`. Para saber se falta o @ usa `!email.includes('@')` (o `!` quer dizer «não»). A classe de sucesso chama-se `sucesso`.",
        { t: 'Num formulário de código postal, ficaria assim:', code: "form.addEventListener('submit', function (evento) {\n  evento.preventDefault();\n  if (!codigo.includes('-')) {\n    aviso.textContent = 'Falta o hífen.';\n    aviso.className = 'erro';\n  }\n});" }
      ],
      check: async function (T) {
        var f = T.q('#inscricao'), msg = T.q('#mensagem'), nome = T.q('#nome'), email = T.q('#email');
        nome.value = ''; email.value = '';
        var prevented = T.submit(f); await T.wait(20);
        var m1 = T.text(msg);
        nome.value = 'Beatriz Lopes'; email.value = 'beatriz.escola.pt';
        T.submit(f); await T.wait(20);
        var c2 = msg.className;
        email.value = 'beatriz@escola.pt';
        T.submit(f); await T.wait(20);
        var m3 = T.text(msg), c3 = msg.className;
        return [
          T.ok(m1.length > 0, 'Ao submeter o formulário não aparece nenhuma mensagem. Que evento acontece quando se envia um formulário?'),
          T.ok(prevented, 'O formulário recarrega a página e a mensagem perde-se. Falta impedir o comportamento por defeito do evento.'),
          T.ok(/\berro\b/.test(c2), 'Um email sem @ está a ser aceite. A condição deve ser verdadeira quando o email NÃO inclui @.'),
          T.ok(/\bsucesso\b/.test(c3) && m3.indexOf('Beatriz') >= 0, 'Uma inscrição válida deve mostrar a mensagem com a classe sucesso.')
        ];
      },
      sol: { blanks: { ev: 'submit', pd: 'preventDefault', cond: "!email.includes('@')", cls: 'sucesso' } },
      explain: 'O que aconteceria sem preventDefault()? Para que serve o ! na condição do email?'
    },
    {
      id: 'm6l3', kind: 'construir', editable: ['js'], title: 'Inscrição completa',
      sit: 'A Sala E6 vai inscrever os alunos nos workshops do CTE. Cada inscrição válida imprime um cartão de acesso.',
      obj: 'Valida o nome (3 ou mais letras), o email (com @ e ponto) e o ano. Se estiver tudo certo, mostra em #resumo o nome, o ano e o workshop.',
      base: { html: M6_FORM, css: M6_CSS },
      starter: { js: `// Valida a inscrição quando o formulário é submetido.
// Regras: nome com pelo menos 3 letras, email com @ e ponto,
// ano escolhido. Se estiver tudo certo, mostra o resumo.
// Elementos: #inscricao, #nome, #email, #ano, #workshop,
//            #mensagem (classes "erro" ou "sucesso"), #resumo

` },
      req: ['A página não recarrega ao submeter', 'Um nome curto é recusado', 'Um email sem @ ou sem ponto é recusado', 'Um ano por escolher é recusado', 'Uma inscrição válida mostra o resumo com nome, ano e workshop', 'Depois de um erro, o resumo volta a esconder-se'],
      hints: [
        'Valida um campo de cada vez com `if` / `else if` e mostra o resumo só no `else` final, quando está tudo certo. `elemento.hidden = true` esconde um elemento.',
        "Lê os valores com `.value.trim()`. O email precisa de `includes('@')` e `includes('.')`. O ano é inválido quando o valor é `''`. No sucesso escreve o resumo com `textContent` e faz `resumo.hidden = false`; nos erros, `resumo.hidden = true`.",
        { t: 'Esqueleto (completa com as tuas condições):', code: "form.addEventListener('submit', function (evento) {\n  evento.preventDefault();\n  // ler os valores…\n  if (/* nome curto */) {\n    // mensagem de erro e esconder o resumo\n  } else if (/* email inválido */) {\n    // …\n  } else {\n    // mensagem de sucesso e mostrar o resumo\n  }\n});" }
      ],
      check: async function (T) {
        var f = T.q('#inscricao'), msg = T.q('#mensagem'), res = T.q('#resumo');
        var nome = T.q('#nome'), email = T.q('#email'), ano = T.q('#ano'), ws = T.q('#workshop');
        function isErr() { return msg.classList.contains('erro') && T.text(msg).length > 0; }
        async function go(n, e, a, w) { nome.value = n; email.value = e; ano.value = a; ws.value = w; var p = T.submit(f); await T.wait(25); return p; }
        var p1 = await go('Jo', 'tomas@escola.pt', '11.º ano', 'Edição de vídeo');
        var shortName = isErr() && !T.visible(res);
        await go('Tomás Reis', 'tomas.escola.pt', '11.º ano', 'Edição de vídeo'); var e1 = isErr();
        await go('Tomás Reis', 'tomas@escola', '11.º ano', 'Edição de vídeo'); var e2 = isErr();
        await go('Tomás Reis', 'tomas@escola.pt', '', 'Edição de vídeo'); var noYear = isErr() && !T.visible(res);
        await go('Tomás Reis', 'tomas@escola.pt', '11.º ano', 'Edição de vídeo');
        var rt = T.text(res);
        var okSum = T.visible(res) && rt.indexOf('Tomás Reis') >= 0 && rt.indexOf('11.º ano') >= 0 && rt.indexOf('Edição de vídeo') >= 0 && !msg.classList.contains('erro');
        await go('', 'tomas@escola.pt', '11.º ano', 'Edição de vídeo');
        var hides = isErr() && !T.visible(res);
        return [
          T.ok(p1, 'A página recarrega ao submeter. Trata o evento submit e impede o comportamento por defeito.'),
          T.ok(shortName, 'O nome «Jo» devia ser recusado: mensagem com a classe erro e resumo escondido.'),
          T.ok(e1 && e2, !e1 ? 'Um email sem @ está a ser aceite.' : 'Um email sem ponto (tomas@escola) está a ser aceite.'),
          T.ok(noYear, 'Quando o ano fica por escolher, a inscrição devia ser recusada. O valor da opção «Escolhe o ano» é vazio.'),
          T.ok(okSum, 'Uma inscrição válida deve mostrar #resumo (hidden = false) com o nome, o ano e o workshop.'),
          T.ok(hides, 'Depois de uma inscrição válida, um erro novo deve esconder outra vez o resumo.')
        ];
      },
      sol: { code: { js: "const f=document.querySelector('#inscricao'),m=document.querySelector('#mensagem'),r=document.querySelector('#resumo');\nfunction erro(x){m.textContent=x;m.className='erro';r.hidden=true;}\nf.addEventListener('submit',function(e){e.preventDefault();const n=document.querySelector('#nome').value.trim(),em=document.querySelector('#email').value.trim(),a=document.querySelector('#ano').value,w=document.querySelector('#workshop').value;if(n.length<3)erro('Nome');else if(!em.includes('@')||!em.includes('.'))erro('Email');else if(a==='')erro('Ano');else{m.textContent='Inscrição recebida!';m.className='sucesso';r.textContent=n+' · '+a+' · '+w;r.hidden=false;}});" } },
      explain: 'Por que ordem verificas os campos? Porque é que o resumo deve esconder-se depois de um erro?'
    },
    {
      id: 'm6l4', kind: 'desafio', editable: ['js'], title: 'Três vagas',
      sit: 'O workshop de Impressão 3D só tem 3 vagas, e o formulário continua a aceitar inscrições quando já estão todas ocupadas.',
      obj: 'Cada inscrição válida acrescenta o nome à lista e desconta uma vaga. Sem vagas, mostra uma mensagem de erro e não aceita mais nomes.',
      base: { html: `<h1>Workshop de Impressão 3D</h1>
<p>Vagas disponíveis: <strong id="vagas">3</strong></p>
<form id="inscricao" novalidate>
  <label for="nome">Nome completo</label>
  <input id="nome" autocomplete="off">
  <button type="submit">Inscrever</button>
</form>
<p id="mensagem" role="status"></p>
<h2>Inscritos</h2>
<ul id="inscritos"></ul>`, css: M6_CSS },
      starter: { js: `// O workshop tem 3 vagas.
// Cada inscrição válida (nome com 3 ou mais letras):
//   - acrescenta um <li> com o nome à lista #inscritos
//   - desconta uma vaga em #vagas
// Sem vagas: mensagem com a classe "erro" que fale de vagas.

` },
      req: ['A página não recarrega ao submeter', 'Cada inscrição válida acrescenta o nome à lista', 'As vagas descem de 3 até 0', 'Sem vagas, aparece um erro e não entram mais nomes', 'Um nome vazio é recusado'],
      hints: [
        'Uma variável declarada fora da função (`let vagas = 3;`) guarda o valor entre inscrições. Para acrescentar à lista: `const li = document.createElement(\'li\');`, `li.textContent = nome;` e `lista.append(li);`.'
      ],
      check: async function (T) {
        var f = T.q('#inscricao'), n = T.q('#nome'), msg = T.q('#mensagem'), ul = T.q('#inscritos'), v = T.q('#vagas');
        function count() { return T.qa('li', ul).length; }
        n.value = ''; var p0 = T.submit(f); await T.wait(20);
        var emptyOk = count() === 0 && msg.classList.contains('erro');
        n.value = 'Ana Lima'; T.submit(f); await T.wait(20); var c1 = count(), v1 = T.num(T.text(v));
        var addOk = c1 === 1 && T.text(ul).indexOf('Ana Lima') >= 0;
        n.value = 'Rui Costa'; T.submit(f); await T.wait(20);
        n.value = 'Eva Neto'; T.submit(f); await T.wait(20); var c3 = count(), v3 = T.num(T.text(v));
        n.value = 'Teo Dias'; T.submit(f); await T.wait(20); var c4 = count();
        var full = c4 === 3 && msg.classList.contains('erro') && /vaga/i.test(T.text(msg));
        return [
          T.ok(p0, 'A página recarrega ao submeter.'),
          T.ok(addOk && c3 === 3, 'As inscrições válidas não estão a aparecer na lista de inscritos.'),
          T.ok(v1 === 2 && v3 === 0, 'O número de vagas não desce a cada inscrição.'),
          T.ok(full, 'Depois de 3 inscrições, devia aparecer um erro sobre as vagas e a lista não devia crescer.'),
          T.ok(emptyOk, 'Um nome vazio devia ser recusado com uma mensagem de erro.')
        ];
      },
      sol: { code: { js: "let vagas=3;const f=document.querySelector('#inscricao'),m=document.querySelector('#mensagem');f.addEventListener('submit',function(e){e.preventDefault();const n=document.querySelector('#nome').value.trim();if(n.length<3){m.textContent='Escreve o nome.';m.className='erro';return;}if(vagas===0){m.textContent='Não há vagas.';m.className='erro';return;}const li=document.createElement('li');li.textContent=n;document.querySelector('#inscritos').append(li);vagas--;document.querySelector('#vagas').textContent=vagas;m.textContent='Inscrito!';m.className='sucesso';});" } },
      explain: 'Onde guardaste o número de vagas e porquê fora da função? Como acrescentaste o nome à lista?'
    }
  ]
};

/* ---------------------------------------------------------
   Lab Apoio 3.1 · desafios extra (todos abertos)
   --------------------------------------------------------- */
const EXTRA = {
  id: 'extra', n: 7, sala: 'Lab Apoio 3.1', title: 'Desafios extra', learn: 'Seis desafios curtos, um de cada tema', extra: true,
  levels: [
    {
      id: 'x1', kind: 'desafio', editable: ['html'], title: 'Tabela de equipamento', tema: 'HTML',
      sit: 'O inventário da Sala E3 tem de passar para uma tabela.', obj: 'Cria uma tabela com legenda, cabeçalho e pelo menos 3 linhas de equipamento.',
      base: { css: 'table{border-collapse:collapse}th,td{border:1px solid #c9d6dc;padding:6px 10px;text-align:left}caption{font-weight:700;margin-bottom:6px;text-align:left}th{background:#1f3d50;color:#fff}' },
      starter: { html: '<!-- Tabela: equipamento | quantidade | sala -->\n\n' },
      req: ['Uma tabela com legenda (`<caption>`)', 'Cabeçalho com pelo menos 2 colunas (`<th>`)', 'Pelo menos 3 linhas de dados'],
      hints: ['Uma tabela usa `<table>`, com `<caption>` (legenda), `<thead>` e `<tbody>`. Cada linha é um `<tr>`; as células de cabeçalho são `<th>` e as de dados `<td>`.'],
      check: function (T) {
        var t = T.q('table');
        var rows = t ? T.qa('tr', t).filter(function (r) { return T.qa('td', r).length > 0; }) : [];
        return [T.ok(t && T.q('caption', t), 'Falta uma tabela com <caption>.'), T.ok(t && T.qa('th', t).length >= 2, 'O cabeçalho precisa de pelo menos 2 células <th>.'), T.ok(rows.length >= 3, 'A tabela precisa de pelo menos 3 linhas com células <td>.')];
      },
      sol: { code: { html: '<table><caption>Inventário</caption><thead><tr><th>Equipamento</th><th>Qtd.</th></tr></thead><tbody><tr><td>Impressora 3D</td><td>2</td></tr><tr><td>Arduino</td><td>15</td></tr><tr><td>Portátil</td><td>12</td></tr></tbody></table>' } },
      explain: 'Para que servem thead e tbody?'
    },
    {
      id: 'x2', kind: 'desafio', editable: ['css'], title: 'Texto legível', tema: 'CSS',
      sit: 'O regulamento do CTE é difícil de ler: letra pequena, linhas compridas e coladas.', obj: 'Torna o texto legível: letra de 16px ou mais, entrelinha de 1,4 ou mais, linhas com 380 a 680px de largura e texto centrado na página.',
      base: { html: '<article class="texto"><h1>Regulamento do CTE</h1><p>Os equipamentos do Centro Tecnológico Especializado são de todos. Cada aluno é responsável pelo posto de trabalho que usa e deve deixá-lo arrumado e desligado no fim da aula, com as cadeiras no lugar.</p><p>As impressoras 3D e os kits de robótica só podem ser usados com a presença de um professor. Os materiais consumíveis são registados na folha de cada sala.</p><p>Qualquer avaria deve ser comunicada ao professor ou no Lab Apoio da sala, para ser reparada o mais depressa possível.</p></article>', css: 'body{font-size:12px;line-height:1.1}' },
      starter: { css: '/* Melhora a leitura do regulamento. */\n.texto {\n\n}\n' }, widths: [900],
      req: ['Letra com pelo menos 16px', 'Entrelinha de pelo menos 1,4', 'Linhas entre 380px e 680px de largura', 'O texto está centrado na página'],
      hints: ['A legibilidade depende do tamanho da letra (`font-size`), da entrelinha (`line-height`) e do comprimento das linhas (`max-width`). Para centrar um bloco com largura máxima, usa `margin: 0 auto`.'],
      check: function (T) {
        var p = T.q('.texto p'), s = T.cs(p), a = T.r(T.q('.texto'));
        var w = T.r(p).width, ml = a.left, mr = window.innerWidth - a.right;
        return [T.ok(parseFloat(s.fontSize) >= 16, 'A letra ainda é pequena.'), T.ok(parseFloat(s.lineHeight) / parseFloat(s.fontSize) >= 1.39, 'As linhas estão demasiado juntas.'), T.ok(w >= 380 && w <= 680, 'As linhas têm ' + Math.round(w) + 'px: precisam de 380px a 680px.'), T.ok(Math.abs(ml - mr) < 24 && w <= 680, 'O texto não está centrado na página.')];
      },
      sol: { code: { css: '.texto{font-size:17px;line-height:1.6;max-width:620px;margin:0 auto}' } },
      explain: 'Porque é que linhas muito compridas cansam a leitura?'
    },
    {
      id: 'x3', kind: 'desafio', editable: ['css'], title: 'Mesmo ao centro', tema: 'Flexbox',
      sit: 'O ecrã de boas-vindas mostra a mensagem no canto.', obj: 'Centra a caixa amarela no palco azul, na horizontal e na vertical.',
      base: { html: '<div class="palco"><div class="caixa">Bem-vindo ao CTE</div></div>', css: '.palco{height:300px;background:#1f3d50;border-radius:10px}.caixa{background:#e2a82c;padding:16px 24px;border-radius:8px;font-weight:700}' },
      starter: { css: '.palco {\n\n}\n' }, widths: [900],
      req: ['A caixa está centrada na horizontal', 'A caixa está centrada na vertical'],
      hints: ['Um contentor flexível pode centrar os filhos nos dois eixos: `justify-content` no eixo principal e `align-items` no eixo transversal.'],
      check: function (T) {
        var p = T.r(T.q('.palco')), c = T.r(T.q('.caixa'));
        return [T.ok(c.width < p.width - 40 && Math.abs((c.left + c.width / 2) - (p.left + p.width / 2)) < 2, 'A caixa não está centrada na horizontal.'), T.ok(Math.abs((c.top + c.height / 2) - (p.top + p.height / 2)) < 2, 'A caixa não está centrada na vertical.')];
      },
      sol: { code: { css: '.palco{display:flex;justify-content:center;align-items:center}' } },
      explain: 'Que propriedade centrou em cada eixo?'
    },
    {
      id: 'x4', kind: 'desafio', editable: ['css'], title: 'Galeria 2 × 2', tema: 'Grid',
      sit: 'As fotografias do Dia Aberto aparecem numa coluna comprida.', obj: 'Organiza as quatro fotografias numa grelha de 2 colunas iguais, com espaço entre elas.',
      base: { html: '<section class="galeria"><figure><img src="sala.svg" alt="Sala E1"><figcaption>Sala E1</figcaption></figure><figure><img src="equipamento.svg" alt="Impressora 3D"><figcaption>Impressão 3D</figcaption></figure><figure><img src="cte.svg" alt="Logótipo do CTE"><figcaption>CTE</figcaption></figure><figure><img src="imagem.svg" alt="Exterior da escola"><figcaption>Exterior</figcaption></figure></section>', css: 'figure{margin:0;background:#f3f7f6;padding:6px;border-radius:8px}img{display:block;width:100%}figcaption{font-size:.85rem;padding-top:4px}' },
      starter: { css: '.galeria {\n\n}\n' }, widths: [900],
      req: ['2 colunas iguais', '2 linhas', 'Pelo menos 8px entre fotografias'],
      hints: ['`display: grid` com `grid-template-columns: 1fr 1fr` cria duas colunas iguais; os elementos passam sozinhos para a linha seguinte. O espaço entre eles é o `gap`.'],
      check: function (T) {
        var f = T.qa('figure'), L = {}, Tp = {}; f.forEach(function (x) { L[Math.round(T.r(x).left)] = 1; Tp[Math.round(T.r(x).top)] = 1; });
        var ws = f.map(function (x) { return T.r(x).width; });
        var g = f.length > 1 ? T.r(f[1]).left - T.r(f[0]).right : 0;
        return [T.ok(Object.keys(L).length === 2 && Math.max.apply(null, ws) - Math.min.apply(null, ws) < 2, 'A galeria precisa de 2 colunas iguais.'), T.ok(Object.keys(Tp).length === 2, 'As fotografias devem ficar em 2 linhas.'), T.ok(g >= 8, 'Falta espaço entre as fotografias.')];
      },
      sol: { code: { css: '.galeria{display:grid;grid-template-columns:1fr 1fr;gap:12px}' } },
      explain: 'O que aconteceria com 6 fotografias?'
    },
    {
      id: 'x5', kind: 'desafio', editable: ['js'], title: 'Contador de visitantes', tema: 'JavaScript',
      sit: 'A receção conta os visitantes do Dia Aberto com dois botões.', obj: 'O botão + soma 1, o botão − subtrai 1, e o valor nunca fica negativo.',
      base: { html: '<h1>Visitantes</h1><p id="valor">0</p><button id="menos">−</button> <button id="mais">+</button>', css: '#valor{font-size:3rem;font-weight:800;margin:0}button{font:inherit;font-size:1.5rem;width:56px}' },
      starter: { js: '// #mais soma 1, #menos subtrai 1 (nunca abaixo de 0)\n\n' },
      req: ['O botão + soma 1', 'O botão − subtrai 1', 'O valor nunca fica negativo'],
      hints: ['Guarda o valor numa variável `let`, muda-a nos cliques e escreve-a com `textContent`. Uma condição (`if`) impede que desça abaixo de 0.'],
      check: async function (T) {
        var v = T.q('#valor'), m = T.q('#mais'), n = T.q('#menos');
        m.click(); m.click(); m.click(); await T.wait(20); var a = T.num(T.text(v));
        n.click(); await T.wait(20); var b = T.num(T.text(v));
        for (var i = 0; i < 5; i++) n.click(); await T.wait(20); var c = T.num(T.text(v));
        return [T.ok(a === 3, 'Três cliques em + deviam dar 3.'), T.ok(b === 2, 'Um clique em − devia baixar para 2.'), T.ok(c === 0, 'O valor desceu abaixo de 0 (ou não chegou a 0).')];
      },
      sol: { code: { js: "let v=0;const e=document.querySelector('#valor');document.querySelector('#mais').addEventListener('click',function(){v++;e.textContent=v;});document.querySelector('#menos').addEventListener('click',function(){if(v>0)v--;e.textContent=v;});" } },
      explain: 'Onde colocaste a condição que impede valores negativos?'
    },
    {
      id: 'x6', kind: 'desafio', editable: ['js'], title: 'Palavra-passe segura', tema: 'Formulários',
      sit: 'As contas do CTE precisam de palavras-passe fortes.', obj: 'Enquanto se escreve, mostra «fraca» (menos de 8 caracteres), «média» (8 ou mais, sem números) ou «forte» (8 ou mais, com pelo menos um número), com a classe correspondente.',
      base: { html: '<label for="senha">Palavra-passe</label><br><input id="senha" type="password"><p id="forca"></p>', css: 'input{font:inherit;padding:6px}.fraca{color:#b3392a;font-weight:700}.media{color:#8f5500;font-weight:700}.forte{color:#21734a;font-weight:700}' },
      starter: { js: '// Escreve em #forca: fraca, média ou forte\n// e usa as classes "fraca", "media" ou "forte".\n\n' },
      req: ['Menos de 8 caracteres: «fraca»', '8 ou mais, sem números: «média»', '8 ou mais, com um número: «forte»'],
      hints: ['O evento `input` acontece a cada tecla. `valor.length` conta os caracteres e `/[0-9]/.test(valor)` diz se há algum número.'],
      check: async function (T) {
        var s = T.q('#senha'), f = T.q('#forca');
        function type(v) { s.value = v; s.dispatchEvent(new Event('input', { bubbles: true })); }
        type('abc'); await T.wait(20); var a = [T.text(f), f.className];
        type('portaria'); await T.wait(20); var b = [T.text(f), f.className];
        type('portaria3'); await T.wait(20); var c = [T.text(f), f.className];
        return [T.ok(/fraca/i.test(a[0]) && /fraca/.test(a[1]), '«abc» devia aparecer como fraca, com a classe fraca. O texto atualiza com o evento input?'), T.ok(/m[ée]dia/i.test(b[0]) && /media/.test(b[1]), '«portaria» (8 letras, sem números) devia aparecer como média.'), T.ok(/forte/i.test(c[0]) && /forte/.test(c[1]), '«portaria3» devia aparecer como forte.')];
      },
      sol: { code: { js: "const s=document.querySelector('#senha'),f=document.querySelector('#forca');s.addEventListener('input',function(){const v=s.value;if(v.length<8){f.textContent='fraca';f.className='fraca';}else if(!/[0-9]/.test(v)){f.textContent='média';f.className='media';}else{f.textContent='forte';f.className='forte';}});" } },
      explain: 'Por que ordem verificaste as condições?'
    }
  ]
};

/* ---------------------------------------------------------
   Lab Apoio E6.1 · desafio final
   --------------------------------------------------------- */
const FINAL = {
  id: 'final', n: 8, sala: 'Lab Apoio E6.1', title: 'Centro de controlo', learn: 'Transferir: uma página nova com HTML, CSS e JavaScript', final: true,
  levels: [{
    id: 'final1', kind: 'construir', editable: ['html', 'css', 'js'], title: 'Portal do CTE AERT3',
    sit: 'Todas as salas voltaram a funcionar. Falta o portal do CTE, que aparece no ecrã grande do centro de controlo.',
    obj: 'Cria o portal do CTE à tua maneira: não há código de partida nem solução para copiar. Aplica o que aprendeste nas seis salas.',
    base: {},
    starter: { html: '<!-- Portal do CTE AERT3.\n     Imagens disponíveis: cte.svg, sala.svg, equipamento.svg -->\n\n', css: '/* Estilos do portal */\n\n', js: '// Formulário de contacto ou de inscrição\n\n' },
    widths: [900, 360],
    req: ['Estrutura: `<header>` com `<h1>`, `<main>`, imagem com `alt` e uma ligação', 'Um menu em flexbox com pelo menos 3 ligações', 'Uma grelha (grid) com pelo menos 3 elementos', 'Um formulário que avisa quando está vazio e confirma quando está preenchido, sem recarregar', 'Telemóvel (360px): nada sai do ecrã'],
    hints: [
      'Recorda as salas: estrutura e atributos (E1), cores e caixa (E2), flexbox (E3), grid (E4), eventos e DOM (E5), formulários e condições (E6).',
      'Planeia antes de escrever: primeiro o HTML completo, depois o CSS do menu e da grelha, por fim o JavaScript do formulário. Testa depois de cada parte e usa o modo Telemóvel.',
      'Lista de verificação: um `nav` com 3 ou mais ligações; uma secção com 3 ou mais cartões; um `form` com um campo de texto e um elemento para a mensagem; uma imagem com `alt`.'
    ],
    check: async function (T) {
      var miss = [];
      if (!T.q('header h1')) miss.push('<header> com <h1>');
      if (!T.q('main')) miss.push('<main>');
      var img = T.q('img'); if (!img || (img.getAttribute('alt') || '').trim().length < 5) miss.push('imagem com alt');
      if (!T.q('a[href]')) miss.push('ligação com href');
      var all = T.qa('body *');
      var flexNav = all.some(function (el) { var d = T.cs(el).display; return (d === 'flex' || d === 'inline-flex') && el.querySelectorAll('a').length >= 3; });
      var grid = all.some(function (el) { var d = T.cs(el).display; return (d === 'grid' || d === 'inline-grid') && el.children.length >= 3; });
      var form = T.q('form'), formOk = false, why = 'Falta um <form>.';
      if (form) {
        var fields = T.qa('input, textarea, select', form).filter(function (f) { return !/^(submit|button|reset|hidden|checkbox|radio|image)$/.test(f.type); });
        if (!fields.length) { why = 'O formulário precisa de pelo menos um campo para preencher.'; }
        else {
          fields.forEach(function (f) { if (f.tagName === 'SELECT') f.selectedIndex = 0; else f.value = ''; });
          var before = document.body.innerText;
          var p1 = T.submit(form); await T.wait(40);
          var t1 = document.body.innerText;
          fields.forEach(function (f) {
            if (f.tagName === 'SELECT') f.selectedIndex = f.options.length - 1;
            else if (f.type === 'email') f.value = 'aluno@escola.pt';
            else if (f.type === 'number') f.value = '12';
            else if (f.type === 'tel') f.value = '912345678';
            else if (f.type === 'date') f.value = '2026-11-05';
            else f.value = 'Ana Martins';
          });
          var p2 = T.submit(form); await T.wait(40);
          var t2 = document.body.innerText;
          formOk = p1 && p2 && t1 !== before && t2 !== t1;
          if (!p1 || !p2) why = 'O formulário recarrega a página. Trata o evento submit com preventDefault().';
          else if (t1 === before) why = 'Com os campos vazios, o formulário não mostra nenhum aviso.';
          else why = 'Com os campos preenchidos, a mensagem devia mudar para uma confirmação.';
        }
      }
      var wide = window.innerWidth > 600;
      return [
        T.ok(!miss.length, 'Falta na estrutura: ' + miss.join(', ') + '.'),
        T.ok(flexNav, 'Não encontrei um contentor flexível com pelo menos 3 ligações (o menu).'),
        T.ok(grid, 'Não encontrei uma grelha (display: grid) com pelo menos 3 elementos.'),
        T.ok(formOk, why),
        T.ok(wide || !T.overflow(), 'No telemóvel, há conteúdo a sair do ecrã.')
      ];
    },
    sol: { code: {
      html: '<header><h1>Portal do CTE</h1><nav class="n"><a href="#salas">Salas</a><a href="#projetos">Projetos</a><a href="#contacto">Contacto</a></nav></header><main><img src="cte.svg" alt="Símbolo do CTE"><section class="g"><article>E1</article><article>E2</article><article>E3</article></section><form id="f"><input id="nm"><button>Enviar</button></form><p id="msg"></p></main>',
      css: '.n{display:flex;gap:8px;flex-wrap:wrap}.g{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}',
      js: "document.querySelector('#f').addEventListener('submit',function(e){e.preventDefault();var v=document.querySelector('#nm').value.trim();document.querySelector('#msg').textContent=v?'Obrigado, '+v:'Preenche o nome';});"
    } },
    explain: 'Que decisões tomaste nesta página que não estavam em nenhuma sala? O que mudarias se o CTE crescesse?'
  }]
};

const MISSOES = [TUT, M1, M2, M3, M4, M5, M6, EXTRA, FINAL];
const PRINCIPAIS = [M1, M2, M3, M4, M5, M6];
MISSOES.forEach(m => m.levels.forEach((L, i) => { L.mission = m; L.index = i; }));
