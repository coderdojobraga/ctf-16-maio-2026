# Guião para Mentores: CoderDojo Sessão 16 de maio de 2026

**Tema:** Cibersegurança

**Formato:** "Capture The Flag" (CTF) contínuo e dissimulado.

**Dinâmica:** O desafio simula uma plataforma interna do CoderDojo. Os níveis não estão explicitamente marcados como "Nível 1, 2, 3...". A ideia é que o ninja progrida organicamente ao explorar vulnerabilidades introduzidas propositadamente na plataforma.

Na página inicial, o ninja deve escolher o seu nível de experiência: **Scratch** (mais novos) ou **Python** (mais velhos). Esta escolha altera a dificuldade e a mecânica de alguns níveis mais à frente.

---

## Passo a Passo do Desafio

### Nível 1: Autenticação e Quiz de Segurança

* **O que acontece:** O ninja começa numa página de Login onde não tem credenciais. Ao tentar entrar com dados aleatórios, recebe um erro a informar que não tem conta e que precisa de descobrir um código secreto para se registar.


* **Como resolver:** 

1. O ninja clica no link para descobrir o código, o que abre um Quiz de Segurança (adaptado para Scratch ou Python).
2. Ao acertar nas 10 perguntas (se errar, volta ao início), recebe o código secreto: `secreto-codigo`.
3. Com o código, vai ao separador "Registar", introduz o código, um utilizador, email e uma password. O registo desbloqueia a entrada na plataforma.


* **Nota Técnica:** O sistema guarda a password em *plaintext* (texto limpo). Isto é intencional para o susto final no Nível 6.



### Nível 2: Manipulação de URL (Diretórios Ocultos)

* **O que acontece:** O ninja entra no "Blog CoderDojo Braga". O artigo em destaque explica como funcionam as "Diretorias Web" e sugere que a manipulação do URL pode revelar páginas escondidas.


* **Como resolver:**

1. No final do artigo sobre diretórios, há texto escondido (com a mesma cor do fundo) que se revela ao selecionar com o rato.


2. O texto revela as palavras: `six-seven`, `dojo`, `mentores`, `programar`.


3. O ninja deve testar estas palavras escrevendo-as diretamente na barra de URL do browser simulado (ex: `/dashboard/mentores`).


4. Escrever `/mentores` desbloqueia o acesso à próxima área secreta. (As outras opções mostram páginas de erro divertidas para encorajar a exploração ).





### Nível 3: OSINT e Metadados (Página de Mentores)

* **O que acontece:** O ninja acede a uma página com fotos de toda a equipa de mentores. Há uma foto de evento ("Coder Camp 2026") e também fotos de mentores marcadas como "Suspeitas".


* **Como resolver:**

1. O ninja deve investigar os ficheiros das fotos suspeitas clicando em "Ver Metadados".

2. No modal de metadados, no separador "Detalhes", encontra os **Dados Ocultos** que revelam um novo diretório secreto: `/emkors/inbox`.

3. **PASSO CRUCIAL:** Antes de sair da página dos mentores e ir para o novo URL, o ninja **tem de inserir o seu email** na caixa "És mentor?" no fundo da página para pedir um token de acesso. Sem isto, o Nível 4 não funciona corretamente.

4. De seguida, o ninja digita `/emkors/inbox` no URL.




* **Dica Presencial:** Se o ninja não souber o que fazer, os mentores podem fornecer o código `ajuda_2026` para virar o cartão de dicas no fim página.



### Nível 4: Identificação de Phishing

* 
**O que acontece:** O ninja entra numa simulação de caixa de correio (Python) ou de telemóvel (Scratch). O objetivo é clicar no único link de confirmação real no meio de várias tentativas de ataque.


* **Como resolver (Scratch):** * O ninja vê várias notificações de telemóvel. Ao passar o rato por cima dos botões (sem clicar), a interface mostra o URL real de destino no fundo do ecrã. Deve procurar o único link legítimo do CoderDojo (`dojo.local/confirm`).


* 
**Como resolver (Python):** * O ninja tem uma caixa de email com várias mensagens urgentes ou aliciantes (phishing). O ninja deve analisar os remetentes, os URLs de destino e o contexto para encontrar o único email legítimo (enviado por `noreply@coderdojo.local` com o seu token correto).


