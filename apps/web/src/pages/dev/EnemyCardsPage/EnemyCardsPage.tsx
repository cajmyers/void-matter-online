import type { EnemyFactionId, EnemyShip } from "@void-matter/content";
import {
  ENEMY_FACTION_LABELS,
  enemyCatalogue,
  firstPlayableSlice,
  fullGameEnemyDecks,
} from "@void-matter/content";
import { EnemyCard } from "../../../components/game/EnemyCard";
import { Typography } from "../../../components/Typography/Typography";
import { CatalogueDeckBackSection, FigureDeck } from "../GalleryPage/FigureDeck";
import { CardScalesFigure } from "../GalleryPage/Figure";
import galleryStyles from "../GalleryPage/GalleryPage.module.css";
import styles from "../S1CardsPage/S1CardsPage.module.css";

const factionOrder: readonly EnemyFactionId[] = ["iron-syndicate", "prism-ascendancy", "the-hive"];

function copiesInFullGame(enemyId: string): { exploration: number; reinforcement: number } {
  let exploration = 0;
  let reinforcement = 0;
  for (const row of fullGameEnemyDecks.exploration.cards) {
    if (row.enemyId === enemyId) {
      exploration = row.copies;
    }
  }
  for (const row of fullGameEnemyDecks.reinforcement.cards) {
    if (row.enemyId === enemyId) {
      reinforcement = row.copies;
    }
  }
  return { exploration, reinforcement };
}

function deckNote(enemy: EnemyShip): string {
  const full = copiesInFullGame(enemy.id);
  const parts: string[] = [];
  if (full.exploration > 0) {
    parts.push(`${full.exploration}× exploration`);
  }
  if (full.reinforcement > 0) {
    parts.push(`${full.reinforcement}× reinforcement`);
  }
  if (parts.length === 0) {
    return `Level ${enemy.tier} · catalogue only`;
  }
  return `Level ${enemy.tier} · ${parts.join(" · ")} · ${enemy.tier} face-down reward${enemy.tier === 1 ? "" : "s"}`;
}

function enemiesForFaction(faction: EnemyFactionId): readonly EnemyShip[] {
  return enemyCatalogue
    .filter((enemy) => enemy.faction === faction)
    .sort((a, b) => (a.tier !== b.tier ? a.tier - b.tier : a.name.localeCompare(b.name, "en", { sensitivity: "base" })));
}

const sliceCardTotal =
  firstPlayableSlice.enemyDecks.explorationSize + firstPlayableSlice.enemyDecks.reinforcementSize;
const fullCardTotal = fullGameEnemyDecks.explorationDeckSize + fullGameEnemyDecks.reinforcementDeckSize;

const factionIntro: Readonly<Record<EnemyFactionId, string>> = {
  "iron-syndicate": "Underworld Extortion: destroyer pays tier resources from their faction pool (`design-decisions.md` §4).",
  "prism-ascendancy": "Prismatic defences and Phase Lattice on the flagship.",
  "the-hive": "Brood spawns and Endless Swarm; Larva exists as both card and token (`LOT-4`).",
};

export default function EnemyCardsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <Typography variant="overline">Stage 1b · Enemies (`DCK-3`, `DCK-4`)</Typography>
        <Typography variant="h1">Enemy cards</Typography>
        <Typography variant="body1">
          Catalogue: <code>packages/content/data/enemies/</code> — <strong>{enemyCatalogue.length}</strong> types across{" "}
          <strong>{factionOrder.length}</strong> factions. Full PvE decks:{" "}
          <strong>{fullGameEnemyDecks.explorationDeckSize}</strong> exploration +{" "}
          <strong>{fullGameEnemyDecks.reinforcementDeckSize}</strong> reinforcement ({fullCardTotal} cards, all three
          factions). The first-playable slice uses the same composition ({sliceCardTotal} cards;
          `enemy-deck-slice.json`). Print 65 × 100 mm; hand 118px / inspect 220px.
        </Typography>
      </header>

      {factionOrder.map((faction) => (
        <section key={faction} className={galleryStyles.section}>
          <Typography variant="h2">{ENEMY_FACTION_LABELS[faction]}</Typography>
          <Typography variant="body2">{factionIntro[faction]}</Typography>
          <div className={galleryStyles.grid}>
            {enemiesForFaction(faction).map((enemy) => (
              <CardScalesFigure
                key={enemy.id}
                name={enemy.name}
                note={deckNote(enemy)}
                render={(width) => (
                <EnemyCard
                  enemyId={enemy.id}
                  name={enemy.name}
                  faction={enemy.faction}
                  tier={enemy.tier}
                  hull={enemy.hull}
                  speed={enemy.speed}
                  weapons={enemy.weaponsLine}
                  special={enemy.specialText}
                  width={width}
                />
                )}
              />
            ))}
          </div>
        </section>
      ))}

      <CatalogueDeckBackSection>
        <FigureDeck
          sector={null}
          label="Enemies (slice)"
          count={sliceCardTotal}
          rim="var(--game-faction-iron)"
          variant="enemy"
        />
      </CatalogueDeckBackSection>
    </div>
  );
}