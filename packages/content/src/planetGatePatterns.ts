import type { EdgeName } from "./schemas/primitives";
import type { PlanetGatePattern } from "./schemas/tiles";

/** Printed warp-gate patterns (technical-proposal Appendix C, Q12). */
export const planetGatePatterns: Readonly<Record<PlanetGatePattern, readonly EdgeName[]>> = {
  cl: ["TL", "TR", "R"],
  y: ["TL", "R", "BL"],
  ar: ["TL", "BL", "BR"],
  al: ["TR", "BR", "BL"],
};
