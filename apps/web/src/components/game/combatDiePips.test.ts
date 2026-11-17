import { describe, expect, it } from "vitest";
import { combatDiePipLayout } from "./combatDiePips";

describe("combatDiePipLayout", () => {
  it("maps each face to the correct pip count", () => {
    expect(combatDiePipLayout[1]).toHaveLength(1);
    expect(combatDiePipLayout[2]).toHaveLength(2);
    expect(combatDiePipLayout[3]).toHaveLength(3);
    expect(combatDiePipLayout[4]).toHaveLength(4);
    expect(combatDiePipLayout[5]).toHaveLength(5);
    expect(combatDiePipLayout[6]).toHaveLength(6);
  });
});