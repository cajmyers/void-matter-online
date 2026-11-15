# Sector asset card art

Hero bitmaps only (no printed frame). Paths:

- `fronts/art/<slug>.webp` — illustration in the art window
- `fronts/<deck>-texture.webp` — full-card face stock under the layout (`sectorCardFaceTexture` in `assetCardArt.ts`)

Slug = `cardIllustrationSlug(card title)` in `assetCardArt.ts`. Match `illustrationSlug` in JSON when you add catalogue rows.

| Folder | Market (`MAP-4`, `content-data.md` §1) |
|--------|----------------------------------------|
| `s1/` | Weapons / Offensive (PC) |
| `s2/` | Propulsion / Utility (H3) |
| `s3/` | Cargo / Life Support (QP) |
| `s4/` | Hull / Defensive (TC) |

All four decks ship face textures (`s1-texture.webp` … `s4-texture.webp`). Deck backs and reference scans stay under `s1/` until other sector backs exist.

## Crew cards

- `crew/fronts/crew-texture.webp` — face stock for Ensign and Commander cards (`crewCardFaceTexture` in `assetCardArt.ts`).
- `crew/fronts/art/<catalogueId>.webp` — Crew portraits; basename is the catalogue `id` (kebab-case), not card title or character name — e.g. `xeno-scientist.webp`, not `xeno biologist.webp`. Wired by `crewCardPortraitArt` in `assetCardArt.ts`.
