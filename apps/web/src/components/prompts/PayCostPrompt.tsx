import { Button } from "../Button/Button";
import { ResourceCube } from "../game/ResourceCube";
import type { ResourceId } from "../game/resources";
import { Typography } from "../Typography/Typography";
import { Exchange3For1Notice } from "./Exchange3For1Notice";
import { PromptShell } from "./PromptShell";
import shared from "./promptShared.module.css";

export interface PayCostPromptProps {
  readonly headline: string;
  readonly lead?: string;
  readonly payments: readonly { readonly resource: ResourceId; readonly count: number }[];
  readonly exchange?: { readonly need: ResourceId; readonly substitute: ResourceId };
}

/** 9 — Pay a cost; 3-for-1 when exact resources are missing. */
export function PayCostPrompt({ headline, lead, payments, exchange }: PayCostPromptProps) {
  return (
    <PromptShell title="Pay cost" headline={headline} lead={lead}>
      <div className={shared.costRow}>
        <Typography variant="caption">Pay</Typography>
        {payments.map(({ resource, count }) => (
          <span key={resource} className={shared.actionRow}>
            <ResourceCube resource={resource} size={26} />
            {count > 1 ? <Typography variant="numeric">×{count}</Typography> : null}
          </span>
        ))}
      </div>
      {exchange ? <Exchange3For1Notice need={exchange.need} substitute={exchange.substitute} /> : null}
      <div className={shared.actions}>
        <Button type="button">Pay</Button>
        <Button type="button" variant="text">
          Cancel
        </Button>
      </div>
    </PromptShell>
  );
}