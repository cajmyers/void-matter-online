import { describe, expect, it } from "vitest";
import {
  centralNexusInteractActions,
  outerRimNexusInteractActions,
  shipsOnHex,
  upgradeMarketsAtRimNexus,
} from "./mapHexInspector";
import type { ShipOnMapView } from "./mapView";

describe("shipsOnHex", () => {
  const ships: readonly ShipOnMapView[] = [
    { q: 1, r: 0, seat: 1, pinned: true },
    { q: 1, r: 0, seat: 2, laneOffset: 1, pinned: true },
    { q: 0, r: -1, seat: 3 },
  ];

  it("lists Nexus interact actions for the inspector", () => {
    expect(centralNexusInteractActions).toContain("Upgrade ship");
    expect(centralNexusInteractActions).toContain("Redeem completed mission");
    expect(outerRimNexusInteractActions).toContain("Nexus Hop");
    expect(outerRimNexusInteractActions).toContain("Commission mission");
  });

  it("assigns upgrade markets to rim nexuses per seat count (`MAP-4`)", () => {
    expect(upgradeMarketsAtRimNexus(2, 4)).toEqual([2]);
    expect(upgradeMarketsAtRimNexus(1, 2)).toEqual([1, 2]);
    expect(upgradeMarketsAtRimNexus(2, 3)).toEqual([2, 3]);
  });

  it("returns ships on the matching hex", () => {
    expect(shipsOnHex(ships, 1, 0)).toHaveLength(2);
    expect(shipsOnHex(ships, 0, -1)).toHaveLength(1);
    expect(shipsOnHex(ships, 0, 0)).toHaveLength(0);
  });
});