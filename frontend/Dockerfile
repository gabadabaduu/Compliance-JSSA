FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json* ./
RUN npm ci
COPY . .
RUN npm run build -- --outDir dist

FROM nginx:alpine
RUN apk add --no-cache gettext
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
ENV BACKEND_URL=http://backend:8080
CMD sh -c "envsubst '\$BACKEND_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1