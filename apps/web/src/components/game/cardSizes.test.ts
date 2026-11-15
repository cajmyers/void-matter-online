import { describe, expect, it } from "vitest";
import { cardHeightForWidth, cardPrintHeightMm, cardPrintWidthMm, cardWidthDetail, cardWidthHand } from "./cardSizes";

describe("cardSizes", () => {
  it("matches implementation-plan hand and inspect widths", () => {
    expect(cardWidthHand).toBe(118);
    expect(cardWidthDetail).toBe(220);
    expect(cardWidthDetail).toBeGreaterThan(cardWidthHand);
  });

  it("uses 65 × 100 mm aspect for height from width", () => {
    expect(cardPrintWidthMm).toBe(65);
    expect(cardPrintHeightMm).toBe(100);
    expect(cardHeightForWidth(cardWidthHand)).toBeCloseTo(181.538, 2);
    expect(cardHeightForWidth(cardWidthDetail)).toBeCloseTo(338.462, 2);
  });
});
