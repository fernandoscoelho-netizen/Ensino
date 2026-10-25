# Prompt — «CTE Online»: jogo 3D de HTML, CSS e JavaScript no CTE do AERT3

> **Como usar este prompt.** Copia tudo a partir de «Papel» para uma nova conversa e anexa estes quatro ficheiros:
> - `planta-espacos-cte.png` — planta simplificada dos espaços, sem mobiliário;
> - `espacos-cte.json` — os mesmos dados, em metros;
> - `logo-aert3.png`;
> - `barra-financiamento.png`.
>
> O prompt pede a construção por fases, com uma paragem para validação no fim de cada fase. Não peças tudo de uma vez: um jogo 3D com seis missões não cabe numa única resposta, e a qualidade cai.

---

## Papel

És um programador de jogos educativos para a web e um professor experiente de programação web no ensino profissional. Vais criar o jogo **«CTE Online»** para alunos do Centro Tecnológico Especializado (CTE) do Agrupamento de Escolas de Rio Tinto n.º 3 (AERT3), na Escola Secundária de Rio Tinto.

Escreve **todo o texto do jogo em português de Portugal**: interface, missões, feedback, pistas e comentários no código dos alunos. Usa «ecrã», «telemóvel», «ficheiro», «clicar», «utilizador» e o tratamento por «tu». Nunca uses português do Brasil.

## História

Uma falha informática deixou o CTE em modo de segurança: as luzes estão apagadas, as portas trancadas e os ecrãs desligados. O aluno entra pela porta principal e percorre o edifício. Em cada sala, resolve desafios de HTML, CSS e JavaScript num terminal. Cada missão concluída repõe a energia dessa sala, e o resultado do código do aluno aparece no próprio espaço 3D.

## Público e objetivos de aprendizagem

- **Público:** alunos do ensino profissional em iniciação ao desenvolvimento web, sem experiência anterior.
- **Duração:** o jogo decorre ao longo de várias aulas.
- **Aprendizagens:**
  - HTML: estrutura e semântica;
  - CSS: seletores, modelo de caixa, Flexbox e Grid;
  - JavaScript: variáveis, eventos, DOM, condições e formulários.
- **Princípios pedagógicos:**
  - Errar não tem custo. Não há vidas, não há temporizador e não há rankings de velocidade.
  - O feedback explica o que falta.
  - As pistas aparecem por etapas.
  - O progresso valoriza o funcionamento, a explicação e a adaptação, nunca a rapidez.

---

## Tecnologia

Usa **Three.js** para o mundo 3D e **Bootstrap 5** para a interface.

Não uses p5.js. O modo WEBGL do p5.js não tem grafo de cena, controlos de câmara, deteção de colisões nem um renderizador CSS3D. Isso obrigaria a escrever à mão o que o Three.js já resolve, e teria pior desempenho nos computadores da escola.

| Camada | Tecnologia | Versão fixa |
|---|---|---|
| Mundo 3D, câmara, personagem, iluminação | Three.js, módulos ES via `importmap` | `three@0.160.0` (jsDelivr) |
| Ecrãs com páginas reais na parede (opcional) | `CSS3DRenderer` dos addons do Three.js | a mesma versão |
| Interface: menus, painel da missão, modais, toasts, progresso | Bootstrap | `bootstrap@5.3.3` (CSS + bundle JS) |
| Editor de código | `textarea` com indentação automática, ou CodeMirror 5 | `codemirror@5.65.16` (opcional) |
| Minimapa e modo planta 2D | Canvas 2D | — |

**Regras técnicas**

- O site é **estático**: abre a partir de uma pasta, não precisa de servidor próprio e funciona no servidor da escola ou no GitHub Pages.
- Fixa sempre a versão exata das bibliotecas.
- **Não uses modelos 3D externos** (`.glb`, `.fbx`). O edifício e a personagem são gerados por código, a partir de primitivas. Assim o jogo carrega depressa e não depende de ficheiros de terceiros.
- **Estrutura de ficheiros:**

```
index.html
css/jogo.css
js/main.js            arranque, ciclo de jogo, estados
js/mundo.js           construção do edifício a partir de espacos-cte.json
js/personagem.js      humanoide, animação, controlos, colisões
js/missoes.js         dados das missões e dos níveis
js/verificador.js     pré-visualização isolada e testes
js/estado.js          progresso, localStorage, exportação
js/ui.js              Bootstrap: painéis, modais, HUD, minimapa
dados/espacos-cte.json
assets/logo-aert3.png
assets/barra-financiamento.png
```

