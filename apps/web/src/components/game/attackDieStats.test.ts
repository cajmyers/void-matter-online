import { describe, expect, it } from "vitest";
import { parseAttackDiceCount, parseHitLabel, shouldShowAttackDice } from "./attackDieStats";

describe("attackDieStats", () => {
  it("parses die counts from stats lines", () => {
    expect(parseAttackDiceCount("3 dice · 5+")).toBe(3);
    expect(parseAttackDiceCount("6 dice · nat. 6")).toBe(6);
    expect(parseAttackDiceCount("1 die · 6+ only")).toBe(1);
    expect(parseAttackDiceCount("DEF · energy")).toBeUndefined();
  });

  it("parses hit labels", () => {
    expect(parseHitLabel("3 dice · 5+")).toBe("5+");
    expect(parseHitLabel("6 dice · nat. 6")).toBe("nat. 6");
  });

  it("skips defence cards", () => {
    expect(shouldShowAttackDice("defence", "3 dice · 5+", 3)).toBe(false);
    expect(shouldShowAttackDice("weapon", undefined, 2)).toBe(true);
  });
});
