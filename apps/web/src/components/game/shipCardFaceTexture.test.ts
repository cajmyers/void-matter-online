import { describe, expect, it } from "vitest";
import { playerShips } from "@void-matter/content";
import { shipCardFaceTexture } from "./assetCardArt";

describe("shipCardFaceTexture", () => {
  it("loads face texture by catalogue id", () => {
    expect(shipCardFaceTexture("nomad-corvette")).toMatch(/ship\/fronts\/nomad-corvette-texture\.webp/);
    expect(shipCardFaceTexture("unknown")).toBeUndefined();
  });

  it("loads a face texture for every catalogue player ship", () => {
    const missing = playerShips.filter((ship) => shipCardFaceTexture(ship.id) === undefined);
    expect(missing.map((ship) => ship.id)).toEqual([]);
  });
});