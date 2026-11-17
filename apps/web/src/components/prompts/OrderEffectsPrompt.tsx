import { Button } from "../Button/Button";
import { Typography } from "../Typography/Typography";
import { PromptShell } from "./PromptShell";
import shared from "./promptShared.module.css";

export interface OrderEffectsPromptProps {
  readonly headline: string;
  readonly lead?: string;
  readonly effects: readonly string[];
}

/** 11 — Order simultaneous effects (`CMB-10`). */
export function OrderEffectsPrompt({
  headline,
  lead = "Resolve from top to bottom. Reorder before you confirm.",
  effects,
}: OrderEffectsPromptProps) {
  return (
    <PromptShell title="Order effects" headline={headline} lead={lead}>
      <ol className={shared.orderList}>
        {effects.map((effect, index) => (
          <li key={effect} className={shared.orderItem}>
            <span className={shared.orderRank}>{index + 1}</span>
            <Typography variant="body2">{effect}</Typography>
            <div className={shared.actionRow}>
              <Button type="button" variant="text" disabled={index === 0} aria-label="Move up">
                ↑
              </Button>
              <Button type="button" variant="text" disabled={index === effects.length - 1} aria-label="Move down">
                ↓
              </Button>
            </div>
          </li>
        ))}
      </ol>
      <Button type="button">Confirm order</Button>
    </PromptShell>
  );
}