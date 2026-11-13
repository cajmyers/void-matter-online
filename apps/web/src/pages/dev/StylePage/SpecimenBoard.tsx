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
import { anomalyDetailArt } from "../../../components/hex/anomalyTileArt";
import { planetDetailArt } from "../../../components/hex/planetTileArt";
import { anomalyFixtures, planetFixtures } from "../../../fixtures/tiles";

// A hand-made 2-seat board (MAP-1: 19 hexes, rows 3, 4, 5, 4, 3; N1 and N2 at opposite corners).
// Tile data is structural seed data from technical-proposal.md appendices B and C.
// It is a look-and-feel specimen, not game data: every other hex is face-down.
// Same hex scale and SVG sizing as the component gallery (`hexTileSizeGalleryBoard`).

const size = hexTileSizeGalleryBoard;

type SpecimenBody = Omit<HexTileBodyProps, "x" | "y" | "size">;

/** A planet from the fixtures (real name, supply and demand), with its art when the file exists. */
function planetBody(name: string, extra: { lockedSupply?: number; lockedDemand?: number } = {}): SpecimenBody {
  const planet = planetFixtures.find((candidate) => candidate.name === name);
  if (!planet) throw new Error(`Unknown planet fixture: ${name}`);
  const detailArt = planetDetailArt(planet.name);
  return {
    kind: "planet",
    title: planet.name,
    supply: planet.supply,
    demand: planet.demand,
    ...(detailArt ? { detailArt } : {}),
    ...extra,
  };
}

/** An Anomaly from the fixtures (real name and discovery bonus), with its art when the file exists. */
function anomalyBody(name: string, title: string = name): SpecimenBody {
  const tile = anomalyFixtures.find((candidate) => candidate.name === name);
  if (!tile) throw new Error(`Unknown anomaly fixture: ${name}`);
  const detailArt = anomalyDetailArt(tile.name);
  return { kind: "anomaly", title, bonus: tile.bonus, ...(detailArt ? { detailArt } : {}) };
}
const board = hexDisc(2);
const onMap = new Set(board.map((hex) => axialKey(hex.q, hex.r)));

interface SpecimenTile {
  readonly body: SpecimenBody;
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
  [axialKey(-1, 0)]: { body: planetBody("Aethel-9"), gates: ["TL", "TR", "R"] },
  [axialKey(0, -1)]: { body: planetBody("Kraken's Breath"), gates: ["TR", "BR", "BL"] },
  [axialKey(0, 1)]: { body: planetBody("Vulkan's Forge", { lockedDemand: 1 }), gates: ["TL", "R", "BL"] },
  [axialKey(1, 0)]: { body: anomalyBody("Graviton Warp Conduit"), gates: ["TL", "TR", "BR", "BL"] },
  [axialKey(-1, 1)]: { body: anomalyBody("Dense Asteroid Field"), gates: ["R", "L"] },
  [axialKey(-1, -1)]: { body: planetBody("Stallos Prime"), gates: ["R", "BL"] },
  [axialKey(1, 1)]: { body: planetBody("Solaria Prime"), gates: ["TL", "L"] },
  [axialKey(2, -1)]: { body: anomalyBody("EMP Array Substation"), gates: ["L", "BL"] },
  [axialKey(1, -1)]: {
    // Scrap Reclamation Yard, printed TL, R, BL, rotated by two steps on reveal (MAP-6).
    body: anomalyBody("The Scrap Reclamation Yard", "The Scrap Reclamation Yard (rotated)"),
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
