import { describe, expect, it } from "vitest";
import { midGame4SeatView } from "../fixtures/scenarios/midGame4Seat";
import { tableMarketsContext } from "./tableMarketsContext";

describe("tableMarketsContext", () => {
  it("allows S1 crew and missions at the viewer Outer Rim Nexus (`MAP-4`, 4 seats)", () => {
    const context = tableMarketsContext(midGame4SeatView);
    expect(context.purchasableTabIds).toEqual(["s1", "crew", "missions"]);
  });
});