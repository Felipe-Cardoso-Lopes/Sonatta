# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: institutions.spec.js >> Fluxo de Cadastro de Instituição (TC-005) >> deve fechar o modal ao clicar em Cancelar
- Location: e2e\institutions.spec.js:59:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /super-admin/
Received string:  "http://localhost:5173/login"
Timeout: 30000ms

Call log:
  - Expect "toHaveURL" with timeout 30000ms
    61 × unexpected value "http://localhost:5173/login"

```

```yaml
- banner:
  - link "Sonatta Logo":
    - /url: /
    - img "Sonatta Logo"
  - link "Sonatta":
    - /url: /
- main:
  - heading "Entrar" [level=2]
  - text: E-mail
  - textbox "E-mail":
    - /placeholder: seuemail@exemplo.com
    - text: joaoroberto@email.com
  - text: Senha
  - textbox "Senha":
    - /placeholder: "********"
    - text: "123456"
  - button "Mostrar"
  - link "Esqueceu a senha?":
    - /url: /forgot-password
  - button "Entrar"
  - paragraph:
    - text: Não tem uma conta?
    - link "Cadastre-se":
      - /url: /register
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | async function loginAs(page, email, password, expectedURLPattern, timeout = 30000) {
  4  |   await page.goto('/login');
  5  |   await page.fill('input[type="email"]', email);
  6  |   await page.fill('input[type="password"]', password);
  7  |   await page.click('button[type="submit"]');
> 8  |   await expect(page).toHaveURL(expectedURLPattern, { timeout });
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  9  | }
  10 | 
  11 | test.describe('Fluxo de Cadastro de Instituição (TC-005)', () => {
  12 | 
  13 |   test.beforeEach(async ({ page }) => {
  14 |     await loginAs(page, 'joaoroberto@email.com', '123456', /super-admin/);
  15 |     await page.goto('/super-admin/schools');
  16 |     await expect(page).toHaveURL(/super-admin\/schools/);
  17 |   });
  18 | 
  19 |   test('deve abrir o modal ao clicar em Cadastrar Nova Escola', async ({ page }) => {
  20 |     const btnCadastrar = page.getByRole('button', { name: /cadastrar manualmente/i });
  21 |     await expect(btnCadastrar).toBeVisible({ timeout: 10000 });
  22 |     await btnCadastrar.click();
  23 |     await expect(page.locator('input[name="nome"]')).toBeVisible({ timeout: 5000 });
  24 |   });
  25 | 
  26 |   test('deve bloquear cadastro com campos obrigatórios vazios', async ({ page }) => {
  27 |     const btnCadastrar = page.getByRole('button', { name: /cadastrar manualmente/i });
  28 |     await expect(btnCadastrar).toBeVisible({ timeout: 10000 });
  29 |     await btnCadastrar.click();
  30 |     await expect(page.locator('input[name="nome"]')).toBeVisible({ timeout: 5000 });
  31 | 
  32 |     await page.getByRole('button', { name: /cadastrar escola/i }).click();
  33 | 
  34 |     await expect(page.locator('input[name="nome"]')).toBeFocused();
  35 |   });
  36 | 
  37 |   test('deve cadastrar uma nova instituição com sucesso', async ({ page }) => {
  38 |     const btnCadastrar = page.getByRole('button', { name: /cadastrar manualmente/i });
  39 |     await expect(btnCadastrar).toBeVisible({ timeout: 10000 });
  40 |     await btnCadastrar.click();
  41 |     await expect(page.locator('input[name="nome"]')).toBeVisible({ timeout: 5000 });
  42 | 
  43 |     await page.fill('input[name="nome"]', 'Escola Teste Playwright');
  44 |     await page.fill('input[name="email"]', `playwright.${Date.now()}@teste.com`);
  45 |     await page.fill('input[name="telefone"]', '(61) 99999-0000');
  46 |     await page.fill('input[name="cidade"]', 'Brasília');
  47 |     await page.fill('input[name="codigo_aluno"]', `ALU-PW${Date.now()}`);
  48 |     await page.fill('input[name="codigo_professor"]', `PRF-PW${Date.now()}`);
  49 | 
  50 |     page.once('dialog', async dialog => {
  51 |       expect(dialog.message()).toContain('sucesso');
  52 |       await dialog.accept();
  53 |     });
  54 | 
  55 |     await page.getByRole('button', { name: /cadastrar escola/i }).click();
  56 |     await expect(page.locator('input[name="nome"]')).not.toBeVisible({ timeout: 10000 });
  57 |   });
  58 | 
  59 |   test('deve fechar o modal ao clicar em Cancelar', async ({ page }) => {
  60 |     const btnCadastrar = page.getByRole('button', { name: /cadastrar manualmente/i });
  61 |     await expect(btnCadastrar).toBeVisible({ timeout: 10000 });
  62 |     await btnCadastrar.click();
  63 |     await expect(page.locator('input[name="nome"]')).toBeVisible({ timeout: 5000 });
  64 | 
  65 |     await page.getByRole('button', { name: /cancelar/i }).click();
  66 |     await expect(page.locator('input[name="nome"]')).not.toBeVisible({ timeout: 5000 });
  67 |   });
  68 | });
  69 | 
  70 | test('aluno não deve ver conteúdo de super admin ao acessar /super-admin/schools', async ({ page }) => {
  71 |   await page.goto('/login');
  72 |   await page.fill('input[type="email"]', 'lucas.aluno@estreladonorte.com.br');
  73 |   await page.fill('input[type="password"]', '123456');
  74 |   await page.click('button[type="submit"]');
  75 |   await expect(page).toHaveURL(/student\/dashboard/, { timeout: 15000 });
  76 | 
  77 |   await page.goto('/super-admin/schools');
  78 |   await expect(page).toHaveURL(/login/, { timeout: 15000 });
  79 | });
```