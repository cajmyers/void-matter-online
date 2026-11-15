import { describe, expect, it } from "vitest";
import { previewCargoSlotResources } from "./cargoSlotPreview";

describe("cargoSlotPreview", () => {
  it("returns stable resources for a given seed", () => {
    const a = previewCargoSlotResources("Bulk Storage", 3);
    const b = previewCargoSlotResources("Bulk Storage", 3);
    expect(a).toEqual(b);
    expect(a).toHaveLength(3);
  });

  it("uses distinct resources when there is more than one slot", () => {
    for (const count of [2, 3, 4]) {
      const slots = previewCargoSlotResources("Expanded Cargo Bay", count);
      expect(slots).toHaveLength(count);
      expect(new Set(slots).size).toBe(count);
    }
  });
});