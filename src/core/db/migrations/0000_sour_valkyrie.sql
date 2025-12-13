CREATE TABLE IF NOT EXISTS "followings" (
	"following_id" uuid,
	"followed_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "followings_following_id_followed_id_pk" PRIMARY KEY("following_id","followed_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"hash_password" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"bio" text DEFAULT '',
	"image" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_following_followed" ON "followings" USING btree ("following_id","followed_id");