#!/bin/sh
set -e

echo "🔍 DEBUG: Variables de entorno recibidas"
printenv | grep -E "VITE_|BACKEND_" || echo "❌ No se encontraron variables VITE_ o BACKEND_"

if [ -z "${BACKEND_URL}" ]; then
  echo "⚠️  WARN: BACKEND_URL no está definido.  Usando valor por defecto http://127.0.0.1:8080"
  export BACKEND_URL="http://127.0.0.1:8080"
else
  echo "✅ BACKEND_URL definido: ${BACKEND_URL}"
fi

if [ -z "${VITE_API_URL}" ]; then
  echo "⚠️  WARN: VITE_API_URL no está definido. Usando BACKEND_URL como fallback"
  export VITE_API_URL="${BACKEND_URL}"
else
  echo "✅ VITE_API_URL definido: ${VITE_API_URL}"
fi

echo "📝 Generando nginx config..."
envsubst '\$BACKEND_URL' < /etc/nginx/conf.d/default. conf.template > /etc/nginx/conf.d/default.conf

echo "📝 Generando env.js..."
envsubst '\$VITE_SUPABASE_URL \$VITE_SUPABASE_ANON_KEY \$VITE_API_URL \$BACKEND_URL' \
  < /usr/share/nginx/html/env.template. js > /usr/share/nginx/html/env.js

echo "✅ Archivo env.js generado:"
cat /usr/share/nginx/html/env.js

exec nginx -g 'daemon off;'