FROM oven/bun:latest

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY web ./web
COPY database ./database
COPY shared ./shared

EXPOSE 3000

WORKDIR /app/web

RUN bun install

ENTRYPOINT ["bun", "run", "start"]
