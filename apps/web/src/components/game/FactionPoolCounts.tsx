import { Typography } from "../Typography/Typography";
import { ResourceCube } from "./ResourceCube";
import { resourceIds, type ResourceId } from "./resources";
import styles from "./FactionPoolCounts.module.css";

export type FactionPoolView = Readonly<Record<ResourceId, number>>;

export function emptyFactionPool(): FactionPoolView {
  return { tc: 0, h3: 0, pc: 0, qp: 0 };
}

export function FactionPoolCounts({
  pool,
  compact = false,
}: {
  readonly pool: FactionPoolView;
  readonly compact?: boolean;
}) {
  const cubeSize = compact ? 14 : 18;
  return (
    <span className={styles.row} role="list" aria-hidden="true">
      {resourceIds.map((resource) => (
        <span key={resource} className={styles.cell} role="listitem">
          <ResourceCube resource={resource} size={cubeSize} />
          <Typography variant="numeric" className={styles.amount}>
            {pool[resource]}
          </Typography>
        </span>
      ))}
    </span>
  );
}

export function formatFactionPoolForScreenReader(pool: FactionPoolView): string {
  return resourceIds
    .map((resource) => `${resource.toUpperCase()} ${pool[resource]}`)
    .join(", ");
}