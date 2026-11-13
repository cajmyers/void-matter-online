# Nexus tile art

One image per nexus variant. Used on board and detail hexes when the file exists; otherwise the procedural rings / seat halo show.

## Filenames

| Tile | Filename |
|------|----------|
| Central Nexus | `central-nexus.webp` |
| Outer Rim Nexus, seat 1 | `outer-rim-nexus-1.webp` |
| Outer Rim Nexus, seat 2 | `outer-rim-nexus-2.webp` |
| Outer Rim Nexus, seat 3 | `outer-rim-nexus-3.webp` |
| Outer Rim Nexus, seat 4 | `outer-rim-nexus-4.webp` |

Formats: `.webp`, `.png`, or `.jpg`. Prefer **webp**. Use **lowercase** slugs only.

`nexusDetailArt()` in `nexusTileArt.ts` picks these up at build time; no other code changes when you add a file.
