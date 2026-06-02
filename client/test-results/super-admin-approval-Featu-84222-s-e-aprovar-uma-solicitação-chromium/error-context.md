# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: super-admin-approval.spec.js >> Feature 13/14: Painel de Aprovação do Super Admin >> Deve visualizar instituições pendentes e aprovar uma solicitação
- Location: e2e\super-admin-approval.spec.js:16:3

# Error details

```
TimeoutError: page.click: Timeout 60000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Solicitações Pendentes")')

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
        - generic [ref=e19]:
          - generic [ref=e20]: Senha
          - generic [ref=e21]:
            - textbox "Senha" [ref=e22]:
              - /placeholder: "********"
            - button "Mostrar" [ref=e23] [cursor=pointer]
        - link "Esqueceu a senha?" [ref=e25] [cursor=pointer]:
          - /url: /forgot-password
        - button "Entrar" [ref=e26] [cursor=pointer]
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
  13 |     await page.waitForURL('**/super-admin/*');
  14 |   });
  15 | 
  16 |   test('Deve visualizar instituições pendentes e aprovar uma solicitação', async ({ page }) => {
  17 |     // Acessa a rota de gestão de escolas
  18 |     await page.goto('/super-admin/schools');
  19 | 
  20 |     // Navega para a aba de solicitações pendentes
> 21 |     await page.click('button:has-text("Solicitações Pendentes")');
     |                ^ TimeoutError: page.click: Timeout 60000ms exceeded.
  22 | 
  23 |     // Prepara o Playwright para aceitar automaticamente os alertas do navegador (window.confirm e window.alert)
  24 |     page.on('dialog', async dialog => {
  25 |       await dialog.accept();
  26 |     });
  27 | 
  28 |     // Localiza o primeiro botão "Aprovar" na tabela
  29 |     const btnAprovar = page.locator('button:has-text("Aprovar")').first();
  30 |     
  31 |     // Se existir uma instituição pendente, realiza o clique
  32 |     if (await btnAprovar.isVisible()) {
  33 |       await btnAprovar.click();
  34 | 
  35 |       // Aguarda um momento para a recarga dos dados da API e atualização da aba
  36 |       await page.waitForTimeout(1000); 
  37 | 
  38 |       // Retorna para a aba Ativas e verifica se a interface carregou a lista principal
  39 |       await page.click('button:has-text("Instituições Ativas")');
  40 |       await expect(page.locator('table')).toBeVisible();
  41 |     } else {
  42 |       // Caso não existam pendências, valida a mensagem de lista vazia
  43 |       await expect(page.locator('text=Nenhuma solicitação pendente no momento.')).toBeVisible();
  44 |     }
  45 |   });
  46 | });
```