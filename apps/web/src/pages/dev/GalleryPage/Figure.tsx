import type { ReactNode } from "react";
import { Typography } from "../../../components/Typography/Typography";
import { HexGates, HexTileBody, ShipBadge, type HexTileBodyProps } from "../../../components/hex/HexTile";
import { axialToPixel, type EdgeName } from "../../../components/hex/hexGeometry";
import type { SeatNumber } from "../../../components/game/resources";
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

export type TileBody = Omit<HexTileBodyProps, "x" | "y" | "size">;

export interface FigureTile {
  /** Axial offset from the first tile, in hexes. */
  readonly q?: number;
  readonly r?: number;
  readonly body: TileBody;
  readonly gates?: readonly EdgeName[];
  readonly halfGates?: readonly EdgeName[];
  readonly ship?: { readonly seat: SeatNumber; readonly pinned?: boolean; readonly selected?: boolean; readonly hovered?: boolean };
}

const defaultSize = 62;

/** One or more tiles drawn in their own SVG. Needs <HexDefs /> rendered once on the page. */
export function TileFigure({ tiles, size = defaultSize, name, note }: { readonly tiles: readonly FigureTile[]; readonly size?: number; readonly name: string; readonly note?: string }) {
  const placed = tiles.map((tile) => ({ tile, ...axialToPixel(tile.q ?? 0, tile.r ?? 0, size) }));
  const pad = size * 1.12;
  const minX = Math.min(...placed.map((item) => item.x)) - pad;
  const maxX = Math.max(...placed.map((item) => item.x)) + pad;
  const minY = Math.min(...placed.map((item) => item.y)) - pad;
  const maxY = Math.max(...placed.map((item) => item.y)) + pad;
  return (
    <Figure name={name} {...(note ? { note } : {})}>
      <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} width={maxX - minX} height={maxY - minY} role="group" aria-label={name}>
        {placed.map(({ tile, x, y }, index) => (
          <HexTileBody key={`body-${index}`} x={x} y={y} size={size} {...tile.body} />
        ))}
        {placed.map(({ tile, x, y }, index) => (
          <HexGates key={`gates-${index}`} x={x} y={y} size={size} gates={tile.gates ?? []} halfGates={tile.halfGates ?? []} />
        ))}
        {placed.map(({ tile, x, y }, index) =>
          tile.ship ? <ShipBadge key={`ship-${index}`} x={x + size * 0.28} y={y + size * 0.12} size={size} {...tile.ship} /> : null,
        )}
      </svg>
    </Figure>
  );
}
