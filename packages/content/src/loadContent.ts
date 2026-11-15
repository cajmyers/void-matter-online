import manifestJson from "../data/manifest.json";
import anomaliesJson from "../data/tiles/anomalies.json";
import planetsJson from "../data/tiles/planets.json";
import s1AssetsJson from "../data/cards/s1-assets.json";
import s2AssetsJson from "../data/cards/s2-assets.json";
import s3AssetsJson from "../data/cards/s3-assets.json";
import s4AssetsJson from "../data/cards/s4-assets.json";
import ironSyndicateJson from "../data/enemies/iron-syndicate.json";
import playerShipsJson from "../data/ships/player-ships.json";
import ensignsJson from "../data/crew/ensigns.json";
import sectorMarketsJson from "../data/decks/sector-markets.json";
import firstPlayableJson from "../data/slices/first-playable.json";
import { z } from "zod";
import { contentManifestSchema } from "./schemas/manifest";
import {
  assetCardSchema,
  s1AssetCardSchema,
  type AssetCard,
  type S1AssetCard,
} from "./schemas/cards";
import { ensignCrewSchema, type EnsignCrew } from "./schemas/crew";
import { enemyShipSchema, type EnemyShip } from "./schemas/enemies";
import { fullGameSectorMarketsSchema, type FullGameSectorMarkets } from "./schemas/decks";
import { firstPlayableSliceSchema, type FirstPlayableSlice } from "./schemas/slices";
import { playerShipSchema, type PlayerShip } from "./schemas/ships";
import { anomalyTileSchema, type AnomalyTile } from "./schemas/tiles";
import { planetTileSchema, type PlanetTile } from "./schemas/tiles";

function parseArray<T>(schema: z.ZodType<T>, rows: unknown, label: string): readonly T[] {
  if (!Array.isArray(rows)) {
    throw new Error(`${label}: expected JSON array`);
  }
  return rows.map((row, index) => {
    try {
      return schema.parse(row);
    } catch (error) {
      throw new Error(`${label}[${index}]: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

function assertUniqueIds<T extends { id: string }>(rows: readonly T[], label: string): void {
  const seen = new Set<string>();
  for (const row of rows) {
    if (seen.has(row.id)) {
      throw new Error(`${label}: duplicate id ${row.id}`);
    }
    seen.add(row.id);
  }
}

export const contentManifest = contentManifestSchema.parse(manifestJson);

export const anomalies: readonly AnomalyTile[] = parseArray(anomalyTileSchema, anomaliesJson, "anomalies");
export const planets: readonly PlanetTile[] = parseArray(planetTileSchema, planetsJson, "planets");
export const s1AssetCards: readonly S1AssetCard[] = parseArray(s1AssetCardSchema, s1AssetsJson, "s1-assets");
export const s2AssetCards: readonly AssetCard[] = parseArray(assetCardSchema, s2AssetsJson, "s2-assets");
export const s3AssetCards: readonly AssetCard[] = parseArray(assetCardSchema, s3AssetsJson, "s3-assets");
export const s4AssetCards: readonly AssetCard[] = parseArray(assetCardSchema, s4AssetsJson, "s4-assets");
export const sectorAssetCards: readonly AssetCard[] = [
  ...s1AssetCards,
  ...s2AssetCards,
  ...s3AssetCards,
  ...s4AssetCards,
];
export const ironSyndicateEnemies: readonly EnemyShip[] = parseArray(enemyShipSchema, ironSyndicateJson, "iron-syndicate");
export const playerShips: readonly PlayerShip[] = parseArray(playerShipSchema, playerShipsJson, "player-ships");
export const ensignCrew: readonly EnsignCrew[] = parseArray(ensignCrewSchema, ensignsJson, "ensigns");
export const firstPlayableSlice: FirstPlayableSlice = firstPlayableSliceSchema.parse(firstPlayableJson);
export const fullGameSectorMarkets: FullGameSectorMarkets = fullGameSectorMarketsSchema.parse(sectorMarketsJson);

assertUniqueIds(anomalies, "anomalies");
assertUniqueIds(planets, "planets");
assertUniqueIds(s1AssetCards, "s1-assets");
assertUniqueIds(s2AssetCards, "s2-assets");
assertUniqueIds(s3AssetCards, "s3-assets");
assertUniqueIds(s4AssetCards, "s4-assets");
assertUniqueIds(sectorAssetCards, "sector-asset-cards");
assertUniqueIds(ironSyndicateEnemies, "iron-syndicate");
assertUniqueIds(playerShips, "player-ships");
assertUniqueIds(ensignCrew, "ensigns");

/** Passive-only Anomaly numbers (`MSN-1`). */
export const passiveAnomalyNumbers: ReadonlySet<number> = new Set(
  anomalies.filter((tile) => tile.ability === "passive").map((tile) => tile.number),
);
