import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { ZoneTabRail } from "../game/ZoneTabRail";
import type { ZoneTabDockTab } from "../game/ZoneTabDock";
import {
  galleryCrewCardsById,
  galleryMissionsById,
  gallerySectorAssetCardsByDeck,
} from "../../fixtures/zoneFixtures";
import type { GameView } from "../../view/gameView";
import type { MarketCardInspectTarget, MarketDiscardInspectTarget } from "../../view/marketCardInspect";
import { tableMarketsContext } from "../../view/tableMarketsContext";
import { buildMarketDockTabs, defaultMarketDockTab } from "./marketDockTabs";
import styles from "./TableMarketsDock.module.css";

export function TableMarketsDock({
  view,
  overlayHostRef,
  onInspectCard,
  onInspectDiscard,
}: {
  readonly view: Pick<GameView, "markets" | "map" | "ships" | "seatCount" | "viewerSeat">;
  readonly overlayHostRef: RefObject<HTMLElement | null>;
  readonly   onInspectCard?: (target: MarketCardInspectTarget) => void;
  onInspectDiscard?: (target: MarketDiscardInspectTarget) => void;
}) {
  const barRef = useRef<HTMLElement>(null);
  const context = useMemo(
    () => tableMarketsContext(view),
    [view.map, view.ships, view.seatCount, view.viewerSeat],
  );
  const tabs = useMemo(
    () =>
      buildMarketDockTabs(
        view.markets,
        {
          sectorByDeck: gallerySectorAssetCardsByDeck(),
          crewById: galleryCrewCardsById,
          missionsById: galleryMissionsById,
        },
        onInspectCard,
        onInspectDiscard,
      ),
    [view.markets, onInspectCard, onInspectDiscard],
  );
  const defaultTabId = defaultMarketDockTab(context.purchasableTabIds);
  const [marketsOpen, setMarketsOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabId);
  const panelRef = useRef<HTMLDivElement>(null);
  const ignoreCloseUntil = useRef(0);

  const closeMarkets = useCallback(() => setMarketsOpen(false), []);

  const onTabSelect = useCallback(
    (tabId: string) => {
      if (marketsOpen && tabId === activeTabId) {
        setMarketsOpen(false);
        return;
      }
      ignoreCloseUntil.current = performance.now() + 250;
      setActiveTabId(tabId);
      setMarketsOpen(true);
    },
    [activeTabId, marketsOpen],
  );

  const active = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
  const overlayHost = overlayHostRef.current;

  useEffect(() => {
    if (!marketsOpen) return;
    ignoreCloseUntil.current = performance.now() + 250;
  }, [marketsOpen, activeTabId]);

  useEffect(() => {
    if (!marketsOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMarkets();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMarkets, marketsOpen]);

  useEffect(() => {
    if (!marketsOpen) return;
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
      closeMarkets();
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [closeMarkets, marketsOpen]);

  return (
    <section ref={barRef} className={styles.bar} aria-label="Markets">
      <div className={styles.navRow}>
        <ZoneTabRail
          tabs={tabs}
          activeTabId={marketsOpen ? (active?.id ?? defaultTabId) : ""}
          onTabSelect={onTabSelect}
          variant="toolbar"
        />
      </div>
      {marketsOpen && active && overlayHost
        ? createPortal(<MarketPanelOverlay tab={active} panelRef={panelRef} />, overlayHost)
        : null}
    </section>
  );
}

function MarketPanelOverlay({
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