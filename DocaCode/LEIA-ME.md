# DocaCode

Jogo educativo em 3D (three.js) para aprender **HTML, CSS e JavaScript** numa zona industrial de armazéns, cargas e descargas.

- O aluno escreve código ou arrasta blocos, e o código constrói o cenário: cais, camiões, paletes, estantes, empilhadores e armazéns surgem animados.
- 39 níveis que seguem a sebenta «Criação de Páginas Web»: HTML (estrutura, avisos com strong/em, listas ul/ol, tabelas, formulários, tags semânticas e links), CSS (seletores e cascata, box model, flexbox, grid, media queries mobile first), JavaScript (variáveis, operadores, funções, if/else) e DOM (getElementById, eventos de clique, classList.toggle, submit com preventDefault).
- Exercícios ao estilo da sebenta: «Qual será o resultado?», «Encontra o erro», «Completa o código», «Corrige o código», com caixas de Boa prática, Atenção e Experimenta tu.
- Zona industrial (projeto) e 5 desafios extra (ciclos, arrays, `filter`, `setInterval`, `sort`).
- Abertura animada (voo sobre a zona industrial até ao armazém) e janela de identificação do aluno (nome, turma, número) com as competências trabalhadas.
- Classificação final em **200 pontos**: níveis 1–28 valem 5 pontos (140) e níveis 29–34 valem 10 (60). Dica −25%, parte da solução −50%, solução completa −80% do valor do nível. Os desafios extra (35–39) valem até 10 pontos cada e só recuperam pontos perdidos com ajudas, até 200.
- Validação rigorosa: elementos repetidos, ordem errada, elementos fora do contentor certo ou HTML inválido não dão o desafio como concluído, e o aluno vê qual é o objetivo que falta.
- Desafios concluídos ficam bloqueados (só consulta) e não é possível saltar para níveis ainda fechados. Cada nível mostra o «ponto de partida no pátio», que é o que o botão Repor repõe.
- Ficha do jogador (cartão no topo): alterar identificação, descarregar a folha de validação e «Recomeçar tudo» (apaga a classificação; pede o código do professor).
- Folha de validação em PDF, numa só página A4, com a classificação, os pontos por nível, as ajudas usadas e um código de verificação.
- Cenário vivo: camiões a entrar e sair pelo portão, operários em corredores pedonais, camionista a entrar no cais, painéis com números a mudar.
- Estrelas e patentes; o progresso fica guardado no navegador.
- Funciona no computador e no telemóvel. Precisa de ligação à Internet para carregar o three.js (CDN jsDelivr).

Abrir: `index.html`

## Materiais

- **Caderno de missões do aluno** (`DocaCode_Enunciado_Aluno.pdf`, 27 páginas A4): como jogar, ecrã do jogo com legenda, regras e pontuação, um cartão por desafio (missão, «Aprende», boas práticas, erros frequentes, objetivos e espaço para registo), tabela «O meu percurso» e cábula de uma página. Não tem dicas nem soluções.
- **Manual do professor** (modo de exploração, planificação, avaliação e as soluções comentadas dos 39 desafios): distribuído à parte e não publicado neste repositório, porque contém as soluções e o código do professor.

Limitação conhecida: o progresso fica guardado no navegador (localStorage). Um aluno que apague os dados do navegador recomeça do zero, e quem souber editar o localStorage pode alterá-lo. O código de verificação da folha PDF ajuda a detetar alterações, mas não é uma assinatura segura.
