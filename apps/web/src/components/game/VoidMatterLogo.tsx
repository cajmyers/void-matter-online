import vmArt from "../../assets/icons/resources/vm.png";
import { Typography } from "../Typography/Typography";
import styles from "./VoidMatterLogo.module.css";

export interface VoidMatterLogoProps {
  /** Shorter mark for the play-table HUD. */
  readonly compact?: boolean;
}

/** Title treatment: VM star + wordmark. */
export function VoidMatterLogo({ compact = false }: VoidMatterLogoProps) {
  const markSize = compact ? 22 : 30;
  return (
    <div className={styles.logo} aria-label="Void Matter">
      <img src={vmArt} alt="" width={markSize} height={markSize} className={styles.mark} draggable={false} />
      <Typography variant={compact ? "subtitle2" : "h4"} as="span" className={styles.wordmark}>
        Void Matter
      </Typography>
    </div>
  );
}