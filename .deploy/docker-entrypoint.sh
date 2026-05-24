#!/bin/sh
# Genera /etc/nginx/.htpasswd al arrancar usando $KOLDO_PASSWORD.
# Si no hay password, falla rápido (mejor que servir contenido abierto).
set -eu

USER="${KOLDO_USER:-koldo}"

if [ -z "${KOLDO_PASSWORD:-}" ]; then
  echo "[koldo] ERROR: KOLDO_PASSWORD no está definido en el entorno." >&2
  echo "[koldo] Configura la variable en NaN Spaces > App > Environment." >&2
  exit 1
fi

# -B = bcrypt, -b = recibir password por argumento, -c = crear archivo.
htpasswd -bBc /etc/nginx/.htpasswd "$USER" "$KOLDO_PASSWORD"
chmod 0640 /etc/nginx/.htpasswd
chown root:nginx /etc/nginx/.htpasswd

# Limpia la variable del entorno antes de exec para que no se filtre
# en /proc/<pid>/environ del proceso nginx.
unset KOLDO_PASSWORD

echo "[koldo] htpasswd generado para usuario '$USER'. Iniciando nginx..."
exec "$@"
