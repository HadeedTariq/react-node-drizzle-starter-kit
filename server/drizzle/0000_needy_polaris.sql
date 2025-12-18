CREATE TYPE "public"."user_gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('customer', 'admin', 'vendor');--> statement-breakpoint
CREATE TYPE "public"."source" AS ENUM('google', 'facebook', 'whatsapp', 'general');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_name" varchar(50),
	"email" varchar(100),
	"password" text,
	"role" "role" DEFAULT 'customer',
	"source" "source" DEFAULT 'general',
	"is_active" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"gender" "user_gender",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
