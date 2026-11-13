import { HexGates, HexTileBody, ShipBadge, type HexTileBodyProps } from "./HexTile";
import { axialKey, axialToPixel, type EdgeName } from "./hexGeometry";
import { hexTileSizeDetail, hexTileSizeGalleryBoard } from "./hexTileSizes";
import type { SeatNumber } from "../game/resources";
import detailStyles from "./HexTileDetailPreview.module.css";
import figureStyles from "./HexTileFigure.module.css";

export type TileBody = Omit<HexTileBodyProps, "x" | "y" | "size">;

export interface TileFigureTile {
  readonly q?: number;
  readonly r?: number;
  readonly body: TileBody;
  readonly gates?: readonly EdgeName[];
  readonly ship?: {
    readonly seat: SeatNumber;
    readonly pinned?: boolean;
    readonly selected?: boolean;
    readonly hovered?: boolean;
  };
}

function tileFigureViewBox(tiles: readonly TileFigureTile[], size: number) {
  const placed = tiles.map((tile) => ({ tile, ...axialToPixel(tile.q ?? 0, tile.r ?? 0, size) }));
  const pad = size * 1.12;
  const minX = Math.min(...placed.map((item) => item.x)) - pad;
  const maxX = Math.max(...placed.map((item) => item.x)) + pad;
  const minY = Math.min(...placed.map((item) => item.y)) - pad;
  const maxY = Math.max(...placed.map((item) => item.y)) + pad;
  const gatesByTile = new Map(placed.map(({ tile }) => [axialKey(tile.q ?? 0, tile.r ?? 0), tile.gates ?? []] as const));
  return { placed, minX, minY, width: maxX - minX, height: maxY - minY, gatesByTile };
}

/** One or more tiles in an SVG. The page must render `<HexDefs />` once. */
export function HexTileFigureSvg({
  tiles,
  size,
  ariaLabel,
  className,
}: {
  readonly tiles: readonly TileFigureTile[];
  readonly size: number;
  readonly ariaLabel: string;
  readonly className?: string;
}) {
  const { placed, minX, minY, width, height, gatesByTile } = tileFigureViewBox(tiles, size);
  return (
    <svg
      className={className ? `${figureStyles.intrinsic} ${className}` : figureStyles.intrinsic}
      viewBox={`${minX} ${minY} ${width} ${height}`}
      width={width}
      height={height}
      role="group"
      aria-label={ariaLabel}
    >
      {placed.map(({ tile, x, y }, index) => (
        <HexTileBody key={`body-${index}`} x={x} y={y} size={size} {...tile.body} />
      ))}
      {placed.map(({ tile, x, y }, index) => (
        <HexGates
          key={`gates-${index}`}
          x={x}
          y={y}
          size={size}
          q={tile.q ?? 0}
          r={tile.r ?? 0}
          gates={tile.gates ?? []}
          gatesByTile={gatesByTile}
        />
      ))}
      {placed.map(({ tile, x, y }, index) =>
        tile.ship ? (
          <ShipBadge key={`ship-${index}`} x={x + size * 0.28} y={y + size * 0.12} size={size} {...tile.ship} />
        ) : null,
      )}
    </svg>
  );
}

/** Any tile (planet, anomaly, Nexus or face-down) at board and inspector scales, one above the other. */
export function HexTileScales({
  tiles,
  boardSize = hexTileSizeGalleryBoard,
  detailSize = hexTileSizeDetail,
  name,
}: {
  readonly tiles: readonly TileFigureTile[];
  readonly boardSize?: number;
  readonly detailSize?: number;
  readonly name: string;
}) {
  return (
    <>
      <HexTileFigureSvg tiles={tiles} size={boardSize} ariaLabel={`${name}, board size`} />
      <HexTileFigureSvg tiles={tiles} size={detailSize} ariaLabel={`${name}, detail size`} />
    </>
  );
}

/** Large tile art for the inspector details pane (ruling text is added by the host later). */
export function HexTileDetailPreview({
  body,
  gates = [],
}: {
  readonly body: TileBody;
  readonly gates?: readonly EdgeName[];
}) {
  const title = body.title;
  return (
    <div className={detailStyles.root}>
      <HexTileFigureSvg tiles={[{ body, gates }]} size={hexTileSizeDetail} ariaLabel={title} />
    </div>
  );
}
