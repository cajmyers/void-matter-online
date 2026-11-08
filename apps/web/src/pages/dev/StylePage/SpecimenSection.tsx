import { ActionToken } from "../../../components/game/ActionToken";
import { ComponentCard } from "../../../components/game/ComponentCard";
import { DeckBack } from "../../../components/game/DeckBack";
import { ResourceCube } from "../../../components/game/ResourceCube";
import { SeatMark } from "../../../components/game/SeatMark";
import { SpaceBackdrop } from "../../../components/game/SpaceBackdrop";
import { resourceIds, type ResourceId, type SeatNumber } from "../../../components/game/resources";
import { Button } from "../../../components/Button/Button";
import { Panel } from "../../../components/Panel/Panel";
import { Typography } from "../../../components/Typography/Typography";
import { SpecimenBoard } from "./SpecimenBoard";
import styles from "./Specimen.module.css";

// Placeholder numbers. This composite exists to judge the look, not to state rules.

const poolCounts: Readonly<Record<ResourceId, number>> = { tc: 1, h3: 0, pc: 2, qp: 3 };

function VmPips({ taken }: { readonly taken: number }) {
  return (
    <span className={styles.pips} role="img" aria-label={`${taken} of 3 Void Matter`}>
      {[0, 1, 2].map((index) => (
        <span key={index} className={index < taken ? `${styles.pip} ${styles.pipFilled}` : styles.pip} />
      ))}
    </span>
  );
}

function SeatChip({ seat, label, vm, active }: { readonly seat: SeatNumber; readonly label: string; readonly vm: number; readonly active?: boolean }) {
  return (
    <div className={active ? `${styles.seatChip} ${styles.seatChipActive}` : styles.seatChip} style={{ borderColor: `var(--game-seat-${seat})` }}>
      <SeatMark seat={seat} size={18} />
      <Typography variant="subtitle2" className={styles.seatName}>
        {label}
      </Typography>
      <VmPips taken={vm} />
    </div>
  );
}

function CommanderPanel() {
  return (
    <Panel>
      <div className={styles.commanderHead}>
        <div className={styles.portrait}>
          <SeatMark seat={1} size={30} />
        </div>
        <div>
          <Typography variant="overline">Commander</Typography>
          <Typography variant="h5">You</Typography>
          <VmPips taken={1} />
        </div>
      </div>
      <Typography variant="overline">Faction pool: safe, spendable</Typography>
      <div className={styles.poolRow}>
        {resourceIds.map((resource) => (
          <div key={resource} className={styles.poolCell}>
            <ResourceCube resource={resource} size={30} label />
            <Typography variant="numeric" className={styles.poolCount}>
              {poolCounts[resource]}
            </Typography>
          </div>
        ))}
        <div className={styles.vmCell}>
          <ResourceCube resource="vm" size={30} label />
          <Typography variant="numeric" className={styles.poolCount}>
            1
          </Typography>
        </div>
      </div>
      <Typography variant="caption">Void Matter is a score, not a resource. It can never be spent or stolen.</Typography>
      <div className={styles.tokenGroup}>
        <Typography variant="caption">General tokens (whole fleet)</Typography>
        <div className={styles.tokenRow}>
          <ActionToken kind="trade" size={32} />
          <ActionToken kind="interact" size={32} exhausted />
          <ActionToken kind="tactical" size={32} />
        </div>
      </div>
    </Panel>
  );
}

function TurnPanel() {
  return (
    <Panel>
      <div className={styles.turnStats}>
        <div>
          <Typography variant="overline">globalRound</Typography>
          <Typography variant="numeric" className={styles.bigNumber}>
            3
          </Typography>
        </div>
        <div>
          <Typography variant="overline">Phase</Typography>
          <Typography variant="h6">Action</Typography>
        </div>
        <div>
          <Typography variant="overline">Turn</Typography>
          <Typography variant="h6">You</Typography>
        </div>
      </div>
      <Button size="large">End turn</Button>
      <div className={styles.turnSecondary}>
        <Button variant="outlined">Pass</Button>
        <Button variant="outlined" colour="secondary">
          Menu
        </Button>
      </div>
    </Panel>
  );
}

function DecksPanel() {
  return (
    <Panel title="Decks">
      <div className={styles.deckRow}>
        <DeckBack label="Enemy" count={18} rim="var(--game-faction-iron)" />
        <DeckBack label="Missions" count={27} rim="var(--palette-primary-main)" />
        <DeckBack label="Assets" count={34} rim="var(--game-resource-qp)" />
      </div>
    </Panel>
  );
}

