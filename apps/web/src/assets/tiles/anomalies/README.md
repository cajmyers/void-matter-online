# Anomaly tile art

One image per Anomaly tile (board, gallery specimen and inspector detail).
When a file is missing, the tile falls back to the procedural nebula and star.
The discovery-bonus pill and warp gates are always drawn on top of the art.

**Planet art** lives in `../planets/` and **Nexus art** in `../nexus/`.

## File names

Use a **slug** derived from the tile name in `fixtures/tiles.ts` (lowercase, apostrophes dropped, other non-alphanumerics become hyphens). All **22** anomaly tiles, including Overclocking Relay (`overclocking-relay.webp`).

| Tile | Filename |
|------|----------|
| 1. The Scrap Reclamation Yard | `the-scrap-reclamation-yard.webp` |
| 2. Black Market Trading Depot | `black-market-trading-depot.webp` |
| 3. EMP Array Substation | `emp-array-substation.webp` |
| 5. Graviton Warp Conduit | `graviton-warp-conduit.webp` |
| 6. Automated Nanite Station | `automated-nanite-station.webp` |
| 7. Solar Flare Sanctuary | `solar-flare-sanctuary.webp` |
| 8. Deep-Space Tactical Sensor Array | `deep-space-tactical-sensor-array.webp` |
| 9. Encrypted Archives Station | `encrypted-archives-station.webp` |
| 10. System Defence Grid | `system-defence-grid.webp` |
| 11. Sensor Buoy Network | `sensor-buoy-network.webp` |
| 12. Volatile Helium Nebula | `volatile-helium-nebula.webp` |
| 13. Dense Asteroid Field | `dense-asteroid-field.webp` |
| 14. Fleet Command Substation | `fleet-command-substation.webp` |
| 15. Free-Trade Logistics Hub | `free-trade-logistics-hub.webp` |
| 16. Smuggler's Foundry | `smugglers-foundry.webp` |
| 17. Intelligence Bureau | `intelligence-bureau.webp` |
| 18. Subspace Disruption Array | `subspace-disruption-array.webp` |
| 19. System Regulator Node | `system-regulator-node.webp` |
| 20. Personnel Transporter | `personnel-transporter.webp` |
| 21. Officer Training Command | `officer-training-command.webp` |
| 22. Commerce Guild Outpost | `commerce-guild-outpost.webp` |

Formats: `.webp`, `.png`, or `.jpg`. Prefer **webp** for size. Use **lowercase** filenames only.

Keep the top of the image fairly calm: the discovery-bonus pill sits near the top edge of the hex.

Slugs come from `anomalySlug()` in `anomalyTileArt.ts`. No code changes are needed after adding files; `anomalyDetailArt(name)` picks them up at build time.
