import type { SeatNumber } from "../game/resources";

export type NexusTileKind = "nexusCentral" | "nexusRim";

const artBySlug = (() => {
  const modules = import.meta.glob<string>("../../assets/tiles/nexus/*.{webp,png,jpg,jpeg}", {
    eager: true,
    import: "default",
  });
  const map = new Map<string, string>();
  for (const [path, url] of Object.entries(modules)) {
    const match = path.match(/\/([^/]+)\.(webp|png|jpe?g)$/i);
    const slug = match?.[1]?.toLowerCase();
    if (slug) map.set(slug, url);
  }
  return map;
})();

export function nexusArtSlug(kind: NexusTileKind, seat?: SeatNumber): string | null {
  if (kind === "nexusCentral") return "central-nexus";
  if (seat === undefined) return null;
  return `outer-rim-nexus-${seat}`;
}

/** Owner art for Central and Outer Rim Nexus tiles. */
export function nexusDetailArt(kind: NexusTileKind, seat?: SeatNumber): string | undefined {
  const slug = nexusArtSlug(kind, seat);
  return slug ? artBySlug.get(slug) : undefined;
}
