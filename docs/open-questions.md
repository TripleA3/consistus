# Open questions

## Real icon and photo assets are missing (blocking)

`www.figma.com` is blocked by this environment's network egress policy, so
the exported SVG icons and photography referenced by the Figma file could
not be downloaded and committed, per the brief's own instructions. Every
icon in `src/components/ui/Icon.tsx` and every image in the app is currently
a hand-drawn stand-in or a gradient placeholder (`ImagePlaceholder.tsx`).

**Needed:** either (a) run this build from an environment that can reach
`figma.com`, so `download_assets` can pull the real SVGs/photos, or (b)
manually export the assets from Figma and drop them into `public/icons` and
`public/images` with the same filenames the components already expect, then
swap the `<Icon>` paths / `<ImagePlaceholder>` usages for real `<img>` tags.
Affects every screen, not just Home — flagging once here rather than on
every phase.

Specific assets still needed for Home (node `6007:41206`):
- Fannero logomark (used next to the "fannero" wordmark in the header)
- Hero banner decorative vectors (stars/blobs, `imgVector1-4`,
  `imgFrame2147223444-47`)
- Celebrity photos (4), event cover photos (4), video-request photos (4)

## "How It Works" content

Figma shows grey placeholder rectangles only (see `docs/decisions.md`).
Built a reasonable 3-step explainer. Confirm the real copy/step count with
design before this ships.

## Footer

No canonical Fannero footer frame was found in the sections reviewed for
Phase 1. Built to token with plausible columns (see `docs/decisions.md`).
Confirm against a real footer frame if one exists in a later section.

## Withdrawal PIN is stored and checked in plaintext — resolved

Was: the mock wallet store kept PINs in a plain in-memory map and compared
them with `===`. Fixed in the Postgres migration — `wallet_pins.pin_hash`
now stores a salted scrypt hash (`src/lib/api/wallet.ts`), and the raw PIN
never round-trips beyond the request that sets or checks it.

## "Simulate fan confirmation" is a stand-in for real fan-side confirmation

The request detail page's `delivered` state has a "Simulate fan
confirmation" button that moves the request straight to `completed`. There
is no real fan-facing "confirm you received this" screen yet — building
one wasn't in the Phase 5 scope (fan-side submission, amount,
confirmation-of-request-sent), and Phase 6 needed the full state machine
reachable to build accept/decline/terms/deliver against. Add a real
confirmation UI on the fan's side (e.g. under a "my requests" page) when
that's in scope, and remove this button.

## Sign-up doesn't add the new talent to the mock directory

`AuthContext.signUp` mints a new `User` client-side and stores it in
`localStorage`, but `src/lib/mock/talents.ts` is a static array — a
newly-signed-up talent isn't added to it. Their own profile link
(`/talent/[id]`) and dashboard work (both read straight from the auth
context), but they won't show up in Home's "Top Celebrities" or the
search/browse listings, and a fresh browser profile won't remember them
either. Fine for a stubbed backend; wire it up once there's a real one.

## Ancillary marketing links are placeholders

Header/Footer link to a few pages outside the brief's 8-phase build order —
`/community`, `/about`, `/terms`, `/privacy`, `/tickets` (a fan's own
ticket list), `/favorites`. These aren't built and will 404 until scoped.

## Phase 8 identified but not pixel-verified

Once Figma access came back, `get_metadata` + one overview `get_screenshot`
identified section `3979:34387` before the rate limit hit again: Profile,
Settings, two parallel 4-step security flows (change password / change
email — each: confirm current password → new value → verify code →
confirmation), and Help Center - Categories. That's real information, not
a guess — frame names, exact copy for every title, and a low-res thumbnail
of the layout. But no `get_design_context` call succeeded, so exact
spacing/type/colors for these five screens are built to the established
Fannero design system, not pixel-matched. Re-verify against the real
frames (Desktop 110, 111, 112/114/117-119, 120) once quota allows.

Also unverified: I inferred both security flows share one shape from the
"Make Changes" gate screen appearing twice with identical text, and from
Change Password (Desktop 119) — I did not fetch Change Email's own frame
(Desktop 114), Verify New Email (115), or the two confirmation screens
(116, 118) individually. Reasonable given the gate screen's duplicate
title all but confirms one shared flow, but flagged rather than presented
as verified.

## Phase 3 onward not pixel-verified against Figma (rate limit)

The Figma MCP connection hit its Starter-plan tool-call limit after Phase 2
(see `docs/decisions.md`). Only the Select Ticket screen (`6007:41494`) was
seen, as a screenshot. Checkout, Payment Review, Bank Transfer (all states),
Credit Card, and Receipt are built to the established design system and
sound product judgment, not verified against their actual Figma frames.
**Re-check every screen from Phase 3 onward against the real file once the
Figma plan/quota allows it** — treat this whole section as provisional
until then.

## Talent Details page has no source frame

No frame named "Talent Details" or similar was found in section `6007:*`
(the canonical home/event/checkout section). Built a reasonable profile
page (`src/app/talent/[id]/page.tsx`) instead, reusing the info-card/CTA
patterns from the Event Details page. Confirm against a real frame if one
exists elsewhere in the file.

## Search page filters beyond category are UI-only

The "Filter By" sidebar on `/events` (from node `6007:40807`) has Date,
Price, Location, and Currency accordions. Only Categories is wired to real
filtering — the mock data has no location/currency facets yet. The other
sections expand but show "Coming soon." Wire them up once the data model
supports them.

## Mobile header/nav

No 390px frame for the header/subpage-nav was reviewed in Phase 1. Adapted
into a bottom tab bar. Confirm against a real mobile frame if one exists.
