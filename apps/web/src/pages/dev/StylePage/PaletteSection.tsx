import { Typography } from "../../../components/Typography/Typography";
import { Swatch } from "./Swatch";
import styles from "./StylePage.module.css";

const intents = ["primary", "secondary", "error", "warning", "info", "success"] as const;
const greys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export function PaletteSection() {
  return (
    <section className={styles.section} id="palette">
      <Typography variant="h3">Palette</Typography>
      <Typography variant="body2">
        Material UI naming: each intent has main, light, dark and contrast-text. All values are CSS custom properties
        in theme.css.
      </Typography>

      <div className={styles.paletteGrid}>
        {intents.map((intent) => (
          <div key={intent} className={styles.swatchRow}>
            <Swatch variable={`palette-${intent}-main`} textVariable={`palette-${intent}-contrast-text`} label={`${intent}.main`} />
            <Swatch variable={`palette-${intent}-light`} textVariable={`palette-${intent}-contrast-text`} label={`${intent}.light`} />
            <Swatch variable={`palette-${intent}-dark`} textVariable="palette-common-white" label={`${intent}.dark`} />
            <Swatch variable={`palette-${intent}-contrast-text`} textVariable={`palette-${intent}-main`} label={`${intent}.contrastText`} />
          </div>
        ))}
      </div>

      <Typography variant="overline">Grey</Typography>
      <div className={styles.swatchRowTight}>
        {greys.map((step) => (
          <Swatch
            key={step}
            variable={`palette-grey-${step}`}
            textVariable={step <= 400 ? "palette-grey-900" : "palette-grey-50"}
            label={`grey.${step}`}
          />
        ))}
      </div>

      <Typography variant="overline">Text, background and lines</Typography>
      <div className={styles.swatchRow}>
        <Swatch variable="palette-background-default" label="background.default" />
        <Swatch variable="palette-background-paper" label="background.paper" />
        <Swatch variable="palette-background-elevated" label="background.elevated" />
        <Swatch variable="palette-divider" label="divider" />
      </div>
      <div className={styles.swatchRow}>
        <Swatch variable="palette-text-primary" textVariable="palette-background-default" label="text.primary" />
        <Swatch variable="palette-text-secondary" textVariable="palette-background-default" label="text.secondary" />
        <Swatch variable="palette-text-disabled" textVariable="palette-background-default" label="text.disabled" />
      </div>
    </section>
  );
}
