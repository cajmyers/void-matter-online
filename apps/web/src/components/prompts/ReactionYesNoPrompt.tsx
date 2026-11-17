import { Button } from "../Button/Button";
import { ResourceCube } from "../game/ResourceCube";
import type { ResourceId } from "../game/resources";
import { Typography } from "../Typography/Typography";
import { Exchange3For1Notice } from "./Exchange3For1Notice";
import { PromptShell } from "./PromptShell";
import shared from "./promptShared.module.css";

export interface ReactionYesNoPromptProps {
  readonly reactionName: string;
  readonly trigger: string;
  readonly cost: readonly ResourceId[];
  /** When set, show the 3-for-1 exchange path (`LOT-1`). */
  readonly exchange?: { readonly need: ResourceId; readonly substitute: ResourceId };
}

/** 2 — Yes/no reaction with cost; exchange only when the exact resource is missing. */
export function ReactionYesNoPrompt({ reactionName, trigger, cost, exchange }: ReactionYesNoPromptProps) {
  return (
    <PromptShell title="Reaction" headline={reactionName} lead={trigger}>
      <div className={shared.costRow}>
        <Typography variant="caption">Cost</Typography>
        {cost.map((resource, index) => (
          <ResourceCube key={`${resource}-${index}`} resource={resource} size={26} />
        ))}
      </div>
      {exchange ? <Exchange3For1Notice need={exchange.need} substitute={exchange.substitute} /> : null}
      <div className={shared.actions}>
        <Button type="button">Yes</Button>
        <Button type="button" variant="outlined">
          No
        </Button>
      </div>
    </PromptShell>
  );
}