import s1FaceTextureUrl from "../../assets/cards/s1/fronts/s1-texture.webp";
import s2FaceTextureUrl from "../../assets/cards/s2/fronts/s2-texture.webp";
import s3FaceTextureUrl from "../../assets/cards/s3/fronts/s3-texture.webp";
import s4FaceTextureUrl from "../../assets/cards/s4/fronts/s4-texture.webp";
import crewFaceTextureUrl from "../../assets/cards/crew/fronts/crew-texture.webp";
import missionFaceTextureUrl from "../../assets/cards/mission/fronts/mission-texture.webp";
import ironEnemyFaceTextureUrl from "../../assets/cards/enemy/fronts/iron-texture.webp";
import prismEnemyFaceTextureUrl from "../../assets/cards/enemy/fronts/prism-texture.webp";
import hiveEnemyFaceTextureUrl from "../../assets/cards/enemy/fronts/hive-texture.webp";
import type { EnemyFactionId } from "@void-matter/content";

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

const shipFaceTextureModules = import.meta.glob<string>("../../assets/cards/ship/fronts/*-texture.webp", {
  eager: true,
  import: "default",
});

function parseArtPath(path: string): { deck: SectorArtDeck; slug: string } | undefined {
  const match = path.match(/\/cards\/(s[1-4])\/fronts\/art\/([^/]+)\.(webp|png|jpe?g)$/i);
  if (!match?.[1] || !match[2]) return undefined;
  return { deck: match[1] as SectorArtDeck, slug: match[2].toLowerCase() };
}

function parseCrewPortraitPath(path: string): string | undefined {
  const match = path.match(/\/cards\/crew\/fronts\/art\/([^/]+)\.(webp|png|jpe?g)$/i);
  return match?.[1]?.toLowerCase();
}

function parseMissionHeroPath(path: string): string | undefined {
  const match = path.match(/\/cards\/mission\/fronts\/art\/([^/]+)\.(webp|png|jpe?g)$/i);
  return match?.[1]?.toLowerCase();
}

function parseEnemyHeroPath(path: string): string | undefined {
  const match = path.match(/\/cards\/enemy\/fronts\/art\/([^/]+)\.(webp|png|jpe?g)$/i);
  if (!match?.[1]) {
    return undefined;
  }
  const basename = match[1];
  const normalized = basename.includes(" ") ? cardIllustrationSlug(basename) : basename.toLowerCase();
  return normalized;
}

function parseShipHeroPath(path: string): string | undefined {
  const match = path.match(/\/cards\/ship\/fronts\/art\/([^/]+)\.(webp|png|jpe?g)$/i);
  if (!match?.[1]) {
    return undefined;
  }
  const basename = match[1];
  return basename.includes(" ") ? cardIllustrationSlug(basename) : basename.toLowerCase();
}

function parseShipFaceTexturePath(path: string): string | undefined {
  const match = path.match(/\/cards\/ship\/fronts\/([^/]+)-texture\.webp$/i);
  return match?.[1]?.toLowerCase();
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

const crewPortraitByCatalogueId = (() => {
  const map = new Map<string, string>();
  for (const [path, url] of Object.entries(illustrationModules)) {
    const id = parseCrewPortraitPath(path);
    if (id) map.set(id, url);
  }
  return map;
})();

const missionHeroByCatalogueId = (() => {
  const map = new Map<string, string>();
  for (const [path, url] of Object.entries(illustrationModules)) {
    const id = parseMissionHeroPath(path);
    if (id) map.set(id, url);
  }
  return map;
})();

const enemyHeroByCatalogueId = (() => {
  const map = new Map<string, string>();
  for (const [path, url] of Object.entries(illustrationModules)) {
    const id = parseEnemyHeroPath(path);
    if (id) map.set(id, url);
  }
  return map;
})();

const shipHeroByCatalogueId = (() => {
  const map = new Map<string, string>();
  for (const [path, url] of Object.entries(illustrationModules)) {
    const id = parseShipHeroPath(path);
    if (id) map.set(id, url);
  }
  return map;
})();

const shipFaceTextureByCatalogueId = (() => {
  const map = new Map<string, string>();
  for (const [path, url] of Object.entries(shipFaceTextureModules)) {
    const id = parseShipFaceTexturePath(path);
    if (id) map.set(id, url);
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

/** Crew Ensign / Commander face stock. */
export function crewCardFaceTexture(): string {
  return crewFaceTextureUrl;
}

/** Mission card face stock. */
export function missionCardFaceTexture(): string {
  return missionFaceTextureUrl;
}

const enemyFaceTextureByFaction: Readonly<Record<EnemyFactionId, string>> = {
  "iron-syndicate": ironEnemyFaceTextureUrl,
  "prism-ascendancy": prismEnemyFaceTextureUrl,
  "the-hive": hiveEnemyFaceTextureUrl,
};

/** Enemy card face stock (`enemy/fronts/<faction>-texture.webp`). */
export function enemyCardFaceTexture(faction: EnemyFactionId): string {
  return enemyFaceTextureByFaction[faction];
}

/** Ensign portrait (`crew/fronts/art/<catalogueId>.webp`; ids from `ensigns.json`). */
export function crewCardPortraitArt(catalogueId: string): string | undefined {
  return crewPortraitByCatalogueId.get(catalogueId.toLowerCase());
}

/** Mission hero (`mission/fronts/art/<catalogueId>.webp`; ids from `missions.json`). */
export function missionCardHeroArt(catalogueId: string): string | undefined {
  return missionHeroByCatalogueId.get(catalogueId.toLowerCase());
}

/** Enemy hero (`enemy/fronts/art/<catalogueId>.webp`; ids from `enemies/*.json`). */
export function enemyCardHeroArt(catalogueId: string): string | undefined {
  return enemyHeroByCatalogueId.get(catalogueId.toLowerCase());
}

/** Player ship hero (`ship/fronts/art/<catalogueId>.webp`; ids from `player-ships.json`). */
export function shipCardHeroArt(catalogueId: string): string | undefined {
  return shipHeroByCatalogueId.get(catalogueId.toLowerCase());
}

/** Player ship face stock (`ship/fronts/<catalogueId>-texture.webp`). */
export function shipCardFaceTexture(catalogueId: string): string | undefined {
  return shipFaceTextureByCatalogueId.get(catalogueId.toLowerCase());
}
