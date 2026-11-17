import type { ReactNode } from "react";
import { Button } from "../Button/Button";
import { PromptShell } from "./PromptShell";
import shared from "./promptShared.module.css";

export interface ConfirmAbandonPromptProps {
  readonly title?: string;
  readonly headline: string;
  readonly lead?: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly preview?: ReactNode;
  readonly destructive?: boolean;
}

/** 14 — Confirm or abandon (mission abandon, risky trade, leave combat, etc.). */
export function ConfirmAbandonPrompt({
  title = "Confirm",
  headline,
  lead,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  preview,
  destructive = false,
}: ConfirmAbandonPromptProps) {
  return (
    <PromptShell title={title} headline={headline} lead={lead}>
      {preview ? <div className={shared.cardRow}>{preview}</div> : null}
      <div className={shared.actions}>
        <Button type="button" colour={destructive ? "error" : "primary"}>
          {confirmLabel}
        </Button>
        <Button type="button" variant="outlined">
          {cancelLabel}
        </Button>
      </div>
    </PromptShell>
  );
}