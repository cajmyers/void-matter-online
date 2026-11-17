import type { EnemyFactionId } from "@void-matter/content";

export function enemyRimForFaction(faction: EnemyFactionId): string {
  switch (faction) {
    case "iron-syndicate":
      return "var(--game-faction-iron)";
    case "prism-ascendancy":
      return "var(--game-faction-prism)";
    case "the-hive":
      return "var(--game-faction-hive)";
  }
}