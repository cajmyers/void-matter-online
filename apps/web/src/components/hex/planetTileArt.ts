/** Slug for planet detail art filenames (`assets/tiles/planets/<slug>.webp`). */
export function planetSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const artBySlug = (() => {
  const modules = import.meta.glob<string>("../../assets/tiles/planets/*.{webp,png,jpg,jpeg}", {
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

/** Owner art for detail / inspector planet tiles; undefined until the file exists. */
export function planetDetailArt(planetName: string): string | undefined {
  return artBySlug.get(planetSlug(planetName));
}
