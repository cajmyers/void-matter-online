import { describe, expect, it } from "vitest";
import { midGame4SeatView } from "./midGame4Seat";
import { board4SeatHexes } from "../board/boardLayout4Seat";

describe("midGame4Seat fixture", () => {
  it("fills the 4-seat board (`MAP-1`)", () => {
    expect(midGame4SeatView.map).toHaveLength(board4SeatHexes.length);
    expect(midGame4SeatView.map).toHaveLength(37);
    expect(midGame4SeatView.seatCount).toBe(4);
  });

  it("includes shared market zones", () => {
    expect(midGame4SeatView.markets.sectors).toHaveLength(4);
    expect(midGame4SeatView.markets.crew.faceUpCrewIds.length).toBeGreaterThan(0);
  });

  it("includes viewer fleet linked to map ships", () => {
    expect(midGame4SeatView.viewerFleet.ships).toHaveLength(2);
    const mapIds = midGame4SeatView.ships
      .map((ship) => ship.instanceId)
      .filter((id): id is string => id !== undefined);
    expect(mapIds).toContain(midGame4SeatView.viewerFleet.selectedInstanceId);
  });

  it("places one Outer Rim Nexus per seat", () => {
    const rim = midGame4SeatView.map.filter((hex) => hex.tile.kind === "nexusRim");
    expect(rim).toHaveLength(4);
    expect(rim.map((hex) => (hex.tile.kind === "nexusRim" ? hex.tile.seat : 0)).sort()).toEqual([1, 2, 3, 4]);
  });
});