import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { ZoneTabRail } from "../game/ZoneTabRail";
import type { ZoneTabDockTab } from "../game/ZoneTabDock";
import { galleryCrewCardsById } from "../../fixtures/zoneFixtures";
import type { ViewerFleetView } from "../../view/fleetView";
import type { TableCardInspectTarget } from "../../view/marketCardInspect";
import { buildFleetDockTabs, defaultFleetDockTab } from "./fleetDockTabs";
import styles from "./TableFleetDock.module.css";

export function TableFleetDock({
  fleet,
  overlayHostRef,
  onActiveShip,
  onInspectCard,
  onRequestClosePeer,
  externalCloseSignal,
}: {
  readonly fleet: ViewerFleetView;
  readonly overlayHostRef: RefObject<HTMLElement | null>;
  readonly onActiveShip: (instanceId: string) => void;
  readonly onInspectCard?: (target: TableCardInspectTarget) => void;
  /** Markets dock bumps this when a market tab opens so the fleet overlay closes. */
  readonly externalCloseSignal?: number;
  readonly onRequestClosePeer?: () => void;
}) {
  const barRef = useRef<HTMLElement>(null);
  const tabs = useMemo(
    () => buildFleetDockTabs(fleet, galleryCrewCardsById, onInspectCard),
    [fleet, onInspectCard],
  );
  const defaultTabId = defaultFleetDockTab(fleet);
  const [fleetOpen, setFleetOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabId);
  const panelRef = useRef<HTMLDivElement>(null);
  const ignoreCloseUntil = useRef(0);

  const closeFleet = useCallback(() => setFleetOpen(false), []);

  const onTabSelect = useCallback(
    (tabId: string) => {
      if (fleetOpen && tabId === activeTabId) {
        setFleetOpen(false);
        return;
      }
      onRequestClosePeer?.();
      ignoreCloseUntil.current = performance.now() + 250;
      setActiveTabId(tabId);
      onActiveShip(tabId);
      setFleetOpen(true);
    },
    [activeTabId, fleetOpen, onActiveShip, onRequestClosePeer],
  );

  useEffect(() => {
    if (externalCloseSignal === undefined || externalCloseSignal === 0) {
      return;
    }
    closeFleet();
  }, [closeFleet, externalCloseSignal]);

  const active = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
  const overlayHost = overlayHostRef.current;

  useEffect(() => {
    if (!fleetOpen) return;
    ignoreCloseUntil.current = performance.now() + 250;
  }, [fleetOpen, activeTabId]);

  useEffect(() => {
    if (!fleetOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeFleet();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeFleet, fleetOpen]);

  useEffect(() => {
    if (!fleetOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (performance.now() < ignoreCloseUntil.current) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      const panel = panelRef.current;
      if (panel?.contains(target)) return;
      if (barRef.current?.contains(target)) return;
      if (target instanceof Element) {
        if (
          target.closest("[data-market-card-inspector]") ||
          target.closest("[data-market-discard-inspector]") ||
          target.closest("[data-map-hex-inspector]")
        ) {
          return;
        }
      }
      closeFleet();
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [closeFleet, fleetOpen]);

  return (
    <section
      ref={barRef}
      className={styles.bar}
      data-table-fleet-dock="true"
      aria-label="Your fleet"
    >
      <div className={styles.navRow}>
        <ZoneTabRail
          tabs={tabs}
          activeTabId={fleetOpen ? (active?.id ?? defaultTabId) : ""}
          onTabSelect={onTabSelect}
          variant="toolbar"
          ariaLabel="Fleet ships"
        />
      </div>
      {fleetOpen && active && overlayHost
        ? createPortal(<FleetPanelOverlay tab={active} panelRef={panelRef} />, overlayHost)
        : null}
    </section>
  );
}

function FleetPanelOverlay({
  tab,
  panelRef,
}: {
  readonly tab: ZoneTabDockTab;
  readonly panelRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className={styles.overlayRoot} aria-hidden={false}>
      <div
        ref={panelRef}
        className={styles.floatingPanel}
        data-block-board-wheel="true"
        role="tabpanel"
        aria-label={tab.ariaLabel}
      >
        {tab.panel}
      </div>
    </div>
  );
}