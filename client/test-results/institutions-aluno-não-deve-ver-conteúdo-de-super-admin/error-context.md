# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: institutions.spec.js >> aluno não deve ver conteúdo de super admin
- Location: e2e\institutions.spec.js:60:1

# Error details

```
Error: expect(page).not.toHaveURL(expected) failed

Expected pattern: not /super-admin\/schools/
Received string: "https://sonatta-five.vercel.app/super-admin/schools"
Timeout: 10000ms

Call log:
  - Expect "not toHaveURL" with timeout 10000ms
    23 × unexpected value "https://sonatta-five.vercel.app/super-admin/schools"

```

```yaml
- complementary:
  - link "Sonatta Logo":
    - /url: /super-admin/dashboard
    - img "Sonatta Logo"
  - link "Gestão de Escolas":
    - /url: /super-admin/schools
    - img "Gestão de Escolas"
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
  - paragraph: Gerencie todas as escolas de música conectadas à plataforma.
  - button "+ Cadastrar Nova Escola"
  - textbox "Pesquisar escola pelo nome..."
  - table:
    - rowgroup:
      - row "Nome da Instituição Localização Status Ações":
        - columnheader "Nome da Instituição"
        - columnheader "Localização"
        - columnheader "Status"
        - columnheader "Ações"
    - rowgroup:
      - row "Academia de Música Tom Jobim Rio de Janeiro - RJ Ativa Editar Relatórios":
        - cell "Academia de Música Tom Jobim"
        - cell "Rio de Janeiro - RJ"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
      - row "Centro Educacional Luminar Brasília Ativa Editar Relatórios":
        - cell "Centro Educacional Luminar"
        - cell "Brasília"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
      - row "Colégio Estrela do Norte Brasília Ativa Editar Relatórios":
        - cell "Colégio Estrela do Norte"
        - cell "Brasília"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
      - row "Conservatório Harmonia São Paulo - SP Ativa Editar Relatórios":
        - cell "Conservatório Harmonia"
        - cell "São Paulo - SP"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
      - row "Escola Horizonte Digital Goiânia Ativa Editar Relatórios":
        - cell "Escola Horizonte Digital"
        - cell "Goiânia"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
      - row "Escola Teste Playwright Brasília Ativa Editar Relatórios":
        - cell "Escola Teste Playwright"
        - cell "Brasília"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
      - row "Escola Teste Playwright Brasília Ativa Editar Relatórios":
        - cell "Escola Teste Playwright"
        - cell "Brasília"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
      - row "Escola Teste Playwright Brasília Ativa Editar Relatórios":
        - cell "Escola Teste Playwright"
        - cell "Brasília"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
      - row "Escola Teste Playwright Brasília Ativa Editar Relatórios":
        - cell "Escola Teste Playwright"
        - cell "Brasília"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
      - row "Escola Teste Playwright Brasília Ativa Editar Relatórios":
        - cell "Escola Teste Playwright"
        - cell "Brasília"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
      - row "Escola Teste Playwright Brasília Ativa Editar Relatórios":
        - cell "Escola Teste Playwright"
        - cell "Brasília"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
      - row "Escola Teste Playwright Brasília Ativa Editar Relatórios":
        - cell "Escola Teste Playwright"
        - cell "Brasília"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
      - row "Escola Teste Playwright Brasília Ativa Editar Relatórios":
        - cell "Escola Teste Playwright"
        - cell "Brasília"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
      - row "Escola Teste Playwright Brasília Ativa Editar Relatórios":
        - cell "Escola Teste Playwright"
        - cell "Brasília"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
      - row "Instituto de Cordas e Voz Curitiba - PR Ativa Editar Relatórios":
        - cell "Instituto de Cordas e Voz"
        - cell "Curitiba - PR"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
      - row "Instituto Futuro Saber Brasília Ativa Editar Relatórios":
        - cell "Instituto Futuro Saber"
        - cell "Brasília"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
      - row "Studio das Teclas Belo Horizonte - MG Ativa Editar Relatórios":
        - cell "Studio das Teclas"
        - cell "Belo Horizonte - MG"
        - cell "Ativa"
        - cell "Editar Relatórios":
          - button "Editar"
          - button "Relatórios"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Fluxo de Cadastro de Instituição (TC-005)', () => {
  4  | 
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('/login');
  7  |     await page.fill('input[type="email"]', 'joaoroberto@email.com');
  8  |     await page.fill('input[type="password"]', '123456');
  9  |     await page.click('button[type="submit"]');
  10 |     
  11 |     // Timeout de 30s para o Render acordar
  12 |     await expect(page).toHaveURL(/super-admin\/dashboard/, { timeout: 30000 });
  13 |     await page.goto('/super-admin/schools');
  14 |   });
  15 | 
  16 |   test('deve abrir o modal ao clicar em Cadastrar Nova Escola', async ({ page }) => {
  17 |     await page.click('button:has-text("Cadastrar Nova Escola")');
  18 |     await expect(page.locator('input[name="nome"]')).toBeVisible();
  19 |   });
  20 | 
  21 |   test('deve bloquear cadastro com campos obrigatórios vazios', async ({ page }) => {
  22 |     await page.click('button:has-text("Cadastrar Nova Escola")');
  23 |     await page.click('button:has-text("Cadastrar Escola")');
  24 |     
  25 |     // Verifica se o foco voltou para o input de nome (bloqueado pelo HTML5 required)
  26 |     const nomeInput = page.locator('input[name="nome"]');
  27 |     await expect(nomeInput).toBeFocused();
  28 |   });
  29 | 
  30 |   test('deve cadastrar uma nova instituição com sucesso', async ({ page }) => {
  31 |     await page.click('button:has-text("Cadastrar Nova Escola")');
  32 |     
  33 |     await page.fill('input[name="nome"]', 'Escola Teste Playwright');
  34 |     await page.fill('input[name="email"]', `playwright.${Date.now()}@teste.com`);
  35 |     await page.fill('input[name="telefone"]', '(61) 99999-0000');
  36 |     await page.fill('input[name="cidade"]', 'Brasília');
  37 |     await page.fill('input[name="codigo_aluno"]', `ALU-PW${Date.now()}`);
  38 |     await page.fill('input[name="codigo_professor"]', `PRF-PW${Date.now()}`);
  39 | 
  40 |     // Prepara para aceitar o "alert" de sucesso
  41 |     page.once('dialog', async dialog => {
  42 |       expect(dialog.message()).toContain('sucesso');
  43 |       await dialog.accept();
  44 |     });
  45 | 
  46 |     await page.click('button:has-text("Cadastrar Escola")');
  47 |     
  48 |     // Aguarda o modal desaparecer da tela (indicando sucesso)
  49 |     await expect(page.locator('input[name="nome"]')).not.toBeVisible({ timeout: 8000 });
  50 |   });
  51 | 
  52 |   test('deve fechar o modal ao clicar em Cancelar', async ({ page }) => {
  53 |     await page.click('button:has-text("Cadastrar Nova Escola")');
  54 |     await expect(page.locator('input[name="nome"]')).toBeVisible();
  55 |     await page.click('button:has-text("Cancelar")');
  56 |     await expect(page.locator('input[name="nome"]')).not.toBeVisible();
  57 |   });
  58 | });
  59 | 
  60 | test('aluno não deve ver conteúdo de super admin', async ({ page }) => {
  61 |   // Aumente o timeout do login para cobrir o Cold Start do Render
  62 |   await page.goto('/login', { timeout: 60000 });
  63 |   await page.fill('input[type="email"]', 'lucas.aluno@estreladonorte.com.br');
  64 |   await page.fill('input[type="password"]', '123456');
  65 |   await page.click('button[type="submit"]');
  66 |   
  67 |   // Garante que logou como aluno primeiro
  68 |   await expect(page).toHaveURL(/student\/dashboard/, { timeout: 30000 });
  69 | 
  70 |   // Tenta acessar a rota proibida
  71 |   await page.goto('/super-admin/schools');
  72 |   
  73 |   // O teste deve validar que ele foi expulso (ou nunca entrou)
  74 |   // Verificamos que a URL NÃO contém a rota de admin
> 75 |   await expect(page).not.toHaveURL(/super-admin\/schools/, { timeout: 10000 });
     |                          ^ Error: expect(page).not.toHaveURL(expected) failed
  76 | });
```