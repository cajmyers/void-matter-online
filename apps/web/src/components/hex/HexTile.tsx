import { useId, type CSSProperties } from "react";
import { seatShapePath } from "../game/SeatMark";
import { resourceArt } from "../game/resourceArt";
import { resourceIds, resourceInfo, seatNumbers, type ResourceId, type SeatNumber } from "../game/resources";
import { isFullGateOnEdge } from "./gateConnection";
import {
  edgeSegment,
  gateEdgeFraction,
  gateRadiusScale,
  hexBoundingHalfExtents,
  hexCorners,
  pointsAttribute,
  rimRadiusScale,
  type EdgeName,
} from "./hexGeometry";
import {
  hexTileMarketDemandY,
  hexTileMarketLayout,
  hexTileMarketLockStackY,
  hexTileMarketSupplyY,
  type HexTileMarketLayout,
} from "./hexTileSizes";
import { nexusDetailArt } from "./nexusTileArt";
import styles from "./HexTile.module.css";

export type TileKind = "faceDown" | "planet" | "anomaly" | "nexusCentral" | "nexusRim";

export interface ResourceAmount {
  readonly resource: ResourceId;
  readonly amount: number;
}

export interface HexTileBodyProps {
  /** Centre of the tile in board coordinates. */
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly kind: TileKind;
  readonly title: string;
  /** Rim Nexus only. */
  readonly seat?: SeatNumber;
  /** Planet only: supply (harvest) and demand (deliver) rows use full-strength resource art. */
  readonly supply?: readonly ResourceAmount[];
  readonly demand?: readonly ResourceAmount[];
  /**
   * Planet only: damage cubes on the supply or demand area (harvest/fulfil each add 2; blocked while any remain;
   * Market Shift removes 1 per globalRound — design-decisions harvest/fulfil + Market Shift).
   */
  readonly lockedSupply?: number;
  readonly lockedDemand?: number;
  /** Anomaly only: the two discovery-bonus resources. */
  readonly bonus?: readonly [ResourceId, ResourceId];
  readonly selected?: boolean;
  /** Planet only: owner art clipped inside the hex when provided (`assets/tiles/planets`). */
  readonly detailArt?: string;
}

const tileClass: Readonly<Record<TileKind, string>> = {
  faceDown: styles.faceDown ?? "",
  planet: styles.planet ?? "",
  anomaly: styles.anomaly ?? "",
  nexusCentral: styles.nexusCentral ?? "",
  nexusRim: styles.nexusRim ?? "",
};

const starPath = "M0 -1 L0.26 -0.26 L1 0 L0.26 0.26 L0 1 L-0.26 0.26 L-1 0 L-0.26 -0.26 Z";

/**
 * Gradients shared by every tile (lit planets, nebulae, halos, engine trails). SVG ids are
 * document-wide, so render <HexDefs /> ONCE per page, in any <svg>; every HexTileBody and
 * ShipBadge on the page then finds them. (A page may hide them in a zero-size <svg>.)
 */
