import type { CombatLogRowProps } from "../components/game/CombatLogRow";
import type { SeatVmEntry } from "../components/game/VmTrackerRow";

export const galleryVmTrackerSeats: readonly SeatVmEntry[] = [
  { seat: 1, label: "You", voidMatterTaken: 1, pool: { tc: 1, h3: 0, pc: 2, qp: 3 }, activeTurn: true },
  { seat: 2, label: "Bot", voidMatterTaken: 2, pool: { tc: 0, h3: 3, pc: 1, qp: 0 } },
  { seat: 3, label: "Rival A", voidMatterTaken: 0, pool: { tc: 2, h3: 2, pc: 0, qp: 1 } },
  { seat: 4, label: "Rival B", voidMatterTaken: 3, pool: { tc: 4, h3: 1, pc: 2, qp: 2 } },
];

export const galleryCombatLogRows: readonly CombatLogRowProps[] = [
  { kind: "phase", children: "Combat round 2 begins." },
  { kind: "action", seat: 1, children: "You fire Corvette weapons at Iron Skiff." },
  { kind: "combat", children: "2 dice vs 4+ — 1 hit." },
  { kind: "reaction", highlight: true, children: "Bot may use Decoy Launcher?" },
  { kind: "damage", seat: 2, children: "Iron Skiff takes 1 hit." },
  { kind: "score", children: "Mission redeemed: +1 Void Matter to your pool." },
];