import type { CSSProperties, ReactNode } from "react";
import { AssetCard } from "../game/AssetCard";
import { CrewCard } from "../game/CrewCard";
import { assetCardInstalledPeekHeights, crewCardInstalledPeekHeights } from "../game/installedCardPeek";
import { cardWidthHand } from "../game/cardSizes";
import type { GalleryCrewCard } from "../../fixtures/crewCardFixtures";
import type { OwnerGalleryAssetCard } from "../../fixtures/sectorAssetCards";
import { ownerGalleryAssetCardsById } from "../../fixtures/sectorAssetCards";
import type { TableCardInspectTarget } from "../../view/marketCardInspect";
import { InspectableMarketCard } from "./InspectableMarketCard";
import styles from "./InstalledComponentStack.module.css";

/** Slight tuck so stacked edges read as one pile (not a gap). */
const stackTuckPx = 6;

function StackedPeekLayer({
  peekHeight,
  hiddenOffset,
  marginTop,
  zIndex,
  inspectLabel,
  onInspect,
  children,
}: {
  readonly peekHeight: number;
  readonly hiddenOffset: number;
  readonly marginTop: number;
  readonly zIndex: number;
  readonly inspectLabel: string;
  readonly onInspect?: () => void;
  readonly children: ReactNode;
}) {
  const body = (
    <div className={styles.inner} style={{ marginTop: hiddenOffset }}>
      {children}
    </div>
  );

  return (
    <div
      className={styles.layer}
      style={{ height: peekHeight, marginTop, zIndex }}
      role="listitem"
    >
      {onInspect ? (
        <InspectableMarketCard label={inspectLabel} onInspect={onInspect} fill>
          {body}
        </InspectableMarketCard>
      ) : (
        body
      )}
    </div>
  );
}

export function InstalledComponentStack({
  installedComponentIds,
  crewCatalogueIds = [],
  cardsById = ownerGalleryAssetCardsById,
  crewById,
  cardWidth = cardWidthHand,
  onInspectCard,
}: {
  readonly installedComponentIds: readonly string[];
  readonly crewCatalogueIds?: readonly string[];
  readonly cardsById?: Readonly<Record<string, OwnerGalleryAssetCard>>;
  readonly crewById?: Readonly<Record<string, GalleryCrewCard>>;
  readonly cardWidth?: number;
  readonly onInspectCard?: (target: TableCardInspectTarget) => void;
}) {
  const layerCount = installedComponentIds.length + crewCatalogueIds.length;
  if (layerCount === 0) {
    return null;
  }

  const stackStyle = { "--stack-card-width": `${cardWidth}px` } as CSSProperties;

  let layerIndex = 0;
  const nextLayerStyle = () => {
    const marginTop = layerIndex === 0 ? 0 : -stackTuckPx;
    const zIndex = layerCount - layerIndex;
    layerIndex += 1;
    return { marginTop, zIndex };
  };

  return (
    <div
      className={styles.stack}
      style={stackStyle}
      role="list"
      aria-label={`${installedComponentIds.length} components${crewCatalogueIds.length > 0 ? `, ${crewCatalogueIds.length} crew` : ""}`}
    >
      {installedComponentIds.map((catalogueId) => {
        const card = cardsById[catalogueId];
        if (!card) {
          return null;
        }
        const { catalogueId: _id, ...cardProps } = card;
        const { peekHeight, hiddenOffset } = assetCardInstalledPeekHeights(cardProps, cardWidth);
        const layout = nextLayerStyle();
        return (
          <StackedPeekLayer
            key={`component-${catalogueId}`}
            peekHeight={peekHeight}
            hiddenOffset={hiddenOffset}
            marginTop={layout.marginTop}
            zIndex={layout.zIndex}
            inspectLabel={card.title}
            onInspect={
              onInspectCard
                ? () => onInspectCard({ kind: "asset", catalogueId })
                : undefined
            }
          >
            <AssetCard {...cardProps} width={cardWidth} />
          </StackedPeekLayer>
        );
      })}
      {crewCatalogueIds.map((id) => {
        if (!crewById) {
          return null;
        }
        const crew = crewById[id];
        if (!crew) {
          return null;
        }
        const { peekHeight, hiddenOffset } = crewCardInstalledPeekHeights(crew, cardWidth);
        const layout = nextLayerStyle();
        const crewLabel = crew.name ?? crew.title;
        return (
          <StackedPeekLayer
            key={`crew-${id}`}
            peekHeight={peekHeight}
            hiddenOffset={hiddenOffset}
            marginTop={layout.marginTop}
            zIndex={layout.zIndex}
            inspectLabel={crewLabel}
            onInspect={
              onInspectCard ? () => onInspectCard({ kind: "crew", catalogueId: id }) : undefined
            }
          >
            <CrewCard {...crew} width={cardWidth} />
          </StackedPeekLayer>
        );
      })}
    </div>
  );
}