import { describe, expect, it } from "vitest";
import { anomalyFixtures, planetFixtures } from "./tiles";

/** Smoke test: web re-exports load validated JSON from `@void-matter/content`. */
describe("tile fixtures re-export", () => {
  it("loads anomalies and planets from the content package", () => {
    expect(anomalyFixtures.length).toBe(22);
    expect(planetFixtures.length).toBe(20);
    expect(anomalyFixtures[0]?.id).toMatch(/^anomaly-/);
  });
});
