// tests/security.cookies.spec.js
const { test, expect } = require('@playwright/test');

test('Cookie de sesión incluye flags seguros en Set-Cookie', async ({ request }) => {
  // No seguir redirecciones: necesitamos leer el Set-Cookie del 302 de /login
  const res = await request.get('/login', { maxRedirects: 0 });

  // Puede venir como string o array
  const setCookieRaw = res.headers()['set-cookie'] || '';
  const setCookieStr = Array.isArray(setCookieRaw)
    ? setCookieRaw.join('; ')
    : String(setCookieRaw);

  // Adjuntar al reporte para diagnóstico
  await test.info().attach('set-cookie-header.txt', {
    body: setCookieStr || '(vacío)',
    contentType: 'text/plain',
  });

  // Debe existir la cookie de sesión en cualquier modo
  expect(setCookieStr.toLowerCase(), 'Set-Cookie debe incluir session=').toContain('session=');

  // En modo SECURE exigimos flags; en INSECURE solo informamos
  const MODE = (process.env.MODE || 'INSECURE').toUpperCase();

  if (MODE === 'SECURE') {
    expect(setCookieStr, 'Flag HttpOnly faltante').toMatch(/HttpOnly/i);
    expect(setCookieStr, 'SameSite Lax o Strict faltante').toMatch(/SameSite=Lax|SameSite=Strict/i);
    // Nota: aunque estemos en http://localhost, el servidor debe declarar el flag Secure en el header
    expect(setCookieStr, 'Flag Secure faltante').toMatch(/;\s*Secure/i);
  } else {
    // Modo INSECURE: no fallar por diseño, solo dejar constancia en el reporte
    const missing = [
      /HttpOnly/i.test(setCookieStr) ? null : 'HttpOnly',
      /(SameSite=Lax|SameSite=Strict)/i.test(setCookieStr) ? null : 'SameSite',
      /;\s*Secure/i.test(setCookieStr) ? null : 'Secure',
    ].filter(Boolean);

    await test.info().attach('flags-missing-insecure.txt', {
      body: missing.length ? `Faltan: ${missing.join(', ')}` : '(ninguno)',
      contentType: 'text/plain',
    });

    // Si aun así prefieres que falle en INSECURE para mostrar “rojo”, descomenta:
    // expect(missing, 'En INSECURE deberían faltar flags').not.toHaveLength(0);
  }

  // (Opcional) verificar que Location existe y responde
  const location = res.headers()['location'];
  if (location) {
    const res2 = await request.get(location);
    expect([200, 304]).toContain(res2.status());
  }
});
