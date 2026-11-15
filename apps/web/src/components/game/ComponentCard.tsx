import type { CardArtKind, ComponentSlotSize } from "./ComponentCard.types";
import { AssetCard } from "./AssetCard";
import { costsFromResourceList } from "./assetCardCosts";
import type { ResourceId } from "./resources";

export type { CardArtKind, ComponentSlotSize } from "./ComponentCard.types";

export interface ComponentCardProps {
  readonly title: string;
  readonly text: string;
  readonly sector: ResourceId;
  readonly cost: readonly ResourceId[];
  readonly art?: CardArtKind;
  readonly slotSize?: ComponentSlotSize;
  readonly stats?: string;
  readonly width?: number;
  readonly note?: string;
}

/** Legacy name; renders the standard {@link AssetCard}. */
export function ComponentCard({
  title,
  text,
  sector,
  cost,
  art = "planet",
  slotSize = 1,
  stats,
  width = 156,
  note,
}: ComponentCardProps) {
  const category = stats?.toLowerCase().includes("def") ? "defence" : "module";
  return (
    <AssetCard
      title={title}
      rulesText={text}
      sector={sector}
      costs={costsFromResourceList(cost)}
      slotSize={slotSize}
      category={category}
      placeholderArt={art}
      {...(stats ? { statsLine: stats } : {})}
      {...(note ? { footerNote: note } : {})}
      width={width}
    />
  );
}
