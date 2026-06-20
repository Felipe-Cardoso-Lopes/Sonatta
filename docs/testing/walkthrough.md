# Testing Walkthrough

## Frontend E2E Test Implementation

**Data:** 20/06/2026

**Contexto:**
Conclusão da primeira fase de testes E2E com Playwright e correção do fluxo de perfil institucional.

**Problema identificado:**
Durante a validação da branch `feature/playwright-e2e`, o único teste E2E falhando (`institutions.profile.spec.js`) não correspondia a um bug funcional da aplicação, mas sim a uma fragilidade do teste frente a alterações de UI.

**Investigação e Descobertas:**
- O placeholder do campo de descrição da instituição havia sido alterado.
- O texto do botão de submissão havia sido alterado para "Salvar Identidade Pública".
- O teste estava utilizando seletores frágeis baseados no texto anterior e placeholder.

**Resolução:**
Migração dos seletores para o uso de atributos `data-testid`, especificamente utilizando `data-testid="institution-description-input"`, atualizando os seletores para focar nos elementos estruturais ao invés de texto de UI, estabilizando o teste.

**Resultado:**
- Atualização bem-sucedida do teste.
- Todos os testes passando (1 passed, 0 failed em `e2e/institutions.profile.spec.js`).
- Institution Profile E2E test passing.

```text
Root Cause:
Test fragility caused by UI text changes.

Resolution:
Updated selectors and stabilized the test using data-testid.

Result:
Institution Profile E2E test passing.
```
