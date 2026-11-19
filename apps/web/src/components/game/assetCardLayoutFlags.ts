import type { AssetCardProps } from "./AssetCard";
import { parseAttackDiceCount, shouldShowAttackDice } from "./attackDieStats";
import { cardWidthDetail } from "./cardSizes";

/** Region visibility flags shared by `AssetCard` and installed-card stacking. */
export function assetCardLayoutFlags(
  props: Pick<
    AssetCardProps,
    | "rulesText"
    | "flavorText"
    | "category"
    | "statsLine"
    | "weapon"
    | "footerNote"
    | "speedBonus"
    | "speedFooterLabel"
    | "cargoBonus"
    | "crewSlotsBonus"
    | "hullSlotsBonus"
  >,
  width: number,
): {
  readonly compact: boolean;
  readonly showTextBlock: boolean;
  readonly showRules: boolean;
  readonly hasFooterContent: boolean;
  readonly showFooter: boolean;
} {
  const compact = width < 140;
  const showRules = props.rulesText.trim().length > 0;
  const showFlavor = !compact && (props.flavorText?.trim() ?? "").length > 0;
  const showTextBlock = !compact && (showFlavor || showRules);
  const attackDiceCount = props.weapon?.diceCount ?? parseAttackDiceCount(props.statsLine);
  const showAttackRow = shouldShowAttackDice(props.category, props.statsLine, attackDiceCount);
  const showFooterAttack = Boolean(showAttackRow && attackDiceCount);
  const showFooterNote = Boolean(props.footerNote && !compact);
  const speedFooterText =
    props.speedFooterLabel?.trim() ||
    (props.speedBonus !== undefined
      ? `${props.speedBonus > 0 ? `+${props.speedBonus}` : `${props.speedBonus}`} Speed`
      : "");
  const showSpeedFooter = speedFooterText.length > 0;
  const showCargoFooter = props.cargoBonus !== undefined && props.cargoBonus > 0;
  const showCrewFooter = props.crewSlotsBonus !== undefined && props.crewSlotsBonus > 0;
  const showHullFooter = (props.hullSlotsBonus ?? 0) > 0;
  const hasFooterContent =
    showFooterAttack ||
    showFooterNote ||
    showSpeedFooter ||
    showCargoFooter ||
    showCrewFooter ||
    showHullFooter;
  const showCompactSpecial = compact && !hasFooterContent;
  const showFooter = hasFooterContent || compact;

  return {
    compact,
    showTextBlock,
    showRules,
    hasFooterContent,
    showFooter,
  };
}

export function assetCardHeaderHeight(width: number): number {
  return width >= cardWidthDetail ? 36 : 30;
}