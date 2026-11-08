// Resource and seat vocabulary shared by components (docs/design-decisions.md section 7, INF-1).

export type ResourceId = "tc" | "h3" | "pc" | "qp";
export type ResourceOrVm = ResourceId | "vm";

export const resourceIds: readonly ResourceId[] = ["tc", "h3", "pc", "qp"];

export const resourceInfo: Readonly<Record<ResourceOrVm, { code: string; name: string; sector: string }>> = {
  tc: { code: "TC", name: "Titanium Carbide", sector: "S4 Hull / Defensive" },
  h3: { code: "H3", name: "Helium-3", sector: "S2 Propulsion / Utility" },
  pc: { code: "PC", name: "Plasma Cells", sector: "S1 Weapons / Offensive" },
  qp: { code: "QP", name: "Quantum Processors", sector: "S3 Cargo / Life Support" },
  vm: { code: "VM", name: "Void Matter", sector: "Victory marker, never spendable" },
};

export type SeatNumber = 1 | 2 | 3 | 4;
export const seatNumbers: readonly SeatNumber[] = [1, 2, 3, 4];

// The owner's seat colours are yellow, white, red and blue. The old rulebook used Red, Green,
// Yellow, Purple. The slot order is confirmed by the owner: red 1, blue 2, yellow 3, white 4.
export const seatColourName: Readonly<Record<SeatNumber, string>> = {
  1: "Red",
  2: "Blue",
  3: "Yellow",
  4: "White",
};

export type ActionTokenKind = "move" | "trade" | "interact" | "tactical";
export const actionTokenKinds: readonly ActionTokenKind[] = ["move", "trade", "interact", "tactical"];
