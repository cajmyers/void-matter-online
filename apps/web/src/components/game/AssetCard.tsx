import type { CSSProperties } from "react";
import { ResourceCostBadge } from "./ResourceCostBadge";
import { resourceInfo, type ResourceId } from "./resources";
import { Typography } from "../Typography/Typography";
import {
  type AssetCardCategory,
  type AssetPlaceholderArt,
  type AssetResourceCost,
  type AssetSlotSize,
  type AssetWeaponBlock,
} from "./assetCardTypes";
import { AttackDiceRow } from "./AttackDiceRow";
import { CargoCapacityRow } from "./CargoCapacityRow";
import { HullCapacityRow } from "./HullCapacityRow";
import { UpgradeSlotMarker } from "./UpgradeSlotMarker";
import { sectorCardFaceTexture, type SectorArtDeck } from "./assetCardArt";
import { assetCardRegionHeights } from "./assetCardLayout";
import { assetCardCargoSlotOuterSize, assetCardCostCubeSize } from "./assetCardSizing";
import { cardWidthDetail } from "./cardSizes";
import { parseAttackDiceCount, parseHitLabel, shouldShowAttackDice } from "./attackDieStats";
import styles from "./AssetCard.module.css";

export type { AssetCardCategory, AssetPlaceholderArt, AssetResourceCost, AssetSlotSize, AssetWeaponBlock };

export interface AssetCardProps {
  readonly title: string;
  readonly flavorText?: string;
  readonly rulesText: string;
  /** Sector rim (`MAP-4`): tc, h3, pc, or qp. */
  readonly sector: ResourceId;
  readonly costs: readonly AssetResourceCost[];
  readonly slotSize: AssetSlotSize;
  readonly category: AssetCardCategory;
  readonly illustrationUrl?: string;
  readonly placeholderArt?: AssetPlaceholderArt;
  readonly weapon?: AssetWeaponBlock;
  /** Printed defence or dice summary (e.g. DEF · energy). */
  readonly statsLine?: string;
  readonly footerNote?: string;
  readonly width?: number;
  /** Loads deck face texture when set (e.g. S1 `s1-texture.webp`). */
  readonly sectorDeck?: SectorArtDeck;
  /** Permanent speed in the effect area (e.g. Cloaked Slip Drive +1). */
  readonly speedBonus?: number;
  /** Effect area speed line when not a fixed bonus (e.g. Impulse "+? Speed"). */
  readonly speedFooterLabel?: string;
  /** Effect area: empty cargo slots (+N capacity; filled with cubes in play). */
  readonly cargoBonus?: number;
  /** Dev only: fill cargo slots with sample cubes (stable per title). */
  readonly cargoSlotPreview?: boolean;
  /** Effect area: +N Crew (crew quarters modules). */
  readonly crewSlotsBonus?: number;
  /** Effect area: +N Hull (hull plating and similar). */
  readonly hullSlotsBonus?: number;
}

function categoryAccent(category: AssetCardCategory, sector: ResourceId): string {
  if (category === "special") return "#9c27b0";
  return `var(--game-resource-${sector})`;
}

/**
 * Standard sector asset / ship-module card (`AssetCard.module.css` regions):
 * - **Title area** — `header` (Ship module tag + card title)
 * - **Image area** — `artPlate` (hero art, upgrade slot, cost rail)
 * - **Text box** — `textBlock` (flavour, rules / effect text)
 * - **Effect area** — `footerReserve` (weapon dice row, cargo slots, crew / speed line, notes)
 */
