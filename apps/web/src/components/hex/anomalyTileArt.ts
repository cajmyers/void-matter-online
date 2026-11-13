import { planetSlug as tileSlug } from "./planetTileArt";

/** Slug for anomaly art filenames (`assets/tiles/anomalies/<slug>.webp`): same rules as planets, from the fixture name. */
export function anomalySlug(name: string): string {
  return tileSlug(name);
}

const artBySlug = (() => {
  const modules = import.meta.glob<string>("../../assets/tiles/anomalies/*.{webp,png,jpg,jpeg}", {
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

/** Owner art for anomaly tiles (board and inspector); undefined until the file exists. */
export function anomalyDetailArt(anomalyName: string): string | undefined {
  return artBySlug.get(anomalySlug(anomalyName));
}
