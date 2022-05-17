# Projeto de Desenvolvimento Baseado na Web
## Sistema de atendimento / Helpdesk

## 1. Introdução
Para o projecto da cadeira de Desenvolvimento Baseado na Web 2022 pretende-se desenvolver um 
sistema de atendimento ou helpdesk. Para tal, os alunos deverão implementar os requisitos que 
especificam o helpdesk usando um conjunto de tecnologias web.
Um sistema de helpdesk compreende um conjunto de agentes que resolvem tickets e respondem a 
questões colocadas em tempo-real por utilizadores interessados numa solução.

O helpdesk tem 3 componentes de forma a despistar os problemas:
- A FAQ (Frequently Asked Questions) é composta ao longo do tempo com as
  questões e respetivas soluções que são frequentemente colocadas pelos
  utilizadores do serviço de helpdesk de forma a não sobrecarregar os agentes;
- O atendimento, em que os agentes logados na plataforma respondem a questões
  em tempo real num chat;
- O sistema de tickets, em que uma pool de problemas terá de ser resolvida pelos
  agentes;
  Os grupos de projeto têm de ter um mínimo de 2 alunos e máximo de 3. Os grupos têm a
  liberdade de escolher um nome criativo para o seu projeto.

###  1.1 Seleção das tecnologias web
  Não obstante o facto de ser obrigatório usar HTML, CSS, JS (client-side), mongoDB
  (a connection string será oportunamente comunicada), é dada a liberdade aos
  alunos de utilizar as frameworks, packages, linguagens, etc, relacionadas com
  desenvolvimento web, que consideram ser as mais produtivas para implementar os
  requisitos. Esta liberdade traz uma responsabilidade acrescida para os alunos
  porque não terão o material oficial da cadeira como referência. Adicionalmente, a
  escolha de uma ou mais tecnologias alternativas é um compromisso de todos os
  elementos do grupo e cada aluno deverá salvaguardar o conhecimento das
  tecnologias adotadas não só para efeitos de desenvolvimento da aplicação, mas
  também para efeitos de discussão. Independentemente desta escolha, o socket.io é
  recomendado para a componente de atendimento. A seleção de tecnologias
  alternativas para implementação será logo valorizada na componente de avaliação
  de expansão do projecto (ver 1.2).
###  1.2 Entrega
  A nota mínima do projeto é de 8 valores e compreende 2 entregas:
- Na 1ª entrega (data limite 18 de Abril às 23:59, 10% da nota) deverá ser
  entregue o protótipo da aplicação de forma ao corpo docente dar feedback
  sobre os vários ecrãs da mesma. Apesar de não ser uma componente de
  avaliação com nota mínima, é recomendável que esta entrega seja
  preparada para os alunos estarem orientados e não desenvolverem ecrãs ou
  funcionalidades que posteriormente terão de ser refeitas porque não
  planearam os ecrãs convenientemente. NOTA: Na primeira entrega do
  projecto, os docentes irão apenas avaliar os protótipos, independentemente
  dos requisitos de software implementados no projecto.
- A entrega final(data limite 18 de Maio às 23.59, 50% da nota) compreende
  a aplicação completa e funcional. Alguma configuração que terá de ser feita
  de forma a executá-la, deverá ser declarada num ficheiro “readme” contido
  no arquivo da entrega no moodle. Serão aceites versões incompletas das
  funcionalidades mas terão de estar 100% funcionais dentro das limitações
  encontradas. P.e. não ser possível atribuir o ticket a um agente, ter a criação
  e não a edição de um ticket, etc.
- Sobre a avaliação da entrega final, será reservada uma cotação para
  a expansão que os alunos deram ao helpdesk. Abrange detalhes de
  implementação, novos requisitos, packages, etc. Seguem-se alguns
  exemplos:
- Detalhes de implementação: Colocar as rotas num ficheiro
  próprio, etc;
- Novo requisito: Anexar imagens a tickets ou FAQs, criar novas
  categorias da FAQ no momento da criação de um par
  pergunta-resposta, etc;
- Nova package: Usar componentes React para desenvolver a
  UI;
- Novo requisito com nova package (avançado): Desenvolver
  visualizações com dados agregados dos tickets da aplicação
  com d3.js ou outro;
## 2. FAQ - Frequently Asked Questions
   A FAQ tem o propósito de evitar colocar-se tickets desnecessariamente ou
   sobrecarregar o chat dos agentes e deverá ser colocado numa posição proeminente na UI.
   Não deverá ser um simples HTML estático mas composto com pares pergunta-resposta
   que são persistidos ao longo do tempo na BD. Seguem-se alguns requisitos:
- Um par pergunta-resposta pode ser criado, editado ou apagado de forma
  espontânea por qualquer agente;
- A origem de um par poderá ser o título de um ticket e a resposta ao mesmo no
  momento da sua resolução. Para o efeito, deverá ser reservada uma checkbox no
  momento da resolução do ticket para migrar esta informação para a FAQ;
- A FAQ deverá estar agrupada por categorias colapsáveis na UI. A forma como são
  criadas estas categorias são deixadas ao critério dos alunos assim como o tema do
  helpdesk em si;
- Alguns pares pergunta-resposta são pinned e figuram no início da listagem, por
  categoria;
