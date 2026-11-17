import { Button } from "../Button/Button";
import { ActionToken } from "../game/ActionToken";
import { Typography } from "../Typography/Typography";
import { PromptShell } from "./PromptShell";
import shared from "./promptShared.module.css";

/** Kinds every ship can be offered when a Tactical token is spent (component extras are legal-actions only). */
const defaultTacticalKinds = ["Attack", "Evade", "Repair"] as const;

export const galleryTacticalKindsWithBeam = [...defaultTacticalKinds, "Beam Projector"] as const;

export interface ChooseTacticalKindPromptProps {
  readonly shipName?: string;
  readonly kinds?: readonly string[];
}

/** Sub-prompt after spending a Tactical token: Attack, Evade, Repair, and other tactical kinds. */
export function ChooseTacticalKindPrompt({
  shipName = "Corvette",
  kinds = defaultTacticalKinds,
}: ChooseTacticalKindPromptProps) {
  return (
    <PromptShell
      title="Tactical action"
      headline={`${shipName}: tactical action`}
      lead="Exhaust your Tactical token, then pick the kind. Repair is a tactical action, not a separate top-level turn choice."
    >
      <div className={shared.actionRow}>
        <ActionToken kind="tactical" size={36} exhausted />
        <Typography variant="caption">Token spent — choose kind</Typography>
      </div>
      <div className={shared.actionsStacked}>
        {kinds.map((kind) => (
          <Button key={kind} type="button" variant="outlined">
            {kind}
          </Button>
        ))}
      </div>
    </PromptShell>
  );
}