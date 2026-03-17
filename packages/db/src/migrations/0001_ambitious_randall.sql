ALTER TABLE "user" ALTER COLUMN "phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_phone_unique" UNIQUE("phone");