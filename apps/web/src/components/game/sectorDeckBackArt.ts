import type { SectorArtDeck } from "./assetCardArt";
import s1BackUrl from "../../assets/cards/s1/back/s1.webp";
import s2BackUrl from "../../assets/cards/s2/back/s2.webp";
import s3BackUrl from "../../assets/cards/s3/back/s3.webp";
import s4BackUrl from "../../assets/cards/s4/back/s4.webp";

const sectorDeckBackUrl: Readonly<Record<SectorArtDeck, string>> = {
  s1: s1BackUrl,
  s2: s2BackUrl,
  s3: s3BackUrl,
  s4: s4BackUrl,
};

/** Owner print for a sector market deck pile (`cards/s{1–4}/back/s{n}.webp`). */
export function sectorDeckBackArt(deck: SectorArtDeck): string {
  return sectorDeckBackUrl[deck];
}