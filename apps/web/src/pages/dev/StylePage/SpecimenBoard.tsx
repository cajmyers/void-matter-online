import type { SeatNumber } from "../../../components/game/resources";
import {
  axialKey,
  axialToPixel,
  edgeDirections,
  edgeOrder,
  hexDisc,
  rotateEdges,
  type EdgeName,
} from "../../../components/hex/hexGeometry";
import figureStyles from "../../../components/hex/HexTileFigure.module.css";
import { HexGates, HexTileBody, ShipBadge, type HexTileBodyProps } from "../../../components/hex/HexTile";
import { hexTileSizeGalleryBoard } from "../../../components/hex/hexTileSizes";
import { planetDetailArt } from "../../../components/hex/planetTileArt";

// A hand-made 2-seat board (MAP-1: 19 hexes, rows 3, 4, 5, 4, 3; N1 and N2 at opposite corners).
// Tile data is structural seed data from technical-proposal.md appendices B and C.
// It is a look-and-feel specimen, not game data: every other hex is face-down.
// Same hex scale and SVG sizing as the component gallery (`hexTileSizeGalleryBoard`).

const size = hexTileSizeGalleryBoard;

function withPlanetArt(body: Omit<HexTileBodyProps, "x" | "y" | "size">): SpecimenTile["body"] {
  if (body.kind !== "planet") return body;
  const detailArt = planetDetailArt(body.title);
  return detailArt ? { ...body, detailArt } : body;
}
const board = hexDisc(2);
const onMap = new Set(board.map((hex) => axialKey(hex.q, hex.r)));

interface SpecimenTile {
  readonly body: Omit<HexTileBodyProps, "x" | "y" | "size">;
  readonly gates: readonly EdgeName[];
}

function rimGates(q: number, r: number): readonly EdgeName[] {
  // An Outer Rim Nexus has a gate on every side that faces a neighbouring hex (MAP-5).
  return edgeOrder.filter((edge) => {
    const direction = edgeDirections[edge];
    return onMap.has(axialKey(q + direction.q, r + direction.r));
  });
}

const tiles: Readonly<Record<string, SpecimenTile>> = {
  [axialKey(0, 0)]: { body: { kind: "nexusCentral", title: "Central Nexus" }, gates: edgeOrder },
  [axialKey(0, -2)]: { body: { kind: "nexusRim", title: "Outer Rim Nexus, seat 1 start", seat: 1 }, gates: rimGates(0, -2) },
  [axialKey(0, 2)]: { body: { kind: "nexusRim", title: "Outer Rim Nexus, seat 2 start", seat: 2 }, gates: rimGates(0, 2) },
  [axialKey(-1, 0)]: {
    body: withPlanetArt({
      kind: "planet",
      title: "Aethel-9",
      supply: [{ resource: "tc", amount: 4 }],
      demand: [{ resource: "h3", amount: 3 }, { resource: "qp", amount: 2 }],
    }),
    gates: ["TL", "TR", "R"],
  },
  [axialKey(0, -1)]: {
    body: withPlanetArt({
      kind: "planet",
      title: "Kraken's Breath",
      supply: [{ resource: "h3", amount: 5 }],
      demand: [{ resource: "tc", amount: 3 }, { resource: "pc", amount: 2 }],
    }),
    gates: ["TR", "BR", "BL"],
  },
  [axialKey(0, 1)]: {
    body: withPlanetArt({
      kind: "planet",
      title: "Vulkan's Forge",
      supply: [{ resource: "tc", amount: 4 }, { resource: "h3", amount: 2 }],
      demand: [{ resource: "pc", amount: 2 }, { resource: "qp", amount: 3 }],
      lockedDemand: 1,
    }),
    gates: ["TL", "R", "BL"],
  },
  [axialKey(1, 0)]: {
    body: { kind: "anomaly", title: "Graviton Warp Conduit", bonus: ["h3", "qp"] },
    gates: ["TL", "TR", "BR", "BL"],
  },
  [axialKey(-1, 1)]: {
    body: { kind: "anomaly", title: "Dense Asteroid Field", bonus: ["tc", "h3"] },
    gates: ["R", "L"],
  },
  [axialKey(-1, -1)]: {
    body: withPlanetArt({
      kind: "planet",
      title: "Ember Reach",
      supply: [{ resource: "pc", amount: 3 }],
      demand: [{ resource: "qp", amount: 2 }],
    }),
    gates: ["R", "BL"],
  },
  [axialKey(1, 1)]: {
    body: withPlanetArt({
      kind: "planet",
      title: "Cobalt Verge",
      supply: [{ resource: "qp", amount: 4 }],
      demand: [{ resource: "tc", amount: 2 }, { resource: "h3", amount: 2 }],
    }),
    gates: ["TL", "L"],
  },
  [axialKey(2, -1)]: {
    body: { kind: "anomaly", title: "Veil Nebula", bonus: ["pc", "qp"] },
    gates: ["L", "BL"],
  },
  [axialKey(1, -1)]: {
    // Scrap Reclamation Yard, printed TL, R, BL, rotated by two steps on reveal (MAP-6).
    body: { kind: "anomaly", title: "The Scrap Reclamation Yard (rotated)", bonus: ["tc", "pc"] },
    gates: rotateEdges(["TL", "R", "BL"], 2),
  },
};

const fallbackTile: SpecimenTile = { body: { kind: "faceDown", title: "Undiscovered tile" }, gates: [] };

interface Ship {
  readonly q: number;
  readonly r: number;
  readonly seat: SeatNumber;
  readonly offset: number;
  readonly pinned?: boolean;
}

const shipLaneOffset = Math.round(size * 0.28);

const ships: readonly Ship[] = [
  { q: 0, r: -2, seat: 1, offset: 0 },
  { q: 0, r: 2, seat: 2, offset: 0 },
  { q: 1, r: 0, seat: 1, offset: -shipLaneOffset, pinned: true },
  { q: 1, r: 0, seat: 2, offset: shipLaneOffset, pinned: true },
];

export function SpecimenBoard() {
  const placed = board.map((hex) => {
    const centre = axialToPixel(hex.q, hex.r, size);
    const tile = tiles[axialKey(hex.q, hex.r)] ?? fallbackTile;
    return { hex, centre, tile };
  });
  const gatesByTile = new Map(
    board.map((hex) => {
      const key = axialKey(hex.q, hex.r);
      return [key, (tiles[key] ?? fallbackTile).gates] as const;
    }),
  );
  const pad = size * 1.12;
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
      aria-label="Specimen 2-seat board"
    >
      {placed.map(({ hex, centre, tile }) => (
        <HexTileBody key={axialKey(hex.q, hex.r)} x={centre.x} y={centre.y} size={size} {...tile.body} />
      ))}
      {placed.map(({ hex, centre, tile }) => (
        <HexGates
          key={axialKey(hex.q, hex.r)}
          x={centre.x}
          y={centre.y}
          size={size}
          q={hex.q}
          r={hex.r}
          gates={tile.gates}
          gatesByTile={gatesByTile}
        />
      ))}
      {ships.map((ship) => {
        const centre = axialToPixel(ship.q, ship.r, size);
        return (
          <ShipBadge
            key={`${ship.q},${ship.r},${ship.seat}`}
            x={centre.x + ship.offset}
            y={centre.y}
            size={size}
            seat={ship.seat}
            pinned={ship.pinned}
          />
        );
      })}
    </svg>
  );
}
