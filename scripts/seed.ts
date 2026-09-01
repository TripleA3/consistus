/**
 * Seeds a fresh Postgres database with the same demo content the app used
 * to ship as in-memory mock data (see git history of src/lib/mock/*.ts),
 * so a new environment has realistic content instead of an empty catalog.
 *
 * Run once per fresh database: `npm run db:seed` (after `npm run db:push`
 * or `npm run db:migrate` has created the tables).
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import {
  events,
  notifications,
  talentProfiles,
  talentRequests,
  ticketTiers,
  users,
  walletBalances,
  walletTransactions,
  withdrawalMethods,
} from "../src/db/schema";

type SeedTalent = {
  key: string;
  name: string;
  email: string;
  category: (typeof talentProfiles.$inferInsert)["category"];
  bio: string;
  verified: boolean;
  ratePerVideo: number;
  ratePerAppearance: number;
  followerCount: number;
};

const seedTalents: SeedTalent[] = [
  {
    key: "talent-1",
    name: "Tech Unite Africa (TUA)",
    email: "hello@techuniteafrica.example",
    category: "techie",
    bio: "Pan-African tech community and event collective. Panels, meetups and keynote appearances.",
    verified: true,
    ratePerVideo: 45000,
    ratePerAppearance: 250000,
    followerCount: 128000,
  },
  {
    key: "talent-2",
    name: "Amara Divine",
    email: "amara@example.com",
    category: "artist",
    bio: "Afrobeats vocalist and songwriter. Available for shoutouts, duets and live appearances.",
    verified: false,
    ratePerVideo: 60000,
    ratePerAppearance: 400000,
    followerCount: 542000,
  },
  {
    key: "talent-3",
    name: "Kene Obi",
    email: "kene@example.com",
    category: "comedian",
    bio: "Stand-up comedian and skit creator. Personalised roast videos are my specialty.",
    verified: false,
    ratePerVideo: 25000,
    ratePerAppearance: 150000,
    followerCount: 89000,
  },
  {
    key: "talent-4",
    name: "Zola Marn",
    email: "zola@example.com",
    category: "actor",
    bio: "Screen and stage actor. Birthday shoutouts, coaching sessions and cameo appearances.",
    verified: true,
    ratePerVideo: 35000,
    ratePerAppearance: 300000,
    followerCount: 210000,
  },
];

async function main() {
  const [alreadySeeded] = await db.select({ id: users.id }).from(users).limit(1);
  if (alreadySeeded) {
    console.log("Database already has users — skipping seed to avoid duplicates.");
    return;
  }

  const talentIdByKey = new Map<string, string>();
  for (const talent of seedTalents) {
    const [user] = await db
      .insert(users)
      .values({ name: talent.name, email: talent.email, roles: ["talent"] })
      .returning();
    await db.insert(talentProfiles).values({
      userId: user.id,
      category: talent.category,
      bio: talent.bio,
      verified: talent.verified,
      ratePerVideo: talent.ratePerVideo,
      ratePerAppearance: talent.ratePerAppearance,
      followerCount: talent.followerCount,
    });
    talentIdByKey.set(talent.key, user.id);
  }
  const talent1 = talentIdByKey.get("talent-1")!;
  const talent2 = talentIdByKey.get("talent-2")!; // Amara Divine — the app's stubbed sign-in account
  const talent3 = talentIdByKey.get("talent-3")!;
  const talent4 = talentIdByKey.get("talent-4")!;

  const [demoFan] = await db
    .insert(users)
    .values({ name: "Tolu's Sister", email: "fan-demo@example.com", roles: ["fan"] })
    .returning();

  const seedEvents = [
    {
      title: "Lagos Tech & Gaming Night",
      description:
        "An evening of esports showdowns, indie demos and networking with the region's top builders.",
      category: "tech-and-gaming" as const,
      venue: "Landmark Event Centre",
      city: "Lagos",
      address: "1-5 Water Corporation Rd, Victoria Island, Lagos",
      startsAt: "2026-09-12T18:00:00.000Z",
      endsAt: "2026-09-12T23:00:00.000Z",
      hostTalentId: talent1,
      organizerName: "Tech Unite Africa",
      organizerFollowers: 3500,
      highlights: [
        "Live esports tournament with regional teams",
        "Indie demo booths and hands-on stations",
        "Networking mixer with drinks and small bites",
        "A relaxed, no-pressure atmosphere for builders",
      ],
      tiers: [
        {
          name: "Regular",
          price: 15000,
          currency: "NGN",
          quantityAvailable: 500,
          quantitySold: 210,
          perks: ["Entry", "Welcome drink"],
        },
        {
          name: "VIP",
          price: 45000,
          currency: "NGN",
          quantityAvailable: 80,
          quantitySold: 52,
          perks: ["Front row", "Meet & greet", "Merch pack"],
        },
      ],
    },
    {
      title: "Amara Divine Live: Unplugged",
      description: "An intimate acoustic set featuring fan favourites and unreleased tracks.",
      category: "concerts" as const,
      venue: "The Wheatbaker Lawn",
      city: "Lagos",
      address: "4 Onitolo (Bank) Rd, Ikoyi, Lagos",
      startsAt: "2026-10-03T19:00:00.000Z",
      endsAt: "2026-10-03T22:00:00.000Z",
      hostTalentId: talent2,
      organizerName: "Amara Divine",
      organizerFollowers: 542000,
      highlights: [
        "Acoustic set with the full live band",
        "Fan favourites plus two unreleased tracks",
        "Meet-and-greet for table bookings",
        "Complimentary welcome drink on arrival",
      ],
      tiers: [
        {
          name: "General",
          price: 25000,
          currency: "NGN",
          quantityAvailable: 300,
          quantitySold: 288,
          perks: ["Entry"],
        },
        {
          name: "Table for 4",
          price: 180000,
          currency: "NGN",
          quantityAvailable: 20,
          quantitySold: 14,
          perks: ["Reserved table", "Bottle service", "Signed poster"],
        },
      ],
    },
    {
      title: "Comedy Uncensored ft. Kene Obi",
      description: "A late-night stand-up showcase headlined by Kene Obi.",
      category: "nightlife" as const,
      venue: "Muri Okunola Park",
      city: "Lagos",
      address: "Muri Okunola St, Victoria Island, Lagos",
      startsAt: "2026-09-27T20:00:00.000Z",
      endsAt: "2026-09-28T00:00:00.000Z",
      hostTalentId: talent3,
      organizerName: "Kene Obi",
      organizerFollowers: 89000,
      highlights: [
        "Headline stand-up set from Kene Obi",
        "Two supporting acts",
        "Late-night food trucks on site",
        "18+ event, valid ID required",
      ],
      tiers: [
        {
          name: "Regular",
          price: 10000,
          currency: "NGN",
          quantityAvailable: 400,
          quantitySold: 145,
          perks: ["Entry"],
        },
      ],
    },
    {
      title: "Founders & Friends Networking Brunch",
      description: "Curated brunch for founders, creatives and the talent who back them.",
      category: "networking" as const,
      venue: "Rele Gallery",
      city: "Lagos",
      address: "9 Osborne Rd, Ikoyi, Lagos",
      startsAt: "2026-09-20T11:00:00.000Z",
      endsAt: "2026-09-20T14:00:00.000Z",
      hostTalentId: talent4,
      organizerName: "Zola Marn",
      organizerFollowers: 210000,
      highlights: [
        "Curated brunch menu with vegetarian options",
        "Structured mixer format — no awkward small talk",
        "Gallery walkthrough included",
        "Founders and creatives across sectors",
      ],
      tiers: [
        {
          name: "Regular",
          price: 20000,
          currency: "NGN",
          quantityAvailable: 120,
          quantitySold: 40,
          perks: ["Entry", "Brunch"],
        },
      ],
    },
  ];

  const eventIdByTitle = new Map<string, string>();
  for (const seedEvent of seedEvents) {
    const { tiers, ...eventValues } = seedEvent;
    const [event] = await db
      .insert(events)
      .values({
        ...eventValues,
        coverImage: "",
        startsAt: new Date(eventValues.startsAt),
        endsAt: new Date(eventValues.endsAt),
      })
      .returning();
    await db.update(events).set({ coverImage: event.id }).where(eq(events.id, event.id));
    await db.insert(ticketTiers).values(tiers.map((tier) => ({ ...tier, eventId: event.id })));
    eventIdByTitle.set(seedEvent.title, event.id);
  }
  const techNightId = eventIdByTitle.get("Lagos Tech & Gaming Night")!;
  const amaraLiveId = eventIdByTitle.get("Amara Divine Live: Unplugged")!;

  await db.insert(talentRequests).values({
    type: "personalised-video",
    fanId: demoFan.id,
    talentId: talent2,
    message: "Happy 30th birthday shoutout for my sister, Tolu!",
    occasion: "Birthday",
    recipientName: "Tolu",
    amount: 25000,
    currency: "NGN",
    status: "submitted",
    createdAt: new Date("2026-08-20T09:00:00.000Z"),
  });

  await db.insert(notifications).values([
    {
      userId: talent2,
      kind: "request",
      title: "New video request",
      body: "A fan asked you for a personalised video.",
      read: false,
      createdAt: new Date("2026-08-27T10:00:00.000Z"),
      href: "/talent/requests",
    },
    {
      userId: talent2,
      kind: "ticket",
      title: "Ticket confirmed",
      body: "Your tickets for Lagos Tech & Gaming Night are confirmed.",
      read: false,
      createdAt: new Date("2026-08-26T15:30:00.000Z"),
      href: `/events/${techNightId}`,
    },
    {
      userId: talent2,
      kind: "wallet",
      title: "Payout processed",
      body: "₦45,000 was sent to your default withdrawal method.",
      read: true,
      createdAt: new Date("2026-08-24T09:15:00.000Z"),
      href: "/talent/wallet",
    },
    {
      userId: talent2,
      kind: "event",
      title: "Event reminder",
      body: "Amara Divine Live: Unplugged is in 3 days.",
      read: true,
      createdAt: new Date("2026-08-22T08:00:00.000Z"),
      href: `/events/${amaraLiveId}`,
    },
    {
      userId: talent2,
      kind: "system",
      title: "Welcome to Fannero",
      body: "Complete your profile to start receiving requests from fans.",
      read: true,
      createdAt: new Date("2026-08-18T12:00:00.000Z"),
    },
  ]);

  await db.insert(walletBalances).values({
    talentId: talent2,
    availableBalance: 185000,
    pendingBalance: 40000,
    currency: "NGN",
  });

  await db.insert(walletTransactions).values([
    {
      talentId: talent2,
      kind: "credit",
      reason: "Personalised video — Tolu's birthday",
      amount: 60000,
      currency: "NGN",
      createdAt: new Date("2026-08-20T10:00:00.000Z"),
    },
    {
      talentId: talent2,
      kind: "debit",
      reason: "Withdrawal to GTBank ••••4521",
      amount: 100000,
      currency: "NGN",
      createdAt: new Date("2026-08-15T09:00:00.000Z"),
    },
    {
      talentId: talent2,
      kind: "credit",
      reason: "Special appearance — product launch",
      amount: 225000,
      currency: "NGN",
      createdAt: new Date("2026-08-10T14:00:00.000Z"),
    },
    {
      talentId: talent2,
      kind: "credit",
      reason: "Personalised video — anniversary shoutout",
      amount: 60000,
      currency: "NGN",
      createdAt: new Date("2026-07-22T10:00:00.000Z"),
    },
    {
      talentId: talent2,
      kind: "credit",
      reason: "Guest speaker — Founders Summit",
      amount: 150000,
      currency: "NGN",
      createdAt: new Date("2026-06-18T10:00:00.000Z"),
    },
    {
      talentId: talent2,
      kind: "credit",
      reason: "Personalised video — graduation",
      amount: 60000,
      currency: "NGN",
      createdAt: new Date("2026-05-05T10:00:00.000Z"),
    },
  ]);

  await db.insert(withdrawalMethods).values({
    talentId: talent2,
    type: "bank-account",
    label: "GTBank",
    last4: "4521",
    isDefault: true,
  });

  console.log("Seed complete:");
  console.log(`  ${seedTalents.length} talents + profiles`);
  console.log(`  1 demo fan (${demoFan.email})`);
  console.log(`  ${seedEvents.length} events with ticket tiers`);
  console.log("  1 sample request, 5 notifications, wallet balance + 6 transactions, 1 withdrawal method");
  console.log("");
  console.log("Sign in with any email/password to land on the seeded Amara Divine account (fan + talent).");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
