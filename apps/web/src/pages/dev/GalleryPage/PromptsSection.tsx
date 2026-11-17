import { AssetCard } from "../../../components/game/AssetCard";
import { cardWidthHand } from "../../../components/game/cardSizes";
import { CrewCard } from "../../../components/game/CrewCard";
import { EnemyCard } from "../../../components/game/EnemyCard";
import { MissionCard } from "../../../components/game/MissionCard";
import { AssignDicePrompt } from "../../../components/prompts/AssignDicePrompt";
import { ChooseActionPrompt } from "../../../components/prompts/ChooseActionPrompt";
import {
  ChooseTacticalKindPrompt,
  galleryTacticalKindsWithBeam,
} from "../../../components/prompts/ChooseTacticalKindPrompt";
import { ChooseResourcesPrompt } from "../../../components/prompts/ChooseResourcesPrompt";
import { ChooseRerollDicePrompt } from "../../../components/prompts/ChooseRerollDicePrompt";
import { ConfirmAbandonPrompt } from "../../../components/prompts/ConfirmAbandonPrompt";
import { DamageChoicePrompt } from "../../../components/prompts/DamageChoicePrompt";
import { DeclareRetreatPrompt } from "../../../components/prompts/DeclareRetreatPrompt";
import { FitMakeRoomPrompt } from "../../../components/prompts/FitMakeRoomPrompt";
import { OrderEffectsPrompt } from "../../../components/prompts/OrderEffectsPrompt";
import { OrientTilePrompt } from "../../../components/prompts/OrientTilePrompt";
import { PayCostPrompt } from "../../../components/prompts/PayCostPrompt";
import { PickHexPrompt } from "../../../components/prompts/PickHexPrompt";
import { PickOnePrompt, SelectablePromptCard } from "../../../components/prompts/PickOnePrompt";
import { ReactionYesNoPrompt } from "../../../components/prompts/ReactionYesNoPrompt";
import { Typography } from "../../../components/Typography/Typography";
import {
  galleryAssignDice,
  galleryChooseResources,
  galleryDamageCubes,
  galleryDamageOverflow,
  galleryFitMakeRoomSlots,
  galleryOrderEffects,
  galleryPayCost,
  galleryPickOneAsset,
  galleryPickOneCrew,
  galleryPickOneEnemy,
  galleryPickOneMission,
  galleryReactionDecoy,
  galleryReactionTemporalEcho,
  galleryRerollDice,
  galleryRetreatDeclarations,
} from "../../../fixtures/promptFixtures";
import { ownerAssetCardsForDeck } from "../../../fixtures/sectorAssetCards";
import { Figure } from "./Figure";
import styles from "./GalleryPage.module.css";

const fitSlotCards = ownerAssetCardsForDeck("s3")
  .filter((card) => ["compact-storage", "crew-quarters"].includes(card.catalogueId))
  .slice(0, 2);

