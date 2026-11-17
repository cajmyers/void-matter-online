import { describe, expect, it } from "vitest";
import { enemyCatalogue, playerShips } from "@void-matter/content";
import {
  enemyWeaponArchetypeLabel,
  expandEnemyWeaponMounts,
  parseEnemyWeaponsLine,
} from "./enemyWeaponsLine";

describe("parseEnemyWeaponsLine", () => {
  it("parses every iron syndicate weapons line", () => {
    const ironShips = enemyCatalogue.filter((ship) => ship.faction === "iron-syndicate");
    for (const ship of ironShips) {
      const parsed = parseEnemyWeaponsLine(ship.weaponsLine);
      expect(parsed.length).toBe(1);
      expect(parsed[0]!.diceCount).toBeGreaterThan(0);
      expect(parsed[0]!.hitLabel).toMatch(/^\d+\+$/);
    }
  });

  it("parses every player ship weapons line", () => {
    for (const ship of playerShips) {
      const parsed = parseEnemyWeaponsLine(ship.weaponsLine);
      expect(parsed.length).toBe(1);
      expect(parsed[0]!.diceCount).toBeGreaterThan(0);
      expect(parsed[0]!.hitLabel).toMatch(/^\d+\+$/);
    }
  });

  it("reads mount count and threshold from the printed line", () => {
    const parsed = parseEnemyWeaponsLine("2× Siege Mass Driver · 4 dice · 5+ each");
    expect(parsed[0]).toEqual({
      mountCount: 2,
      name: "Siege Mass Driver",
      diceCount: 4,
      hitLabel: "5+",
    });
    expect(enemyWeaponArchetypeLabel(parsed[0]!.name)).toBe("Mass Accelerator");
    expect(expandEnemyWeaponMounts(parsed)).toHaveLength(2);
  });
});