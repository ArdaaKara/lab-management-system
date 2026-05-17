# ── Stage 1: Build ────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# package.json + package-lock.json ayrı kopyalanır; bağımlılıklar yalnızca
# bu dosyalar değişince yeniden yüklenir (Docker katman önbelleği).
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --no-audit --no-fund

COPY . .

# VITE_API_BASE_URL derleme zamanında gömülür (Vite runtime env desteklemez).
# docker-compose.yml bu arg'ı VITE_API_BASE_URL=/api/v1 olarak geçirir.
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────────────
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Varsayılan Nginx config'i kaldırılır; nginx.conf docker-compose tarafından
# volume-mount edilir (./nginx/nginx.conf:/etc/nginx/nginx.conf:ro).
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist .

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
