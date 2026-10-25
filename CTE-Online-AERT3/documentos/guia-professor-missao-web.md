# Missão Web — Guia do professor

Jogo de iniciação ao desenvolvimento web em que os alunos reativam o portal da Escola do Vale, missão a missão. Este guia resume a organização do jogo e apresenta soluções de referência para cada nível. As soluções foram testadas com os verificadores do jogo.

## Organização

| Missão | Espaço | Aprendizagem |
|---|---|---|
| 1 | Biblioteca | Estrutura HTML, elementos semânticos e atributos |
| 2 | Corredor principal | Flexbox: `display`, `justify-content`, `align-items`, `gap` |
| 3 | Mural de atividades | Grid: colunas, espaçamento e posicionamento |
| 4 | Loja | Variáveis, números, operações, eventos e DOM |
| 5 | Secretaria | Inputs, condições, evento `submit` e mensagens de feedback |
| Final | Sala dos clubes | Transferência: página nova de um clube escolar |

Cada missão tem três níveis:

1. **Explorar** — o aluno muda valores com controlos e vê o efeito no código e na página.
2. **Completar** — o aluno preenche espaços em branco num excerto de código.
3. **Construir** — o aluno escreve o código com menos apoio.

**Desbloqueio.** Uma missão abre quando a anterior tem os níveis 1 e 2 concluídos. A sala acende no mapa quando os três níveis estão feitos. O desafio final abre quando todas as missões têm os níveis 1 e 2 concluídos. No *Relatório do professor* há uma opção para desbloquear tudo.

**Verificação.** O jogo avalia o resultado na página e não o texto do código. Mede posições e estilos reais, e simula cliques, alterações de valores e envios de formulário. Por isso, aceita soluções diferentes das que estão neste guia, desde que funcionem. Os níveis com ecrã estreito são testados a 900 px e a 360 px.

**Pistas.** Cada nível tem três pistas, que aparecem uma de cada vez:

1. Recordam o conceito.
2. Sugerem a propriedade ou o método a usar.
3. Mostram um exemplo semelhante, noutro contexto.

**Distinções.** Nenhuma distinção valoriza a rapidez.

- **Funciona** — níveis 1 e 2 concluídos.
- **Explica** — explicação com pelo menos 40 caracteres em 2 ou mais níveis.
- **Adapta** — nível 3 resolvido.
- **Transfere** — desafio final concluído.

**Progresso.** O progresso fica guardado no navegador. Para mudar de computador, ou para entregar o trabalho, o aluno copia o *código de progresso* no relatório. O professor cola esse código em *Carregar progresso* para ver tentativas, pistas usadas e explicações.

**Imagens disponíveis nas páginas dos alunos:** `biblioteca.svg`, `sala-estudo.svg`, `clube.svg`. Qualquer outro nome mostra uma imagem de exemplo.

---

## Missão 1 · Recuperar a biblioteca

### Nível 1 · Explorar — A página sem forma
Escolhas corretas:

- Título: `h1`
- Lista: `ul` ou `ol`
- Texto alternativo: uma frase descritiva com pelo menos 5 caracteres
- Ligação: `https://www.rbe.mec.pt`

**Para discutir:** a diferença entre `ul` e `ol`, e para que serve o `alt` a quem usa um leitor de ecrã.

### Nível 2 · Completar — Espaços em branco
```html
<main>
  <img src="biblioteca.svg" alt="Estantes com livros coloridos">
  …
  <ul> … </ul>
  <a href="https://www.rbe.mec.pt">Rede de Bibliotecas Escolares</a>
</main>
```
**Erro frequente:** escrever nomes diferentes na abertura e no fecho, como `<ul>` com `</ol>`. O jogo avisa antes de verificar.

### Nível 3 · Construir — A sala de estudo
```html
<header>
  <h1>Sala de Estudo</h1>
  <p>Um espaço calmo para estudar, ler e fazer trabalhos de grupo.</p>
</header>
<main>
  <img src="sala-estudo.svg" alt="Mesas com computadores portáteis">
  <h2>Horário</h2>
  <ul>
    <li>Segunda a sexta, 9h00–12h30</li>
    <li>Segunda a sexta, 13h30–16h30</li>
    <li>Quarta, 16h30–18h00</li>
  </ul>
  <a href="https://www.exemplo.pt/reservar">Reservar um computador</a>
</main>
```
O jogo verifica:

