# CTE AERT3 — Missão Web

Jogo educativo em português de Portugal: avatar em 3D, mapa 2D equivalente, 18 desafios de HTML/CSS/Grid/Flexbox/JavaScript e um projeto final. Inclui Three.js, p5.js, Bootstrap, os recursos institucionais fornecidos e a planta original.

## Jogar

Na versão publicada, abre o endereço do jogo e escolhe **Começar a exploração**. A publicação no Sites não foi concluída: o envio ao repositório foi bloqueado pela revisão automática de aprovação do ambiente. Usa a cópia local distribuída.

A forma mais simples de jogar é abrir `Jogo_CTE_AERT3.html` no navegador. Esta versão autónoma inclui o código, as imagens, os logótipos e a planta num único ficheiro. A abertura direta como ficheiro não pôde ser verificada pelo navegador automatizado, que só permite HTTP/HTTPS; a distribuição HTTP foi verificada.

Como alternativa, na cópia distribuída serve a pasta `jogo` por HTTP. Por exemplo, com Python 3:

```sh
cd jogo
python -m http.server 8787 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8787`. No Windows, `py -m http.server 8787 --bind 127.0.0.1` também funciona quando o lançador Python está instalado. Não abras o index.html do jogo diretamente com file://, porque os módulos e os recursos precisam de HTTP. Depois do build, não há dependências de CDN nem serviços externos em tempo de execução.

Em cada início de sessão, o avatar aparece no vestíbulo da entrada. Um minidesafio pede que completes a tag de um botão HTML para destrancar a porta. A entrada fica bloqueada em 2D, 3D e nos percursos automáticos até a resposta estar correta. Este aquecimento é separado das 18 missões e repete-se ao iniciar uma nova sessão; as missões concluídas e os rascunhos mantêm-se.

Durante a exploração, o mapa ocupa quase toda a janela. Os cartões grandes dão lugar a uma barra compacta com as seis salas. Usa **Menu** para aceder às missões, oficina, exposição, definições e créditos, ou regressar ao início.

## Controlos

- WASD ou setas: deslocação relativa à câmara.
- Q/R ou arrastar horizontalmente: rodar a vista.
- Arrastar verticalmente ou PageUp/PageDown: inclinar a câmara.
- Roda do rato, +/− ou botões no painel: aproximar/afastar.
- Shift + arrastar ou botão direito + arrastar: deslocar o enquadramento no plano.
- Ângulo de visão: escolher Visão geral, Seguir aluno, De cima, Lateral ou Primeira pessoa. O botão de reposição recupera a vista geral.
- E: interagir perto da estação; a tecla é configurável nas definições.
- M: mapa e planta. Escape: fechar painel ou pausar.
- Escolher uma sala nos cartões, no mapa ou no objetivo atual: seguir um percurso automático. Teclas de movimento interrompem o percurso.
- Entrada: regressar a uma posição segura.
- Vista 2D/3D: alternar mantendo posição e progresso. No modo 2D também podes clicar no mapa para indicar um destino.

## Para o professor

O percurso sugerido é E1 HTML, E2 CSS, E3 Grid, E4 Flexbox, E5 JavaScript e E6 integração. A identidade física das salas segue a informação fornecida pelo utilizador. A distribuição dos desafios web é uma proposta pedagógica do jogo.

Cada sala tem três desafios. Lê o conceito, edita o código real nos três separadores, executa e verifica. Os desafios responsivos são verificados a 800px e 360px. As pistas são graduais e a solução de referência fica disponível após a primeira tentativa. A consulta fica registada separadamente da conclusão. Não há penalização por erro nem cronómetro obrigatório.

O professor pode pedir ao aluno que explique as suas alterações antes de consultar uma solução. A conclusão local é formativa e editável pelo utilizador; não constitui prova de avaliação certificada ou mecanismo resistente a fraude.

A oficina tem dois lugares fixos por sala, com encaixe e rotação a 90 graus. A planta decorativa está disponível desde o início, o pedestal após uma missão e o ecrã após três. Permite desfazer e repor. Não se podem mover paredes ou bloquear a circulação.

O projeto final constrói um portal com HTML semântico, Grid, Flexbox e um filtro JS. O botão de exportação descarrega um ZIP com HTML, CSS, JS e as duas imagens. O portal exportado pode ser aberto diretamente após extração; os logótipos usam caminhos relativos.

O progresso, rascunhos e objetos ficam no localStorage deste navegador. A posição é registada durante a sessão, mas cada novo início coloca o avatar na entrada. Exportar/importar JSON permite mudar de equipamento. Importações inválidas são recusadas antes de substituir os dados. Exporta uma cópia antes de limpar dados do navegador.

## Desenvolvimento

Requer Node.js 20.19+ ou 22.12+ e npm ou pnpm.

```sh
cd codigo-fonte
npm install
npm run dev
npm test
npm run build
npm run preview
```

É fornecido pnpm-lock.yaml; com pnpm usa `pnpm install --frozen-lockfile`. Se o gestor pedir autorização para o script de instalação do esbuild, autoriza apenas esse pacote do registo oficial. A versão distribuída em `jogo` já está construída.

A correção `.local-compat.cjs` é exclusiva do executor Windows usado na criação: troca realpath.native e realpath assíncrono pela operação síncrona equivalente. Não é necessária numa instalação normal e não deve ser ativada automaticamente em outros ambientes.

## Estrutura editável

