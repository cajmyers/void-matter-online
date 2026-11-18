import type { ReactNode } from "react";
import { Typography } from "../components/Typography/Typography";
import { devPagesEnabled } from "./devPages";
import { appNavLinks } from "./navLinks";
import { hrefFor } from "./useHashRoute";
import styles from "./AppShell.module.css";

export function AppShell({ path, children }: { readonly path: string; readonly children: ReactNode }) {
  const links = devPagesEnabled ? appNavLinks : appNavLinks.filter((link) => !link.path.startsWith("/dev/"));
  const tableRoute = path === "/";

  return (
    <div className={tableRoute ? `${styles.shell} ${styles.shellTable}` : styles.shell}>
      {tableRoute ? null : (
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
      )}
      <main className={styles.content}>{children}</main>
    </div>
  );
}
