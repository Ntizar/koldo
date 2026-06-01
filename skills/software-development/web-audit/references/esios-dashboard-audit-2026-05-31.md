# ESIOS Dashboard Audit — 2026-05-31

## Session Context

URL: `https://esios-dashboard-ntizar-ntizar.apps.nan.builders`
Browser tool: BROKEN (Node.js internal error — `Cannot load externalized builtin: undici`)
Method: curl-based static analysis + local repo inspection

## Key Findings Summary

### Strengths
- TTFB 171ms, total load 201ms — excellent performance
- Modular backend (src/ with domains, infra, config, shared)
- Helmet + CSP + HSTS configured
- Retry with exponential backoff + jitter
- AbortController for request cancellation
- Multi-stage Docker build, non-root user
- 6 test files (Jest)
- All code in Spanish (UI, code, docs)

### Issues Found
1. **CORS wildcard `ALLOWED_ORIGINS=*`** — OK for public GET-only app, but cache-clear POST endpoint has no auth
2. **`innerHTML` without sanitization** — 16 uses in render.js, data comes from ESIOS API (trusted) but future risk
3. **Zero ARIA attributes** — 0 `aria-*`, 0 `role=`, 0 `alt=` in entire HTML
4. **`user-scalable=no`** — blocks zoom on mobile (accessibility issue)
5. **`/api/esios/cache-clear` unauthenticated** — anyone can flush cache
6. **No rate limiting** on API endpoints
7. **Chart.js cleanup incomplete** — only 7/30 charts have explicit destroy()
8. **`VALID_TABS` includes 'prevision'** but tab is commented out in HTML
9. **`chartVisibility = {}` global** without const/let in state.js
10. **Duplicate line in README** (line 24 and 28)

### Browser Tool Failure
The browser tool crashed with a Node.js internal error when navigating to the NaN subdomain:
```
Cannot load externalized builtin: "internal/deps/undici/undici:/usr/share/nodejs/undici/undici-fetch.js"
```
This is a known issue with the Hermes browser tool on certain domains. The curl-based fallback pattern in `web-audit` skill is the correct approach in these cases.
