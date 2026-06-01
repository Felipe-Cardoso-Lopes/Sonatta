# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: institutions.spec.js >> Fluxo de Cadastro de Instituição (TC-005) >> deve abrir o modal ao clicar em Cadastrar Nova Escola
- Location: e2e\institutions.spec.js:16:3

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /super-admin\/dashboard/
Received string:  "https://sonatta-five.vercel.app/login"

Call log:
  - Expect "toHaveURL" with timeout 30000ms
    49 × unexpected value "https://sonatta-five.vercel.app/login"

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
  3  | test.describe('Fluxo de Cadastro de Instituição (TC-005)', () => {
  4  | 
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('/login');
  7  |     await page.fill('input[type="email"]', 'joaoroberto@email.com');
  8  |     await page.fill('input[type="password"]', '123456');
  9  |     await page.click('button[type="submit"]');
  10 |     
  11 |     // Timeout de 30s para o Render acordar
> 12 |     await expect(page).toHaveURL(/super-admin\/dashboard/, { timeout: 30000 });
     |                        ^ Error: expect(page).toHaveURL(expected) failed
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
  60 | test('aluno não deve ver conteúdo de super admin ao acessar /super-admin/schools', async ({ page }) => {
  61 |   await page.goto('/login');
  62 |   await page.fill('input[type="email"]', 'lucas.aluno@estreladonorte.com.br');
  63 |   await page.fill('input[type="password"]', '123456');
  64 |   await page.click('button[type="submit"]');
  65 |   await expect(page).toHaveURL(/student\/dashboard/, { timeout: 15000 });
  66 | 
  67 |   await page.goto('/super-admin/schools');
  68 | 
  69 |   // Aguarda o redirect acontecer após o useEffect
  70 |   await expect(page).not.toHaveURL(/super-admin\/schools/, { timeout: 15000 });
  71 | });
```