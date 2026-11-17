import type { ReactNode } from "react";
import { Typography } from "../Typography/Typography";
import { PromptShell } from "./PromptShell";
import shared from "./promptShared.module.css";

export interface PickOnePromptProps {
  readonly title: string;
  readonly headline: string;
  readonly lead?: string;
  readonly children: ReactNode;
  readonly selectedIndex?: number;
}

/** 3 — Pick one of N (card, market row, mission, crew, enemy target). */
export function PickOnePrompt({ title, headline, lead, children, selectedIndex = 0 }: PickOnePromptProps) {
  return (
    <PromptShell title={title} headline={headline} lead={lead}>
      <div className={shared.cardRow} role="listbox" aria-label={headline}>
        {children}
      </div>
      <Typography variant="caption">Selected option {selectedIndex + 1}. Tap another to change.</Typography>
    </PromptShell>
  );
}

export function SelectablePromptCard({
  children,
  selected = false,
  label,
}: {
  readonly children: ReactNode;
  readonly selected?: boolean;
  readonly label: string;
}) {
  return (
    <button
      type="button"
      className={shared.selectableCard}
      data-selected={selected}
      aria-label={label}
      aria-pressed={selected}
    >
      {children}
    </button>
  );
}