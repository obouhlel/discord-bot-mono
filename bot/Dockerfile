FROM oven/bun:latest

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY bot ./bot
COPY database ./database
COPY shared ./shared

WORKDIR /app/bot

RUN bun install

EXPOSE 3333

ENTRYPOINT [ "bun", "run", "index.ts" ]
