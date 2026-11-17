/** One printed weapon group from catalogue `weaponsLine` text. */
export interface ParsedEnemyWeapon {
  readonly mountCount: number;
  readonly name: string;
  readonly diceCount: number;
  readonly hitLabel: string;
}

const enemyWeaponLinePattern =
  /^(\d+)×\s*(.+?)\s*·\s*(\d+)\s*(?:dice|die)\s*·\s*(\d+)\+(?:\s*each)?/i;

/** Parses `packages/content` enemy `weaponsLine` (V5 stat line). */
export function parseEnemyWeaponsLine(line: string): readonly ParsedEnemyWeapon[] {
  const trimmed = line.trim();
  if (!trimmed) {
    return [];
  }
  const match = trimmed.match(enemyWeaponLinePattern);
  if (!match?.[1] || !match[2] || !match[3] || !match[4]) {
    return [];
  }
  return [
    {
      mountCount: Number(match[1]),
      name: match[2].trim(),
      diceCount: Number(match[3]),
      hitLabel: `${match[4]}+`,
    },
  ];
}

const archetypeRules: ReadonlyArray<readonly [RegExp, string]> = [
  [/laser|plasma|pyre|thermal/i, "Energy"],
  [/missile|torpedo|stinger|brood|drone|swarm|hive/i, "Drones and Missiles"],
  [/slug|driver|mass|gauss|siege|scrap/i, "Mass Accelerator"],
];

/** One physical weapon mount (printed line may bundle several with `N×`). */
export interface EnemyWeaponMount {
  readonly name: string;
  readonly diceCount: number;
  readonly hitLabel: string;
}

export function expandEnemyWeaponMounts(weapons: readonly ParsedEnemyWeapon[]): readonly EnemyWeaponMount[] {
  const mounts: EnemyWeaponMount[] = [];
  for (const weapon of weapons) {
    for (let index = 0; index < weapon.mountCount; index += 1) {
      mounts.push({
        name: weapon.name,
        diceCount: weapon.diceCount,
        hitLabel: weapon.hitLabel,
      });
    }
  }
  return mounts;
}

/** Printed archetype label for {@link AttackDiceRow} (same vocabulary as S1 weapons). */
export function enemyWeaponArchetypeLabel(weaponName: string): string {
  for (const [pattern, label] of archetypeRules) {
    if (pattern.test(weaponName)) {
      return label;
    }
  }
  return "Weapon";
}