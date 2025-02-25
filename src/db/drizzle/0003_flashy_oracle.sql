ALTER TABLE "survey_response" DROP CONSTRAINT "survey_response_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "survey_response" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "survey_response" ADD COLUMN "referrals" integer DEFAULT 0;