- **Se for publicado como página única** (por exemplo, como artifact do Claude): junta tudo num `index.html`, embute as imagens como `data:` URI e coloca os estilos do Bootstrap dentro de `<style>`. Nesse ambiente, as folhas de estilo de CDN são bloqueadas.

---

## O edifício: dados da planta

A geometria vem da planta de mobiliário da Escola Secundária de Rio Tinto (escala 1:100, 15-09-2025). **O mobiliário foi ignorado**: só contam os espaços, as paredes, as portas e as janelas.

### Convenções

- Unidade: metros.
- Origem no canto exterior noroeste do bloco principal. O `x` cresce para este; o `y` da planta cresce para sul e corresponde ao `z` no 3D.
- Bloco principal: 22,5 × 22,3 m.
- Pé-direito: 3,0 m.
- Espessura das paredes: exteriores 0,4 m; interiores 0,2 m.
- Janelas regulares em todas as fachadas exteriores das salas: cerca de 3 por sala, com peitoril a 0,9 m e 1,5 m de altura.
- As medidas são aproximadas (± 10 cm). Usa estes valores sem os «corrigir».

### Espaços

Cada retângulo é `[x0, y0, x1, y1]`. A Sala E3 tem forma de L, por isso tem dois retângulos.

```json
[
 {"id":"entrada","nome":"Entrada","tipo":"circulacao","rects":[[11.61,-3.9,14.92,0.0]]},
 {"id":"corredor","nome":"Corredor","tipo":"circulacao","rects":[[11.61,0.42,14.83,6.27]]},
 {"id":"atrio","nome":"Átrio","tipo":"circulacao","rects":[[8.05,6.27,14.83,9.66]]},
 {"id":"passagem_o","nome":"Passagem oeste","tipo":"circulacao","rects":[[8.05,9.66,9.49,15.85]]},
 {"id":"passagem_e","nome":"Passagem este","tipo":"circulacao","rects":[[13.39,9.66,14.83,14.92]]},
 {"id":"sala_e1","nome":"Sala E1","tipo":"sala","rects":[[15.25,0.42,22.12,7.29]]},
 {"id":"sala_e2","nome":"Sala E2","tipo":"sala","rects":[[15.25,7.71,22.12,14.49]]},
 {"id":"sala_e3","nome":"Sala E3","tipo":"sala","rects":[[13.39,14.92,22.12,21.78],[11.61,16.27,13.39,21.78]]},
 {"id":"sala_e4","nome":"Sala E4","tipo":"sala","rects":[[0.85,14.92,7.63,21.78]]},
 {"id":"sala_e5","nome":"Sala E5","tipo":"sala","rects":[[0.85,7.71,7.63,14.49]]},
 {"id":"sala_e6","nome":"Sala E6","tipo":"sala","rects":[[0.85,0.42,7.63,7.29]]},
 {"id":"lab_e6_1","nome":"Lab Apoio E6.1","tipo":"sala","rects":[[8.05,0.42,11.27,6.27]]},
 {"id":"lab_3_1","nome":"Lab Apoio 3.1","tipo":"sala","rects":[[8.05,16.19,11.27,21.78]]},
 {"id":"escadas","nome":"Escadas (piso superior)","tipo":"bloqueado","rects":[[11.53,9.75,13.39,14.49]]},
 {"id":"arrecadacao","nome":"Arrecadação","tipo":"bloqueado","rects":[[9.58,9.75,11.44,12.63]]},
 {"id":"tecnico","nome":"Compartimento técnico","tipo":"bloqueado","rects":[[9.58,12.71,13.39,16.19]]}
]
```

### Portas

Cada abertura é dada pelo retângulo que ocupa na parede.

