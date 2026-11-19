import type { MouseEvent as ReactMouseEvent } from "react";
import { axialKey, axialToPixel } from "../hex/hexGeometry";
import { HexGates, HexTileBody, ShipBadge } from "../hex/HexTile";
import figureStyles from "../hex/HexTileFigure.module.css";
import { hexTileSizeBoard } from "../hex/hexTileSizes";
import type { GameView } from "../../view/gameView";
import { mapTileViewToBody } from "../../view/mapHexPresentation";
import type { MapHexView } from "../../view/mapView";

export interface GameBoardProps {
  readonly view: Pick<GameView, "map" | "ships">;
  readonly hexSize?: number;
  readonly inspectedHex?: { readonly q: number; readonly r: number };
  readonly selectedShipInstanceId?: string;
  readonly onInspectHex?: (hex: MapHexView, event: ReactMouseEvent<SVGGElement>) => void;
}

/** SVG hex map from a `GameView` map slice. Parent must render `<HexDefs />` once on the page. */
export function GameBoard({
  view,
  hexSize = hexTileSizeBoard,
  inspectedHex,
  selectedShipInstanceId,
  onInspectHex,
}: GameBoardProps) {
  const placed = view.map.map((hex) => {
    const centre = axialToPixel(hex.q, hex.r, hexSize);
    const body = mapTileViewToBody(hex.tile);
    return { hex, centre, body, gates: hex.gates };
  });

  const gatesByTile = new Map(view.map.map((hex) => [axialKey(hex.q, hex.r), hex.gates] as const));

  const pad = hexSize * 1.15;
  const xs = placed.map(({ centre }) => centre.x);
  const ys = placed.map(({ centre }) => centre.y);
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const width = Math.max(...xs) - minX + pad;
  const height = Math.max(...ys) - minY + pad;

  return (
    <svg
      className={figureStyles.intrinsic}
      viewBox={`${minX} ${minY} ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label="Void Matter game board"
    >
      {placed.map(({ hex, centre, body }) => {
        const inspected = inspectedHex?.q === hex.q && inspectedHex?.r === hex.r;
        return (
          <HexTileBody
            key={axialKey(hex.q, hex.r)}
            x={centre.x}
            y={centre.y}
            size={hexSize}
            interactive
            onContextMenu={
              onInspectHex
                ? (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onInspectHex(hex, event);
                  }
                : undefined
            }
            {...body}
            selected={inspected || Boolean(body.selected)}
          />
        );
      })}
      {placed.map(({ hex, centre, gates }) => (
        <HexGates
          key={`gates-${axialKey(hex.q, hex.r)}`}
          x={centre.x}
          y={centre.y}
          size={hexSize}
          q={hex.q}
          r={hex.r}
          gates={gates}
          gatesByTile={gatesByTile}
        />
      ))}
      {view.ships.map((ship) => {
        const centre = axialToPixel(ship.q, ship.r, hexSize);
        const lanePx =
          ship.laneOffset !== undefined ? Math.round(hexSize * 0.28) * ship.laneOffset : 0;
        return (
          <ShipBadge
            key={`${ship.seat}-${ship.q},${ship.r}-${ship.laneOffset ?? 0}`}
            x={centre.x + lanePx}
            y={centre.y}
            size={hexSize}
            seat={ship.seat}
            pinned={ship.pinned}
            selected={
              selectedShipInstanceId !== undefined
                ? ship.instanceId === selectedShipInstanceId
                : Boolean(ship.selected)
            }
            hovered={ship.hovered}
            pointerEvents={false}
          />
        );
      })}
    </svg>
  );
}