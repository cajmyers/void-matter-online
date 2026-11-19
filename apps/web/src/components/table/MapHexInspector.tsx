import { useEffect, useMemo, useRef } from "react";
import { Typography } from "../Typography/Typography";
import { HexTileDetailPreview } from "../hex/HexTileFigure";
import { axialKey } from "../hex/hexGeometry";
import type { GameView } from "../../view/gameView";
import { hexInspectorFacts, shipsOnHex } from "../../view/mapHexInspector";
import type { MapHexView } from "../../view/mapView";
import { mapTileViewToBody } from "../../view/mapHexPresentation";
import { InspectorDiscoveryBonus, InspectorResourceAmounts } from "./InspectorResourceRow";
import { InspectorInteractList } from "./InspectorInteractList";
import { InspectorPlanetMarket } from "./InspectorPlanetMarket";
import { InspectorShipList } from "./InspectorShipList";
import styles from "./MapHexInspector.module.css";

export interface MapHexInspectorProps {
  readonly hex: MapHexView;
  readonly view: Pick<GameView, "map" | "ships" | "seats" | "seatCount">;
  readonly onClose: () => void;
}

/** Right-click inspector: detail-scale tile art and fixture facts (`implementation-plan.md` §5.3). */
export function MapHexInspector({ hex, view, onClose }: MapHexInspectorProps) {
  const panelRef = useRef<HTMLElement>(null);
  const ignoreCloseUntil = useRef(0);

  useEffect(() => {
    ignoreCloseUntil.current = performance.now() + 250;
  }, [hex.q, hex.r]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (performance.now() < ignoreCloseUntil.current) return;
      const panel = panelRef.current;
      if (!panel) return;
      if (event.target instanceof Node && panel.contains(event.target)) return;
      onClose();
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [onClose]);

  const body = mapTileViewToBody(hex.tile);
  const title =
    hex.tile.kind === "faceDown"
      ? "Face-down tile"
      : hex.tile.kind === "planet"
        ? hex.tile.planetName
        : hex.tile.kind === "anomaly"
          ? hex.tile.anomalyName
          : hex.tile.kind === "nexusRim"
            ? `Outer Rim Nexus (seat ${hex.tile.seat})`
            : "Central Nexus";
  const facts = hexInspectorFacts(hex, view);
  const shipsOnThisHex = useMemo(() => shipsOnHex(view.ships, hex.q, hex.r), [view.ships, hex.q, hex.r]);
  const gatesByTile = useMemo(
    () => new Map(view.map.map((row) => [axialKey(row.q, row.r), row.gates] as const)),
    [view.map],
  );

  return (
    <div className={styles.root}>
      <button type="button" className={styles.backdrop} aria-label="Close hex inspector" onClick={onClose} />
      <aside
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={`Inspect ${title}`}
      >
        <header className={styles.header}>
          <Typography variant="h5" className={styles.title}>
            {title}
          </Typography>
        </header>
        <div className={styles.preview}>
          <HexTileDetailPreview
            body={{
              ...body,
              ...(hex.tile.kind === "planet" && hex.tile.selected ? { selected: true } : {}),
            }}
            gates={hex.gates}
            q={hex.q}
            r={hex.r}
            gatesByTile={gatesByTile}
            ships={shipsOnThisHex.map((ship) => ({
              seat: ship.seat,
              pinned: ship.pinned,
              selected: ship.selected,
              laneOffset: ship.laneOffset,
            }))}
          />
        </div>
        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <Typography variant="caption" as="dt" className={styles.factLabel}>
                {fact.label}
              </Typography>
              <dd className={styles.factValue}>
                {fact.value.kind === "text" ? (
                  <Typography variant="body2">{fact.value.text}</Typography>
                ) : fact.value.kind === "resources" ? (
                  fact.value.display === "icons" ? (
                    <InspectorResourceAmounts amounts={fact.value.amounts} iconsOnly />
                  ) : (
                    <InspectorResourceAmounts amounts={fact.value.amounts} />
                  )
                ) : fact.value.kind === "ships" ? (
                  <InspectorShipList entries={fact.value.entries} />
                ) : fact.value.kind === "planetMarket" ? (
                  <InspectorPlanetMarket state={fact.value.state} lockCount={fact.value.lockCount} />
                ) : fact.value.kind === "interactList" ? (
                  <InspectorInteractList actions={fact.value.actions} />
                ) : (
                  <InspectorDiscoveryBonus bonus={fact.value.bonus} />
                )}
              </dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}