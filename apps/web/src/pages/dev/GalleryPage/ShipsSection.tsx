import { seatColourName, seatNumbers } from "../../../components/game/resources";
import { HullTrack } from "../../../components/game/HullTrack";
import { Typography } from "../../../components/Typography/Typography";
import { Figure, TileFigure } from "./Figure";
import styles from "./GalleryPage.module.css";

const plain = { kind: "faceDown", title: "Tile" } as const;

export function ShipsSection() {
  return (
    <section className={styles.section} id="ships">
      <Typography variant="h3">Ships</Typography>
      <Typography variant="body2">
        A ship on the board is the seat colour and the seat shape, with an engine trail. Damage is shown as cubes in the
        hull slots (see Resources and markers); the full ship card comes with the cards.
      </Typography>

      <div className={styles.group}>
        <Typography variant="overline">Corvette in the four seat colours</Typography>
        <div className={styles.grid}>
          {seatNumbers.map((seat) => (
            <TileFigure key={seat} name={`Seat ${seat}, ${seatColourName[seat]}`} tiles={[{ body: { kind: "anomaly", title: "Tile" }, ship: { seat } }]} />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">States</Typography>
        <div className={styles.grid}>
          <TileFigure name="Idle" tiles={[{ body: plain, ship: { seat: 1 } }]} />
          <TileFigure name="Hovered" tiles={[{ body: plain, ship: { seat: 1, hovered: true } }]} />
          <TileFigure name="Selected" tiles={[{ body: plain, ship: { seat: 1, selected: true } }]} />
          <TileFigure name="Pinned" note="Dashed ring (blockade or Evade rules)" tiles={[{ body: plain, ship: { seat: 1, pinned: true } }]} />
          <TileFigure name="Pinned and selected" tiles={[{ body: plain, ship: { seat: 1, pinned: true, selected: true } }]} />
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Rival fleets and hull damage</Typography>
        <div className={styles.grid}>
          <TileFigure
            name="Rival fleets in neighbouring hexes"
            note="Several ships in one hex (stacking and spacing) are settled with the table in 1c"
            tiles={[
              { body: plain, ship: { seat: 1 } },
              { q: 1, body: plain, ship: { seat: 2, pinned: true } },
            ]}
          />
          <Figure name="Damage against hull" note="2 damage on a 3-slot hull">
            <HullTrack capacity={3} damage={2} />
          </Figure>
        </div>
      </div>
    </section>
  );
}
