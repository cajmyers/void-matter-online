import { PlayingCardShell } from "./PlayingCardShell";
import { Typography } from "../Typography/Typography";
import styles from "./ShipCard.module.css";
import shellStyles from "./playingCardShell.module.css";

export interface ShipCardProps {
  readonly name: string;
  readonly subtitle: string;
  readonly speed: number;
  readonly hull: number;
  readonly crew: number;
  readonly cargo: number;
  /** Installed halves per slot (`SLT-1`). Length must be 4. */
  readonly slotFill: readonly [number, number, number, number];
  readonly width?: number;
}

function HalfSlot({ active, height }: { readonly active: boolean; readonly height: number }) {
  return <div className={active ? `${styles.half} ${styles.halfOn}` : styles.half} style={{ height }} />;
}

function SlotTrack({ filled, width }: { readonly filled: number; readonly width: number }) {
  const half = Math.max(6, Math.round(width * 0.04));
  return (
    <div className={styles.slot} style={{ height: half * 2 + 6 }}>
      <HalfSlot active={filled >= 1} height={half} />
      <HalfSlot active={filled >= 2} height={half} />
    </div>
  );
}

/** Player ship card: stats and four half-counted upgrade slots. */
export function ShipCard({ name, subtitle, speed, hull, crew, cargo, slotFill, width = 156 }: ShipCardProps) {
  return (
    <PlayingCardShell rim="var(--game-seat-1)" width={width} ariaLabel={`${name}, ship card`}>
      <div className={styles.shipBand}>
        <Typography variant="overline">{subtitle}</Typography>
        <Typography variant="cardFine" className={shellStyles.mono}>
          SPD {speed} · HUL {hull} · CRW {crew} · CGO {cargo}
        </Typography>
      </div>
      <div className={`${shellStyles.artBand} ${styles.art}`} />
      <div className={shellStyles.titleBar}>
        <Typography variant="cardTitle">{name}</Typography>
      </div>
      <div className={shellStyles.body}>
        <Typography variant="cardFine" className={styles.slotLabel}>
          Slots (halves)
        </Typography>
        <div className={styles.slotRow}>
          {slotFill.map((filled, index) => (
            <SlotTrack key={index} filled={filled} width={width} />
          ))}
        </div>
      </div>
    </PlayingCardShell>
  );
}
