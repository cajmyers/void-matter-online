import { ActionToken } from "../../../components/game/ActionToken";
import { AttackDieIcon } from "../../../components/game/AttackDieIcon";
import { UpgradeSlotMarker } from "../../../components/game/UpgradeSlotMarker";
import { ResourceCube } from "../../../components/game/ResourceCube";
import { SeatMark } from "../../../components/game/SeatMark";
import {
  actionTokenKinds,
  resourceIds,
  resourceInfo,
  seatColourName,
  seatNumbers,
  type ResourceOrVm,
} from "../../../components/game/resources";
import { HexTileFigureSvg } from "../../../components/hex/HexTileFigure";
import { hexTileSizeGalleryBoard } from "../../../components/hex/hexTileSizes";
import { planetDetailArt } from "../../../components/hex/planetTileArt";
import { ShipBadge } from "../../../components/hex/HexTile";
import { Typography } from "../../../components/Typography/Typography";
import styles from "./StylePage.module.css";

const resourcesWithVm: readonly ResourceOrVm[] = [...resourceIds, "vm"];
const iconSizes = [28, 36, 56, 96] as const;

const factions = [
  { id: "iron", name: "Iron Syndicate", note: "In the first slice" },
  { id: "prism", name: "Prism", note: "Later" },
  { id: "hive", name: "Hive", note: "Later" },
] as const;

export function GamePaletteSection() {
  return (
    <section className={styles.section} id="game-palette">
      <Typography variant="h3">Game colours</Typography>
      <Typography variant="body2">
        Every game colour is paired with a shape, so nothing depends on colour alone. Use the vision simulator in the
        toolbar to check.
      </Typography>

      <Typography variant="overline">Resources (colour and shape)</Typography>
      <div className={styles.itemRow}>
        {resourcesWithVm.map((resource) => (
          <div key={resource} className={styles.item}>
            <ResourceCube resource={resource} size={44} />
            <Typography variant="subtitle1">{resourceInfo[resource].code}</Typography>
            <Typography variant="caption">{resourceInfo[resource].name}</Typography>
            <Typography variant="caption">{resourceInfo[resource].sector}</Typography>
          </div>
        ))}
        <div className={styles.item}>
          <ResourceCube resource="tc" size={44} hollow />
          <Typography variant="subtitle1">Ghost</Typography>
          <Typography variant="caption">Demand on a planet</Typography>
          <Typography variant="caption">(full strength is supply)</Typography>
        </div>
      </div>

      <Typography variant="overline">Seats (colour and shape)</Typography>
      <div className={styles.itemRow}>
        {seatNumbers.map((seat) => (
          <div key={seat} className={styles.item}>
            <div className={styles.seatChip} style={{ background: `var(--game-seat-${seat})`, color: `var(--game-seat-${seat}-contrast)` }}>
              <SeatMark seat={seat} size={26} onSeatColour />
            </div>
            <Typography variant="subtitle1">Seat {seat}</Typography>
            <Typography variant="caption">{seatColourName[seat]}</Typography>
          </div>
        ))}
      </div>

      <Typography variant="overline">Enemy factions</Typography>
      <div className={styles.itemRow}>
        {factions.map((faction) => (
          <div key={faction.id} className={styles.item}>
            <div className={styles.factionChip} style={{ borderColor: `var(--game-faction-${faction.id})`, color: `var(--game-faction-${faction.id})` }}>
              {faction.name.slice(0, 1)}
            </div>
            <Typography variant="subtitle1">{faction.name}</Typography>
            <Typography variant="caption">{faction.note}</Typography>
          </div>
        ))}
      </div>

      <Typography variant="overline">Upgrade slot marker</Typography>
      <div className={styles.itemRow}>
        <div className={styles.item}>
          <div className={styles.iconSizes}>
            <UpgradeSlotMarker slotSize={0.5} size={32} />
            <UpgradeSlotMarker slotSize={1} size={32} />
            <UpgradeSlotMarker slotSize={2} size={32} />
          </div>
          <Typography variant="subtitle1">Module slots</Typography>
          <Typography variant="caption">Overlaid on asset art (`SLT-1`).</Typography>
        </div>
      </div>

      <Typography variant="overline">Attack die (weapon cards)</Typography>
      <div className={styles.itemRow}>
        <div className={styles.item}>
          <div className={styles.iconSizes}>
            {iconSizes.map((size) => (
              <AttackDieIcon key={size} size={Math.round(size * 0.45)} />
            ))}
          </div>
          <Typography variant="subtitle1">Attack die</Typography>
          <Typography variant="caption">One icon per die on asset cards. Drop attack.png in assets/icons/dice/ to override.</Typography>
        </div>
      </div>

      <Typography variant="overline">Action icons (ready, exhausted, at four sizes)</Typography>
      <div className={styles.itemRow}>
        {actionTokenKinds.map((kind) => (
          <div className={styles.item} key={kind}>
            <div className={styles.iconSizes}>
              {iconSizes.map((size) => (
                <ActionToken key={size} kind={kind} size={size} />
              ))}
            </div>
            <div className={styles.iconSizes}>
              {iconSizes.map((size) => (
                <ActionToken key={size} kind={kind} size={size} exhausted />
              ))}
            </div>
            <Typography variant="subtitle1">{kind.charAt(0).toUpperCase() + kind.slice(1)}</Typography>
            <Typography variant="caption">
              {kind === "move" ? "Ship token (one per ship)" : "General token (whole fleet)"}
            </Typography>
          </div>
        ))}
      </div>
      <Typography variant="overline">Board and token states</Typography>
      <div className={styles.itemRow}>
        <div className={styles.item}>
          <div className={styles.tokenPair}>
            <ActionToken kind="move" />
            <ActionToken kind="move" exhausted />
          </div>
          <Typography variant="subtitle1">Ready and exhausted</Typography>
          <Typography variant="caption">Solid ring, then dashed and dim</Typography>
        </div>
        <div className={styles.item}>
          <div className={styles.tokenPair}>
            <ActionToken kind="interact" officer />
            <ActionToken kind="tactical" officer exhausted />
          </div>
          <Typography variant="subtitle1">Officer tokens</Typography>
          <Typography variant="caption">A pip: belongs to one ship (ACT-1)</Typography>
        </div>
        <div className={styles.item}>
          <HexTileFigureSvg
            size={hexTileSizeGalleryBoard}
            ariaLabel="Gates and a selected tile"
            tiles={[
              {
                body: {
                  kind: "planet",
                  title: "Vulkan's Forge",
                  supply: [{ resource: "tc", amount: 4 }, { resource: "h3", amount: 2 }],
                  demand: [{ resource: "pc", amount: 2 }, { resource: "qp", amount: 3 }],
                  lockedDemand: 1,
                  selected: true,
                  ...(planetDetailArt("Vulkan's Forge") ? { detailArt: planetDetailArt("Vulkan's Forge") } : {}),
                },
                gates: ["TL", "R", "BL"],
              },
            ]}
          />
          <Typography variant="subtitle1">Gates and locked demand</Typography>
          <Typography variant="caption">
            Cyan gate bars on the rim; locks above supply pills, below demand (2 after trade, −1 each Maintenance)
          </Typography>
        </div>
        <div className={styles.item}>
          <svg viewBox="-30 -30 60 60" width={72} height={72} role="img" aria-label="Pinned ship">
            <ShipBadge x={0} y={0} size={80} seat={2} pinned />
          </svg>
          <Typography variant="subtitle1">Pinned ship</Typography>
          <Typography variant="caption">Dashed danger ring</Typography>
        </div>
      </div>
    </section>
  );
}
