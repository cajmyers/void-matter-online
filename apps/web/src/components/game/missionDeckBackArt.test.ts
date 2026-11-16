import { describe, expect, it } from "vitest";
import { missionDeckBackArt } from "./missionDeckBackArt";

describe("missionDeckBackArt", () => {
  it("loads owner mission deck back", () => {
    expect(missionDeckBackArt()).toMatch(/mission\/back\/mission\.webp/);
  });
});