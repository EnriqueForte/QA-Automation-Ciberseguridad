// app/server.js
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const path = require('path');

const MODE = process.env.MODE || 'INSECURE'; // INSECURE | SECURE
const app = express();

app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// --- Helpers ---
function escapeHTML(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// --- Config según modo ---
let csrfProtection = (req, res, next) => next(); // no-op por defecto

if (MODE === 'SECURE') {
  // Cabeceras de seguridad
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: { defaultSrc: ["'self'"] }
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    frameguard: { action: 'deny' },
    // Nota: HSTS requiere HTTPS real; lo dejamos para que los tests vean el header
    hsts: { maxAge: 15552000 } // ~180 días
  }));

  // CSRF habilitado en modo seguro
  csrfProtection = csurf({ cookie: true });
}

// --- Rutas ---
app.get('/login', (req, res) => {
  if (MODE === 'SECURE') {
    // Cookie de sesión con flags seguros
    res.cookie('session', 'dummy-session', {
      path: '/',
      httpOnly: true,
      secure: true,   // en local sin HTTPS puede no “enviarse”, pero dejamos el flag
      sameSite: 'Lax'
    });
  } else {
    // Modo inseguro: sin flags (malas prácticas a propósito)
    res.cookie('session', 'dummy-session', { path: '/' });
  }
  res.redirect('/');
});

// Home (en modo SECURE sirve token CSRF)
app.get('/', csrfProtection, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Endpoint opcional para obtener token CSRF si lo necesitas por AJAX
app.get('/csrf-token', csrfProtection, (req, res) => {
  // Solo disponible realmente en modo SECURE
  if (MODE !== 'SECURE') return res.json({ csrfToken: null, mode: MODE });
  return res.json({ csrfToken: req.csrfToken(), mode: MODE });
});

// Buscador: refleja el parámetro q
app.get('/buscar', (req, res) => {
  const q = req.query.q ?? '';
  if (MODE === 'SECURE') {
    // Modo seguro: escapar HTML
    const safeQ = escapeHTML(q);
    return res.type('html').send(`<h1>Resultados</h1><p>Tu búsqueda: ${safeQ}</p>`);
  }
  // Modo inseguro: devuelve crudo (vulnerable a XSS reflejado)
  return res.type('html').send(`<h1>Resultados</h1><p>Tu búsqueda: ${q}</p>`);
});

// API que cambia estado: debe exigir CSRF en modo seguro
app.post('/api/profile', csrfProtection, (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email requerido' });

  // En modo INSECURE aceptará sin token; en SECURE el middleware bloqueará si falta
  return res.json({ ok: true, email, mode: MODE });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[${MODE}] escuchando en http://localhost:${PORT}`);
});
