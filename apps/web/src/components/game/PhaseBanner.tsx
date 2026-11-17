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
}

export function PhaseBanner({ gameRound, phase, maintenanceStep, showFirstPlayer = true }: PhaseBannerProps) {
  return (
    <header className={styles.banner} aria-label={`Game round ${gameRound}, ${phase} phase`}>
      <div className={styles.block}>
        <Typography variant="overline">game round</Typography>
        <Typography variant="numeric" className={styles.round}>
          {gameRound}
        </Typography>
      </div>
      <div className={styles.divider} aria-hidden />
      <div className={styles.block}>
        <Typography variant="overline">Phase</Typography>
        <Typography variant="h6" className={styles.phase}>
          {phase}
        </Typography>
        {phase === "Maintenance" && maintenanceStep ? (
          <Typography variant="caption" className={styles.step}>
            {maintenanceStep}
          </Typography>
        ) : null}
      </div>
      {showFirstPlayer ? (
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