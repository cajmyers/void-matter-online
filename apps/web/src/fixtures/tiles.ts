// Re-export catalogue tiles from `@void-matter/content` (JSON on disk).
// Gallery and style pages keep these names for now; Stage 2 moves callers to the package directly.

export type {
  AnomalyAbility,
  AnomalyTile as AnomalyFixture,
  EdgeName,
  PlanetGatePattern,
  PlanetGroup,
  PlanetTile as PlanetFixture,
  ResourceAmount as PlanetAmount,
  ResourceId,
} from "@void-matter/content";

export {
  anomalies as anomalyFixtures,
  passiveAnomalyNumbers,
  planetGatePatterns,
  planets as planetFixtures,
} from "@void-matter/content";
