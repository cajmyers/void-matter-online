import { useEffect, useState } from "react";
import { Button } from "../Button/Button";
import { Typography } from "../Typography/Typography";
import styles from "./PlaybackControls.module.css";

const speedOptions = ["0.5", "1", "2"] as const;
type SpeedOption = (typeof speedOptions)[number];

export interface PlaybackControlsProps {
  /** When true, updates `--motion-speed` on `documentElement` (gallery demo). */
  readonly applyGlobalSpeed?: boolean;
}

export function PlaybackControls({ applyGlobalSpeed = false }: PlaybackControlsProps) {
  const [speed, setSpeed] = useState<SpeedOption>("1");
  const [skipping, setSkipping] = useState(false);

  useEffect(() => {
    if (!applyGlobalSpeed) {
      return undefined;
    }
    const previous = document.documentElement.style.getPropertyValue("--motion-speed") || "1";
    document.documentElement.style.setProperty("--motion-speed", speed);
    return () => {
      document.documentElement.style.setProperty("--motion-speed", previous);
    };
  }, [applyGlobalSpeed, speed]);

  return (
    <div className={styles.wrap}>
      <Typography variant="overline">Animation speed</Typography>
      <div className={styles.row}>
        {speedOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={option === speed ? `${styles.speedBtn} ${styles.speedBtnActive}` : styles.speedBtn}
            aria-pressed={option === speed}
            onClick={() => setSpeed(option)}
          >
            {option}×
          </button>
        ))}
      </div>
      <Button
        variant="outlined"
        colour="secondary"
        onClick={() => setSkipping((value) => !value)}
        aria-pressed={skipping}
      >
        {skipping ? "Resume animations" : "Skip animations"}
      </Button>
      <Typography variant="caption" className={styles.hint}>
        Director shell in Stage 1e; skip finishes pending tweens instantly.
      </Typography>
    </div>
  );
}