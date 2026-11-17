import { useState } from "react";
import { HexDefs } from "../../../components/hex/HexTile";
import { Typography } from "../../../components/Typography/Typography";
import { VisionFilters, visionModes, type VisionMode } from "../StylePage/VisionFilters";
import { ActionTokensSection } from "./ActionTokensSection";
import { ResourcesSection } from "./ResourcesSection";
import { CardsSection } from "./CardsSection";
import { ZonesSection } from "./ZonesSection";
import { ShipsSection } from "./ShipsSection";
import { TilesSection } from "./TilesSection";
import styles from "./GalleryPage.module.css";

interface IndexEntry {
  readonly id: string;
  readonly label: string;
  /** Sections not built yet are listed but disabled, so the backlog stays visible. */
  readonly built: boolean;
}

const entries: readonly IndexEntry[] = [
  { id: "resources", label: "Resources and markers", built: true },
  { id: "action-tokens", label: "Action tokens", built: true },
  { id: "tiles", label: "Tiles", built: true },
  { id: "ships", label: "Ships", built: true },
  { id: "cards", label: "Cards", built: true },
  { id: "zones", label: "Zones", built: true },
  { id: "dice", label: "Dice", built: false },
  { id: "prompts", label: "Prompts", built: false },
  { id: "chrome", label: "Chrome", built: false },
];

function scrollToSection(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Stage 1b: every visual object in the game, in every state, from fixtures. */
export default function GalleryPage() {
  const [vision, setVision] = useState<VisionMode>("none");
  const filter = vision === "none" ? undefined : `url(#vm-vision-${vision})`;

  return (
    <div className={styles.page}>
      <VisionFilters />
      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden="true">
        <HexDefs />
      </svg>

      <div className={styles.intro}>
        <Typography variant="overline">Stage 1b</Typography>
        <Typography variant="h1">Component gallery</Typography>
        <Typography variant="body1">
          Every visual object in the game, in every state, drawn from fixtures. Built in slices; sections marked as
          pending are still to come. Placeholder art is used where the owner's art has not arrived.
        </Typography>
      </div>

      <nav className={styles.index} aria-label="Gallery sections">
        {entries.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={styles.indexLink}
            disabled={!entry.built}
            title={entry.built ? undefined : "Not built yet"}
            onClick={() => scrollToSection(entry.id)}
          >
            {entry.label}
          </button>
        ))}
        <Typography variant="overline">Vision</Typography>
        <select className={styles.indexLink} value={vision} onChange={(event) => setVision(event.target.value as VisionMode)} aria-label="Vision simulation">
          {visionModes.map((mode) => (
            <option key={mode.id} value={mode.id}>
              {mode.label}
            </option>
          ))}
        </select>
      </nav>

      <div className={styles.page} style={{ filter, padding: 0 }}>
        <ResourcesSection />
        <ActionTokensSection />
        <TilesSection />
        <ShipsSection />
        <CardsSection />
        <ZonesSection />
      </div>
    </div>
  );
}
