FROM oven/bun:latest AS base

WORKDIR /app

COPY web/package.json ./
RUN bun install

COPY web/ ./
COPY shared/ ../shared/

RUN bun run build

FROM oven/bun:latest AS production

RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=base /app/build ./build
COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules

EXPOSE 3000

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", "build"]
