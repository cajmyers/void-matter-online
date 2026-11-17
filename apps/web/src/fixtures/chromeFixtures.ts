import type { CombatLogRowProps } from "../components/game/CombatLogRow";
import type { SeatVmEntry } from "../components/game/VmTrackerRow";

export const galleryVmTrackerSeats: readonly SeatVmEntry[] = [
  { seat: 1, label: "You", voidMatterTaken: 1, activeTurn: true },
  { seat: 2, label: "Bot", voidMatterTaken: 2 },
  { seat: 3, label: "Rival A", voidMatterTaken: 0 },
  { seat: 4, label: "Rival B", voidMatterTaken: 3 },
];

export const galleryCombatLogRows: readonly CombatLogRowProps[] = [
  { kind: "phase", children: "Combat round 2 begins." },
  { kind: "action", seat: 1, children: "You fire Corvette weapons at Iron Skiff." },
  { kind: "combat", children: "2 dice vs 4+ — 1 hit." },
  { kind: "reaction", highlight: true, children: "Bot may use Decoy Launcher?" },
  { kind: "damage", seat: 2, children: "Iron Skiff takes 1 hit." },
  { kind: "score", children: "Mission redeemed: +1 Void Matter to your pool." },
];