- Um par também poderá ter origem no atendimento. Para tal deverá ser selecionada
  uma mensagem do atendimento por parte do agente e dada a escolha de passar a
  mensagem no chat como resposta para a FAQ. A pergunta para a resposta
  escolhida pode ser fornecida no momento ou editada na FAQ de forma espontânea
  mais tarde;
## 3. Sistema de tickets
   Os tickets podem ser colocados espontaneamente por qualquer utilizador, incluindo
   os próprios agentes. Deverá ter um título, descrição e um contacto de email para a
   resposta fornecida no momento da criação. Para encerrar um ticket deverá ser alterado o
   seu estado, adicionando-lhe uma resposta. Seguem-se alguns requisitos:
- Os tickets podem ser atribuídos a um dos agentes da aplicação(incluindo o próprio
  agente se aplicável) no momento da sua criação. No caso de se omitir esta
  informação deverá pertencer a uma pool partilhada de tickets que qualquer agente
  pode resolver;
- Deverá ser mantido na UI de forma proeminente o número de tickets ainda em
  aberto para o agente resolver, incluindo nessa contagem os que não têm atribuição
  (i.e. da pool partilhada);
- O perfil do utilizador deverá manter no mínimo o número de tickets resolvidos por
  este, assim como informação básica como nome e contacto de email;
- De forma idêntica a uma FAQ, um ticket também poderá ter origem no atendimento.
  Deverá ser selecionada a mensagem e o seu conteúdo deverá passar para a
  descrição do ticket;
- Deverá ser possível re-abrir um ticket entretanto fechado;
## 4. Atendimento
   O atendimento consiste numa sala de chat onde os utilizadores (não necessitam de
   registo) colocam as suas questões e partilham informação entre si. A configuração das
   salas é deixada ao critério dos alunos sendo que na sua forma mais simples é uma sala
   única com vários participantes, incluindo os agentes. Configurações mais complexas serão
   naturalmente valorizadas na componente de expansão do projecto (p.e. várias salas por
   agente/categoria). Seguem-se alguns requisitos:
- Deverá ser possível adicionar emoticons à conversa;
- Deverá ser possível editar e apagar uma mensagem;
- Ao utilizador comum não será possível adicionar à FAQ mas apenas abrir tickets a
  partir das mensagens. Como não tem registo terá de passar a informação do seu
  contacto de email para completar a operação;
- A UI deverá evidenciar a possibilidade de não haver agentes logados na aplicação.
  A FAQ ainda assim poderá ser consultada;
- Cada agente deverá ter na UI um conjunto de respostas prontas a serem copiadas
  rapidamente no chat com um número mínimo de clicks ou hotkeys (uma destas
  implementações é suficiente). Estas respostas deverão ser configuradas no perfil de
  cada agente com a possibilidade de serem importadas diretamente das respostas de
  um ticket ou da resposta de uma FAQ.
## 5. Entrega
   A primeira entrega do projeto está agendada para o dia 18-04-2022 até às 23:59 no
   moodle. Esta entrega deverá ser efetuada por email para os docentes com o seguinte
   assunto na mensagem : [DBWP1GX] em que X indica o número do grupo. De forma a
   diminuir o tamanho da entrega não será necessário incluir bibliotecas externas na entrega,
   todo o conteúdo deverá ser arquivado no ficheiro .zip ou .rar com o nome GX, onde x indica
   o nome do grupo.
   Será oportunamente facultado a cada grupo de projecto uma connection string para
   aceder a uma base de dados mongoDB. A conexão será exemplificada nas aulas práticas.
   Esta BD é de uso obrigatório e poderá ser facilmente acedida através do Compass.
## 6. Considerações Gerais
   Durante a sua implementação, o problema deve ser abordado de forma gradual:
   Um protótipo inicial, mesmo que de baixa fidelidade, poderá ser o primeiro passo na
   conceção da aplicação, antes mesmo de qualquer desenvolvimento. É um processo
   iterativo ao longo do tempo, sujeito a ajustes e que exige o quorum entre todos os
   elementos do grupo. É um bom indicador que o protótipo contemple todos os requisitos
   (incluindo os ecrãs, pop-ups, elementos da UI, etc). Não há apenas uma solução para o
   problema neste enunciado. Com exceção do protótipo que deverá ter pelo menos uma
   versão acordada pelo grupo como referência, o desenvolvimento deverá ser iterativo e
   orientado às funcionalidades da aplicação, i.e. para uma dada funcionalidade deverá ser
   implementada a apresentação, a lógica e a BD (pela ordem da preferência dos alunos)
   antes de passar à próxima funcionalidade. É preferível apresentarem um projeto que
   funciona mas que não cumpre todas as funcionalidades do que apresentar um
   projeto que supostamente implementa tudo mas não funciona.
   Os alunos não devem esperar pela primeira entrega do projeto para começar a
   implementação do mesmo. No momento em que os alunos têm um protótipo bem definido,
   devem começar a implementar a ideia. O enunciado do projeto foi lançado no dia 15 de
   Março e a data final de entrega do projeto é dia 18 de Maio. Logo, os alunos têm
   sensivelmente 2 meses para finalizar o trabalho.
