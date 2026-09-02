# Decisions

Running log of calls made while building Fannero from the Figma file
(`RLCWKlUcOHmlxKuyOxx7cN`), so nothing gets silently resolved.

## Design system page (node `1:3`) is a generic Untitled UI kit

The "Design System" page is an un-rebranded Untitled UI starter kit — its
typography section literally says "Untitled UI" / "www.untitledui.com", and
its color swatches use generic scale names (`color/primary/900`,
`color/gray/500`, ...) with no lime/green anywhere. It is **not** where
Fannero's real brand tokens live.

**Decision:** tokens were extracted from real usage in product frames
(section `6007:*`, the canonical home/event/checkout section) instead —
`var(--primary-color, #d2ff7c)`, `var(--black, #0f1727)`,
`var(--background-color, #fafeff)`, `#a7f229` (Sulu/400, active states),
`#000e2d` (navy card panels), plus the lime/slate/gray scale reported in the
node's style metadata (`lime/500: #84CC16`, `lime/200: #D9F99D`,
`lime/100: #ECFCCB`, `slate/900`, `slate/400`, `slate/500`, `Gray/200`,
`Gray/300`). These are recorded in `src/app/globals.css`. The brief's
"known values to verify" list was accurate for every value it named.

## Figma asset bytes could not be downloaded in this environment

This sandbox's network egress policy blocks `www.figma.com` outright (403 on
every CONNECT — confirmed via the agent proxy's status log as an
organization policy denial, not a transient failure). The Figma MCP tools
still work (they run outside this sandbox), so design context, measurements,
and colors are real — but the exported icon/photo bytes the brief asks to
be committed could not be fetched.

**Decision (user-approved):** proceed with a small hand-drawn icon set
(`src/components/ui/Icon.tsx`) standing in for generic UI glyphs (search,
bell, heart, clock, mail, settings, etc.), and a deterministic gradient
placeholder (`src/components/ui/ImagePlaceholder.tsx`) standing in for
photography, both clearly documented as substitutes. See
`docs/open-questions.md` for the follow-up. The Fannero wordmark logo
(Plus Jakarta Sans Bold "fannero") is rendered as text since the logomark
graphic asset also could not be downloaded.

## Header adapted for mobile without a matching 390px frame

The sections reviewed for Phase 1 didn't surface a mobile header/nav frame.
Adapted the subpage nav chips into a fixed bottom tab bar
(`MobileTabBar.tsx`) — a conventional mobile pattern — rather than stalling.
Revisit if a canonical mobile header frame turns up in a later phase.

## Site footer built to token, not to a canonical frame

