FROM oven/bun:latest

WORKDIR /app

COPY bot ./bot
COPY database ./database

WORKDIR /app/bot

RUN bun install

ENTRYPOINT [ "bun", "run", "index.ts" ]
