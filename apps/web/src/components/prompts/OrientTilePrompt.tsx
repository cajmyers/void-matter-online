import { Typography } from "../Typography/Typography";
import { HexTileFigureSvg } from "../hex/HexTileFigure";
import { anomalyFixtures } from "../../fixtures/tiles";
import { buildAnomalyFigure } from "../../pages/dev/tileCatalogFigures";
import { PromptShell } from "./PromptShell";
import shared from "./promptShared.module.css";

const twoGateAnomaly = anomalyFixtures.find((tile) => tile.gates.length === 2) ?? anomalyFixtures[0];

const rotations = [
  { id: "a", label: "Gates TL–BR", degrees: 0 },
  { id: "b", label: "Gates L–R", degrees: 60 },
] as const;

/** 5 — Orient a revealed tile (`MAP-6`, `MAP-7`); only legal rotations listed. */
export function OrientTilePrompt() {
  const base = twoGateAnomaly ? buildAnomalyFigure(twoGateAnomaly) : null;

  return (
    <PromptShell
      title="Orient tile"
      headline={twoGateAnomaly ? `Orient ${twoGateAnomaly.name}` : "Orient revealed tile"}
      lead="Entry gate must match how you entered. Equivalent rotations are collapsed to one option."
    >
      <div className={shared.rotationRow}>
        {rotations.map((rotation, index) => (
          <button key={rotation.id} type="button" className={shared.rotationPreview} aria-pressed={index === 0}>
            {base ? (
              <HexTileFigureSvg
                tiles={[
                  {
                    ...base,
                    gates: index === 0 ? (base.gates ?? []) : (["L", "R"] as const),
                  },
                ]}
                size={64}
                ariaLabel={rotation.label}
              />
            ) : null}
            <Typography variant="caption">{rotation.label}</Typography>
          </button>
        ))}
      </div>
      <Typography variant="caption">Half-connection tiles show rotation differences clearly (`MAP-5`).</Typography>
    </PromptShell>
  );
}