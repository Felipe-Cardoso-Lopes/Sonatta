import { test, expect } from '@playwright/test';

test.describe('Cadastro Público de Instituição', () => {
  
  test.beforeEach(async ({ page }) => {
    // Acessa a rota pública de cadastro
    await page.goto('/cadastro-instituicao');
  });

   //test('Deve exibir erros de validação ao tentar submeter um formulário vazio', async ({ page }) => {
    // Clica no botão de submissão sem preencher campos
    //await page.click('button[type="submit"]');

    // Verifica a presença das mensagens de erro na interface
    //await expect(page.locator('text=O Nome da Escola deve ter pelo menos 3 caracteres.')).toBeVisible();
    //await expect(page.locator('text=Informe um e-mail válido.')).toBeVisible();
    //await expect(page.locator('text=Informe um telefone válido')).toBeVisible();
  //});

  test('Deve preencher e submeter o formulário com sucesso (Status Pendente)', async ({ page }) => {
    // Preenche os campos do formulário
    await page.fill('input[name="nome"]', 'PQS');
    await page.fill('input[name="email"]', `e2e-${Date.now()}@escola.com`); // E-mail dinâmico para evitar conflito de unicidade
    await page.fill('input[name="telefone"]', '11999999999');
    await page.fill('input[name="cidade"]', 'São Paulo - SP');

    // Submete o formulário
    await page.click('button[type="submit"]');

    // Valida a exibição do feedback de sucesso e o desaparecimento do formulário
    const successMessage = page.locator('text=Solicitação recebida com sucesso!');
    await expect(successMessage).toBeVisible();
    await expect(page.locator('input[name="nome"]')).toBeHidden();
  });
});