export function PromptsSection() {
  return (
    <section className={styles.section} id="prompts">
      <Typography variant="h3">Prompts</Typography>
      <Typography variant="body2">
        Fourteen prompt-host mocks (`implementation-plan.md` §5.2, technical proposal §6). Each is a presentational shell
        the engine will target later via <code>GameView.pending</code>; fixtures supply copy and samples only.
      </Typography>

      <div className={styles.group}>
        <Typography variant="overline">Action, reactions, picks</Typography>
        <div className={styles.grid}>
          <Figure name="1 · Choose action" note="Move / Trade / Interact / Tactical, free action, Pass">
            <ChooseActionPrompt />
          </Figure>
          <Figure name="1b · Tactical kind" note="Attack, Evade, Repair — universal kinds">
            <ChooseTacticalKindPrompt />
          </Figure>
          <Figure name="1c · Tactical + component" note="Beam Projector only if installed + legal target">
            <ChooseTacticalKindPrompt kinds={[...galleryTacticalKindsWithBeam]} />
          </Figure>
          <Figure name="2 · Reaction (affordable)" note="Decoy Launcher; cost in pool">
            <ReactionYesNoPrompt {...galleryReactionDecoy} cost={[...galleryReactionDecoy.cost]} />
          </Figure>
          <Figure name="2 · Reaction + exchange" note="Exact H3 missing → 3-for-1 (`LOT-1`)">
            <ReactionYesNoPrompt
              {...galleryReactionTemporalEcho}
              cost={[...galleryReactionTemporalEcho.cost]}
              exchange={galleryReactionTemporalEcho.exchange}
            />
          </Figure>
          {galleryPickOneAsset ? (
            <Figure name="3 · Pick market card" note="One of N face-up cards">
              <PickOnePrompt title="Pick card" headline="Choose a card to buy" lead="Sector market — S1 Weapons.">
                <SelectablePromptCard selected label={galleryPickOneAsset.title}>
                  <AssetCard {...galleryPickOneAsset} width={cardWidthHand} />
                </SelectablePromptCard>
                {ownerAssetCardsForDeck("s1")
                  .filter((card) => card.catalogueId !== galleryPickOneAsset!.catalogueId)
                  .slice(0, 2)
                  .map((card) => (
                    <SelectablePromptCard key={card.catalogueId} label={card.title}>
                      <AssetCard {...card} width={cardWidthHand} />
                    </SelectablePromptCard>
                  ))}
              </PickOnePrompt>
            </Figure>
          ) : null}
          {galleryPickOneCrew ? (
            <Figure name="3 · Pick crew" note="Recruit from crew market">
              <PickOnePrompt title="Pick crew" headline="Recruit one crew" lead="Pay costs after selection.">
                <SelectablePromptCard selected label={galleryPickOneCrew.title}>
                  <CrewCard {...galleryPickOneCrew} width={cardWidthHand} />
                </SelectablePromptCard>
              </PickOnePrompt>
            </Figure>
          ) : null}
          {galleryPickOneMission ? (
            <Figure name="3 · Pick mission" note="Commission from mission market">
              <PickOnePrompt title="Pick mission" headline="Take one mission" lead="Held mission cap 3.">
                <SelectablePromptCard selected label={galleryPickOneMission.title}>
                  <MissionCard
                    catalogueId={galleryPickOneMission.id}
                    title={galleryPickOneMission.title}
                    text={galleryPickOneMission.text}
                    voidMatter={galleryPickOneMission.voidMatter}
                    width={cardWidthHand}
                  />
                </SelectablePromptCard>
              </PickOnePrompt>
            </Figure>
          ) : null}
          {galleryPickOneEnemy ? (
            <Figure name="3 · Pick enemy target" note="Manual weapon target">
              <PickOnePrompt title="Pick target" headline="Choose a ship to fire at" lead="Iron Skiff salvo.">
                <SelectablePromptCard selected label={galleryPickOneEnemy.name}>
                  <EnemyCard
                    enemyId={galleryPickOneEnemy.id}
                    name={galleryPickOneEnemy.name}
                    faction={galleryPickOneEnemy.faction}
                    tier={galleryPickOneEnemy.tier}
                    hull={galleryPickOneEnemy.hull}
                    speed={galleryPickOneEnemy.speed}
                    weapons={galleryPickOneEnemy.weaponsLine}
                    special={galleryPickOneEnemy.specialText}
                    width={cardWidthHand}
                  />
                </SelectablePromptCard>
              </PickOnePrompt>
            </Figure>
          ) : null}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Map, damage, combat decisions</Typography>
        <div className={styles.grid}>
          <Figure name="4 · Pick hex (move)" note="Reachable destinations on map">
            <PickHexPrompt title="Pick hex" headline="Move Corvette" mode="move" />
          </Figure>
          <Figure name="5 · Orient tile" note="Legal rotations only (`MAP-6`, `MAP-7`)">
            <OrientTilePrompt />
          </Figure>
          <Figure name="6 · Damage (overflow)" note="`LOT-3`; cubes hidden when hits do not fit">
            <DamageChoicePrompt {...galleryDamageOverflow} />
          </Figure>
          <Figure name="6 · Damage (choice)" note="Cubes or component when both legal">
            <DamageChoicePrompt {...galleryDamageCubes} />
          </Figure>
          <Figure name="7 · Assign dice" note="Each die → target">
            <AssignDicePrompt {...galleryAssignDice} />
          </Figure>
          <Figure name="8 · Choose rerolls" note="Pick two dice">
            <ChooseRerollDicePrompt {...galleryRerollDice} />
          </Figure>
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Costs, ordering, retreat, install, confirm</Typography>
        <div className={styles.grid}>
          <Figure name="9 · Pay cost" note="Includes optional 3-for-1">
            <PayCostPrompt {...galleryPayCost} />
          </Figure>
          <Figure name="10 · Choose resources" note="Spoils / swaps (`LOT-2`)">
            <ChooseResourcesPrompt {...galleryChooseResources} />
          </Figure>
          <Figure name="11 · Order effects" note="Simultaneous stack (`CMB-10`)">
            <OrderEffectsPrompt headline="Resolve these in order" effects={[...galleryOrderEffects.effects]} />
          </Figure>
          <Figure name="12 · Declare retreat" note="Sequential declarations (`CMB-6`)">
            <DeclareRetreatPrompt headline="Declare retreat or hold" declarations={galleryRetreatDeclarations()} />
          </Figure>
          <Figure name="13 · Fit / make room" note="Discard to install (`LOT-5`)">
            <FitMakeRoomPrompt
              headline={galleryFitMakeRoomSlots.headline}
              incomingLabel={galleryFitMakeRoomSlots.incomingLabel}
              slots={fitSlotCards.map((card) => ({
                label: card.title,
                preview: <AssetCard {...card} width={cardWidthHand} />,
              }))}
            />
          </Figure>
          <Figure name="14 · Confirm / abandon" note="Destructive confirm when needed">
            <ConfirmAbandonPrompt
              headline="Abandon mission?"
              lead="Return the mission to the deck and lose progress on this tracker."
              confirmLabel="Abandon"
              cancelLabel="Keep mission"
              destructive
              preview={
                galleryPickOneMission ? (
                  <MissionCard
                    catalogueId={galleryPickOneMission.id}
                    title={galleryPickOneMission.title}
                    text={galleryPickOneMission.text}
                    voidMatter={galleryPickOneMission.voidMatter}
                    width={cardWidthHand}
                  />
                ) : null
              }
            />
          </Figure>
        </div>
      </div>
    </section>
  );
}