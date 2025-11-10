const { test, expect } = require('@playwright/test');

test('Cabeceras de seguridad presentes', async ({ request }) => {
  const res = await request.get('/');
  expect(res.status()).toBe(200);
  const h = res.headers();

  expect(h['content-security-policy']).toBeTruthy();
  expect(h['x-content-type-options']).toBe('nosniff');
  expect((h['x-frame-options'] ?? h['frame-options']) || '').toMatch(/deny|sameorigin/i);
  expect((h['strict-transport-security'] ?? '')).toMatch(/max-age=/i);
  expect(h['referrer-policy']).toBeTruthy();
  expect(h['permissions-policy']).toBeTruthy();
});
