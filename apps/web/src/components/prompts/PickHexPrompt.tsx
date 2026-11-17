import { Button } from "../Button/Button";
import { HexTileFigureSvg } from "../hex/HexTileFigure";
import { buildPlanetFigure } from "../../pages/dev/tileCatalogFigures";
import { planetFixtures } from "../../fixtures/tiles";
import { PromptShell } from "./PromptShell";
import shared from "./promptShared.module.css";

const samplePlanet = planetFixtures.find((p) => p.name === "Vulkan's Forge") ?? planetFixtures[0];

export interface PickHexPromptProps {
  readonly title: string;
  readonly headline: string;
  readonly lead?: string;
  readonly mode: "move" | "retreat" | "nexusHop" | "placement";
}

const modeTitles: Readonly<Record<PickHexPromptProps["mode"], string>> = {
  move: "Move destination",
  retreat: "Retreat destination",
  nexusHop: "Nexus Hop",
  placement: "New ship",
};

/** 4 — Pick a hex (move, retreat, Nexus Hop, or new ship placement `REC-1`). */
export function PickHexPrompt({ title, headline, lead, mode }: PickHexPromptProps) {
  const tiles = samplePlanet
    ? [
        {
          q: 0,
          r: 0,
          body: { ...buildPlanetFigure(samplePlanet).body, title: "You" },
          gates: buildPlanetFigure(samplePlanet).gates,
          ship: { seat: 1 as const, selected: true },
        },
        {
          q: 1,
          r: 0,
          body: { ...buildPlanetFigure(samplePlanet, { selected: true }).body, title: samplePlanet.name },
          gates: buildPlanetFigure(samplePlanet).gates,
        },
        {
          q: 0,
          r: 1,
          body: { kind: "faceDown" as const, title: "Face down" },
          gates: ["TL", "TR", "R"] as const,
        },
      ]
    : [];

  return (
    <PromptShell
      title={title}
      headline={headline}
      lead={lead ?? `Choose a legal hex for ${modeTitles[mode].toLowerCase()}. Illegal hexes are omitted by the engine.`}
    >
      <div className={shared.hexMap}>
        <HexTileFigureSvg tiles={tiles} size={56} ariaLabel={headline} />
      </div>
      <div className={shared.actions}>
        <Button type="button" variant="outlined">
          Confirm hex
        </Button>
        <Button type="button" variant="text">
          Cancel
        </Button>
      </div>
    </PromptShell>
  );
}