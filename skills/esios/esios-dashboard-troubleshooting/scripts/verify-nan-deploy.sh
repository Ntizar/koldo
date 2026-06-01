#!/usr/bin/env bash
# Verifica que todos los archivos estáticos del proyecto coinciden entre local y remoto.
# Úsalo para diagnosticar si NaN.builders sirve una versión antigua.
#
# Uso:
#   ./verify-nan-deploy.sh https://sistemaelectricofuturo-ntizar-ntizar.apps.nan.builders
#   ./verify-nan-deploy.sh https://esios-dashboard-ntizar-ntizar.apps.nan.builders

set -euo pipefail

BASE_URL="${1:?Usage: $0 <base-url>}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Archivos a verificar (relativos al root del proyecto)
FILES=(
    "index.html"
    "css/ntizar.css"
    "css/app.css"
    "css/ree-data.css"
    "js/constants.js"
    "js/theme.js"
    "js/nuclear.js"
    "js/weather.js"
    "js/demand.js"
    "js/storage.js"
    "js/policy.js"
    "js/scenarios.js"
    "js/simulator.js"
    "js/montecarlo.js"
    "js/trajectory.js"
    "js/charts.js"
    "js/ree-data.js"
    "js/app.js"
)

echo "Verificando deploy de $BASE_URL"
echo "================================"

MISMATCHES=0
OK=0

for file in "${FILES[@]}"; do
    local_path="$PROJECT_DIR/$file"
    if [ ! -f "$local_path" ]; then
        echo "⚠️  $file - NO EXISTE LOCAL"
        continue
    fi

    local_hash=$(md5sum "$local_path" | cut -d' ' -f1)
    remote_url="${BASE_URL%/}/$file"
    remote_data=$(curl -s --max-time 10 "$remote_url" 2>/dev/null || echo "")
    
    if [ -z "$remote_data" ]; then
        echo "❌ $file - REMOTE NO ENCONTRADO (404?)"
        MISMATCHES=$((MISMATCHES + 1))
        continue
    fi
    
    remote_hash=$(echo "$remote_data" | md5sum | cut -d' ' -f1)
    
    if [ "$local_hash" = "$remote_hash" ]; then
        echo "✅ $file"
        OK=$((OK + 1))
    else
        echo "❌ $file - DESACTUALIZADO"
        echo "   Local:  $local_hash"
        echo "   Remote: $remote_hash"
        MISMATCHES=$((MISMATCHES + 1))
    fi
done

echo ""
echo "Resultados: $OK OK, $MISMATCHES desactualizados"

if [ $MISMATCHES -gt 0 ]; then
    echo ""
    echo "⚠️  Archivos desactualizados en NaN.builders."
    echo "   Solución: git commit --allow-empty -m 'chore: trigger redeploy' && git push origin main"
    exit 1
else
    echo ""
    echo "✅ Todo coincide. Deploy actualizado."
    exit 0
fi
