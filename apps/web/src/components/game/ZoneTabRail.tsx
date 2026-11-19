import type { CSSProperties } from "react";
import type { ZoneTabDockTab } from "./ZoneTabDock";
import styles from "./ZoneTabRail.module.css";

export function ZoneTabRail({
  tabs,
  activeTabId,
  onTabSelect,
  purchasableTabIds,
  variant = "dock",
  ariaLabel = "Market zones",
}: {
  readonly tabs: readonly ZoneTabDockTab[];
  readonly activeTabId: string;
  readonly onTabSelect: (tabId: string) => void;
  readonly purchasableTabIds?: readonly string[];
  readonly variant?: "dock" | "toolbar";
  readonly ariaLabel?: string;
}) {
  const active = tabs.find((tab) => tab.id === activeTabId);
  const railClass = variant === "toolbar" ? `${styles.tabRail} ${styles.tabRailToolbar}` : styles.tabRail;
  const dockRim = active?.rim ?? "var(--palette-divider)";
  const railStyle =
    variant === "dock" ? ({ "--dock-rim": dockRim } as CSSProperties) : ({ "--dock-rim": dockRim } as CSSProperties);

  return (
    <div className={railClass} style={railStyle} role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => {
        const selected = tab.id === activeTabId;
        const purchasable =
          purchasableTabIds === undefined || purchasableTabIds.length === 0
            ? true
            : purchasableTabIds.includes(tab.id);
        const tabStyle = { "--tab-rim": tab.rim } as CSSProperties;
        const className = [
          styles.tab,
          variant === "toolbar" ? styles.tabToolbar : "",
          selected ? styles.tabActive : "",
          variant === "toolbar" && selected ? styles.tabToolbarActive : "",
          !purchasable ? styles.tabMuted : "",
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={tab.ariaLabel}
            aria-disabled={purchasable ? undefined : true}
            className={className}
            style={tabStyle}
            onClick={() => onTabSelect(tab.id)}
          >
            {variant === "toolbar" ? tab.ariaLabel : tab.shortLabel}
          </button>
        );
      })}
    </div>
  );
}