# Verificação da Missão REENTRADA

Data: 27 de outubro de 2026.

## Verificado

- Preparação do projeto concluída com esbuild. Bibliotecas incluídas localmente.
- 10 testes automatizados passaram: controlo de ciclos e recursão, preservação de funções e texto, sintaxe inválida, estrutura ZIP, integridade do banco, sorteio, persistência e recusa de bancos inválidos.
- As soluções de referência dos 12 desafios passaram na interface do navegador integrado do Codex. Os pontos de partida das etapas 2–12 foram recusados antes de carregar as soluções; a etapa 1 também foi verificada com a estrutura inicial incompleta.
- Responsividade do desafio 7 medida exatamente a 1024, 768 e 375 px: três, duas e uma coluna, respetivamente, sem deslocamento horizontal.
- Interface geral observada a 375, 768 e 1440 px, sem deslocamento horizontal, incluindo fonte principal de 20 px e código de 18 px. Os valores base são 16 e 15 px.
- JavaScript testado com cliques, alternância de classes e as oito combinações dos três requisitos de reentrada.
- Ciclo infinito acidental interrompido no navegador. Acesso a parent.localStorage bloqueado pelo isolamento.
- Perguntas: resposta correta, resposta incorreta, aviso sem seleção, conservação da ronda e das respostas após recarregar, nova ronda sem repetição imediata.
- Exportação JSON com 12 etapas e histórico de perguntas. ZIP aberto e verificado com zipfile: 51 ficheiros, 12 index.html e respostas-perguntas.json; integridade sem erros.
- Modo 2D, fontes ampliadas e sequência final de amaragem observados no navegador.
- As 16 ligações de documentação dos desafios responderam com estado HTTP 200.

## Limites da verificação

- O iniciador principal foi simplificado: abre o index.html diretamente e deixou de depender de Node.js. A verificação da abertura file:// permanece limitada pela política do navegador integrado; a mesma versão clássica foi testada por HTTP.

- A revisão automática bloqueou o carregamento do ficheiro gerado pelos testes para comprovar a importação pela interface. O ficheiro foi inspecionado: contém apenas soluções de referência, notas vazias e respostas de teste. A estrutura do JSON foi inspecionada e a recuperação das rondas tem testes técnicos; a importação completa através do seletor de ficheiros permanece por confirmar.
- O carregamento de um banco personalizado pela interface não foi executado; a estrutura e a validação desse banco foram testadas em código.
- A entrega passou a ser exclusivamente local, por escolha do utilizador. Não há uma publicação online pendente.
- O arranque inicial do navegador autónomo falhou no ambiente Windows; a verificação funcional foi feita no navegador integrado.
- Não foram medidos FPS ou desempenho num computador escolar representativo. A alternativa 2D e as opções gráficas estão disponíveis.
- As respostas do questionário acompanham a aplicação. Nesta versão, as soluções de código e o guia são cifrados na distribuição dos alunos e apenas desbloqueados com a palavra-passe docente. A atividade continua a ser formativa.

## Repetir verificações técnicas

    node --test tests/unit.test.mjs tests/quiz.test.mjs tests/student.test.mjs

O guião opcional tests/browser-check.mjs requer Playwright instalado e um navegador compatível. Nesta entrega, esse guião não concluiu a execução; os resultados acima identificam separadamente os testes efetivamente realizados na interface.

## Atualização: abertura direta e música

- Preparada uma versão JavaScript clássica, com todas as bibliotecas incluídas, para abrir index.html diretamente. O modo com servidor é opcional.
- Iniciar-Missao.cmd simplificado para abrir o index.html sem Node.js.
- Música ambiente original com ativação manual, volume e pausa ao ocultar a página.
- O navegador integrado do Codex recusa navegação file:// por política de segurança. A abertura direta nesse protocolo não foi confirmada por este navegador; os testes adicionais da mesma versão são feitos por HTTP. Não foi tentado contornar a restrição.

## Identificação e ambiente 3D

