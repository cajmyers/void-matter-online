/** Optional owner attack-die glyph (`assets/icons/dice/attack.png`). */
const modules = import.meta.glob<string>("../../assets/icons/dice/attack.{png,webp,svg}", {
  eager: true,
  import: "default",
});

export const attackDieArtUrl: string | undefined = modules["../../assets/icons/dice/attack.png"] as string | undefined;