No canonical Fannero footer frame surfaced in the sections reviewed for
Phase 1 (the Design System page's footer is the generic Untitled UI one).
Built `Footer.tsx` to the established tokens (navy background, lime
accents) with plausible link columns. Revisit if a real footer frame
appears in a later phase/section.

## Checkout state, payment simulation, and dropped sections

- **Checkout state** (selected tickets, buyer details, payment method) lives
  in a React context scoped to `/events/[id]/checkout/*`, persisted to
  `sessionStorage` per event so a reload or direct link mid-flow doesn't
  silently drop the cart. It does not survive closing the tab, and there's
  no server-side cart — matches "mock the backend" for now.
- **`FakePaymentProvider`** resolves deterministically rather than randomly:
  a reference ending in `-fail` (append `?simulate=fail` to a `/pay/*` URL)
  always fails, everything else succeeds after a short simulated delay.
  This makes the failure/retry states reachable on demand instead of only
  by chance — useful for review and for future tests.
- The bank-transfer "confirm" flow is a single async function triggered by
  the button click, not a `useEffect` reacting to the status it itself
  updates — an earlier version used the latter and had a real bug: the
  effect's own `setStatus` call changed its dependency array, so React
  tore down and re-ran the effect mid-flight, and the stale closure's
  `cancelled` flag silently swallowed the final success/failure update.
  Caught via an actual browser run of the flow, not just the build.
- Select Ticket / Checkout / Payment Review / Receipt: built from the one
  screenshot captured before the Figma rate limit hit, plus this app's own
  emerging conventions (see next entry).

## The data-access layer runs as Server Actions, not client-side JS

Every function in `src/lib/api/*.ts` (events, talents, requests,
notifications, wallet) is called from Client Components as a plain async
function — `fetchX(...).then(setState)` in a `useEffect`, `await mutateX(...)`
in a click handler. Without a server boundary, none of that code is special:
Next.js bundles it straight into client JS, so the "mock database" arrays in
`src/lib/mock/*.ts` would live per-browser-tab, in memory, reset on every
hard navigation or reload — not because the mock is intentionally
ephemeral, but as an accident of how the calls were wired.

Caught concretely while testing Phase 7: verifying a talent
(`updateTalentDirectoryProfile`) appeared to work on-screen, but the badge
was gone the moment `/talent/[id]` was loaded via a fresh navigation rather
than an in-app link. The same class of bug affected every mutation added
since Phase 5 — submitted requests, created events, withdrawals, PINs —
they only ever "stuck" for the lifetime of one continuous client-side
session, not across a real page load.

**Fix:** added `"use server"` to the top of each file in `src/lib/api/`,
turning every export into a React Server Function. The call sites did not
change — that's the entire point of Server Actions — but now the mock
arrays live in the Node process the dev/prod server runs in, so state
survives navigation and reload the way a real backend's would (still reset
on server restart, and still in-memory only, which is the honest limit of
"mock the backend" without a database). `src/lib/payments/*`,
`src/lib/pricing.ts`, and `src/lib/checkout/CheckoutContext.tsx` were left
alone: checkout state is deliberately a per-tab, per-order session (already
persisted to `sessionStorage` on purpose), not shared backend state, so it
doesn't belong in this layer.

## Demo account's id now matches its talent-directory entry

The seed account (`DEMO_USER`) originally had its own id (`user-me`) while
borrowing a talent profile's *content* from the mock directory — so a
request a fan sent to that talent (found via `/talent/talent-2`, id
`talent-2`) would never show up in the signed-in demo account's own
inbox (`fetchRequestsByTalentId(user.id)` with `user.id === "user-me"`).
Caught while wiring up Phase 6's request inbox. Fixed by making
`DEMO_USER` spread `mockTalentUsers[1]` (Amara Divine) directly rather than
copying fields — same id, so requests, notifications, and events all
resolve to the one signed-in account instead of two disconnected records.

## Phase 8 ("Other Pages") built from metadata + one thumbnail, not full design context

Figma access came back mid-session (rate limit reset) and stayed up for
exactly two calls: one overview `get_screenshot` and one `get_metadata` on
section `3979:34387`, which is literally named "Other Pages" and contains
five real screens — Profile, Settings, a change-password flow, a
change-email flow, and Help Center - Categories. The very next
`get_design_context` call hit the limit again.

That's meaningfully more than Phases 3–7 had (exact frame names, every
title's copy verbatim, precise dimensions, a low-res layout thumbnail),
so this wasn't the same "genuinely unknown, must inspect first" situation
noted earlier when the section was still unopened. Built from that
information plus the established design system, the same posture as
Phases 3–7, and logged the gap in docs/open-questions.md rather than
presenting it as pixel-verified. Password/email change share one component
(`SecurityChangeFlow`) since the "Make Changes" gate frame is duplicated
verbatim for both flows in the file — strong evidence they're the same
shape, not just an assumption. Generalized the wallet's 4-digit PIN input
into a reusable `CodeInput` (moved from `components/wallet/` to
`components/ui/`) to drive both the withdrawal PIN and these flows' 6-digit
verification codes.

## Phase 5 request flow — one page per type, price fixed vs. negotiable

All four request types (personalised video, guest speaker, special
appearance, event invitation) share one dynamic route
(`/talent/[id]/request/[type]`) and form component, configured per type,
rather than four near-duplicate pages — no Figma reference existed to
justify keeping them separate. Video requests use the talent's fixed
`ratePerVideo` (a shoutout is a flat-rate product); the other three let the
fan propose an amount seeded from `ratePerAppearance`, since booking
someone's time for an event is inherently negotiable. Guest speaker and
event invitation are secondary CTAs on the talent profile (video and
special appearance get the primary buttons) — an ordering call, not
something read off a frame.