export function HexDefs() {
  return (
    <defs>
      {resourceIds.map((resource) => (
        <radialGradient key={resource} id={`vm-planet-${resource}`} cx="34%" cy="28%" r="78%">
          <stop offset="0" style={{ stopColor: `color-mix(in srgb, var(--game-resource-${resource}) 45%, white)` }} />
          <stop offset="0.42" style={{ stopColor: `var(--game-resource-${resource})` }} />
          <stop offset="1" style={{ stopColor: `color-mix(in srgb, var(--game-resource-${resource}) 16%, black)` }} />
        </radialGradient>
      ))}
      {resourceIds.map((resource) => (
        <radialGradient key={`halo-${resource}`} id={`vm-halo-${resource}`}>
          <stop offset="0.45" style={{ stopColor: `var(--game-resource-${resource})`, stopOpacity: 0.5 }} />
          <stop offset="1" style={{ stopColor: `var(--game-resource-${resource})`, stopOpacity: 0 }} />
        </radialGradient>
      ))}
      {seatNumbers.map((seat) => (
        <radialGradient key={`seat-${seat}`} id={`vm-halo-seat-${seat}`}>
          <stop offset="0.3" style={{ stopColor: `var(--game-seat-${seat})`, stopOpacity: 0.4 }} />
          <stop offset="1" style={{ stopColor: `var(--game-seat-${seat})`, stopOpacity: 0 }} />
        </radialGradient>
      ))}
      {seatNumbers.map((seat) => (
        <linearGradient key={`trail-${seat}`} id={`vm-trail-${seat}`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" style={{ stopColor: `var(--game-seat-${seat})`, stopOpacity: 0.95 }} />
          <stop offset="1" style={{ stopColor: `var(--game-seat-${seat})`, stopOpacity: 0 }} />
        </linearGradient>
      ))}
      <radialGradient id="vm-halo-nexus">
        <stop offset="0.25" style={{ stopColor: "var(--game-rim-nexus)", stopOpacity: 0.55 }} />
        <stop offset="1" style={{ stopColor: "var(--game-rim-nexus)", stopOpacity: 0 }} />
      </radialGradient>
      <radialGradient id="vm-nebula-a" cx="42%" cy="40%" r="62%">
        <stop offset="0" style={{ stopColor: "color-mix(in srgb, var(--game-rim-anomaly) 55%, white)", stopOpacity: 0.95 }} />
        <stop offset="0.5" style={{ stopColor: "var(--game-space-purple)", stopOpacity: 0.85 }} />
        <stop offset="1" style={{ stopColor: "var(--game-space-purple)", stopOpacity: 0 }} />
      </radialGradient>
      <radialGradient id="vm-nebula-b" cx="60%" cy="58%" r="60%">
        <stop offset="0" style={{ stopColor: "var(--palette-primary-main)", stopOpacity: 0.7 }} />
        <stop offset="1" style={{ stopColor: "var(--game-space-teal)", stopOpacity: 0 }} />
      </radialGradient>
      <radialGradient id="vm-facedown" cx="50%" cy="42%" r="70%">
        <stop offset="0" style={{ stopColor: "color-mix(in srgb, var(--game-tile-nexus-rim) 70%, var(--game-space-blue))" }} />
        <stop offset="1" style={{ stopColor: "var(--game-tile-nexus-rim)" }} />
      </radialGradient>
      <linearGradient id="vm-gloss" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

function DamageLockCube({ x, y, size }: { readonly x: number; readonly y: number; readonly size: number }) {
  const half = size / 2;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-half} y={-half} width={size} height={size} rx={size * 0.2} className={styles.lock} />
      <path
        d={`M${-half * 0.5} ${-half * 0.5}L${half * 0.5} ${half * 0.5}M${half * 0.5} ${-half * 0.5}L${-half * 0.5} ${half * 0.5}`}
        className={styles.lockMark}
      />
    </g>
  );
}

/** One cube per remaining lock, centred above (supply) or below (demand) the market pill. */
function MarketLockStack({
  count,
  rowLabel,
  layout,
  side,
}: {
  readonly count: number;
  readonly rowLabel: "Supply" | "Demand";
  readonly layout: HexTileMarketLayout;
  readonly side: "above" | "below";
}) {
  if (count <= 0) return null;
  const { cube } = layout;
  const centerY = hexTileMarketLockStackY(layout, side);
  const step = cube + Math.max(2, Math.round(cube * 0.12));
  const span = (count - 1) * step;
  return (
    <g>
      <title>
        {`${count} damage cube(s) block ${rowLabel.toLowerCase()}; harvest/fulfil adds 2; Market Shift removes 1 per globalRound`}
      </title>
      {Array.from({ length: count }, (_, index) => {
        const x = count === 1 ? 0 : -span / 2 + index * step;
        return <DamageLockCube key={index} x={x} y={centerY} size={cube} />;
      })}
    </g>
  );
}

function ResourceRow({
  items,
  y,
  rowLabel,
  locked,
  layout,
}: {
  readonly items: readonly ResourceAmount[];
  readonly y: number;
  readonly rowLabel: "Supply" | "Demand";
  readonly locked: number;
  readonly layout: HexTileMarketLayout;
}) {
  if (items.length === 0 && locked === 0) return null;
  const { cube, pillHeight, pillWidth, pillPadY, entryTail, fontSize, textOffsetX } = layout;
  const entryWidth = cube + entryTail;
  const contentWidth = items.length * entryWidth;
  const start = -contentWidth / 2;
  const lockSide = rowLabel === "Supply" ? "above" : "below";
  const lockStack = <MarketLockStack count={locked} rowLabel={rowLabel} layout={layout} side={lockSide} />;
  return (
    <g transform={`translate(0 ${y})`}>
      {lockSide === "above" ? lockStack : null}
      <rect
        x={-pillWidth / 2}
        y={-cube / 2 - pillPadY}
        width={pillWidth}
        height={pillHeight}
        rx={pillHeight / 2}
        className={styles.marketPill}
      />
      {items.map((item, index) => {
        const info = resourceInfo[item.resource];
        const left = start + index * entryWidth;
        return (
          <g key={item.resource} transform={`translate(${left} ${-cube / 2})`}>
            <image href={resourceArt[item.resource]} width={cube} height={cube}>
              <title>{`${rowLabel}: ${item.amount} ${info.name}`}</title>
            </image>
            <text x={cube + textOffsetX} y={cube * 0.82} className={styles.amount} fontSize={fontSize}>
              {item.amount}
            </text>
          </g>
        );
      })}
      {lockSide === "below" ? lockStack : null}
    </g>
  );
}

function HexTileClippedArt({
  clipId,
  href,
  artTitle,
  artClip,
  artBounds,
}: {
  readonly clipId: string;
  readonly href: string;
  readonly artTitle: string;
  readonly artClip: ReturnType<typeof hexCorners>;
  readonly artBounds: ReturnType<typeof hexBoundingHalfExtents>;
}) {
  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <polygon points={pointsAttribute(artClip)} />
        </clipPath>
      </defs>
      <image
        href={href}
        x={-artBounds.halfWidth}
        y={-artBounds.halfHeight}
        width={artBounds.halfWidth * 2}
        height={artBounds.halfHeight * 2}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
        className={styles.planetDetailArt}
      >
        <title>{artTitle}</title>
      </image>
    </>
  );
}

