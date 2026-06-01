import { test, expect } from '@playwright/test';

test.describe('Feature 13/14: Painel de Aprovação do Super Admin', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Simula o Login do Super Admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'joaoroberto@email.com'); // Substitua pelo e-mail de teste real
    await page.fill('input[name="password"]', '123456');  // Substitua pela senha real
    await page.click('button[type="submit"]');
    
    // Aguarda o redirecionamento
    await page.waitForURL('**/super-admin/*');
  });

  test('Deve visualizar instituições pendentes e aprovar uma solicitação', async ({ page }) => {
    // Acessa a rota de gestão de escolas
    await page.goto('/super-admin/schools');

    // Navega para a aba de solicitações pendentes
    await page.click('button:has-text("Solicitações Pendentes")');

    // Prepara o Playwright para aceitar automaticamente os alertas do navegador (window.confirm e window.alert)
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // Localiza o primeiro botão "Aprovar" na tabela
    const btnAprovar = page.locator('button:has-text("Aprovar")').first();
    
    // Se existir uma instituição pendente, realiza o clique
    if (await btnAprovar.isVisible()) {
      await btnAprovar.click();

      // Aguarda um momento para a recarga dos dados da API e atualização da aba
      await page.waitForTimeout(1000); 

      // Retorna para a aba Ativas e verifica se a interface carregou a lista principal
      await page.click('button:has-text("Instituições Ativas")');
      await expect(page.locator('table')).toBeVisible();
    } else {
      // Caso não existam pendências, valida a mensagem de lista vazia
      await expect(page.locator('text=Nenhuma solicitação pendente no momento.')).toBeVisible();
    }
  });
});