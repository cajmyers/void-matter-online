import { costsFromResourceList } from "../components/game/assetCardCosts";
import type { AssetCardProps } from "../components/game/AssetCard";
import type { AssetCardFixture } from "./assetCardFixtures";
import {
  commonTechnologySpecimens,
  defenceSpecimens,
  sectorSpecimens,
  slotSizeSpecimens,
  uniqueSpecimens,
  weaponSpecimens,
  type ComponentCardFixture,
} from "./cards";

function legacyCategory(fixture: ComponentCardFixture): AssetCardFixture["category"] {
  if (fixture.stats?.toUpperCase().includes("DEF")) return "defence";
  if (fixture.title === "Drone Hangar") return "special";
  if (fixture.stats?.includes("dice")) return "weapon";
  return "module";
}

function fromLegacy(fixture: ComponentCardFixture): AssetCardFixture {
  return {
    title: fixture.title,
    rulesText: fixture.text,
    sector: fixture.sector,
    costs: costsFromResourceList(fixture.cost),
    slotSize: fixture.slotSize ?? 1,
    category: legacyCategory(fixture),
    ...(fixture.art ? { placeholderArt: fixture.art } : {}),
    ...(fixture.stats ? { statsLine: fixture.stats } : {}),
    ...(fixture.note ? { footerNote: fixture.note } : {}),
  };
}

function toProps(fixture: AssetCardFixture): AssetCardProps {
  return {
    title: fixture.title,
    rulesText: fixture.rulesText,
    sector: fixture.sector,
    costs: fixture.costs,
    slotSize: fixture.slotSize,
    category: fixture.category,
    ...(fixture.flavorText ? { flavorText: fixture.flavorText } : {}),
    ...(fixture.placeholderArt ? { placeholderArt: fixture.placeholderArt } : {}),
    ...(fixture.statsLine ? { statsLine: fixture.statsLine } : {}),
    ...(fixture.weapon ? { weapon: fixture.weapon } : {}),
    ...(fixture.footerNote ? { footerNote: fixture.footerNote } : {}),
  };
}

export const assetPatternSpecimens: readonly AssetCardFixture[] = [
  {
    title: "Minigun",
    flavorText: "Reliable mass fire for early engagements.",
    rulesText: "Mass weapon. Good early pressure.",
    sector: "pc",
    costs: [{ resource: "pc", amount: 1 }, { resource: "qp", amount: 1 }],
    slotSize: 1,
    category: "weapon",
    placeholderArt: "ship",
    weapon: { diceCount: 3, hitLabel: "5+", archetype: "Mass Accelerator" },
  },
  {
    title: "Energy Shields",
    flavorText: "Projected barrier tuned for energy salvo frequencies.",
    rulesText: "Each energy weapon's hits are reduced to at most 1, per weapon.",
    sector: "tc",
    costs: [{ resource: "tc", amount: 2 }, { resource: "qp", amount: 1 }],
    slotSize: 1,
    category: "defence",
    placeholderArt: "planet",
    statsLine: "DEF · energy",
  },
  {
    title: "Impulse Thrusters",
    rulesText: "Pay 1 H3 from the pool on your action turn: +1 speed until Maintenance.",
    sector: "h3",
    costs: [{ resource: "h3", amount: 2 }],
    slotSize: 1,
    category: "module",
    placeholderArt: "ship",
  },
];

export const assetSectorSpecimens = sectorSpecimens.map(fromLegacy);
export const assetSlotSpecimens = slotSizeSpecimens.map(fromLegacy);
export const assetWeaponSpecimens = weaponSpecimens.map(fromLegacy);
export const assetDefenceSpecimens = defenceSpecimens.map(fromLegacy);
export const assetUniqueSpecimens = uniqueSpecimens.map(fromLegacy);
export const assetCommonTechSpecimens = commonTechnologySpecimens.map(fromLegacy);

export function assetProps(fixture: AssetCardFixture): AssetCardProps {
  return toProps(fixture);
}
