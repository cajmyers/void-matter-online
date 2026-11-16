import { describe, expect, it } from "vitest";
import { sectorDeckBackArt } from "./sectorDeckBackArt";

describe("sectorDeckBackArt", () => {
  it("loads owner back for each sector deck", () => {
    expect(sectorDeckBackArt("s1")).toMatch(/s1\/back\/s1\.webp/);
    expect(sectorDeckBackArt("s2")).toMatch(/s2\/back\/s2\.webp/);
    expect(sectorDeckBackArt("s3")).toMatch(/s3\/back\/s3\.webp/);
    expect(sectorDeckBackArt("s4")).toMatch(/s4\/back\/s4\.webp/);
  });
});