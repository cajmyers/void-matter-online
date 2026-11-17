import { CombatDie } from "../game/CombatDie";
import type { CombatDieValue } from "../game/combatDiePips";
import { Button } from "../Button/Button";
import { PromptShell } from "./PromptShell";
import shared from "./promptShared.module.css";

export interface ChooseRerollDicePromptProps {
  readonly headline: string;
  readonly lead?: string;
  readonly dice: readonly CombatDieValue[];
  readonly selectedIndices?: readonly number[];
  readonly maxPick?: number;
}

/** 8 — Choose up to two dice to reroll. */
export function ChooseRerollDicePrompt({
  headline,
  lead = "Select exactly two dice, then confirm.",
  dice,
  selectedIndices = [0, 2],
  maxPick = 2,
}: ChooseRerollDicePromptProps) {
  return (
    <PromptShell title="Reroll dice" headline={headline} lead={lead}>
      <div className={shared.dicePool} role="group" aria-label="Dice to reroll">
        {dice.map((value, index) => {
          const selected = selectedIndices.includes(index);
          return (
            <button
              key={index}
              type="button"
              className={shared.diceToggle}
              data-selected={selected}
              aria-pressed={selected}
            >
              <CombatDie value={value} size={44} state="thrown" rerolled={selected} />
            </button>
          );
        })}
      </div>
      <div className={shared.actions}>
        <Button type="button" disabled={selectedIndices.length !== maxPick}>
          Reroll {selectedIndices.length} / {maxPick}
        </Button>
      </div>
    </PromptShell>
  );
}