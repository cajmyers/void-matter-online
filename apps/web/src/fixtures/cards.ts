import type { CardArtKind, ComponentSlotSize } from "../components/game/ComponentCard.types";
import type { ActionTokenKind, ResourceId } from "../components/game/resources";

export interface ComponentCardFixture {
  readonly title: string;
  readonly text: string;
  readonly sector: ResourceId;
  readonly cost: readonly ResourceId[];
  readonly art?: CardArtKind;
  readonly slotSize?: ComponentSlotSize;
  readonly stats?: string;
  readonly note?: string;
}

export interface CrewCardFixture {
  readonly title: string;
  readonly text: string;
  readonly cost: readonly ResourceId[];
  readonly action: ActionTokenKind;
}

export const sectorSpecimens: readonly ComponentCardFixture[] = [
  {
    title: "Magnetic Shields",
    text: "Each magnetic weapon's hits are reduced to at most 1, per weapon.",
    sector: "tc",
    cost: ["tc", "tc"],
    art: "planet",
    slotSize: 1,
    stats: "DEF · magnetic",
  },
  {
    title: "Impulse Thrusters",
    text: "Pay 1 H3 from the pool on your action turn: +1 speed until Maintenance.",
    sector: "h3",
    cost: ["h3", "h3"],
    art: "ship",
    slotSize: 1,
  },
  {
    title: "Compact Storage",
    text: "+1 cargo on this ship.",
    sector: "qp",
    cost: ["qp"],
    art: "nebula",
    slotSize: 1,
  },
  {
    title: "Minigun",
    text: "Mass weapon. Good early pressure.",
    sector: "pc",
    cost: ["pc", "qp"],
    art: "ship",
    slotSize: 1,
    stats: "3 dice · 5+",
  },
];

export const slotSizeSpecimens: readonly ComponentCardFixture[] = [
  {
    title: "Decoy Launcher",
    text: "Reaction: void one hit on a successful defence roll.",
    sector: "tc",
    cost: ["tc", "qp"],
    slotSize: 0.5,
    art: "planet",
  },
  {
    title: "Diamond Hull",
    text: "Ignore the first hit each combat round.",
    sector: "tc",
    cost: ["tc", "tc", "h3", "qp"],
    slotSize: 1,
    art: "planet",
  },
  {
    title: "Apocalypse",
    text: "Each hit becomes two hits.",
    sector: "pc",
    cost: ["pc", "pc", "tc", "h3"],
    slotSize: 2,
    art: "ship",
    stats: "1 die · 6+ only",
  },
];

export const weaponSpecimens: readonly ComponentCardFixture[] = [
  {
    title: "Heavy Plasma Cannon",
    text: "Energy weapon.",
    sector: "pc",
    cost: ["pc", "pc", "h3"],
    slotSize: 1,
    art: "ship",
    stats: "2 dice · 5+",
  },
  {
    title: "Flak",
    text: "Mass weapon; only natural 6s count as hits.",
    sector: "pc",
    cost: ["pc", "tc"],
    slotSize: 1,
    art: "ship",
    stats: "6 dice · nat. 6",
  },
];

export const defenceSpecimens: readonly ComponentCardFixture[] = [
  {
    title: "Energy Shields",
    text: "Each energy weapon's hits are reduced to at most 1, per weapon.",
    sector: "tc",
    cost: ["tc", "tc", "qp"],
    slotSize: 1,
    art: "planet",
    stats: "DEF · energy",
  },
];

export const uniqueSpecimens: readonly ComponentCardFixture[] = [
  {
    title: "Drone Hangar",
    text: "Deploy drones at the start of combat (unique).",
    sector: "pc",
    cost: ["pc", "qp", "tc"],
    slotSize: 2,
    art: "nebula",
    note: "Unique",
  },
];

export const commonTechnologySpecimens: readonly ComponentCardFixture[] = [
  {
    title: "Hull Plating",
    text: "+1 hull on this ship. Always available at an upgrade.",
    sector: "tc",
    cost: ["tc", "h3"],
    slotSize: 1,
    art: "planet",
    note: "Common technology",
  },
];

export const enemyFixtures = [
  {
    name: "Iron Skiff",
    tier: 1 as const,
    hull: 3,
    speed: 2,
    weapons: "1× Scrap-Driver · 1 die · 5+",
    special: "Underworld Extortion 1: destroyer pays 1 resource from their faction pool.",
  },
  {
    name: "Iron Enforcer",
    tier: 2 as const,
    hull: 5,
    speed: 1,
    weapons: "2× Heavy Slug · 2 dice · 4+ each",
    special: "Underworld Extortion 2: destroyer pays 2 resources from their faction pool.",
  },
  {
    name: "Iron Goliath",
    tier: 3 as const,
    hull: 7,
    speed: 1,
    weapons: "2× Siege Mass Driver · 4 dice · 5+ each",
    special: "Underworld Extortion 3: destroyer pays 3 resources from their faction pool.",
  },
] as const;

export const ensignFixtures: readonly CrewCardFixture[] = [
  {
    title: "Pilot",
    text: "Grants a Move token on this ship only.",
    cost: ["h3", "h3", "h3"],
    action: "move",
  },
  {
    title: "Merchant",
    text: "Grants a Trade token on this ship only.",
    cost: ["h3", "qp", "qp"],
    action: "trade",
  },
  {
    title: "Tactical",
    text: "Grants a Tactical token on this ship only.",
    cost: ["pc", "pc", "pc"],
    action: "tactical",
  },
  {
    title: "Scout",
    text: "Grants an Interact token on this ship only.",
    cost: ["pc", "qp", "qp"],
    action: "interact",
  },
];
