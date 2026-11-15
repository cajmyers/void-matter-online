import { anomalyDetailArt } from "../../components/hex/anomalyTileArt";
import { planetDetailArt } from "../../components/hex/planetTileArt";
import { planetGatePatterns, type AnomalyFixture, type PlanetFixture } from "../../fixtures/tiles";
import type { FigureTile } from "./GalleryPage/Figure";

function artProp(url: string | undefined): { detailArt?: string } {
  return url ? { detailArt: url } : {};
}

export function buildPlanetFigure(
  planet: PlanetFixture,
  extra: { lockedSupply?: number; lockedDemand?: number; selected?: boolean } = {},
): FigureTile {
  const detailArt = planetDetailArt(planet.name);
  return {
    body: {
      kind: "planet",
      title: planet.name,
      supply: planet.supply,
      demand: planet.demand,
      ...(detailArt ? { detailArt } : {}),
      ...extra,
    },
    gates: planetGatePatterns[planet.pattern],
  };
}

export function buildAnomalyFigure(tile: AnomalyFixture): FigureTile {
  return {
    body: {
      kind: "anomaly",
      title: tile.name,
      bonus: tile.bonus,
      anomalyAbility: tile.ability,
      ...artProp(anomalyDetailArt(tile.name)),
    },
    gates: tile.gates,
  };
}