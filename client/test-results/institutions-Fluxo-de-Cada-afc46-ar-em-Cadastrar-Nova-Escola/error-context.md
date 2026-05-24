# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: institutions.spec.js >> Fluxo de Cadastro de Instituição (TC-005) >> deve abrir o modal ao clicar em Cadastrar Nova Escola
- Location: e2e\institutions.spec.js:19:3

# Error details

```
Error: browser.newPage: Error reading storage state from e2e/.auth/superadmin.json:
ENOENT: no such file or directory, open 'E:\Users\João Roberto\Sonatta\client\e2e\.auth\superadmin.json'
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // Faz login uma vez e salva a sessão
  4  | test.beforeAll(async ({ browser }) => {
> 5  |   const page = await browser.newPage();
     |                              ^ Error: browser.newPage: Error reading storage state from e2e/.auth/superadmin.json:
  6  |   await page.goto('/login');
  7  |   await page.fill('input[type="email"]', 'joaoroberto@email.com');
  8  |   await page.fill('input[type="password"]', '123456');
  9  |   await page.click('button[type="submit"]');
  10 |   await expect(page).toHaveURL(/super-admin\/dashboard/, { timeout: 15000 });
  11 |   await page.context().storageState({ path: 'e2e/.auth/superadmin.json' });
  12 |   await page.close();
  13 | });
  14 | 
  15 | test.describe('Fluxo de Cadastro de Instituição (TC-005)', () => {
  16 | 
  17 |   test.use({ storageState: 'e2e/.auth/superadmin.json' });
  18 | 
  19 |   test('deve abrir o modal ao clicar em Cadastrar Nova Escola', async ({ page }) => {
  20 |     await page.goto('/super-admin/schools');
  21 |     await page.click('button:has-text("Cadastrar Nova Escola")');
  22 |     await expect(page.locator('input[name="nome"]')).toBeVisible();
  23 |     await expect(page.locator('input[name="email"]')).toBeVisible();
  24 |   });
  25 | 
  26 |   test('deve bloquear cadastro com campos obrigatórios vazios', async ({ page }) => {
  27 |     await page.goto('/super-admin/schools');
  28 |     await page.click('button:has-text("Cadastrar Nova Escola")');
  29 |     await page.click('button:has-text("Cadastrar Escola")');
  30 |     const nomeInput = page.locator('input[name="nome"]');
  31 |     await expect(nomeInput).toBeFocused();
  32 |   });
  33 | 
  34 |   test('deve cadastrar uma nova instituição com sucesso', async ({ page }) => {
  35 |     await page.goto('/super-admin/schools');
  36 |     await page.click('button:has-text("Cadastrar Nova Escola")');
  37 | 
  38 |     await page.fill('input[name="nome"]', 'Escola Teste Playwright');
  39 |     await page.fill('input[name="email"]', `playwright.${Date.now()}@teste.com`);
  40 |     await page.fill('input[name="telefone"]', '(61) 99999-0000');
  41 |     await page.fill('input[name="cidade"]', 'Brasília');
  42 |     await page.fill('input[name="codigo_aluno"]', `ALU-PW${Date.now()}`);
  43 |     await page.fill('input[name="codigo_professor"]', `PRF-PW${Date.now()}`);
  44 | 
  45 |     page.once('dialog', async dialog => {
  46 |       expect(dialog.message()).toContain('sucesso');
  47 |       await dialog.accept();
  48 |     });
  49 | 
  50 |     await page.click('button:has-text("Cadastrar Escola")');
  51 |     await expect(page.locator('input[name="nome"]')).not.toBeVisible({ timeout: 8000 });
  52 |   });
  53 | 
  54 |   test('deve fechar o modal ao clicar em Cancelar', async ({ page }) => {
  55 |     await page.goto('/super-admin/schools');
  56 |     await page.click('button:has-text("Cadastrar Nova Escola")');
  57 |     await expect(page.locator('input[name="nome"]')).toBeVisible();
  58 |     await page.click('button:has-text("Cancelar")');
  59 |     await expect(page.locator('input[name="nome"]')).not.toBeVisible();
  60 |   });
  61 | 
  62 | });
  63 | 
  64 | test.describe('Controle de Acesso (TC-005)', () => {
  65 | 
  66 |   test('aluno não deve ver conteúdo de super admin ao acessar /super-admin/schools', async ({ page }) => {
  67 |     // Loga como aluno sem storageState do super admin
  68 |     await page.goto('/login');
  69 |     await page.fill('input[type="email"]', 'lucas.aluno@estreladonorte.com.br');
  70 |     await page.fill('input[type="password"]', '123456');
  71 |     await page.click('button[type="submit"]');
  72 |     await expect(page).toHaveURL(/student\/dashboard/, { timeout: 10000 });
  73 | 
  74 |     // Tenta acessar rota protegida
  75 |     await page.goto('/super-admin/schools');
  76 | 
  77 |     // Deve ser redirecionado para o dashboard do aluno ou login
  78 |     await expect(page).not.toHaveURL(/super-admin\/schools/, { timeout: 5000 });
  79 |   });
  80 | 
  81 | });
```