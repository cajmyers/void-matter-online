import { describe, expect, it } from "vitest";
import { fleetInstallSpans, slotSizeToHalves } from "./fleetSlotHalves";

describe("fleetSlotHalves", () => {
  it("maps catalogue slot sizes to half capacity (`SLT-1`)", () => {
    expect(slotSizeToHalves(0.5)).toBe(1);
    expect(slotSizeToHalves(1)).toBe(2);
    expect(slotSizeToHalves(2)).toBe(4);
  });

  it("lays out installs in order within capacity", () => {
    const spans = fleetInstallSpans(
      ["beam-projector", "nested-overdrive"],
      (id) => (id === "nested-overdrive" ? 2 : 1),
      8,
    );
    expect(spans).toEqual([
      { catalogueId: "beam-projector", startHalf: 0, spanHalves: 2 },
      { catalogueId: "nested-overdrive", startHalf: 2, spanHalves: 4 },
    ]);
  });
});