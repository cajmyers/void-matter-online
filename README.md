# Void Matter Online

Personal web game hosted on [Firebase Hosting](https://firebase.google.com/docs/hosting).

- **GCP / Firebase project ID:** `void-matter-online` (personal Google account `cajmyers@gmail.com`)
- **Site:** `apps/web` (Vite, React, TypeScript) builds to `apps/web/dist`, which `firebase.json` serves

## Develop

Once per machine, enable pnpm through corepack (the repo pins pnpm 10 in `package.json`):

```bash
corepack enable
pnpm install
```

```bash
pnpm dev              # http://localhost:5173, includes the /dev/* pages
pnpm test             # vitest
pnpm typecheck
pnpm lint
```

Pages (hash routes): `#/` the table, `#/dev/style` the Holo tactical style reference, `#/dev/gallery`, `#/dev/lab`.
There is one theme (Holo tactical), defined in `apps/web/src/theme/theme.css`.

## Builds

- `pnpm build:preview` includes the `/dev/*` pages, for review on a URL.
- `pnpm build` is the production build and strips them.

## One-time Firebase CLI (personal account)

Work Firebase login (`cmyers@telana.com`) cannot manage this project. Once per machine:

```bash
~/dev/projects/personal/setup-firebase-once.sh
```

## Share a URL for review

Needs the one-time Firebase login above. This builds the preview build and publishes it to a temporary Firebase Hosting preview channel (30 days), printing a URL:

```bash
pnpm deploy:preview
```

## Release deploy

From this directory (under `~/dev/projects/personal/` so gcloud + Firebase use personal credentials):

```bash
pnpm deploy:release   # production build, then firebase deploy --only hosting
```

Live URL after first deploy: `https://void-matter-online.web.app` (and `.firebaseapp.com`).

## Docs

Game rules code does not exist yet (only the look-and-feel stage is under way); `docs/` is the specification. Start with `design-decisions.md` (authoritative rules, with stable ruling IDs; section 15 is the latest).

- `docs/design-decisions.md`: rules and rulings
- `docs/content-data.md`: card lists, enemy decks and the first content slice (proposed)
- `docs/implementation-plan.md`: staged build plan (look and feel first, then engine, economy, combat)
- `docs/technical-proposal.md`: architecture, saves, map and build order
- `docs/tooling-decisions.md`: front-end stack and tooling
- `docs/combat-reference.md`: old simulator notes (stale; read its banner first)
- `docs/analysis/`: analysis scripts (for example `node docs/analysis/gate-graph-sim.js`)
- `docs/Void Matter.pdf`: the old rulebook (seed data only)

## License

Private — all rights reserved unless otherwise noted.
