import { edgeOrder } from "../../../components/hex/hexGeometry";
import { hrefFor } from "../../../app/useHashRoute";
import { Typography } from "../../../components/Typography/Typography";
import { anomalyFixtures, planetFixtures } from "../../../fixtures/tiles";
import { buildAnomalyFigure, buildPlanetFigure } from "../tileCatalogFigures";
import { centralNexusPassSupply } from "../../../view/centralNexusPassSupply";
import { TileScalesFigure } from "./Figure";
import styles from "./GalleryPage.module.css";

const samplePlanet = planetFixtures[0];
const sampleAnomalyInteract = anomalyFixtures[0];
const sampleAnomalyPassive = anomalyFixtures.find((tile) => tile.ability === "passive");

export function TilesSection() {
  return (
    <section className={styles.section} id="tiles">
      <Typography variant="h3">Tiles</Typography>
      <Typography variant="body2">
        One specimen per tile kind (`MAP-5`, `MAP-6`).{" "}
        <a className={styles.inlineLink} href={hrefFor("/dev/tiles")}>
          Full tile catalogue
        </a>{" "}
        lists every planet, anomaly, and Nexus variant.
      </Typography>

      <div className={styles.group}>
        <Typography variant="overline">Tile kinds (board scale and inspector detail)</Typography>
        <div className={styles.grid}>
          <TileScalesFigure
            name="Central Nexus"
            note="Six gates; hub of the board"
            tiles={[
              {
                body: { kind: "nexusCentral", title: "Central Nexus", passSupply: centralNexusPassSupply },
                gates: edgeOrder,
              },
            ]}
          />
          <TileScalesFigure
            name="Outer Rim Nexus"
            note="Four gates; seat tint from position"
            tiles={[
              {
                body: { kind: "nexusRim", title: "Outer Rim Nexus", seat: 1 },
                gates: ["L", "R", "BR", "BL"],
              },
            ]}
          />
          {samplePlanet ? (
            <TileScalesFigure
              name="Planetary system"
              note={`Example: ${samplePlanet.name} — supply and demand pills, owner art when loaded`}
              tiles={[buildPlanetFigure(samplePlanet)]}
            />
          ) : null}
          {sampleAnomalyInteract ? (
            <TileScalesFigure
              name="Anomaly (Interact)"
              note={`${sampleAnomalyInteract.name} — Interact marker at bottom`}
              tiles={[buildAnomalyFigure(sampleAnomalyInteract)]}
            />
          ) : null}
          {sampleAnomalyPassive ? (
            <TileScalesFigure
              name="Anomaly (Passive)"
              note={`${sampleAnomalyPassive.name} — Passive marker at bottom`}
              tiles={[buildAnomalyFigure(sampleAnomalyPassive)]}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}