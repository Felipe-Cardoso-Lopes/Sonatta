import { test, expect } from '@playwright/test';

test.describe('Fluxo de Login', () => {

    test('deve fazer login como aluno e redirecionar para o dashboard', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="email"]', 'lucas.aluno@estreladonorte.com.br');
        await page.fill('input[type="password"]', '123456');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/student\/dashboard/, { timeout: 10000 });
    });

    test('deve fazer login como professor e redirecionar para o dashboard', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="email"]', 'ana.prof@estreladonorte.com.br');
        await page.fill('input[type="password"]', '123456');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/teacher\/dashboard/, { timeout: 10000 });
    });

    test('deve exibir alerta com credenciais inválidas', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="email"]', 'inexistente@teste.com');
        await page.fill('input[type="password"]', 'senha-errada');

        // Captura o alert antes de clicar
        page.once('dialog', async dialog => {
            expect(dialog.message()).toContain('E-mail ou senha inválidos');
            await dialog.accept();
        });

        await page.click('button[type="submit"]');
    });

    test('deve fazer login como super_admin e redirecionar para a torre de controle', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="email"]', 'joaoroberto@email.com');
        await page.fill('input[type="password"]', '123456');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/super-admin\/dashboard/, { timeout: 10000 });
    });

});