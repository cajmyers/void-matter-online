import { Button } from "../Button/Button";
import { Typography } from "../Typography/Typography";
import type { SeatNumber } from "../game/resources";
import { PromptShell } from "./PromptShell";
import shared from "./promptShared.module.css";

export interface RetreatDeclaration {
  readonly seat: SeatNumber;
  readonly label: string;
  readonly status: "declared" | "pending" | "you";
  readonly detail?: string;
}

export interface DeclareRetreatPromptProps {
  readonly headline: string;
  readonly lead?: string;
  readonly declarations: readonly RetreatDeclaration[];
}

/** 12 — Declare retreat (`CMB-6`); later seats see earlier declarations. */
export function DeclareRetreatPrompt({
  headline,
  lead = "Each player declares in seating order. You see declarations already made.",
  declarations,
}: DeclareRetreatPromptProps) {
  return (
    <PromptShell title="Declare retreat" headline={headline} lead={lead}>
      <div className={shared.retreatList}>
        {declarations.map((row) => (
          <div key={row.seat} className={shared.retreatRow}>
            <Typography variant="body2">
              Seat {row.seat} — {row.label}
            </Typography>
            <Typography variant="caption">
              {row.status === "declared"
                ? row.detail ?? "Declared"
                : row.status === "pending"
                  ? "Waiting…"
                  : "Your choice"}
            </Typography>
          </div>
        ))}
      </div>
      <div className={shared.actions}>
        <Button type="button">Retreat</Button>
        <Button type="button" variant="outlined">
          Hold position
        </Button>
      </div>
    </PromptShell>
  );
}