import { anomalyDetailArt } from "../components/hex/anomalyTileArt";
import type { HexTileBodyProps } from "../components/hex/HexTile";
import { planetDetailArt } from "../components/hex/planetTileArt";
import { anomalyFixtures, planetFixtures, planetGatePatterns } from "../fixtures/tiles";
import type { MapHexView } from "./mapView";
import { centralNexusPassSupply } from "./centralNexusPassSupply";

function planet(name: string, extra: { lockedSupply?: number; lockedDemand?: number; selected?: boolean } = {}) {
  const row = planetFixtures.find((candidate) => candidate.name === name);
  if (!row) throw new Error(`Unknown planet: ${name}`);
  const detailArt = planetDetailArt(name);
  return {
    kind: "planet" as const,
    title: name,
    supply: row.supply,
    demand: row.demand,
    ...(detailArt ? { detailArt } : {}),
    ...extra,
  };
}

function anomaly(name: string) {
  const row = anomalyFixtures.find((candidate) => candidate.name === name);
  if (!row) throw new Error(`Unknown anomaly: ${name}`);
  const detailArt = anomalyDetailArt(name);
  return {
    kind: "anomaly" as const,
    title: name,
    bonus: row.bonus,
    anomalyAbility: row.ability,
    ...(detailArt ? { detailArt } : {}),
  };
}

/** Map slice → `HexTileBody` props (no layout coordinates). */
export function mapTileViewToBody(tile: MapHexView["tile"]): Omit<HexTileBodyProps, "x" | "y" | "size"> {
  switch (tile.kind) {
    case "faceDown":
      return { kind: "faceDown", title: "Face-down tile" };
    case "nexusCentral":
      return { kind: "nexusCentral", title: "Central Nexus", passSupply: centralNexusPassSupply };
    case "nexusRim":
      return { kind: "nexusRim", title: "Outer Rim Nexus", seat: tile.seat };
    case "planet":
      return planet(tile.planetName, {
        ...(tile.lockedSupply !== undefined ? { lockedSupply: tile.lockedSupply } : {}),
        ...(tile.lockedDemand !== undefined ? { lockedDemand: tile.lockedDemand } : {}),
        ...(tile.selected ? { selected: true } : {}),
      });
    case "anomaly":
      return anomaly(tile.anomalyName);
    default: {
      const _exhaustive: never = tile;
      return _exhaustive;
    }
  }
}

export function planetGatesForName(planetName: string): readonly import("../components/hex/hexGeometry").EdgeName[] {
  const row = planetFixtures.find((candidate) => candidate.name === planetName);
  if (!row) throw new Error(`Unknown planet: ${planetName}`);
  return planetGatePatterns[row.pattern];
}

export function anomalyGatesForName(anomalyName: string): readonly import("../components/hex/hexGeometry").EdgeName[] {
  const row = anomalyFixtures.find((candidate) => candidate.name === anomalyName);
  if (!row) throw new Error(`Unknown anomaly: ${anomalyName}`);
  return row.gates;
}