import { commanderCrew, ensignCrew, firstPlayableSlice, missionCatalogue } from "@void-matter/content";
import type { SectorArtDeck } from "../components/game/assetCardArt";
import type { GalleryCrewCard } from "./crewCardFixtures";
import { galleryCrewCardsFromCatalogue } from "./crewCardFixtures";
import {
  catalogueAssetCardsForDeck,
  ownerAssetCardsForDeck,
  type OwnerGalleryAssetCard,
} from "./sectorAssetCards";
import type {
  CrewMarketZoneView,
  MissionMarketZoneView,
  SectorMarketZoneView,
  ZoneDockTabId,
} from "../view/marketZoneView";

const sectorDecks = ["s1", "s2", "s3", "s4"] as const satisfies readonly SectorArtDeck[];

function assetLookupForDeck(deck: SectorArtDeck): Readonly<Record<string, OwnerGalleryAssetCard>> {
  const rows = ownerAssetCardsForDeck(deck);
  return Object.fromEntries(rows.map((row) => [row.catalogueId, row]));
}

function pickFaceUpIds(deck: SectorArtDeck, count: number): readonly string[] {
  const preferred: Readonly<Partial<Record<SectorArtDeck, readonly string[]>>> = {
    s1: ["laser-cannon", "minigun", "beam-projector"],
    s2: ["impulse-thrusters", "nested-overdrive", "impulse-thrusters"],
    s3: ["compact-storage", "expanded-cargo-bay", "crew-quarters"],
    s4: ["hull-plating", "magnetic-shields", "reactive-plating"],
  };
  const ids = preferred[deck] ?? [];
  const catalogue = catalogueAssetCardsForDeck(deck);
  const resolved = ids.length >= count ? ids.slice(0, count) : catalogue.slice(0, count).map((row) => row.catalogueId);
  return resolved;
}

export function gallerySectorMarketZoneViews(): readonly SectorMarketZoneView[] {
  return sectorDecks.map((deck) => {
    const market = firstPlayableSlice.sectorMarkets[deck];
    const faceUpCardIds = pickFaceUpIds(deck, 3);
    const discardCardIdsByDeck: Readonly<Partial<Record<SectorArtDeck, readonly string[]>>> = {
      s1: ["laser-cannon", "minigun", "beam-projector", "energy-shields"],
      s4: ["hull-plating", "reactive-plating"],
    };
    const discardCardIds = discardCardIdsByDeck[deck];
    const discardCount = discardCardIds?.length ?? 0;
    const deckCount = Math.max(0, market.deckSize - faceUpCardIds.length - discardCount);
    return {
      kind: "sector",
      sectorDeck: deck,
      label: market.label,
      resource: market.resource,
      faceUpCardIds,
      piles: { deckCount, discardCount },
      ...(discardCount > 0 && discardCardIds
        ? { discardTopCardId: discardCardIds[0], discardCardIds }
        : {}),
      useOwnerDeckBack: market.deckBack === "sector",
    };
  });
}

export function gallerySectorAssetCardsByDeck(): Readonly<Record<SectorArtDeck, Readonly<Record<string, OwnerGalleryAssetCard>>>> {
  return Object.fromEntries(sectorDecks.map((deck) => [deck, assetLookupForDeck(deck)])) as Readonly<
    Record<SectorArtDeck, Readonly<Record<string, OwnerGalleryAssetCard>>>
  >;
}

const galleryEnsignCards = galleryCrewCardsFromCatalogue(
  ensignCrew.filter((row) => firstPlayableSlice.includedCrewIds.includes(row.id)),
  "ensign",
);
const galleryCommanderCards = galleryCrewCardsFromCatalogue(commanderCrew, "commander");

export const galleryCrewCardsById: Readonly<Record<string, GalleryCrewCard>> = Object.fromEntries(
  [...galleryEnsignCards, ...galleryCommanderCards].map((card) => [card.catalogueId, card]),
);

export function galleryCrewMarketZoneView(): CrewMarketZoneView {
  const faceUpCrewIds = ["pilot", "merchant", "tactical", "scout"] as const;
  const discardCount = 2;
  const deckCount = Math.max(0, firstPlayableSlice.crewDeckSize - faceUpCrewIds.length - discardCount);
  const discardCardIds = ["scout", "merchant"] as const;
  return {
    kind: "crew",
    faceUpCrewIds,
    piles: { deckCount, discardCount },
    discardTopCrewId: "scout",
    discardCardIds,
  };
}

export const galleryMissionsById = Object.fromEntries(missionCatalogue.map((mission) => [mission.id, mission]));

export function galleryMissionMarketZoneView(): MissionMarketZoneView {
  const faceUpMissionIds = ["syndicate-bust", "market-saturation", "blockade", "galactic-tour"] as const;
  const discardCount = 6;
  const deckCount = Math.max(0, firstPlayableSlice.missionDeckSize - faceUpMissionIds.length - discardCount);
  const discardCardIds = [
    "all-aboard",
    "resource-tycoon",
    "cargo-kingpin",
    "armada",
    "full-roster",
    "galactic-tour",
  ] as const;
  return {
    kind: "mission",
    faceUpMissionIds,
    piles: { deckCount, discardCount },
    discardTopMissionId: "all-aboard",
    discardCardIds,
  };
}

/** Depleted face-up row: two cards left after purchases (still refills to 3 on buy `DCK-1`). */
export function gallerySectorMarketDepletedView(): SectorMarketZoneView {
  const base = gallerySectorMarketZoneViews().find((view) => view.sectorDeck === "s2");
  if (!base) {
    throw new Error("Missing S2 market fixture");
  }
  return {
    ...base,
    faceUpCardIds: base.faceUpCardIds.slice(0, 2),
    piles: { deckCount: 0, discardCount: 3 },
    discardTopCardId: "impulse-thrusters",
    discardCardIds: ["impulse-thrusters", "nested-overdrive", "impulse-thrusters"],
  };
}

export function zoneDockTabMeta(id: ZoneDockTabId): { readonly shortLabel: string; readonly rim: string } {
  if (id === "crew") {
    return { shortLabel: "Cr", rim: "var(--game-crew-rim)" };
  }
  if (id === "missions") {
    return { shortLabel: "Ms", rim: "var(--game-mission-rim)" };
  }
  const market = firstPlayableSlice.sectorMarkets[id];
  return { shortLabel: id.toUpperCase(), rim: `var(--game-resource-${market.resource})` };
}