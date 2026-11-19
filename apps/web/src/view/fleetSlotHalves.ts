import type { ComponentSlotSize } from "../components/game/ComponentCard.types";

/** Upgrade capacity counted in half-slots (`SLT-1`; Corvette = 8). */
export function slotSizeToHalves(slotSize: ComponentSlotSize): number {
  return slotSize * 2;
}

export interface FleetInstallSpan {
  readonly catalogueId: string;
  readonly startHalf: number;
  readonly spanHalves: number;
}

/** Pack installed components into consecutive half-slots in catalogue order. */
export function fleetInstallSpans(
  installedIds: readonly string[],
  slotSizeForId: (catalogueId: string) => ComponentSlotSize,
  capacityHalves = 8,
): readonly FleetInstallSpan[] {
  const spans: FleetInstallSpan[] = [];
  let cursor = 0;
  for (const catalogueId of installedIds) {
    const spanHalves = slotSizeToHalves(slotSizeForId(catalogueId));
    if (cursor + spanHalves > capacityHalves) {
      break;
    }
    spans.push({ catalogueId, startHalf: cursor, spanHalves });
    cursor += spanHalves;
  }
  return spans;
}