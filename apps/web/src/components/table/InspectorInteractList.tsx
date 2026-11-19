import { Typography } from "../Typography/Typography";
import styles from "./InspectorInteractList.module.css";

export function InspectorInteractList({ actions }: { readonly actions: readonly string[] }) {
  return (
    <ul className={styles.list}>
      {actions.map((action) => (
        <li key={action}>
          <Typography variant="body2">{action}</Typography>
        </li>
      ))}
    </ul>
  );
}