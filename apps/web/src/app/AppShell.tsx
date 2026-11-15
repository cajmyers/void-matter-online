import type { ReactNode } from "react";
import { Typography } from "../components/Typography/Typography";
import { devPagesEnabled } from "./devPages";
import { hrefFor } from "./useHashRoute";
import styles from "./AppShell.module.css";

interface NavLink {
  readonly path: string;
  readonly label: string;
}

const navLinks: readonly NavLink[] = [
  { path: "/", label: "Table" },
  { path: "/dev/style", label: "Style" },
  { path: "/dev/gallery", label: "Gallery" },
  { path: "/dev/tiles", label: "Tiles" },
  { path: "/dev/s1-cards", label: "S1 cards" },
  { path: "/dev/lab", label: "Motion lab" },
];

export function AppShell({ path, children }: { readonly path: string; readonly children: ReactNode }) {
  const links = devPagesEnabled ? navLinks : navLinks.filter((link) => !link.path.startsWith("/dev/"));
  return (
    <div className={styles.shell}>
      <header className={styles.bar}>
        <Typography variant="h4" className={styles.brand}>
          Void Matter
        </Typography>
        <nav className={styles.nav} aria-label="Pages">
          {links.map((link) => (
            <a
              key={link.path}
              href={hrefFor(link.path)}
              className={link.path === path ? `${styles.link} ${styles.current}` : styles.link}
              aria-current={link.path === path ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
