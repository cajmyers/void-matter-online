import { Button } from "../Button/Button";
import { ResourceCube } from "../game/ResourceCube";
import type { ResourceId } from "../game/resources";
import { Typography } from "../Typography/Typography";
import { PromptShell } from "./PromptShell";
import shared from "./promptShared.module.css";

const pickableResources: readonly ResourceId[] = ["tc", "h3", "pc", "qp"];

export interface ChooseResourcesPromptProps {
  readonly headline: string;
  readonly lead: string;
  readonly picksRequired: number;
  readonly picksChosen?: readonly { readonly resource: ResourceId; readonly count: number }[];
}

/** 10 — Choose resources of choice (`LOT-2`, Black Market, Commerce Guild). */
export function ChooseResourcesPrompt({
  headline,
  lead,
  picksRequired,
  picksChosen = [{ resource: "h3", count: 1 }],
}: ChooseResourcesPromptProps) {
  const chosenTotal = picksChosen.reduce((sum, row) => sum + row.count, 0);

  return (
    <PromptShell title="Choose resources" headline={headline} lead={lead}>
      <div className={shared.resourcePickGrid}>
        {pickableResources.map((resource) => (
          <div key={resource} className={shared.resourcePickCell}>
            <ResourceCube resource={resource} size={32} />
            <div className={shared.stepper}>
              <Button type="button" variant="outlined" aria-label={`Less ${resource}`}>
                −
              </Button>
              <Typography variant="numeric">0</Typography>
              <Button type="button" variant="outlined" aria-label={`More ${resource}`}>
                +
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Typography variant="caption">
        Chosen {chosenTotal} / {picksRequired}.{" "}
        {picksChosen.map((row) => `${row.count}× ${row.resource.toUpperCase()}`).join(", ")}
      </Typography>
      <Button type="button" disabled={chosenTotal !== picksRequired}>
        Confirm picks
      </Button>
    </PromptShell>
  );
}