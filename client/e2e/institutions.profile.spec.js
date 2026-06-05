import { test, expect } from '@playwright/test';

test.describe('Fluxo de Atualização do Perfil da Instituição', () => {
  
  test.beforeEach(async ({ page }) => {
    // Simula o login injetando o token diretamente para agilizar o teste E2E
    await page.goto('http://localhost:5173/login');
    await page.evaluate(() => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('userRole', 'instituicao');
    });
    // Navega para a página de perfil
    await page.goto('http://localhost:5173/instituicao/profile');
  });

  test('Deve preencher o formulário público e visualizar a notificação de sucesso', async ({ page }) => {
    // Aguarda o carregamento do cabeçalho do formulário
    await expect(page.locator('text=Perfil Público da Escola')).toBeVisible();

    // Preenche a descrição longa
    const descricaoLocator = page.getByPlaceholder('Conte um pouco sobre a metodologia e história da instituição...');
    await descricaoLocator.fill('Escola de tecnologia focada no desenvolvimento de software e inovação.');

    // Preenche a URL do Website
    const websiteLocator = page.getByPlaceholder('https://suaescola.com.br');
    await websiteLocator.fill('https://escola-sonatta.com');

    // Intercepta a requisição da API para garantir que o teste seja determinístico
    await page.route('**/api/instituicoes/profile', async route => {
      const json = { message: 'Perfil público atualizado com sucesso!', instituicao: {} };
      await route.fulfill({ status: 200, json });
    });

    // Clica no botão de salvar
    await page.click('button:has-text("Salvar Perfil Público")');

    // Valida o feedback visual (Toast notification)
    const toastMessage = page.locator('text=Perfil público atualizado com sucesso!');
    await expect(toastMessage).toBeVisible();
  });
});