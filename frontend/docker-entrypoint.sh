#!/bin/sh
set -e

# Si BACKEND_URL está vacío, usar un valor por defecto para evitar que nginx cargue una directiva inválida.
# Ajusta el default si prefieres otro host/puerto para pruebas locales.
if [ -z "${BACKEND_URL}" ]; then
  echo "WARN: BACKEND_URL no está definido. Usando valor por defecto http://127.0.0.1:8080"
  export BACKEND_URL="http://127.0.0.1:8080"
fi

# Sustituir la plantilla y generar la configuración final
envsubst '\$BACKEND_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Arrancar nginx en primer plano
exec nginx -g 'daemon off;'