import nebulaImage from "../../assets/backdrops/nebula.webp";
import violetImage from "../../assets/backdrops/violet.webp";
import styles from "./SpaceBackdrop.module.css";

// Placeholder space scene, drawn procedurally: nebula washes, a galaxy smear, a seeded
// star field and two large partial planets. Real backdrop art can replace it later.
// This is presentation only (not the engine's RNG), seeded so it looks the same every load.

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Star {
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly o: number;
}

function makeStars(count: number): readonly Star[] {
  const random = mulberry32(48);
  const stars: Star[] = [];
  for (let index = 0; index < count; index += 1) {
    const big = random() > 0.93;
    stars.push({
      x: random() * 100,
      y: random() * 100,
      r: big ? 0.12 + random() * 0.14 : 0.04 + random() * 0.08,
      o: big ? 0.8 + random() * 0.2 : 0.25 + random() * 0.55,
    });
  }
  return stars;
}

const stars = makeStars(320);

const photos = { nebula: nebulaImage, violet: violetImage } as const;

export interface SpaceBackdropProps {
  /** One of the owner's backdrop images, or "procedural" for the drawn placeholder. */
  readonly art?: keyof typeof photos | "procedural";
}

export function SpaceBackdrop({ art = "violet" }: SpaceBackdropProps) {
  if (art !== "procedural") {
    return (
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.photo} style={{ backgroundImage: `url(${photos[art]})` }} />
        <div className={styles.shade} />
      </div>
    );
  }
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.nebula} />
      <div className={styles.galaxy} />
      <svg className={styles.stars} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {stars.map((star, index) => (
          <circle key={index} cx={star.x} cy={star.y} r={star.r} opacity={star.o} />
        ))}
      </svg>
      <div className={`${styles.planet} ${styles.planetTop}`} />
      <div className={`${styles.planet} ${styles.planetBottom}`} />
      <div className={styles.vignette} />
    </div>
  );
}
