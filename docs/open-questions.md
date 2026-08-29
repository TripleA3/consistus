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
