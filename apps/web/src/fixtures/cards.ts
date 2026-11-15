import type { ActionTokenKind, ResourceId } from "../components/game/resources";

export interface CrewCardFixture {
  readonly title: string;
  readonly text: string;
  readonly cost: readonly ResourceId[];
  readonly action: ActionTokenKind;
}

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