import { useEffect, useRef } from "react";
import { CogIcon } from "../components/icons/CogIcon";
import { hrefFor } from "./useHashRoute";
import menuStyles from "../components/game/GameMenuButton.module.css";
import styles from "./DevPagesMenu.module.css";

import type { NavLink } from "./navLinks";

/** Dev page switcher using the game-menu cog; hidden in production builds. */
export function DevPagesMenu({
  path,
  links,
  embedded = false,
}: {
  readonly path: string;
  readonly links: readonly NavLink[];
  /** When true, sits in the play-table HUD (final game menu placement). */
  readonly embedded?: boolean;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const rootClass = embedded ? `${styles.root} ${styles.rootEmbedded}` : styles.root;

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const root = detailsRef.current;
      if (!root?.open) return;
      const target = event.target;
      if (target instanceof Node && root.contains(target)) return;
      root.open = false;
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  return (
    <details ref={detailsRef} className={rootClass}>
      <summary className={menuStyles.button} aria-label={embedded ? "Menu" : "Developer pages"}>
        <CogIcon size={18} />
      </summary>
      <nav className={menuStyles.panel} aria-label="Developer pages">
        <ul className={menuStyles.list}>
          {links.map((link) => (
            <li key={link.path}>
              <a
                href={hrefFor(link.path)}
                className={link.path === path ? `${menuStyles.link} ${menuStyles.linkCurrent}` : menuStyles.link}
                aria-current={link.path === path ? "page" : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}