function rimColour(kind: TileKind, seat: SeatNumber | undefined, supply: readonly ResourceAmount[]): string {
  if (kind === "nexusCentral") return "var(--game-rim-nexus)";
  if (kind === "nexusRim" && seat) return `var(--game-seat-${seat})`;
  if (kind === "anomaly") return "var(--game-rim-anomaly)";
  const first = supply[0];
  if (kind === "planet" && first) return `var(--game-resource-${first.resource})`;
  return "var(--game-tile-edge)";
}

/** The tile body. Draw all bodies first, then all gates, so a neighbour never covers a gate on a shared edge. */
export function HexTileBody(props: HexTileBodyProps) {
  const {
    x,
    y,
    size,
    kind,
    title,
    seat,
    supply = [],
    demand = [],
    lockedSupply = 0,
    lockedDemand = 0,
    bonus,
    selected = false,
    detailArt,
  } = props;
  const hexArtClipId = useId();
  const corners = hexCorners(size);
  const rimCorners = hexCorners(size * rimRadiusScale);
  const inner = hexCorners(size * 0.78);
  const innermost = hexCorners(size * 0.5);
  const firstSupply = supply[0];
  const usePlanetDetailArt = kind === "planet" && detailArt !== undefined;
  const nexusArt =
    kind === "nexusCentral"
      ? nexusDetailArt("nexusCentral")
      : kind === "nexusRim" && seat !== undefined
        ? nexusDetailArt("nexusRim", seat)
        : undefined;
  const marketLayout = kind === "planet" ? hexTileMarketLayout(size) : undefined;
  const artClipRadius = size * 0.94;
  const artClip = hexCorners(artClipRadius);
  const artBounds = hexBoundingHalfExtents(artClipRadius);
  const accent = rimColour(kind, seat, supply);
  const tileStyle = {
    "--rim": accent,
    "--plate-border": "var(--game-tile-plate-border)",
  } as CSSProperties;

  return (
    <g
      transform={`translate(${x} ${y})`}
      className={selected ? `${styles.tile} ${styles.selected}` : styles.tile}
      style={tileStyle}
    >
      <title>{title}</title>
      <polygon points={pointsAttribute(corners)} className={`${styles.body} ${tileClass[kind]}`} />

      {kind === "faceDown" ? (
        <>
          <polygon points={pointsAttribute(corners)} fill="url(#vm-facedown)" />
          <polygon points={pointsAttribute(inner)} className={styles.faceDownInner} />
          <text y={size * 0.2} textAnchor="middle" className={styles.questionMark} fontSize={size * 0.58}>
            ?
          </text>
        </>
      ) : null}

      {kind === "planet" ? (
        <>
          {usePlanetDetailArt ? (
            <HexTileClippedArt
              clipId={hexArtClipId}
              href={detailArt}
              artTitle={title}
              artClip={artClip}
              artBounds={artBounds}
            />
          ) : (
            <>
              {firstSupply ? <circle cy={-size * 0.2} r={size * 0.66} fill={`url(#vm-halo-${firstSupply.resource})`} /> : null}
              <circle
                cy={-size * 0.2}
                r={size * 0.36}
                fill={firstSupply ? `url(#vm-planet-${firstSupply.resource})` : "var(--game-tile-planet)"}
                className={styles.sphere}
              />
            </>
          )}
          {marketLayout ? (
            <>
              <ResourceRow items={supply} y={hexTileMarketSupplyY(size)} rowLabel="Supply" locked={lockedSupply} layout={marketLayout} />
              <ResourceRow items={demand} y={hexTileMarketDemandY(size)} rowLabel="Demand" locked={lockedDemand} layout={marketLayout} />
            </>
          ) : null}
        </>
      ) : null}

      {kind === "anomaly" ? (
        <>
          <circle cy={-size * 0.12} r={size * 0.74} fill="url(#vm-nebula-a)" />
          <circle cx={size * 0.1} cy={-size * 0.04} r={size * 0.5} fill="url(#vm-nebula-b)" />
          <g transform={`translate(0 ${-size * 0.14}) scale(${size * 0.3})`}>
            <path d={starPath} className={styles.anomalyStar} />
          </g>
          {bonus ? (
            <g transform={`translate(0 ${-size * 0.62})`}>
              <rect
                x={-size * 0.3}
                y={-size * 0.15}
                width={size * 0.6}
                height={size * 0.3}
                rx={size * 0.15}
                className={styles.pill}
              />
              {bonus.map((resource, index) => {
                const cube = size * 0.22;
                return (
                  <image
                    key={`${resource}-${index}`}
                    href={resourceArt[resource]}
                    x={index === 0 ? -cube - 1.5 : 1.5}
                    y={-cube / 2}
                    width={cube}
                    height={cube}
                  >
                    <title>{`Discovery bonus: ${resourceInfo[resource].name}`}</title>
                  </image>
                );
              })}
            </g>
          ) : null}
        </>
      ) : null}

      {kind === "nexusCentral" ? (
        <>
          {nexusArt ? (
            <HexTileClippedArt
              clipId={`${hexArtClipId}-central`}
              href={nexusArt}
              artTitle={title}
              artClip={artClip}
              artBounds={artBounds}
            />
          ) : (
            <>
              <circle r={size * 0.85} fill="url(#vm-halo-nexus)" />
              <polygon points={pointsAttribute(inner)} className={styles.nexusRing} />
              <polygon points={pointsAttribute(innermost)} className={styles.nexusRing} />
            </>
          )}
        </>
      ) : null}

      {kind === "nexusRim" && seat ? (
        <>
          {nexusArt ? (
            <HexTileClippedArt
              clipId={`${hexArtClipId}-rim-${seat}`}
              href={nexusArt}
              artTitle={title}
              artClip={artClip}
              artBounds={artBounds}
            />
          ) : (
            <>
              <circle r={size * 0.75} fill={`url(#vm-halo-seat-${seat})`} />
              <polygon points={pointsAttribute(inner)} className={styles.nexusRing} style={{ stroke: `var(--game-seat-${seat})`, strokeWidth: 2 }} />
            </>
          )}
          {/* The label sits low so a ship parked on the tile (drawn at the centre) never covers it. */}
          {/* A pill behind the label keeps it legible over the busy tile art. */}
          <rect
            x={-size * 0.24}
            y={size * 0.66 - size * 0.18}
            width={size * 0.48}
            height={size * 0.36}
            rx={size * 0.18}
            className={styles.pill}
          />
          <text y={size * 0.66} textAnchor="middle" dominantBaseline="central" className={styles.nexusLabel} fontSize={size * 0.24}>
            {`N${seat}`}
          </text>
        </>
      ) : null}

      <polygon points={pointsAttribute(corners)} fill="url(#vm-gloss)" pointerEvents="none" />
      <polygon points={pointsAttribute(rimCorners)} className={styles.rim} pointerEvents="none" />
    </g>
  );
}

