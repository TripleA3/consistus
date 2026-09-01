CREATE TYPE "public"."event_category" AS ENUM('concerts', 'nightlife', 'tech-and-gaming', 'food-and-drinks', 'networking');--> statement-breakpoint
CREATE TYPE "public"."notification_kind" AS ENUM('request', 'ticket', 'wallet', 'system', 'event');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('draft', 'submitted', 'accepted', 'declined', 'in-progress', 'delivered', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."request_type" AS ENUM('personalised-video', 'guest-speaker', 'special-appearance', 'event-invitation');--> statement-breakpoint
CREATE TYPE "public"."talent_category" AS ENUM('artist', 'actor', 'comedian', 'techie', 'athlete', 'influencer');--> statement-breakpoint
CREATE TYPE "public"."ticket_order_status" AS ENUM('pending', 'paid', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('fan', 'talent');--> statement-breakpoint
CREATE TYPE "public"."wallet_transaction_kind" AS ENUM('credit', 'debit');--> statement-breakpoint
CREATE TYPE "public"."withdrawal_method_type" AS ENUM('bank-account', 'mobile-money');--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"cover_image" text NOT NULL,
	"category" "event_category" NOT NULL,
	"venue" text NOT NULL,
	"city" text NOT NULL,
	"address" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"host_talent_id" uuid NOT NULL,
	"organizer_name" text NOT NULL,
	"organizer_followers" integer DEFAULT 0 NOT NULL,
	"highlights" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"kind" "notification_kind" NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"href" text
);
--> statement-breakpoint
CREATE TABLE "talent_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"category" "talent_category" NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"rate_per_video" integer DEFAULT 0 NOT NULL,
	"rate_per_appearance" integer DEFAULT 0 NOT NULL,
	"follower_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "talent_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "talent_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "request_type" NOT NULL,
	"fan_id" uuid NOT NULL,
	"talent_id" uuid NOT NULL,
	"message" text NOT NULL,
	"occasion" text,
	"recipient_name" text,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"status" "request_status" DEFAULT 'submitted' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"due_by" timestamp with time zone,
	"delivery_url" text,
	"terms_accepted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ticket_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"tier_id" uuid NOT NULL,
	"buyer_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"subtotal" integer NOT NULL,
	"fees" integer NOT NULL,
	"total" integer NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"status" "ticket_order_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_tiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"quantity_available" integer NOT NULL,
	"quantity_sold" integer DEFAULT 0 NOT NULL,
	"perks" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"avatar_url" text,
	"roles" "user_role"[] DEFAULT '{"fan"}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wallet_balances" (
	"talent_id" uuid PRIMARY KEY NOT NULL,
	"available_balance" integer DEFAULT 0 NOT NULL,
	"pending_balance" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallet_pins" (
	"talent_id" uuid PRIMARY KEY NOT NULL,
	"pin_hash" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallet_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"talent_id" uuid NOT NULL,
	"kind" "wallet_transaction_kind" NOT NULL,
	"reason" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"related_request_id" uuid
);
--> statement-breakpoint
CREATE TABLE "withdrawal_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"talent_id" uuid NOT NULL,
	"type" "withdrawal_method_type" NOT NULL,
	"label" text NOT NULL,
	"last4" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_host_talent_id_users_id_fk" FOREIGN KEY ("host_talent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talent_profiles" ADD CONSTRAINT "talent_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talent_requests" ADD CONSTRAINT "talent_requests_fan_id_users_id_fk" FOREIGN KEY ("fan_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talent_requests" ADD CONSTRAINT "talent_requests_talent_id_users_id_fk" FOREIGN KEY ("talent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_orders" ADD CONSTRAINT "ticket_orders_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_orders" ADD CONSTRAINT "ticket_orders_tier_id_ticket_tiers_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."ticket_tiers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_orders" ADD CONSTRAINT "ticket_orders_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_tiers" ADD CONSTRAINT "ticket_tiers_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_balances" ADD CONSTRAINT "wallet_balances_talent_id_users_id_fk" FOREIGN KEY ("talent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_pins" ADD CONSTRAINT "wallet_pins_talent_id_users_id_fk" FOREIGN KEY ("talent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_talent_id_users_id_fk" FOREIGN KEY ("talent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_related_request_id_talent_requests_id_fk" FOREIGN KEY ("related_request_id") REFERENCES "public"."talent_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawal_methods" ADD CONSTRAINT "withdrawal_methods_talent_id_users_id_fk" FOREIGN KEY ("talent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;