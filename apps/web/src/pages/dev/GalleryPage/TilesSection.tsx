import { seatNumbers } from "../../../components/game/resources";
import { anomalyDetailArt } from "../../../components/hex/anomalyTileArt";
import { planetDetailArt } from "../../../components/hex/planetTileArt";
import { edgeOrder, rotateEdges } from "../../../components/hex/hexGeometry";
import { Typography } from "../../../components/Typography/Typography";
import { anomalyFixtures, planetFixtures, planetGatePatterns, type PlanetFixture } from "../../../fixtures/tiles";
import { TileFigure, TileScalesFigure, type FigureTile } from "./Figure";
import styles from "./GalleryPage.module.css";

const planetGroups = ["High metal", "High fuel", "High component", "High tech"] as const;

function planetTile(planet: PlanetFixture, extra: { lockedSupply?: number; lockedDemand?: number } = {}): FigureTile {
  const detailArt = planetDetailArt(planet.name);
  return {
    body: {
      kind: "planet",
      title: planet.name,
      supply: planet.supply,
      demand: planet.demand,
      ...(detailArt ? { detailArt } : {}),
      ...extra,
    },
    gates: planetGatePatterns[planet.pattern],
  };
}

/** Spread helper: `detailArt` is only set when the art file exists (exactOptionalPropertyTypes). */
function artProp(url: string | undefined): { detailArt?: string } {
  return url ? { detailArt: url } : {};
}

const aethel = planetFixtures[0];
const vulkan = planetFixtures[1];
const scrapYard = anomalyFixtures[0];

export function TilesSection() {
  return (
    <section className={styles.section} id="tiles">
      <Typography variant="h3">Tiles</Typography>
      <Typography variant="body2">
        Gates sit on the tile edges (<code>MAP-5</code>). Planet and Anomaly gates here are the printed orientations from
        technical-proposal Appendices B and C; the player rotates a tile on reveal (<code>MAP-6</code>).
      </Typography>

      <div className={styles.group}>
        <Typography variant="overline">Face-down, Nexus and selection (each at board and inspector scale)</Typography>
        <div className={styles.grid}>
          <TileScalesFigure name="Face-down" note="Every non-Nexus tile starts here" tiles={[{ body: { kind: "faceDown", title: "Face-down tile" } }]} />
          <TileScalesFigure name="Central Nexus" note="Six gates" tiles={[{ body: { kind: "nexusCentral", title: "Central Nexus" }, gates: edgeOrder }]} />
          {seatNumbers.map((seat) => (
            <TileScalesFigure
              key={seat}
              name={`Outer Rim Nexus, seat ${seat}`}
              note="Gates derived from position (MAP-5)"
              tiles={[{ body: { kind: "nexusRim", title: `Outer Rim Nexus, seat ${seat}`, seat }, gates: ["L", "R", "BR", "BL"] }]}
            />
          ))}
          {aethel ? (
            <TileScalesFigure name="Selected" note="Cyan rim and glow" tiles={[{ ...planetTile(aethel), body: { ...planetTile(aethel).body, selected: true } }]} />
          ) : null}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">
          Planets: all 20, in their four groups (supply top, demand bottom). Each row shows board scale and
          inspector detail scale; both use art from <code>src/assets/tiles/planets/</code> when present (see README there).
        </Typography>
        {planetGroups.map((group) => (
          <div key={group} className={styles.grid}>
            {planetFixtures
              .filter((planet) => planet.group === group)
              .map((planet) => (
                <TileScalesFigure
                  key={planet.name}
                  name={planet.name}
                  note={`${group}, pattern ${planet.pattern}`}
                  tiles={[planetTile(planet)]}
                />
              ))}
          </div>
        ))}
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Locked areas (damage cubes on supply or demand)</Typography>
        <div className={styles.grid}>
          {aethel ? (
            <TileScalesFigure
              name="Supply locked"
              note="Harvest adds 2 cubes centred above the pill; Market Shift removes 1 per globalRound"
              tiles={[planetTile(aethel, { lockedSupply: 2 })]}
            />
          ) : null}
          {aethel ? (
            <TileScalesFigure
              name="Demand locked"
              note="Fulfil adds 2 cubes below the demand pill; 1 cube left = still blocked"
              tiles={[planetTile(aethel, { lockedDemand: 2 })]}
            />
          ) : null}
          {vulkan ? <TileScalesFigure name="Both locked" tiles={[planetTile(vulkan, { lockedSupply: 2, lockedDemand: 2 })]} /> : null}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Anomalies: all 21 (tile 4 is removed, TIL-1), with discovery bonus, each at board and inspector scale</Typography>
        <div className={styles.grid}>
          {anomalyFixtures.map((tile) => (
            <TileScalesFigure
              key={tile.number}
              name={`${tile.number}. ${tile.name}`}
              note={`${tile.gates.length} gates`}
              tiles={[{ body: { kind: "anomaly", title: tile.name, bonus: tile.bonus, ...artProp(anomalyDetailArt(tile.name)) }, gates: tile.gates }]}
            />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Rotation: one tile at each of its six orientations (MAP-6)</Typography>
        {scrapYard ? (
          <div className={styles.grid}>
            {[0, 1, 2, 3, 4, 5].map((steps) => (
              <TileFigure
                key={steps}
                name={`Rotated ${steps * 60}°`}
                note={scrapYard.name}
                tiles={[{ body: { kind: "anomaly", title: `${scrapYard.name}, rotated ${steps * 60} degrees`, bonus: scrapYard.bonus, ...artProp(anomalyDetailArt(scrapYard.name)) }, gates: rotateEdges(scrapYard.gates, steps) }]}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Connections: a gate on both sides joins; a gate on one side does not (MAP-5)</Typography>
        <div className={styles.grid}>
          <TileFigure
            name="Full connection"
            note="Both tiles have a gate on the shared edge"
            tiles={[
              { body: { kind: "anomaly", title: "Tile A" }, gates: ["R"] },
              { q: 1, body: { kind: "anomaly", title: "Tile B" }, gates: ["L"] },
            ]}
          />
          <TileFigure
            name="Half connection"
            note="Only tile A has a gate on the shared edge"
            tiles={[
              { body: { kind: "anomaly", title: "Tile A" }, gates: ["R"] },
              { q: 1, body: { kind: "anomaly", title: "Tile B" } },
            ]}
          />
          <TileFigure
            name="No connection"
            tiles={[
              { body: { kind: "anomaly", title: "Tile A" } },
              { q: 1, body: { kind: "anomaly", title: "Tile B" } },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
