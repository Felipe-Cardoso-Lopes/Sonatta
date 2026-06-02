import { test, expect } from '@playwright/test';

test.describe('Feature 13/14: Painel de Aprovação do Super Admin', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Simula o Login do Super Admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'joaoroberto@email.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    
    // Aguarda o redirecionamento
    await page.waitForURL('**/super-admin/*');
  });

  test('Deve visualizar instituições pendentes e aprovar uma solicitação', async ({ page }) => {
    await page.goto('/super-admin/schools');

    // Navega para a aba de solicitações pendentes
    await page.click('button:has-text("Solicitações Pendentes")');

    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    const btnAprovar = page.locator('button:has-text("Aprovar")').first();
    const mensagemVazia = page.locator('text=Nenhuma solicitação pendente no momento.');

    // CORREÇÃO: Aguarda ativamente o React renderizar o conteúdo da aba (seja a tabela ou a mensagem vazia)
    await expect(btnAprovar.or(mensagemVazia)).toBeVisible();

    // Com o DOM estabilizado, a condicional executará o caminho correto
    if (await btnAprovar.isVisible()) {
      await btnAprovar.click();

      // Aguarda recarga dos dados da API
      await page.waitForTimeout(1000); 

      await page.click('button:has-text("Instituições Ativas")');
      await expect(page.locator('table')).toBeVisible();
    } else {
      await expect(mensagemVazia).toBeVisible();
    }
  });
});