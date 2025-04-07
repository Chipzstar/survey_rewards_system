CREATE TABLE "reward" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reward_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"reward_id" integer NOT NULL,
	"survey_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"cta_text" varchar(255) NOT NULL,
	"link" varchar(255) NOT NULL,
	"limit" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "survey_response" ALTER COLUMN "user_id" SET DEFAULT '1001';--> statement-breakpoint
ALTER TABLE "survey_response" ALTER COLUMN "survey_code" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "survey_response" ALTER COLUMN "survey_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "survey" ALTER COLUMN "link" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" varchar DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "reward" ADD CONSTRAINT "reward_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "public"."survey"("id") ON DELETE no action ON UPDATE no action;