import { pgTable, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";

export const guilds = pgTable("guilds", {
  id: varchar("id", { length: 255 }).primaryKey(),
  discordId: varchar("discord_id", { length: 255 }).notNull().unique(),
  name: text("name").notNull(),
  icon: text("icon"),
  ownerId: varchar("owner_id", { length: 255 }).notNull(),
  memberCount: integer("member_count"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
