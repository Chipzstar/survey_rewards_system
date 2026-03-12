CREATE TABLE "reward_survey" (
	"reward_id" integer NOT NULL,
	"survey_id" integer NOT NULL,
	CONSTRAINT "reward_survey_reward_id_survey_id_pk" PRIMARY KEY("reward_id","survey_id")
);
--> statement-breakpoint
ALTER TABLE "reward_survey" ADD CONSTRAINT "reward_survey_reward_id_reward_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."reward"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reward_survey" ADD CONSTRAINT "reward_survey_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "public"."survey"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- Preserve existing reward–survey links before dropping column
INSERT INTO "reward_survey" ("reward_id", "survey_id")
SELECT "id", "survey_id" FROM "reward" WHERE "survey_id" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "reward" DROP CONSTRAINT "reward_survey_id_survey_id_fk";
--> statement-breakpoint
ALTER TABLE "reward" DROP COLUMN "survey_id";