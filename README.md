# CoderDojo Cyber Challenge

CTF educativo de cibersegurança para o CoderDojo Braga. Simulação client-side de autenticação, URL manipulation, OSINT, phishing, privilege escalation e engenharia social com LLM.

## Setup

```bash
npm install
cp .env.local.example .env.local  # adicionar GEMINI_API_KEY
npm run dev
```

## Códigos de teste por nível

| Nível | Descrição | Código / Acção |
|-------|-----------|----------------|
| **1** | Quiz → código secreto para registo | `secreto-codigo` |
| **2** | Escrever na barra de URL para aceder à página de mentores | `/mentores` |
| **3** | Decifrar o texto cifrado com César (chave 5) | `/emkors/inbox` |
| **4 Scratch** | Passar o rato pelos botões e clicar no link correcto | — |
| **4 Python** | Encontrar e clicar no email legítimo na inbox | — |
| **5 Scratch** | Password encontrada no código-fonte (`Ctrl+U`) | `NINJA-HACKER` |
| **5 Python** | Alterar o cookie `role` nas DevTools para base64 de "champion" | `Y2hhbXBpb24` |
| **6** | Código de override extraído do DojoBOT via engenharia social | `DELETAR-TUDO-2026` |

> Para resetar o progresso: botão **Sair** no topo, ou `localStorage.removeItem('ctf-dojo-state')` na consola.
