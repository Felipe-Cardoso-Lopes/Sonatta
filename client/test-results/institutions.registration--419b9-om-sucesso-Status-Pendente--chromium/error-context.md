# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: institutions.registration.spec.js >> Cadastro Público de Instituição >> Deve preencher e submeter o formulário com sucesso (Status Pendente)
- Location: e2e\institutions.registration.spec.js:20:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Solicitação recebida com sucesso!')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 60000ms
  - waiting for locator('text=Solicitação recebida com sucesso!')

```

```yaml
- heading "Sonatta para Escolas" [level=1]
- paragraph: Preencha os dados abaixo para solicitar o acesso da sua instituição à plataforma.
- list:
  - listitem: Erro de conexão com o servidor. Verifique sua internet e tente novamente.
- text: Nome da Escola *
- 'textbox "Ex: Escola Harmonia"': Escola E2E Playwright
- text: E-mail de Contato *
- textbox "contato@escola.com": e2e-1781966513904@escola.com
- text: Telefone / WhatsApp *
- textbox "(61) 90000-0000": "11999999999"
- text: Cidade / Estado *
- 'textbox "Ex: Brasília - DF"': São Paulo - SP
- button "Solicitar Acesso"
- link "← Voltar para o Login":
  - /url: /login
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Cadastro Público de Instituição', () => {
  4  |   
  5  |   test.beforeEach(async ({ page }) => {
  6  |     // Acessa a rota pública de cadastro
  7  |     await page.goto('/cadastro-instituicao');
  8  |   });
  9  | 
  10 |    //test('Deve exibir erros de validação ao tentar submeter um formulário vazio', async ({ page }) => {
  11 |     // Clica no botão de submissão sem preencher campos
  12 |     //await page.click('button[type="submit"]');
  13 | 
  14 |     // Verifica a presença das mensagens de erro na interface
  15 |     //await expect(page.locator('text=O Nome da Escola deve ter pelo menos 3 caracteres.')).toBeVisible();
  16 |     //await expect(page.locator('text=Informe um e-mail válido.')).toBeVisible();
  17 |     //await expect(page.locator('text=Informe um telefone válido')).toBeVisible();
  18 |   //}); 
  19 | 
  20 |   test('Deve preencher e submeter o formulário com sucesso (Status Pendente)', async ({ page }) => {
  21 |     // Preenche os campos do formulário
  22 |     await page.fill('input[name="nome"]', 'Escola E2E Playwright');
  23 |     await page.fill('input[name="email"]', `e2e-${Date.now()}@escola.com`); // E-mail dinâmico para evitar conflito de unicidade
  24 |     await page.fill('input[name="telefone"]', '11999999999');
  25 |     await page.fill('input[name="cidade"]', 'São Paulo - SP');
  26 | 
  27 |     // Submete o formulário
  28 |     await page.click('button[type="submit"]');
  29 | 
  30 |     // Valida a exibição do feedback de sucesso e o desaparecimento do formulário
  31 |     const successMessage = page.locator('text=Solicitação recebida com sucesso!');
> 32 |     await expect(successMessage).toBeVisible();
     |                                  ^ Error: expect(locator).toBeVisible() failed
  33 |     await expect(page.locator('input[name="nome"]')).toBeHidden();
  34 |   });
  35 | });
```