import s1FaceTextureUrl from "../../assets/cards/s1/fronts/s1-texture.webp";
import s2FaceTextureUrl from "../../assets/cards/s2/fronts/s2-texture.webp";
import s3FaceTextureUrl from "../../assets/cards/s3/fronts/s3-texture.webp";
import s4FaceTextureUrl from "../../assets/cards/s4/fronts/s4-texture.webp";

/** Slug for sector asset hero art (`assets/cards/<deck>/fronts/art/<slug>.webp`). */
export function cardIllustrationSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/[''\u2018\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** @deprecated Use {@link cardIllustrationSlug}. */
export const s1CardSlug = cardIllustrationSlug;

export type SectorArtDeck = "s1" | "s2" | "s3" | "s4";

const illustrationModules = import.meta.glob<string>("../../assets/cards/**/fronts/art/*.{webp,png,jpg,jpeg}", {
  eager: true,
  import: "default",
});

function parseArtPath(path: string): { deck: SectorArtDeck; slug: string } | undefined {
  const match = path.match(/\/cards\/(s[1-4])\/fronts\/art\/([^/]+)\.(webp|png|jpe?g)$/i);
  if (!match?.[1] || !match[2]) return undefined;
  return { deck: match[1] as SectorArtDeck, slug: match[2].toLowerCase() };
}

const illustrationBySlug = (() => {
  const map = new Map<string, string>();
  for (const [path, url] of Object.entries(illustrationModules)) {
    const parsed = parseArtPath(path);
    if (parsed) map.set(parsed.slug, url);
  }
  return map;
})();

const illustrationByDeckAndSlug = (() => {
  const map = new Map<string, string>();
  for (const [path, url] of Object.entries(illustrationModules)) {
    const parsed = parseArtPath(path);
    if (parsed) map.set(`${parsed.deck}/${parsed.slug}`, url);
  }
  return map;
})();

/** Resolve hero art by card title (slug unique across decks in `content-data.md`). */
export function cardIllustrationArt(cardTitle: string): string | undefined {
  return illustrationBySlug.get(cardIllustrationSlug(cardTitle));
}

/** Resolve when catalogue supplies `illustrationSlug` and `sectorDeck`. */
export function cardIllustrationArtForDeck(slug: string, deck: SectorArtDeck): string | undefined {
  return illustrationByDeckAndSlug.get(`${deck}/${slug.toLowerCase()}`);
}

/** @deprecated Use {@link cardIllustrationArt}. */
export const s1CardIllustrationArt = cardIllustrationArt;

const faceTextureByDeck: Readonly<Record<SectorArtDeck, string>> = {
  s1: s1FaceTextureUrl,
  s2: s2FaceTextureUrl,
  s3: s3FaceTextureUrl,
  s4: s4FaceTextureUrl,
};

/** Full-card front stock texture (`fronts/<deck>-texture.webp`), when present. */
export function sectorCardFaceTexture(deck: SectorArtDeck): string {
  return faceTextureByDeck[deck];
}
