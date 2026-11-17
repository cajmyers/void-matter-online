/** Prompt `kind` strings the engine will target (`technical-proposal.md` §6). */
export type PromptKind =
  | "chooseAction"
  | "reactionYesNo"
  | "pickOne"
  | "pickHex"
  | "orientTile"
  | "damageChoice"
  | "assignDice"
  | "chooseRerollDice"
  | "payCost"
  | "chooseResources"
  | "orderEffects"
  | "declareRetreat"
  | "fitMakeRoom"
  | "confirmAbandon";

export const promptKindLabels: Readonly<Record<PromptKind, string>> = {
  chooseAction: "Choose action",
  reactionYesNo: "Reaction",
  pickOne: "Pick one",
  pickHex: "Pick hex",
  orientTile: "Orient tile",
  damageChoice: "Damage choice",
  assignDice: "Assign dice",
  chooseRerollDice: "Reroll dice",
  payCost: "Pay cost",
  chooseResources: "Choose resources",
  orderEffects: "Order effects",
  declareRetreat: "Declare retreat",
  fitMakeRoom: "Fit / make room",
  confirmAbandon: "Confirm / abandon",
};