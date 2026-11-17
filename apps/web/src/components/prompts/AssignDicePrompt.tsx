import { CombatDie } from "../game/CombatDie";
import type { CombatDieValue } from "../game/combatDiePips";
import { Typography } from "../Typography/Typography";
import { PromptShell } from "./PromptShell";
import shared from "./promptShared.module.css";

export interface AssignDicePromptProps {
  readonly headline: string;
  readonly lead?: string;
  readonly dice: readonly CombatDieValue[];
  readonly targets: readonly string[];
  readonly assignment: readonly (number | null)[];
}

/** 7 — Assign each combat die to a target. */
export function AssignDicePrompt({ headline, lead, dice, targets, assignment }: AssignDicePromptProps) {
  return (
    <PromptShell title="Assign dice" headline={headline} lead={lead}>
      <div className={shared.assignGrid}>
        {dice.map((value, index) => (
          <div key={index} className={shared.actionRow}>
            <CombatDie value={value} size={40} state="thrown" />
            <Typography variant="body2">→</Typography>
            <div className={shared.targetColumn}>
              <Typography variant="caption" className={shared.targetLabel}>
                Target
              </Typography>
              <select
                aria-label={`Assign die ${index + 1}`}
                defaultValue={assignment[index] !== null && assignment[index] !== undefined ? String(assignment[index]) : ""}
              >
                <option value="" disabled>
                  Choose…
                </option>
                {targets.map((target, targetIndex) => (
                  <option key={target} value={targetIndex}>
                    {target}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </PromptShell>
  );
}