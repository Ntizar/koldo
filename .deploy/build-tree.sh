#!/bin/sh
# Genera /usr/share/nginx/html/tree.json con el listado de .md del repo.
# Se ejecuta UNA vez en build time (no en runtime), así que el árbol es
# estático y no hay listing dinámico de directorios (más seguro).
set -eu

OUT=/usr/share/nginx/html/tree.json
ROOT=/usr/share/nginx/html/content

cd "$ROOT"

printf '[\n' > "$OUT"
first=1
# -print0 + read -d '' es lo correcto pero busybox sh no soporta -d, así
# que asumimos rutas sin saltos de línea (es nuestro repo, controlado).
find . -type f -name '*.md' | sort | while IFS= read -r f; do
  rel=$(printf '%s' "$f" | sed 's|^\./||')
  size=$(wc -c < "$f" | tr -d ' ')
  if [ $first -eq 0 ]; then
    printf ',\n' >> "$OUT"
  fi
  first=0
  # JSON manual (sin jq para no inflar la imagen). Escapamos comillas y \.
  esc=$(printf '%s' "$rel" | sed 's/\\/\\\\/g; s/"/\\"/g')
  printf '  {"path":"%s","size":%s}' "$esc" "$size" >> "$OUT"
done
printf '\n]\n' >> "$OUT"

echo "[koldo] tree.json generado:"
cat "$OUT"
