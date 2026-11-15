import type { CommanderCrew, EnsignCrew } from "@void-matter/content";
import { crewCardPortraitArt } from "../components/game/assetCardArt";
import type { CrewCardProps, CrewCardRank } from "../components/game/CrewCard";

export interface GalleryCrewCard extends CrewCardProps {
  readonly catalogueId: string;
}

type CrewCatalogueRow = EnsignCrew | CommanderCrew;

export function galleryCrewCardsFromCatalogue(
  rows: readonly CrewCatalogueRow[],
  rank: CrewCardRank,
): readonly GalleryCrewCard[] {
  return rows.map((row) => {
    const illustrationUrl = crewCardPortraitArt(row.id);
    const characterName = "name" in row && row.name ? row.name : undefined;
    return {
      catalogueId: row.id,
      title: row.title,
      text: row.text,
      costs: row.costs,
      action: row.actionToken,
      rank,
      ...(characterName ? { name: characterName } : {}),
      ...(illustrationUrl ? { illustrationUrl } : {}),
    };
  });
}