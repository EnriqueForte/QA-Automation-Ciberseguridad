const { test, expect } = require('@playwright/test');

test('POST sin CSRF debe ser rechazado', async ({ request }) => {
  const res = await request.post('/api/profile', {
    data: { email: 'test@test.local' } // no enviamos token
  });
  expect([401, 403]).toContain(res.status());
});
