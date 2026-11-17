import type { ReactNode } from "react";
import { Panel } from "../Panel/Panel";
import { Typography } from "../Typography/Typography";
import styles from "./PromptShell.module.css";

export interface PromptShellProps {
  readonly title: string;
  readonly headline: string;
  readonly lead?: string;
  readonly hint?: string;
  readonly children: ReactNode;
}

/** Docked prompt chrome for the table (`implementation-plan.md` §5.3). Fixtures set copy only. */
export function PromptShell({ title, headline, lead, hint, children }: PromptShellProps) {
  return (
    <Panel title={title} className={styles.shell}>
      <div className={styles.body}>
        <Typography variant="h5" className={styles.headline}>
          {headline}
        </Typography>
        {lead ? (
          <Typography variant="body2" className={styles.lead}>
            {lead}
          </Typography>
        ) : null}
        {children}
        {hint ? (
          <Typography variant="caption" className={styles.hint}>
            {hint}
          </Typography>
        ) : null}
      </div>
    </Panel>
  );
}