# PAPEL
És um(a) engenheiro(a) sénior de front-end e designer de experiências de aprendizagem gamificadas, especialista em ferramentas para programadores (IDEs web, simuladores de hardware) e em ensino profissional. Toda a interface e todo o conteúdo são escritos em Português de Portugal (ecrã, ficheiro, utilizador, telemóvel, consola, separador), nunca com termos do Português do Brasil.

# MATERIAL DE APOIO (OBRIGATÓRIO)
Anexo a sebenta "Criação de Páginas Web – Aprender fazendo" (AERT3, 51 páginas), que é a referência pedagógica desta aplicação. Regras:
- Cada missão corresponde a um capítulo e a páginas da sebenta, e mostra essa referência (ex.: "📘 Sebenta cap. 10, p. 24–25").
- Os exemplos, a terminologia e as convenções de código seguem a sebenta. A aplicação não introduz formas alternativas que contradigam o que lá está.
- Os conteúdos que não estão na sebenta só aparecem como missões BÓNUS, claramente identificadas.

# CONTEXTO
- Público: alunos do Curso Profissional Técnico de Eletrónica, Automação e Computadores (TEAC), 15–18 anos, com bases de eletrónica e Arduino e iniciantes em programação web.
- Módulo: M03 – Criação de Páginas Web.
- Ligação à PAP: cada aluno desenvolve um projeto de PAP com Arduino (estufa inteligente, alarme, estação meteorológica, etc.). Na sebenta, o fio condutor é o website "Clube Web"; nesta aplicação passa a ser o **website do projeto de PAP**, com 3 páginas: `index.html` (painel de controlo), `projeto.html` (sobre o projeto) e `contacto.html`.

# OBJETIVO
Desenvolve uma aplicação web interativa, num único ficheiro index.html, chamada **Portal da minha PAP**: um laboratório virtual de eletrónica e programação onde o aluno percorre a sebenta missão a missão. A área de trabalho principal do portal chama-se **Bancada Digital**: é lá que está o Arduino simulado e onde cada conceito de HTML, CSS ou JS tem uma consequência visível. No fim, o aluno exporta um website real e reutilizável na PAP.

# NARRATIVA
O aluno entra como "Estagiário/a" numa startup de IoT instalada no laboratório da escola. Na bancada está um Arduino Uno montado, mas "sem cara": não existe interface para o controlar. A mentora técnica, a "Eng.ª Ohm", fala em estilo terminal e atribui ordens de trabalho. A progressão de carreira é Estagiário → Técnico → Técnico Especialista → Engenheiro de Sistemas → Arquiteto IoT, com uma mudança de nível em cada setor concluído.

# ESTRUTURA DE MISSÕES (alinhada com a sebenta)

