#!/bin/bash
# koldo-autoconfig.sh — Auto-configuración del sistema Koldo
# Se ejecuta al iniciar el agente para sincronizar con el repo

set -e

REPO_DIR="/root/workspace/Koldo"
HERMES_SKILLS="/hermes-home/skills/koldo"

# 1. Sincronizar repo
cd "$REPO_DIR"
git pull origin main 2>/dev/null || echo "⚠ Repo ya actualizado o sin conexión"

# 2. Sincronizar skills al directorio de Hermes
mkdir -p "$HERMES_SKILLS"
cp "$REPO_DIR/koldo/"*.md "$HERMES_SKILLS/" 2>/dev/null || true

# 3. Verificar que gh está autenticado
if ! gh auth status >/dev/null 2>&1; then
    token=$(grep GITHUB_TOKEN /hermes-home/.env 2>/dev/null | cut -d'=' -f2-)
    if [ -n "$token" ]; then
        echo "$token" | gh auth login --with-token 2>/dev/null
        echo "✓ GitHub autenticado"
    else
        echo "⚠ Token de GitHub no encontrado"
    fi
fi

echo "✓ Koldo auto-configuración completa"
