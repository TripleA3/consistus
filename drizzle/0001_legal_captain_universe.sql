CREATE TYPE "public"."payment_method" AS ENUM('bank-transfer', 'card');--> statement-breakpoint
DROP TABLE "ticket_orders" CASCADE;