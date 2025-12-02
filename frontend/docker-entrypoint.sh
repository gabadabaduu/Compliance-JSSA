#!/bin/sh
set -e

printenv | grep -E "VITE_|BACKEND_" || echo "No vars found"

if [ -z "${BACKEND_URL}" ]; then
  export BACKEND_URL="http://127.0.0.1:8080"
fi

export BACKEND_HOST=$(echo ${BACKEND_URL} | sed -e 's|^[^/]*//||' -e 's|/.*$||')

if [ -z "${VITE_API_URL}" ]; then
  export VITE_API_URL="${BACKEND_URL}"
fi

echo "🔍 BACKEND_URL: ${BACKEND_URL}"
echo "🔍 BACKEND_HOST: ${BACKEND_HOST}"

envsubst '\$BACKEND_URL \$BACKEND_HOST' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

envsubst '\$VITE_SUPABASE_URL \$VITE_SUPABASE_ANON_KEY \$VITE_API_URL \$BACKEND_URL' < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js

cat /usr/share/nginx/html/env.js

exec nginx -g 'daemon off;'