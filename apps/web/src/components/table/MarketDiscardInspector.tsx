import { useEffect, useRef } from "react";
import { Typography } from "../Typography/Typography";
import { cardWidthDetail } from "../game/cardSizes";
import type { MarketDiscardInspectTarget } from "../../view/marketCardInspect";
import { renderMarketCardDetail } from "./marketCardInspectRender";
import styles from "./MarketDiscardInspector.module.css";

export function MarketDiscardInspector({
  target,
  onClose,
}: {
  readonly target: MarketDiscardInspectTarget;
  readonly onClose: () => void;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const ignoreCloseUntil = useRef(0);

  useEffect(() => {
    ignoreCloseUntil.current = performance.now() + 250;
  }, [target.title, target.cardIds]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (performance.now() < ignoreCloseUntil.current) return;
      const panel = panelRef.current;
      if (!panel) return;
      if (event.target instanceof Node && panel.contains(event.target)) return;
      onClose();
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [onClose]);

  return (
    <div className={styles.root}>
      <aside
        ref={panelRef}
        className={styles.panel}
        data-block-board-wheel="true"
        data-market-discard-inspector="true"
        role="dialog"
        aria-modal="true"
        aria-label={target.title}
      >
        <header className={styles.header}>
          <Typography variant="h5" className={styles.title}>
            {target.title}
          </Typography>
          <Typography variant="caption" className={styles.subtitle}>
            {target.cardIds.length} in discard · top first
          </Typography>
        </header>
        <ul className={styles.list}>
          {target.cardIds.map((id, index) => (
            <li key={`${id}-${index}`} className={styles.item}>
              {renderMarketCardDetail(target.pileKind, id, cardWidthDetail) ?? (
                <Typography variant="body2">{id}</Typography>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}