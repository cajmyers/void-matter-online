import type { CSSProperties } from "react";
import type { ResourceCost } from "@void-matter/content";
import { shipCardFaceTexture, shipCardHeroArt } from "./assetCardArt";
import { assetCardAttackDieSize, assetCardCargoSlotOuterSize, assetCardCostCubeSize } from "./assetCardSizing";
import { CargoCapacityRow } from "./CargoCapacityRow";
import {
  enemyWeaponArchetypeLabel,
  expandEnemyWeaponMounts,
  parseEnemyWeaponsLine,
} from "./enemyWeaponsLine";
import { AttackDiceRow } from "./AttackDiceRow";
import { HullDamageSlots } from "./HullTrack";
import { PlayingCardShell } from "./PlayingCardShell";
import { ResourceCostBadge } from "./ResourceCostBadge";
import { shipCardHullSlotSizePx, shipCardRegionHeights, shipUpgradeSlotMarkerSizePx } from "./shipCardLayout";
import { UpgradeSlotMarker } from "./UpgradeSlotMarker";
import { Typography } from "../Typography/Typography";
import styles from "./ShipCard.module.css";
import assetStyles from "./AssetCard.module.css";

const shipRim = "var(--game-ship-rim)";

export interface ShipCardProps {
  /** Catalogue id from `packages/content/data/ships/player-ships.json`. */
  readonly shipId: string;
  readonly title: string;
  readonly subtitle: string;
  readonly speed: number;
  readonly hull: number;
  readonly crewSlots: number;
  readonly cargo: number;
  readonly weapons: string;
  /** Paid from the faction pool when building at a Nexus (starting ship is free). */
  readonly buildCosts: readonly ResourceCost[];
  /** Full upgrade slots on this hull (`upgradeSlotsHalves` / 2, `SLT-1`). */
  readonly upgradeSlotCount: number;
  readonly width?: number;
  /** Damage cubes already on the hull (in play). */
  readonly damage?: number;
}

/** Player ship card (`SLT-1` capacity on art; build cost rail). */
export function ShipCard({
  shipId,
  title,
  subtitle,
  speed,
  hull,
  crewSlots,
  cargo,
  weapons,
  buildCosts,
  upgradeSlotCount,
  width = 156,
  damage = 0,
}: ShipCardProps) {
  const { artPlateMinHeight, compact, detail } = shipCardRegionHeights(width);
  const faceTextureUrl = shipCardFaceTexture(shipId);
  const illustrationUrl = shipCardHeroArt(shipId);
  const costSize = assetCardCostCubeSize(width);
  const slotMarkerSize = shipUpgradeSlotMarkerSizePx(width);
  const hullSlotSize = shipCardHullSlotSizePx(width);
  const showHullSlots = !compact && hull > 0 && hullSlotSize > 0;
  const parsedWeaponGroups = parseEnemyWeaponsLine(weapons);
  const weaponMounts = expandEnemyWeaponMounts(parsedWeaponGroups);
  const sharedWeaponArchetype =
    parsedWeaponGroups[0] !== undefined ? enemyWeaponArchetypeLabel(parsedWeaponGroups[0].name) : undefined;
  const attackDieSize = assetCardAttackDieSize(width);
  const cargoSlotSize = assetCardCargoSlotOuterSize(width);
  const cargoCubeSize = assetCardCostCubeSize(width);

  const layoutStyle = {
    ...(artPlateMinHeight > 0 ? { "--art-plate-min-height": `${artPlateMinHeight}px` } : {}),
  } as CSSProperties;

  return (
    <PlayingCardShell
      rim={shipRim}
      width={width}
      faceTextureUrl={faceTextureUrl}
      layoutStyle={layoutStyle}
      ariaLabel={`${title}, ${subtitle}, speed ${speed}, hull ${hull}, ${upgradeSlotCount} upgrade slots`}
      className={[
        styles.card,
        compact && styles.compact,
        compact && assetStyles.compact,
        detail && styles.detail,
        detail && assetStyles.detail,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <header className={styles.header}>
        <Typography variant="cardFine" className={styles.kindTag}>
          {subtitle}
        </Typography>
        <Typography variant="cardTitle" className={styles.title}>
          {title}
        </Typography>
      </header>

      <div className={styles.artPlate}>
        <div className={styles.slotCapacityOnArt}>
          <UpgradeSlotMarker capacity={upgradeSlotCount} size={slotMarkerSize} />
        </div>
        <aside className={styles.costRail} aria-label="Build cost">
          {buildCosts.map((entry) => (
            <ResourceCostBadge
              key={entry.resource}
              resource={entry.resource}
              amount={entry.amount}
              size={costSize}
              detail={detail}
            />
          ))}
        </aside>
        {illustrationUrl ? (
          <img className={styles.illustration} src={illustrationUrl} alt="" draggable={false} />
        ) : (
          <div className={styles.heroPlaceholder} aria-hidden />
        )}
      </div>

      {compact ? null : (
        <div className={styles.metaBar}>
          <div className={styles.metaRow}>
            <div className={styles.metaLead}>
              <span className={styles.speedLabel}>Speed {speed}</span>
              <span className={styles.speedLabel}>Crew {crewSlots}</span>
            </div>
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
              <div className={styles.weaponMountRow}>
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
          ) : null}
          {cargo > 0 ? (
            <div className={styles.cargoRow}>
              <CargoCapacityRow
                slotCount={cargo}
                compact={compact}
                slotSize={cargoSlotSize}
                cubeSize={cargoCubeSize}
              />
            </div>
          ) : null}
        </div>
      )}
    </PlayingCardShell>
  );
}