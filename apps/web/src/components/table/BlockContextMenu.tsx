import type { MouseEvent, ReactNode } from "react";
import styles from "./BlockContextMenu.module.css";

/** Swallow right-click (e.g. hidden-order deck backs). */
export function BlockContextMenu({ children }: { readonly children: ReactNode }) {
  const onContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <div className={styles.wrap} onContextMenu={onContextMenu}>
      {children}
    </div>
  );
}