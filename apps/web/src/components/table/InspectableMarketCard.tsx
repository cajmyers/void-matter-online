import type { ReactNode, MouseEvent } from "react";
import styles from "./InspectableMarketCard.module.css";

export function InspectableMarketCard({
  children,
  onInspect,
  label,
}: {
  readonly children: ReactNode;
  readonly onInspect: () => void;
  readonly label: string;
}) {
  const onContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onInspect();
  };

  return (
    <div className={styles.wrap} onContextMenu={onContextMenu} role="group" aria-label={label}>
      {children}
    </div>
  );
}