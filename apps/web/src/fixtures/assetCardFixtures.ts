import type { AssetCardCategory, AssetPlaceholderArt, AssetSlotSize } from "../components/game/assetCardTypes";
import type { ResourceId } from "../components/game/resources";
import type { AssetResourceCost } from "../components/game/assetCardTypes";
import type { AssetWeaponBlock } from "../components/game/AssetCard";

export interface AssetCardFixture {
  readonly title: string;
  readonly flavorText?: string;
  readonly rulesText: string;
  readonly sector: ResourceId;
  readonly costs: readonly AssetResourceCost[];
  readonly slotSize: AssetSlotSize;
  readonly category: AssetCardCategory;
  readonly placeholderArt?: AssetPlaceholderArt;
  readonly statsLine?: string;
  readonly weapon?: AssetWeaponBlock;
  readonly footerNote?: string;
}
