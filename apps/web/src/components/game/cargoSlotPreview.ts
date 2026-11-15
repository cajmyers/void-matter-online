import type { ResourceId } from "./resources";

const resources: readonly ResourceId[] = ["tc", "h3", "pc", "qp"];

function hashString(value: string): number {
  let h = 0;
  for (let index = 0; index < value.length; index += 1) {
    h = (h * 31 + value.charCodeAt(index)) | 0;
  }
  return h;
}

function seededShuffle(seed: string): ResourceId[] {
  const order = [...resources];
  let h = hashString(seed);
  for (let i = order.length - 1; i > 0; i -= 1) {
    h = (h * 1_103_515_245 + 12_345) | 0;
    const j = Math.abs(h) % (i + 1);
    const tmp = order[i]!;
    order[i] = order[j]!;
    order[j] = tmp;
  }
  return order;
}

/** Stable preview fill; multiple slots use distinct resource types when possible. */
export function previewCargoSlotResources(seed: string, slotCount: number): readonly ResourceId[] {
  if (slotCount <= 0) {
    return [];
  }
  const order = seededShuffle(seed);
  if (slotCount === 1) {
    return [order[0]!];
  }
  if (slotCount <= resources.length) {
    return order.slice(0, slotCount);
  }

  const slots: ResourceId[] = [];
  let cursor = 0;
  for (let index = 0; index < slotCount; index += 1) {
    let resource = order[cursor % order.length]!;
    if (index > 0 && resource === slots[index - 1]) {
      cursor += 1;
      resource = order[cursor % order.length]!;
    }
    slots.push(resource);
    cursor += 1;
  }
  return slots;
}