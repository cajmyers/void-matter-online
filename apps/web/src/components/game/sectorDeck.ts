import type { ResourceId } from "./resources";

export type SectorDeckId = "s1" | "s2" | "s3" | "s4";

const sectorByDeck: Readonly<Record<SectorDeckId, ResourceId>> = {
  s1: "pc",
  s2: "h3",
  s3: "qp",
  s4: "tc",
};

export function sectorResourceForDeck(deck: SectorDeckId): ResourceId {
  return sectorByDeck[deck];
}
