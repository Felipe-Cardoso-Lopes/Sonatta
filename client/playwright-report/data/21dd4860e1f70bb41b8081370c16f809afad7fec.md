# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: institutions.spec.js >> Fluxo de Cadastro de Instituição (TC-005) >> deve abrir o modal ao clicar em + Cadastrar Manualmente
- Location: e2e\institutions.spec.js:16:3

# Error details

```
TimeoutError: page.click: Timeout 60000ms exceeded.
Call log:
  - waiting for locator('button:has-text("+ Cadastrar Manualmente")')

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
  16 |   test('deve abrir o modal ao clicar em + Cadastrar Manualmente', async ({ page }) => {
> 17 |     await page.click('button:has-text("+ Cadastrar Manualmente")');
     |                ^ TimeoutError: page.click: Timeout 60000ms exceeded.
  18 |     await expect(page.locator('input[name="nome"]')).toBeVisible();
  19 |   });
  20 | 
  21 |   test('deve bloquear cadastro com campos obrigatórios vazios', async ({ page }) => {
  22 |     await page.click('button:has-text("+ Cadastrar Manualmente")');
  23 |     await page.click('button:has-text("Cadastrar Escola")');
  24 |     
  25 |     // Verifica se o foco voltou para o input de nome (bloqueado pelo HTML5 required)
  26 |     const nomeInput = page.locator('input[name="nome"]');
  27 |     await expect(nomeInput).toBeFocused();
  28 |   });
  29 | 
  30 |   test('deve cadastrar uma nova instituição com sucesso', async ({ page }) => {
  31 |     // 1. ABRIR O MODAL PRIMEIRO
  32 |     await page.click('button:has-text("+ Cadastrar Manualmente")');
  33 |     
  34 |     // 2. PREENCHER OS DADOS COM O MODAL ABERTO
  35 |     await page.fill('input[name="nome"]', 'Escola Teste Playwright');
  36 |     await page.fill('input[name="email"]', `playwright.${Date.now()}@teste.com`);
  37 |     await page.fill('input[name="telefone"]', '(61) 99999-0000');
  38 |     await page.fill('input[name="cidade"]', 'Brasília');
  39 |     await page.fill('input[name="codigo_aluno"]', `ALU-PW${Date.now()}`);
  40 |     await page.fill('input[name="codigo_professor"]', `PRF-PW${Date.now()}`);
  41 | 
  42 |     // 3. PREPARAR INTERCEPTAÇÃO DO ALERT
  43 |     page.once('dialog', async dialog => {
  44 |       expect(dialog.message()).toContain('sucesso');
  45 |       await dialog.accept();
  46 |     });
  47 | 
  48 |     // 4. CLICAR NO BOTÃO DE CADASTRAR/SUBMETER (E não no de abrir o modal)
  49 |     await page.click('button:has-text("Cadastrar Escola")');
  50 |     
  51 |     // 5. VALIDAR O DESAPARECIMENTO DO MODAL
  52 |     await expect(page.locator('input[name="nome"]')).not.toBeVisible({ timeout: 8000 });
  53 |   });
  54 | 
  55 |   test('deve fechar o modal ao clicar em Cancelar', async ({ page }) => {
  56 |     await page.click('button:has-text("+ Cadastrar Manualmente")');
  57 |     await expect(page.locator('input[name="nome"]')).toBeVisible();
  58 |     await page.click('button:has-text("Cancelar")');
  59 |     await expect(page.locator('input[name="nome"]')).not.toBeVisible();
  60 |   });
  61 | });
  62 | 
  63 | test('aluno não deve ver conteúdo de super admin ao acessar /super-admin/schools', async ({ page }) => {
  64 |   await page.goto('/login');
  65 |   await page.fill('input[type="email"]', 'lucas.aluno@estreladonorte.com.br');
  66 |   await page.fill('input[type="password"]', '123456');
  67 |   await page.click('button[type="submit"]');
  68 |   await expect(page).toHaveURL(/student\/dashboard/, { timeout: 15000 });
  69 | 
  70 |   await page.goto('/super-admin/schools');
  71 | 
  72 |   // Aguarda o redirect acontecer após o useEffect
  73 |   await expect(page).not.toHaveURL(/super-admin\/schools/, { timeout: 15000 });
  74 | });
```