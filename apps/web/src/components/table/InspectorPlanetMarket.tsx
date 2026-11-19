import { DamageCube } from "../game/HullTrack";
import { Typography } from "../Typography/Typography";
import styles from "./InspectorPlanetMarket.module.css";

const inspectorLockCubeSize = 18;

export function InspectorPlanetMarket({
  state,
  lockCount = 0,
}: {
  readonly state: "available" | "blocked";
  readonly lockCount?: number;
}) {
  if (state === "available") {
    return (
      <Typography variant="body2" className={styles.available}>
        Available
      </Typography>
    );
  }
  const count = Math.max(0, lockCount);
  return (
    <span className={styles.row}>
      <Typography variant="body2" className={styles.blocked}>
        Blocked
      </Typography>
      {count > 0 ? (
        <>
          <span className={styles.locks} aria-hidden="true">
            {Array.from({ length: count }, (_, index) => (
              <DamageCube key={index} size={inspectorLockCubeSize} />
            ))}
          </span>
          <span className={styles.srOnly}>
            {count} damage cube{count === 1 ? "" : "s"}
          </span>
        </>
      ) : null}
    </span>
  );
}