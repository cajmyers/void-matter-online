import type { ReactNode } from "react";
import { playerShips } from "@void-matter/content";
import { AssetCard } from "../game/AssetCard";
import { CrewCard } from "../game/CrewCard";
import { MissionCard } from "../game/MissionCard";
import { ShipCard } from "../game/ShipCard";
import { shipCardPropsFromPlayerShip } from "../../fixtures/shipCardFixtures";
import type { TableCardInspectTarget } from "../../view/marketCardInspect";
import {
  galleryCrewCardsById,
  galleryMissionsById,
  gallerySectorAssetCardsByDeck,
} from "../../fixtures/zoneFixtures";

function resolveAssetCard(catalogueId: string) {
  const byDeck = gallerySectorAssetCardsByDeck();
  for (const deck of ["s1", "s2", "s3", "s4"] as const) {
    const card = byDeck[deck][catalogueId];
    if (card) {
      return card;
    }
  }
  return undefined;
}

export function renderMarketCardDetail(
  pileKind: "asset" | "crew" | "mission",
  catalogueId: string,
  width: number,
): ReactNode {
  if (pileKind === "asset") {
    const card = resolveAssetCard(catalogueId);
    if (!card) {
      return null;
    }
    return <AssetCard {...card} width={width} />;
  }
  if (pileKind === "crew") {
    const card = galleryCrewCardsById[catalogueId];
    if (!card) {
      return null;
    }
    return <CrewCard {...card} width={width} />;
  }
  const mission = galleryMissionsById[catalogueId];
  if (!mission) {
    return null;
  }
  return (
    <MissionCard
      catalogueId={mission.id}
      title={mission.title}
      text={mission.text}
      voidMatter={mission.voidMatter}
      width={width}
    />
  );
}

export function renderTableCardDetail(target: TableCardInspectTarget, width: number): ReactNode {
  if (target.kind === "ship") {
    const ship = playerShips.find((row) => row.id === target.catalogueId);
    if (!ship) {
      return null;
    }
    return (
      <ShipCard
        {...shipCardPropsFromPlayerShip(ship)}
        width={width}
        damage={target.damage ?? 0}
      />
    );
  }
  return renderMarketCardDetail(target.kind, target.catalogueId, width);
}