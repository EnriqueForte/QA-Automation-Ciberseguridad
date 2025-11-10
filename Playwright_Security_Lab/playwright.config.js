// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

const MODE = (process.env.MODE || 'INSECURE').toUpperCase();
console.log('[Playwright config] MODE =', MODE);
// RUN_ID legible y válido para Windows (YYYYMMDD_HHMMSS)
const RUN_ID = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },

  // ⬇️ artefactos separados por MODE y por ejecución
  outputDir: `test-artifacts/${MODE}-${RUN_ID}`,

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    video: 'on',
    screenshot: 'on',
    headless: false,
    launchOptions: { slowMo: 1000 }
  },

  reporter: [['html', { open: 'never' }]],
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
