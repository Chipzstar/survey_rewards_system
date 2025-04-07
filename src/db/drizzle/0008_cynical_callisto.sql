CREATE TABLE "gen_bot_response" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gen_bot_response_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"survey_id" integer NOT NULL,
	"user_id" varchar(255) DEFAULT '1001' NOT NULL,
	"response_id" varchar(255) NOT NULL,
	"question" varchar(255) NOT NULL,
	"attendance_reason" varchar(255) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "gen_bot_response" ADD CONSTRAINT "gen_bot_response_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "public"."survey"("id") ON DELETE no action ON UPDATE no action;