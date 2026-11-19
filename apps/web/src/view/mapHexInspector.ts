import type { ResourceId, SeatNumber } from "../components/game/resources";
import type { ResourceAmount } from "@void-matter/content";
import { anomalyFixtures } from "../fixtures/tiles";
import { centralNexusPassSupply } from "./centralNexusPassSupply";
import type { GameView } from "./gameView";
import type { MapHexView, ShipOnMapView } from "./mapView";

export interface HexInspectorShipEntry {
  readonly seat: SeatNumber;
  readonly label: string;
  readonly pinned?: boolean;
  readonly selected?: boolean;
}

export type HexInspectorFactValue =
  | { readonly kind: "text"; readonly text: string }
  | { readonly kind: "resources"; readonly amounts: readonly ResourceAmount[]; readonly display?: "amounts" | "icons" }
  | { readonly kind: "discovery"; readonly bonus: readonly [ResourceId, ResourceId] }
  | { readonly kind: "ships"; readonly entries: readonly HexInspectorShipEntry[] }
  | { readonly kind: "planetMarket"; readonly state: "available" | "blocked"; readonly lockCount?: number }
  | { readonly kind: "interactList"; readonly actions: readonly string[] };

export interface HexInspectorFact {
  readonly label: string;
  readonly value: HexInspectorFactValue;
}

export function shipsOnHex(ships: readonly ShipOnMapView[], q: number, r: number): readonly ShipOnMapView[] {
  return ships.filter((ship) => ship.q === q && ship.r === r);
}

function textFact(label: string, text: string): HexInspectorFact {
  return { label, value: { kind: "text", text } };
}

const sectorUpgradeMarketLabel: Readonly<Record<SeatNumber, string>> = {
  1: "S1 Weapons / Offensive",
  2: "S2 Propulsion / Utility",
  3: "S3 Cargo / Life Support",
  4: "S4 Hull / Defensive",
};

/** Which upgrade markets sit on this Outer Rim Nexus start tile (`MAP-4`). */
export function upgradeMarketsAtRimNexus(seat: SeatNumber, seatCount: 2 | 3 | 4): readonly SeatNumber[] {
  switch (seatCount) {
    case 4:
      return [seat];
    case 3:
      if (seat === 1) return [1];
      if (seat === 2) return [2, 3];
      return [4];
    case 2:
      return seat === 1 ? [1, 2] : [3, 4];
  }
}

function formatUpgradeMarkets(marketSeats: readonly SeatNumber[]): string {
  return marketSeats.map((seat) => sectorUpgradeMarketLabel[seat]).join(" · ");
}

const allSectorMarkets: readonly SeatNumber[] = [1, 2, 3, 4];

export function formatAllSectorUpgradeMarkets(): string {
  return formatUpgradeMarkets(allSectorMarkets);
}

/** Interact options at the Central Nexus (`MAP-4`: all sector markets; recruitment at any Nexus). */
export const centralNexusInteractActions: readonly string[] = [
  "Upgrade ship",
  "Recruit crew",
  "Redeem completed mission",
];

/** Interact options at an Outer Rim Nexus (`NEX-1`, design-decisions §7). */
export const outerRimNexusInteractActions: readonly string[] = [
  "Commission mission",
  "Upgrade ship",
  "Build Corvette",
  "Recruit crew",
  "Nexus Hop",
];

function interactListFact(actions: readonly string[]): HexInspectorFact {
  return { label: "Interact", value: { kind: "interactList", actions } };
}

/** Labels and values for the map hex inspector (`implementation-plan.md` §5.3). */
export function hexInspectorFacts(
  hex: MapHexView,
  view: Pick<GameView, "map" | "ships" | "seats" | "seatCount">,
): readonly HexInspectorFact[] {
  const facts: HexInspectorFact[] = [];

  const ships = shipsOnHex(view.ships, hex.q, hex.r);
  if (ships.length > 0) {
    facts.push({
      label: ships.length === 1 ? "Ship" : "Ships",
      value: {
        kind: "ships",
        entries: ships.map((ship) => {
          const seatRow = view.seats.find((row) => row.seat === ship.seat);
          return {
            seat: ship.seat,
            label: seatRow?.label ?? `Seat ${ship.seat}`,
            ...(ship.pinned ? { pinned: true } : {}),
            ...(ship.selected ? { selected: true } : {}),
          };
        }),
      },
    });
  }

  const tile = hex.tile;
  switch (tile.kind) {
    case "faceDown":
      break;
    case "nexusCentral":
      facts.push({
        label: "Pass supply",
        value: { kind: "resources", amounts: centralNexusPassSupply, display: "icons" },
      });
      facts.push(textFact("Upgrade markets", formatAllSectorUpgradeMarkets()));
      facts.push(interactListFact(centralNexusInteractActions));
      break;
    case "nexusRim":
      facts.push(
        textFact(
          "Upgrade markets",
          formatUpgradeMarkets(upgradeMarketsAtRimNexus(tile.seat, view.seatCount)),
        ),
      );
      facts.push(interactListFact(outerRimNexusInteractActions));
      break;
    case "planet": {
      const supplyLocked = (tile.lockedSupply ?? 0) > 0;
      const demandLocked = (tile.lockedDemand ?? 0) > 0;
      facts.push({
        label: "Supply",
        value: supplyLocked
          ? { kind: "planetMarket", state: "blocked", lockCount: tile.lockedSupply }
          : { kind: "planetMarket", state: "available" },
      });
      facts.push({
        label: "Demand",
        value: demandLocked
          ? { kind: "planetMarket", state: "blocked", lockCount: tile.lockedDemand }
          : { kind: "planetMarket", state: "available" },
      });
      if (tile.selected) {
        facts.push(textFact("Selection", "Highlighted on the board"));
      }
      break;
    }
    case "anomaly": {
      const row = anomalyFixtures.find((candidate) => candidate.name === tile.anomalyName);
      if (row) {
        facts.push({
          label: "Discovery bonus",
          value: { kind: "discovery", bonus: row.bonus },
        });
        facts.push(textFact(row.ability === "interact" ? "Interact" : "Passive", row.effect));
      }
      break;
    }
    default: {
      const _exhaustive: never = tile;
      return _exhaustive;
    }
  }

  return facts;
}

export function findMapHex(map: readonly MapHexView[], q: number, r: number): MapHexView | undefined {
  return map.find((hex) => hex.q === q && hex.r === r);
}