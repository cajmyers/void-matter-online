import type { CSSProperties } from "react";
import { ENEMY_FACTION_LABELS, type EnemyFactionId } from "@void-matter/content";
import { enemyCardFaceTexture, enemyCardHeroArt } from "./assetCardArt";
import { enemyRimForFaction } from "./enemyFactionRim";
import { assetCardAttackDieSize } from "./assetCardSizing";
import { AttackDiceRow } from "./AttackDiceRow";
import { enemyCardHullSlotSizePx, enemyCardLevelIconHeightPx, enemyCardRegionHeights } from "./enemyCardLayout";
import { enemyLevelRewardArt } from "./enemyLevelRewardArt";
import {
  enemyWeaponArchetypeLabel,
  expandEnemyWeaponMounts,
  parseEnemyWeaponsLine,
} from "./enemyWeaponsLine";
import { HullDamageSlots } from "./HullTrack";
import { PlayingCardShell } from "./PlayingCardShell";
import { Typography } from "../Typography/Typography";
import styles from "./EnemyCard.module.css";
import assetStyles from "./AssetCard.module.css";
import shellStyles from "./playingCardShell.module.css";

export interface EnemyCardProps {
  /** Catalogue id from `packages/content/data/enemies/*.json` (hero art basename). */
  readonly enemyId: string;
  readonly name: string;
  readonly faction: EnemyFactionId;
  readonly tier: 1 | 2 | 3;
  readonly hull: number;
  readonly speed: number;
  readonly weapons: string;
  readonly special: string;
  readonly width?: number;
  /** Damage cubes already on the hull (in play); printed slots follow `hull`. */
  readonly damage?: number;
  /** Overrides faction rim when set. */
  readonly rim?: string;
}

const tierLabels: Readonly<Record<EnemyCardProps["tier"], string>> = {
  1: "Level 1",
  2: "Level 2",
  3: "Level 3",
};

/** Enemy ship (`DCK-3` reward stack on art cost rail). */
export function EnemyCard({
  enemyId,
  name,
  faction,
  tier,
  hull,
  speed,
  weapons,
  special,
  width = 156,
  damage = 0,
  rim,
}: EnemyCardProps) {
  const levelIconHeight = enemyCardLevelIconHeightPx(width);
  const resolvedRim = rim ?? enemyRimForFaction(faction);
  const faceTextureUrl = enemyCardFaceTexture(faction);
  const illustrationUrl = enemyCardHeroArt(enemyId);
  const { artPlateMinHeight, compact, detail } = enemyCardRegionHeights(width);
  const hullSlotSize = enemyCardHullSlotSizePx(width);
  const showHullSlots = !compact && hull > 0 && hullSlotSize > 0;
  const showRulesPanel = !compact && special.trim().length > 0;
  const parsedWeaponGroups = parseEnemyWeaponsLine(weapons);
  const weaponMounts = expandEnemyWeaponMounts(parsedWeaponGroups);
  const sharedWeaponArchetype =
    parsedWeaponGroups[0] !== undefined
      ? enemyWeaponArchetypeLabel(parsedWeaponGroups[0].name)
      : undefined;
  const attackDieSize = assetCardAttackDieSize(width);

  const layoutStyle = {
    ...(artPlateMinHeight > 0 ? { "--art-plate-min-height": `${artPlateMinHeight}px` } : {}),
    "--enemy-level-icon-height": `${levelIconHeight}px`,
  } as CSSProperties;

  const rewardStackLabel = `${tier} face-down reward card${tier === 1 ? "" : "s"}`;

  return (
    <PlayingCardShell
      rim={resolvedRim}
      width={width}
      faceTextureUrl={faceTextureUrl}
      layoutStyle={layoutStyle}
      className={[
        styles.card,
        compact && styles.compact,
        compact && assetStyles.compact,
        detail && styles.detail,
        detail && assetStyles.detail,
        compact && styles.artFillOnly,
      ]
        .filter(Boolean)
        .join(" ")}
      ariaLabel={`${name}, ${ENEMY_FACTION_LABELS[faction]}, ${tierLabels[tier]}, speed ${speed}, hull ${hull}${showHullSlots ? `, ${damage} damage` : ""}, ${rewardStackLabel}`}
    >
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <Typography variant="cardFine" className={styles.levelTag}>
            {tierLabels[tier]}
          </Typography>
          <Typography variant="cardFine" className={styles.factionTag}>
            {ENEMY_FACTION_LABELS[faction]}
          </Typography>
        </div>
        <Typography variant="cardTitle" className={styles.title}>
          {name}
        </Typography>
      </header>

      <div className={styles.artPlate}>
        <aside className={styles.costRail} aria-label={rewardStackLabel}>
          <img
            className={styles.levelIcon}
            src={enemyLevelRewardArt(tier)}
            alt=""
            height={levelIconHeight}
            draggable={false}
          />
        </aside>
        {illustrationUrl ? (
          <img className={styles.illustration} src={illustrationUrl} alt="" draggable={false} />
        ) : (
          <div className={styles.heroPlaceholder} aria-hidden />
        )}
      </div>

      {showRulesPanel ? (
        <div className={[styles.textBlock, styles.rulesPanel].join(" ")}>
          <Typography variant="cardText" className={styles.rules}>
            {special}
          </Typography>
        </div>
      ) : null}

      {compact ? null : (
        <div className={styles.metaBar}>
          <div className={styles.metaRow}>
            <span className={styles.speedLabel}>Speed {speed}</span>
            {showHullSlots ? (
              <HullDamageSlots
                capacity={hull}
                damage={damage}
                slotSize={hullSlotSize}
                compact={compact}
                className={styles.hullSlots}
              />
            ) : null}
          </div>
          {weaponMounts.length > 0 ? (
            <div className={styles.weaponBlock}>
              {sharedWeaponArchetype ? (
                <span
                  className={[assetStyles.weaponType, compact && assetStyles.weaponTypeCompact]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {sharedWeaponArchetype}
                </span>
              ) : null}
              <div
                className={[styles.weaponMountRow, weaponMounts.length > 1 ? styles.weaponMountRowPair : undefined]
                  .filter(Boolean)
                  .join(" ")}
              >
                {weaponMounts.map((weapon, index) => (
                  <AttackDiceRow
                    key={`${weapon.name}-${weapon.hitLabel}-${index}`}
                    diceCount={weapon.diceCount}
                    hitLabel={weapon.hitLabel}
                    compact={compact}
                    dieSize={attackDieSize}
                    weaponFooterClassName={styles.weaponMount}
                    weaponRowClassName={styles.weaponDicePill}
                  />
                ))}
              </div>
            </div>
          ) : (
            <Typography variant="cardFine" className={shellStyles.mono}>
              {weapons}
            </Typography>
          )}
        </div>
      )}

    </PlayingCardShell>
  );
}