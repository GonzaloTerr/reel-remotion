FROM node:22-bookworm-slim

# Librerias que Chromium (headless) necesita para renderizar con Remotion
RUN apt-get update && apt-get install -y \
    libnss3 libdbus-1-3 libatk1.0-0 libgbm-dev libasound2 libxrandr2 \
    libxkbcommon-dev libxfixes3 libxcomposite1 libxdamage1 libatk-bridge2.0-0 \
    libpango-1.0-0 libcairo2 libcups2 ca-certificates fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Descarga el navegador headless en build (evita demora/errores en el primer render)
RUN npx remotion browser ensure

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.mjs"]