import type { CSSProperties } from "react";
import { missionCardFaceTexture, missionCardHeroArt } from "./assetCardArt";
import { assetCardCostCubeSize } from "./assetCardSizing";
import { cardWidthDetail } from "./cardSizes";
import { missionCardRedeemedVmSize, missionCardRegionHeights } from "./missionCardLayout";
import { ResourceCube } from "./ResourceCube";
import { Typography } from "../Typography/Typography";
import styles from "./MissionCard.module.css";

const missionRim = "var(--game-mission-rim)";

export interface MissionCardProps {
  readonly title: string;
  readonly text: string;
  /** Catalogue id (`missions.json`) for hero art lookup. */
  readonly catalogueId?: string;
  readonly illustrationUrl?: string;
  /** Void Matter granted when redeemed (never spent). */
  readonly voidMatter: number;
  /** Condition met; redeem at Central Nexus (`complete` alias). */
  readonly readyToRedeem?: boolean;
  /** @deprecated Use `readyToRedeem`. */
  readonly complete?: boolean;
  /** VM taken; mission stays in the completed row until discarded by rules. */
  readonly redeemed?: boolean;
  /**
   * Demo / UI progress when held and in progress (0–1). Market and newly taken missions use 0 — not started.
   * Engine will drive this later.
   */
  readonly progress?: number;
  readonly width?: number;
}

type MissionCardPhase = "not-started" | "in-progress" | "ready-to-redeem" | "redeemed";

function missionPhase(readyToRedeem: boolean, redeemed: boolean, progress: number): MissionCardPhase {
  if (redeemed) {
    return "redeemed";
  }
  if (readyToRedeem) {
    return "ready-to-redeem";
  }
  if (progress > 0) {
    return "in-progress";
  }
  return "not-started";
}

export function MissionCard({
  title,
  text,
  catalogueId,
  illustrationUrl: illustrationUrlProp,
  voidMatter,
  readyToRedeem: readyToRedeemProp,
  complete = false,
  redeemed = false,
  progress = 0,
  width = 156,
}: MissionCardProps) {
  const readyToRedeem = readyToRedeemProp ?? complete;
  const phase = missionPhase(readyToRedeem, redeemed, progress);
  const detailLayout = width >= cardWidthDetail;
  const faceTextureUrl = missionCardFaceTexture();
  const { artPlateHeight, textBlockHeight, footerReserveHeight, compact } = missionCardRegionHeights(width);
  const illustrationUrl =
    illustrationUrlProp ?? (catalogueId ? missionCardHeroArt(catalogueId) : undefined);
  const vmArtSize = assetCardCostCubeSize(width);
  const redeemedVmSize = missionCardRedeemedVmSize(width);
  const progressClamped = Math.min(1, Math.max(0, phase === "ready-to-redeem" || phase === "redeemed" ? 1 : progress));

  const style = {
    width,
    "--mission-rim": missionRim,
    "--art-plate-height": `${artPlateHeight}px`,
    "--text-block-height": `${textBlockHeight}px`,
    "--footer-reserve-height": `${footerReserveHeight}px`,
    "--mission-face-texture": `url(${faceTextureUrl})`,
    "--progress-fill": `${Math.round(progressClamped * 100)}%`,
  } as CSSProperties;

  return (
    <article
      className={[
        styles.card,
        compact && styles.compact,
        detailLayout && styles.detail,
        styles.withFaceTexture,
        compact && styles.artFillOnly,
        phase === "redeemed" && styles.redeemed,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      aria-label={`${title}, mission. ${text}.${
        phase === "redeemed"
          ? " Redeemed."
          : phase === "ready-to-redeem"
            ? " Ready to redeem."
            : phase === "in-progress"
              ? " In progress."
              : " Not started."
      }`}
    >
      <header className={styles.header}>
        <Typography variant="cardFine" className={styles.kindTag}>
          Mission
        </Typography>
        <Typography variant="cardTitle" className={styles.title}>
          {title}
        </Typography>
      </header>

      <div className={styles.artPlate}>
        {phase === "redeemed" ? null : (
          <aside className={styles.vmRail} aria-label="Void Matter on redeem">
            <ResourceCube resource="vm" size={vmArtSize} />
          </aside>
        )}
        {illustrationUrl ? (
          <img className={styles.illustration} src={illustrationUrl} alt="" draggable={false} />
        ) : (
          <div className={styles.heroPlaceholder} aria-hidden />
        )}
        {phase === "redeemed" ? (
          <div className={styles.redeemedVm} aria-label="Void Matter redeemed to faction pool">
            <ResourceCube resource="vm" size={redeemedVmSize} />
          </div>
        ) : null}
      </div>

      {compact ? null : (
        <div className={[styles.textBlock, styles.rulesPanel].join(" ")}>
          <Typography variant="cardText" className={styles.rules}>
            {text}
          </Typography>
        </div>
      )}

      <footer className={styles.footerReserve}>
        <span
          className={[
            styles.progress,
            phase === "ready-to-redeem" || phase === "redeemed" ? styles.progressComplete : undefined,
          ]
            .filter(Boolean)
            .join(" ")}
          role={phase === "in-progress" || phase === "not-started" ? "img" : undefined}
          aria-label={
            phase === "in-progress"
              ? "Mission progress"
              : phase === "not-started"
                ? "Mission not started"
                : undefined
          }
          aria-hidden={phase === "in-progress" || phase === "not-started" ? undefined : true}
        >
          <span className={styles.progressFill} />
        </span>
        <Typography variant="cardFine" className={styles.status}>
          {phase === "redeemed"
            ? "Redeemed"
            : phase === "ready-to-redeem"
              ? "Ready to redeem"
              : phase === "in-progress"
                ? "In progress"
                : "Not started"}
        </Typography>
      </footer>
    </article>
  );
}