function ShipPanel() {
  return (
    <Panel title="Nomad-class Corvette">
      <div className={styles.shipGrid}>
        <div>
          <Typography variant="caption">Upgrade slots</Typography>
          <div className={styles.slotRow}>
            <span className={styles.slot} style={{ borderColor: "var(--game-resource-pc)" }}>
              <ResourceCube resource="pc" size={18} />
            </span>
            <span className={styles.slot} />
            <span className={styles.slot} />
            <span className={styles.slot} />
          </div>
        </div>
        <div>
          <Typography variant="caption">Hull</Typography>
          <div className={styles.slotRow}>
            <span className={`${styles.slot} ${styles.hull}`} />
          </div>
        </div>
        <div>
          <Typography variant="caption">Crew</Typography>
          <div className={styles.slotRow}>
            <span className={styles.slot} />
          </div>
        </div>
        <div>
          <Typography variant="caption">Cargo: exposed, can be stolen</Typography>
          <div className={styles.slotRow}>
            <span className={`${styles.slot} ${styles.cargo}`}>
              <ResourceCube resource="qp" size={18} />
            </span>
            <span className={`${styles.slot} ${styles.cargo}`} />
          </div>
        </div>
      </div>
      <div className={styles.tokenGroup}>
        <Typography variant="caption">Ship token (ACT-1)</Typography>
        <div className={styles.tokenRow}>
          <ActionToken kind="move" size={32} />
        </div>
      </div>
    </Panel>
  );
}

function RivalPanel() {
  return (
    <Panel title="Rival: Bot, seat 2">
      <div className={styles.rivalHead}>
        <SeatMark seat={2} size={24} />
        <Typography variant="h6">Bot</Typography>
        <VmPips taken={2} />
      </div>
      <Typography variant="caption">Pool (public)</Typography>
      <div className={styles.poolRow}>
        {resourceIds.map((resource) => (
          <div key={resource} className={styles.poolCell}>
            <ResourceCube resource={resource} size={22} />
            <Typography variant="numeric" className={styles.poolCountSmall}>
              {resource === "h3" ? 2 : 1}
            </Typography>
          </div>
        ))}
      </div>
      <Typography variant="caption">1 ship. 3 of 4 tokens ready.</Typography>
    </Panel>
  );
}

function PromptDialog() {
  return (
    <Panel title="Damage choice" className={styles.prompt}>
      <Typography variant="h5">Bot's Minigun hits you twice</Typography>
      <Typography variant="body2">
        Your Corvette has 1 free hull slot, so it cannot take 2 cubes. It must lose a component instead.
      </Typography>
      <div className={styles.promptActions}>
        <Button disabled>Take 2 cubes</Button>
        <Button variant="outlined">Discard a component</Button>
      </div>
      <Typography variant="caption">Cube option is unavailable: not every hit fits (overflow rule).</Typography>
    </Panel>
  );
}

function CardRow() {
  return (
    <div className={styles.cardRow}>
      <ComponentCard
        title="Energy Shields"
        text="Each energy weapon's hits are reduced to at most 1, per weapon."
        sector="tc"
        cost={["tc", "tc", "qp"]}
        art="planet"
        note="Specimen"
      />
      <ComponentCard
        title="Plasma Lance"
        text="Placeholder card text, to judge the layout."
        sector="pc"
        cost={["pc", "pc"]}
        art="ship"
        note="Specimen"
      />
      <ComponentCard
        title="Quantum Relay"
        text="Placeholder card text, to judge the layout."
        sector="qp"
        cost={["qp", "h3", "tc"]}
        art="nebula"
        note="Specimen"
      />
      <ComponentCard
        title="Ion Drive"
        text="Placeholder card text, to judge the layout."
        sector="h3"
        cost={["h3", "h3"]}
        art="ship"
        note="Specimen"
      />
    </div>
  );
}

export function SpecimenSection() {
  return (
    <section className={styles.section} id="specimen">
      <Typography variant="h3">Specimen: the table</Typography>
      <Typography variant="body2">
        A static mock of the finished screen, using the real components over a placeholder space scene. All numbers
        and art are placeholders. This is a preview of sub-stages 1b and 1c, not the final layout.
      </Typography>
      <div className={styles.table}>
        <SpaceBackdrop />
        <div className={styles.content}>
          <div className={styles.main}>
            <aside className={styles.left}>
              <CommanderPanel />
              <RivalPanel />
            </aside>
            <div className={styles.boardWrap}>
              <div className={styles.seatRow}>
                <SeatChip seat={1} label="You" vm={1} active />
                <SeatChip seat={2} label="Bot" vm={2} />
              </div>
              <SpecimenBoard />
              <div className={styles.promptDock}>
                <PromptDialog />
              </div>
            </div>
            <aside className={styles.right}>
              <TurnPanel />
              <DecksPanel />
              <ShipPanel />
            </aside>
          </div>
          <CardRow />
        </div>
      </div>
    </section>
  );
}
