# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Nginx + entrypoint
FROM nginx:alpine
RUN apk add --no-cache gettext

# Copiar assets construidos al serve path
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar la plantilla runtime env al html root (se procesará en el entrypoint)
COPY env.template.js /usr/share/nginx/html/env.template.js

# Copiar plantilla nginx y entrypoint
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]