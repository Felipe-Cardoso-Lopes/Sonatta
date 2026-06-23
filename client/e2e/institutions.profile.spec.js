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
    await page.route('**/api/instituicoes/profile', async route => {
      const json = {
        message: 'Perfil público atualizado com sucesso!',
        instituicao: {},
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(json),
      });
    });

    await page
      .getByTestId('institution-description-input')
      .fill('Escola de tecnologia focada no desenvolvimento de software e inovação.');

    await page
      .getByPlaceholder('https://suaescola.com.pt')
      .fill('https://escola-sonatta.com');

    await page.click('button:has-text("Salvar Identidade Pública")');

    await expect(
      page.locator('text=Perfil público atualizado com sucesso!')
    ).toBeVisible();
  });
});