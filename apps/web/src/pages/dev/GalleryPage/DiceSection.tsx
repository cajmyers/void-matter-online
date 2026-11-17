import { CombatDie } from "../../../components/game/CombatDie";
import type { CombatDieValue } from "../../../components/game/combatDiePips";
import { Typography } from "../../../components/Typography/Typography";
import { Figure } from "./Figure";
import styles from "./GalleryPage.module.css";

const dieValues: readonly CombatDieValue[] = [1, 2, 3, 4, 5, 6];

export function DiceSection() {
  return (
    <section className={styles.section} id="dice">
      <Typography variant="h3">Dice</Typography>
      <Typography variant="body2">
        Combat d6: faces 1–6 and resolution chrome. Success is green, fail is red; a 6 is always success and a 1 is
        always fail in rules (`design-decisions.md`). No extra styling for naturals — the engine sets success/fail.
        Throw animation lands in Stage 1e.
      </Typography>

      <div className={styles.group}>
        <Typography variant="overline">Faces (resting)</Typography>
        <div className={styles.grid}>
          <Figure name="1 through 6" note="Standard pip layout at 48px">
            {dieValues.map((value) => (
              <CombatDie key={value} value={value} size={48} />
            ))}
          </Figure>
          <Figure name="Two sizes" note="40px and 64px — table vs combat log">
            <CombatDie value={4} size={40} />
            <CombatDie value={4} size={64} />
          </Figure>
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">States (face 4)</Typography>
        <div className={styles.grid}>
          {(
            [
              { state: "resting" as const, note: "Idle on the table or in a pool" },
              { state: "thrown" as const, note: "Settled pose until motion lab" },
              { state: "hit" as const, note: "Success (green)" },
              { state: "miss" as const, note: "Fail (red)" },
            ] as const
          ).map(({ state, note }) => (
            <Figure key={state} name={state === "hit" ? "success" : state === "miss" ? "fail" : state} note={note}>
              <CombatDie value={4} state={state} size={48} />
            </Figure>
          ))}
          <Figure name="reroll + success" note="Yellow outline; green border when the reroll succeeds">
            <CombatDie value={5} state="hit" rerolled size={48} />
          </Figure>
          <Figure name="reroll + fail" note="Yellow outline; red border when the reroll fails">
            <CombatDie value={2} state="miss" rerolled size={48} />
          </Figure>
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Salvo (resolved)</Typography>
        <Figure name="Example roll" note="6 and 5 success; 1 always fail; rest fail at 5+ threshold">
          <CombatDie value={6} state="hit" size={44} />
          <CombatDie value={2} state="miss" size={44} />
          <CombatDie value={5} state="hit" size={44} />
          <CombatDie value={1} state="miss" size={44} />
          <CombatDie value={4} state="miss" size={44} />
          <CombatDie value={3} state="miss" size={44} />
        </Figure>
      </div>
    </section>
  );
}