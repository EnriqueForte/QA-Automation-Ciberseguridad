<<<<<<< HEAD
# QA + Seguridad con Playwright · Mini-Laboratorio

**Proyecto práctico “multitask”** para demostrar habilidades de **Ciberseguridad** y **QA Automation**:
- Un servidor Express con dos modos: **INSECURE** (vulnerable) y **SECURE** (endurecido con Helmet/CSRF/escape HTML).
- Una **batería de tests Playwright** que actúa como **Security Gates**: cookies, cabeceras, CSRF y XSS.
- Evidencias visuales (capturas y vídeo) y modo demo **paso a paso**.

---

## 🧩 Objetivos

- Mostrar **cómo QA y Seguridad se integran**: automatizo comprobaciones de seguridad en el pipeline.
- Evidenciar **antes / después** (INSECURE vs SECURE) con pruebas reproducibles.

---

## 🏗️ Stack

- **Node.js + Express** (app)
- **Helmet, csurf, cookie-parser** (hardening)
- **Playwright** (`@playwright/test`) para tests funcionales/seguridad
- **VS Code** como IDE

---

## 🚀 Scripts principales

```bash
# Instalar dependencias
npm install

# Servidor en modo vulnerable / endurecido
npm run start:insecure
npm run start:secure

# Ejecutar todos los tests (con MODE explícito para separar artefactos)
npm run test:insecure
npm run test:secure

# Demo guiada del laboratorio (test didáctico)
npm run demo:test              # si ya tienes el server arriba
npm run demo:test:debug        # con Playwright Inspector

🔎 Qué validan los tests (Security Gates)

| Gate                                                                            | INSECURE                         | SECURE                                   |
| ------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------- |
| **Cookies de sesión** (`Set-Cookie`)                                            | ❌ Sin `Secure/HttpOnly/SameSite` | ✅ Flags presentes (declarados en header) |
| **Cabeceras de seguridad** (CSP, HSTS, XFO, XCTO, Referrer, Permissions-Policy) | ❌ Ausentes                       | ✅ Presentes *(HSTS requiere HTTPS real)* |
| **CSRF** (POST sin token)                                                       | ❌ Acepta                         | ✅ Rechaza con 403                        |
| **XSS reflejado** (`/buscar?q=<script>…`)                                       | ❌ Ejecuta `alert(1)`             | ✅ Se escapa; **no** ejecuta JS           |

🖼️ Evidencias

Carpeta evidence/ (se suben algunas imágenes y/o un GIF corto):

smoke-ok.png – Home correcta

security-insecure-fail.png – Suite insegura (rojo)

detail-xss-insecure.png – alert(1) / <script> reflejado

detail-cookies-insecure.png – Cookie sin flags en DevTools

detail-headers-insecure.png – Response Headers sin CSP/HSTS…

security-secure-pass.png – Suite segura (verde + avisos en local http)

🎛️ Demo paso a paso (didáctica)

1. Arranca el servidor:
````bash
npm run start:insecure o secure
````
2. Ejecuta el test demo con vídeo, capturas y pasos:
````bash
npx playwright test tests/demo-explain.spec.js --project=chromium
npx playwright show-report
````
3.Repite en SECURE:
````bash
npm run start:secure
npx playwright test tests/demo-explain.spec.js --project=chromium
````

El test demo-explain.spec.js:

Abre Home → hace login (captura Set-Cookie) → prueba XSS → guarda capturas → adjunta artefactos al reporte.

En INSECURE verás el pop-up de alert(1) y faltarán cabeceras/flags.

En SECURE ya no saltará el alert y mejoran las protecciones.

⚙️ Config Playwright (extracto)
````js
use: {
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  trace: 'retain-on-failure',
  video: 'on',
  screenshot: 'on',
  headless: false,              // visible para demo
  launchOptions: { slowMo: 200 }

````
Además separo artefactos por modo+ejecución:
````bash
test-artifacts/
  INSECURE-YYYYMMDD_HHMMSS/...
  SECURE-YYYYMMDD_HHMMSS/...
````

🧪 Casos incluidos

smoke.spec.js – Carga de Home y elementos clave.

security.cookies.spec.js – Flags de cookie en Set-Cookie (lee 302 sin seguir redirección).

security.headers.spec.js – Cabeceras de seguridad presentes.

security.csrf.spec.js – POST sin token CSRF.

security.xss-reflection.spec.js – Reflejo de <script> en resultados.

demo-explain.spec.js – Demo didáctica con capturas y adjuntos.

🔐 Lecciones / valor para el rol Junior

Entiendo el riesgo (XSS/CSRF/headers/cookies) y cómo verificarlo automáticamente con QA.

Sé mostrar evidencia clara (capturas, vídeo, trace), comparando antes/después.

Puedo integrar estos Security Gates en pipelines (CI/CD) para evitar regresiones.

👤 Autor

Enrique Forte (Quique) – Jr. Cybersecurity & QA Automation

GitHub: @EnriqueForte

LinkedIn: www.linkedin.com/in/enriqueforte
=======
# 🤖🛡️ QA-Automation-Ciberseguridad  

> **Repositorio monográfico** que reúne mis proyectos de **Automatización de Pruebas (QA Automation)** aplicados a **Ciberseguridad**.
> Incluye entornos, laboratorios y scripts diseñados para evaluar **seguridad, rendimiento y validación funcional** de aplicaciones y servicios desde una perspectiva **DevSecOps**.

---

## 🧩 Objetivo del Repositorio  

Este repositorio busca **unir el mundo del QA y la Ciberseguridad**, creando herramientas y laboratorios que automaticen tareas de testing, detección de vulnerabilidades y validaciones de seguridad.

🧠 El propósito principal es demostrar cómo la **automatización puede reforzar la seguridad** en el ciclo de vida del software (SDLC), implementando pruebas automatizadas que validen configuraciones, vulnerabilidades, flujos inseguros y endpoints críticos.

---

## ⚙️ Tecnologías y Entorno  

| Área | Tecnologías | Descripción |
| :--- | :--- | :--- |
| **Testing Automation** | 🧪 Playwright · Selenium · PyTest | Automatización de pruebas E2E, UI y API. |
| **Ciberseguridad** | 🔐 OWASP ZAP · Burp Suite · Nmap · Hydra | Escaneo y validación de seguridad automatizada. |
| **DevOps/CI** | ⚙️ GitHub Actions · Node.js · Bash | Integración continua y pipelines automatizados. |

---

## 🚀 Proyectos incluidos  

| Proyecto | Descripción | Estado |
| :--- | :--- | :---: |
| [🧠 **Playwright Security Lab**](./Playwright_Security_Lab/README.md) | Laboratorio automatizado que simula entornos “Secure” e “Insecure” para validar cómo los tests pueden detectar malas prácticas de seguridad (CSP, HTTPS, headers, etc.). | ✅ |
---

## 🧠 Conceptos Clave  

- **DevSecOps:** Integrar la seguridad desde la fase de testing.  
- **Shift Left Security:** Detectar vulnerabilidades antes del despliegue.  
- **Automation First:** Reducir la carga manual y aumentar la cobertura.  
- **Security Testing Pipelines:** Integrar OWASP y pruebas automáticas en CI/CD.

---

## 🧑‍💻 Autor  

**Enrique Forte**  
*QA & Software Developer | Cybersecurity Analyst | Pentester Junior*  

📎 [GitHub](https://github.com/EnriqueForte) · [Portfolio](https://enriqueforte.web.app) · [LinkedIn](https://linkedin.com/in/enriqueforte)

---

## 📜 Licencia  

Este repositorio se distribuye bajo la licencia **MIT**.  
Puedes usar, modificar y adaptar los scripts con fines educativos o profesionales citando la autoría.

---

## 🌐 Hashtags y Palabras Clave  

`#QA #Automation #Cybersecurity #DevSecOps #Playwright #Selenium #Pentesting #OWASP #Testing #Ciberseguridad`
>>>>>>> ba6b6d9f34e2575bcf6637abf7d796d9d11a13a8
