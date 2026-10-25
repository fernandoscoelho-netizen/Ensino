# Verificação — CTE AERT3 Missão Web

Verificações realizadas em 23–24/10/2026 no ambiente de criação Windows e navegador integrado do Codex.

## Resultados confirmados

- Build de produção Vite concluído sem erros.
- Servidor HTTP local respondeu 200 e a página abriu com Three.js ativo e sem erros de consola no carregamento.
- 10 testes Node passaram: 18 desafios + final e IDs únicos; percursos da entrada às seis estações e dois laboratórios; colisões com paredes e escadas; dois lugares válidos de construção por sala com duplicações bloqueadas; validação do progresso e importações inválidas; instrumentação sintática das soluções e interrupção de ciclos/recursão.
- 82 verificações de navegador passaram. Para cada desafio e projeto final, a solução de referência e uma variante equivalente foram aceites e o código inicial incompleto foi recusado. Os sete desafios responsivos foram testados a 800px e 360px.
- O relatório JSON inclui os critérios e os resultados de cada execução. Os erros esperados nos códigos iniciais fazem parte dos testes e não significam falha do jogo.
- Dois ciclos infinitos comuns e recursão sem fim produziram erros recuperáveis. Uma tentativa de modificar parent.document no iframe foi bloqueada pela origem isolada.
- Percurso automático entrada → E2 observado no navegador, com chegada e indicação de interação. A navegação para E1 também foi exercitada. As restantes ligações foram verificadas pelo algoritmo de percursos nos testes Node.
- Uma missão HTML foi escrita no editor, verificada e registada como 1/18; a conclusão persistiu após abrir novamente o jogo. Alternância de 3D para 2D observada mantendo a missão concluída.
- Colocação de objeto exercitada na oficina. Objetos e inventário guardados no progresso.
- Exportação real do portal para Exposicao_CTE.zip. O arquivo contém index.html, style.css, script.js, logo-cte.png e rodape.png. Integridade CRC confirmada com zipfile; referências locais verificadas no HTML.
- Interface e editor observados com viewport 390×844. A largura total da página não excedeu o viewport. O editor adapta-se a uma coluna; a sua pré-visualização mantém a largura de teste e permite deslocação interna.
- Recursos institucionais completos na interface, nos créditos e na exportação. A planta está disponível como PDF e imagem com controlo de ampliação.

## Limites da verificação

Não foi realizado ensaio com alunos, auditoria formal de acessibilidade, avaliação pedagógica externa, teste em todos os navegadores ou medição de FPS num portátil escolar de referência. As opções de qualidade e vista 2D são disponibilizadas, sem promessa de uma taxa de fotogramas específica.

O teste de isolamento verifica uma tentativa direta de acesso ao documento principal; não é uma auditoria de segurança para código hostil. Os limites de execução cobrem ciclos e funções instrumentados, sem garantir contenção de qualquer operação nativa capaz de consumir memória.

As dimensões virtuais e a disposição do mobiliário são interpretativas. A comparação com a planta permite conferir a organização geral, sem equivaler a validação arquitetónica.

## Revisão da planta e equipamentos

Mapa e vista geral rodados 180°. Novo traçado de paredes e portas sobre a referência, com entrada, recorte de E3 e núcleo central. Degraus invertidos, agora com indicação SUBIR. Os testes incluem todas as ligações das seis salas e dois apoios, vãos sem parede sobreposta, duas portas do apoio 3.1, subida dos degraus e migração do progresso anterior sem perder competências ou código. O teste de inventário confirma os tipos de equipamentos das oito salas e a interação nos dois apoios. As quantidades gráficas são ilustrativas e não inventário certificado.
A visita ao apoio E6.1 e a abertura do painel de informação sobre CNC e impressão 3D foram verificadas no navegador após a revisão final. O JavaScript incorporado no HTML autónomo foi analisado sintaticamente com Acorn, sem erros. A abertura file:// não foi efetuada pelo navegador automatizado por restrição do protocolo; a versão HTTP foi verificada. O ZIP de entrega passou a verificação de integridade CRC.
## Leitura ampliada

Menus com 15–16px, nomes de salas com 17px e código com 16px. Instruções, pistas, feedback, botões e legendas foram ampliados, com espaçamentos ajustados e cartões reorganizados em ecrãs mais estreitos. A interface foi inspecionada em computador e a 390px, sem transbordo horizontal da página. Build de produção concluído após a alteração.

## Entrada, exploração ampla e câmara — 24/10/2026

- 13 testes Node passaram, incluindo os três novos testes de reposição da posição com preservação das missões e rascunhos, colisão e procura de percurso com a entrada bloqueada e controlos de órbita/inclinação/zoom com limites.
- No navegador, a resposta incompleta ao minidesafio foi recusada e a tag button correta destrancou a entrada. A navegação automática até E1 chegou à estação após destrancar a porta.
- Ao recarregar depois da visita a E1, o local voltou a ser Entrada do CTE e o minidesafio foi novamente apresentado no início da exploração.
- Durante o jogo, os cartões e a navegação lateral são substituídos por Menu e uma barra curta de salas. A área do mundo ocupou 608 dos 720px de altura no computador e 724 dos 844px no viewport móvel. Não foi observado transbordo horizontal da página; a barra de atalhos móvel desloca-se internamente.
- Vistas geral, superior, lateral, seguir aluno e primeira pessoa exercitadas no navegador, incluindo os botões de zoom e inclinação. Os rótulos flutuantes são ocultados em primeira pessoa para não taparem a visão.
- Sem erros de consola observados no carregamento e na exploração testada. Não se repetiram os 82 casos dos desafios curriculares, cujo código não foi alterado nesta revisão.
