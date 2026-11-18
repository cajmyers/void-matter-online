import { useRef } from "react";
import { HexDefs } from "../../components/hex/HexTile";
import { PhaseBanner } from "../../components/game/PhaseBanner";
import { VoidMatterLogo } from "../../components/game/VoidMatterLogo";
import { VmTrackerRow } from "../../components/game/VmTrackerRow";
import { SpaceBackdrop } from "../../components/game/SpaceBackdrop";
import { BoardViewport } from "../../components/table/BoardViewport";
import { GameBoard } from "../../components/table/GameBoard";
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

  return (
    <div className={styles.page}>
      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden="true">
        <HexDefs />
      </svg>

      <header className={styles.hud}>
        <div className={styles.hudPhase}>
          <VoidMatterLogo compact />
          <PhaseBanner
            compact
            showFirstPlayer={false}
            gameRound={view.gameRound}
            phase={view.phase}
            maintenanceStep={view.maintenanceStep}
          />
        </div>
        <div className={styles.hudSeats}>
          <VmTrackerRow seats={vmTrackerSeats(view.seats, view.activeSeat, view.firstPlayerSeat)} />
        </div>
        <div className={styles.hudMenu}>
          {devPagesEnabled ? <DevPagesMenu path={path} links={devLinks} embedded /> : null}
        </div>
      </header>

      <div ref={tableRegionRef} className={styles.table}>
        <SpaceBackdrop />
        <BoardViewport wheelRegionRef={tableRegionRef}>
          <GameBoard view={view} />
        </BoardViewport>
        <Typography variant="caption" className={styles.hint}>
          Drag to pan · scroll to zoom
        </Typography>
      </div>
    </div>
  );
}