export interface HexGatesProps {
  readonly x: number;
  readonly y: number;
  readonly size: number;
  /** Printed warp gates on this tile (`MAP-5`). Half-connected edges look the same; only one hex has a gate there. */
  readonly gates: readonly EdgeName[];
  /** With axial coords and the board gate map, connected edges render white (`MAP-5`). */
  readonly q?: number;
  readonly r?: number;
  readonly gatesByTile?: ReadonlyMap<string, readonly EdgeName[]>;
}

export function HexGates({ x, y, size, gates, q, r, gatesByTile }: HexGatesProps) {
  return (
    <g transform={`translate(${x} ${y})`} pointerEvents="none">
      {gates.map((edge) => {
        const full =
          q !== undefined && r !== undefined && gatesByTile !== undefined && isFullGateOnEdge(q, r, edge, gatesByTile);
        const [first, second] = edgeSegment(size, edge, gateEdgeFraction, gateRadiusScale);
        return (
          <line
            key={edge}
            x1={first.x}
            y1={first.y}
            x2={second.x}
            y2={second.y}
            className={full ? (styles.gateFull ?? styles.gate) : styles.gate}
          />
        );
      })}
    </g>
  );
}

export interface ShipBadgeProps {
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly seat: SeatNumber;
  readonly pinned?: boolean;
  readonly selected?: boolean;
  readonly hovered?: boolean;
}

