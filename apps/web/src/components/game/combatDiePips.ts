/** Pip centres in a 0–100 die face (3×3 grid). */
const pip = (col: 0 | 1 | 2, row: 0 | 1 | 2): readonly [number, number] => {
  const x = 22 + col * 28;
  const y = 22 + row * 28;
  return [x, y];
};

export const combatDiePipLayout: Readonly<Record<1 | 2 | 3 | 4 | 5 | 6, readonly (readonly [number, number])[]>> = {
  1: [pip(1, 1)],
  2: [pip(0, 0), pip(2, 2)],
  3: [pip(0, 0), pip(1, 1), pip(2, 2)],
  4: [pip(0, 0), pip(2, 0), pip(0, 2), pip(2, 2)],
  5: [pip(0, 0), pip(2, 0), pip(1, 1), pip(0, 2), pip(2, 2)],
  6: [pip(0, 0), pip(0, 1), pip(0, 2), pip(2, 0), pip(2, 1), pip(2, 2)],
};

export type CombatDieValue = keyof typeof combatDiePipLayout;

export type CombatDieState = "resting" | "thrown" | "hit" | "miss";