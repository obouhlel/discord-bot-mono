import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const botStatus = pgTable("bot_status", {
  id: serial("id").primaryKey(),
  status: text("status").notNull().$type<"online" | "offline" | "starting">(),
  lastHeartbeat: timestamp("last_heartbeat").defaultNow().notNull(),
});

export type BotStatus = typeof botStatus.$inferSelect;
export type NewBotStatus = typeof botStatus.$inferInsert;