- `header` com `h1`
- um parágrafo com pelo menos 20 caracteres
- `main` com a imagem e a lista
- `alt` descritivo
- 3 ou mais itens na lista
- `href` preenchido e diferente de `#`

---

## Missão 2 · Arrumar a barra de navegação

### Nível 1 · Explorar — O menu ficou desarrumado
```css
.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```
**Para discutir:** com `stretch` ou `flex-start`, o logótipo e as ligações têm alturas diferentes e não ficam alinhados ao centro. É bom momento para distinguir o eixo principal do eixo transversal.

### Nível 2 · Completar — Dois contentores
```css
.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ligacoes {
  display: flex;
  gap: 12px;
}
```
**Erro frequente:** escrever o `gap` sem unidade (`12` em vez de `12px`). O navegador ignora a regra e as ligações ficam coladas.

### Nível 3 · Construir — Menu no telemóvel
```css
.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.ligacoes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```
**Alternativa válida:** usar `@media (max-width: 480px) { .menu { flex-direction: column; align-items: flex-start; } }`, mantendo o `flex-wrap` nas ligações.

**Nota:** este nível introduz `flex-wrap` e `@media`, que as pistas apresentam. Pode justificar uma breve demonstração na aula.

---

## Missão 3 · Reconstruir o mural

### Nível 1 · Explorar — Cartões empilhados
```css
.mural {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
```
**Para discutir:**

- `200px 200px 200px` cria 3 colunas iguais, mas não ocupa o mural todo.
- `1fr 2fr 1fr` ocupa tudo, mas as colunas não são iguais.

### Nível 2 · Completar — O cartão em destaque
```css
.mural {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.destaque {
  grid-column: span 2;
}
```

### Nível 3 · Construir — Mural para todos os ecrãs
```css
.mural {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.destaque {
  grid-column: 1 / -1;
}
```
**Erro frequente:** manter `span 2` no destaque. No telemóvel só existe uma coluna, por isso a grelha cria uma coluna extra e o conteúdo sai do ecrã. A solução `1 / -1` ocupa sempre a linha toda.

---

## Missão 4 · Reabrir a loja

### Nível 1 · Explorar — Contas trocadas
Escolhas corretas:

- Quantidade: 4
- Operação: `*`
- Formato: `total.toFixed(2)`

O total esperado é `4.80 €`.

**Para discutir:** experimentar a quantidade 3. Sem `toFixed`, o resultado de `1.2 * 3` aparece como `3.5999999999999996`.

### Nível 2 · Completar — O botão Calcular
```js
const botao = document.querySelector('#calcular');

botao.addEventListener('click', function () {
  const preco = Number(document.querySelector('#produto').value);
  const quantidade = Number(document.querySelector('#quantidade').value);
  const total = preco * quantidade;
  document.querySelector('#total').textContent =
    'Total: ' + total.toFixed(2) + ' €';
});
```
**Erro frequente:** escrever o seletor sem `#` (`'quantidade'`). Nesse caso, `querySelector` devolve `null` e o navegador mostra um erro na consola.

### Nível 3 · Construir — Total automático
```js
const produto = document.querySelector('#produto');
const quantidade = document.querySelector('#quantidade');
const saco = document.querySelector('#saco');
const total = document.querySelector('#total');

function atualizar() {
  let valor = Number(produto.value) * Number(quantidade.value);
  if (saco.checked) {
    valor = valor + 0.5;
  }
  total.textContent = 'Total: ' + valor.toFixed(2) + ' €';
}

produto.addEventListener('input', atualizar);
quantidade.addEventListener('input', atualizar);
saco.addEventListener('change', atualizar);
```
O jogo testa estes casos:

- 4 canetas: 2.60 €
- 4 réguas: 3.60 €
- 4 réguas com saco: 4.10 €
- 4 réguas depois de desmarcar o saco: 3.60 €

**Erro frequente:** somar texto em vez de números, o que dá `"3.600.5"`. O jogo deteta este caso e sugere `Number()`.

