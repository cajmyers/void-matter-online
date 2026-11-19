import type { TableMarketsView } from "../../view/tableMarketsView";
import {
  galleryCrewMarketZoneView,
  galleryMissionMarketZoneView,
  gallerySectorMarketZoneViews,
} from "../zoneFixtures";

/** Mid-game market piles shared across the table fixture. */
export const midGame4SeatMarkets: TableMarketsView = {
  sectors: gallerySectorMarketZoneViews(),
  crew: galleryCrewMarketZoneView(),
  mission: galleryMissionMarketZoneView(),
};