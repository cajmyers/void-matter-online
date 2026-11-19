import type { PlayerShip } from "@void-matter/content";
import { parseAttackDiceCount, shouldShowAttackDice } from "../components/game/attackDieStats";
import { expandEnemyWeaponMounts, parseEnemyWeaponsLine } from "../components/game/enemyWeaponsLine";
import type { OwnerGalleryAssetCard } from "../fixtures/sectorAssetCards";
import type { FleetShipView } from "./fleetView";

/** Totals for the fleet panel (Stage 1c fixture slice; engine `deriveShip` later). */
export interface FleetShipStatsSummary {
  readonly speed: number;
  readonly hull: number;
  readonly cargo: number;
  readonly crewSlots: number;
  readonly crewAssigned: number;
  readonly weaponCount: number;
  readonly damage: number;
}

function sumComponentBonuses(
  installedComponentIds: readonly string[],
  cardsById: Readonly<Record<string, OwnerGalleryAssetCard>>,
): {
  readonly speedBonus: number;
  readonly cargoBonus: number;
  readonly crewSlotsBonus: number;
  readonly hullSlotsBonus: number;
  readonly installedWeaponCount: number;
} {
  let speedBonus = 0;
  let cargoBonus = 0;
  let crewSlotsBonus = 0;
  let hullSlotsBonus = 0;
  let installedWeaponCount = 0;

  for (const catalogueId of installedComponentIds) {
    const card = cardsById[catalogueId];
    if (!card) {
      continue;
    }
    if (card.speedBonus !== undefined) {
      speedBonus += card.speedBonus;
    }
    if (card.cargoBonus !== undefined && card.cargoBonus > 0) {
      cargoBonus += card.cargoBonus;
    }
    if (card.crewSlotsBonus !== undefined && card.crewSlotsBonus > 0) {
      crewSlotsBonus += card.crewSlotsBonus;
    }
    if (card.hullSlotsBonus !== undefined && card.hullSlotsBonus > 0) {
      hullSlotsBonus += card.hullSlotsBonus;
    }
    const diceCount = card.weapon?.diceCount ?? parseAttackDiceCount(card.statsLine);
    if (shouldShowAttackDice(card.category, card.statsLine, diceCount)) {
      installedWeaponCount += 1;
    }
  }

  return { speedBonus, cargoBonus, crewSlotsBonus, hullSlotsBonus, installedWeaponCount };
}

/** Base hull stats plus installed module bonuses (`technical-proposal.md` derived-ship placeholder). */
export function deriveFleetShipStats(
  catalogue: PlayerShip,
  ship: FleetShipView,
  cardsById: Readonly<Record<string, OwnerGalleryAssetCard>>,
): FleetShipStatsSummary {
  const bonuses = sumComponentBonuses(ship.installedComponentIds, cardsById);
  const baseWeaponMounts = expandEnemyWeaponMounts(parseEnemyWeaponsLine(catalogue.weaponsLine)).length;

  return {
    speed: catalogue.speed + bonuses.speedBonus,
    hull: catalogue.hull + bonuses.hullSlotsBonus,
    cargo: catalogue.cargo + bonuses.cargoBonus,
    crewSlots: catalogue.crewSlots + bonuses.crewSlotsBonus,
    crewAssigned: ship.crewCatalogueIds.length,
    weaponCount: baseWeaponMounts + bonuses.installedWeaponCount,
    damage: ship.damage,
  };
}