import type { AssetCard } from "@void-matter/content";
import { sectorAssetCards } from "@void-matter/content";
import type { AssetCardProps } from "../components/game/AssetCard";
import type { ResourceId } from "../components/game/resources";
import { sectorResourceForDeck } from "../components/game/sectorDeck";
import { cardIllustrationArtForDeck, type SectorArtDeck } from "../components/game/assetCardArt";

export interface OwnerGalleryAssetCard extends AssetCardProps {
  readonly catalogueId: string;
}

function toGalleryCard(
  card: AssetCard,
  options?: { readonly requireArt?: boolean },
): OwnerGalleryAssetCard | null {
  const requireArt = options?.requireArt ?? true;
  const deck = card.sectorDeck as SectorArtDeck;
  const illustrationUrl = cardIllustrationArtForDeck(card.illustrationSlug, deck);
  if (!illustrationUrl && requireArt) return null;
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
    ...(illustrationUrl ? { illustrationUrl } : {}),
    ...(card.weapon ? { weapon: card.weapon } : {}),
    ...(card.speedBonus !== undefined ? { speedBonus: card.speedBonus } : {}),
    ...(card.speedFooterLabel ? { speedFooterLabel: card.speedFooterLabel } : {}),
    ...(card.cargoBonus !== undefined ? { cargoBonus: card.cargoBonus } : {}),
    ...(card.crewSlotsBonus !== undefined ? { crewSlotsBonus: card.crewSlotsBonus } : {}),
    ...(card.hullSlotsBonus !== undefined ? { hullSlotsBonus: card.hullSlotsBonus } : {}),
  };
}

/** Catalogue rows with hero art loaded (`packages/content` + `assets/cards/`). */
const sectorDeckOrder = ["s1", "s2", "s3", "s4"] as const;

export const sectorDeckLabel: Readonly<Record<(typeof sectorDeckOrder)[number], string>> = {
  s1: "S1 Weapons / Offensive",
  s2: "S2 Propulsion / Utility",
  s3: "S3 Cargo / Life Support",
  s4: "S4 Hull / Defensive",
};

const galleryDeckExampleIds: Readonly<Record<(typeof sectorDeckOrder)[number], string>> = {
  s1: "laser-cannon",
  s2: "impulse-thrusters",
  s3: "compact-storage",
  s4: "hull-plating",
};

/** One illustrated catalogue row per sector deck for the component gallery. */
export function galleryExampleAssetCardsForSectorMarkets(): readonly OwnerGalleryAssetCard[] {
  return sectorDeckOrder.map((deck) => {
    const cards = catalogueAssetCardsForDeck(deck);
    const preferred = cards.find((card) => card.catalogueId === galleryDeckExampleIds[deck]);
    const row = preferred ?? cards[0];
    if (!row) {
      throw new Error(`No catalogue rows for sector deck ${deck}`);
    }
    return row;
  });
}

export const ownerSectorAssetCards: readonly OwnerGalleryAssetCard[] = sectorAssetCards
  .map(toGalleryCard)
  .filter((card): card is OwnerGalleryAssetCard => card !== null);

export function ownerAssetCardsForDeck(deck: (typeof sectorDeckOrder)[number]): readonly OwnerGalleryAssetCard[] {
  return ownerSectorAssetCards.filter((card) => card.sectorDeck === deck);
}

/** Full catalogue for dev pages (placeholder art when hero bitmap is missing). */
export function catalogueAssetCardsForDeck(
  deck: (typeof sectorDeckOrder)[number],
): readonly OwnerGalleryAssetCard[] {
  return sectorAssetCards
    .filter((card) => card.sectorDeck === deck)
    .map((card) => toGalleryCard(card, { requireArt: false }))
    .filter((card): card is OwnerGalleryAssetCard => card !== null);
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
