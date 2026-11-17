import type { PlayerShip } from "@void-matter/content";
import type { ShipCardProps } from "../components/game/ShipCard";

export function shipCardPropsFromPlayerShip(ship: PlayerShip): ShipCardProps {
  return {
    shipId: ship.id,
    title: ship.title,
    subtitle: ship.subtitle,
    speed: ship.speed,
    hull: ship.hull,
    crewSlots: ship.crewSlots,
    cargo: ship.cargo,
    buildCosts: ship.buildCosts,
    upgradeSlotCount: ship.upgradeSlotsHalves / 2,
    weapons: ship.weaponsLine,
  };
}