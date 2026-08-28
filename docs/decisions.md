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

## "How It Works" section

Figma frame (under `6007:41251`) is an unbuilt grey placeholder rectangle
row with no content, as the brief warned. Built a reasonable 3-step
explainer (`HowItWorks.tsx`) rather than stalling.
