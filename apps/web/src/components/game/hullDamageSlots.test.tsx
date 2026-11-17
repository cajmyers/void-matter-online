import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { HullDamageSlots } from "./HullTrack";

describe("HullDamageSlots", () => {
  it("renders empty slots for printed hull capacity", () => {
    const html = renderToStaticMarkup(<HullDamageSlots capacity={3} damage={0} slotSize={14} />);
    expect(html).toContain("Hull 3 slots, 0 with damage");
    expect(html).not.toContain("Damage cube");
  });

  it("fills slots from the left with damage cubes", () => {
    const html = renderToStaticMarkup(<HullDamageSlots capacity={3} damage={2} slotSize={14} />);
    expect(html).toContain("2 with damage");
    expect(html.match(/aria-label="Damage cube"/g)?.length).toBe(2);
  });
});