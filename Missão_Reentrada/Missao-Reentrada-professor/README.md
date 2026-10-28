# Missão REENTRADA

Atividade de HTML, CSS e JavaScript para TIC MO3 / TEAC.

## Abrir sem instalar nada

1. Descompactar todo o ZIP.
2. Fazer duplo clique no index.html da pasta principal.
3. Identificar o aluno com nome, turma e número opcional.
4. Utilizar a missão no navegador. Manter a pasta dist junto desse ficheiro.

Iniciar-Missao.cmd abre o mesmo index.html. A versão local não necessita de servidor nem Node.js. Bibliotecas, sebenta, perguntas e música ambiente estão incluídas. A documentação externa precisa de Internet. A gravação de páginas file:// varia entre navegadores: exportar o progresso no fim de cada sessão.

## Música ambiente

O botão Música liga a composição generativa original «Órbita tranquila». O volume encontra-se nas Preferências e começa em 20%. A música não começa automaticamente e pausa ao ocultar o separador. O som de confirmação é um controlo independente. Não há ficheiros de áudio externos nem transmissão de música.

## Alterar o código-fonte

Só para desenvolvimento, utilizar Node.js 20 ou posterior:

    pnpm install
    pnpm build

A preparação gera uma versão JavaScript clássica em dist/assets/local.js e o index.html principal, para abertura direta. Conserva também uma versão com módulos ES em dist para alojamento Web. dependencies-resolved.json regista as versões utilizadas.

## Servidor opcional

Servidor-Opcional.cmd ou node server.mjs iniciam a versão Web em http://127.0.0.1:4173. Parar-Missao.cmd encerra o servidor iniciado pelo auxiliar. O servidor é uma alternativa para redes e desenvolvimento.

## Organização

- src/app.js: aplicação e persistência.
- src/ambient-music.js: composição espacial com Web Audio.
- src/challenges.js: 12 desafios, pistas, soluções e referências.
- src/questions.json e quiz.js: banco de 48 perguntas e rondas aleatórias.
- src/lesson-checks.js, preview.js e runner.js: execução e validação.
- src/space.js: vista 3D original da Terra e modo 2D.
- src/cockpit.js: instrumentos SVG animados e comandos da consola.
- docs/guia-professor.html: guia, avaliação e soluções.
- docs/VERIFICACAO.md: testes e limitações.

## Verificações técnicas

    node --test tests/teacher-auth.test.mjs tests/unit.test.mjs tests/quiz.test.mjs tests/student.test.mjs

Os resultados do navegador estão descritos no relatório. A aplicação é formativa. O pacote dos alunos inclui os desafios e as respostas do questionário; as soluções de código e o guia docente são cifrados e exigem a palavra-passe do professor.

## Identificação e registo

Ao abrir, a missão pede nome e turma, com número opcional. Os dados ficam no progresso local e acompanham a exportação. Os nomes dos ficheiros JSON e ZIP incluem aluno, turma e número. O ZIP contém identificacao.json, os dados da sessão e um LEIA-ME identificado. Em computadores partilhados, uma identificação diferente permite corrigir apenas os dados ou começar nova missão, com opção de exportar o trabalho anterior. Não existe registo central. A identificação do aluno é local; apenas a área do professor exige palavra-passe.

## Ambiente 3D

A abertura apresenta uma aproximação à cápsula Aurora em Three.js durante cerca de quatro segundos, com opção Saltar animação. O cabeçalho inclui estrelas em movimento, a Terra, estrutura de cabine e instrumentos associados ao progresso. O botão Vista exterior mostra o modelo 3D da cápsula. Movimento reduzido e modo 2D continuam disponíveis. Todas as geometrias e texturas são locais e originais.

## Distribuição e palavra-passe do professor

Distribuir apenas missao-reentrada-alunos.zip. O pacote do professor contém código-fonte, guia e os dados privados de acesso; deve ficar com o docente. A área docente é bloqueada por palavra-passe, com soluções e guia cifrados no pacote dos alunos. Ao fechar a área ou após cinco minutos sem interação, volta a bloquear.

A palavra-passe de distribuição está em private/teacher-access.json. Para a alterar, editar esse ficheiro e executar a preparação. Não distribuir esse ficheiro aos alunos. A senha não é gravada no progresso dos alunos. A proteção local não é resistente à alteração deliberada dos ficheiros ou da lógica da aplicação.

## Consola de bordo — versão de 28 de outubro de 2026

O novo painel apresenta altitude, velocidade orbital, variação vertical, horizonte artificial (roll e pitch), oxigénio, energia, pressão, temperatura, trajetória orbital e um gráfico de sinal. Os valores oscilam suavemente e são explicitamente simulados; não constituem um modelo físico de reentrada nem alteram o progresso das etapas.

- Luz de cabine: alterna a iluminação da consola.
- Fixar leituras / Retomar leituras: suspende ou retoma a telemetria e os gráficos.
- Autoteste: executa uma sequência cenográfica curta e apresenta o resultado.
- Recolher / Expandir painel: libera espaço para o laboratório.
- Vista exterior / Vista da cabine: alterna a cápsula e a estrutura de observação em Three.js.

As animações pausam fora da área visível e quando a página está oculta. Reduzir movimento mantém os instrumentos estáticos; o modo 2D conserva o painel. O progresso real continua ligado apenas à validação dos desafios. O desenho é original e inspirado em instrumentação espacial, sem afiliação à SpaceX.

Para atualizar, extrair o pacote dos alunos para uma pasta nova. Não juntar os ficheiros antigos do pacote completo à distribuição dos alunos.