```json
[
 {"id":"p_exterior","liga":["exterior","entrada"],"abertura":[12.2,-3.98,14.24,-3.73]},
 {"id":"p_rampa","liga":["exterior","entrada"],"abertura":[14.83,-2.2,15.0,-0.76]},
 {"id":"p_entrada","liga":["entrada","corredor"],"abertura":[12.37,-0.08,14.24,0.51]},
 {"id":"p_e1","liga":["sala_e1","atrio"],"abertura":[14.8,6.44,15.29,7.29]},
 {"id":"p_e2","liga":["sala_e2","passagem_e"],"abertura":[14.8,13.56,15.29,14.41]},
 {"id":"p_e3","liga":["sala_e3","passagem_e"],"abertura":[13.47,14.83,14.32,15.0]},
 {"id":"p_e4","liga":["sala_e4","passagem_o"],"abertura":[7.59,15.0,8.08,15.85]},
 {"id":"p_e5","liga":["sala_e5","passagem_o"],"abertura":[7.59,13.56,8.08,14.41]},
 {"id":"p_e6","liga":["sala_e6","atrio"],"abertura":[7.59,6.44,8.08,7.29]},
 {"id":"p_e6_1","liga":["lab_e6_1","atrio"],"abertura":[8.14,6.19,8.98,6.36]},
 {"id":"p_3_1","liga":["lab_3_1","passagem_o"],"abertura":[8.14,15.76,9.07,16.27]},
 {"id":"p_3_1_e3","liga":["lab_3_1","sala_e3"],"abertura":[11.24,16.44,11.64,17.29]},
 {"id":"p_escadas","liga":["escadas","atrio"],"abertura":[11.61,9.58,13.14,9.83]}
]
```

### Como construir o edifício

- Gera o chão de cada espaço a partir dos retângulos.
- Gera as paredes ao longo dos limites dos retângulos e abre um vão onde existe uma porta. Nos vãos, desenha a porta (aberta ou trancada) e uma verga até aos 3 m.
- Junta as paredes em poucas malhas (`BufferGeometryUtils.mergeGeometries` ou `InstancedMesh`) para o jogo correr bem em computadores modestos.
- Fora do edifício: um pátio simples e a rampa de acesso a este da entrada.
- **Espaços bloqueados** (escadas, arrecadação, compartimento técnico): são volumes fechados. As escadas mostram uma porta com a placa «Piso superior — em breve».
- **Paredes no 3D:** usa as paredes da planta tal como estão. Não inventes divisões nem acrescentes paredes.

---

## Mapa de missões

| Espaço | Missão | Aprendizagem |
|---|---|---|
| Entrada | Tutorial | Movimento, interação e primeira etiqueta HTML |
| Sala E1 | M1 · Ligar a sala | Estrutura HTML, elementos semânticos e atributos |
| Sala E2 | M2 · Dar cor ao espaço | CSS base: seletores, cores, tipografia, modelo de caixa |
| Sala E3 | M3 · Arrumar as bancadas | Flexbox: `display`, `justify-content`, `align-items`, `gap`, `flex-wrap` |
| Sala E4 | M4 · Montar o mural | Grid: colunas, `fr`, `gap`, `grid-column`, `repeat`, `auto-fit` e `minmax` |
| Sala E5 | M5 · Acender as luzes | JavaScript: variáveis, eventos, `querySelector`, `textContent`, classes |
| Sala E6 | M6 · Abrir as inscrições | Formulários, condições, evento `submit`, validação e mensagens |
| Lab Apoio 3.1 | Desafios extra | Desafios opcionais de reforço; abre depois da M3 |
| Lab Apoio E6.1 | Desafio final · Centro de controlo | Transferência: página nova, sem solução para copiar |
| Átrio | Quadro de missões | Painel 3D com o estado de cada sala |

**Percurso.** O percurso segue a numeração das salas: E1 → E6, no sentido dos ponteiros do relógio.

**Desbloqueio**

- Uma sala abre quando a anterior tem os níveis 1 e 2 concluídos.
- A sala fica totalmente ligada quando os quatro níveis estão feitos.
- O desafio final abre quando as seis missões têm os níveis 1 e 2 concluídos.
- Há uma opção do professor para desbloquear tudo.

---

## Personagem e controlos

### Humanoide

O aluno é representado por um humanoide gerado com primitivas (cápsulas, esferas e caixas): cabeça, tronco, braços e pernas articulados.

- **Animação:** procedural, com balanço de braços e pernas ao andar e respiração quando parado.
- **Personalização no início:** cor da camisola, cor do cabelo e tom de pele (paleta inclusiva). Opcionalmente, uma mochila com o logótipo do AERT3.

### Câmara

- **Por defeito:** terceira pessoa, atrás e acima do aluno, com suavização. A câmara não atravessa paredes: aproxima-se quando há uma parede no caminho.
- **Alternativa:** primeira pessoa, com a tecla `V`.

