import { Button } from "../Button/Button";
import { Typography } from "../Typography/Typography";
import styles from "./UndoControl.module.css";

export interface UndoControlProps {
  /** Locked for the rest of the turn after hidden reveal or dice (`UX-2`). */
  readonly locked: boolean;
  readonly onUndo?: () => void;
}

export function UndoControl({ locked, onUndo }: UndoControlProps) {
  return (
    <div className={styles.wrap}>
      <Button variant="outlined" disabled={locked} onClick={onUndo} aria-describedby={locked ? "undo-lock-hint" : undefined}>
        Undo
      </Button>
      {locked ? (
        <span id="undo-lock-hint">
          <Typography variant="caption" className={styles.hint}>
            Undo locked: hidden information was revealed or dice were rolled this turn (`UX-2`).
          </Typography>
        </span>
      ) : (
        <Typography variant="caption" className={styles.hint}>
          Last commit-point action only (`UX-1`).
        </Typography>
      )}
    </div>
  );
}