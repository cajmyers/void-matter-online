import { useState } from "react";
import { Button } from "../../../components/Button/Button";
import { ResourceCube } from "../../../components/game/ResourceCube";
import { Typography } from "../../../components/Typography/Typography";
import styles from "./StylePage.module.css";

const spacings = ["0-5", "1", "1-5", "2", "3", "4", "5", "6", "8"] as const;
const shadows = [0, 1, 2, 3, 4, 5] as const;
const durations = [
  "transitions-duration-shortest",
  "transitions-duration-short",
  "transitions-duration-standard",
  "transitions-duration-complex",
  "motion-card-move",
  "motion-tile-flip",
  "motion-dice-throw",
] as const;
const speeds = ["0.5", "1", "2"] as const;

export function SpacingMotionSection() {
  const [replay, setReplay] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [speed, setSpeed] = useState<(typeof speeds)[number]>("1");

  function changeSpeed(next: (typeof speeds)[number]) {
    setSpeed(next);
    document.documentElement.style.setProperty("--motion-speed", next);
    setReplay((count) => count + 1);
  }

  return (
    <section className={styles.section} id="spacing-motion">
      <Typography variant="h3">Spacing, shape, elevation and motion</Typography>

      <Typography variant="overline">Spacing (8px unit, half steps for dense UI)</Typography>
      <div className={styles.spacingList}>
        {spacings.map((step) => (
          <div key={step} className={styles.spacingRow}>
            <code className={styles.typeName}>--spacing-{step}</code>
            <div className={styles.spacingBar} style={{ width: `var(--spacing-${step})` }} />
          </div>
        ))}
      </div>

      <Typography variant="overline">Shape</Typography>
      <div className={styles.itemRow}>
        {(["sm", "", "lg"] as const).map((size) => {
          const variable = size === "" ? "--shape-border-radius" : `--shape-border-radius-${size}`;
          return (
            <div key={size} className={styles.item}>
              <div className={styles.radiusBox} style={{ borderRadius: `var(${variable})` }} />
              <code className={styles.typeName}>{variable}</code>
            </div>
          );
        })}
      </div>

      <Typography variant="overline">Elevation and glow</Typography>
      <div className={styles.itemRow}>
        {shadows.map((level) => (
          <div key={level} className={styles.item}>
            <div className={styles.shadowBox} style={{ boxShadow: `var(--shadow-${level})` }} />
            <code className={styles.typeName}>--shadow-{level}</code>
          </div>
        ))}
        <div className={styles.item}>
          <div className={styles.shadowBox} style={{ boxShadow: "var(--glow-primary)" }} />
          <code className={styles.typeName}>--glow-primary</code>
        </div>
        <div className={styles.item}>
          <div className={styles.shadowBox} style={{ boxShadow: "var(--glow-primary-strong)" }} />
          <code className={styles.typeName}>--glow-primary-strong</code>
        </div>
      </div>

      <Typography variant="overline">Motion</Typography>
      <div className={styles.controlRow}>
        <Button variant="outlined" onClick={() => setReplay((count) => count + 1)}>
          Replay
        </Button>
        <Typography variant="caption">Speed multiplier (the animation director owns this later):</Typography>
        {speeds.map((option) => (
          <Button key={option} variant={option === speed ? "contained" : "text"} onClick={() => changeSpeed(option)}>
            {option}x
          </Button>
        ))}
      </div>
      <div className={styles.motionList}>
        {durations.map((name) => (
          <div key={`${name}-${replay}`} className={styles.motionRow}>
            <code className={styles.typeName}>--{name}</code>
            <div className={styles.motionTrack}>
              <div className={styles.motionDot} style={{ animationDuration: `var(--${name})` }} />
            </div>
          </div>
        ))}
      </div>

      <Typography variant="overline">Tile flip (click)</Typography>
      <button type="button" className={styles.flipScene} onClick={() => setFlipped((value) => !value)} aria-pressed={flipped}>
        <span className={flipped ? `${styles.flipper} ${styles.flipperFlipped}` : styles.flipper}>
          <span className={`${styles.flipFace} ${styles.flipBack}`}>
            <span className={styles.flipQuestion}>?</span>
          </span>
          <span className={`${styles.flipFace} ${styles.flipFront}`}>
            <ResourceCube resource="h3" size={22} />
            <ResourceCube resource="tc" size={22} hollow />
          </span>
        </span>
      </button>
    </section>
  );
}
