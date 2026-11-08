// Colour-vision simulation, applied as a CSS filter to the style page content.
// Standard linear approximations; good enough to judge whether shapes carry the meaning.

export type VisionMode = "none" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";

export const visionModes: readonly { id: VisionMode; label: string }[] = [
  { id: "none", label: "Normal vision" },
  { id: "protanopia", label: "Protanopia (no red)" },
  { id: "deuteranopia", label: "Deuteranopia (no green)" },
  { id: "tritanopia", label: "Tritanopia (no blue)" },
  { id: "achromatopsia", label: "Greyscale" },
];

const matrices: Readonly<Record<Exclude<VisionMode, "none">, string>> = {
  protanopia: "0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0",
  deuteranopia: "0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0",
  tritanopia: "0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0",
  achromatopsia: "0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0",
};

export function VisionFilters() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        {(Object.keys(matrices) as (keyof typeof matrices)[]).map((mode) => (
          <filter key={mode} id={`vm-vision-${mode}`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={matrices[mode]} />
          </filter>
        ))}
      </defs>
    </svg>
  );
}
