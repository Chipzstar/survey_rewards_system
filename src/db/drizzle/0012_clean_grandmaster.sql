DROP TABLE "gift_card" CASCADE;--> statement-breakpoint
DROP TABLE "survey_winner" CASCADE;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "num_attendees" integer DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "num_speakers" integer DEFAULT 20 NOT NULL;