## Figma MCP hit its Starter-plan rate limit partway through Phase 3

After Phase 2, the Figma MCP connection started returning "You've reached
the Figma MCP tool call limit on the Starter plan" for every call —
`get_design_context`, `get_screenshot`, and `get_metadata` alike. One
screenshot of the Select Ticket screen (`6007:41494`) was captured before
the limit hit; nothing else in Phase 3 onward could be pixel-verified
against Figma at build time.

**Decision (user-approved):** keep building rather than stall. The
ticketing/checkout flow (Phase 3) and everything after it is built from
that one reference screenshot, the design tokens and primitives already
extracted from real frames in Phases 1–2, and ordinary product/UX judgment
for anything not directly observed — not from guessed Figma specifics.
Flagged per screen in `docs/open-questions.md` rather than presented as
pixel-matched. Re-verify against the real frames once the Figma plan/quota
allows more MCP calls.

## "Owner / Editor / Viewer" glass badges are Figma UI, not product content

Both the Event Details Page (`6007:40492`) and the Search page (`6007:40807`)
contain small rotated glass-morphism badges reading "Owner", "Editor", and
"Viewer" floating over the hero banner. These are Figma's own multiplayer
cursor/presence indicators, captured accidentally in the export — not part
of the actual product design. Excluded from the built pages.

## Event Details Page: "Nearby" and photo gallery omitted

