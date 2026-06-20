import { test, expect } from '@playwright/test';

test.describe('Authentication and Authorization Flows', () => {

    test('deve fazer login como aluno e redirecionar para o dashboard', async ({ page }) => {
        await page.goto('/login');

        await page.fill('[data-testid="login-email-input"]', 'lucas.aluno@estreladonorte.com.br');
        await page.fill('[data-testid="login-password-input"]', '123456');
        await page.click('[data-testid="login-submit-button"]');

        await expect(page).toHaveURL(/student\/dashboard/, { timeout: 10000 });
    });

    test('deve fazer login como professor e redirecionar para o dashboard', async ({ page }) => {
        await page.goto('/login');

        await page.fill('[data-testid="login-email-input"]', 'ana.prof@estreladonorte.com.br');
        await page.fill('[data-testid="login-password-input"]', '123456');
        await page.click('[data-testid="login-submit-button"]');

        await expect(page).toHaveURL(/teacher\/dashboard/, { timeout: 10000 });
    });

    test('deve exibir alerta com credenciais inválidas', async ({ page }) => {
        await page.goto('/login');

        await page.fill('[data-testid="login-email-input"]', 'inexistente@teste.com');
        await page.fill('[data-testid="login-password-input"]', 'senha-errada');

        // Captura o alert antes de clicar
        page.once('dialog', async dialog => {
            expect(dialog.message()).toContain('E-mail ou senha inválidos');
            await dialog.accept();
        });

        await page.click('[data-testid="login-submit-button"]');
    });

    test('deve redirecionar usuário não autenticado que tenta acessar rota protegida', async ({ page }) => {
        // Tenta acessar o dashboard do aluno diretamente sem estar logado
        await page.goto('/student/dashboard');

        // Essa validação pode falhar caso a proteção de rota não esteja implementada no frontend
        await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
    });

});
