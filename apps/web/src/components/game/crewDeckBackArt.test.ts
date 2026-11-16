import { describe, expect, it } from "vitest";
import { crewDeckBackArt } from "./crewDeckBackArt";

describe("crewDeckBackArt", () => {
  it("loads owner crew deck back", () => {
    expect(crewDeckBackArt()).toMatch(/crew\/back\/crew\.webp/);
  });
});