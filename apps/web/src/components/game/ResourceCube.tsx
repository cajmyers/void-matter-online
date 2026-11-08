import styles from "./ResourceCube.module.css";
import { resourceArt } from "./resourceArt";
import { resourceInfo, type ResourceOrVm } from "./resources";

export interface ResourceCubeProps {
  readonly resource: ResourceOrVm;
  readonly size?: number;
  /** Ghosted: used for "demand" on a planet, as opposed to a full-strength "supply" cube. */
  readonly hollow?: boolean;
  readonly label?: boolean;
}

export function ResourceCube({ resource, size = 28, hollow = false, label = false }: ResourceCubeProps) {
  const info = resourceInfo[resource];
  const className = [styles.cube, hollow ? styles.hollow : "", resource === "vm" ? styles.vm : ""].filter(Boolean).join(" ");
  return (
    <span
      className={className}
      style={{ width: size, height: size }}
      title={`${info.name} (${info.code})`}
      role="img"
      aria-label={hollow ? `${info.name}, demand` : info.name}
    >
      <img className={styles.art} src={resourceArt[resource]} alt="" draggable={false} />
      {label ? <span className={styles.label}>{info.code}</span> : null}
    </span>
  );
}
