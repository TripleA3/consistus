export type UserRole = "fan" | "talent";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roles: UserRole[];
  talentProfile?: TalentProfile;
}

export interface TalentProfile {
  id: string;
  userId: string;
  category: TalentCategory;
  bio: string;
  verified: boolean;
  ratePerVideo: number;
  ratePerAppearance: number;
  followerCount: number;
}

export type TalentCategory =
  | "artist"
  | "actor"
  | "comedian"
  | "techie"
  | "athlete"
  | "influencer";

export type EventCategory =
  | "concerts"
  | "nightlife"
  | "tech-and-gaming"
  | "food-and-drinks"
  | "networking";

export interface EventItem {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: EventCategory;
  venue: string;
  city: string;
  address: string;
  startsAt: string;
  endsAt: string;
  hostTalentId: string;
  organizerName: string;
  organizerFollowers: number;
  highlights: string[];
  ticketTiers: TicketTier[];
}

export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  price: number;
  currency: string;
  quantityAvailable: number;
  quantitySold: number;
  perks: string[];
}

export interface TicketOrder {
  id: string;
  eventId: string;
  tierId: string;
  buyerId: string;
  quantity: number;
  subtotal: number;
  fees: number;
  total: number;
  currency: string;
  status: "pending" | "paid" | "cancelled" | "refunded";
  createdAt: string;
}

export type RequestType =
  | "personalised-video"
  | "guest-speaker"
  | "special-appearance"
  | "event-invitation";

export type RequestStatus =
  | "draft"
  | "submitted"
  | "accepted"
  | "declined"
  | "in-progress"
  | "delivered"
  | "completed"
  | "cancelled";

export interface TalentRequest {
  id: string;
  type: RequestType;
  fanId: string;
  talentId: string;
  message: string;
  occasion?: string;
  recipientName?: string;
  amount: number;
  currency: string;
  status: RequestStatus;
  createdAt: string;
  dueBy?: string;
  deliveryUrl?: string;
  termsAcceptedAt?: string;
}

export type PaymentMethodType = "bank-transfer" | "card";

export interface PaymentIntentResult {
  id: string;
  status:
    | "requires_payment"
    | "processing"
    | "requires_confirmation"
    | "succeeded"
    | "failed";
  amount: number;
  currency: string;
  method: PaymentMethodType;
  reference?: string;
}

export type NotificationKind =
  | "request"
  | "ticket"
  | "wallet"
  | "system"
  | "event";

export interface AppNotification {
  id: string;
  userId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

export type WithdrawalMethodType = "bank-account" | "mobile-money";

export interface WithdrawalMethod {
  id: string;
  talentId: string;
  type: WithdrawalMethodType;
  label: string;
  last4: string;
  isDefault: boolean;
}

export interface WalletTransaction {
  id: string;
  talentId: string;
  kind: "credit" | "debit";
  reason: string;
  amount: number;
  currency: string;
  createdAt: string;
  relatedRequestId?: string;
}

export interface WalletSummary {
  talentId: string;
  availableBalance: number;
  pendingBalance: number;
  currency: string;
}
