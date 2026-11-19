import type {
  CrewMarketZoneView,
  MissionMarketZoneView,
  SectorMarketZoneView,
} from "./marketZoneView";

/** Shared market piles on the play table (`technical-proposal.md` §4.1, fixture-driven). */
export interface TableMarketsView {
  readonly sectors: readonly SectorMarketZoneView[];
  readonly crew: CrewMarketZoneView;
  readonly mission: MissionMarketZoneView;
}