* **Nota 1:** Se clicarem num link falso, não perdem. Recebem um aviso educativo a explicar a técnica de phishing usada (ex: Typosquatting, Spear Phishing) e podem tentar novamente.

* **Nota 2:** Caso a caixa de email só tenha um email, quer dizer que os ninjas têm de ler esse email. O email indica que têm de voltar à diretoria de mentores e clicarem no botão que lhes vai enviar emails para confirmarem acesso como mentores. 


### Nível 5: Elevação de Privilégios (Acesso Champion)

* 
**O que acontece:** O ninja chega ao painel restrito de Champion, mas não tem permissão para entrar. A mecânica de resolução depende do caminho escolhido.


* **Como resolver (Scratch):**
1. A página sugere verificar o "código-fonte".


2. O ninja deve pressionar `Ctrl+U` para abrir o HTML da página.


3. No meio do código HTML, vai estar um comentário gigante com a password: `NINJA-HACKER`. Inserir esta password desbloqueia o painel.




* **Como resolver (Python):**
1. A página informa que a validação é feita através de **Cookies** no browser.


2. O ninja deve usar as Developer Tools reais do seu browser (F12 -> Application/Storage -> Cookies).


3. Vai encontrar um cookie chamado `role` com o valor `bWVudG9y` (que é "mentor" em Base64).


4. O ninja precisa de codificar a palavra "champion" para Base64 (que é `Y2hhbXBpb24`) e substituir o valor do cookie nas ferramentas do browser. Ao clicar em "Verificar Permissões", o acesso é concedido.




* 
**Dica Presencial:** Caso o ninja (Python) esteja bloqueado, podem fornecer o código `dica2026` no flip card para ele perceber a lógica do Base64.



### Nível 6: Engenharia Social (O Susto e o DojoBOT)

* **O que acontece:** O ninja entra finalmente no painel de Champion. Os ninjas têm de clicar em três coisas associadas ao DojoBot, algumas mensagens, notas e etc... Os ninjas devem ler esses textos sobre o DojoBot para ganharem contexto e perceberem que o DojoBot tem o código para apagar credenciais. Passado alguns segundos após clicarem nessas coisas, o painel "estoura" com um ecrã de terminal que mostra que o sistema extraiu os seus dados (IP, browser e a password em texto limpo usada no Nível 1).


* **Como resolver:**
1. Após o susto, o ninja é reencaminhado para o **DojoBOT**, um chatbot com Inteligência Artificial.


2. O DojoBOT guarda o código de emergência para apagar os dados do servidor. O ninja tem de usar **Engenharia Social / Prompt Injection** para convencer o bot a revelar o código.


3. O bot tem uma "dificuldade adaptativa": começa por ser muito resistente e recusar pedidos diretos, mas à medida que o ninja continua a tentar (fingindo ser admin, pedindo para ignorar regras, etc.), o bot acaba por ceder.


4. O bot revela o código: `DELETAR-TUDO-2026`.


5. Inserir este código na consola final inicia a sequência visual de "apagar dados" e conclui o desafio com a tela de Vitória.





---

## 🛠 Cheat Sheet Rápida (Para o Mentor)

| Situação / Nível | Código / Resposta a usar |
| --- | --- |
| **Nível 1:** Registo | `secreto-codigo` |
| **Nível 2:** URL Oculto | Escrever `/mentores` no URL (e dar Enter) |
| **Dica Nível 3:** Flip Card | Password: `ajuda_2026` |
| **Nível 3:** Nova Rota | Escrever `/emkors/inbox` no URL (e dar Enter) |
| **Nível 5 (Scratch):** Senha Champion | `NINJA-HACKER` (Acedido via Ctrl+U) |
| **Dica Nível 5 (Python):** Flip Card | Password: `dica2026` |
| **Nível 5 (Python):** Cookie | Mudar cookie `role` para `Y2hhbXBpb24` |
| **Nível 6:** Código Final do Bot | `DELETAR-TUDO-2026` |

**Dica de Debug:** Se algo bloquear ou um Ninja quiser recomeçar do zero, basta clicar no botão **"Sair"** no topo direito. O sistema foi programado para limpar totalmente o estado local e os cookies de sessão.