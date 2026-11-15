import { PlayingCardShell } from "./PlayingCardShell";
import { Typography } from "../Typography/Typography";
import styles from "./MissionCard.module.css";
import shellStyles from "./playingCardShell.module.css";

export interface MissionCardProps {
  readonly title: string;
  readonly text: string;
  /** Void Matter granted when redeemed (never spent). */
  readonly voidMatter: number;
  readonly complete?: boolean;
  readonly width?: number;
}

export function MissionCard({ title, text, voidMatter, complete = false, width = 156 }: MissionCardProps) {
  return (
    <PlayingCardShell rim="var(--palette-primary-main)" width={width} ariaLabel={`${title}, mission`}>
      <div className={styles.vmBand}>
        <Typography variant="overline">Void Matter</Typography>
        <div className={styles.vmSide}>
          <Typography variant="numeric" className={styles.vm}>
            {voidMatter}
          </Typography>
          {complete ? (
            <span className={styles.completeBadge} aria-label="Complete">
              ✓
            </span>
          ) : null}
        </div>
        {complete ? null : (
          <span className={styles.progress} role="img" aria-label="In progress">
            <span className={styles.progressFill} />
          </span>
        )}
      </div>
      <div className={shellStyles.titleBar}>
        <Typography variant="cardTitle">{title}</Typography>
      </div>
      <div className={shellStyles.body}>
        <Typography variant="cardText">{text}</Typography>
      </div>
      <div className={shellStyles.foot}>
        <Typography variant="cardFine">{complete ? "Ready to redeem" : "In progress"}</Typography>
      </div>
    </PlayingCardShell>
  );
}
