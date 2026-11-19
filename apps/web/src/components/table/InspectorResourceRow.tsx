import type { ResourceAmount } from "@void-matter/content";
import type { ResourceId } from "../game/resources";
import { ResourceCube } from "../game/ResourceCube";
import { Typography } from "../Typography/Typography";
import styles from "./InspectorResourceRow.module.css";

const inspectorCubeSize = 22;

export function InspectorResourceAmounts({
  amounts,
  iconsOnly = false,
}: {
  readonly amounts: readonly ResourceAmount[];
  readonly iconsOnly?: boolean;
}) {
  if (amounts.length === 0) return <span className={styles.empty}>—</span>;
  return (
    <span className={styles.row} role="list">
      {amounts.map((item) => (
        <span key={item.resource} className={styles.entry} role="listitem">
          <ResourceCube resource={item.resource} size={inspectorCubeSize} />
          {iconsOnly ? null : (
            <Typography variant="numeric" className={styles.amount}>
              ×{item.amount}
            </Typography>
          )}
        </span>
      ))}
    </span>
  );
}

export function InspectorDiscoveryBonus({ bonus }: { readonly bonus: readonly [ResourceId, ResourceId] }) {
  return (
    <span className={styles.row} role="list">
      {bonus.map((resource, index) => (
        <span key={`${resource}-${index}`} className={styles.entry} role="listitem">
          <ResourceCube resource={resource} size={inspectorCubeSize} />
        </span>
      ))}
    </span>
  );
}