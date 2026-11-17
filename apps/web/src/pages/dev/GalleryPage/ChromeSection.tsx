import { Button } from "../../../components/Button/Button";
import { CombatLog } from "../../../components/game/CombatLog";
import { PhaseBanner } from "../../../components/game/PhaseBanner";
import { PlaybackControls } from "../../../components/game/PlaybackControls";
import { TurnIndicator } from "../../../components/game/TurnIndicator";
import { UndoControl } from "../../../components/game/UndoControl";
import { VmTrackerRow } from "../../../components/game/VmTrackerRow";
import { Typography } from "../../../components/Typography/Typography";
import { galleryCombatLogRows, galleryVmTrackerSeats } from "../../../fixtures/chromeFixtures";
import { Figure } from "./Figure";
import styles from "./GalleryPage.module.css";

export function ChromeSection() {
  return (
    <section className={styles.section} id="chrome">
      <Typography variant="h3">Chrome</Typography>
      <Typography variant="body2">
        Top-bar HUD, turn flow, undo lock (`UX-2`), animation playback shell, and combat log rows. Fixtures only; the table
        (`implementation-plan.md` §5.3) composes these regions.
      </Typography>

      <div className={styles.group}>
        <Typography variant="overline">Phase banner</Typography>
        <div className={styles.grid}>
          <Figure name="Action phase" note="game round, phase, first-player token">
            <PhaseBanner gameRound={3} phase="Action" />
          </Figure>
          <Figure name="Maintenance" note="Current Maintenance step when applicable">
            <PhaseBanner gameRound={5} phase="Maintenance" maintenanceStep="Enemy Combat (Sector 2)" />
          </Figure>
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">VM tracker and turn</Typography>
        <div className={styles.grid}>
          <Figure name="VM per seat" note="Public taken VM; active seat highlighted">
            <VmTrackerRow seats={galleryVmTrackerSeats} />
          </Figure>
          <Figure name="Turn indicator" note="Whose action token is in play">
            <TurnIndicator seat={1} playerLabel="You" yours />
          </Figure>
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Pass, undo, playback</Typography>
        <div className={styles.grid}>
          <Figure name="Pass" note="Ends your action without spending a token when legal">
            <Button variant="outlined">Pass</Button>
          </Figure>
          <Figure name="Undo available" note="Before any commit point this turn">
            <UndoControl locked={false} />
          </Figure>
          <Figure name="Undo locked" note="After flip, draw, peek, or dice (`UX-2`)">
            <UndoControl locked />
          </Figure>
          <Figure name="Speed and skip" note="Gallery demo sets `--motion-speed` while mounted">
            <PlaybackControls applyGlobalSpeed />
          </Figure>
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Combat log row kinds</Typography>
        <Figure name="Sample combat segment" note="phase, action, combat, reaction, damage, score">
          <CombatLog rows={galleryCombatLogRows} />
        </Figure>
      </div>
    </section>
  );
}