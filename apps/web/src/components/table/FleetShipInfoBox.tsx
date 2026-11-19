import type { CSSProperties } from "react";
import { playerShips } from "@void-matter/content";
import { ShipCard } from "../game/ShipCard";
import { cardWidthDetail } from "../game/cardSizes";
import { shipCardPropsFromPlayerShip } from "../../fixtures/shipCardFixtures";
import type { GalleryCrewCard } from "../../fixtures/crewCardFixtures";
import type { SeatNumber } from "../game/resources";
import { ownerGalleryAssetCardsById } from "../../fixtures/sectorAssetCards";
import { deriveFleetShipStats } from "../../view/fleetShipStats";
import type { FleetShipView } from "../../view/fleetView";
import { FleetShipStatsSummary } from "./FleetShipStatsSummary";
import type { TableCardInspectTarget } from "../../view/marketCardInspect";
import { Typography } from "../Typography/Typography";
import { InspectableMarketCard } from "./InspectableMarketCard";
import { InstalledComponentStack } from "./InstalledComponentStack";
import styles from "./FleetShipInfoBox.module.css";

const fleetCardWidth = cardWidthDetail;

export function FleetShipInfoBox({
  ship,
  seat,
  crewById,
  onInspectCard,
}: {
  readonly ship: FleetShipView;
  readonly seat: SeatNumber;
  readonly crewById: Readonly<Record<string, GalleryCrewCard>>;
  readonly onInspectCard?: (target: TableCardInspectTarget) => void;
}) {
  const catalogue = playerShips.find((row) => row.id === ship.shipCatalogueId);
  if (!catalogue) {
    return null;
  }
  const shipProps = shipCardPropsFromPlayerShip(catalogue);
  const stats = deriveFleetShipStats(catalogue, ship, ownerGalleryAssetCardsById);
  const style = {
    "--zone-rim": "var(--game-ship-rim)",
    "--fleet-seat": `var(--game-seat-${seat})`,
  } as CSSProperties;

  return (
    <article className={styles.panel} style={style} data-fleet-ship-panel="true">
      <header className={styles.head}>
        <Typography variant="subtitle1" className={styles.title}>
          {ship.displayName}
        </Typography>
        {ship.pinned ? (
          <Typography variant="caption" className={styles.subtitle}>
            Pinned — Move blocked until you Evade or Attack
          </Typography>
        ) : null}
      </header>
      <div className={styles.shipColumn}>
        <div className={styles.shipCard}>
          {onInspectCard ? (
            <InspectableMarketCard
              label={ship.displayName}
              onInspect={() =>
                onInspectCard({
                  kind: "ship",
                  catalogueId: ship.shipCatalogueId,
                  damage: ship.damage,
                })
              }
            >
              <ShipCard {...shipProps} width={fleetCardWidth} damage={ship.damage} />
            </InspectableMarketCard>
          ) : (
            <ShipCard {...shipProps} width={fleetCardWidth} damage={ship.damage} />
          )}
        </div>
        <InstalledComponentStack
          installedComponentIds={ship.installedComponentIds}
          crewCatalogueIds={ship.crewCatalogueIds}
          crewById={crewById}
          cardWidth={fleetCardWidth}
          onInspectCard={onInspectCard}
        />
        <FleetShipStatsSummary stats={stats} />
      </div>
    </article>
  );
}