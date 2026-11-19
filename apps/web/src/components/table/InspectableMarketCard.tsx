import type { ReactNode, MouseEvent } from "react";
import styles from "./InspectableMarketCard.module.css";

export function InspectableMarketCard({
  children,
  onInspect,
  label,
  fill = false,
}: {
  readonly children: ReactNode;
  readonly onInspect: () => void;
  readonly label: string;
  readonly fill?: boolean;
}) {
  const onContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onInspect();
  };

  const className = fill ? `${styles.wrap} ${styles.fill}` : styles.wrap;

  return (
    <div className={className} onContextMenu={onContextMenu} role="group" aria-label={label}>
      {children}
    </div>
  );
}