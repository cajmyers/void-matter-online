/** Face-up market card selected for inspect (Stage 1c; fixture lookups in `MarketCardInspector`). */
export type MarketCardInspectTarget =
  | { readonly kind: "asset"; readonly catalogueId: string }
  | { readonly kind: "crew"; readonly catalogueId: string }
  | { readonly kind: "mission"; readonly catalogueId: string };

/** Player ship row in the fleet column (catalogue id + in-play damage). */
export type ShipCardInspectTarget = {
  readonly kind: "ship";
  readonly catalogueId: string;
  readonly damage?: number;
};

export type TableCardInspectTarget = MarketCardInspectTarget | ShipCardInspectTarget;

/** Discard pile opened for inspect (`DCK-2`; fixture supplies full public list in Stage 1c). */
export interface MarketDiscardInspectTarget {
  readonly pileKind: "asset" | "crew" | "mission";
  readonly title: string;
  readonly cardIds: readonly string[];
}