- `src/map.js`: salas, paredes, obstáculos, estações, zonas de construção, colisões e procura de percursos.
- `src/world.js`: Three.js, avatar, animação, porta de entrada, mapa 2D, minimapa e deslocação.
- `src/camera.js`: ângulos predefinidos, órbita, inclinação e zoom.
- `src/entry.js`: início da sessão e validação do minidesafio de entrada.
- `src/equipment.js`: modelos ilustrativos de computadores, robótica, instrumentos, automação, redes, CNC, impressão 3D e PCB.
- `src/missions.js`: enunciados, pistas, códigos iniciais e soluções.
- `src/validation.js`: critérios por DOM, estilos, dimensões e comportamento.
- `src/instrument.js`: análise sintática e inserção de limites em ciclos e funções.
- `src/sandbox.js`: pré-visualização isolada com CSP e comunicação validada pela janela e identificador da execução.
- `src/storage.js`: validação, importação e persistência.
- `src/zip.js`: exportação ZIP sem dependências adicionais.
- `src/main.js` e `src/style.css`: interface e ações.
- `src/qa.js`: verificações de navegador, disponíveis em `?qa=1`.
- `tests/core.test.js` e `tests/entry-camera.test.js`: testes de mapa, dados, instrumentação, início na entrada, bloqueio da porta e câmara.

## Fontes e estimativas arquitetónicas

Referência: «Planta Escola Rio Tinto - MOBILÍARIOS ALTERADO 15_09_2025.pdf», uma página. A planta original e a sua imagem renderizada estão em `public/assets`.

O mapa foi revisto por traçado visual sobre a imagem da planta (2468×1264 px), com coordenadas dos alinhamentos e vãos em `src/map.js`. A vista geral 3D, o mapa 2D e o minimapa estão rodados 180°; os rótulos do jogo mantêm-se legíveis. A referência recortada pode ser alinhada a 180° ou reposta na orientação original para leitura.

Os acessos preservam os lados observados: portas de E1/E2 na parede do corredor; E6/E5/E4 na ala esquerda; E3 no troço horizontal junto ao patamar; E6.1 no limite inferior; apoio 3.1 no limite superior e com ligação lateral a E3. O vestíbulo de entrada, o recorte de E3, a arrumação e o patamar central estão representados. As portas mostram folhas e arcos de abertura. A porta principal começa fechada e as folhas abrem após resolver o minidesafio. A modelação continua interpretativa: alturas, espessuras e perfis são estimados e a leitura de um PDF não certifica dimensões reais. O fator de 40 px por unidade é uma escala virtual de jogo.

As escadas têm 12 degraus de altura crescente desde o lado da entrada para o extremo oposto, com seta e indicação SUBIR. Não existe acesso a um piso superior.

### Identidade e equipamentos fornecidos pelo utilizador

| Sala | Cenário |
|---|---|
| E1 | Informática, com 22 computadores representados nas bancadas. |
| E2 | Robótica, com 8 braços ilustrativos identificados como Dobot. |
| E3 | Eletrónica, com 4 osciloscópios, 4 fontes e 4 multímetros. |
| E4 | Automação, com 6 painéis de treino e módulos de controlo genéricos. |
| E5 | Redes e computadores, com 3 bastidores e 14 computadores. |
| E6 | Apresentação de projetos, bancada em meia-lua, lugares sentados e ecrã de apresentação. |
| E6.1 | Apoio com 2 máquinas CNC e 2 impressoras 3D. |
| 3.1 | Apoio de produção de PCB com 4 equipamentos ilustrativos identificados como Bungard. |

As quantidades representadas são escolhas de composição do cenário, não um inventário real confirmado. CNC é a interpretação de “CNS” na mensagem do utilizador. Os modelos exatos dos equipamentos não foram indicados; os objetos não são réplicas de produto. As ilhas e bancadas seguem a disposição geral visível na planta. Os laboratórios de apoio têm painéis de informação ao aproximar o avatar e interagir.

As paredes são apresentadas em corte para permitir leitura do espaço. O avatar e as câmaras têm proporções de jogo. As escadas são um volume bloqueado de referência; não existe outro piso explorável. Este projeto não é BIM, levantamento técnico nem simulação certificada de acessibilidade ou evacuação.

Os recursos «Logo CTE Final.png» e «Rodape_Profissional_2025.png» foram fornecidos pelo utilizador e mantêm o desenho, a proporção e as cores. São mostrados na interface, nos créditos e no projeto final; o logótipo CTE também aparece na entrada virtual. A faixa completa é consultável e ampliável abrindo o ficheiro de imagem; não é recortada.

## Limites e verificação

Ver `VERIFICACAO.md` para os testes efetivamente realizados. Não foi feita medição de FPS num portátil escolar de referência; o desempenho depende da GPU e navegador. Existem opções gráficas e alternativa 2D.

A sandbox impede acesso direto ao DOM e armazenamento da aplicação e bloqueia recursos de rede na pré-visualização. O HTML é filtrado e JavaScript é instrumentado para limitar ciclos/recursão comuns. Não é um ambiente para executar código deliberadamente hostil ou esgotar memória com operações nativas. Erros de execução iniciais e verificações são apresentados; a pré-visualização pode ser parada e recriada. O suporte da primeira versão é JavaScript de script ES2022 sem imports, com JS no separador próprio. HTML com script/eventos inline é removido da pré-visualização.

O jogo não recolhe contas, nomes, emails ou telemetria. O alojamento pode gerir autenticação e os seus próprios registos técnicos. Não há componente de colaboração entre alunos em tempo real.

## Licenças

Three.js, Bootstrap, Vite, Acorn e acorn-walk: MIT. p5.js: LGPL-2.1; a sua distribuição e licença encontram-se em `licencas`. Recursos institucionais e planta: fornecidos pelo utilizador, sem nova licença concedida por este projeto. Antes de redistribuir para outros contextos, verifica os direitos dos recursos de origem.
