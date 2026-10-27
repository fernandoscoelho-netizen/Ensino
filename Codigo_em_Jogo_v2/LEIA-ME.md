# Código em Jogo — Laboratório Raspberry Pi / TEAC

Aplicação educativa estática, em português de Portugal. Nove missões HTML/CSS/JavaScript, nove experiências, nove desafios de código, 27 perguntas e um projeto HMI integrador.

## Iniciar

Extrair todo o ZIP para uma pasta. Para experimentar, abrir Codigo_em_Jogo_PROTEGIDO_v5.html num navegador recente. Confirme no rodapé a indicação V5 PROTEGIDA. O manual e os restantes ficheiros têm de permanecer juntos. Para uso com turmas, recomenda-se servir a pasta por HTTP num servidor interno, evitando diferenças de armazenamento e restrições de ficheiros locais.

Exemplo para um Raspberry Pi com Python 3, a partir da pasta extraída:

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

Abrir http://ENDERECO-DO-RASPBERRY:8080 nos computadores da rede. Este servidor é adequado a uma experiência numa rede de confiança; não inclui autenticação nem receção de ficheiros. Para utilização permanente, usar o servidor Web habitual da escola. No FS01, o administrador pode disponibilizar a pasta através de um site estático IIS, restringindo o acesso à rede interna conforme a configuração da escola. Não é necessário instalar Node.js para servir a aplicação.

## Alunos

1. Identificar nome/número e turma.
2. Em cada missão: explorar três cartões, alterar a experiência e registar a descoberta, escrever e testar código e responder ao quiz.
3. A conclusão exige os três cartões, descoberta, código validado e 3/3 no quiz mais recente. Pode repetir e consultar pistas. Não há penalização de tempo.
4. Concluir o projeto HMI e o diário de engenharia. Escrever a reflexão final. Cada reflexão precisa de 80 caracteres para permitir a entrega final; a extensão não garante a qualidade pedagógica.
5. Exportar relatório HTML (imprimível em PDF) e JSON. Entregar na tarefa indicada pelo professor no Moodle/Teams.
6. Guardar JSON no fim de cada sessão. Num computador partilhado, exportar antes de iniciar um novo registo. Restaurar o JSON para continuar noutro equipamento.

## Professor

A área docente importa vários JSON, mostra a síntese da turma, permite rever as reflexões e descarregar relatórios e CSV. A importação fica apenas na memória da página; recarregar limpa a lista. A área docente exige o código de acesso definido pelo professor. Use «Bloquear área do professor» antes de deixar o computador a um aluno; o bloqueio limpa os relatórios importados da memória. O código é pedido a cada entrada. Sair da área docente, clicar novamente na opção Professor ou recarregar bloqueia o acesso e limpa os relatórios importados. A verificação é local, inspecionável nos ficheiros da aplicação, e não substitui autenticação num servidor. Não existe uma caixa de entregas central. Os dados são locais, editáveis e sem assinatura; o professor deve cruzá-los com o trabalho em aula. Não há envio automático ou classificação de 0 a 20.

Os registos distinguem primeiro quiz e quiz mais recente, tentativas e código, utilização de pistas e descobertas. O tempo ativo é aproximado (amostras de 10 s com página visível e com foco). A pontuação XP corresponde às etapas cumpridas, sem duplicar por repetição.

## Conteúdos e fontes

Base: jogo fornecido “Código em Jogo” e sebenta “Criação de Páginas Web — Aprender fazendo”, com 51 páginas numeradas mais capa. O PDF está incluído. MDN Learn Web Development e documentação oficial Raspberry Pi constituem referências de aprofundamento, acessíveis na aplicação. A ligação TEAC é uma adaptação pedagógica; não é declarada equivalência a uma UFCD específica.

O laboratório cobre o núcleo HTML/CSS/JavaScript do jogo. Multimédia e iframe (pp. 20–21) estão no manual como aprofundamento. O projeto progressivo foi adaptado a uma HMI única, em vez do website Clube Web com várias páginas.

## Tecnologia e limites

HTML, CSS, SVG e JavaScript sem dependências externas. As funções JavaScript são testadas num Web Worker com limite de dois segundos. Os desafios CSS usam estilos calculados numa pré-visualização isolada. O projeto integrado executa num iframe sandbox, sem permissões de mesma origem, com ligações externas e formulários bloqueados por CSP. Evitar ciclos infinitos no JavaScript do projeto, que podem bloquear o respetivo contexto de execução; o limite de tempo da interface não interrompe um ciclo síncrono dentro do iframe.

O Raspberry Pi, sensores, LEDs e motor são virtuais. Não há GPIO, aquisição física ou controlo industrial. Uma integração física exigiria serviços, comunicações e segurança próprios. A interface Web não substitui circuitos de segurança.

## Estrutura

- index.html: estrutura da aplicação
- style.css: apresentação responsiva
- base.js: conteúdos extraídos do jogo original
- content.js: missões TEAC, perguntas e testes
- app.js: interações, progresso, relatórios e revisão docente
- manual.pdf: sebenta fornecida

Manter o mesmo endereço de acesso para preservar o armazenamento local do navegador. Apagar os dados do site elimina o progresso local. O laboratório não utiliza uma base de dados no servidor.
