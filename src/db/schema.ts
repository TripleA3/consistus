import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["fan", "talent"]);
export const talentCategoryEnum = pgEnum("talent_category", [
  "artist",
  "actor",
  "comedian",
  "techie",
  "athlete",
  "influencer",
]);
export const eventCategoryEnum = pgEnum("event_category", [
  "concerts",
  "nightlife",
  "tech-and-gaming",
  "food-and-drinks",
  "networking",
]);
export const ticketOrderStatusEnum = pgEnum("ticket_order_status", [
  "pending",
  "paid",
  "cancelled",
  "refunded",
]);
export const requestTypeEnum = pgEnum("request_type", [
  "personalised-video",
  "guest-speaker",
  "special-appearance",
  "event-invitation",
]);
export const requestStatusEnum = pgEnum("request_status", [
  "draft",
  "submitted",
  "accepted",
  "declined",
  "in-progress",
  "delivered",
  "completed",
  "cancelled",
]);
export const notificationKindEnum = pgEnum("notification_kind", [
  "request",
  "ticket",
  "wallet",
  "system",
  "event",
]);
export const withdrawalMethodTypeEnum = pgEnum("withdrawal_method_type", [
  "bank-account",
  "mobile-money",
]);
export const walletTransactionKindEnum = pgEnum("wallet_transaction_kind", [
  "credit",
  "debit",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  roles: userRoleEnum("roles").array().notNull().default(["fan"]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const talentProfiles = pgTable("talent_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  category: talentCategoryEnum("category").notNull(),
  bio: text("bio").notNull().default(""),
  verified: boolean("verified").notNull().default(false),
  ratePerVideo: integer("rate_per_video").notNull().default(0),
  ratePerAppearance: integer("rate_per_appearance").notNull().default(0),
  followerCount: integer("follower_count").notNull().default(0),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image").notNull(),
  category: eventCategoryEnum("category").notNull(),
  venue: text("venue").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  hostTalentId: uuid("host_talent_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  organizerName: text("organizer_name").notNull(),
  organizerFollowers: integer("organizer_followers").notNull().default(0),
  highlights: text("highlights").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const ticketTiers = pgTable("ticket_tiers", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  currency: text("currency").notNull().default("NGN"),
  quantityAvailable: integer("quantity_available").notNull(),
  quantitySold: integer("quantity_sold").notNull().default(0),
  perks: text("perks").array().notNull().default([]),
});

export const ticketOrders = pgTable("ticket_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  tierId: uuid("tier_id")
    .notNull()
    .references(() => ticketTiers.id, { onDelete: "cascade" }),
  buyerId: uuid("buyer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  subtotal: integer("subtotal").notNull(),
  fees: integer("fees").notNull(),
  total: integer("total").notNull(),
  currency: text("currency").notNull().default("NGN"),
  status: ticketOrderStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const talentRequests = pgTable("talent_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: requestTypeEnum("type").notNull(),
  fanId: uuid("fan_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  talentId: uuid("talent_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  occasion: text("occasion"),
  recipientName: text("recipient_name"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("NGN"),
  status: requestStatusEnum("status").notNull().default("submitted"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  dueBy: timestamp("due_by", { withTimezone: true }),
  deliveryUrl: text("delivery_url"),
  termsAcceptedAt: timestamp("terms_accepted_at", { withTimezone: true }),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  kind: notificationKindEnum("kind").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  href: text("href"),
});

export const withdrawalMethods = pgTable("withdrawal_methods", {
  id: uuid("id").primaryKey().defaultRandom(),
  talentId: uuid("talent_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: withdrawalMethodTypeEnum("type").notNull(),
  label: text("label").notNull(),
  last4: text("last4").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
});

export const walletTransactions = pgTable("wallet_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  talentId: uuid("talent_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  kind: walletTransactionKindEnum("kind").notNull(),
  reason: text("reason").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("NGN"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  relatedRequestId: uuid("related_request_id").references(() => talentRequests.id, {
    onDelete: "set null",
  }),
});

/**
 * Wallet balances, tracked directly rather than derived from
 * wallet_transactions — mirrors the mock store, which kept a separate
 * summary per talent and only adjusted it on withdrawal. `pendingBalance`
 * has no transaction trail yet (nothing currently moves money into it);
 * it exists so the wallet screens have a real column to read once a
 * payout-pending flow is built.
 */
export const walletBalances = pgTable("wallet_balances", {
  talentId: uuid("talent_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  availableBalance: integer("available_balance").notNull().default(0),
  pendingBalance: integer("pending_balance").notNull().default(0),
  currency: text("currency").notNull().default("NGN"),
});

/**
 * Withdrawal PIN, stored separately from withdrawal_methods so it can carry
 * a hash instead of a plaintext value — the mock store kept this in
 * plaintext (see docs/open-questions.md); this is the real-DB fix.
 */
export const walletPins = pgTable("wallet_pins", {
  talentId: uuid("talent_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  pinHash: text("pin_hash").notNull(),
});
