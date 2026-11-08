// Tile fixtures for the gallery: structural seed data only, from docs/technical-proposal.md
// Appendix B (Anomaly tiles) and Appendix C (planet tiles). Printed orientations; the player
// rotates a tile on reveal (MAP-6). Tile 4 is removed from the game (TIL-1), so it is absent.
// This is look-and-feel data, not the engine's content package (Stage 2 replaces it).

import type { ResourceId } from "../components/game/resources";
import type { EdgeName } from "../components/hex/hexGeometry";

export interface AnomalyFixture {
  /** The number printed in the old rulebook. 4 is missing on purpose (TIL-1). */
  readonly number: number;
  readonly name: string;
  readonly bonus: readonly [ResourceId, ResourceId];
  readonly gates: readonly EdgeName[];
}

export const anomalyFixtures: readonly AnomalyFixture[] = [
  { number: 1, name: "The Scrap Reclamation Yard", bonus: ["tc", "pc"], gates: ["TL", "R", "BL"] },
  { number: 2, name: "Black Market Trading Depot", bonus: ["qp", "h3"], gates: ["TR", "BR", "L"] },
  { number: 3, name: "EMP Array Substation", bonus: ["pc", "qp"], gates: ["TL", "BR", "L"] },
  { number: 5, name: "Graviton Warp Conduit", bonus: ["h3", "qp"], gates: ["TL", "TR", "BR", "BL"] },
  { number: 6, name: "Automated Nanite Station", bonus: ["tc", "qp"], gates: ["R", "BL", "L"] },
  { number: 7, name: "Solar Flare Sanctuary", bonus: ["h3", "pc"], gates: ["TL", "TR", "BR"] },
  { number: 8, name: "Deep-Space Tactical Sensor Array", bonus: ["qp", "tc"], gates: ["TR", "BL", "L"] },
  { number: 9, name: "Encrypted Archives Station", bonus: ["qp", "h3"], gates: ["TL", "R", "BR"] },
  { number: 10, name: "System Defence Grid", bonus: ["tc", "pc"], gates: ["TL", "BR"] },
  { number: 11, name: "Sensor Buoy Network", bonus: ["qp", "pc"], gates: ["TR", "R", "L"] },
  { number: 12, name: "Volatile Helium Nebula", bonus: ["h3", "tc"], gates: ["TL", "BR", "BL"] },
  { number: 13, name: "Dense Asteroid Field", bonus: ["tc", "h3"], gates: ["R", "L"] },
  { number: 14, name: "Fleet Command Substation", bonus: ["pc", "tc"], gates: ["TR", "BL", "L"] },
  { number: 15, name: "Free-Trade Logistics Hub", bonus: ["h3", "qp"], gates: ["TL", "R", "BR", "L"] },
  { number: 16, name: "Smuggler's Foundry", bonus: ["tc", "h3"], gates: ["TR", "BR", "BL"] },
  { number: 17, name: "Intelligence Bureau", bonus: ["qp", "tc"], gates: ["TL", "R", "L"] },
  { number: 18, name: "Subspace Disruption Array", bonus: ["pc", "qp"], gates: ["TR", "BL", "L"] },
  { number: 19, name: "System Regulator Node", bonus: ["h3", "pc"], gates: ["TL", "R", "BR"] },
  { number: 20, name: "Personnel Transporter", bonus: ["qp", "h3"], gates: ["TR", "BR", "L"] },
  { number: 21, name: "Officer Training Command", bonus: ["tc", "pc"], gates: ["TL", "R", "BL"] },
  { number: 22, name: "Commerce Guild Outpost", bonus: ["tc", "qp"], gates: ["TR", "BR", "BL"] },
];

/** The four planet warp-gate patterns, all confirmed by the owner (Q12, Appendix C). */
export const planetGatePatterns = {
  cl: ["TL", "TR", "R"],
  y: ["TL", "R", "BL"],
  ar: ["TL", "BL", "BR"],
  al: ["TR", "BR", "BL"],
} as const satisfies Readonly<Record<string, readonly EdgeName[]>>;

export type PlanetGatePattern = keyof typeof planetGatePatterns;

export type PlanetGroup = "High metal" | "High fuel" | "High component" | "High tech";

export interface PlanetAmount {
  readonly resource: ResourceId;
  readonly amount: number;
}

export interface PlanetFixture {
  readonly name: string;
  readonly group: PlanetGroup;
  readonly pattern: PlanetGatePattern;
  readonly supply: readonly PlanetAmount[];
  readonly demand: readonly PlanetAmount[];
}

function planet(
  group: PlanetGroup,
  name: string,
  pattern: PlanetGatePattern,
  supply: readonly PlanetAmount[],
  demand: readonly PlanetAmount[],
): PlanetFixture {
  return { name, group, pattern, supply, demand };
}

const tc = (amount: number): PlanetAmount => ({ resource: "tc", amount });
const h3 = (amount: number): PlanetAmount => ({ resource: "h3", amount });
const pc = (amount: number): PlanetAmount => ({ resource: "pc", amount });
const qp = (amount: number): PlanetAmount => ({ resource: "qp", amount });

export const planetFixtures: readonly PlanetFixture[] = [
  planet("High metal", "Aethel-9", "cl", [tc(4)], [h3(3), qp(2)]),
  planet("High metal", "Vulkan's Forge", "y", [tc(4), h3(2)], [pc(2), qp(3)]),
  planet("High metal", "Gorgon Prime", "ar", [tc(5)], [h3(3), pc(2)]),
  planet("High metal", "Caelum Mining Hub", "al", [tc(4)], [qp(4)]),
  planet("High metal", "The Iron Ring", "cl", [tc(4), pc(2)], [h3(4)]),
  planet("High fuel", "Zephyrus Minor", "ar", [h3(4)], [tc(4), qp(2)]),
  planet("High fuel", "Kraken's Breath", "al", [h3(5)], [tc(3), pc(2)]),
  planet("High fuel", "Osiris-4", "cl", [h3(4), tc(2)], [qp(4)]),
  planet("High fuel", "Boreas Station", "y", [h3(4)], [tc(2), pc(3)]),
  planet("High fuel", "Neptunia Prime", "ar", [h3(4), pc(2)], [tc(4)]),
  planet("High component", "Nova Forge", "al", [pc(4), tc(2)], [h3(4), qp(2)]),
  planet("High component", "Stallos Prime", "cl", [pc(4)], [tc(4), h3(2)]),
  planet("High component", "Ares Citadel", "ar", [pc(5), tc(2)], [h3(4)]),
  planet("High component", "Steelhold Alpha", "al", [pc(5)], [tc(4), qp(3)]),
  planet("High component", "Vanguard Station", "cl", [pc(4), h3(2)], [tc(4)]),
  planet("High tech", "Solaria Prime", "ar", [qp(4)], [tc(2), h3(4)]),
  planet("High tech", "Xanadu Core", "al", [qp(4), pc(2)], [h3(4)]),
  planet("High tech", "Apex Laboratories", "cl", [qp(5)], [pc(4)]),
  planet("High tech", "Elysium Nexus", "ar", [qp(4), h3(2)], [tc(4)]),
  planet("High tech", "Chronos Research Outpost", "al", [qp(4)], [h3(4)]),
];
