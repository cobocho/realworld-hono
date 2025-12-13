ALTER TABLE "followings" RENAME COLUMN "following_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "followings" RENAME COLUMN "followed_id" TO "follower_id";--> statement-breakpoint
DROP INDEX "unique_following_followed";--> statement-breakpoint
ALTER TABLE "followings" DROP CONSTRAINT "followings_following_id_followed_id_pk";--> statement-breakpoint
ALTER TABLE "followings" ADD CONSTRAINT "followings_user_id_follower_id_pk" PRIMARY KEY("user_id","follower_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_following_followed" ON "followings" USING btree ("user_id","follower_id");