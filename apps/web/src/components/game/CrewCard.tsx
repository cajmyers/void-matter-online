import { ActionToken } from "./ActionToken";
import { ResourceCube } from "./ResourceCube";
import type { ActionTokenKind, ResourceId } from "./resources";
import { PlayingCardShell } from "./PlayingCardShell";
import { Typography } from "../Typography/Typography";
import styles from "./CrewCard.module.css";
import shellStyles from "./playingCardShell.module.css";

export interface CrewCardProps {
  readonly title: string;
  readonly text: string;
  readonly cost: readonly ResourceId[];
  readonly action: ActionTokenKind;
  readonly width?: number;
}

/** Ensign crew: one fixed officer action token (`ACT-1`). */
export function CrewCard({ title, text, cost, action, width = 156 }: CrewCardProps) {
  return (
    <PlayingCardShell rim="var(--palette-primary-light)" width={width} ariaLabel={`${title}, crew`}>
      <div className={styles.banner}>
        <Typography variant="overline" className={styles.rank}>
          Ensign
        </Typography>
        <ActionToken kind={action} size={26} />
      </div>
      <div className={shellStyles.titleBar}>
        <Typography variant="cardTitle">{title}</Typography>
      </div>
      <div className={shellStyles.body}>
        <Typography variant="cardText">{text}</Typography>
      </div>
      <div className={shellStyles.foot}>
        <span className={styles.cost}>
          {cost.map((resource, index) => (
            <ResourceCube key={`${resource}-${index}`} resource={resource} size={18} />
          ))}
        </span>
      </div>
    </PlayingCardShell>
  );
}
