import { useEffect, useMemo, useRef } from "react";
import { Typography } from "../Typography/Typography";
import { playerShips } from "@void-matter/content";
import { cardWidthDetail } from "../game/cardSizes";
import {
  galleryCrewCardsById,
  galleryMissionsById,
  gallerySectorAssetCardsByDeck,
} from "../../fixtures/zoneFixtures";
import type { TableCardInspectTarget } from "../../view/marketCardInspect";
import { renderTableCardDetail } from "./marketCardInspectRender";
import styles from "./MarketCardInspector.module.css";

function resolveAssetCard(catalogueId: string) {
  const byDeck = gallerySectorAssetCardsByDeck();
  for (const deck of ["s1", "s2", "s3", "s4"] as const) {
    const card = byDeck[deck][catalogueId];
    if (card) {
      return card;
    }
  }
  return undefined;
}

function inspectTitle(target: TableCardInspectTarget): string {
  if (target.kind === "ship") {
    return playerShips.find((row) => row.id === target.catalogueId)?.title ?? target.catalogueId;
  }
  if (target.kind === "asset") {
    return resolveAssetCard(target.catalogueId)?.title ?? target.catalogueId;
  }
  if (target.kind === "crew") {
    const row = galleryCrewCardsById[target.catalogueId];
    return row?.name ?? row?.title ?? target.catalogueId;
  }
  const mission = galleryMissionsById[target.catalogueId];
  return mission?.title ?? target.catalogueId;
}

export function MarketCardInspector({
  target,
  onClose,
}: {
  readonly target: TableCardInspectTarget;
  readonly onClose: () => void;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const ignoreCloseUntil = useRef(0);

  useEffect(() => {
    ignoreCloseUntil.current = performance.now() + 250;
  }, [target]);

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

  const title = inspectTitle(target);

  const preview = useMemo(() => renderTableCardDetail(target, cardWidthDetail), [target]);

  return (
    <div className={styles.root}>
      <aside
        ref={panelRef}
        className={styles.panel}
        data-block-board-wheel="true"
        data-market-card-inspector="true"
        role="dialog"
        aria-modal="true"
        aria-label={`Inspect ${title}`}
      >
        <header className={styles.header}>
          <Typography variant="h5" className={styles.title}>
            {title}
          </Typography>
        </header>
        <div className={styles.preview}>{preview ?? <Typography variant="body2">Card not found.</Typography>}</div>
      </aside>
    </div>
  );
}