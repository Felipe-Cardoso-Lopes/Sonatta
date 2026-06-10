import { test, expect } from '@playwright/test';

async function loginAs(page, email, password, expectedURLPattern, timeout = 30000) {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(expectedURLPattern, { timeout });
}

test.describe('Fluxo de Cadastro de Instituição (TC-005)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'joaoroberto@email.com', '123456', /super-admin/);
    await page.goto('/super-admin/schools');
    await expect(page).toHaveURL(/super-admin\/schools/);
  });

  test('deve abrir o modal ao clicar em Cadastrar Nova Escola', async ({ page }) => {
    const btnCadastrar = page.getByRole('button', { name: /cadastrar manualmente/i });
    await expect(btnCadastrar).toBeVisible({ timeout: 10000 });
    await btnCadastrar.click();
    await expect(page.locator('input[name="nome"]')).toBeVisible({ timeout: 5000 });
  });

  test('deve bloquear cadastro com campos obrigatórios vazios', async ({ page }) => {
    const btnCadastrar = page.getByRole('button', { name: /cadastrar manualmente/i });
    await expect(btnCadastrar).toBeVisible({ timeout: 10000 });
    await btnCadastrar.click();
    await expect(page.locator('input[name="nome"]')).toBeVisible({ timeout: 5000 });

    await page.getByRole('button', { name: /cadastrar escola/i }).click();

    await expect(page.locator('input[name="nome"]')).toBeFocused();
  });

  test('deve cadastrar uma nova instituição com sucesso', async ({ page }) => {
    const btnCadastrar = page.getByRole('button', { name: /cadastrar manualmente/i });
    await expect(btnCadastrar).toBeVisible({ timeout: 10000 });
    await btnCadastrar.click();
    await expect(page.locator('input[name="nome"]')).toBeVisible({ timeout: 5000 });

    await page.fill('input[name="nome"]', 'Escola Teste Playwright');
    await page.fill('input[name="email"]', `playwright.${Date.now()}@teste.com`);
    await page.fill('input[name="telefone"]', '(61) 99999-0000');
    await page.fill('input[name="cidade"]', 'Brasília');
    await page.fill('input[name="codigo_aluno"]', `ALU-PW${Date.now()}`);
    await page.fill('input[name="codigo_professor"]', `PRF-PW${Date.now()}`);

    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('sucesso');
      await dialog.accept();
    });

    await page.getByRole('button', { name: /cadastrar escola/i }).click();
    await expect(page.locator('input[name="nome"]')).not.toBeVisible({ timeout: 10000 });
  });

  test('deve fechar o modal ao clicar em Cancelar', async ({ page }) => {
    const btnCadastrar = page.getByRole('button', { name: /cadastrar manualmente/i });
    await expect(btnCadastrar).toBeVisible({ timeout: 10000 });
    await btnCadastrar.click();
    await expect(page.locator('input[name="nome"]')).toBeVisible({ timeout: 5000 });

    await page.getByRole('button', { name: /cancelar/i }).click();
    await expect(page.locator('input[name="nome"]')).not.toBeVisible({ timeout: 5000 });
  });
});

test('aluno não deve ver conteúdo de super admin ao acessar /super-admin/schools', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'lucas.aluno@estreladonorte.com.br');
  await page.fill('input[type="password"]', '123456');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/student\/dashboard/, { timeout: 15000 });

  await page.goto('/super-admin/schools');
  await expect(page).toHaveURL(/login/, { timeout: 15000 });
});