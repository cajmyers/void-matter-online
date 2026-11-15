# `@void-matter/content`

Authoritative **game catalogue** as JSON, validated with Zod at load time. The engine, gallery, and sim import from here — not from scattered fixtures.

## Editing

| What | Where |
|------|--------|
| Anomaly tiles | `data/tiles/anomalies.json` |
| Planets | `data/tiles/planets.json` |
| S1–S4 asset cards | `data/cards/s1-assets.json` … `s4-assets.json` |
| Iron Syndicate enemies | `data/enemies/iron-syndicate.json` |
| Player ships | `data/ships/player-ships.json` |
| Ensign crew (4 plain types, 3 resources each, `CRE-2`) | `data/crew/ensigns.json` |
| Commander crew (16 types, 5 resources each, `CRE-2`) | `data/crew/commanders.json` |
| Full game crew deck (`DCK-5`) | `data/decks/crew-deck.json` |
| First playable slice | `data/slices/first-playable.json` |

Every row has a stable **`id`** (future Firestore document id). After edits:

```bash
pnpm test    # from repo root (runs content + web tests)
```

Regenerate tile JSON from the maintainer table (optional):

```bash
node packages/content/scripts/build-tile-json.mjs
```

## Firestore later

`data/manifest.json` lists collections. A future sync script can:

1. Read the same JSON files (or a build artefact).
2. Upsert one document per row: `collection/{id}` with the row body + `schemaVersion`.
3. Keep **git** as the editor-friendly source until you want live CMS-style edits.

Game **saves** stay separate (`users/{uid}/games/{gameId}`); this package is only the **catalogue**.

## Status

Tiles, slice metadata, S1–S4 assets, full-game sector and crew deck composition (`DCK-5`), enemies, Corvette, ensigns, and the Commander catalogue are loaded. Mission definitions will land as JSON in later commits (`content-data.md`).
