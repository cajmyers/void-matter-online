/** Pull attack die count from a printed stats line (e.g. `3 dice · 5+`). */
export function parseAttackDiceCount(statsLine?: string): number | undefined {
  if (!statsLine) return undefined;
  const dice = statsLine.match(/(\d+)\s*dice\b/i);
  if (dice?.[1]) return Number(dice[1]);
  const die = statsLine.match(/(\d+)\s*die\b/i);
  if (die?.[1]) return Number(die[1]);
  return undefined;
}

/** Hit threshold text for the weapon row when only `statsLine` is available. */
export function parseHitLabel(statsLine?: string): string | undefined {
  if (!statsLine) return undefined;
  if (/nat\.?\s*6/i.test(statsLine)) return "nat. 6";
  const threshold = statsLine.match(/(\d+)\+/);
  if (threshold?.[1]) return `${threshold[1]}+`;
  if (/6\+ only/i.test(statsLine)) return "6+";
  return undefined;
}

export function shouldShowAttackDice(category: string, statsLine?: string, diceCount?: number): boolean {
  if (category === "defence") return false;
  const count = diceCount ?? parseAttackDiceCount(statsLine);
  return count !== undefined && count > 0;
}
