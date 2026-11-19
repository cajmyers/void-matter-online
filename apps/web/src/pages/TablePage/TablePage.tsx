import { useCallback, useRef, useState } from "react";
import { HexDefs } from "../../components/hex/HexTile";
import { PhaseBanner } from "../../components/game/PhaseBanner";
import { VoidMatterLogo } from "../../components/game/VoidMatterLogo";
import { VmTrackerRow } from "../../components/game/VmTrackerRow";
import { SpaceBackdrop } from "../../components/game/SpaceBackdrop";
import { BoardViewport } from "../../components/table/BoardViewport";
import { GameBoard } from "../../components/table/GameBoard";
import { MapHexInspector } from "../../components/table/MapHexInspector";
import { MarketCardInspector } from "../../components/table/MarketCardInspector";
import { MarketDiscardInspector } from "../../components/table/MarketDiscardInspector";
import { TableFleetDock } from "../../components/table/TableFleetDock";
import { TableMarketsDock } from "../../components/table/TableMarketsDock";
import type { MapHexView } from "../../view/mapView";
import type { MarketDiscardInspectTarget, TableCardInspectTarget } from "../../view/marketCardInspect";
import { Typography } from "../../components/Typography/Typography";
import { devPagesEnabled } from "../../app/devPages";
import { DevPagesMenu } from "../../app/DevPagesMenu";
import { appNavLinks } from "../../app/navLinks";
import { useHashRoute } from "../../app/useHashRoute";
import { midGame4SeatView } from "../../fixtures/scenarios/midGame4Seat";
import type { SeatPublicView } from "../../view/gameView";
import styles from "./TablePage.module.css";

function vmTrackerSeats(
  seats: readonly SeatPublicView[],
  activeSeat: number,
  firstPlayerSeat: number,
) {
  return seats.map((row) => ({
    seat: row.seat,
    label: row.label,
    voidMatterTaken: row.vmTaken,
    pool: row.pool,
    ...(row.seat === activeSeat ? { activeTurn: true as const } : {}),
    ...(row.seat === firstPlayerSeat ? { firstPlayer: true as const } : {}),
  }));
}

/** Stage 1c play table at `#/`. Fixture-driven; no engine. */
export default function TablePage() {
  const tableRegionRef = useRef<HTMLDivElement>(null);
  const path = useHashRoute();
  const view = midGame4SeatView;
  const devLinks = appNavLinks;
  const [inspectorHex, setInspectorHex] = useState<MapHexView | null>(null);
  const [inspectorCard, setInspectorCard] = useState<TableCardInspectTarget | null>(null);
  const [inspectorDiscard, setInspectorDiscard] = useState<MarketDiscardInspectTarget | null>(null);
  const [selectedShipInstanceId, setSelectedShipInstanceId] = useState(view.viewerFleet.selectedInstanceId);
  const [closeMarketsSignal, setCloseMarketsSignal] = useState(0);
  const [closeFleetSignal, setCloseFleetSignal] = useState(0);

  const onInspectHex = useCallback((hex: MapHexView) => {
    setInspectorCard(null);
    setInspectorDiscard(null);
    setInspectorHex(hex);
  }, []);

  const onInspectTableCard = useCallback((target: TableCardInspectTarget) => {
    setInspectorHex(null);
    setInspectorDiscard(null);
    setInspectorCard(target);
  }, []);

  const onInspectMarketDiscard = useCallback((target: MarketDiscardInspectTarget) => {
    setInspectorHex(null);
    setInspectorCard(null);
    setInspectorDiscard(target);
  }, []);

  return (
    <div className={styles.page}>
      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden="true">
        <HexDefs />
      </svg>

      <header className={styles.hud}>
        <div className={styles.hudStart}>
          <VoidMatterLogo compact />
          <PhaseBanner
            compact
            showFirstPlayer={false}
            gameRound={view.gameRound}
            phase={view.phase}
            maintenanceStep={view.maintenanceStep}
          />
          <VmTrackerRow seats={vmTrackerSeats(view.seats, view.activeSeat, view.firstPlayerSeat)} />
        </div>
        <div className={styles.hudMenu}>
          {devPagesEnabled ? <DevPagesMenu path={path} links={devLinks} embedded /> : null}
        </div>
      </header>

      <TableMarketsDock
        view={view}
        overlayHostRef={tableRegionRef}
        onInspectCard={onInspectTableCard}
        onInspectDiscard={onInspectMarketDiscard}
        externalCloseSignal={closeMarketsSignal}
        onRequestClosePeer={() => setCloseFleetSignal((signal) => signal + 1)}
      />

      <div className={styles.playfield}>
        <div ref={tableRegionRef} className={styles.table}>
          <SpaceBackdrop />
          <BoardViewport wheelRegionRef={tableRegionRef}>
            <GameBoard
              view={view}
              inspectedHex={inspectorHex ? { q: inspectorHex.q, r: inspectorHex.r } : undefined}
              selectedShipInstanceId={selectedShipInstanceId}
              onInspectHex={onInspectHex}
            />
          </BoardViewport>
          <Typography variant="caption" className={styles.hint}>
            Drag to pan · scroll to zoom · right-click a hex to inspect
          </Typography>
          {inspectorHex ? (
            <MapHexInspector hex={inspectorHex} view={view} onClose={() => setInspectorHex(null)} />
          ) : null}
          {inspectorCard ? (
            <MarketCardInspector target={inspectorCard} onClose={() => setInspectorCard(null)} />
          ) : null}
          {inspectorDiscard ? (
            <MarketDiscardInspector target={inspectorDiscard} onClose={() => setInspectorDiscard(null)} />
          ) : null}
        </div>
      </div>

      <footer className={styles.playerDock} aria-label="Your fleet">
        <TableFleetDock
          fleet={view.viewerFleet}
          overlayHostRef={tableRegionRef}
          onActiveShip={setSelectedShipInstanceId}
          onInspectCard={onInspectTableCard}
          externalCloseSignal={closeFleetSignal}
          onRequestClosePeer={() => setCloseMarketsSignal((signal) => signal + 1)}
        />
      </footer>
    </div>
  );
}