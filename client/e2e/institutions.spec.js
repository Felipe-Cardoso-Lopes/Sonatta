import { test, expect } from '@playwright/test';

test.describe('Fluxo de Cadastro de Instituição (TC-005)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'joaoroberto@email.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    
    // Timeout de 30s para o Render acordar
    await expect(page).toHaveURL(/super-admin\/dashboard/, { timeout: 30000 });
    await page.goto('/super-admin/schools');
  });

  test('deve abrir o modal ao clicar em Cadastrar Nova Escola', async ({ page }) => {
    await page.click('button:has-text("Cadastrar Nova Escola")');
    await expect(page.locator('input[name="nome"]')).toBeVisible();
  });

  test('deve bloquear cadastro com campos obrigatórios vazios', async ({ page }) => {
    await page.click('button:has-text("Cadastrar Nova Escola")');
    await page.click('button:has-text("Cadastrar Escola")');
    
    // Verifica se o foco voltou para o input de nome (bloqueado pelo HTML5 required)
    const nomeInput = page.locator('input[name="nome"]');
    await expect(nomeInput).toBeFocused();
  });

  test('deve cadastrar uma nova instituição com sucesso', async ({ page }) => {
    await page.click('button:has-text("Cadastrar Nova Escola")');
    
    await page.fill('input[name="nome"]', 'Escola Teste Playwright');
    await page.fill('input[name="email"]', `playwright.${Date.now()}@teste.com`);
    await page.fill('input[name="telefone"]', '(61) 99999-0000');
    await page.fill('input[name="cidade"]', 'Brasília');
    await page.fill('input[name="codigo_aluno"]', `ALU-PW${Date.now()}`);
    await page.fill('input[name="codigo_professor"]', `PRF-PW${Date.now()}`);

    // Prepara para aceitar o "alert" de sucesso
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('sucesso');
      await dialog.accept();
    });

    await page.click('button:has-text("Cadastrar Escola")');
    
    // Aguarda o modal desaparecer da tela (indicando sucesso)
    await expect(page.locator('input[name="nome"]')).not.toBeVisible({ timeout: 8000 });
  });

  test('deve fechar o modal ao clicar em Cancelar', async ({ page }) => {
    await page.click('button:has-text("Cadastrar Nova Escola")');
    await expect(page.locator('input[name="nome"]')).toBeVisible();
    await page.click('button:has-text("Cancelar")');
    await expect(page.locator('input[name="nome"]')).not.toBeVisible();
  });
});

test('aluno não deve ver conteúdo de super admin ao acessar /super-admin/schools', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'lucas.aluno@estreladonorte.com.br');
  await page.fill('input[type="password"]', '123456');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/student\/dashboard/, { timeout: 15000 });

  await page.goto('/super-admin/schools');

  // Aguarda o redirect acontecer após o useEffect
  await expect(page).not.toHaveURL(/super-admin\/schools/, { timeout: 15000 });
});