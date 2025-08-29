import type { Config } from "drizzle-kit";

export default {
  schema: "./schemas",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: Bun.env.DATABASE_URL,
  },
} satisfies Config;