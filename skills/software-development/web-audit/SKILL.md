---
name: web-audit
description: "Auditoría completa de aplicaciones web — análisis estático de código, seguridad, rendimiento, accesibilidad y arquitectura usando curl + lectura de archivos. Alternativa al browser tool cuando no está disponible o cuando se necesita auditoría profunda del código fuente."
version: 1.0.0
author: Hermes Agent
tags: [audit, code-review, security, performance, accessibility, architecture, static-analysis]
---

# Web Application Code Audit

## Overview

Sistema sistemático para realizar auditorías completas de aplicaciones web usando análisis estático (curl + lectura de archivos) en lugar del browser tool. Ideal cuando:
- El browser tool falla (Node.js errors, CSP blocks, etc.)
- Se necesita auditoría profunda del código fuente
- Se quiere evaluar seguridad, rendimiento y arquitectura sin ejecutar la app

**Diferencia con `dogfood`:** `dogfood` es QA exploratorio interactivo (navegar, hacer clic, formularios). `web-audit` es auditoría estática del código + headers + SSL + estructura.

## When to Use

- User says "haz una auditoría de [URL]"
- User wants a security, performance, or code quality review
- User says "review this web app" or "audit this site"
- Browser tool is broken/unavailable for the target domain

## The 7-Phase Audit Process

### Phase 1: Fetch All Assets

Download every file for analysis:

```bash
# HTML principal
curl -sL "https://target.com" -o /tmp/audit.html -w "%{http_code} %{size_download}"

# CSS
curl -sL "https://target.com/css/styles.css" -o /tmp/styles.css -w "%{http_code} %{size_download}"

# Todos los JS
for f in api config state utils render render-charts render-final; do
  curl -sL "https://target.com/js/${f}.js" -o "/tmp/js-${f}.js" -w "%{http_code} %{size_download}\n"
done

# Headers completos
curl -sI "https://target.com" > /tmp/headers.txt
```

### Phase 2: Performance & Infrastructure

```bash
# Performance metrics
curl -sL -o /dev/null -w "TTFB: %{time_starttransfer}s\nTotal: %{time_total}s\nSize: %{size_download}\n" "https://target.com"

# SSL/TLS verification
echo | openssl s_client -servername TARGET -connect TARGET:443 2>/dev/null | openssl x509 -noout -subject -issuer -dates -ext subjectAltName

# Check CDN/Proxy
grep -i "cf-\|cloudflare\|fastly\|akamai" /tmp/headers.txt
```

**Key metrics to report:**
- TTFB (Time To First Byte): <200ms = ⭐⭐⭐⭐⭐, <500ms = ⭐⭐⭐⭐, >1s = ⚠️
- Total load time
- HTML size (should be <50KB for SPA)
- SSL certificate validity and issuer
- CDN presence

### Phase 3: Security Headers Audit

Parse headers and check for:

| Header | Required | Notes |
|--------|----------|-------|
| `Strict-Transport-Security` | ✅ | max-age >= 31536000, includeSubDomains |
| `Content-Security-Policy` | ✅ | No `'unsafe-inline'` on script-src if possible |
| `X-Content-Type-Options` | ✅ | Must be `nosniff` |
| `X-Frame-Options` | ✅ | Must be `SAMEORIGIN` or `DENY` |
| `Referrer-Policy` | ✅ | Should not be `no-referrer` for debugging |
| `Access-Control-Allow-Origin` | ⚠️ | `*` is OK for public apps, bad for private ones |

**Red flags:**
- `ALLOWED_ORIGINS=*` in `.env` + POST endpoints without auth
- Missing `helmet` or equivalent in Express
- `eval()` in JavaScript
- `innerHTML` with unsanitized user/API data
- API keys exposed in frontend JS

### Phase 4: Code Structure Analysis

```bash
# Check backend structure
grep -n "^app\.\(get\|post\|put\|delete\)" server.js

# Check for security patterns
grep -n "ESIOS_TOKEN\|password\|secret\|auth\|rate\|limit\|helmet\|cors" server.js

# Check frontend file sizes
wc -l /tmp/js-*.js

# Check for error handling
grep -c "try {" /tmp/js-*.js
grep -c "console\.error" /tmp/js-*.js

# Check for XSS risks
grep -n "innerHTML\|document\.write\|eval(" /tmp/js-*.js

# Check for accessibility
grep -c "aria-\|role=\|alt=" /tmp/audit.html

# Check for semantic HTML
grep -c "<h[1-6]\|<nav\|<main\|<footer\|<header\|<section" /tmp/audit.html

# Check viewport/mobile
grep "viewport" /tmp/audit.html

# Check lang attribute
grep "<html" /tmp/audit.html
```

**Code quality checklist:**
- Architecture: modular vs monolithic
- Error handling: try/catch coverage
- Memory management: chart destroy() calls
- Data sanitization: innerHTML vs textContent
- State management: centralized vs scattered
- File organization: logical grouping

