import { test, expect } from '@playwright/test';

test.describe('Fluxo de Atualização do Perfil da Instituição', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');

    await page.evaluate(() => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('userRole', 'instituicao');
    });

    await page.goto('http://localhost:5173/instituicao/profile');
  });

  test('Deve preencher o formulário público e visualizar a notificação de sucesso', async ({ page }) => {
      // Aguarda o carregamento do cabeçalho principal
      await expect(page.getByRole('heading', { name: 'Meu Perfil Institucional', level: 1 })).toBeVisible();

      // Preenche a descrição longa (placeholder corrigido)
      const descricaoLocator = page.getByPlaceholder('Conte um pouco sobre a metodologia...');
      await descricaoLocator.fill('Escola de tecnologia focada no desenvolvimento de software e inovação.');

      // Preenche a URL do Website (placeholder corrigido para .pt)
      const websiteLocator = page.getByPlaceholder('https://suaescola.com.pt');
      await websiteLocator.fill('https://escola-sonatta.com');

      // Intercepta a requisição da API para garantir que o teste seja determinístico
      await page.route('**/api/instituicoes/profile', async route => {
        const json = { message: 'Perfil público atualizado com sucesso!', instituicao: {} };
        await route.fulfill({ status: 200, json });
      });

      // Clica no botão de salvar usando a semântica correta (texto corrigido)
      await page.getByRole('button', { name: 'Salvar Identidade Pública' }).click();

      // Valida o feedback visual (Toast notification)
      const toastMessage = page.getByText('Perfil público atualizado com sucesso!');
      await expect(toastMessage).toBeVisible();
    });
});