---

## Missão 5 · Ativar a secretaria

### Nível 1 · Explorar — Nomes de uma letra
Escolhas corretas: `>=` com 3, ou `>` com 2. A tabela fica toda verde.

**Para discutir:** porque é que «  Jo  » é inválido. O `trim()` tira os espaços antes de contar as letras.

### Nível 2 · Completar — Enviar sem recarregar
```js
form.addEventListener('submit', function (evento) {
  evento.preventDefault();
  …
  } else if (!email.includes('@')) {
  …
    mensagem.className = 'sucesso';
```
**Erro frequente:** esquecer o `!`. Nesse caso, os emails válidos são recusados e os inválidos são aceites.

### Nível 3 · Construir — Inscrição completa
```js
const form = document.querySelector('#inscricao');
const mensagem = document.querySelector('#mensagem');
const resumo = document.querySelector('#resumo');

function erro(texto) {
  mensagem.textContent = texto;
  mensagem.className = 'erro';
  resumo.hidden = true;
}

form.addEventListener('submit', function (evento) {
  evento.preventDefault();
  const nome = document.querySelector('#nome').value.trim();
  const email = document.querySelector('#email').value.trim();
  const ano = document.querySelector('#ano').value;
  const atividade = document.querySelector('#atividade').value;

  if (nome.length < 3) {
    erro('Escreve o teu nome completo.');
  } else if (!email.includes('@') || !email.includes('.')) {
    erro('O email tem de ter @ e um ponto.');
  } else if (ano === '') {
    erro('Escolhe o ano de escolaridade.');
  } else {
    mensagem.textContent = 'Inscrição recebida!';
    mensagem.className = 'sucesso';
    resumo.textContent = nome + ' · ' + ano + ' · ' + atividade;
    resumo.hidden = false;
  }
});
```
**Erro frequente:** não voltar a esconder o resumo quando surge um erro depois de uma inscrição válida. O último requisito testa este caso.

---

## Desafio final · Página de um clube escolar

Este desafio não tem código de partida nem solução única. O jogo verifica apenas os conceitos:

1. `header` com `h1`, `main`, uma imagem com `alt` e uma ligação.
2. Um elemento com `display: flex` que contenha pelo menos 3 ligações.
3. Um elemento com `display: grid` com pelo menos 3 filhos.
4. Um formulário que:
   - não recarrega a página;
   - mostra um aviso quando é enviado vazio;
   - muda a mensagem quando é enviado preenchido.
5. A 360 px, nada sai do ecrã.

**Exemplo mínimo que cumpre os requisitos** (não deve ser mostrado aos alunos antes de tentarem):
```html
<header>
  <h1>Clube de Xadrez</h1>
  <nav class="menu">
    <a href="#sobre">Sobre</a>
    <a href="#torneios">Torneios</a>
    <a href="#inscricao">Inscrição</a>
  </nav>
</header>
<main>
  <img src="clube.svg" alt="Bandeirolas coloridas na sala do clube">
  <section class="atividades">
    <article>Treino às terças</article>
    <article>Torneio interturmas</article>
    <article>Problemas da semana</article>
  </section>
  <form id="inscricao">
    <label for="nome">Nome</label>
    <input id="nome">
    <button>Inscrever</button>
  </form>
  <p id="msg"></p>
</main>
```
```css
.menu { display: flex; flex-wrap: wrap; gap: 12px; }
.atividades { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
```
```js
document.querySelector('#inscricao').addEventListener('submit', function (evento) {
  evento.preventDefault();
  const nome = document.querySelector('#nome').value.trim();
  const msg = document.querySelector('#msg');
  msg.textContent = nome ? 'Bem-vindo ao clube, ' + nome + '!' : 'Escreve o teu nome.';
});
```

**Sugestões de avaliação**

O verificador automático confirma que a página funciona. A transferência avalia-se melhor com:

- a explicação escrita no fim do desafio;
- uma conversa curta com o aluno: o que fez de diferente das missões e porquê;
- a originalidade do conteúdo e do estilo. Uma página que reproduz literalmente as soluções das missões mostra menos transferência.
