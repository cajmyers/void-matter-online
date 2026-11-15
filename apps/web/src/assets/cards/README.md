# Sector asset card art

Hero bitmaps only (no printed frame). Paths:

`{s1|s2|s3|s4|common}/fronts/art/<slug>.webp`

Slug = `cardIllustrationSlug(card title)` in `assetCardArt.ts`. Match `illustrationSlug` in JSON when you add catalogue rows.

| Folder | Market (`MAP-4`, `content-data.md` §1) |
|--------|----------------------------------------|
| `s1/` | Weapons / Offensive (PC) |
| `s2/` | Propulsion / Utility (H3) |
| `s3/` | Cargo / Life Support (QP) |
| `s4/` | Hull / Defensive (TC) |
| `common/` | Always-available technologies (Hull Plating, Laser Cannon, …) |

Deck backs and reference scans stay under `s1/` until other sector backs exist.
