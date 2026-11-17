import type { SectorArtDeck } from "../components/game/assetCardArt";
import type { ResourceId } from "../components/game/resources";

/** Public counts for deck and discard; order stays hidden (`technical-proposal.md` §4.1). */
export interface MarketPilesView {
  readonly deckCount: number;
  readonly discardCount: number;
}

export interface SectorMarketZoneView {
  readonly kind: "sector";
  readonly sectorDeck: SectorArtDeck;
  readonly label: string;
  readonly resource: ResourceId;
  readonly piles: MarketPilesView;
  /** Face-up catalogue ids, length 1–3 (`DCK-1`, `MAP-4`). */
  readonly faceUpCardIds: readonly string[];
  /** Face-up top of discard when `piles.discardCount` > 0. */
  readonly discardTopCardId?: string;
  readonly useOwnerDeckBack?: boolean;
}

export interface CrewMarketZoneView {
  readonly kind: "crew";
  readonly piles: MarketPilesView;
  /** Face-up catalogue ids, length 1–4 (`DCK-2`, recruitment market). */
  readonly faceUpCrewIds: readonly string[];
  readonly discardTopCrewId?: string;
}

export interface MissionMarketZoneView {
  readonly kind: "mission";
  readonly piles: MarketPilesView;
  /** Face-up catalogue ids, length 1–4. */
  readonly faceUpMissionIds: readonly string[];
  readonly discardTopMissionId?: string;
}

export type CardMarketZoneView = SectorMarketZoneView | CrewMarketZoneView | MissionMarketZoneView;

export type ZoneDockTabId = "s1" | "s2" | "s3" | "s4" | "crew" | "missions";