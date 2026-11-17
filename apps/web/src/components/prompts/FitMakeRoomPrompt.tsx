import type { ReactNode } from "react";
import { Button } from "../Button/Button";
import { Typography } from "../Typography/Typography";
import { PromptShell } from "./PromptShell";
import shared from "./promptShared.module.css";

export interface FitMakeRoomSlot {
  readonly label: string;
  readonly preview: ReactNode;
}

export interface FitMakeRoomPromptProps {
  readonly headline: string;
  readonly lead?: string;
  readonly incomingLabel: string;
  readonly slots: readonly FitMakeRoomSlot[];
}

/** 13 — Discard installed component, crew, or cargo to make room (`LOT-5`). */
export function FitMakeRoomPrompt({
  headline,
  lead = "Install the new card by discarding something from the ship, or cancel.",
  incomingLabel,
  slots,
}: FitMakeRoomPromptProps) {
  return (
    <PromptShell title="Make room" headline={headline} lead={lead}>
      <Typography variant="caption">Installing: {incomingLabel}</Typography>
      <div className={shared.slotList}>
        {slots.map((slot) => (
          <div key={slot.label} className={shared.slotRow}>
            {slot.preview}
            <Button type="button" variant="outlined">
              Discard {slot.label}
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="text">
        Cancel install
      </Button>
    </PromptShell>
  );
}