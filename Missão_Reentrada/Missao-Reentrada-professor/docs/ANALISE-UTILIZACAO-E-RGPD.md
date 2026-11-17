# Missão REENTRADA — análise de utilização, autoria e proteção de dados

Revisão: 15 de novembro de 2026. Contexto indicado: atividade curricular TIC MO3/TEAC, em computadores pessoais e contas individuais dos alunos. Esta revisão descreve a aplicação local e prepara informação de apoio; não constitui uma certificação de conformidade RGPD.

## Decisões confirmadas por Fernando Coelho

- Assinatura do jogo e autoria pedagógica da sebenta: Fernando Coelho.
- Criação com apoio de IA, indicada expressamente.
- CC BY-NC 4.0 para os materiais próprios, incluindo código e conteúdos, na medida dos direitos detidos pelo autor. Bibliotecas de terceiros conservam as suas licenças; a política institucional não é relicenciada.
- Contacto apresentado como “Encarregado de Proteção de Dados do AE Rio Tinto n.º 3”, com ligação à página oficial. Não se copiou como contacto atual o nome pessoal do EPD do documento histórico.

## O que foi alterado

1. Informação inicial antes do formulário: o que é registado, armazenamento local, exportação e ligação ao aviso completo. Sem checkbox de consentimento obrigatório e sem aceitação contratual como condição para a aprendizagem.
2. Nome curto ou código do aluno e turma; número opcional. Preservada a compatibilidade com os progressos antigos, que podem conter o nome completo. É possível corrigir esses dados no próprio jogo. O código do aluno é pseudonimização quando a escola consegue associá-lo a uma pessoa; continua a poder ser um dado pessoal.
3. Sinalética 1 — IA como tutor: orientação, explicação e pistas, com resolução e verificação pelo aluno. Sem obrigação de conta de IA; ferramentas externas dependem de autorização e regras da escola. O jogo não faz pedidos a modelos de IA. A criação com IA é informada separadamente do nível de utilização pelo aluno.
4. Informação permanente de privacidade, utilização e créditos, também disponível numa página local sem dependência de JavaScript.
5. Comandos para exportar, corrigir a identificação e apagar o registo local desta atividade. O apagamento não chama clear() nem remove outros projetos, e as gravações automáticas ficam suspensas até nova identificação, para evitar recriar o registo apagado.
6. Aviso de dados pessoais antes da exportação; créditos da atividade incluídos no ZIP de trabalho, sem atribuição automática de licença ao trabalho original do aluno.
7. CC BY-NC 4.0 em créditos e ficheiro de autoria; avisos MIT das bibliotecas preservados. A senha docente organiza o acesso pedagógico, sem acrescentar termos de licença.
8. Texto e código a 18 px por predefinição, com botões e enunciados proporcionais.

## Dados e fluxos observados no código

A chave de armazenamento desta aplicação é aurora-reentrada-v1. Guarda identificação, datas da sessão e da primeira abertura, respostas e datas das respostas, até 20 rondas históricas por etapa, rascunhos de código, etapas concluídas, diário, pistas e preferências. Um banco personalizado também pode acompanhar o progresso. Não é lida a identidade da conta do sistema operativo.

Não foram encontrados pedidos automáticos de envio de dados, cookies de publicidade, analytics ou fontes remotas. Three.js, editor, música, sebenta e banco são locais. A pré-visualização do código é isolada e bloqueia rede por CSP. Existem ligações voluntárias à documentação e a páginas institucionais, sujeitas às políticas desses sítios. A política usa no-referrer para reduzir a informação do endereço enviada ao seguir ligações. Não houve auditoria às extensões, backups, sincronização de pastas ou sistema operativo dos equipamentos dos alunos.

A exportação JSON inclui o registo completo da atividade. O ZIP inclui identificação, progresso, respostas, rascunhos e diário. O aluno escolhe guardar e entregar o ficheiro pelo canal indicado. Não há recolha central automática. Quem tem acesso ao perfil local ou ao ficheiro pode lê-lo: a palavra-passe docente não cifra o progresso.

## O que o PDF institucional permite concluir

O documento fornecido identifica o Agrupamento de Escolas de Rio Tinto n.º 3 como responsável pelo tratamento e descreve finalidades pedagógicas e administrativas, direitos e contactos institucionais. A conservação é referida em termos da legislação aplicável, sem um prazo próprio para este jogo. As páginas 2, 4 e 5 foram extraídas e verificadas visualmente. A cópia é preservada sem alterações.

O uso em equipamento pessoal e conta individual reduz partilhas acidentais, mas não elimina o tratamento de dados pessoais nem as obrigações de informação. O autor do recurso não é automaticamente o responsável por todos os tratamentos efetuados no contexto escolar. A definição do responsável e das finalidades deve corresponder à utilização concreta pelo agrupamento.

## Confirmação institucional necessária antes do uso com alunos

- Confirmar o fundamento jurídico do registo e da entrega no contexto desta atividade. Uma possível referência para a função educativa pública é o artigo 6.º, n.º 1, alínea e), RGPD, mas não foi adotado aqui como decisão institucional. A CNPD explica que o consentimento não é a base adequada em todos os tratamentos. O clique em Entrar não deve fingir que resolve essa questão.
- Definir o prazo ou critérios de conservação das entregas e das cópias de trabalho, incluindo os períodos de revisão e contestação. A aplicação informa que a sua cópia local não é apagada automaticamente.
- Confirmar o canal de entrega, destinatários autorizados, contacto atual do EPD e informação institucional complementar. A política inclui o contacto genérico solicitado e as ligações oficiais.
- Se forem utilizadas ferramentas de IA externas, verificar a adequação à idade e às regras da escola, os dados que recebem e as condições do serviço. A utilização deste jogo não exige essas ferramentas.
- Qualquer publicação de trabalhos identificados, fotografias ou relatórios fora do circuito pedagógico exige apreciação própria; a licença do recurso não autoriza a divulgação de dados pessoais dos alunos.

## Prática recomendada

Combinar um código curto com cada aluno, guardar a correspondência apenas na escola se necessária, usar a conta individual e entregar os ficheiros pelo canal escolar aprovado. Depois da entrega validada e do período aplicável de revisão, eliminar cópias desnecessárias. Não criar rankings públicos ou pedidos de dados adicionais. A exportação é uma cópia técnica dos dados; o exercício jurídico dos direitos depende das condições legais aplicáveis e do agrupamento.

## Fontes

- PDF rgpd.pdf fornecido pelo utilizador, preservado em docs/rgpd-agrupamento.pdf.
- Política do agrupamento: https://www.aert3.pt/index.php/doc-orientadores/rgpd
- Contactos institucionais: https://www.aert3.pt/index.php/contatos-sede
- RGPD, em especial artigos 5.º, 6.º, 12.º e 13.º: https://eur-lex.europa.eu/legal-content/PT/TXT/?uri=CELEX:32016R0679
- CNPD, Consentimento: https://www.cnpd.pt/organizacoes/areas-tematicas/consentimento/
- CC BY-NC 4.0: https://creativecommons.org/licenses/by-nc/4.0/deed.pt
- Creative Commons esclarece que as licenças CC não são a opção recomendada para software: https://creativecommons.org/faq/#can-i-apply-a-creative-commons-license-to-software . Foi respeitada a escolha expressa do autor para os seus materiais; as licenças de software de terceiros mantêm-se.

## Verificação

Resultados da interface e dos pacotes registados em VERIFICACAO.md. Limitação mantida: a abertura file:// não é permitida pelo navegador integrado; a mesma versão JavaScript clássica é testada em HTTP local. Não se publicou o projeto.
