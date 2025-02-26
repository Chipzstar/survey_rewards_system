ALTER TABLE "referral" DROP CONSTRAINT "referral_referrer_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "referral" DROP CONSTRAINT "referral_referee_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "referral" ALTER COLUMN "referrer_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "referral" ALTER COLUMN "referee_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "survey_response" ALTER COLUMN "referrals" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "referral" ADD COLUMN "name" varchar(255) NOT NULL;
