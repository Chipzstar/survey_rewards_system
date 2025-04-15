ALTER TABLE "survey_response" ADD COLUMN "rating" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "survey_response" ADD COLUMN "top_words" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "survey_response" ADD COLUMN "testimonial" varchar(255) DEFAULT '' NOT NULL;