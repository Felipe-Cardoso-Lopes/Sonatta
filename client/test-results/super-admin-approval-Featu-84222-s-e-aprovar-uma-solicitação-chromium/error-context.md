# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: super-admin-approval.spec.js >> Feature 13/14: Painel de Aprovação do Super Admin >> Deve visualizar instituições pendentes e aprovar uma solicitação
- Location: e2e\super-admin-approval.spec.js:16:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Nenhuma solicitação pendente no momento.')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 60000ms
  - waiting for locator('text=Nenhuma solicitação pendente no momento.')

```

```yaml
- complementary:
  - link "Sonatta Logo":
    - /url: /super-admin/dashboard
    - img "Sonatta Logo"
  - link "Gestão de Escolas":
    - /url: /super-admin/schools
    - img "Gestão de Escolas"
  - link "Professores Solo":
    - /url: /super-admin/solo-teachers
    - img "Professores Solo"
  - link "Assinaturas SaaS":
    - /url: /super-admin/subscriptions
    - img "Assinaturas SaaS"
  - link "Sistema e Logs":
    - /url: /super-admin/system
    - img "Sistema e Logs"
  - button "Sair do Sistema":
    - img
- main:
  - heading "Instituições Parceiras" [level=1]
  - paragraph: Gerencie todas as escolas conectadas ou pendentes na plataforma.
  - button "+ Cadastrar Manualmente"
  - textbox "Pesquisar escola pelo nome..."
  - button "Instituições Ativas (10)"
  - button "Solicitações Pendentes 11"
  - table:
    - rowgroup:
      - row "Nome / E-mail Telefone / Local Status Ações":
        - columnheader "Nome / E-mail"
        - columnheader "Telefone / Local"
        - columnheader "Status"
        - columnheader "Ações"
    - rowgroup:
      - row "Escola E2E Playwright e2e-1780338532394@escola.com 11999999999 São Paulo - SP Pendente Aprovar Recusar":
        - cell "Escola E2E Playwright e2e-1780338532394@escola.com":
          - paragraph: Escola E2E Playwright
          - paragraph: e2e-1780338532394@escola.com
        - cell "11999999999 São Paulo - SP":
          - paragraph: "11999999999"
          - paragraph: São Paulo - SP
        - cell "Pendente"
        - cell "Aprovar Recusar":
          - button "Aprovar"
          - button "Recusar"
      - row "Escola E2E Playwright e2e-1780418735731@escola.com 11999999999 São Paulo - SP Pendente Aprovar Recusar":
        - cell "Escola E2E Playwright e2e-1780418735731@escola.com":
          - paragraph: Escola E2E Playwright
          - paragraph: e2e-1780418735731@escola.com
        - cell "11999999999 São Paulo - SP":
          - paragraph: "11999999999"
          - paragraph: São Paulo - SP
        - cell "Pendente"
        - cell "Aprovar Recusar":
          - button "Aprovar"
          - button "Recusar"
      - row "Escola E2E Playwright e2e-1780419558083@escola.com 11999999999 São Paulo - SP Pendente Aprovar Recusar":
        - cell "Escola E2E Playwright e2e-1780419558083@escola.com":
          - paragraph: Escola E2E Playwright
          - paragraph: e2e-1780419558083@escola.com
        - cell "11999999999 São Paulo - SP":
          - paragraph: "11999999999"
          - paragraph: São Paulo - SP
        - cell "Pendente"
        - cell "Aprovar Recusar":
          - button "Aprovar"
          - button "Recusar"
      - row "Escola E2E Playwright e2e-1780420758565@escola.com 11999999999 São Paulo - SP Pendente Aprovar Recusar":
        - cell "Escola E2E Playwright e2e-1780420758565@escola.com":
          - paragraph: Escola E2E Playwright
          - paragraph: e2e-1780420758565@escola.com
        - cell "11999999999 São Paulo - SP":
          - paragraph: "11999999999"
          - paragraph: São Paulo - SP
        - cell "Pendente"
        - cell "Aprovar Recusar":
          - button "Aprovar"
          - button "Recusar"
      - row "Escola E2E Playwright e2e-1780421621857@escola.com 11999999999 São Paulo - SP Pendente Aprovar Recusar":
        - cell "Escola E2E Playwright e2e-1780421621857@escola.com":
          - paragraph: Escola E2E Playwright
          - paragraph: e2e-1780421621857@escola.com
        - cell "11999999999 São Paulo - SP":
          - paragraph: "11999999999"
          - paragraph: São Paulo - SP
        - cell "Pendente"
        - cell "Aprovar Recusar":
          - button "Aprovar"
          - button "Recusar"
      - row "Escola E2E Playwright e2e-1780425033347@escola.com 11999999999 São Paulo - SP Pendente Aprovar Recusar":
        - cell "Escola E2E Playwright e2e-1780425033347@escola.com":
          - paragraph: Escola E2E Playwright
          - paragraph: e2e-1780425033347@escola.com
        - cell "11999999999 São Paulo - SP":
          - paragraph: "11999999999"
          - paragraph: São Paulo - SP
        - cell "Pendente"
        - cell "Aprovar Recusar":
          - button "Aprovar"
          - button "Recusar"
      - row "Escola E2E Playwright e2e-1780425849469@escola.com 11999999999 São Paulo - SP Pendente Aprovar Recusar":
        - cell "Escola E2E Playwright e2e-1780425849469@escola.com":
          - paragraph: Escola E2E Playwright
          - paragraph: e2e-1780425849469@escola.com
        - cell "11999999999 São Paulo - SP":
          - paragraph: "11999999999"
          - paragraph: São Paulo - SP
        - cell "Pendente"
        - cell "Aprovar Recusar":
          - button "Aprovar"
          - button "Recusar"
      - row "Escola E2E Playwright e2e-1780337967518@escola.com 11999999999 São Paulo - SP Pendente Aprovar Recusar":
        - cell "Escola E2E Playwright e2e-1780337967518@escola.com":
          - paragraph: Escola E2E Playwright
          - paragraph: e2e-1780337967518@escola.com
        - cell "11999999999 São Paulo - SP":
          - paragraph: "11999999999"
          - paragraph: São Paulo - SP
        - cell "Pendente"
        - cell "Aprovar Recusar":
          - button "Aprovar"
          - button "Recusar"
      - row "Escola E2E Playwright e2e-1780339258694@escola.com 11999999999 São Paulo - SP Pendente Aprovar Recusar":
        - cell "Escola E2E Playwright e2e-1780339258694@escola.com":
          - paragraph: Escola E2E Playwright
          - paragraph: e2e-1780339258694@escola.com
        - cell "11999999999 São Paulo - SP":
          - paragraph: "11999999999"
          - paragraph: São Paulo - SP
        - cell "Pendente"
        - cell "Aprovar Recusar":
          - button "Aprovar"
          - button "Recusar"
      - row "Escola E2E Playwright e2e-1780342006582@escola.com 11999999999 São Paulo - SP Pendente Aprovar Recusar":
        - cell "Escola E2E Playwright e2e-1780342006582@escola.com":
          - paragraph: Escola E2E Playwright
          - paragraph: e2e-1780342006582@escola.com
        - cell "11999999999 São Paulo - SP":
          - paragraph: "11999999999"
          - paragraph: São Paulo - SP
        - cell "Pendente"
        - cell "Aprovar Recusar":
          - button "Aprovar"
          - button "Recusar"
      - row "Escola E2E Playwright e2e-1780342718329@escola.com 11999999999 São Paulo - SP Pendente Aprovar Recusar":
        - cell "Escola E2E Playwright e2e-1780342718329@escola.com":
          - paragraph: Escola E2E Playwright
          - paragraph: e2e-1780342718329@escola.com
        - cell "11999999999 São Paulo - SP":
          - paragraph: "11999999999"
          - paragraph: São Paulo - SP
        - cell "Pendente"
        - cell "Aprovar Recusar":
          - button "Aprovar"
          - button "Recusar"
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
  21 |     await page.click('button:has-text("Solicitações Pendentes")');
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
> 43 |       await expect(page.locator('text=Nenhuma solicitação pendente no momento.')).toBeVisible();
     |                                                                                   ^ Error: expect(locator).toBeVisible() failed
  44 |     }
  45 |   });
  46 | });
```