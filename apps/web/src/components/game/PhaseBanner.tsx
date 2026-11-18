import { FirstPlayerToken } from "./Markers";
import { Typography } from "../Typography/Typography";
import styles from "./PhaseBanner.module.css";

export type GamePhaseLabel = "Action" | "Maintenance";

export interface PhaseBannerProps {
  readonly gameRound: number;
  readonly phase: GamePhaseLabel;
  /** Maintenance step label when `phase` is Maintenance (e.g. "Enemy Combat"). */
  readonly maintenanceStep?: string;
  readonly showFirstPlayer?: boolean;
  /** Single-row layout for the play-table HUD. */
  readonly compact?: boolean;
}

export function PhaseBanner({
  gameRound,
  phase,
  maintenanceStep,
  showFirstPlayer = true,
  compact = false,
}: PhaseBannerProps) {
  const bannerClass = compact ? `${styles.banner} ${styles.bannerCompact}` : styles.banner;
  const blockClass = compact ? styles.blockInline : styles.block;
  const roundClass = compact ? `${styles.round} ${styles.roundCompact}` : styles.round;
  const phaseVariant = compact ? "subtitle2" : "h6";
  const phaseClass = compact ? `${styles.phase} ${styles.phaseCompact}` : styles.phase;

  return (
    <header className={bannerClass} aria-label={`Game round ${gameRound}, ${phase} phase`}>
      <div className={blockClass}>
        <Typography variant="overline" className={compact ? styles.inlineLabel : undefined}>
          game round
        </Typography>
        <Typography variant="numeric" className={roundClass}>
          {gameRound}
        </Typography>
      </div>
      <div className={compact ? `${styles.divider} ${styles.dividerCompact}` : styles.divider} aria-hidden />
      <div className={blockClass}>
        <Typography variant="overline" className={compact ? styles.inlineLabel : undefined}>
          Phase
        </Typography>
        <Typography variant={phaseVariant} className={phaseClass}>
          {phase}
        </Typography>
        {phase === "Maintenance" && maintenanceStep ? (
          <Typography variant="caption" className={compact ? `${styles.step} ${styles.stepInline}` : styles.step}>
            {compact ? `· ${maintenanceStep}` : maintenanceStep}
          </Typography>
        ) : null}
      </div>
      {!compact && showFirstPlayer ? (
        <>
          <div className={styles.divider} aria-hidden />
          <div className={styles.firstPlayer}>
            <FirstPlayerToken size={28} />
            <Typography variant="caption">First player</Typography>
          </div>
        </>
      ) : null}
    </header>
  );
}