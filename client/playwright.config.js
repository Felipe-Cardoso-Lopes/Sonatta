import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  
  // 1. TIMEOUTS GLOBAIS (Ajustados para o Cold Start do Render)
  // Tempo máximo que um teste inteiro pode levar (90 segundos)
  timeout: 90000, 
  
  expect: {
    // Tempo máximo aguardando um elemento aparecer (ex: toBeVisible)
    timeout: 15000,
  },

  // 2. EXECUÇÃO E CI/CD
  // Roda todos os testes em paralelo para economizar tempo
  fullyParallel: true,
  // Falha o build no CI se você esquecer um "test.only" no código
  forbidOnly: !!process.env.CI,
  // Tenta novamente em caso de falha apenas no ambiente de CI (Nuvem)
  retries: process.env.CI ? 2 : 0,
  // Otimiza o número de workers no CI
  workers: process.env.CI ? 1 : undefined,
  
  // 3. RELATÓRIOS
  // Gera um relatório HTML interativo ao final dos testes
  reporter: 'html',

  // 4. CONFIGURAÇÕES BASE DE USO
  use: {
    // 1. Atualizado para o seu novo link da Vercel
    baseURL: process.env.BASE_URL || 'https://sonatta-tau.vercel.app', 
    
    // 2. Mantemos os tempos altos por conta do plano free do Render
    actionTimeout: 60000,      
    navigationTimeout: 90000,  
    
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  // 5. PROJETOS (Navegadores)
  // Configuração para rodar testes nos motores mais populares
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Remova os comentários abaixo se desejar testar em outros navegadores
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
  ],
});