import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { Typography } from "../Typography/Typography";
import { ZoneTabRail } from "./ZoneTabRail";
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
  purchasableTabIds,
}: {
  readonly tabs: readonly ZoneTabDockTab[];
  readonly defaultTabId: string;
  readonly heading?: string;
  /** Tabs the viewer may buy from at the current Nexus (`MAP-4`). Others stay visible but muted. */
  readonly purchasableTabIds?: readonly string[];
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
      <div className={styles.tabRailHost}>
        <ZoneTabRail
          tabs={tabs}
          activeTabId={active.id}
          onTabSelect={setActiveId}
          purchasableTabIds={purchasableTabIds}
          variant="dock"
        />
      </div>
      <div className={styles.panelHost} role="tabpanel" aria-label={active.ariaLabel}>
        {active.panel}
      </div>
    </div>
  );
}