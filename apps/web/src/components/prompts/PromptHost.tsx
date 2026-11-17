import type { ReactNode } from "react";
import type { PromptKind } from "./promptKinds";

/** Gallery/table router placeholder: maps `kind` to a prompt host component once `GameView.pending` exists. */
export interface PromptHostProps {
  readonly kind: PromptKind;
  readonly render: (kind: PromptKind) => ReactNode;
}

export function PromptHost({ kind, render }: PromptHostProps) {
  return <>{render(kind)}</>;
}