import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 90000, 
  
  expect: {
    // Aumentado para 60 segundos para esperar as respostas da API do Render
    timeout: 60000,
  },

  // DESLIGA O PARALELISMO PARA NÃO DERRUBAR O RENDER
  fullyParallel: false,
  workers: 1, 
  
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL || 'https://sonatta-tau.vercel.app',
    actionTimeout: 60000,      
    navigationTimeout: 90000,  
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev', // Comando para iniciar o seu frontend
    url: 'http://localhost:5173', // URL que o Playwright deve aguardar ficar disponível
    reuseExistingServer: !process.env.CI, // Reaproveita o servidor se você já tiver rodado "npm run dev" manualmente
    timeout: 120 * 1000,
  },
});