---
description: Orquestra o desenvolvimento de funcionalidades com isolamento de diretórios e ciclo de testes com autocorreção.
---

# Gatilho
Acionado quando uma nova "Task" ou "Feature" for solicitada para desenvolvimento.

# Passos de Execução
1. **Desenvolvimento Backend:** O Agente Backend deve implementar as regras de negócio e rotas estritamente dentro de `./server`, seguindo os formatos do `API_CONTRACTS.md`.
2. **Validação Backend (Autocorreção):** - Execute o comando `cd server && npm test`.
   - Se os testes falharem (log vermelho), o Agente Backend deve ler a stack trace, corrigir o código isoladamente e reexecutar este passo até o terminal retornar sucesso.
3. **Desenvolvimento Frontend:** Após o backend ser validado, o Agente Frontend assume e implementa a interface e a integração da API estritamente dentro de `./client`.
4. **Validação Frontend (Autocorreção):** - Execute o comando `cd client && npx vitest run`.
   - Em caso de falha, o Agente Frontend deve analisar o log, reparar os componentes do React e reexecutar este passo.
5. **Revisão Final:** Após ambos os diretórios passarem nas baterias de testes de forma verde, interrompa a execução e apresente um resumo técnico das implementações para o Code Review.