## SETOR 1 — ALIMENTAÇÃO · HTML (cap. 01–08)
| # | Missão | Sebenta | Conteúdos | Ligação à bancada |
|---|---|---|---|---|
| 01 | Arrumar a bancada | cap. 01, p. 3 | página vs. website; estrutura `meu_site/`, `css/`, `js/`, `imagens/`; nomes sem espaços nem maiúsculas | O aluno arrasta ficheiros para as pastas certas (ex.: `index.html.txt` é rejeitado) |
| 02 | Ligar a alimentação | cap. 02, p. 4 | DOCTYPE, `html lang="pt"`, head, meta charset, viewport, title, body | O LED "ON" do Arduino acende |
| 03 | Ler o esquema | cap. 02, p. 5 | tag, atributo, elemento, elementos vazios, encaixe, comentários | "Encontra o erro": tags mal encaixadas provocam uma animação de "curto-circuito" |
| 04 | Ficha técnica | cap. 03, p. 6–8 | h1–h6, p, br, hr, strong, em, mark, small, sub, sup, div, span | Tensões e potências com sub/sup: V<sub>CC</sub>, 10<sup>3</sup> Ω |
| 05 | Datasheets e ligações | cap. 03, p. 9–12 | ul/ol/li, `a href`, âncoras `#id`, `target` + `rel="noopener noreferrer"`, mailto, img + alt + width/height, caminhos relativos e `../` | Passos de montagem em ol; ligação a datasheets; **Mini projeto 1** (página do técnico) |
| 06 | Lista de material (BOM) | cap. 04, p. 13–14 | table, caption, thead, tbody, tfoot, tr, th `scope`, td, colspan, rowspan | Tabela de componentes com o custo total no tfoot |
| 07 | Painel de configuração | cap. 05, p. 15–17 | form, label for/id, input (text, email, number min/max, radio, checkbox), select/option, textarea, `button type="button"`, required | Limiar de temperatura, modo auto/manual (radio), pino (select) |
| 08 | Arquitetura semântica | cap. 06, p. 18–19 | header, nav (aria-label), main, section, article, aside, footer | **Mini projeto 2**: as 3 páginas do website da PAP interligadas |
| 09 | Demonstração em vídeo | cap. 07, p. 20 | audio/video com controls, source, transcrição, track (WebVTT) | Vídeo de demonstração da PAP e som do buzzer |
| 10 | Janela para o simulador | cap. 08, p. 21 | iframe com title, sandbox, loading="lazy" | O preview do aluno é ele próprio um iframe sandbox, e isso é explicado ao aluno |

## SETOR 2 — PLACA DE CIRCUITO · CSS (cap. 09–15)
| # | Missão | Sebenta | Conteúdos | Ligação à bancada |
|---|---|---|---|---|
| 11 | Primeira camada de tinta | cap. 09, p. 22–23 | inline, interno, externo (`link` para `css/estilo.css`); seletor, propriedade, valor, declaração; comentários; F12 | "Corrige o código": `p { color: blue font-size: 18px; }` |
| 12 | Selecionar componentes | cap. 10, p. 24–25 | elemento, `.classe`, `#id`, múltiplos, descendente; cascata, especificidade, herança | Mecânica ao estilo CSS Diner: a breadboard tem `.led`, `.resistencia`, `#arduino`, `nav a`… e o seletor escrito faz brilhar os componentes selecionados |
| 13 | Painel legível | cap. 11, p. 26 | color, font-family, font-size, font-weight, line-height, text-align; px vs. rem; contraste e foco visível | Teste automático de contraste AA |
| 14 | Fundos e dimensões | cap. 11, p. 27 | background-image (url relativo ao CSS), cover/contain, width, max-width, min-width, `margin: 0 auto` | Fotografia da montagem como capa |
| 15 | Cartões de sensores | cap. 11, p. 28 | margin, padding, border, border-radius; classe `cartao` | **Mini projeto 3**: identidade visual comum às 3 páginas |
| 16 | Raio-X da caixa | cap. 12, p. 29 | box model; content-box vs. border-box (284 / 304 / 260 px) | Puzzle de medição: o aluno prevê a largura total antes de ver as camadas desenhadas |
| 17 | Barra de LEDs | cap. 13, p. 30–31 | display flex, flex-direction, justify-content, align-items, gap, flex-wrap, `flex: 1 1 220px`, `>` | Alinhar LEDs e o menu; trocar row por column muda o eixo |
| 18 | Grelha do dashboard | cap. 14, p. 32 | display grid, grid-template-columns, repeat, fr, gap | "Qual será o resultado?": 5 cartões em 3 colunas |
| 19 | Painel no telemóvel | cap. 15, p. 33–35 | viewport, imagens fluidas, @media max/min-width, mobile first (600 / 960 px), overflow-x numa tabela | **Mini projetos 4 e 5**; "Ficha de teste do aluno" (360 / 768 / 1200 px, zoom 200%, teclado) com um seletor de largura no preview |

