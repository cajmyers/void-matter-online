import { seatNumbers } from "../../../components/game/resources";
import { edgeOrder, rotateEdges } from "../../../components/hex/hexGeometry";
import { Typography } from "../../../components/Typography/Typography";
import { anomalyFixtures, planetFixtures, planetGatePatterns, type PlanetFixture } from "../../../fixtures/tiles";
import { TileFigure, type FigureTile } from "./Figure";
import styles from "./GalleryPage.module.css";

const planetGroups = ["High metal", "High fuel", "High component", "High tech"] as const;

function planetTile(planet: PlanetFixture, extra: { lockedSupply?: number; lockedDemand?: number } = {}): FigureTile {
  return {
    body: { kind: "planet", title: planet.name, supply: planet.supply, demand: planet.demand, ...extra },
    gates: planetGatePatterns[planet.pattern],
  };
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
        <Typography variant="overline">Face-down, Nexus and selection</Typography>
        <div className={styles.grid}>
          <TileFigure name="Face-down" note="Every non-Nexus tile starts here" tiles={[{ body: { kind: "faceDown", title: "Face-down tile" } }]} />
          <TileFigure name="Central Nexus" note="Six gates" tiles={[{ body: { kind: "nexusCentral", title: "Central Nexus" }, gates: edgeOrder }]} />
          {seatNumbers.map((seat) => (
            <TileFigure
              key={seat}
              name={`Outer Rim Nexus, seat ${seat}`}
              note="Gates derived from position (MAP-5)"
              tiles={[{ body: { kind: "nexusRim", title: `Outer Rim Nexus, seat ${seat}`, seat }, gates: ["L", "R", "BR", "BL"] }]}
            />
          ))}
          {aethel ? (
            <TileFigure name="Selected" note="Cyan rim and glow" tiles={[{ ...planetTile(aethel), body: { ...planetTile(aethel).body, selected: true } }]} />
          ) : null}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Planets: all 20, in their four groups (supply full strength, demand ghosted)</Typography>
        {planetGroups.map((group) => (
          <div key={group} className={styles.grid}>
            {planetFixtures
              .filter((planet) => planet.group === group)
              .map((planet) => (
                <TileFigure key={planet.name} name={planet.name} note={`${group}, pattern ${planet.pattern}`} tiles={[planetTile(planet)]} />
              ))}
          </div>
        ))}
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Locked areas (damage cubes on supply or demand)</Typography>
        <div className={styles.grid}>
          {aethel ? <TileFigure name="Supply locked" note="Harvest blocked until cleared" tiles={[planetTile(aethel, { lockedSupply: 2 })]} /> : null}
          {aethel ? <TileFigure name="Demand locked" note="Delivery blocked until cleared" tiles={[planetTile(aethel, { lockedDemand: 2 })]} /> : null}
          {vulkan ? <TileFigure name="Both locked" tiles={[planetTile(vulkan, { lockedSupply: 2, lockedDemand: 2 })]} /> : null}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Anomalies: all 21 (tile 4 is removed, TIL-1), with discovery bonus</Typography>
        <div className={styles.grid}>
          {anomalyFixtures.map((tile) => (
            <TileFigure
              key={tile.number}
              name={`${tile.number}. ${tile.name}`}
              note={`${tile.gates.length} gates`}
              tiles={[{ body: { kind: "anomaly", title: tile.name, bonus: tile.bonus }, gates: tile.gates }]}
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
                tiles={[{ body: { kind: "anomaly", title: `${scrapYard.name}, rotated ${steps * 60} degrees`, bonus: scrapYard.bonus }, gates: rotateEdges(scrapYard.gates, steps) }]}
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
            note="Only tile A has a gate there, drawn dashed and dim"
            tiles={[
              { body: { kind: "anomaly", title: "Tile A" }, halfGates: ["R"] },
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
