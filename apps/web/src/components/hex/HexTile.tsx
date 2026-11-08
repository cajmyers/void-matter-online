import type { CSSProperties } from "react";
import { seatShapePath } from "../game/SeatMark";
import { resourceArt } from "../game/resourceArt";
import { resourceIds, resourceInfo, seatNumbers, type ResourceId, type SeatNumber } from "../game/resources";
import { edgeSegment, hexCorners, pointsAttribute, type EdgeName } from "./hexGeometry";
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
  /** Planet only: full-strength tokens are supply (harvest), ghosted tokens are demand (deliver). */
  readonly supply?: readonly ResourceAmount[];
  readonly demand?: readonly ResourceAmount[];
  /** Planet only: damage cubes locking the supply or demand area (Market Shift removes one per globalRound). */
  readonly lockedSupply?: number;
  readonly lockedDemand?: number;
  /** Anomaly only: the two discovery-bonus resources. */
  readonly bonus?: readonly [ResourceId, ResourceId];
  readonly selected?: boolean;
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
        <stop offset="0" style={{ stopColor: "color-mix(in srgb, var(--game-tile-face-down) 70%, var(--game-space-blue))" }} />
        <stop offset="1" style={{ stopColor: "var(--game-tile-face-down)" }} />
      </radialGradient>
      <linearGradient id="vm-gloss" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

function ResourceRow({
  items,
  y,
  hollow,
  size,
  locked,
}: {
  readonly items: readonly ResourceAmount[];
  readonly y: number;
  readonly hollow: boolean;
  readonly size: number;
  readonly locked: number;
}) {
  if (items.length === 0 && locked === 0) return null;
  const cube = size * 0.24;
  const entryWidth = cube + size * 0.2;
  const total = items.length * entryWidth + (locked > 0 ? cube : 0);
  const start = -total / 2;
  return (
    <g transform={`translate(0 ${y})`}>
      <rect
        x={start - size * 0.08}
        y={-cube / 2 - size * 0.05}
        width={total + size * 0.1}
        height={cube + size * 0.1}
        rx={(cube + size * 0.1) / 2}
        className={styles.pill}
      />
      {items.map((item, index) => {
        const info = resourceInfo[item.resource];
        const left = start + index * entryWidth;
        return (
          <g key={item.resource} transform={`translate(${left} ${-cube / 2})`}>
            <image
              href={resourceArt[item.resource]}
              width={cube}
              height={cube}
              className={hollow ? styles.demandArt : undefined}
            >
              <title>{`${hollow ? "Demand" : "Supply"}: ${item.amount} ${info.name}`}</title>
            </image>
            <text x={cube + size * 0.04} y={cube * 0.82} className={styles.amount} fontSize={size * 0.22}>
              {item.amount}
            </text>
          </g>
        );
      })}
      {locked > 0 ? (
        <g transform={`translate(${start + items.length * entryWidth} ${-cube / 2})`}>
          <rect width={cube} height={cube} rx={cube * 0.2} className={styles.lock}>
            <title>{`${locked} damage cube(s) lock this area`}</title>
          </rect>
          <path d={`M${cube * 0.25} ${cube * 0.25}L${cube * 0.75} ${cube * 0.75}M${cube * 0.75} ${cube * 0.25}L${cube * 0.25} ${cube * 0.75}`} className={styles.lockMark} />
        </g>
      ) : null}
    </g>
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
  const { x, y, size, kind, title, seat, supply = [], demand = [], lockedSupply = 0, lockedDemand = 0, bonus, selected = false } = props;
  const corners = hexCorners(size);
  const rimCorners = hexCorners(size * 0.955);
  const inner = hexCorners(size * 0.78);
  const innermost = hexCorners(size * 0.5);
  const firstSupply = supply[0];
  const rim = rimColour(kind, seat, supply);
  const tileStyle = { "--rim": rim } as CSSProperties;

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
          {firstSupply ? <circle cy={-size * 0.2} r={size * 0.66} fill={`url(#vm-halo-${firstSupply.resource})`} /> : null}
          <circle
            cy={-size * 0.2}
            r={size * 0.36}
            fill={firstSupply ? `url(#vm-planet-${firstSupply.resource})` : "var(--game-tile-planet)"}
            className={styles.sphere}
          />
          <ResourceRow items={supply} y={size * 0.32} hollow={false} size={size} locked={lockedSupply} />
          <ResourceRow items={demand} y={size * 0.63} hollow={true} size={size} locked={lockedDemand} />
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
            <g transform={`translate(0 ${size * 0.55})`}>
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
          <circle r={size * 0.85} fill="url(#vm-halo-nexus)" />
          <polygon points={pointsAttribute(inner)} className={styles.nexusRing} />
          <polygon points={pointsAttribute(innermost)} className={styles.nexusRing} />
          <image className={styles.vmArt} href={resourceArt.vm} x={-size * 0.26} y={-size * 0.26} width={size * 0.52} height={size * 0.52}>
            <title>Void Matter</title>
          </image>
        </>
      ) : null}

      {kind === "nexusRim" && seat ? (
        <>
          <circle r={size * 0.75} fill={`url(#vm-halo-seat-${seat})`} />
          <polygon points={pointsAttribute(inner)} className={styles.nexusRing} style={{ stroke: `var(--game-seat-${seat})`, strokeWidth: 2 }} />
          {/* The label sits low so a ship parked on the tile (drawn at the centre) never covers it. */}
          <text y={size * 0.66} textAnchor="middle" className={styles.nexusLabel} fontSize={size * 0.24}>
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
  readonly gates: readonly EdgeName[];
  /** Edges that carry a gate on this side only (a half connection, MAP-5). */
  readonly halfGates?: readonly EdgeName[];
}

export function HexGates({ x, y, size, gates, halfGates = [] }: HexGatesProps) {
  return (
    <g transform={`translate(${x} ${y})`} pointerEvents="none">
      {gates.map((edge) => {
        const [first, second] = edgeSegment(size, edge, 0.46);
        return <line key={edge} x1={first.x} y1={first.y} x2={second.x} y2={second.y} className={styles.gate} />;
      })}
      {halfGates.map((edge) => {
        const [first, second] = edgeSegment(size, edge, 0.46);
        return <line key={edge} x1={first.x} y1={first.y} x2={second.x} y2={second.y} className={styles.gateHalf} />;
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
