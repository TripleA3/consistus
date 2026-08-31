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
