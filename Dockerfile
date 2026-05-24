# Koldo - visor de notas Markdown servido por nginx
# Construido por NaN Spaces (Kaniko) desde la raíz del repo.
FROM nginx:1.27-alpine

# apache2-utils trae htpasswd para Basic Auth dinámico desde env.
# tini para PID 1 limpio.
RUN apk add --no-cache apache2-utils tini && \
    addgroup -S koldo && adduser -S -G koldo koldo && \
    rm -rf /usr/share/nginx/html/* && \
    rm /etc/nginx/conf.d/default.conf

# Configuración nginx (CSP, cabeceras, Basic Auth).
COPY .deploy/nginx.conf /etc/nginx/nginx.conf
COPY .deploy/koldo.conf /etc/nginx/conf.d/koldo.conf

# El visor: una SPA estática que lista y renderiza los .md del repo.
COPY .deploy/public/ /usr/share/nginx/html/
COPY .deploy/docker-entrypoint.sh /docker-entrypoint-koldo.sh
RUN chmod +x /docker-entrypoint-koldo.sh

# Copiamos el contenido REAL del repo (notas, skills, etc) bajo /content
# para que el visor los pida vía HTTP.
COPY README.md /usr/share/nginx/html/content/README.md
COPY koldo/   /usr/share/nginx/html/content/koldo/
COPY notes/   /usr/share/nginx/html/content/notes/
COPY config/  /usr/share/nginx/html/content/config/
COPY memory/  /usr/share/nginx/html/content/memory/
COPY scripts/ /usr/share/nginx/html/content/scripts/

# Generamos el índice estático del árbol de markdown en build time.
COPY .deploy/build-tree.sh /tmp/build-tree.sh
RUN sh /tmp/build-tree.sh && rm /tmp/build-tree.sh

# nginx escucha en 8080 (NaN Spaces espera puerto no privilegiado).
EXPOSE 8080

# El proceso corre como root para poder bindear y escribir htpasswd en /etc;
# nginx hace setuid a `nginx` para los workers. Si NaN exige non-root,
# cambiar a USER koldo y mover paths.
ENTRYPOINT ["/sbin/tini", "--", "/docker-entrypoint-koldo.sh"]
CMD ["nginx", "-g", "daemon off;"]
