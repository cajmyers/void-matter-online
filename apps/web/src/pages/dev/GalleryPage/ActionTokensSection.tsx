import { ActionToken } from "../../../components/game/ActionToken";
import { actionTokenKinds } from "../../../components/game/resources";
import { Typography } from "../../../components/Typography/Typography";
import { Figure } from "./Figure";
import styles from "./GalleryPage.module.css";

const kindNames = { move: "Move", trade: "Trade", interact: "Interact", tactical: "Tactical" } as const;

export function ActionTokensSection() {
  return (
    <section className={styles.section} id="action-tokens">
      <Typography variant="h3">Action tokens</Typography>
      <Typography variant="body2">
        Trade, Interact and Tactical are general (faction) tokens. Only Move belongs to a ship, and an officer token is
        bound to one ship and drawn with a pip (<code>ACT-1</code>).
      </Typography>

      <div className={styles.group}>
        <Typography variant="overline">General fleet tokens, ready and exhausted</Typography>
        <div className={styles.grid}>
          {actionTokenKinds.map((kind) => (
            <Figure key={kind} name={kindNames[kind]}>
              <ActionToken kind={kind} size={48} />
              <ActionToken kind={kind} size={48} exhausted />
            </Figure>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Officer tokens, bound to one ship (pip)</Typography>
        <div className={styles.grid}>
          {actionTokenKinds.map((kind) => (
            <Figure key={kind} name={`${kindNames[kind]}, officer`}>
              <ActionToken kind={kind} size={48} officer />
              <ActionToken kind={kind} size={48} officer exhausted />
            </Figure>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Sizes</Typography>
        <div className={styles.grid}>
          <Figure name="28, 36 and 56 px" note="Smallest is the rival strip; largest is the player mat">
            <ActionToken kind="move" size={28} />
            <ActionToken kind="move" size={36} />
            <ActionToken kind="move" size={56} />
          </Figure>
        </div>
      </div>
    </section>
  );
}
