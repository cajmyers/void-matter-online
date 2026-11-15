import type { ResourceId } from "./resources";
import type { AssetResourceCost } from "./assetCardTypes";

/** Flat list of cubes from V5-style repeated ids (gallery fixtures). */
export function costsFromResourceList(cost: readonly ResourceId[]): readonly AssetResourceCost[] {
  const amounts = new Map<ResourceId, number>();
  for (const resource of cost) {
    amounts.set(resource, (amounts.get(resource) ?? 0) + 1);
  }
  return [...amounts.entries()].map(([resource, amount]) => ({ resource, amount }));
}
