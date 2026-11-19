import type { ResourceAmount } from "@void-matter/content";
import { resourceIds } from "../components/game/resources";

/** Central Nexus begins each round with 1 of each type; passers take one (`design-decisions.md` §7). */
export const centralNexusPassSupply: readonly ResourceAmount[] = resourceIds.map((resource) => ({
  resource,
  amount: 1,
}));