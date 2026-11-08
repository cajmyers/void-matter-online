import { DamageCube, HullTrack } from "../../../components/game/HullTrack";
import { FirstPlayerToken, LarvaToken } from "../../../components/game/Markers";
import { ResourceCube } from "../../../components/game/ResourceCube";
import { resourceIds, resourceInfo, type ResourceOrVm } from "../../../components/game/resources";
import { Typography } from "../../../components/Typography/Typography";
import { Figure } from "./Figure";
import styles from "./GalleryPage.module.css";

const withVm: readonly ResourceOrVm[] = [...resourceIds, "vm"];

export function ResourcesSection() {
  return (
    <section className={styles.section} id="resources">
      <Typography variant="h3">Resources and markers</Typography>

      <div className={styles.group}>
        <Typography variant="overline">Resource cubes at three sizes (the owner's token art)</Typography>
        <div className={styles.grid}>
          {withVm.map((resource) => (
            <Figure key={resource} name={`${resourceInfo[resource].code}, ${resourceInfo[resource].name}`} note={resource === "vm" ? "Victory marker, never spendable" : undefined}>
              <ResourceCube resource={resource} size={20} />
              <ResourceCube resource={resource} size={32} />
              <ResourceCube resource={resource} size={56} />
            </Figure>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Supply and demand (full strength against ghosted)</Typography>
        <div className={styles.grid}>
          {resourceIds.map((resource) => (
            <Figure key={resource} name={resourceInfo[resource].code} note="Supply, then demand">
              <ResourceCube resource={resource} size={36} />
              <ResourceCube resource={resource} size={36} hollow />
            </Figure>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Damage and locks</Typography>
        <div className={styles.grid}>
          <Figure name="Damage cube" note="Also the marker that locks a planet's supply or demand area">
            <DamageCube size={20} />
            <DamageCube size={32} />
          </Figure>
          <Figure name="Hull, undamaged" note="3 free hull slots">
            <HullTrack capacity={3} damage={0} />
          </Figure>
          <Figure name="Hull, 2 of 3">
            <HullTrack capacity={3} damage={2} />
          </Figure>
          <Figure name="Hull full" note="Cube option is unavailable; the ship must discard a component (LOT-3)">
            <HullTrack capacity={3} damage={3} />
          </Figure>
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Other markers (placeholder art)</Typography>
        <div className={styles.grid}>
          <Figure name="First-player token" note="Passes round the seats each Maintenance">
            <FirstPlayerToken size={32} />
            <FirstPlayerToken size={56} />
          </Figure>
          <Figure name="Swarm Larva token" note="A spawned enemy token, not a ship (LOT-4)">
            <LarvaToken size={32} />
            <LarvaToken size={56} />
          </Figure>
        </div>
      </div>
    </section>
  );
}
