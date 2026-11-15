import type { AssetCard } from "@void-matter/content";
import { sectorAssetCards } from "@void-matter/content";
import type { AssetCardProps } from "../components/game/AssetCard";
import type { ResourceId } from "../components/game/resources";
import { sectorResourceForDeck } from "../components/game/sectorDeck";
import { cardIllustrationArtForDeck, type SectorArtDeck } from "../components/game/assetCardArt";

export interface OwnerGalleryAssetCard extends AssetCardProps {
  readonly catalogueId: string;
}

function toGalleryCard(card: AssetCard): OwnerGalleryAssetCard | null {
  const deck = card.sectorDeck as SectorArtDeck;
  const illustrationUrl = cardIllustrationArtForDeck(card.illustrationSlug, deck);
  if (!illustrationUrl) return null;
  return {
    catalogueId: card.id,
    title: card.title,
    sectorDeck: card.sectorDeck,
    flavorText: card.flavorText,
    rulesText: card.rulesText,
    sector: sectorResourceForDeck(card.sectorDeck),
    costs: card.costs,
    slotSize: card.slotSize,
    category: card.kind,
    illustrationUrl,
    ...(card.weapon ? { weapon: card.weapon } : {}),
  };
}

/** Catalogue rows with hero art loaded (`packages/content` + `assets/cards/`). */
const sectorDeckOrder = ["s1", "s2", "s3", "s4"] as const;

const sectorDeckLabel: Readonly<Record<(typeof sectorDeckOrder)[number], string>> = {
  s1: "S1 Weapons / Offensive",
  s2: "S2 Propulsion / Utility",
  s3: "S3 Cargo / Life Support",
  s4: "S4 Hull / Defensive",
};

export const ownerSectorAssetCards: readonly OwnerGalleryAssetCard[] = sectorAssetCards
  .map(toGalleryCard)
  .filter((card): card is OwnerGalleryAssetCard => card !== null);

export function ownerAssetCardsForDeck(deck: (typeof sectorDeckOrder)[number]): readonly OwnerGalleryAssetCard[] {
  return ownerSectorAssetCards.filter((card) => card.sectorDeck === deck);
}

export const ownerSectorGalleryGroups: readonly {
  readonly deck: (typeof sectorDeckOrder)[number];
  readonly label: string;
  readonly resource: ResourceId;
  readonly cards: readonly OwnerGalleryAssetCard[];
}[] = sectorDeckOrder.map((deck) => ({
  deck,
  label: sectorDeckLabel[deck],
  resource: sectorResourceForDeck(deck),
  cards: ownerAssetCardsForDeck(deck),
}));
