import { playerShips } from "@void-matter/content";
import { describe, expect, it } from "vitest";
import { ownerGalleryAssetCardsById } from "../fixtures/sectorAssetCards";
import { midGame4SeatViewerFleet } from "../fixtures/scenarios/midGame4SeatFleet";
import { deriveFleetShipStats } from "./fleetShipStats";

describe("deriveFleetShipStats", () => {
  const corvette = playerShips.find((row) => row.id === "nomad-corvette");
  expect(corvette).toBeDefined();

  it("totals Corvette A with installed weapons and no speed modules", () => {
    if (!corvette) return;
    const ship = midGame4SeatViewerFleet.ships.find((row) => row.instanceId === "seat1-corvette-a");
    expect(ship).toBeDefined();
    if (!ship) return;
    const stats = deriveFleetShipStats(corvette, ship, ownerGalleryAssetCardsById);
    expect(stats.speed).toBe(2);
    expect(stats.weaponCount).toBe(4);
    expect(stats.crewAssigned).toBe(1);
    expect(stats.crewSlots).toBe(1);
  });

  it("totals Corvette B with nested overdrive speed and one base weapon", () => {
    if (!corvette) return;
    const ship = midGame4SeatViewerFleet.ships.find((row) => row.instanceId === "seat1-corvette-b");
    expect(ship).toBeDefined();
    if (!ship) return;
    const stats = deriveFleetShipStats(corvette, ship, ownerGalleryAssetCardsById);
    expect(stats.speed).toBe(5);
    expect(stats.weaponCount).toBe(1);
    expect(stats.damage).toBe(1);
  });
});