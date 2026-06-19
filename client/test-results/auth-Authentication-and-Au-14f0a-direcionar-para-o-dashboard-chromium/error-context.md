# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication and Authorization Flows >> deve fazer login como aluno e redirecionar para o dashboard
- Location: e2e\auth.spec.js:5:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /student\/dashboard/
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
    - text: lucas.aluno@estreladonorte.com.br
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
  3  | test.describe('Authentication and Authorization Flows', () => {
  4  | 
  5  |     test('deve fazer login como aluno e redirecionar para o dashboard', async ({ page }) => {
  6  |         await page.goto('/login');
  7  | 
  8  |         await page.fill('[data-testid="login-email-input"]', 'lucas.aluno@estreladonorte.com.br');
  9  |         await page.fill('[data-testid="login-password-input"]', '123456');
  10 |         await page.click('[data-testid="login-submit-button"]');
  11 | 
> 12 |         await expect(page).toHaveURL(/student\/dashboard/, { timeout: 10000 });
     |                            ^ Error: expect(page).toHaveURL(expected) failed
  13 |     });
  14 | 
  15 |     test('deve fazer login como professor e redirecionar para o dashboard', async ({ page }) => {
  16 |         await page.goto('/login');
  17 | 
  18 |         await page.fill('[data-testid="login-email-input"]', 'ana.prof@estreladonorte.com.br');
  19 |         await page.fill('[data-testid="login-password-input"]', '123456');
  20 |         await page.click('[data-testid="login-submit-button"]');
  21 | 
  22 |         await expect(page).toHaveURL(/teacher\/dashboard/, { timeout: 10000 });
  23 |     });
  24 | 
  25 |     test('deve exibir alerta com credenciais inválidas', async ({ page }) => {
  26 |         await page.goto('/login');
  27 | 
  28 |         await page.fill('[data-testid="login-email-input"]', 'inexistente@teste.com');
  29 |         await page.fill('[data-testid="login-password-input"]', 'senha-errada');
  30 | 
  31 |         // Captura o alert antes de clicar
  32 |         page.once('dialog', async dialog => {
  33 |             expect(dialog.message()).toContain('Credenciais inválidas');
  34 |             await dialog.accept();
  35 |         });
  36 | 
  37 |         await page.click('[data-testid="login-submit-button"]');
  38 |     });
  39 | 
  40 |     test('deve redirecionar usuário não autenticado que tenta acessar rota protegida', async ({ page }) => {
  41 |         // Tenta acessar o dashboard do aluno diretamente sem estar logado
  42 |         await page.goto('/student/dashboard');
  43 | 
  44 |         // Essa validação pode falhar caso a proteção de rota não esteja implementada no frontend
  45 |         await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
  46 |     });
  47 | 
  48 | });
  49 | 
```