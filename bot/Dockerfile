FROM oven/bun:latest

WORKDIR /app

COPY bot ./bot
COPY database ./database
COPY shared ./shared

WORKDIR /app/bot

RUN bun install

EXPOSE 3333

ENTRYPOINT [ "bun", "run", "index.ts" ]
