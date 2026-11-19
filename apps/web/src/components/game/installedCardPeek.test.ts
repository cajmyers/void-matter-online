import { describe, expect, it } from "vitest";
import {
  assetCardBottomInsetPx,
  assetCardInstalledEffectOnlyPeekHeight,
  assetCardTextBlockHeight,
} from "./assetCardLayout";
import { cardWidthDetail, cardWidthHand } from "./cardSizes";
import {
  assetCardEffectLayout,
  assetCardInstalledPeekHeights,
  crewCardEffectLayout,
  crewCardInstalledPeekHeights,
} from "./installedCardPeek";
import { ownerGalleryAssetCardsById } from "../../fixtures/sectorAssetCards";
import { galleryCrewCardsById } from "../../fixtures/zoneFixtures";

describe("installedCardPeek", () => {
  it("classifies nested overdrive as footer-only (effect area height only)", () => {
    const nested = ownerGalleryAssetCardsById["nested-overdrive"];
    expect(nested).toBeDefined();
    if (!nested) return;
    const { catalogueId: _id, ...props } = nested;
    expect(assetCardEffectLayout(props, cardWidthDetail)).toBe("footerOnly");
    const { peekHeight, fullHeight } = assetCardInstalledPeekHeights(props, cardWidthDetail);
    expect(peekHeight).toBeLessThan(fullHeight);
    expect(peekHeight).toBe(assetCardInstalledEffectOnlyPeekHeight(cardWidthDetail, "s2"));
  });

  it("classifies beam projector as text and footer", () => {
    const beam = ownerGalleryAssetCardsById["beam-projector"];
    expect(beam).toBeDefined();
    if (!beam) return;
    const { catalogueId: _id, ...props } = beam;
    expect(assetCardEffectLayout(props, cardWidthHand)).toBe("both");
    const rulesOnly = assetCardInstalledPeekHeights({ ...props, rulesText: "" }, cardWidthDetail);
    const full = assetCardInstalledPeekHeights(props, cardWidthDetail);
    expect(full.peekHeight).toBeGreaterThan(rulesOnly.peekHeight);
  });

  it("sizes energy shields text-only peek from rules lines, not the full text box", () => {
    const shields = ownerGalleryAssetCardsById["energy-shields"];
    expect(shields).toBeDefined();
    if (!shields) return;
    const { catalogueId: _id, ...props } = shields;
    expect(assetCardEffectLayout(props, cardWidthDetail)).toBe("textOnly");
    const fullTextBoxPeek =
      assetCardTextBlockHeight(cardWidthDetail, props.sectorDeck) + 4 + assetCardBottomInsetPx(cardWidthDetail);
    const measured = assetCardInstalledPeekHeights(props, cardWidthDetail);
    expect(measured.peekHeight).toBeLessThan(fullTextBoxPeek);
    const nested = ownerGalleryAssetCardsById["nested-overdrive"];
    expect(nested).toBeDefined();
    if (!nested) return;
    const { catalogueId: _nestedId, ...nestedProps } = nested;
    const nestedPeek = assetCardInstalledPeekHeights(nestedProps, cardWidthDetail);
    expect(measured.peekHeight).toBeLessThan(nestedPeek.peekHeight + 48);
  });

  it("classifies ensign pilot crew as footer-only", () => {
    const pilot = galleryCrewCardsById.pilot;
    expect(pilot).toBeDefined();
    if (!pilot) return;
    expect(crewCardEffectLayout(pilot)).toBe("footerOnly");
    const merchant = galleryCrewCardsById.merchant;
    if (merchant?.text.trim()) {
      expect(crewCardEffectLayout(merchant)).toBe("both");
    }
    const pilotPeek = crewCardInstalledPeekHeights(pilot, cardWidthDetail);
    expect(pilotPeek.layout).toBe("footerOnly");
  });
});