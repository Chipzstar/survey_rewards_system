ALTER TABLE "gift_card" ADD COLUMN "survey_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "gift_card" ADD COLUMN "priority" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "gift_card" ADD CONSTRAINT "gift_card_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "public"."survey"("id") ON DELETE no action ON UPDATE no action;
