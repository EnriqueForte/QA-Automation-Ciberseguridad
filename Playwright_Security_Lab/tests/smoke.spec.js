// tests/smoke.spec.js
const { test, expect } = require('@playwright/test');

test('Home carga y muestra el título', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Demo/i);
  await expect(page.getByText('Login simulado')).toBeVisible();
});
