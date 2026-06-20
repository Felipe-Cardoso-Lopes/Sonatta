# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: super-admin-approval.spec.js >> Feature 13/14: Painel de Aprovação do Super Admin >> Deve visualizar instituições pendentes e aprovar uma solicitação
- Location: e2e\super-admin-approval.spec.js:16:3

# Error details

```
Test timeout of 90000ms exceeded while running "beforeEach" hook.
```

```
Error: page.waitForURL: Test timeout of 90000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/super-admin/*" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e5]:
  - banner [ref=e6]:
    - generic [ref=e7]:
      - link "Sonatta Logo" [ref=e8] [cursor=pointer]:
        - /url: /
        - img "Sonatta Logo" [ref=e9]
      - link "Sonatta" [ref=e10] [cursor=pointer]:
        - /url: /
  - main [ref=e11]:
    - generic [ref=e12]:
      - heading "Entrar" [level=2] [ref=e13]
      - generic [ref=e14]:
        - generic [ref=e15]:
          - generic [ref=e16]: E-mail
          - textbox "E-mail" [ref=e18]:
            - /placeholder: seuemail@exemplo.com
            - text: joaoroberto@email.com
        - generic [ref=e19]:
          - generic [ref=e20]: Senha
          - generic [ref=e21]:
            - textbox "Senha" [ref=e22]:
              - /placeholder: "********"
              - text: "123456"
            - button "Mostrar" [ref=e23] [cursor=pointer]
        - link "Esqueceu a senha?" [ref=e25] [cursor=pointer]:
          - /url: /forgot-password
        - button "Entrar" [active] [ref=e26] [cursor=pointer]
      - paragraph [ref=e27]:
        - text: Não tem uma conta?
        - link "Cadastre-se" [ref=e28] [cursor=pointer]:
          - /url: /register
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Feature 13/14: Painel de Aprovação do Super Admin', () => {
  4  |   
  5  |   test.beforeEach(async ({ page }) => {
  6  |     // 1. Simula o Login do Super Admin
  7  |     await page.goto('/login');
  8  |     await page.fill('input[type="email"]', 'joaoroberto@email.com');
  9  |     await page.fill('input[type="password"]', '123456');
  10 |     await page.click('button[type="submit"]');
  11 |     
  12 |     // Aguarda o redirecionamento
> 13 |     await page.waitForURL('**/super-admin/*');
     |                ^ Error: page.waitForURL: Test timeout of 90000ms exceeded.
  14 |   });
  15 | 
  16 |   test('Deve visualizar instituições pendentes e aprovar uma solicitação', async ({ page }) => {
  17 |     await page.goto('/super-admin/schools');
  18 | 
  19 |     // Navega para a aba de solicitações pendentes
  20 |     await page.click('button:has-text("Solicitações Pendentes")');
  21 | 
  22 |     page.on('dialog', async dialog => {
  23 |       await dialog.accept();
  24 |     });
  25 | 
  26 |     const btnAprovar = page.locator('button:has-text("Aprovar")').first();
  27 |     const mensagemVazia = page.locator('text=Nenhuma solicitação pendente no momento.');
  28 | 
  29 |     // CORREÇÃO: Aguarda ativamente o React renderizar o conteúdo da aba (seja a tabela ou a mensagem vazia)
  30 |     await expect(btnAprovar.or(mensagemVazia)).toBeVisible();
  31 | 
  32 |     // Com o DOM estabilizado, a condicional executará o caminho correto
  33 |     if (await btnAprovar.isVisible()) {
  34 |       await btnAprovar.click();
  35 | 
  36 |       // Aguarda recarga dos dados da API
  37 |       await page.waitForTimeout(1000); 
  38 | 
  39 |       await page.click('button:has-text("Instituições Ativas")');
  40 |       await expect(page.locator('table')).toBeVisible();
  41 |     } else {
  42 |       await expect(mensagemVazia).toBeVisible();
  43 |     }
  44 |   });
  45 | });
```