### Controlos

- **Teclado:** `WASD` ou setas para andar, `Shift` para correr, `E` ou `Enter` para interagir, `M` para o mapa, `Esc` para o menu.
- **Rato:** arrastar para rodar a câmara. Não uses *pointer lock*, porque confunde alunos iniciantes.
- **Ecrã tátil:** joystick virtual à esquerda e botão «Interagir» à direita.

### Movimento e colisões

- As colisões são em 2D (caixas das paredes no plano). A personagem tem raio de 0,3 m e desliza ao longo das paredes.
- As portas trancadas bloqueiam. Ao tentar passar, aparece a mensagem «Conclui a missão anterior para abrir esta sala.»

### Interação

- Quando o aluno se aproxima de um **terminal**, aparece a indicação «Carrega em E para abrir o terminal».
- O terminal é o ponto de interação de cada sala: um pedestal com ecrã, ao lado da parede principal. Não é mobiliário.

---

## Ciclo de jogo

```
explorar o espaço → abrir o terminal → ler o desafio → alterar o código
→ observar o resultado (na página e no 3D) → testar → melhorar
```

Cada missão tem **quatro níveis**:

1. **Explorar** — o aluno manipula controlos (listas, deslizadores, campos) e vê o código, a página e a sala 3D mudarem em tempo real.
2. **Completar** — o aluno preenche espaços em branco num excerto de código.
3. **Construir** — o aluno escreve o código com pouco apoio, a partir de comentários.
4. **Desafio** — um problema novo noutro contexto, ou um código com erros para corrigir. Mostra só a primeira pista, a do conceito.

### Painel do terminal

Abre como um `offcanvas` ou `modal fullscreen` do Bootstrap, com três áreas:

- **Missão:** situação, objetivo, requisitos com estado (✓ / !), feedback e pistas.
- **Código:**
  - separadores com os ficheiros editáveis e os ficheiros só de leitura;
  - botões «Executar», «Testar» e «Repor código»;
  - `Ctrl + Enter` executa o código.
- **Resultado:**
  - página real numa `iframe` isolada;
  - alternância entre «Largo» e «Telemóvel (360 px)»;
  - consola com `console.log` e erros (com a linha certa no código do aluno).

### Pistas

Cada nível tem três pistas, que aparecem uma de cada vez:

1. **Recordar o conceito.**
2. **Sugestão** da propriedade ou do método a usar.
3. **Exemplo semelhante** noutro contexto, que nunca é a solução.

### Explicação

Quando o aluno conclui um nível, o jogo pede-lhe que explique a solução por palavras suas, com uma pergunta específica de cada nível. A explicação é guardada para o professor.

---

## Ligação entre o código e o mundo 3D

Esta é a parte que torna o jogo memorável: **o código do aluno altera a sala onde ele está.**

### Como funciona

1. A página do aluno corre numa `iframe` com `sandbox="allow-scripts allow-forms"` e `srcdoc`.
2. Um *script* injetado pelo jogo, nunca escrito pelo aluno, mede os elementos marcados com `data-cte="…"`. Para cada um, envia ao jogo a posição (`getBoundingClientRect`) e os estilos calculados relevantes, por `postMessage`.
3. O jogo aplica esses dados a objetos 3D da sala, com transições suaves.
4. Nas missões de JavaScript, o *script* injetado disponibiliza uma API segura e limitada: `cte.luz(id, ligada)`, `cte.porta(id, aberta)`, `cte.ecra(texto)` e `cte.som('sucesso')`. Esta API só envia mensagens: o código do aluno nunca acede ao jogo diretamente.

### Efeito em cada missão

- **Tutorial (Entrada):** o aluno escreve `<h1>` numa placa e o texto aparece na placa da entrada.
- **M1 (E1):** a estrutura da página (`header`, `nav`, `main`, `footer`) ilumina blocos correspondentes numa parede-esquema. Elementos semânticos em falta deixam o bloco apagado.
- **M2 (E2):** a cor de fundo, a cor do texto, o `padding` e a `border` dos painéis do aluno pintam os painéis de parede da sala.
- **M3 (E3):** a posição dos itens flexíveis da página move caixas sobre as bancadas da sala. As bancadas são volumes simples gerados pelo jogo, não o mobiliário da planta. Aqui o aluno vê `justify-content` a acontecer em 3D.
- **M4 (E4):** os cartões da grelha do aluno aparecem como placas num mural de parede, nas mesmas colunas e linhas.
- **M5 (E5):** os botões da página do aluno acendem e apagam as luzes da sala através de `cte.luz()`.
- **M6 (E6):** uma inscrição válida no formulário do aluno «imprime» um cartão de acesso, e a porta do Lab Apoio E6.1 desbloqueia-se visualmente.
- **Final (Lab Apoio E6.1):** a página do aluno aparece num ecrã grande da sala, com `CSS3DRenderer` (só visualização). Se o computador não aguentar, usa uma captura estática.