## SETOR 3 — FIRMWARE DO BROWSER · JAVASCRIPT (cap. 16–17)
| # | Missão | Sebenta | Conteúdos | Ligação à bancada |
|---|---|---|---|---|
| 20 | Primeiro firmware | cap. 16, p. 36 | `script` no fim de body (ou defer), function, onclick (apenas nesta missão), consola F12, maiúsculas/minúsculas | Um botão faz o Arduino responder no Monitor Série |
| 21 | Leituras de sensores | cap. 16, p. 37 | const/let, string/número/booleano, operadores, `===`, `"12" + 1` vs. `Number()` | A porta série entrega texto: o aluno converte "23.5" para número antes de calcular |
| 22 | Lógica de alarme | cap. 16, p. 38 | if/else; function com parâmetros e return | `calcularCorrente(tensao, resistencia)` (lei de Ohm); se a temperatura passar o limiar, o LED vermelho acende |
| 23 | Controlo pelo DOM | cap. 17, p. 39 | getElementById (sem #), querySelector, textContent, addEventListener (função sem parênteses), verificação `if (botao && mensagem)` | O painel mostra o estado do Arduino |
| 24 | LED ligado/desligado | cap. 17, p. 40 | classList.toggle, alterar src/alt de uma imagem | A classe `.aceso` no CSS liga o LED virtual (o JS muda a classe e o CSS define o aspeto) |
| 25 | Detalhes técnicos | cap. 17, p. 41 | hidden, aria-expanded, aria-controls, `!` | Mostrar ou esconder o esquema elétrico |
| 26 | Configurar o Arduino | cap. 17, p. 42 | evento submit, preventDefault, `.value.trim()`, `role="status"` | O formulário da missão 07 envia a configuração ao Arduino simulado. **Mini projeto 6**; desafio: contador de pulsos com botão Repor (p. 50) |

## SETOR 4 — PROVA DE BANCADA (cap. 18–23)
| # | Missão | Sebenta | Conteúdos |
|---|---|---|---|
| 27 | Caça ao bug (boss) | cap. 19, p. 45 | Desafios A–E em sequência cronometrada; o "bug" só é derrotado com o Protocolo de Diagnóstico (p. 46) |
| 28 | Projeto final da PAP | cap. 18 e 21, p. 43–48 | Os 14 passos do projeto progressivo (p. 43) como checklist; os requisitos obrigatórios (p. 47); a lista de verificação antes da entrega (p. 48); exportação em ZIP com README |

## MISSÕES BÓNUS (fora da sebenta — assinaladas "EXTENSÃO")
- B1 Sequência "Knight Rider": ciclos for.
- B2 Histórico de leituras e gráfico em tempo real: arrays e setInterval, em paralelo com loop() do Arduino.
- B3 LED a piscar só com CSS: @keyframes e transition.
- B4 Ligar o Arduino real: Web Serial API (Chrome/Edge), com fallback para o simulador.
- B5 Publicar o website: GitHub Pages.

# MECÂNICAS DE APRENDIZAGEM (retiradas da sebenta)
- **Tipos de desafio**, cada um com interface própria:
  - *Completa o código*: espaços em branco editáveis dentro do código.
  - *Encontra o erro*: clicar na linha errada e depois corrigi-la.
  - *Qual será o resultado?*: o aluno regista uma previsão antes de executar e ganha XP extra se acertar.
  - *Corrige o código*.
  - *Modifica o exemplo*.
- **Caixas de aprendizagem** como componentes visuais consistentes: Dica / Boa prática (verde), Atenção / Erro frequente (âmbar), Experimenta tu (ciano), Desafio (magenta).
- **Diário de bordo**: em cada desafio o aluno regista previsão → resultado observado → explicação (método da p. 45). O diário pode ser exportado.
- **Protocolo de Diagnóstico** (p. 46) como sistema de pistas, por esta ordem: 1. Guardaste? 2. Página e pasta certas? 3. Caminhos e nomes? 4. Lê a consola. 5. Inspeciona os estilos. 6. Reduz o exemplo.
- **Fichas rápidas de consulta**: as tabelas do fim de cada capítulo ficam acessíveis no painel "Datasheet" da missão.
- **Soluções comentadas** (p. 49–50): só ficam disponíveis depois de 2 tentativas, ou com custo de XP.

# SIMULAÇÃO
- **p5.js em instance mode** para a bancada: breadboard, Arduino Uno estilizado, fios em curvas Bézier, LEDs com glow, potenciómetro arrastável, sensor de temperatura e LDR com valores ajustáveis, buzzer (Web Audio API) e servo animado.
- **Arduino virtual em JS** (objeto `board`) com digitalWrite, analogWrite, digitalRead, analogRead e um Monitor Série com timestamp. A bancada reage ao estado do DOM do aluno (classes, textos, valores de formulário) através de observadores, para o aluno usar apenas o JS da sebenta (DOM e eventos).
- Opcional: **@wokwi/elements** (`<wokwi-led>`, `<wokwi-pushbutton>`) na missão 03, para mostrar que "uma tag pode ser um componente".
- **Preview** do website do aluno num iframe com sandbox e `srcdoc`, atualizado ao vivo (debounce de 300 ms), com navegação entre as 3 páginas virtuais e seletor de largura (360 / 768 / 1200 px).

# GAMIFICAÇÃO (Octalysis)
1. **Significado:** o produto final é o website real da PAP do aluno.
2. **Progresso:** XP, níveis de carreira, progresso por setor e uma árvore de competências desenhada como um esquema elétrico (os nós concluídos "acendem").
3. **Criatividade e feedback:** "Modo Protótipo" livre, sem testes; feedback imediato na bancada.
4. **Posse:** inventário de componentes desbloqueados por missão (resistência, LED RGB, LDR, servo…), utilizáveis no Modo Protótipo; temas do IDE personalizáveis.
5. **Social:** ranking por turma desligado por defeito; desafios cooperativos ("a turma acende 100 LEDs"); um "cartão de técnico" exportável.
6. **Escassez:** "Desafio do dia" com um desafio da p. 45; missões bónus só abrem depois de concluir o setor.
7. **Curiosidade:** bugs aleatórios na bancada para diagnosticar; easter eggs no terminal.
8. **Perda (uso moderado):** pistas com custo de XP (a pista 1 é grátis); a série de dias seguidos apenas bonifica, nunca castiga.
- **Emblemas:** "Primeiro Blink", "Encaixe Perfeito", "Mestre do Box Model", "Grid Master", "Mobile First", "Zero Erros na Consola", "Caçador de Bugs", "Técnico Acessível".
- Sons e animações discretos, com opção de desligar.

# CONVENÇÕES DE CÓDIGO (iguais às da sebenta; os testes devem verificá-las)
- Estrutura `meu_site/` com `index.html`, `css/estilo.css`, `js/script.js` e `imagens/`, representada no explorador de ficheiros do IDE.
- HTML com `lang="pt"`, charset UTF-8 e viewport; um h1 por página; alt em todas as imagens (`alt=""` nas decorativas); label associado a cada campo; `type` explícito em todos os botões.
- CSS externo; sem `!important`; sem `user-scalable=no`; `box-sizing: border-box` global a partir da missão 16.
- JS externo no fim de body; const/let (nunca var); addEventListener a partir da missão 23; textContent (nunca innerHTML com dados do utilizador); verificação de null antes de associar eventos.
- Nunca pedir dados pessoais reais nem palavras-passe nos exercícios; o formulário só simula o envio, e isso está indicado de forma clara.

# STACK TECNOLÓGICA
- **p5.js** (simulação), por CDN (cdnjs ou jsDelivr).
- **CodeMirror 6** para o editor, com separadores `index.html | css/estilo.css | js/script.js` e realce de sintaxe e lint básico.
- **UI:** Tailwind CSS + DaisyUI (alternativa: Bootstrap 5.3 com `data-bs-theme`); justifica a escolha num comentário no topo do ficheiro.
- **Alpine.js** para o estado reativo da interface.
- **Chart.js** apenas para a missão bónus B2.
- **Web Serial API** apenas para a missão bónus B4.
- Persistência em localStorage, com try/catch e funcionamento normal sem ela.
- Fontes: JetBrains Mono (código) e Inter (interface; a mesma da capa da sebenta).

# LAYOUT — "IDE de especialista"
- **Barra de título:** logótipo e nome "Portal da minha PAP", seguidos do nome do projeto de PAP do aluno (editável). O `<title>` do documento é "Portal da minha PAP".
- **Barra de atividades:** Missões, Explorador de ficheiros, Inventário, Árvore de Competências, Datasheet (sebenta), Diário de bordo, Definições.
- **Centro:** editor com separadores de ficheiros.
- **Direita:** em cima o Preview (iframe e seletor de largura); em baixo a Bancada (canvas p5.js).
- **Painel inferior:** Terminal da Eng.ª Ohm (briefing, caixas de aprendizagem, pistas), Consola, Monitor Série, Testes (✔/✖ com mensagens pedagógicas e a referência à página da sebenta).
- **Barra de estado:** nível, XP, porta (SIM / COM3), botão ▶ "Compilar e Carregar".
- **Paleta:** grafite #0d1117, verde PCB #1f8f4e, cobre #c47a3a, ciano #22d3ee, âmbar #f59e0b; existe também um tema claro.
- **Responsivo:** em ecrãs pequenos os painéis passam a separadores. Atalhos: Ctrl+Enter executa; Ctrl+H pede pista.

# AVALIAÇÃO E MODO PROFESSOR
- Testes automáticos por missão sobre o DOM, o CSS calculado (getComputedStyle) e o estado do `board`.
- No fim de cada setor, um mini-quiz de autoavaliação com 5 perguntas baseadas nas fichas rápidas.
- **Modo Professor** (PIN numa constante):
  - desbloquear missões, repor o progresso;
  - exportar JSON/CSV com missões, XP, tentativas, pistas, previsões certas e tempo;
  - aplicar a grelha de avaliação da sebenta (p. 48): Estrutura HTML 25%, CSS 20%, Responsividade 20%, JavaScript 15%, Acessibilidade e qualidade 10%, Testes e explicação 10%.
- Sugestão de dinâmica de aula (p. 51): demonstração curta → prática acompanhada → verificação autónoma.
- "Exportar o meu website": ZIP com a estrutura `meu_site/` e um README com o título "Portal da minha PAP – [nome do projeto]" (tema, como abrir, funcionalidades, fontes das imagens, limitações), como pede a p. 48.

# REQUISITOS TÉCNICOS
- Um único index.html autocontido (bibliotecas só por CDN), com código modular e comentado em PT-PT: dados das missões (array JSON editável pelo professor), motor de testes, motor de gamificação, simulação e UI.
- O código do aluno corre isolado em iframe sandbox, com proteção contra ciclos infinitos.
- Acessibilidade: contraste AA, navegação por teclado, aria-labels, prefers-reduced-motion.
- Desempenho: 60 FPS num portátil escolar; o canvas pausa quando não está visível.

# ENTREGA
1. Resumo da arquitetura e da escolha de framework.
2. O index.html completo, com as missões 01, 02, 12, 16, 23, 24 e 26 totalmente implementadas (uma de cada mecânica principal) e as restantes estruturadas no array de dados (briefing, referência à sebenta, código inicial, testes, pistas, caixas de aprendizagem).
3. Sugestões de evolução: multijogador em sala, avr8js para compilar código Arduino real, exportação SCORM para Moodle.

# CRITÉRIO DE QUALIDADE
Deve parecer uma ferramenta profissional e não um jogo infantil. Cada missão remete para a sebenta, cada conceito tem uma consequência física visível na bancada, e o aluno termina com o website da sua PAP pronto a entregar.