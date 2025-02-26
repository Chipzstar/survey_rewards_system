ALTER TABLE "survey_winner" DROP CONSTRAINT "survey_winner_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "survey_winner" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);
