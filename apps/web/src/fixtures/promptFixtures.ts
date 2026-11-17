import { enemyCatalogue, missionCatalogue } from "@void-matter/content";
import type { SeatNumber } from "../components/game/resources";
import { galleryCrewCardsById } from "./zoneFixtures";
import { ownerAssetCardsForDeck } from "./sectorAssetCards";
import type { RetreatDeclaration } from "../components/prompts/DeclareRetreatPrompt";

const marketLaser = ownerAssetCardsForDeck("s1").find((card) => card.catalogueId === "laser-cannon");
const crewPilot = galleryCrewCardsById.pilot;
const missionSample = missionCatalogue.find((mission) => mission.id === "syndicate-bust");
const enemySample = enemyCatalogue.find((enemy) => enemy.id === "iron-skiff");

export const galleryDamageOverflow = {
  headline: "Bot's Minigun hits you twice",
  lead: "Your Corvette has 1 free hull slot, so it cannot take 2 cubes. It must lose a component instead.",
  canTakeCubes: false,
  cubeLabel: "Take 2 cubes",
  componentLabel: "Discard a component",
} as const;

export const galleryDamageCubes = {
  headline: "Scrap fighter hits once",
  lead: "You have room for one damage cube or may discard a component instead.",
  canTakeCubes: true,
  cubeLabel: "Take 1 cube",
  componentLabel: "Discard a component",
} as const;

export const galleryReactionDecoy = {
  reactionName: "Decoy Launcher",
  trigger: "After the attack roll against your ship, declare whether to redirect one die.",
  cost: ["tc"] as const,
} as const;

export const galleryReactionTemporalEcho = {
  reactionName: "Temporal Echo",
  trigger: "After a friendly ship is destroyed, you may copy one of its last actions.",
  cost: ["h3"] as const,
  exchange: { need: "h3" as const, substitute: "pc" as const },
} as const;

export const galleryAssignDice = {
  headline: "Assign weapon dice",
  lead: "Each success die must be placed on a legal target.",
  dice: [6, 3, 5] as const,
  targets: ["Iron Skiff", "Prism Spark hull"] as const,
  assignment: [0, null, 1] as const,
};

export const galleryRerollDice = {
  headline: "Choose dice to reroll",
  dice: [2, 4, 5, 1] as const,
  selectedIndices: [0, 3] as const,
} as const;

export const galleryPayCost = {
  headline: "Pay Interact cost",
  lead: "Exhaust your ship's cargo to use the anomaly.",
  payments: [{ resource: "pc" as const, count: 2 }],
  exchange: { need: "pc" as const, substitute: "tc" as const },
} as const;

export const galleryChooseResources = {
  headline: "Take Spoils",
  lead: "Choose any 2 resources from the defeated enemy's cargo (`LOT-2`).",
  picksRequired: 2,
  picksChosen: [{ resource: "h3" as const, count: 1 }],
} as const;

export const galleryOrderEffects = {
  headline: "Two reactions triggered together",
  effects: ["Repulsor Grid pushes attacker", "Reactive Plating reduces next hit", "Mercenary Uplink bonus die"] as const,
} as const;

export function galleryRetreatDeclarations(): readonly RetreatDeclaration[] {
  return [
    { seat: 2 as SeatNumber, label: "Bot", status: "declared", detail: "Evade to hex (1,0)" },
    { seat: 3 as SeatNumber, label: "Rival", status: "pending" },
    { seat: 1 as SeatNumber, label: "You", status: "you" },
  ];
}

export const galleryFitMakeRoomSlots = {
  headline: "Expanded Cargo Bay does not fit",
  incomingLabel: "Expanded Cargo Bay (S3)",
  incomingCardId: "expanded-cargo-bay",
};

export const galleryPickOneAsset = marketLaser ?? ownerAssetCardsForDeck("s1")[0];
export const galleryPickOneCrew = crewPilot;
export const galleryPickOneMission = missionSample;
export const galleryPickOneEnemy = enemySample;