import { describe, expect, it } from "vitest";
import { midGame4SeatView } from "./midGame4Seat";
import { board4SeatHexes } from "../board/boardLayout4Seat";

describe("midGame4Seat fixture", () => {
  it("fills the 4-seat board (`MAP-1`)", () => {
    expect(midGame4SeatView.map).toHaveLength(board4SeatHexes.length);
    expect(midGame4SeatView.map).toHaveLength(37);
    expect(midGame4SeatView.seatCount).toBe(4);
  });

  it("places one Outer Rim Nexus per seat", () => {
    const rim = midGame4SeatView.map.filter((hex) => hex.tile.kind === "nexusRim");
    expect(rim).toHaveLength(4);
    expect(rim.map((hex) => (hex.tile.kind === "nexusRim" ? hex.tile.seat : 0)).sort()).toEqual([1, 2, 3, 4]);
  });
});