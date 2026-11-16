import { useState } from "react";
import { HexDefs } from "../../../components/hex/HexTile";
import { Typography } from "../../../components/Typography/Typography";
import { GamePaletteSection } from "./GamePaletteSection";
import { PaletteSection } from "./PaletteSection";
import { SpacingMotionSection } from "./SpacingMotionSection";
import { SpecimenSection } from "./SpecimenSection";
import { TypographySection } from "./TypographySection";
import { VisionFilters, visionModes, type VisionMode } from "./VisionFilters";
import styles from "./StylePage.module.css";

/** Stage 1a: the Holo tactical style. A reference of the tokens and a specimen table, built from the real components. */
export default function StylePage() {
  const [vision, setVision] = useState<VisionMode>("none");
  const filter = vision === "none" ? undefined : `url(#vm-vision-${vision})`;

  return (
    <div className={styles.page}>
      <VisionFilters />
      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden="true">
        <HexDefs />
      </svg>
      <div className={styles.intro}>
        <Typography variant="overline">Stage 1a</Typography>
        <Typography variant="h1">Holo tactical</Typography>
        <Typography variant="body1">
          The chosen style: dark glass panels, thin cyan linework and a lit tactical display. The specimen table uses
          production card and deck-back art where it exists; tokens, palette, type and spacing are read from{" "}
          <code>theme.css</code>.
        </Typography>
      </div>

      <div className={styles.toolbar}>
        <Typography variant="overline">Vision check</Typography>
        <select className={styles.select} value={vision} onChange={(event) => setVision(event.target.value as VisionMode)} aria-label="Vision simulation">
          {visionModes.map((mode) => (
            <option key={mode.id} value={mode.id}>
              {mode.label}
            </option>
          ))}
        </select>
        <Typography variant="caption">
          Simulates colour-blind vision on everything below. Seats and resources must stay tellable apart by shape.
        </Typography>
      </div>

      <div className={styles.visionTarget} style={{ filter }}>
        <SpecimenSection />
        <GamePaletteSection />
        <PaletteSection />
        <TypographySection />
        <SpacingMotionSection />
      </div>
    </div>
  );
}
