# Planet tile art (detail / inspector)

Drop one image per planet here for every planet hex (board, gallery specimen, and inspector detail).
When a file is missing, the tile falls back to the procedural resource-tinted sphere.

**Nexus art** lives in `../nexus/` (not this folder). See `../nexus/README.md`.

## File names

Use a **slug** derived from the planet name (lowercase, non-alphanumeric → hyphen):

| Planet | Filename |
|--------|----------|
| Aethel-9 | `aethel-9.webp` |
| Vulkan's Forge | `vulkans-forge.webp` |
| Gorgon Prime | `gorgon-prime.webp` |
| Caelum Mining Hub | `caelum-mining-hub.webp` |
| The Iron Ring | `the-iron-ring.webp` |
| Zephyrus Minor | `zephyrus-minor.webp` |
| Kraken's Breath | `krakens-breath.webp` |
| Osiris-4 | `osiris-4.webp` |
| Boreas Station | `boreas-station.webp` |
| Neptunia Prime | `neptunia-prime.webp` |
| Nova Forge | `nova-forge.webp` |
| Stallos Prime | `stallos-prime.webp` |
| Ares Citadel | `ares-citadel.webp` |
| Steelhold Alpha | `steelhold-alpha.webp` |
| Vanguard Station | `vanguard-station.webp` |
| Solaria Prime | `solaria-prime.webp` |
| Xanadu Core | `xanadu-core.webp` |
| Apex Laboratories | `apex-laboratories.webp` |
| Elysium Nexus | `elysium-nexus.webp` |
| Chronos Research Outpost | `chronos-research-outpost.webp` |

Formats: `.webp`, `.png`, or `.jpg`. Prefer **webp** for size.

Slugs come from `planetSlug()` in `planetTileArt.ts` (same rules as the table). Use **lowercase** filenames only.

If an export has a working title that is not the printed planet name, rename the file to the slug for the **fixture name** in `fixtures/tiles.ts`, not the image label.

No code changes are needed after adding files; `planetDetailArt(name)` picks them up at build time.
