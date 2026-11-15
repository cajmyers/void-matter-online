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