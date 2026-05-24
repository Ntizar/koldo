# Despliegue de Koldo en NaN Spaces

## Qué hace este Dockerfile

Construye una imagen `nginx:1.27-alpine` que sirve este repo como un visor web
de Markdown protegido por Basic Auth. NaN Spaces lo construye automáticamente
con Kaniko cada vez que haces push a `main`.

```
URL pública      https://koldo.apps.nan.builders   (con tu plan basic)
Puerto interno   8080
Healthcheck      GET /healthz   (sin auth)
Auth             HTTP Basic, usuario configurable, password obligatorio por env
```

## Variables de entorno requeridas

En **NaN Cloud → Spaces → ntizar → Apps → koldo → Environment**:

| Variable          | Obligatoria | Valor sugerido                                   |
|-------------------|-------------|--------------------------------------------------|
| `KOLDO_PASSWORD`  | **Sí**      | La misma que `DASHBOARD_PASSWORD` (más fácil)   |
| `KOLDO_USER`      | No          | `koldo` por defecto                              |

> Si `KOLDO_PASSWORD` no está definido, el contenedor **falla deliberadamente
> al arrancar** para no servir tus notas abiertas a internet.

## Cómo se construye el árbol del menú

El script `.deploy/build-tree.sh` recorre el repo en **build time** y genera
`/tree.json` con la lista de `.md`. No hay listing dinámico de directorios.
Cada push regenera el árbol → el menú lateral se actualiza solo.

## Seguridad

- **Basic Auth bcrypt** en todo (incluso assets), excepto `/healthz` y `/robots.txt`.
- **CSP estricta**: scripts solo de `'self'` y `cdn.jsdelivr.net` (marked + DOMPurify).
- **DOMPurify** sanea el HTML resultante de marked antes de pintarlo.
- `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Permissions-Policy` restrictiva.
- `robots.txt` con `Disallow: /` (no indexar).
- El access log de nginx no registra ni User-Agent ni Referer.

## Probar en local (opcional)

```bash
docker build -t koldo:dev .
docker run --rm -p 8080:8080 -e KOLDO_PASSWORD=test koldo:dev
# Abre http://localhost:8080  (usuario: koldo, password: test)
```

## Limitaciones conocidas

- El menú lateral solo cambia tras un push (es estático). Es a propósito: el
  listing dinámico expondría la estructura del repo aunque vacíes el árbol.
- Sólo se sirven archivos `.md`. Si añades imágenes/PDFs, hay que extender el
  build-tree y el viewer.
