import { Typography } from "../Typography/Typography";
import type { FleetShipStatsSummary } from "../../view/fleetShipStats";
import styles from "./FleetShipStatsSummary.module.css";

function StatCell({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className={styles.cell}>
      <Typography variant="caption" className={styles.label}>
        {label}
      </Typography>
      <Typography variant="subtitle2" className={styles.value}>
        {value}
      </Typography>
    </div>
  );
}

export function FleetShipStatsSummary({ stats }: { readonly stats: FleetShipStatsSummary }) {
  return (
    <section className={styles.bar} aria-label="Ship totals">
      <StatCell label="Speed" value={String(stats.speed)} />
      <StatCell label="Hull" value={String(stats.hull)} />
      <StatCell label="Cargo" value={String(stats.cargo)} />
      <StatCell
        label="Crew"
        value={stats.crewSlots === stats.crewAssigned ? String(stats.crewSlots) : `${stats.crewAssigned}/${stats.crewSlots}`}
      />
      <StatCell label="Weapons" value={String(stats.weaponCount)} />
      <StatCell label="Damage" value={String(stats.damage)} />
    </section>
  );
}