import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { Typography } from "../Typography/Typography";
import styles from "./ZoneTabDock.module.css";

export interface ZoneTabDockTab {
  readonly id: string;
  readonly shortLabel: string;
  readonly ariaLabel: string;
  readonly rim: string;
  readonly panel: ReactNode;
}

/** Horizontal tabs over the active market zone (left column on the table, `implementation-plan.md` §5.3). */
export function ZoneTabDock({
  tabs,
  defaultTabId,
  heading = "Markets",
}: {
  readonly tabs: readonly ZoneTabDockTab[];
  readonly defaultTabId: string;
  readonly heading?: string;
}) {
  const [activeId, setActiveId] = useState(defaultTabId);
  const groupId = useId();
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  if (!active) {
    return null;
  }

  const dockStyle = { "--dock-rim": active.rim } as CSSProperties;

  return (
    <div className={styles.dock} style={dockStyle} role="region" aria-labelledby={groupId}>
      <div id={groupId} className={styles.heading}>
        <Typography variant="overline">{heading}</Typography>
      </div>
      <div className={styles.tabRail} role="tablist" aria-label="Market zones">
        {tabs.map((tab) => {
          const selected = tab.id === active.id;
          const tabStyle = { "--tab-rim": tab.rim } as CSSProperties;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={tab.ariaLabel}
              className={selected ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              style={tabStyle}
              onClick={() => setActiveId(tab.id)}
            >
              {tab.shortLabel}
            </button>
          );
        })}
      </div>
      <div className={styles.panelHost} role="tabpanel" aria-label={active.ariaLabel}>
        {active.panel}
      </div>
    </div>
  );
}