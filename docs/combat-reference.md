# Combat system reference (Void Matter)

> **STALE IN MANY PLACES. Do not implement from this file without checking `design-decisions.md` section by section.** Beyond the differences listed below, these items in this document are **wrong for this project**: the starting Corvette's speed is **2** (not 1); Drone Hangar costs **1 TC from the pool** and only works when the owner starts combat; Spoils of War is **once per round per damaged ship**, never per hit; Underworld Extortion is paid by the **killer from the pool**; Magnetic Shields, Inertial Dampener and Pulse Defense Grid are **-1 to the hit roll**; Energy Shields cap **per weapon**; Thermal Sinks and Decoy Launcher spend **pool** resources (not cargo); Cloaked Slip Drive does **not** apply to Retreat; the Repulsor Grid is a **defender-chosen reroll of any 2 dice**; Ram-Loader damages **once per attack action**; the win condition is **the third VM taken, immediately**, and enemy kills give rewards **directly to the killer**.
>
> **Read `design-decisions.md` sections 3, 7 and 15 first.** Section 15 (rulings from the second review) overrides this file and the earlier sections wherever they differ. Overrides that matter most for combat, each with its ruling ID:
> - **Terms (`TRM-1`):** globalRound, combatRound, turn. "Round" in this file means combatRound when it describes combat and globalRound otherwise.
> - **Not two sides (`CMB-5`):** combat in a hex is a **free-for-all** over every ship and token present; who may target whom is the `isOpposing` relation (different owners, minus Mercenary-Uplink friendly pairs). The "blue/red sides" model below is a simulator simplification.
> - **Initiative (`CMB-3`):** recomputed **every combatRound** from live speed (permanent and temporary adjustments), then fixed for that combatRound. Spawned tokens first act in the next combatRound. Solar Flare's +1 speed is contest-only.
> - **Length (`CMB-4`):** combat runs to completion inside its action or Maintenance step; engine guard of 100 combatRounds.
> - **Retreat (`CMB-6`):** declared sequentially in first-player order; destination is one hex across a full gate connection, chosen at execution.
> - **Maintenance combat (`CMB-7`):** sectors snapshotted at the start of the Enemy Combat step and resolved in seat order.
> - **Dice and pipeline (`CMB-8` to `CMB-11`):** pre-roll commitments are declared together; dice = (printed + additive bonuses) x2 for Overdrive, then minus defender reductions, floor 0; Gauss judged per weapon; Prism and Shield Specialist once per damage event; Interceptor Rig cannot react to range attacks; the owner orders their own simultaneous effects; self-damage is queued with the group's damage; Torpedo resolves before Spoils.
> - **Loot (`LOT-1` to `LOT-4`):** cargo goes to a same-hex killer's pool, otherwise to supply (Beam Projector kills included); the **defender** chooses the cargo taken by Spoils and the component lost; Larva tokens are not ships for kill triggers.
>
> **Then read the rest of this note.** This document describes the **simulator** (`card-sheet-tool`), which differs from the V5 rulebook. Where they conflict, `design-decisions.md` wins. Known differences: damage is chosen once per event (not per hit), Spoils of War triggers once per ship per round (not per cube), overflow forces a component discard, several enemy stats differ, natural 6s always hit and natural 1s always miss, and the "-1" defences penalise the hit roll rather than removing hits. Decoy Launcher, Thermal Sinks and Energy Shields also work differently (see section 7 of `design-decisions.md`).

Authoritative behavior is implemented in the **read-only** `card-sheet-tool` reference (`combatEngine.ts`, `types/combat.ts`, `combatData.ts`, `weaponDefense.ts`, `weaponTargeting.ts`, `combatants.ts`, `enemyAbilities.ts`, `enemyShips.ts`, `playerComponents.ts`). This document is the primary spec for AI work in **void-matter-online**; consult source only for exact numeric tables, full component catalogs, or parity checks.

---

## Scope

- **Simulator model only (see the banner; `CMB-5` replaces it for this project):** two **sides** (`blue` / `red`): player vs player, player vs enemy, or symmetric PvP in the simulator.
- Fights occur on a **single hex**; all in-sector combatants participate.
- **Combatants**: each side’s **primary ship** plus **tokens** (e.g. Swarm Larva). Identified by `CombatantRef`: `{ side }` or `{ side, tokenId }`.
- Enemies use fixed `weapons[]`; players use **base weapon** + weapons from installed **components**.

---

## Data model (runtime)

### Loadout → battle

`Loadout`: `shipId`, `name`, `componentIds[]` (duplicates allowed where `maxCopies` permits), `crewIds[]`, `cargoResources`.

`deriveStats(loadout)` → speed, `damageSlots` (hull capacity), cargo capacity, crew slots, accuracy (crew sum), `weapons[]`, upgrade slot usage.

`ShipRuntime` adds: `damageCubes`, `factionPool`, `inSector`, `destroyed`, runtime cargo (capped to capacity).

