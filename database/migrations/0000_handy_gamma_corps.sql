CREATE TABLE "guilds" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"discord_id" varchar(255) NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"owner_id" varchar(255) NOT NULL,
	"member_count" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "guilds_discord_id_unique" UNIQUE("discord_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"discord_id" varchar(255) NOT NULL,
	"username" text NOT NULL,
	"global_name" text,
	"email" text,
	"verified" boolean DEFAULT false,
	"locale" varchar(10),
	"mfa_enabled" boolean DEFAULT false,
	"premium_type" integer,
	"avatar" text,
	"banner" text,
	"accent_color" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_discord_id_unique" UNIQUE("discord_id")
);
