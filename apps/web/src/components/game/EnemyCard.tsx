import { PlayingCardShell } from "./PlayingCardShell";
import { Typography } from "../Typography/Typography";
import styles from "./EnemyCard.module.css";
import shellStyles from "./playingCardShell.module.css";

export interface EnemyCardProps {
  readonly name: string;
  readonly tier: 1 | 2 | 3;
  readonly hull: number;
  readonly speed: number;
  readonly weapons: string;
  readonly special: string;
  readonly width?: number;
}

const tierLabels: Readonly<Record<EnemyCardProps["tier"], string>> = {
  1: "Level 1",
  2: "Tier 2",
  3: "Tier 3",
};

/** Iron Syndicate enemy ship (`DCK-3` reward stack size follows tier). */
export function EnemyCard({ name, tier, hull, speed, weapons, special, width = 156 }: EnemyCardProps) {
  const rewardWidth = width < 140 ? 28 : 36;
  return (
    <PlayingCardShell rim="var(--game-faction-iron)" width={width} ariaLabel={`${name}, enemy ship`}>
      <div className={styles.header}>
        <Typography variant="overline">{tierLabels[tier]}</Typography>
        <div className={styles.stats}>
          <Typography variant="cardFine" className={shellStyles.mono}>
            SPD {speed} · HUL {hull}
          </Typography>
        </div>
      </div>
      <div className={`${shellStyles.artBand} ${styles.art}`} />
      <div className={shellStyles.titleBar}>
        <Typography variant="cardTitle">{name}</Typography>
        <Typography variant="cardFine" className={shellStyles.mono}>
          {weapons}
        </Typography>
      </div>
      <div className={shellStyles.body}>
        <Typography variant="cardText">{special}</Typography>
      </div>
      <div className={shellStyles.foot}>
        <div className={styles.rewards} aria-label={`${tier} face-down reward cards`}>
          {Array.from({ length: tier }, (_, index) => (
            <div
              key={index}
              className={styles.rewardBack}
              style={{ width: rewardWidth, marginLeft: index === 0 ? 0 : -rewardWidth * 0.35 }}
              aria-hidden
            />
          ))}
          <Typography variant="cardFine" className={styles.rewardNote}>
            {tier} reward{tier === 1 ? "" : "s"}
          </Typography>
        </div>
      </div>
    </PlayingCardShell>
  );
}
