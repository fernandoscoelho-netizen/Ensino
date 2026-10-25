# CTE Online · AERT3

Jogo de exploração em 3D para aprender HTML, CSS (Flexbox e Grid) e JavaScript, passado no edifício do Centro Tecnológico Especializado do Agrupamento de Escolas de Rio Tinto n.º 3. Inclui também o jogo 2D «Missão Web» e os materiais de apoio.

## O que está nesta pasta

| Pasta | Conteúdo |
|---|---|
| `jogo/` | `cte-online-aert3.html`: o jogo completo num único ficheiro. Abre-se com duplo clique ou coloca-se no servidor da escola. |
| `documentos/` | `CTE-Online-Instrucoes.pdf` (instruções para alunos e professores), guia do professor da «Missão Web» em PDF e em Markdown. |
| `codigo/` | Código-fonte do CTE Online, dados da planta e ferramentas para voltar a gerar o jogo. |
| `missao-web/` | `missao-web.html`: o jogo 2D «Missão Web — Reconstruir a Escola Digital». |
| `kit-prompt/` | Prompt e materiais usados para pedir a criação do jogo 3D. O `espacos-cte.json` desta pasta é a versão provisória inicial; a versão atual é `codigo/dados/cte-planta.json`. |

## Usar na aula

1. Copie `jogo/cte-online-aert3.html` para os computadores ou para o servidor da escola.
2. Abra-o no Chrome, Edge ou Firefox. Funciona sem internet.
3. Siga `documentos/CTE-Online-Instrucoes.pdf`.

## Sobre a planta

O edifício é uma **interpretação** da planta de mobiliário (escala 1:100), não um modelo BIM nem uma conversão 3D exata. Medidas em planta lidas à escala e confirmadas com cotas; alturas, materiais e volumes que a planta não define são **estimativas editáveis**. Consolas, ecrãs de desafio, lâmpadas, caixas, impressora e sinalética (a âmbar) foram **acrescentados para o jogo**. As missões atribuídas às salas são **propostas pedagógicas**, não funções reais confirmadas. As escadas ficam fora da área de jogo: o piso superior não está documentado.

Cada elemento de `cte-planta.json` tem um campo `origem`: `medido`, `cota`, `observado`, `interpretado`, `estimado`, `derivado`, `ficcional` ou `proposta`.

## Alterar o jogo

Requisitos: Python 3. Para reler a planta: `pip install pymupdf numpy pillow`.

```
cd codigo
python3 build.py                        # gera cte-online.html e index.html a partir de src/ e dados/
python3 tools/construir_dados.py        # rele dados/planta-referencia.pdf e gera dados/cte-planta.json
python3 tools/verificar_sobreposicao.py # desenha os dados sobre a planta (pasta verificacao/)
```

- **Mudar alturas, portas, consolas ou missões para todos:** edite `codigo/dados/cte-planta.json` (ou os valores em `tools/construir_dados.py`, se for reler a planta) e corra `python3 build.py`. O ficheiro `index.html` gerado é o novo `cte-online-aert3.html`.
- **Testar uma alteração só num computador:** no jogo, Mapa 2D › Dados e origem › Aplicar alterações. Fica guardada apenas nesse navegador.

### Estrutura do código

| Ficheiro | Função |
|---|---|
| `src/01-data.js` | Lê os dados da planta e prepara salas, portas e consolas |
| `src/02-missoes.js` | Missões e níveis (32 níveis) |
| `src/03-motor.js` | Execução e verificação do código dos alunos (iframe isolado) |
| `src/04-mundo.js` | Cena 3D (Three.js): paredes, portas, janelas, mobiliário, efeitos |
| `src/05-ui.js` | Interface: consola, menu, relatório do professor |
| `src/07-mapa2d.js` | Mapa 2D, comparação com a planta, ligações e editor de dados |
| `src/06-arranque.js` | Arranque |
| `src/corpo.html`, `src/00-estilo.css` | Estrutura e estilos da página |
| `vendor/` | Three.js 0.160.0 (MIT) e Bootstrap 5.3.3 (MIT), logótipo e barra de financiamento |

## Créditos

Agrupamento de Escolas de Rio Tinto n.º 3. Planta: Escola Secundária de Rio Tinto, planta de mobiliário (Desigual, 15-09-2025). Operação cofinanciada: ver a barra de financiamento no jogo e nos documentos.
