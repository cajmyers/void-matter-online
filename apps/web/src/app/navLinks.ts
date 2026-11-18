export interface NavLink {
  readonly path: string;
  readonly label: string;
}

export const appNavLinks: readonly NavLink[] = [
  { path: "/", label: "Table" },
  { path: "/dev/style", label: "Style" },
  { path: "/dev/gallery", label: "Gallery" },
  { path: "/dev/tiles", label: "Tiles" },
  { path: "/dev/s1-cards", label: "S1" },
  { path: "/dev/s2-cards", label: "S2" },
  { path: "/dev/s3-cards", label: "S3" },
  { path: "/dev/s4-cards", label: "S4" },
  { path: "/dev/crew-cards", label: "Crew" },
  { path: "/dev/mission-cards", label: "Missions" },
  { path: "/dev/enemy-cards", label: "Enemies" },
  { path: "/dev/ship-cards", label: "Ships" },
  { path: "/dev/lab", label: "Motion lab" },
];