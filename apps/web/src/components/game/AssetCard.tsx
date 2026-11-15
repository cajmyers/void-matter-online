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
import { UpgradeSlotMarker } from "./UpgradeSlotMarker";
import { sectorCardFaceTexture, type SectorArtDeck } from "./assetCardArt";
import {
  assetCardArtPlateHeight,
  assetCardFooterReserveHeight,
  assetCardTextBlockHeight,
} from "./assetCardLayout";
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
}

function categoryAccent(category: AssetCardCategory, sector: ResourceId): string {
  if (category === "special") return "#9c27b0";
  return `var(--game-resource-${sector})`;
}

/** Standard sector asset / ship-module card. Only the centre illustration is bitmap art. */
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
}: AssetCardProps) {
  const compact = width < 140;
  const detailLayout = width >= cardWidthDetail;
  const faceTextureUrl = sectorDeck ? sectorCardFaceTexture(sectorDeck) : undefined;
  const costSize = compact ? 16 : Math.min(26, Math.round(width * 0.11));
  const artPlateHeight = assetCardArtPlateHeight(width);
  const textBlockHeight = assetCardTextBlockHeight(width);
  const footerReserveHeight = assetCardFooterReserveHeight(width);
  const style = {
    width,
    "--asset-rim": `var(--game-resource-${sector})`,
    "--asset-accent": categoryAccent(category, sector),
    "--art-plate-height": `${artPlateHeight}px`,
    "--text-block-height": `${textBlockHeight}px`,
    "--footer-reserve-height": `${footerReserveHeight}px`,
    ...(faceTextureUrl ? { "--asset-face-texture": `url(${faceTextureUrl})` } : {}),
  } as CSSProperties;

  const showRules = rulesText.trim().length > 0;
  const showFlavor = !compact && flavorText.trim().length > 0;
  const showTextBlock = !compact && (showFlavor || showRules);
  const placeholderClass = `${styles.placeholderArt} ${styles[placeholderArt]}`;
  const attackDiceCount = weapon?.diceCount ?? parseAttackDiceCount(statsLine);
  const attackHitLabel = weapon?.hitLabel ?? parseHitLabel(statsLine);
  const showAttackRow = shouldShowAttackDice(category, statsLine, attackDiceCount);
  const dieSize = compact ? 9 : detailLayout ? Math.min(17, Math.round(width * 0.075)) : Math.min(14, Math.round(width * 0.06));
  const slotMarkerSize = compact ? 26 : Math.min(38, Math.round(width * 0.19));
  const showFooterAttack = Boolean(showAttackRow && attackDiceCount);
  const showFooterNote = Boolean(footerNote && !compact);
  const hasFooterContent = showFooterAttack || showFooterNote;

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
      aria-label={
        compact
          ? [
              title,
              resourceInfo[sector].name,
              showRules ? rulesText : flavorText.trim() || undefined,
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

      <footer className={styles.footerReserve} aria-hidden={!hasFooterContent}>
        {showFooterAttack ? (
          <AttackDiceRow
            diceCount={attackDiceCount!}
            {...(attackHitLabel ? { hitLabel: attackHitLabel } : {})}
            {...(weapon?.archetype ? { archetype: weapon.archetype } : {})}
            compact={compact}
            dieSize={dieSize}
          />
        ) : null}
        {showFooterNote ? (
          <Typography variant="cardFine" className={styles.footerNote}>
            {footerNote}
          </Typography>
        ) : null}
      </footer>
    </article>
  );
}
