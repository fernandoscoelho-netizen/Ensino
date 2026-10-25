# Missão Web — Escola Digital

Jogo educativo em português europeu, sem backend, com 5 missões e 16 desafios reais de código.

## Abrir

A versão publicada é privada por predefinição. Para utilização local, abra `dist/index.html` num navegador moderno. Para uma origem HTTP estável, pode servir a pasta `dist` com qualquer servidor estático; por exemplo, se tiver Python: `python -m http.server 8080 --directory dist`. Abra depois `http://localhost:8080`.

Não são necessários npm, Bootstrap ou p5.js. Os desafios usam o motor real de HTML/CSS do navegador. O desenho da escola é CSS. As fontes Google são opcionais e têm alternativas locais.

## Percurso

1. Biblioteca: título e parágrafo; listas e ligações; estrutura semântica e imagem acessível.
2. Ponto de encontro: alinhamento Flexbox; menu com grupos; quebra de linha e flex-basis.
3. Mural: colunas Grid; elemento em destaque; media query testada a 320 e 480 px.
4. Loja: multiplicação; percentagens; evento click, conversão numérica e DOM.
5. Secretaria: formulário HTML; validação personalizada; cálculo com limites; projeto final integrador.

## Uso pedagógico

Cada missão combina exploração, código parcialmente preparado e construção. Os alunos podem aceder a qualquer missão. São atribuídos 100 XP por desafio, sem pontos repetidos. As pistas não retiram pontos; consultar a solução fica registado.

Sugestão por aula: 10 min de exploração, 25 min de trabalho a pares e 15 min de explicação e transferência. Peça uma alteração nova antes de considerar o conceito consolidado. Os testes verificam requisitos concretos e não substituem a avaliação docente.

O botão “Exportar progresso” descarrega um relatório TXT com estado, pistas, soluções consultadas e código atual. O progresso é guardado em localStorage, exclusivamente no navegador e origem utilizados. O relatório não é um mecanismo de importação. Não existe painel central de turma nem sincronização entre dispositivos.

## Adaptar

- `dist/challenges.js`: enunciados, código inicial, soluções, pistas e testes.
- `dist/app.js`: editor, pré-visualização, validação, progresso e relatório.
- `dist/style.css`: apresentação e adaptação a ecrãs.
- `dist/index.html`: interface.
- `dist/livro.svg`: imagem local para a biblioteca.

Os testes são executados num iframe com sandbox `allow-scripts`, sem acesso à aplicação principal. O código de cada desafio corre em contexto novo. Testes de JS verificam diferentes entradas, incluindo limites e inválidos. O jogo é para código educativo curto: um ciclo infinito pode bloquear o separador. Como em qualquer aplicação local, o progresso pode ser alterado pelas ferramentas de programador e não deve servir de prova de avaliação formal.

## Verificação efetuada

As 16 soluções de referência foram executadas e aprovadas no navegador. Verificou-se também a rejeição de HTML incompleto e de um projeto final sem layout e comportamento. Foram testados valores vazios, limites, decimais, emails inválidos e a grelha nas duas larguras. O progresso persistiu após recarregar a página.