**Player ship defaults**: 2 cargo, 1 crew slot, 1 base hull, speed 1, 4 upgrade slots, stock 1d6 energy @ **5+**.

### Weapons

`WeaponDef`: `name`, `dice`, `hitTarget` (global default constant **5**, but per-weapon targets exist e.g. larva **6+**), `kind`: `energy` | `mass` | `missile` | `drone`.

**Categories** for defenses and enemy rules: `energy`, `mass`, `missile-drone` (missile and drone share defenses).

Optional `hitWeight` (default 1): successful dice → `damageHits = hits × hitWeight`.

**Attack roll**: for each die, `die + modifier >= hitTarget` counts as one hit (before post-roll defenses).

**Modifiers** (stack on the salvo for each weapon unless noted):

- Crew **accuracy** (per-crew, listed on roll).
- **Drone Hangar**: spend **1 cargo** → +1 to hit for that combatant’s attack round (once per firing action).
- **Mass Targeting Array** / **Energy Focusing Lens** / **Target Guidance Suite**: +1 to hit for matching weapon category.
- **Ram-Loader** (mass only): +1 die and +1 to hit for mass weapons; each natural **1** on the salvo’s dice inflicts **1 self-damage** on the attacker (hull/component rules).
- **Prismatic Absorber** (defender ship ability): non-energy attackers get **+1 to hit** vs Prism Prime.

Pre-roll **dice count** changes: Reactive Plating (−dice vs mass), Ablative Sinks (spend 1 cargo, −2 dice vs energy).

Post-roll **hit** reduction / specials: see Defenses and Enemy abilities.

**Energy Shields**: after rolling all weapons in one firing action against a defender, **total energy hits** from that action are capped at **1** (excess stripped from last energy weapons).

---

## Hull and damage

- **`damageSlots`**: base hull + sum of `hull` on remaining components.
- **`damageCubes`**: filled slots; combat ends for a ship when it cannot absorb more (see destruction).
- **Order of cube placement**: cubes fill **component hull upgrades first** (sum of component `hull` values), then **base hull**.

**Per hit damage resolution** (one choice per hit unless component discard):

1. **`cube`**: place 1 damage cube if `damageCubes < damageSlots`.
2. **`component`**: discard **one random** installed component; **all remaining hits** in the current `PendingDamage` batch are **nullified** (not applied one-by-one).

When a component with `hull > 0` is lost, remove up to that many damage cubes (capped by current cubes). **Cargo** components zero cargo when discarded. Recompute speed, slots, weapons via `deriveStatsFromRuntime`.

**Destruction**: only when resolving damage with **no free hull slots** and **no components** to discard—or explicit destroy path. Filling hull to capacity does **not** instantly destroy; overflow on next unresolvable hit destroys.

**Tokens**: 1 hull, no components; destroy token on same rules; token loss does not transfer cargo.

---

## Economy in combat

- **`cargoResources`**: on player ships; spent by defenses/abilities (1 cargo typical). Enemies start at 0 cargo.
- **Spoils**: when a **player** attacker deals hull damage (`cube`) to a **player** defender with cargo, attacker may take **1 cargo → `factionPool`** per qualifying hit (`grantSpoil` on pending damage).
- **On destroy player ship**: attacker gains all defender **cargo** into `factionPool`; defender cargo cleared.
- **Iron Syndicate — Underworld Extortion**: when that enemy is destroyed, **attacking player** loses N cargo (N = 1/2/3 by tier) if they had any.
- Enemies never give spoils; destroying enemies does not grant defender cargo.

---

## Round structure (`BattleState.roundPhase`)

Phases: `declare-retreat` → `ship-actions` → (`assign-targets` if needed) → firing → `resolve-damage` → (`attempt-retreat`) → next round.

1. **`declare-retreat`** (start of round): each **player** primary may declare retreat (at most one declaration stored for the round). Then **`resolveCombatRound`** runs combat.

2. **Initiative**: all in-sector combatants sorted by **speed descending**; tie-break: blue before red; primary before tokens; stable id order.

3. **Tied initiative**: if **every** combatant shares the **same speed**, `tiedInitiative = true` → **everyone fires** (full dice) before **any** damage is resolved; damage queued then processed in batch.

4. **Untied**: each combatant acts in order; after their fire, **their** pending damage is resolved before the next actor (unless combat ends).

5. **Per combatant turn**: skip if destroyed / out of sector / no enemies. If multiple weapons and human player (not auto, not enemy, not token) → `assign-targets`; else **auto-assign** targets. Then roll and enqueue damage.

6. **`resolve-damage`**: defender (target side) chooses `cube` vs `component` per hit via UI; AI uses `autoDamageChoice` (prefer cube unless hull full and components exist; special case when losing last cube would destroy with no components → component).

7. **End of round** (after damage and queues): **`resolveEndOfRoundEnemyAbilities`** — Hive Mother **Endless Swarm** (if damage cubes > 2, repair 1 cube; else spawn Swarm Larva). Then increment round, reset per-round flags (`evadeFirstHitReady`, `roundHitsReceived`, retreat declaration unless entering retreat flow).

