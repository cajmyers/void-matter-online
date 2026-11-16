import { describe, expect, it } from "vitest";
import { shipDeckBackArt } from "./shipDeckBackArt";

describe("shipDeckBackArt", () => {
  it("loads owner ship deck back", () => {
    expect(shipDeckBackArt()).toMatch(/ship\/back\/ship\.webp/);
  });
});