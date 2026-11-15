import type { ReactNode } from "react";
import { Typography } from "../../../components/Typography/Typography";
import { cardWidthDetail, cardWidthHand } from "../../../components/game/cardSizes";
import { HexTileFigureSvg, HexTileScales, type TileFigureTile } from "../../../components/hex/HexTileFigure";
import { hexTileSizeGalleryBoard } from "../../../components/hex/hexTileSizes";
import styles from "./GalleryPage.module.css";

/** A labelled specimen: the thing, a name, and an optional note. */
export function Figure({ children, name, note }: { readonly children: ReactNode; readonly name: string; readonly note?: string }) {
  return (
    <figure className={styles.figure}>
      <div className={styles.stage}>{children}</div>
      <figcaption className={styles.caption}>
        <Typography variant="subtitle2">{name}</Typography>
        {note ? <Typography variant="caption">{note}</Typography> : null}
      </figcaption>
    </figure>
  );
}

export type TileBody = TileFigureTile["body"];

export type FigureTile = TileFigureTile;

/** One or more tiles drawn in their own SVG. Needs <HexDefs /> rendered once on the page. */
export function TileFigure({
  tiles,
  size = hexTileSizeGalleryBoard,
  name,
  note,
}: {
  readonly tiles: readonly FigureTile[];
  readonly size?: number;
  readonly name: string;
  readonly note?: string;
}) {
  return (
    <Figure name={name} {...(note ? { note } : {})}>
      <HexTileFigureSvg tiles={tiles} size={size} ariaLabel={name} />
    </Figure>
  );
}

/** Any tile at board scale and at inspector detail scale (`HexTileDetailPreview`). Every tile kind has a large version. */
export function TileScalesFigure({
  tiles,
  name,
  note,
}: {
  readonly tiles: readonly FigureTile[];
  readonly name: string;
  readonly note?: string;
}) {
  return (
    <figure className={`${styles.figure} ${styles.figureScales}`}>
      <div className={styles.stage}>
        <div className={styles.scales}>
          <HexTileScales tiles={tiles} name={name} />
        </div>
      </div>
      <figcaption className={styles.caption}>
        <Typography variant="subtitle2">{name}</Typography>
        <Typography variant="caption">
          {note ?? "Top: board scale. Below: inspector detail (larger hex; planet pills are slightly larger too)."}
        </Typography>
      </figcaption>
    </figure>
  );
}

/** Playing cards at hand width and inspect zoom (`implementation-plan.md` §5.2). */
export function CardScalesFigure({
  name,
  note,
  render,
}: {
  readonly name: string;
  readonly note?: string;
  render: (width: number) => ReactNode;
}) {
  return (
    <figure className={`${styles.figure} ${styles.figureScales}`}>
      <div className={styles.stage}>
        <div className={styles.scales}>
          {render(cardWidthHand)}
          {render(cardWidthDetail)}
        </div>
      </div>
      <figcaption className={styles.caption}>
        <Typography variant="subtitle2">{name}</Typography>
        <Typography variant="caption">{note ?? "Top: hand (118px). Below: inspect (220px)."}</Typography>
      </figcaption>
    </figure>
  );
}