---

## Conteúdo das missões

Para cada nível, define:

- título;
- situação e objetivo;
- requisitos (texto curto, com termos técnicos entre acentos graves);
- código de partida e controlos (Explorar) ou espaços em branco (Completar);
- três pistas;
- função de verificação;
- pergunta de explicação.

Usa conteúdo realista do CTE e do AERT3: horários das salas, equipamentos, clubes, notícias da escola e inscrições em workshops.

### M1 · Ligar a sala (HTML)

- **Explorar:** escolher entre `p`, `h2` e `h1` para o título; `div`, `ul` e `ol` para a lista; escrever o `alt` e o `href`.
- **Completar:** `main`, `src`, `alt`, `ul` e `href` em falta. Verifica se a abertura e o fecho das etiquetas coincidem.
- **Construir:** a página da Sala E1, com `header`, `h1`, descrição, imagem com `alt`, lista de equipamentos e ligação.
- **Desafio:** corrigir uma página com erros: etiquetas por fechar, `alt` vazio, `href` sem endereço e hierarquia de títulos errada.

### M2 · Dar cor ao espaço (CSS base)

- **Explorar:** deslizadores para `padding`, `margin`, `border-width` e `font-size`; seletores de cor.
- **Completar:** seletores de elemento, de classe e de `id`.
- **Construir:** estilos de um cartão de equipamento com modelo de caixa coerente.
- **Desafio:** descobrir porque uma regra não se aplica (especificidade e seletor errado).

### M3 · Arrumar as bancadas (Flexbox)

- **Explorar:** `display`, `justify-content`, `align-items` e `gap` num menu ou numa fila de bancadas.
- **Completar:** os dois contentores, `.menu` e `.ligacoes`.
- **Construir:** o menu do portal do CTE, adaptado a um ecrã de 360 px com `flex-wrap` ou `@media`.
- **Desafio:** um cartão com conteúdo vertical, usando `flex-direction: column` e um botão fixo em baixo.

### M4 · Montar o mural (Grid)

- **Explorar:** `grid-template-columns` (`1fr`, `1fr 1fr`, `200px 200px 200px`, `1fr 2fr 1fr`, `repeat(3, 1fr)`) e `gap`.
- **Completar:** `repeat(3, 1fr)` e um cartão em destaque com `span 2`.
- **Construir:** um mural adaptável com `repeat(auto-fit, minmax(200px, 1fr))` e destaque `1 / -1`, testado a 900 px e a 360 px.
- **Desafio:** um horário semanal em grelha, com uma aula que ocupa dois tempos.

### M5 · Acender as luzes (JavaScript e DOM)

- **Explorar:** variáveis e operadores, com o cálculo do consumo dos equipamentos e `toFixed(2)`.
- **Completar:** `addEventListener('click', …)`, seletor com `#`, `textContent` e `classList.toggle`.
- **Construir:** um painel de controlo com três botões que ligam zonas de luz (`cte.luz`) e mostram o estado na página.
- **Desafio:** um contador de lugares livres na sala, com os eventos `input` e `change` e conversão com `Number()`.

### M6 · Abrir as inscrições (formulários)

- **Explorar:** a condição `nome.trim().length >= 3`, com uma tabela de casos de teste na página.
- **Completar:** `submit`, `preventDefault`, `!email.includes('@')` e a classe `sucesso`.
- **Construir:** validação completa (nome, email com @ e ponto, ano escolhido) e resumo que se esconde depois de um erro.
- **Desafio:** inscrição num workshop com limite de vagas e mensagem quando já não há lugares.

### Desafio final · Centro de controlo

Página nova do **Portal do CTE AERT3**, sem código de partida. O jogo verifica:

- `header` com `h1`, `main`, uma imagem com `alt` e uma ligação;
- um menu com Flexbox e pelo menos 3 ligações;
- uma grelha com pelo menos 3 elementos;
- um formulário que avisa quando está vazio e confirma quando está preenchido, sem recarregar a página;
- nada sai do ecrã a 360 px.

### Lab Apoio 3.1 · Desafios extra

Seis desafios curtos e opcionais, um por missão. Cada um vale uma distinção «Curioso». Não são obrigatórios para avançar.

---

## Verificação: regras obrigatórias

### Verificar o resultado, não o texto

O jogo verifica o resultado no navegador, não o texto do código.

- Corre o código numa `iframe` de teste escondida, com largura fixa (900 px e/ou 360 px, conforme o nível).
- Mede `getComputedStyle` e `getBoundingClientRect`.
- Simula cliques, `input`, `change` e `submit` (com um `Event` sintético, verificando `defaultPrevented`).
- Lê o que aparece na página.

Uma solução diferente da prevista é aceite se funcionar. Por exemplo, `margin-left: auto` em vez de `space-between`.

### Formato das funções de verificação

- Cada nível tem uma função de verificação auto-contida, serializada com `toString()` e injetada na `iframe` de teste.
- A função recebe um objeto de utilitários e devolve uma lista de `{ ok, fix }` alinhada com os requisitos.
- `fix` é uma frase de feedback específica, que diz o que falta sem dar a solução. Por exemplo: «Os elementos já estão em linha. Falta distribuir o espaço entre o logótipo e o grupo de ligações.»

### Erros e limites

- Um nível só passa se todos os requisitos estiverem cumpridos e a consola não tiver erros.
- Mostra o primeiro erro de JavaScript com a linha relativa ao código do aluno.
- Se o teste não terminar em 6 segundos, mostra: «O código demorou demasiado. Pode haver um ciclo que nunca acaba.»

### Imagens

As páginas dos alunos podem usar imagens com nomes conhecidos (`sala.svg`, `equipamento.svg`, `cte.svg`). O *script* injetado substitui-as por ilustrações SVG geradas pelo jogo. Qualquer outro nome mostra uma imagem de exemplo.

### Teste interno obrigatório

Inclui em `js/missoes.js` uma **solução de referência** para cada nível, invisível para os alunos, e um modo de desenvolvimento (`?teste=1`) que confirma automaticamente que:

- cada código de partida **falha**;
- cada solução de referência **passa**.

Corre este teste antes de dar cada fase por terminada e apresenta o resultado.

---

## Progressão, distinções e professor

### Distinções por missão

Nenhuma distinção depende da rapidez.

- **Funciona** — níveis 1 e 2 concluídos.
- **Explica** — explicação com pelo menos 40 caracteres em 2 ou mais níveis.
- **Adapta** — nível 3 resolvido.
- **Supera** — nível 4 (Desafio) resolvido.
- **Transfere** — desafio final concluído.

### HUD

- Nome do aluno, sala atual e progresso (níveis concluídos de 24, mais o final).
- Minimapa da planta com a posição do aluno e o estado das salas: apagada, disponível ou ligada.

### Quadro de missões no Átrio

Um painel 3D com o estado de cada sala, que se atualiza à medida que o aluno avança.

### Relatório do professor

Abre a partir do menu, protegido por um PIN simples definido no primeiro uso.

- Tabela por nível com estado, tentativas (cada vez que o aluno carrega em «Testar»), pistas usadas e explicações.
- Distinções por missão.
- Opção para desbloquear todas as salas.
- Opção para apagar o progresso, com confirmação dentro da página.

### Guardar o progresso

- O progresso fica em `localStorage`, sempre com `try/catch`.
- **Código de progresso:** JSON em Base64 com o prefixo `CTE1.`, para copiar e colar. Serve para continuar noutro computador e para entregar ao professor.

---

## Logótipos e identidade

Usa os ficheiros anexados **sem os deformar, recolorir ou cortar**.

### `logo-aert3.png` (logótipo do agrupamento, quadrado)

- **Ecrã inicial:** grande, centrado, acima do título «CTE Online».
- **HUD:** pequeno, no canto superior esquerdo (cerca de 40 px), com `alt="Agrupamento de Escolas de Rio Tinto n.º 3"`.
- **No 3D:** placa na parede da Entrada, de frente para quem entra. Usa-o como textura num plano com moldura.