export function AssetCard({
  title,
  flavorText = "",
  rulesText,
  sector,
  costs,
  slotSize,
  category,
  illustrationUrl,
  placeholderArt = "ship",
  weapon,
  statsLine,
  footerNote,
  width = 156,
  sectorDeck,
  speedBonus,
  speedFooterLabel,
  cargoBonus,
  cargoSlotPreview = false,
  crewSlotsBonus,
  hullSlotsBonus,
}: AssetCardProps) {
  const compact = width < 140;
  const detailLayout = width >= cardWidthDetail;
  const faceTextureUrl = sectorDeck ? sectorCardFaceTexture(sectorDeck) : undefined;
  const costSize = assetCardCostCubeSize(width);
  const showRules = rulesText.trim().length > 0;
  const showFlavor = !compact && flavorText.trim().length > 0;
  const showTextBlock = !compact && (showFlavor || showRules);
  const attackDiceCount = weapon?.diceCount ?? parseAttackDiceCount(statsLine);
  const attackHitLabel = weapon?.hitLabel ?? parseHitLabel(statsLine);
  const showAttackRow = shouldShowAttackDice(category, statsLine, attackDiceCount);
  const showFooterAttack = Boolean(showAttackRow && attackDiceCount);
  const showFooterNote = Boolean(footerNote && !compact);
  const speedFooterText =
    speedFooterLabel?.trim() ||
    (speedBonus !== undefined
      ? `${speedBonus > 0 ? `+${speedBonus}` : `${speedBonus}`} Speed`
      : "");
  const showSpeedFooter = speedFooterText.length > 0;
  const showCargoFooter = cargoBonus !== undefined && cargoBonus > 0;
  const crewFooterText =
    crewSlotsBonus !== undefined && crewSlotsBonus > 0 ? `+${crewSlotsBonus} Crew` : "";
  const showCrewFooter = crewFooterText.length > 0;
  const hullSlotCount = hullSlotsBonus ?? 0;
  const showHullFooter = hullSlotCount > 0;
  const hullFooterAria =
    hullSlotCount > 0
      ? `${hullSlotCount} hull ${hullSlotCount === 1 ? "slot" : "slots"}`
      : "";
  const cargoSlotSize = assetCardCargoSlotOuterSize(width);
  const hasFooterContent =
    showFooterAttack ||
    showFooterNote ||
    showSpeedFooter ||
    showCargoFooter ||
    showCrewFooter ||
    showHullFooter;
  const showCompactSpecial = compact && !hasFooterContent;
  const showFooter = hasFooterContent || compact;

  const { artPlateHeight, textBlockHeight, footerReserveHeight } = assetCardRegionHeights(
    width,
    sectorDeck,
    { compact, hasEffectArea: hasFooterContent, hasTextBlock: showTextBlock },
  );

  const style = {
    width,
    "--asset-rim": `var(--game-resource-${sector})`,
    "--asset-accent": categoryAccent(category, sector),
    "--art-plate-height": `${artPlateHeight}px`,
    "--text-block-height": `${textBlockHeight}px`,
    "--footer-reserve-height": `${footerReserveHeight}px`,
    ...(faceTextureUrl ? { "--asset-face-texture": `url(${faceTextureUrl})` } : {}),
  } as CSSProperties;

  const placeholderClass = `${styles.placeholderArt} ${styles[placeholderArt]}`;
  const dieSize = compact ? 9 : detailLayout ? Math.min(17, Math.round(width * 0.075)) : Math.min(14, Math.round(width * 0.06));
  const slotMarkerSize = compact ? 26 : Math.min(38, Math.round(width * 0.19));

  return (
    <article
      className={
        [
          styles.card,
          compact && styles.compact,
          detailLayout && styles.detail,
          faceTextureUrl && styles.withFaceTexture,
        ]
          .filter(Boolean)
          .join(" ")
      }
      style={style}
      data-category={category}
      {...(sectorDeck ? { "data-sector-deck": sectorDeck } : {})}
      aria-label={
        compact
          ? [
              title,
              resourceInfo[sector].name,
              showRules ? rulesText : flavorText.trim() || undefined,
              showSpeedFooter ? speedFooterText : undefined,
              showCrewFooter ? crewFooterText : undefined,
              showHullFooter ? hullFooterAria : undefined,
              showCompactSpecial ? "Special" : undefined,
            ]
              .filter(Boolean)
              .join(". ")
          : `${title}, ${resourceInfo[sector].name}`
      }
    >
      <header className={styles.header}>
        <Typography variant="cardFine" className={styles.moduleTag}>
          Ship module
        </Typography>
        <Typography variant="cardTitle" className={styles.title}>
          {title}
        </Typography>
      </header>

      <div className={styles.artPlate}>
        <aside className={styles.costRail} aria-label="Cost">
          {costs.map((entry) => (
            <ResourceCostBadge
              key={entry.resource}
              resource={entry.resource}
              amount={entry.amount}
              size={costSize}
              detail={!compact}
            />
          ))}
        </aside>
        <div className={styles.slotOnArt}>
          <UpgradeSlotMarker slotSize={slotSize} size={slotMarkerSize} />
        </div>
        {illustrationUrl ? (
          <img className={styles.illustration} src={illustrationUrl} alt="" draggable={false} />
        ) : (
          <div className={placeholderClass} aria-hidden />
        )}
      </div>

      {showTextBlock ? (
        <div className={styles.textBlock}>
          {showFlavor ? (
            <Typography variant="cardText" className={styles.flavor}>
              {flavorText}
            </Typography>
          ) : null}
          {showRules ? (
            <Typography variant="cardText" className={styles.rules}>
              {rulesText}
            </Typography>
          ) : null}
        </div>
      ) : null}

      {showFooter ? (
        <footer className={styles.footerReserve}>
          {showFooterAttack ? (
            <AttackDiceRow
              diceCount={attackDiceCount!}
              {...(attackHitLabel ? { hitLabel: attackHitLabel } : {})}
              {...(weapon?.archetype ? { archetype: weapon.archetype } : {})}
              compact={compact}
              dieSize={dieSize}
            />
          ) : null}
          {showCargoFooter ? (
            <CargoCapacityRow
              slotCount={cargoBonus!}
              compact={compact}
              slotSize={cargoSlotSize}
              cubeSize={costSize}
              {...(cargoSlotPreview ? { fillSeed: title } : {})}
            />
          ) : null}
          {showCrewFooter ? (
            <p className={styles.speedFooter} aria-label={crewFooterText}>
              {crewFooterText}
            </p>
          ) : null}
          {showHullFooter ? (
            <HullCapacityRow slotCount={hullSlotCount} compact={compact} slotSize={cargoSlotSize} />
          ) : null}
          {showSpeedFooter ? (
            <p className={styles.speedFooter} aria-label={speedFooterText}>
              {speedFooterText}
            </p>
          ) : null}
          {showFooterNote ? (
            <Typography variant="cardFine" className={styles.footerNote}>
              {footerNote}
            </Typography>
          ) : null}
          {showCompactSpecial ? (
            <p className={styles.speedFooter}>Special</p>
          ) : null}
        </footer>
      ) : footerReserveHeight > 0 ? (
        <div className={styles.cardBottomInset} aria-hidden />
      ) : null}
    </article>
  );
}
