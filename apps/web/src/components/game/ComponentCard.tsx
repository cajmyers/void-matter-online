import type { CSSProperties } from "react";
import { ResourceCube } from "./ResourceCube";
import { resourceInfo, type ResourceId } from "./resources";
import { Typography } from "../Typography/Typography";
import styles from "./ComponentCard.module.css";

/** Placeholder card art: a procedural scene. Real card art is referenced by card ID later. */
export type CardArtKind = "planet" | "nebula" | "ship";

export interface ComponentCardProps {
  readonly title: string;
  readonly text: string;
  /** The sector resource: it colours the glowing rim and shows in the corner badge. */
  readonly sector: ResourceId;
  readonly cost: readonly ResourceId[];
  readonly art?: CardArtKind;
  /** Card width in px. Height follows the 5:7 card ratio. */
  readonly width?: number;
  readonly note?: string;
}

export function ComponentCard({ title, text, sector, cost, art = "planet", width = 156, note }: ComponentCardProps) {
  const style = { "--rim": `var(--game-resource-${sector})`, width } as CSSProperties;
  return (
    <article className={styles.card} style={style} aria-label={`${title}, ${resourceInfo[sector].name} sector`}>
      <div className={`${styles.art} ${styles[art]}`}>
        <span className={styles.badge}>
          <ResourceCube resource={sector} size={20} />
        </span>
      </div>
      <div className={styles.titleBar}>
        <Typography variant="cardTitle">{title}</Typography>
      </div>
      <div className={styles.body}>
        <Typography variant="cardText">{text}</Typography>
      </div>
      <div className={styles.foot}>
        <span className={styles.cost}>
          {cost.map((resource, index) => (
            <ResourceCube key={`${resource}-${index}`} resource={resource} size={18} />
          ))}
        </span>
        {note ? <Typography variant="cardFine">{note}</Typography> : null}
      </div>
    </article>
  );
}
