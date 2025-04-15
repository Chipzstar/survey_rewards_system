ALTER TABLE "event" ADD COLUMN "speaker_posts" text[] DEFAULT ARRAY[]::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "reward" ADD COLUMN "user_id" integer DEFAULT 69 NOT NULL;--> statement-breakpoint
ALTER TABLE "reward" ADD CONSTRAINT "reward_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;