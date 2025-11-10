// tests/demo-explain.spec.js
const { test, expect } = require('@playwright/test');
const fs = require('fs');

function ts() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}
async function shot(page, mode, name) {
  await fs.promises.mkdir('evidence', { recursive: true });
  await page.screenshot({ path: `evidence/${ts()}_${mode}_${name}.png` });
}

test('Demo explicada: Home → Login → XSS', async ({ page, request }) => {
  // Descubre el modo desde el servidor (fallback a env si no existe el endpoint)
  let mode = (process.env.MODE || 'UNKNOWN').toUpperCase();
  try {
    const resp = await request.get('/csrf-token');
    const json = await resp.json();
    if (json?.mode) mode = String(json.mode).toUpperCase();
  } catch { /* ignore */ }

  // HOME
  await page.goto('/');
  await expect(page).toHaveTitle(/Demo/i);
  await shot(page, mode, '01-home');

  // LOGIN (captura Set-Cookie SIN seguir redirección)
  const res = await request.get('/login', { maxRedirects: 0 });
  const setCookie = String(res.headers()['set-cookie'] || '');
  await test.info().attach(`${mode}-set-cookie.txt`, { body: setCookie, contentType: 'text/plain' });
  await page.goto('/');
  await shot(page, mode, '02-after-login');

  // XSS (solo salta en INSECURE)
  let dialogMessage = null;
  page.on('dialog', async d => { dialogMessage = d.message(); await d.accept(); });

  await page.fill('input[name="q"]', '<script>alert(1)</script>');
  await page.getByRole('button', { name: /buscar/i }).click();
  await shot(page, mode, '03-xss-result');

  await test.info().attach(`${mode}-dialog.txt`, {
    body: dialogMessage ? `Dialog: ${dialogMessage}` : '(sin dialogo — SECURE)',
    contentType: 'text/plain'
  });
});
