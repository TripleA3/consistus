CREATE TABLE "ticket_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"tier_id" uuid NOT NULL,
	"tier_name" text NOT NULL,
	"unit_price" integer NOT NULL,
	"quantity" integer NOT NULL,
	"line_total" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"buyer_id" uuid,
	"buyer_name" text NOT NULL,
	"buyer_email" text NOT NULL,
	"buyer_phone" text DEFAULT '' NOT NULL,
	"reference" text NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"subtotal" integer NOT NULL,
	"fees" integer NOT NULL,
	"total" integer NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"status" "ticket_order_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ticket_orders_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
ALTER TABLE "ticket_order_items" ADD CONSTRAINT "ticket_order_items_order_id_ticket_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."ticket_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_order_items" ADD CONSTRAINT "ticket_order_items_tier_id_ticket_tiers_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."ticket_tiers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_orders" ADD CONSTRAINT "ticket_orders_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_orders" ADD CONSTRAINT "ticket_orders_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;