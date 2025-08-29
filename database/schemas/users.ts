import { pgTable, text, timestamp, varchar, boolean, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  discordId: varchar("discord_id", { length: 255 }).notNull().unique(),
  username: text("username").notNull(),
  globalName: text("global_name"),
  email: text("email"),
  verified: boolean("verified").default(false),
  locale: varchar("locale", { length: 10 }),
  mfaEnabled: boolean("mfa_enabled").default(false),
  premiumType: integer("premium_type"),
  avatar: text("avatar"),
  banner: text("banner"),
  accentColor: integer("accent_color"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});