### Phase 5: Frontend Quality

```bash
# Check for duplicate content
grep -c "duplicate\|repeated" README.md

# Check Chart.js cleanup
grep -c "\.destroy()" /tmp/js-*.js
grep -c "new Chart(" /tmp/js-*.js

# Check for global variable leaks
grep -n "^[a-zA-Z].*=" /tmp/js-*.js | grep -v "const\|let\|var\|function\|const\|module\|require"

# Check error messages quality
grep -n "showToast\|console\.warn\|console\.error" /tmp/js-*.js
```

### Phase 6: Backend Security Deep-Dive

```bash
# Check env validation
cat src/config/env.js

# Check Docker security
cat Dockerfile
cat .dockerignore

# Check for unauthenticated endpoints
grep -n "app\.\(post\|put\|delete\)" server.js

# Check rate limiting
grep -n "rate.limit\|rateLimit\|express-rate-limit" server.js

# Check test coverage
ls tests/
```

**Critical checks:**
- API keys in `.env` (not committed)
- Non-root Docker user
- `.env` in `.dockerignore`
- Health checks present
- No admin endpoints without auth
- JSON body size limits

### Phase 7: Compile Report

Structure the audit report using this template:

```markdown
## 🔍 Auditoría Completa — [Project Name]

### 📌 Resumen Ejecutivo
**Estado general: ✅ BUENO / ⚠️ REGULAR / ❌ CRÍTICO**
[One paragraph summary]

### 🟢 FORTALEZAS
| Area | Detail |
|------|--------|
| ... | ... |

### 🔴 PROBLEMAS CRÍTICOS
#### 1. [Title]
- **Archivo:** path
- **Riesgo:** description
- **Recomendación:** fix

### 🟡 MEJORAS RECOMENDADAS
#### 4. [Title]
- **Detalle:** description
- **Recomendación:** fix

### 🟢 OBSERVACIONES MENORES
| # | Detail |
|---|--------|

### 📊 Métricas de Rendimiento
| Metric | Value | Rating |
|--------|-------|--------|
| TTFB | 171ms | ⭐⭐⭐⭐⭐ |
| ... | ... | ... |

### 🏁 Veredicto Final
[Final verdict with priority action items]
```

**Severity classification:**
- 🔴 Crítico: breaks functionality, security vulnerability, data leak
- 🟠 Alto: significant risk, performance bottleneck
- 🟡 Medio: improvement opportunity, code smell
- 🟢 Bajo: nice-to-have, cosmetic

## Pitfalls

### Don't rely solely on curl for dynamic content
- Single-page apps may render different content via JavaScript
- Use `browser_vision` if the browser tool works, supplement with curl
- If browser tool fails, note this limitation in the report

### Don't flag CDN `unsafe-inline` as critical
- Chart.js, Google Fonts, and similar CDNs require `'unsafe-inline'` for styles
- Flag it as a note, not a critical issue
- The real risk is `'unsafe-inline'` on `script-src`

### Don't confuse `ALLOWED_ORIGINS=*` with a vulnerability
- For public-facing dashboards with only GET endpoints, `*` is fine
- Only flag it if there are POST/PUT/DELETE endpoints without auth

### Always verify claims against actual code
- Don't trust README or documentation at face value
- Cross-reference findings with actual file contents
- The `technical-audit-remediation` skill has a similar principle: "don't trust the audit blindly"

## Integration with Other Skills

### With `technical-audit-remediation`
Use `web-audit` to FIND issues, then `technical-audit-remediation` to EXECUTE fixes. The audit produces findings; the remediation skill executes them.

### With `dogfood`
Use `dogfood` when the browser tool works and you want interactive QA (forms, clicks, navigation). Use `web-audit` when you need code-level analysis or the browser tool fails.

### With `frontend-error-boundaries`
If the audit finds missing error handling in charts or data loading, reference `frontend-error-boundaries` for the implementation pattern.

### With `seguridad-helmet-cors`
If the audit finds missing or misconfigured Helmet/CSP, reference `seguridad-helmet-cors` for the correct Express configuration pattern.

## Linked Reference Files

- `references/esios-dashboard-audit-2026-05-31.md` — Caso de estudio real: auditoría completa del ESIOS Dashboard con hallazgos específicos y patrón de fallback cuando el browser tool falla

## Example Workflow

```
[User: "haz una auditoría de https://my-app.nan.builders"]
[Phase 1: curl HTML, CSS, all JS → /tmp/]
[Phase 2: performance metrics, SSL check]
[Phase 3: parse headers, check security]
[Phase 4: grep code structure, error handling, XSS risks]
[Phase 5: frontend quality, chart cleanup, accessibility]
[Phase 6: backend security deep-dive, Docker, tests]
[Phase 7: compile chulo report with severity tags]
```
