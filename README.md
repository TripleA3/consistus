# Fannero

Fan ↔ talent marketplace. Fans discover talent and events, buy tickets, and
commission personalised videos and appearances from celebrities. Talent
create events, accept or decline requests, deliver videos, and withdraw
earnings.

Built screen-by-screen from a Figma design (file `RLCWKlUcOHmlxKuyOxx7cN`).
See `docs/decisions.md` and `docs/open-questions.md` for build notes and
known gaps, including a network limitation that blocked downloading the
real icon/photo assets — placeholders stand in for now.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- No backend yet — every screen reads from typed mock data
  (`src/lib/mock`) behind a data-access layer (`src/lib/api`), so real
  endpoints can drop in later without touching components
- Auth, payments, and media are stubbed behind interfaces
  (`src/lib/auth`, `src/lib/payments`) for the same reason

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint    # eslint
npm run build   # production build + typecheck
npm test        # vitest, business-logic tests
```

## Project structure

```
src/
  app/                 # routes (App Router)
  components/
    ui/                # primitives: Button, Input, Chip, Card, Icon, ...
    layout/             # Header, Footer, AppShell, MobileTabBar
    home/                # Home-screen-specific sections
  lib/
    types/               # domain types
    mock/                # seed data
    api/                 # data-access layer (swap for real endpoints later)
    auth/                # session stub
    payments/            # PaymentProvider interface
docs/
  decisions.md           # calls made while building, and why
  open-questions.md      # known gaps, flagged rather than silently resolved
```
