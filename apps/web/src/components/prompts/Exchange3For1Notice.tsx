import { ResourceCube } from "../game/ResourceCube";
import type { ResourceId } from "../game/resources";
import { Typography } from "../Typography/Typography";
import shared from "./promptShared.module.css";

export interface Exchange3For1NoticeProps {
  /** The resource you are short of (exact payment missing). */
  readonly need: ResourceId;
  readonly substitute: ResourceId;
}

/** 3-for-1 exchange offered only when the exact resource is missing (`LOT-1`). */
export function Exchange3For1Notice({ need, substitute }: Exchange3For1NoticeProps) {
  return (
    <div className={shared.exchange} role="note">
      <div className={shared.costRow}>
        <ResourceCube resource={substitute} size={24} />
        <Typography variant="numeric">×3</Typography>
        <Typography variant="body2">→</Typography>
        <ResourceCube resource={need} size={24} />
      </div>
      <Typography variant="caption" className={shared.exchangeLabel}>
        Pay with any three other resources for one {need.toUpperCase()} (exchange only when the exact cube is missing).
      </Typography>
    </div>
  );
}