8. **`attempt-retreat`**: if a side **declared retreat** at round start and survived the round, that side may **`executeRetreat`**.

### Retreat

- **Declare**: player only, in sector, enemies present, `declare-retreat` phase.
- **Execute** (after round): vs each enemy, compare `d6 + retreating speed` vs `d6 + enemy speed`; each loss adds **1 pending hit** (no spoil). **Cloaked Slip Drive**: spend 1 cargo → auto success.
- If hits pending: resolve damage, then mark **`pendingRetreatExit`**; on clear, ship and tokens leave sector.
- Clean retreat removes side from sector; if only one side remains → **combat ends** (winner). Otherwise **`advanceToNextRound`**.

**AI auto-retreat**: declare when hull slots full (`freeDamageSlots === 0`) and player ship.

---

## Targeting

- Each weapon index maps to one **enemy `CombatantRef`**.
- Validation: one assignment per weapon, targets must be in-sector enemies.
- **Auto-assign**: single enemy → all weapons there. Multiple: heavy weapons (3+ dice or mass) → enemy **primary**; lighter weapons spread across **tokens** (prefer low load) or sorted by low remaining hull.

**Prompt for manual targets** only if: 2+ weapons, actor is player primary, not auto-controlled.

---

## Defenses (player components)

| vs | Effect |
|----|--------|
| **Energy** | Magnetic Shields: −N hits (N = copies). Energy Shields: cap 1 energy hit per attack action. Ablative Sinks: spend 1 cargo, −2 dice (pre-roll). |
| **Mass** | Inertial Dampening: −N hits. Reactive Plating: −N dice (pre-roll). Repulsor Grid: reroll 2 lowest **hit** dice, keep new results. |
| **Missile/drone** | Decoy Launcher: spend 1 cargo → negate attack (0 hits). |

Copies stack where installed multiple times (subject to `maxCopies`).

---

## Enemy factions (ships are data-driven)

Three factions, tiers 1–3 (scout / cruiser / flagship). Enemy loadouts: empty components, no crew.

### Iron Syndicate

Mass-focused weapons. **Underworld Extortion** on death (strip attacker cargo 1/2/3).

### Prism Ascendancy

Energy weapons. **Prismatic Refraction** (Spark, Templar): −1 energy damage hit (min 0); if any mass/missile/drone damage, **+1** to that salvo’s hits. **Prismatic Absorber** (Prime): energy hits negated; attackers get +1 to hit with non-energy. **Phase Lattice** (Prime): per **weapon name**, max **2 damage hits per round** per attacker→target pair (tracked in `roundHitsReceived`).

### The Hive

Missiles. **Brood Hatchery** (Brood Reaper): once per encounter, after scoring ≥1 hit in an attack, spawn larva. **Endless Swarm** (Hive Mother): end-of-round repair or spawn larva (see above). **Swarm Larva** token: speed 3, 1 hull, 2d6 missile @ 6+.

---

## Win / loss

- **`winner`**: other side has **no** in-sector, non-destroyed combatants (primary + tokens).
- Outcomes: **destroyed**, **retreated** (`inSector` false), still **engaged**.
- Stats tracked per side: hits dealt/received, damage cubes taken, components lost, resources taken.

---

## Simulation API (reference)

- `createBattle(blue, red, { silent?, autoControlledSides? })` → `BattleState`.
- `declareRetreat` → `resolveCombatRound` → per-step `confirmWeaponTargets` / `resolveDamageChoice` / `executeRetreat` / `aiStep` / `runAutoPlay`.
- `simulateCombat` / `runCombatBatch`: both sides auto; silent log; weapon targets and damage auto.

`autoControlledSides`: skip target UI and use AI damage/retreat heuristics.

---

## Upgrade slots (player components)

`usedUpgradeSlots`: respects `slotCost` (including fractional), `pairsPerSlot` (e.g. two copies share one slot), `maxCopies`. Weapons and passives come from component definitions; full list is in `playerComponents.ts` (dozens of entries — **do not duplicate in game code without syncing IDs**).

Categories: standard, unique, weapon-*, defense-*, cargo.

---

## Implementation notes for ports

1. **Pure state machine**: all rules flow through `BattleState`; no hidden globals except RNG (`d6`).
2. **CombatantRef** is essential when tokens exist; never assume one ship per side.
3. **PendingDamage** batches: component choice clears **`remaining`** entirely for that batch.
4. **Enemy hit modifiers** apply when **building** pending damage from rolls (`buildPendingDamageFromSalvo`), not only on display.
5. `evadeFirstHitReady` exists on state for Nomad Corsair–style ability; wired in types—verify reference if implementing that enemy/card.
6. **Parity testing**: compare to `simulateCombat` on fixed seeds / batch summaries when refactoring.

---

## Out of scope for this doc

- Board hex placement, movement, sector entry (combat assumes “already engaged on one hex”).
- Action/Maintenance phases, full campaign economy, card text for non-combat components.
- Print/token tooling in card-sheet-tool.
