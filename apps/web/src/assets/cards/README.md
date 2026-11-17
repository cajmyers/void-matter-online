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

## Enemy cards

- `enemy/fronts/iron-texture.webp`, `prism-texture.webp`, `hive-texture.webp` — face stock per faction (`enemyCardFaceTexture` in `assetCardArt.ts`).
- `enemy/back/enemy.webp` — enemy deck pile back (`enemyDeckBackArt`, `DeckBack` variant `enemy`).
- Level / reward-stack icons on the art cost rail (same slot as sector purchase cost): `assets/icons/level1.webp`, `level2.webp`, `level3.webp` (`enemyLevelRewardArt.ts`, `DCK-3`).
- `enemy/fronts/art/<catalogueId>.webp` — enemy hero art; basename is `id` from `enemies/*.json` (kebab-case), e.g. `iron-skiff.webp`. Wired by `enemyCardHeroArt` in `assetCardArt.ts`.
- Catalogue: `packages/content/data/enemies/{iron-syndicate,prism-ascendancy,the-hive}.json` (9 types).

## Mission deck

- `mission/fronts/mission-texture.webp` — face stock (`missionCardFaceTexture` in `assetCardArt.ts`).
- `mission/fronts/art/<catalogueId>.webp` — mission hero art; basename is `id` from `missions.json` (kebab-case), e.g. `syndicate-bust.webp`. Wired by `missionCardHeroArt` in `assetCardArt.ts`.
- `mission/back/mission.webp` — mission deck pile back (`missionDeckBackArt`, `DeckBack` variant `mission`).

## Player ship deck

- `ship/fronts/<catalogueId>-texture.webp` — per-hull face stock (e.g. `nomad-corvette-texture.webp`; `shipCardFaceTexture` in `assetCardArt.ts`).
- `ship/fronts/art/<catalogueId>.webp` — ship hero art; basename is `id` from `player-ships.json` (kebab-case), e.g. `nomad-corvette.webp`. Wired by `shipCardHeroArt`.
- `ship/back/ship.webp` — ship build / catalogue deck pile back (`shipDeckBackArt`, `DeckBack` variant `ship`).
- Catalogue: `packages/content/data/ships/player-ships.json`.
