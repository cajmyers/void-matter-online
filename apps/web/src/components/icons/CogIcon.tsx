import settingsCogUrl from "../../assets/icons/settings-cog.png";
import styles from "./CogIcon.module.css";

export interface CogIconProps {
  readonly size?: number;
  readonly className?: string;
}

/** Settings / game menu cog — save, exit, options (`implementation-plan.md` §5.3). */
export function CogIcon({ size = 20, className }: CogIconProps) {
  const classes = className ? `${styles.icon} ${className}` : styles.icon;
  return (
    <img
      src={settingsCogUrl}
      width={size}
      height={size}
      className={classes}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}