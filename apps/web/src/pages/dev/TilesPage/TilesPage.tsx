import { seatNumbers } from "../../../components/game/resources";
import { HexDefs } from "../../../components/hex/HexTile";
import { edgeOrder } from "../../../components/hex/hexGeometry";
import { Typography } from "../../../components/Typography/Typography";
import { anomalyFixtures, planetFixtures } from "../../../fixtures/tiles";
import { TileScalesFigure } from "../GalleryPage/Figure";
import galleryStyles from "../GalleryPage/GalleryPage.module.css";
import { buildAnomalyFigure, buildPlanetFigure } from "../tileCatalogFigures";
import { centralNexusPassSupply } from "../../../view/centralNexusPassSupply";
import styles from "./TilesPage.module.css";

const planetGroups = ["High metal", "High fuel", "High component", "High tech"] as const;

/** Full tile catalogue: every planet and anomaly from content, plus Nexus and face-down kinds. */
export default function TilesPage() {
  return (
    <div className={styles.page}>
      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden="true">
        <HexDefs />
      </svg>

      <header className={styles.intro}>
        <Typography variant="overline">Stage 1b</Typography>
        <Typography variant="h1">Tile catalogue</Typography>
        <Typography variant="body1">
          Every tile type and content row at board scale and inspector detail. Gates follow appendices B and C; rotation
          rules in <code>MAP-6</code>.
        </Typography>
      </header>

      <section className={galleryStyles.section} id="nexus">
        <Typography variant="h3">Nexus and face-down</Typography>
        <div className={galleryStyles.group}>
          <div className={galleryStyles.grid}>
            <TileScalesFigure
              name="Face-down"
              note="Non-Nexus tiles before reveal"
              tiles={[{ body: { kind: "faceDown", title: "Face-down tile" } }]}
            />
            <TileScalesFigure
              name="Central Nexus"
              note="Six gates"
              tiles={[
                {
                  body: { kind: "nexusCentral", title: "Central Nexus", passSupply: centralNexusPassSupply },
                  gates: edgeOrder,
                },
              ]}
            />
            {seatNumbers.map((seat) => (
              <TileScalesFigure
                key={seat}
                name={`Outer Rim Nexus (seat ${seat})`}
                note="Four gates from board position"
                tiles={[
                  {
                    body: { kind: "nexusRim", title: `Outer Rim Nexus, seat ${seat}`, seat },
                    gates: ["L", "R", "BR", "BL"],
                  },
                ]}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={galleryStyles.section} id="planets">
        <Typography variant="h3">Planetary systems ({planetFixtures.length})</Typography>
        {planetGroups.map((group) => (
          <div key={group} className={galleryStyles.group}>
            <Typography variant="overline">{group}</Typography>
            <div className={galleryStyles.grid}>
              {planetFixtures
                .filter((planet) => planet.group === group)
                .map((planet) => (
                  <TileScalesFigure
                    key={planet.name}
                    name={planet.name}
                    note={`Pattern ${planet.pattern}`}
                    tiles={[buildPlanetFigure(planet)]}
                  />
                ))}
            </div>
          </div>
        ))}
      </section>

      <section className={galleryStyles.section} id="anomalies">
        <Typography variant="h3">Anomalies ({anomalyFixtures.length})</Typography>
        <Typography variant="body2" className={styles.lead}>
          Discovery bonus at top; Interact or Passive marker at bottom.
        </Typography>
        <div className={galleryStyles.group}>
          <div className={galleryStyles.grid}>
            {anomalyFixtures.map((tile) => (
              <TileScalesFigure
                key={tile.id}
                name={`${tile.number}. ${tile.name}`}
                note={`${tile.ability}, ${tile.gates.length} gates`}
                tiles={[buildAnomalyFigure(tile)]}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}