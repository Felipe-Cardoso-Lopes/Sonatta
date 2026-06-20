# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: institutions.profile.spec.js >> Fluxo de Atualização do Perfil da Instituição >> Deve preencher o formulário público e visualizar a notificação de sucesso
- Location: e2e\institutions.profile.spec.js:16:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Perfil Público da Escola')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 60000ms
  - waiting for locator('text=Perfil Público da Escola')

```

```yaml
- complementary:
  - link "Sonatta Logo":
    - /url: /instituicao/dashboard
    - img "Sonatta Logo"
  - link "Ícone de Visão Geral":
    - /url: /instituicao/overview
    - img "Ícone de Visão Geral"
  - link "Ícone de Gerenciamento":
    - /url: /instituicao/management
    - img "Ícone de Gerenciamento"
  - link "Ícone de Financeiro":
    - /url: /instituicao/financial
    - img "Ícone de Financeiro"
  - link "Ícone de Configurações":
    - /url: /instituicao/settings
    - img "Ícone de Configurações"
  - link "Perfil":
    - /url: /instituicao/profile
    - img "Perfil"
- main:
  - heading "Meu Perfil Institucional" [level=1]
  - paragraph: Faça a gestão da montra pública da sua instituição e credenciais administrativas.
  - button "Identidade Pública"
  - button "Conta Administrativa"
  - text: Banner não definido Sem Logo
  - heading "Nome da Instituição" [level=2]
  - paragraph: Adicione uma descrição na edição abaixo para que os alunos a vejam aqui.
  - heading "Editar Informações Públicas" [level=2]
  - paragraph: As imagens e descrições definidas aqui constroem a página principal da sua escola.
  - text: Logótipo da Instituição 📁
  - paragraph: "Recomendado: 400x400px"
  - paragraph: PDF, DOCX, Imagens ou MP4 (Máx. 10MB)
  - text: Banner de Fundo 📁
  - paragraph: "Recomendado: 1200x400px"
  - paragraph: PDF, DOCX, Imagens ou MP4 (Máx. 10MB)
  - text: Sobre a Escola (Descrição)
  - textbox "Conte um pouco sobre a metodologia..."
  - text: Website Oficial
  - textbox "https://suaescola.com.pt"
  - text: Instagram
  - textbox "Link do perfil"
  - text: LinkedIn
  - textbox "Link da página"
  - button "Salvar Identidade Pública"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Fluxo de Atualização do Perfil da Instituição', () => {
  4  |   
  5  |   test.beforeEach(async ({ page }) => {
  6  |     // Simula o login injetando o token diretamente para agilizar o teste E2E
  7  |     await page.goto('http://localhost:5173/login');
  8  |     await page.evaluate(() => {
  9  |       localStorage.setItem('token', 'test-token');
  10 |       localStorage.setItem('userRole', 'instituicao');
  11 |     });
  12 |     // Navega para a página de perfil
  13 |     await page.goto('http://localhost:5173/instituicao/profile');
  14 |   });
  15 | 
  16 |   test('Deve preencher o formulário público e visualizar a notificação de sucesso', async ({ page }) => {
  17 |     // Aguarda o carregamento do cabeçalho do formulário
> 18 |     await expect(page.locator('text=Perfil Público da Escola')).toBeVisible();
     |                                                                 ^ Error: expect(locator).toBeVisible() failed
  19 | 
  20 |     // Preenche a descrição longa
  21 |     const descricaoLocator = page.getByPlaceholder('Conte um pouco sobre a metodologia e história da instituição...');
  22 |     await descricaoLocator.fill('Escola de tecnologia focada no desenvolvimento de software e inovação.');
  23 | 
  24 |     // Preenche a URL do Website
  25 |     const websiteLocator = page.getByPlaceholder('https://suaescola.com.br');
  26 |     await websiteLocator.fill('https://escola-sonatta.com');
  27 | 
  28 |     // Intercepta a requisição da API para garantir que o teste seja determinístico
  29 |     await page.route('**/api/instituicoes/profile', async route => {
  30 |       const json = { message: 'Perfil público atualizado com sucesso!', instituicao: {} };
  31 |       await route.fulfill({ status: 200, json });
  32 |     });
  33 | 
  34 |     // Clica no botão de salvar
  35 |     await page.click('button:has-text("Salvar Perfil Público")');
  36 | 
  37 |     // Valida o feedback visual (Toast notification)
  38 |     const toastMessage = page.locator('text=Perfil público atualizado com sucesso!');
  39 |     await expect(toastMessage).toBeVisible();
  40 |   });
  41 | });
```