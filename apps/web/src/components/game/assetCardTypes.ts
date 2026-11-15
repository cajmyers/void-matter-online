import type { ResourceId } from "./resources";

export type AssetCardCategory = "weapon" | "special" | "defence" | "module";

export type AssetSlotSize = 0.5 | 1 | 2;

export interface AssetResourceCost {
  readonly resource: ResourceId;
  readonly amount: number;
}

export interface AssetWeaponBlock {
  readonly diceCount: number;
  readonly hitLabel: string;
  readonly archetype: string;
}

/** Procedural art when no owner illustration is loaded. */
export type AssetPlaceholderArt = "planet" | "nebula" | "ship";

const categoryLabels: Readonly<Record<AssetCardCategory, string>> = {
  weapon: "Weapon",
  special: "Special",
  defence: "Defence",
  module: "Module",
};

export function assetCategoryLabel(category: AssetCardCategory): string {
  return categoryLabels[category];
}
