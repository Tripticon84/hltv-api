FROM node:18-slim

# Installer les dépendances système et Playwright en une seule couche
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    libnss3 \
    libnspr4 \
    libgconf-2-4 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libxshmfence-dev \
    && npm install -g pnpm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json ./

RUN pnpm install \
    && pnpm exec playwright install chromium \
    && pnpm exec playwright install-deps chromium \
    && pnpm store prune

COPY src/ ./src/

RUN pnpm run build

ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "start"]
