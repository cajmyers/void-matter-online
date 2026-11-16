import type { CSSProperties } from "react";
import { ActionToken } from "./ActionToken";
import type { AssetResourceCost } from "./assetCardTypes";
import { crewCardFaceTexture } from "./assetCardArt";
import { crewCardActionTokenSize, crewCardRegionHeights } from "./crewCardLayout";
import { assetCardCostCubeSize } from "./assetCardSizing";
import { cardWidthDetail } from "./cardSizes";
import { ResourceCostBadge } from "./ResourceCostBadge";
import type { ActionTokenKind } from "./resources";
import { Typography } from "../Typography/Typography";
import styles from "./CrewCard.module.css";

export type CrewCardRank = "ensign" | "commander";

export interface CrewCardProps {
  /** Specialty (Ensign type or Commander role). */
  readonly title: string;
  /** Commander character name on the title line; Ensigns omit this and use `title` only. */
  readonly name?: string;
  readonly text: string;
  readonly costs: readonly AssetResourceCost[];
  readonly action: ActionTokenKind;
  readonly rank?: CrewCardRank;
  readonly illustrationUrl?: string;
  readonly width?: number;
}

const rankLabel: Readonly<Record<CrewCardRank, string>> = {
  ensign: "Ensign",
  commander: "Commander",
};

/**
 * Crew card (`CrewCard.module.css` regions, same vocabulary as `AssetCard`):
 * - **Title area** — rank tag + name
 * - **Image area** — portrait; recruitment cost on the rail
 * - **Text box** — trait rules (Commanders) and/or grant text
 * - **Effect area** — officer action token (`ACT-1`)
 */
export function CrewCard({ title, name, text, costs, action, rank = "ensign", illustrationUrl, width = 156 }: CrewCardProps) {
  const characterName = name?.trim();
  const headerTitle = characterName || title;
  const rankTagText = rank === "commander" ? title : rankLabel.ensign;
  const compact = width < 140;
  const detailLayout = width >= cardWidthDetail;
  const faceTextureUrl = crewCardFaceTexture();
  const costSize = assetCardCostCubeSize(width);
  const hasTraitText = text.trim().length > 0;
  const compactTeaser = compact && hasTraitText;
  const artFillOnly = !hasTraitText || compactTeaser;
  const { artPlateHeight, textBlockHeight, footerReserveHeight } = crewCardRegionHeights(width, {
    hasTextBlock: hasTraitText,
    compactTeaser,
  });
  const actionTokenSize = crewCardActionTokenSize(width, footerReserveHeight);

  const style = {
    width,
    "--crew-rim": "var(--game-crew-rim)",
    ...(artPlateHeight > 0 ? { "--art-plate-height": `${artPlateHeight}px` } : {}),
    "--text-block-height": `${textBlockHeight}px`,
    "--footer-reserve-height": `${footerReserveHeight}px`,
    "--crew-face-texture": `url(${faceTextureUrl})`,
  } as CSSProperties;

  return (
    <article
      className={[
        styles.card,
        compact && styles.compact,
        detailLayout && styles.detail,
        styles.withFaceTexture,
        artFillOnly && styles.artFillOnly,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      data-crew-rank={rank}
      aria-label={`${headerTitle}${characterName ? `, ${title}` : ""}, ${rankTagText}, ${action} action${hasTraitText ? `. ${text}` : ""}`}
    >
      <header className={styles.header}>
        <Typography variant="cardFine" className={styles.rankTag}>
          {rankTagText}
        </Typography>
        <Typography variant="cardTitle" className={styles.title}>
          {headerTitle}
        </Typography>
      </header>

      <div className={styles.artPlate} aria-hidden={false}>
        <aside className={styles.costRail} aria-label="Recruitment cost">
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
        {illustrationUrl ? (
          <img className={styles.illustration} src={illustrationUrl} alt="" draggable={false} />
        ) : (
          <div className={styles.portraitPlaceholder} aria-hidden />
        )}
      </div>

      {hasTraitText ? (
        <div
          className={[styles.textBlock, compactTeaser ? styles.specialBand : styles.rulesPanel].join(" ")}
        >
          {compactTeaser ? (
            <Typography variant="cardTitle" className={styles.specialTeaser}>
              Special
            </Typography>
          ) : (
            <Typography variant="cardText" className={styles.rules}>
              {text}
            </Typography>
          )}
        </div>
      ) : null}

      <footer className={styles.footerReserve}>
        <div className={styles.effectRow} aria-hidden>
          <ActionToken kind={action} size={actionTokenSize} />
        </div>
      </footer>
    </article>
  );
}