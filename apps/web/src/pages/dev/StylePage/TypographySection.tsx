import { Button } from "../../../components/Button/Button";
import { Typography, type TypographyVariant } from "../../../components/Typography/Typography";
import styles from "./StylePage.module.css";

const samples: readonly { variant: TypographyVariant; text: string }[] = [
  { variant: "h1", text: "Void Matter" },
  { variant: "h2", text: "Adventures in the Outer Rim" },
  { variant: "h3", text: "Maintenance phase" },
  { variant: "h4", text: "Central Nexus" },
  { variant: "h5", text: "Nomad-class Corvette" },
  { variant: "h6", text: "Upgrade at an Outer Rim Nexus" },
  { variant: "subtitle1", text: "Redeem a mission to take your third Void Matter." },
  { variant: "subtitle2", text: "Cargo is exposed. The pool is safe." },
  { variant: "body1", text: "Players alternate one action at a time. A player may pass at any time, which exhausts all their remaining tokens and takes one resource from the Central Nexus." },
  { variant: "body2", text: "A ship cannot choose cubes unless every hit in the event fits in its free slots. Otherwise it must discard a component." },
  { variant: "button", text: "Take 2 cubes" },
  { variant: "caption", text: "globalRound 3, Action phase, turn: Seat 1" },
  { variant: "overline", text: "Damage choice" },
  { variant: "cardTitle", text: "Energy Shields" },
  { variant: "cardText", text: "Each energy weapon's hits are reduced to at most 1, per weapon." },
  { variant: "cardFine", text: "Sector 4 Hull / Defensive. Specimen text." },
  { variant: "numeric", text: "TC 4   H3 2   PC 0   QP 3   VM 1" },
];

export function TypographySection() {
  return (
    <section className={styles.section} id="typography">
      <Typography variant="h3">Typography</Typography>
      <Typography variant="body2">
        Three faces: display (headings, card titles), text (everything else) and mono (numbers and counters).
      </Typography>
      <div className={styles.typeList}>
        {samples.map((sample) => (
          <div key={sample.variant} className={styles.typeRow}>
            <code className={styles.typeName}>{sample.variant}</code>
            <Typography variant={sample.variant} as="div">
              {sample.text}
            </Typography>
          </div>
        ))}
      </div>

      <Typography variant="overline">Controls</Typography>
      <div className={styles.controlRow}>
        <Button>Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
        <Button colour="secondary">Secondary</Button>
        <Button colour="error" variant="outlined">Destructive</Button>
        <Button disabled>Disabled</Button>
        <Button variant="outlined" disabled>Disabled</Button>
      </div>
    </section>
  );
}
