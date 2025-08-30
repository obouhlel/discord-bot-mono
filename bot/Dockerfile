FROM oven/bun:latest

WORKDIR /app

COPY bot ./bot
COPY database ./database
COPY shared ./shared

WORKDIR /app/bot

RUN bun install

ENTRYPOINT [ "bun", "run", "index.ts" ]
