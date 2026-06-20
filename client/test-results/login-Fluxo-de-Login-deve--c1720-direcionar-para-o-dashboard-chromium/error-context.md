# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.js >> Fluxo de Login >> deve fazer login como professor e redirecionar para o dashboard
- Location: e2e\login.spec.js:15:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /teacher\/dashboard/
Received string:  "http://localhost:5173/login"
Timeout: 10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    23 × unexpected value "http://localhost:5173/login"

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
    - text: ana.prof@estreladonorte.com.br
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
  3  | test.describe('Fluxo de Login', () => {
  4  | 
  5  |     test('deve fazer login como aluno e redirecionar para o dashboard', async ({ page }) => {
  6  |         await page.goto('/login');
  7  | 
  8  |         await page.fill('input[type="email"]', 'lucas.aluno@estreladonorte.com.br');
  9  |         await page.fill('input[type="password"]', '123456');
  10 |         await page.click('button[type="submit"]');
  11 | 
  12 |         await expect(page).toHaveURL(/student\/dashboard/, { timeout: 10000 });
  13 |     });
  14 | 
  15 |     test('deve fazer login como professor e redirecionar para o dashboard', async ({ page }) => {
  16 |         await page.goto('/login');
  17 | 
  18 |         await page.fill('input[type="email"]', 'ana.prof@estreladonorte.com.br');
  19 |         await page.fill('input[type="password"]', '123456');
  20 |         await page.click('button[type="submit"]');
  21 | 
> 22 |         await expect(page).toHaveURL(/teacher\/dashboard/, { timeout: 10000 });
     |                            ^ Error: expect(page).toHaveURL(expected) failed
  23 |     });
  24 | 
  25 |     test('deve exibir alerta com credenciais inválidas', async ({ page }) => {
  26 |         await page.goto('/login');
  27 | 
  28 |         await page.fill('input[type="email"]', 'inexistente@teste.com');
  29 |         await page.fill('input[type="password"]', 'senha-errada');
  30 | 
  31 |         // Captura o alert antes de clicar
  32 |         page.once('dialog', async dialog => {
  33 |             expect(dialog.message()).toContain('E-mail ou senha inválidos');
  34 |             await dialog.accept();
  35 |         });
  36 | 
  37 |         await page.click('button[type="submit"]');
  38 |     });
  39 | 
  40 |     test('deve fazer login como super_admin e redirecionar para a torre de controle', async ({ page }) => {
  41 |         await page.goto('/login');
  42 | 
  43 |         await page.fill('input[type="email"]', 'joaoroberto@email.com');
  44 |         await page.fill('input[type="password"]', '123456');
  45 |         await page.click('button[type="submit"]');
  46 | 
  47 |         await expect(page).toHaveURL(/super-admin\/dashboard/, { timeout: 10000 });
  48 |     });
  49 | 
  50 | });
```