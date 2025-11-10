const { test, expect } = require('@playwright/test');

test('Entrada peligrosa no se refleja como HTML ejecutable', async ({ page }) => {
  const payload = `<script>alert(1)</script>`;
  await page.goto(`/buscar?q=${encodeURIComponent(payload)}`);
  const html = await page.content();

  // No debería aparecer el <script> crudo (debe estar escapado)
  expect(html).not.toContain(payload);
  // Idealmente debería verse escapado (&lt;script&gt;), pero aquí solo comprobamos que no esté crudo.
});