The canonical Event Details Page (`6007:40492`) includes a "Nearby"
section (attractions/shopping/accommodation with ratings and drive times,
generic map-app content unrelated to Fannero's actual data model) and a
"Previous Events" photo gallery strip. Both were left out of
`src/app/events/[id]/page.tsx` to focus effort on the ~7 remaining phases —
noted here rather than silently dropped. The rest of the page (info card,
ticket widget, about/what-to-expect, organizer card with follow, contact
organizer form, more-events grid) was built to spec.

## No dedicated "Talent Details" frame found

The brief lists "talent details" as a Phase 2 deliverable, but no frame
named anything like "Talent Details" or "Profile" turned up in section
`6007:*` (checked via metadata grep for "talent"/"profile", zero matches).
Built a reasonable talent profile page instead — see
`docs/open-questions.md`.

## "How It Works" section

Figma frame (under `6007:41251`) is an unbuilt grey placeholder rectangle
row with no content, as the brief warned. Built a reasonable 3-step
explainer (`HowItWorks.tsx`) rather than stalling.

## Migrated from in-memory mock data to Postgres (Drizzle ORM)

Beyond the brief's original "mock the backend" default: `src/lib/mock/*.ts`
is gone, replaced by a real schema (`src/db/schema.ts`) and Drizzle-backed
Server Actions (`src/lib/api/*.ts`, `src/lib/auth/AuthContext.tsx` now
calls `src/lib/api/auth.ts` instead of constructing users locally). A few
decisions worth flagging:

- **Real ids, not fake client-generated ones.** The mock store used strings
  like `talent-1` and `user-${Date.now()}`; Postgres foreign keys need real
  row ids that exist before anything references them, so every id is now a
  DB-generated UUID. `signUp`/`signIn` are Server Actions that insert (or
  look up) the row and hand back its real id.
- **`wallet_balances` is a new table**, not in the original mental model —
  the mock kept a `Record<talentId, WalletSummary>` mutated directly on
  withdrawal. There was no way to derive `pendingBalance` from transaction
  history (nothing in the app currently moves money into "pending"), so it
  stays a directly-written column, mirroring the mock's behavior exactly
  rather than inventing a payout-pending pipeline that doesn't exist yet.
- **Event list ordering changed slightly.** The mock array was a fixed
  seed list read in insertion order, with newly created events `unshift`ed
  to the front. The DB version orders by `created_at` ascending (seed
  order is preserved) but a newly created event now lands at the end of
  the list rather than jumping to the top — a deliberate simplification
  rather than reproducing "recently added floats to top" as real product
  behavior.
- **Ticket orders are unchanged in scope.** `ticket_orders` exists in the
  schema (mirroring `TicketOrder` in `src/lib/types`) but nothing writes to
  it yet — the checkout flow (`src/lib/checkout/CheckoutContext.tsx`) never
  persisted an order server-side even in the mock version, so this
  migration didn't add that write path either. Still open, not silently
  dropped.
- **`scripts/seed.ts`** reproduces the old mock data (4 talents, 4 events,
  1 sample request, notifications, wallet history) against a fresh
  database via `npm run db:seed`, so a new environment isn't empty. It
  no-ops if `users` already has rows, so it's safe to run more than once.

## Deployments migrate and seed themselves

`npm run build` now runs `scripts/migrate.ts` (applies `drizzle/*.sql`) and
`scripts/seed.ts` before `next build`, so a deployment carries its own
schema instead of depending on someone having run SQL by hand against the
right database. This came out of a long deployment session where the app
kept failing with `relation "users" does not exist` / `relation "events"
does not exist`: the schema had been applied through a database console,
but not always to the same database the deployment actually connected to
(Vercel's Neon integration can create a separate database branch per
deployment). Making the build own its schema removes that whole class of
failure — Drizzle records applied migrations in
`drizzle.__drizzle_migrations`, so repeat deploys are no-ops.

Seeding on build is deliberately demo scaffolding, not a data pipeline:
`scripts/seed.ts` bails the moment it finds any existing user, so it only
ever fills a genuinely empty database. Drop it from the `build` script once
this app has real users.

## Home page renders per request, not at build time

`src/app/page.tsx` was being statically prerendered, which baked the event
and talent listings into the build output — a talent creating an event
would not have appeared on the home page until the next deploy. It is now
`force-dynamic`. This also means `next build` no longer reads catalog data,
so a build can't fail on database content.

## Ticket purchases are recorded (ticket_orders reworked)

Checkout previously ran end-to-end and showed a receipt without writing
anything to the database — `ticket_orders` existed but nothing used it.
Purchases are now persisted, which required reshaping the table:

- **Orders and line items are separate.** The old table carried a single
  `tier_id` and `quantity`, but a cart can hold several tiers and the
  service fee is charged per order, not per tier (see `src/lib/pricing.ts`).
  So `ticket_orders` holds the order-level totals and `ticket_order_items`
  holds one row per tier, snapshotting tier name and unit price so a later
  price edit doesn't rewrite what someone already paid.
- **`buyer_id` is nullable.** Checkout does not require an account, so the
  buyer's name/email/phone live on the order and link to a user only when
  one is signed in. Guest checkout does not silently create accounts.
- **Recording is idempotent on `reference`.** A retried or double-submitted
  payment returns the order already recorded rather than selling the
  tickets twice.
- **Purchases move inventory.** `ticket_tiers.quantity_sold` is incremented
  in the same transaction, so the availability the ticket picker shows
  reflects real sales.

Both payment paths call one `recordOrder` on the checkout context rather
than each writing their own order, and they record *before* showing a
confirmed state, so a receipt never claims an order that isn't stored.

Still open: nothing prevents overselling under concurrency — two
simultaneous buyers can both pass the availability check. That needs a
real inventory reservation, which is out of scope here.

## Fans get their own requests list, with real confirmation

Fans could submit requests but never see them again — the only view was
the talent's inbox. `/requests` now lists a fan's own requests with status,
talent, amount and occasion, and closes the last gap in the request state
machine: a `delivered` request shows the delivery and a "Confirm you
received this" action firing `FAN_CONFIRMS`, which is what releases
payment. The talent page's "Simulate fan confirmation" stand-in is
removed — that transition now only happens where it should, on the fan's
side.

Confirmation re-reads the list from the server rather than patching status
locally, so what's shown is whatever the state machine actually decided.

## Completing a request pays the talent

The fan's confirmation screen says "Confirming releases payment", and the
talent's page said payment had been added to their wallet — but nothing
credited it. Completing a request now inserts a `wallet_transactions`
credit (linked back through the `related_request_id` column that already
existed for this) and adds the amount to `wallet_balances`, in the same
transaction as the status change. Guarded on the status having actually
changed, so re-confirming a completed request can't pay twice.