/** A ship on the board: the seat colour and the seat shape (never colour alone), with an engine trail. */
export function ShipBadge({ x, y, size, seat, pinned = false, selected = false, hovered = false }: ShipBadgeProps) {
  const radius = size * 0.2;
  const trail = radius * 4.4;
  const glow = { "--ship": `var(--game-seat-${seat})` } as CSSProperties;
  return (
    <g transform={`translate(${x} ${y})`} style={glow} className={styles.ship}>
      <title>{`Ship, seat ${seat}${pinned ? ", pinned" : ""}${selected ? ", selected" : ""}`}</title>
      <g transform="rotate(-25)">
        <polygon points={`0,${-radius * 0.55} ${-trail},0 0,${radius * 0.55}`} fill={`url(#vm-trail-${seat})`} />
      </g>
      {pinned ? <circle r={radius + 5} className={styles.pinned} /> : null}
      {hovered ? <circle r={radius + 4} className={styles.hoverRing} /> : null}
      {selected ? <circle r={radius + 7} className={styles.selectRing} /> : null}
      <circle r={radius} style={{ fill: `var(--game-seat-${seat})` }} className={styles.shipDisc} />
      <g transform={`translate(${-radius * 0.62} ${-radius * 0.62}) scale(${(radius * 1.24) / 24})`}>
        <path d={seatShapePath(seat)} style={{ fill: `var(--game-seat-${seat}-contrast)` }} />
      </g>
    </g>
  );
}