### `barra-financiamento.png` (Pessoas 2030, Portugal 2030, Cofinanciado pela União Europeia, Operação de Importância Estratégica, ANQEP, EQAVET)

- **Ecrã inicial:** rodapé a toda a largura, sobre **fundo branco**, com altura mínima de 48 px.
- **Ecrã de créditos e relatório do professor:** a mesma barra no rodapé.
- **No 3D:** placa informativa ao lado da porta exterior, à semelhança das placas obrigatórias nos espaços financiados.
- Não sobreponhas a barra à cena 3D sem fundo branco. Não a mostres com menos de 48 px de altura, para que o emblema da UE e a menção «Cofinanciado pela União Europeia» fiquem legíveis.
- `alt` sugerido: «Pessoas 2030, Portugal 2030, Cofinanciado pela União Europeia, Operação de Importância Estratégica, ANQEP e EQAVET».

### Paleta

- Parte do azul-petróleo do logótipo do AERT3 (cerca de `#1F3D50`), do grafite (`#2B2B2A`) e do branco.
- Para os estados «ligado» e «sucesso», usa um acento quente (âmbar). Para erros, usa vermelho, sempre acompanhado de ícone e texto.

---

## Acessibilidade e desempenho

### Acessibilidade

- Todas as ações são possíveis só com teclado.
- Foco visível em todos os elementos interativos.
- Contraste AA.
- Respeita `prefers-reduced-motion`: reduz o balanço da câmara e as animações.
- **Modo planta 2D**, ativável no menu: vista de cima em Canvas 2D, clicando numa sala para abrir o terminal. Serve para computadores sem WebGL, para alunos que enjoam com 3D e para uso rápido na aula.
- Textos alternativos nos logótipos e nas imagens.

### Desempenho

O alvo são **30 fps num portátil escolar com gráficos integrados**.

- Geometria *low poly*.
- Sombras desligadas por defeito; opção «Qualidade alta» liga sombras suaves.
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))`.
- Pausa a renderização 3D quando o terminal está aberto.

### Responsivo

- O jogo funciona a partir de 360 px de largura.
- No telemóvel, o terminal ocupa o ecrã inteiro e as três áreas passam a separadores: Missão, Código e Resultado.

---

## Construção por fases

Constrói o jogo em fases. **No fim de cada fase:**

- entrega o código completo, a funcionar;
- resume o que foi feito;
- **para e espera pela minha validação** antes de avançar.

**Fase 1 — Mundo navegável**

- Edifício gerado a partir do JSON.
- Personagem com animação, câmara e colisões.
- Portas trancadas e terminais.
- HUD com logótipo e minimapa.
- Ecrã inicial com logótipos e personalização.
- Modo planta 2D.

**Fase 2 — Motor de missões**

- Terminal com as três áreas.
- `iframe` isolada, consola e testes em `iframe` escondida.
- Pistas, feedback e explicação.
- Progresso e código de progresso.
- Tutorial e M1 completos, com a ligação ao 3D.

**Fase 3 — Missões M2 a M6**

- Os quatro níveis de cada missão.
- Efeitos 3D de cada missão.
- Teste interno com as soluções de referência.

**Fase 4 — Final, desafios extra e professor**

- Desafio final e Lab Apoio 3.1.
- Relatório do professor com PIN.
- Distinções e quadro de missões no Átrio.
- Afinação de desempenho e acessibilidade.

---

## Critérios de aceitação

- [ ] O edifício corresponde à planta anexada: mesmas salas, nomes, portas e proporções; sem mobiliário da planta.
- [ ] O aluno anda da Entrada até qualquer sala desbloqueada sem atravessar paredes nem ficar preso.
- [ ] Cada nível falha com o código de partida e passa com a solução de referência (`?teste=1`).
- [ ] O feedback é específico, em português de Portugal, e nunca dá a solução completa.
- [ ] Soluções alternativas válidas são aceites.
- [ ] O código do aluno tem efeito visível na sala 3D em todas as missões.
- [ ] Os logótipos aparecem conforme descrito, sem deformação, e a barra de financiamento fica sempre sobre fundo branco.
- [ ] O jogo corre a 30 fps num portátil escolar e funciona em modo planta 2D sem WebGL.
- [ ] O progresso sobrevive ao fecho do navegador e pode ser levado para outro computador com o código de progresso.
- [ ] Nenhum elemento valoriza a rapidez: não há temporizadores, vidas nem rankings.
