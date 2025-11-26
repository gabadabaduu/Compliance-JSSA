#!/bin/sh
set -e

if [ -z "${BACKEND_URL}" ]; then
  echo "WARN: BACKEND_URL no está definido. Usando valor por defecto http://127.0.0.1:8080"
  export BACKEND_URL="http://127.0.0.1:8080"
fi

# Sustituir plantilla nginx
envsubst '\$BACKEND_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Sustituir plantilla de env runtime y colocar en /usr/share/nginx/html/env.js
# Asegúrate de que /usr/share/nginx/html/env.template.js exista en la imagen
envsubst '\$VITE_SUPABASE_URL \$VITE_SUPABASE_ANON_KEY \$VITE_API_URL \$BACKEND_URL' \
  < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js

exec nginx -g 'daemon off;'