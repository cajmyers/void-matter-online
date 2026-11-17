import { Button } from "../Button/Button";
import { PromptShell } from "./PromptShell";
import shared from "./promptShared.module.css";

export interface DamageChoicePromptProps {
  readonly headline: string;
  readonly lead: string;
  readonly canTakeCubes: boolean;
  readonly cubeLabel: string;
  readonly componentLabel: string;
  readonly hint?: string;
}

/** 6 — Cubes or discard component (`LOT-3`); cube option hidden on overflow. */
export function DamageChoicePrompt({
  headline,
  lead,
  canTakeCubes,
  cubeLabel,
  componentLabel,
  hint = canTakeCubes
    ? undefined
    : "Cube option is unavailable: not every hit fits in hull slots (overflow rule).",
}: DamageChoicePromptProps) {
  return (
    <PromptShell title="Damage choice" headline={headline} lead={lead} hint={hint}>
      <div className={shared.actions}>
        <Button type="button" disabled={!canTakeCubes}>
          {cubeLabel}
        </Button>
        <Button type="button" variant="outlined">
          {componentLabel}
        </Button>
      </div>
    </PromptShell>
  );
}