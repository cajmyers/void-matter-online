# Sector asset card art

Hero bitmaps only (no printed frame). Paths:

- `fronts/art/<slug>.webp` — illustration in the art window
- `fronts/<deck>-texture.webp` — full-card face stock under the layout (`sectorCardFaceTexture` in `assetCardArt.ts`)
- `back/<deck>.webp` — sector market **deck pile** back (`sectorDeckBackArt` in `sectorDeckBackArt.ts`, `DeckBack` variant `sector`)

Slug = `cardIllustrationSlug(card title)` in `assetCardArt.ts`. Match `illustrationSlug` in JSON when you add catalogue rows.

| Folder | Market (`MAP-4`, `content-data.md` §1) |
|--------|----------------------------------------|
| `s1/` | Weapons / Offensive (PC) |
| `s2/` | Propulsion / Utility (H3) |
| `s3/` | Cargo / Life Support (QP) |
| `s4/` | Hull / Defensive (TC) |

All four decks ship face textures and owner deck backs (`s1/back/s1.webp` … `s4/back/s4.webp`).

## Crew cards

- `crew/fronts/crew-texture.webp` — face stock for Ensign and Commander cards (`crewCardFaceTexture` in `assetCardArt.ts`).
- `crew/fronts/art/<catalogueId>.webp` — Crew portraits; basename is the catalogue `id` (kebab-case), not card title or character name — e.g. `xeno-scientist.webp`, not `xeno biologist.webp`. Wired by `crewCardPortraitArt` in `assetCardArt.ts`.
- `crew/back/crew.webp` — crew market deck pile back (`crewDeckBackArt`, `DeckBack` variant `crew`).

## Enemy deck

- `enemy/back/enemy.webp` — enemy deck pile back (`enemyDeckBackArt`, `DeckBack` variant `enemy`).

## Mission deck

- `mission/fronts/mission-texture.webp` — face stock (`missionCardFaceTexture` in `assetCardArt.ts`).
- `mission/fronts/art/<catalogueId>.webp` — mission hero art; basename is `id` from `missions.json` (kebab-case), e.g. `syndicate-bust.webp`. Wired by `missionCardHeroArt` in `assetCardArt.ts`.
- `mission/back/mission.webp` — mission deck pile back (`missionDeckBackArt`, `DeckBack` variant `mission`).

## Player ship deck

- `ship/back/ship.webp` — ship build / catalogue deck pile back (`shipDeckBackArt`, `DeckBack` variant `ship`).
