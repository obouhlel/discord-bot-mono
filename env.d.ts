declare module "bun" {
  interface Env {
    NODE_ENV: "developpement" | "production" | "test";
    TZ: "UTC";
    DISCORD_CLIENT_ID: string;
    DISCORD_SECRET_CLIENT: string;
    DISCORD_BOT_TOKEN: string;
    DATABASE_URL: string;
    PUBLIC_API_URL: string;
  }
}
