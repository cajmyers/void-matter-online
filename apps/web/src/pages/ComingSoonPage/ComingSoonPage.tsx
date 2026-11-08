import { Panel } from "../../components/Panel/Panel";
import { Typography } from "../../components/Typography/Typography";
import styles from "./ComingSoonPage.module.css";

export interface ComingSoonPageProps {
  readonly title: string;
  readonly stage: string;
  readonly description: string;
}

export function ComingSoonPage({ title, stage, description }: ComingSoonPageProps) {
  return (
    <div className={styles.page}>
      <Panel title={stage}>
        <Typography variant="h2">{title}</Typography>
        <Typography variant="body1">{description}</Typography>
      </Panel>
    </div>
  );
}