- 14 testes técnicos aprovados, incluindo limpeza da identificação, campos mínimos, comparação de alunos e nomes de ficheiro seguros.
- Identificação obrigatória testada no navegador: nome e turma recusam submissão em branco; número opcional. Dados de teste apresentados no cabeçalho e no registo.
- Exportações efetivas descarregadas e inspecionadas: nomes dos ficheiros com aluno, turma e número; JSON com identificação e datas; ZIP íntegro com identificacao.json e LEIA-ME identificado.
- Abertura Three.js observada com cápsula modelada, Terra e estrelas; estado final pronto para entrar.
- Painel com instrumentos ligados ao progresso e alternância de vista exterior implementado e observado.
- Música testada: início por clique com contexto de áudio ativo, parar e voltar a ligar, volume zero, conservação do volume e ausência de reprodução automática após recarregar.
- A mudança de separador simulada pelo navegador integrado não confirmou a pausa automática; o evento visibilitychange está implementado para a ocultação real da página.

- Reabertura confirmada com os dados do aluno preenchidos; botão Saltar animação testado.
- Formulário de entrada verificado a 375 px sem deslocamento horizontal; vista exterior com cápsula completa e sem erros de consola no navegador.

## Proteção da área do professor

- 19 testes técnicos aprovados, incluindo palavra-passe correta, recusa de palavra-passe errada, deteção de alterações no conteúdo cifrado, validação da configuração e ausência de soluções nos desafios públicos.
- Confirmado no navegador: o menu pede palavra-passe; uma senha errada é recusada; a correta desbloqueia soluções e ferramentas; fechar a área remove os blocos de solução e a abertura seguinte volta a exigir autenticação.
- Implementado bloqueio manual, ao fechar, ao ocultar a página e após cinco minutos de inatividade. O intervalo completo de cinco minutos não foi aguardado neste teste.
- A distribuição dos alunos contém apenas a aplicação e os recursos públicos. As soluções e o guia são cifrados; a senha e o código-fonte docente ficam no pacote privado do professor.
- Esta proteção é adequada ao controlo da interface numa atividade formativa local. Não impede a alteração deliberada de ficheiros ou da lógica da aplicação por quem controla o computador.

- Bloqueio manual confirmado no navegador; a solução continua a poder ser carregada pelo professor autenticado e o desafio foi validado após esse carregamento.

## Consola animada — 28 de outubro de 2026

- Instrumentos HTML/SVG locais: altitude, velocidade e variação vertical; horizonte artificial; indicadores de oxigénio e energia com agulhas; pressão, temperatura, órbita e curva de sinal. Valores simulados com oscilações suaves e limites definidos.
- Confirmado no navegador: alterações nas leituras e gráficos, fixação das leituras estável entre observações, retoma da atualização, iluminação, autoteste em curso e concluído, recolher/expandir e vista exterior. O autoteste e os botões não alteraram o progresso real.
- Confirmados modo 2D com fundo alternativo, movimento reduzido com relógio e leituras imóveis e regresso à vista 3D.
- Verificadas apresentação normal e largura de 375 px, incluindo comandos móveis; sem deslocamento horizontal da página. A lista de etapas mantém a deslocação horizontal própria em ecrãs pequenos.
- Corrigida sobreposição de fundo que mostrava duas Terras; o fundo 2D é ocultado quando o cenário 3D está disponível. Proporções do canvas passam a usar a área real de desenho.
- 19 testes técnicos voltaram a passar. Repetidos na interface: recusa de senha incorreta, desbloqueio correto e novo bloqueio ao fechar, sem soluções retidas no diálogo. Nenhum aviso ou erro de consola observado neste teste.
- A animação é pausada quando a consola fica fora da área visível, ao ocultar a página e durante a identificação inicial. A lógica foi implementada; a ocultação real do separador não foi reproduzida pelo navegador integrado.
- O teste da aplicação clássica foi feito em HTTP local. Mantém-se a limitação já registada de confirmação direta de file:// no navegador integrado.
