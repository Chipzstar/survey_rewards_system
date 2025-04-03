ALTER TABLE "survey_response" ADD COLUMN "reward_id" integer;--> statement-breakpoint
ALTER TABLE "survey_response" ADD COLUMN "reward_claimed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "survey_response" ADD CONSTRAINT "survey_response_reward_id_reward_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."reward"("id") ON DELETE no action ON UPDATE no action;