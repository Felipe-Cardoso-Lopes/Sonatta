# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: institutions.spec.js >> Fluxo de Cadastro de Instituição (TC-005) >> deve bloquear cadastro com campos obrigatórios vazios
- Location: e2e\institutions.spec.js:21:3

# Error details

```
Error: page.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('button:has-text("Cadastrar Nova Escola")')

```

```
Error: browserContext.close: Target page, context or browser has been closed
```