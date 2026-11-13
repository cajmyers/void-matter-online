import { describe, expect, it } from "vitest";
import {
  hexTileMarketCubeSize,
  hexTileMarketPillHeight,
  hexTileMarketPillPadY,
  hexTileMarketDemandY,
  hexTileMarketEdgePad,
  hexTileMarketPillWidth,
  hexTileMarketRimInset,
  hexTileMarketRowInset,
  hexTileMarketLayout,
  hexTileMarketLockStackY,
  hexTileMarketPillScaleDetail,
  hexTileMarketRowInsetDetailExtra,
  hexTileMarketSupplyY,
  hexTileSize,
  hexTileSizeBoard,
  hexTileSizeDetail,
  hexTileSizeGalleryBoard,
} from "./hexTileSizes";

describe("hexTileSize", () => {
  it("returns play board and detail presets", () => {
    expect(hexTileSize("board", "play")).toBe(hexTileSizeBoard);
    expect(hexTileSize("board", "gallery")).toBe(hexTileSizeGalleryBoard);
    expect(hexTileSize("detail")).toBe(hexTileSizeDetail);
    expect(hexTileSizeDetail).toBeGreaterThan(hexTileSizeGalleryBoard);
  });

  it("fixes planet market pill height for board and detail hexes", () => {
    expect(hexTileMarketPillHeight).toBe(22);
    expect(hexTileMarketCubeSize + hexTileMarketPillPadY * 2).toBe(hexTileMarketPillHeight);
  });

  it("uses a fixed pill width", () => {
    expect(hexTileMarketPillWidth).toBeGreaterThan(hexTileMarketCubeSize);
  });

  it("pins supply above demand for any hex size", () => {
    for (const hexSize of [hexTileSizeBoard, hexTileSizeGalleryBoard, hexTileSizeDetail]) {
      expect(hexTileMarketSupplyY(hexSize)).toBeLessThan(0);
      expect(hexTileMarketDemandY(hexSize)).toBeGreaterThan(0);
      expect(hexTileMarketSupplyY(hexSize)).toBeLessThan(hexTileMarketDemandY(hexSize));
    }
  });

  it("insets market rows further on detail hexes only", () => {
    const galleryLayout = hexTileMarketLayout(hexTileSizeGalleryBoard);
    const detailLayout = hexTileMarketLayout(hexTileSizeDetail);
    const gallerySupply =
      -hexTileSizeGalleryBoard * hexTileMarketRimInset + galleryLayout.pillHeight / 2 + hexTileMarketEdgePad + hexTileMarketRowInset;
    const detailSupply =
      -hexTileSizeDetail * hexTileMarketRimInset +
      detailLayout.pillHeight / 2 +
      hexTileMarketEdgePad +
      hexTileMarketRowInset +
      hexTileMarketRowInsetDetailExtra;
    expect(hexTileMarketSupplyY(hexTileSizeGalleryBoard)).toBe(gallerySupply);
    expect(hexTileMarketSupplyY(hexTileSizeDetail)).toBe(detailSupply);
  });

  it("scales market pills up on detail hexes only", () => {
    expect(hexTileMarketLayout(hexTileSizeGalleryBoard).pillHeight).toBe(hexTileMarketPillHeight);
    expect(hexTileMarketLayout(hexTileSizeDetail).pillHeight).toBe(Math.round(hexTileMarketPillHeight * hexTileMarketPillScaleDetail));
  });

  it("stacks supply locks above and demand locks below the centred market pill", () => {
    const layout = hexTileMarketLayout(hexTileSizeGalleryBoard);
    const pillTop = -layout.cube / 2 - layout.pillPadY;
    const pillBottom = pillTop + layout.pillHeight;
    const supplyLock = hexTileMarketLockStackY(layout, "above");
    const demandLock = hexTileMarketLockStackY(layout, "below");
    expect(supplyLock + layout.cube / 2).toBeLessThan(pillTop);
    expect(demandLock - layout.cube / 2).toBeGreaterThan(pillBottom);
  });
});
