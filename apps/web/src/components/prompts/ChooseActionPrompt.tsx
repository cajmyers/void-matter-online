import { Button } from "../Button/Button";
import { ActionToken } from "../game/ActionToken";
import type { ActionTokenKind } from "../game/resources";
import { PromptShell } from "./PromptShell";
import shared from "./promptShared.module.css";

const primaryActions: readonly { readonly kind: ActionTokenKind; readonly label: string }[] = [
  { kind: "move", label: "Move" },
  { kind: "trade", label: "Trade" },
  { kind: "interact", label: "Interact…" },
  { kind: "tactical", label: "Tactical…" },
];

export interface ChooseActionPromptProps {
  readonly shipName?: string;
  readonly showFreeAction?: boolean;
}

/** 1 — Choose Move / Trade / Interact / Tactical (sub-kinds follow), free action, or Pass. Repair is Tactical. */
export function ChooseActionPrompt({ shipName = "Corvette", showFreeAction = true }: ChooseActionPromptProps) {
  return (
    <PromptShell
      title="Choose action"
      headline={`${shipName}: choose an action`}
      lead="Spend a ready token (Interact and Tactical open a follow-up prompt), take a free action if a card allows it, or pass."
    >
      <div className={shared.tokenGrid} role="group" aria-label="Action tokens">
        {primaryActions.map(({ kind, label }) => (
          <button key={kind} type="button" className={shared.tokenOption}>
            <ActionToken kind={kind} size={40} />
            <span className={shared.tokenLabel}>{label}</span>
          </button>
        ))}
      </div>
      <div className={shared.actions}>
        {showFreeAction ? (
          <Button type="button" variant="outlined">
            Free action
          </Button>
        ) : null}
        <Button type="button" variant="text">
          Pass
        </Button>
      </div>
    </PromptShell>
  );
}