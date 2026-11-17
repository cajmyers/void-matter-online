# Void Matter Online: technical implementation proposal

Status: **draft v0.2 for discussion** (v0.2 folds in the second technical review: terms and the free-for-all combat model, loot and deck rulings, commit-point saves, the corrected enforcement mechanism, a connectivity analysis and a revised first phase; see `design-decisions.md` section 15). No code has been written. This is a proposal, not a decision record: where it adds to or departs from `design-decisions.md` or `tooling-decisions.md`, it says so (section 12), and those two documents remain authoritative until you accept a change.

Inputs read: `design-decisions.md` (including section 15), `content-data.md`, `tooling-decisions.md`, `combat-reference.md`, `README.md`, the Firebase hosting scaffold, (read-only) the shape of `card-sheet-tool`, and now **`docs/Void Matter.pdf`** (the old rulebook). The PDF is treated as **structural seed data only** (board layouts, tile warp-gate edges, planet supply and demand). Its rules text is out of date and `design-decisions.md` overrides it everywhere. What I took from it, and what it did not answer, is in section 9 and the appendices.

---

## 1. What I think you are building

Void Matter Online is a solo-versus-bots digital adaptation of a hex-map, engine-building, resource-racing board game. The rules are dense: four resources, a deliberate split between **cargo** (exposed, stealable) and the **faction pool** (safe, spendable), action tokens, alternating single actions until everyone passes, then a fixed Maintenance sequence. Victory is the third Victory Marker (VM), taken by redeeming a mission at the Central Nexus, and the game ends the instant that happens.

Underneath the content, your documents make five load-bearing commitments. The rest of this proposal is just those five taken seriously and followed to their consequences.

| # | Commitment (from your docs) | What it forces technically |
|---|---|---|
| 1 | **Rules are separate from the source of decisions.** Human, simple bot and future AI all choose from the same list of legal choices. | The engine never asks anyone anything directly. It stops and *returns* a prompt. Everything that answers prompts is pluggable. |
| 2 | **The engine emits an event stream** (moves, rolls, draws), not only final states. | Events are the engine's real output and drive animation, the combat log, replay, mission tracking and telemetry. I propose they also be the *only* way state changes (section 4.3). |
| 3 | **Seeded, replayable randomness.** Dice, shuffles and bot choices all come from owned seeded sources. | State and RNG are plain serialisable data. No clocks, no `Math.random`, no hidden globals. |
| 4 | **Bots see public information only,** enforced by the engine. | A per-seat **view projection** is a first-class engine function, and bots can only ever be handed a view. |
| 5 | **Card data is the source of truth**, rendered from structured data, with a designed effect language. | Cards are data plus registered behaviour. The engine core contains no card names. |

Two further decisions shape the engine's internals even though they read like bot features: the bot's **Monte Carlo strength check runs the real combat engine** on a copy of the state (so the engine must be fast, side-effect free and cheaply copyable), and **every prompt can interrupt an attack mid-resolution** (Decoy Launcher, Interceptor Rig, Repulsor Grid, Temporal Echo, the 3-for-1 exchange). Those two together are what make the hardest design problem the *resumable* resolution of an attack, covered in section 4.4.

---

## 2. Architecture at a glance

Four TypeScript packages and one app, in a pnpm workspace. Dependencies point one way only.

```
                    +--------------------------------------------+
                    |                apps/web                    |
                    |  React UI - animation director - effects   |
                    |  renderer (DOM first) - Firebase - audio   |
                    +---------------------------+----------------+
                                                |
              +-------------------+             |
              |   packages/sim    |             |      (Monte Carlo runs in a
              | headless runner,  |             |       Web Worker inside web)
              | tournaments (Node)|             |
              +---------+---------+             |
                        |                       |
                        v                       v
                    +-----------------------------------------------+
                    |                packages/bots                  |
                    |  default policy - action-turn planner -       |
                    |  mission/trade/purchase scoring - strength    |
                    +----------------------+------------------------+
                                           |
                                           v
                    +-----------------------------------------------+
                    |               packages/engine                 |
                    |  pure rules: state, events, reducer, prompts, |
                    |  combat, round flow, views, effect registry   |
                    +----------------------+------------------------+
                                           |
                                           v
                    +-----------------------------------------------+
                    |              packages/content                 |
                    |  card/tile/enemy/mission data, Zod schemas,   |
                    |  content-slice definitions                    |
                    +-----------------------------------------------+
```

**Enforcement (corrected in v0.2, `ENF-1`).** Leaving out the DOM type library only stops `window` and `document`; `Date.now`, `new Date`, `Math.random` and `localeCompare` are part of the ES library and still type-check. So the engine packages (`engine`, `bots`, `content`, `sim`) are protected by two things: (1) a `tsconfig` that does **not** include the `DOM` lib, which catches `window`, `document` and `localStorage`; and (2) **ESLint** with `no-restricted-globals` (`window`, `document`, `localStorage`, `setTimeout` outside the runner), `no-restricted-properties` (`Date.now`, `Math.random`, `String.prototype.localeCompare`) and `no-restricted-syntax` (`new Date()`), plus an import-boundary rule that stops `engine` importing from anything but `content`. Lint runs in CI and as a pre-commit check. The same boundary protects the "portable to a server" promise.

**Why `sim` exists in the first milestone.** A headless Node runner that plays bot against bot is the cheapest way to (a) soak-test the rules with thousands of games, (b) collect the "rounds to 3 VM" data you asked for, and (c) tune the bot tunables you listed. It costs almost nothing once the decision-source boundary exists.

---

## 3. The runtime loop

The engine is a pure, synchronous function. All asynchrony (a human thinking, a bot's Monte Carlo running in a worker, animations playing) lives in a thin **runner** around it.

```
  +-------------------+        +-------------------+
  |  Human UI prompt  |        |   Bot policy      |      "decision sources"
  +---------+---------+        +---------+---------+      (one per seat)
            |  Decision                  |  Decision
            +-------------+--------------+
                          v
          +-----------------------------------------+
          |  engine.step(state, decision)           |
          |    validate decision against the prompt |
          |    rules code decides, rolls dice       |
          |    emits events; reducer applies them   |
          |    keeps going until the next prompt    |
          +--------------------+--------------------+
                               |  { state', events, pending }
        +----------------------+---------------------+
        v                      v                     v
   persistence            redact per seat       who answers `pending`?
 (decision log,                |                (pending.seat's source)
  snapshots)                   v
                     animation director (human's events only)
                               |
                               v
                          React (DOM/SVG)
```

In pseudocode, the runner is deliberately boring:

```
loop until state.gameOver:
    prompt = state.pending                       // the engine says exactly who must choose what
    view   = viewFor(state, prompt.seat)         // redacted; this is all a bot ever sees
    choice = await decisionSources[prompt.seat].decide(view, prompt)
    result = engine.step(state, choice)          // pure
    log(choice); director.enqueue(redact(result.events)); state = result.state
    await director.idleBeforeNextHumanPrompt()
```

**Seat count is data.** Nothing in the engine assumes two seats. The first milestone runs one human and one bot, but state is an array of seats from day one, and the 4-seat cap you rely on (Central Nexus "never empty") is validated at game creation.

---

## 4. The engine

### 4.1 State model

State is **one plain, JSON-serialisable object**, updated immutably. No classes with methods, no references between objects except by ID, no functions in state.

| Area | Contents | Notes |
|---|---|---|
| Game meta | round number, phase, first-player token, whose turn, passed seats, VM target, rules/content version | |
| Seats | faction, pool (4 resources, no VM-as-resource), VM count, held missions, action-token states (general tokens), fleet list, kind (`human`/`bot`) | VM is a counter, deliberately not a resource type, so no code path can "spend" it |
| Ships | position, damage cubes, installed components, crew, cargo (up to capacity), ship-level tokens (Move, officer tokens), owner | Cargo and pool are different fields with different types, so the compiler stops you spending cargo |
| Map | hex coordinates, tile identity, face-up/down, **rotation (chosen on reveal)**, resource cubes on supply/demand areas, enemy card and reward stack per Anomaly | Connectivity is computed from tile plus rotation, never stored separately. Layout comes from a per-seat-count data table (section 9). **All non-Nexus tiles, planets included, start face-down**, so the face-down set is hidden information for every seat |
| Decks and markets | each deck as an ordered list, face-up markets, discard piles, set-aside cards per seat | Full truth lives here, including hidden order |
| Temporary effects | list of `{source, scope, kind, expiresAt}` (end of round, end of combat, ...) | Where Thermal Pyre's -1 speed, Solar Flare, Fleet Command, Mercenary Uplink "friendly" pairs, Drone deployment live |
| Round snapshots | the initiative order of the **current combat round** (stored in the combat sub-state, recomputed each combat round, `CMB-3`); the "ships present at the start of the game round" list (Solar Flare); the Maintenance combat sector snapshot (`CMB-7`) | Replaces the first draft's single start-of-round initiative snapshot |
| Combat | the active combat, if any (sub-state, see 4.7) | |
| Mission progress | per-seat, per-mission counters and flags | Written by the mission tracker (4.9) |
| Pending | the prompt the engine is currently waiting on, plus the resolution stack (4.4) | This is what makes mid-attack saves and Monte Carlo copies work |
| RNG | named streams (4.5) | Lives beside the rules state in the save envelope |

**Derived, never stored:** speed, hull capacity, cargo capacity, slot usage, weapons list, to-hit totals, "is this ship pinned". A pure `deriveShip(state, shipId)` computes them from installed components, crew, tile effects and active temporary effects. Storing derived values is how rule engines go wrong after the fortieth card; here a Magnetic Grapple being discarded mid-round just changes the next query.

**Cards are instances.** Every physical card has an instance ID and lives in exactly one zone (deck, market, hand-equivalent, ship slot, discard, hex stack, set-aside). Moving a card is a single operation that removes it from one zone and adds it to another, which makes "every card is somewhere exactly once" a checkable invariant (4.12).

### 4.2 Reading state: the three hook families

Before the event machinery, one structural idea matters most for your 55 components. Almost every card effect is one of three kinds of thing, and the engine should offer exactly three kinds of plug-in point:

```
   QUERIES (pure questions the rules ask)       "may this ship Interact here?"
   - answered by rules + any effect that          "is X opposing Y?"
     rewrites the answer                          "what does leaving this hex cost?"
   - Mercenary Uplink, Security Credentials,      "can this Evade succeed automatically?"
     Comms Specialist, Stealth Field, Dense
     Asteroid, Gravitic Anchor, Magnetic Grapple

   PIPELINE STAGES (a value flows through)      dice count, to-hit, hit count, damage
   - handlers adjust the value in a fixed        event contents
     order                                       
   - Thermal Sinks, Reactive Plating, shields,
     Concussion, Apocalypse, Phase Lattice,
     Shield Specialist

   TRIGGERS (something happened, react)          after damage, on destruction, start of
   - may cost something, may prompt, may          Maintenance, end of Action phase
     emit further events
   - Decoy, Interceptor Rig, Self-destruct,
     Salvage Expert, Bounty Hunter, Nano Repair
     Bots, Data Siphon, Scavenger Drones
```

The most important consequence: **"opposing" is one function.** Movement blocking, Interact/Repair/Move restrictions, who can be targeted, Spoils eligibility, Stealth Field, Blockade and Mercenary Uplink all call `isOpposing(state, shipA, shipB)`. Mercenary Uplink then becomes a single query rewrite, exactly as you ruled ("friendly for every rule"), not a hunt through the code for every `owner !== owner` comparison. The same discipline applies to `canTarget`, `canInteractHere`, `movementCost` and `evadeAutoSucceeds`.

### 4.3 Event-sourced core (the key decision)

Rules code **never edits state directly.** It decides what happens and emits events. A single reducer, `applyEvent(state, event) -> state`, is the only thing that changes state.

```
   rules code (decides) ----emits----> Event ----applyEvent----> new state
        ^                                |
        | reads state                    +--> also sent to: log, director, mission tracker,
        +--------------------------------+    persistence, telemetry
```

Why I recommend this over "mutate state, also emit events for the UI":

- **No drift.** There is one implementation of "what happened." If the animation layer replays events, it sees exactly what the engine did, because the engine did the same.
- **The UI's trailing "displayed state" comes free.** The director folds *redacted* events through the same reducer as they play. Skip and fast-forward are just "apply the rest instantly."
- **Replay, undo, telemetry and the mission tracker are all folds over events.**
- **Monte Carlo is cheap.** With immutable updates, a thousand simulated combats share structure with the base state. There is no deep copy per run.

The cost is real: every state change needs a named event type, and events must be rich enough that mission trackers and animations need nothing else. That is mostly a feature (your Shield Calibration ruling already requires defences to report "hits prevented"), but it means event design is a first-class task, not something to bolt on. If you would rather accept some drift risk for less boilerplate, the fallback is "engine mutates, events are a side channel", and I would regret it.

**What events look like (informal).** Typed, immutable, with a cause link so combat can be grouped in the log and sequenced in animation:

```
DiceRolled   { cause, roller, weapon, results: [4,6,1,3], toHitNeeded: 5 }
HitsComputed { cause, weapon, target, perDieOutcome, stages: [{source, before, after}] }
DamageEvent  { cause, attacker, target, hits: 3 }
DamageChosen { cause, target, choice: 'component', discarded: componentId }
ShipDestroyed{ cause, ship, destroyedBy }
```

Every event also carries a **visibility** (public, or private to named seats), so redaction works on the stream and the log, not just on state.

### 4.4 Prompts and the resumable resolution stack

This is the part I would prototype first. Your rulings mean a single attack can pause several times, in different seats' hands:

```
attacker declares targets AND pre-roll commitments together (CMB-8):
    drone launch, Overdrive, Nanite token exhaustion
  -> pre-roll: defenders in seat order may use Thermal Sinks (cost, maybe 3-for-1 exchange)
  -> dice roll
  -> attacker may use Temporal Echo (reroll all)
  -> defender may use Repulsor Grid (pick 2 dice, attacker rerolls)
  -> defender may fire Interceptor Rig (a nested attack, no further reactions; not offered against a range attack)
  -> damage event formed -> defender chooses cubes or component
  -> Spoils, Bounty Hunter, Salvage Expert, Self-destruct, Scavenger ...
```

The engine must be able to stop at any arrow, hand control to someone, and later continue, **and** a copy of the state taken at that moment (a save, or a Monte Carlo run) must be able to continue from the same point. That rules out JavaScript generators or `async/await` inside the engine, because a suspended generator cannot be serialised or cloned.

**Proposal: an explicit resolution stack stored in state.** Each in-flight rule resolution is a small serialisable record (a *frame*): what kind of thing it is, which step it is on, and its data. A driver loop runs the top frame's current step until one asks a question.

```
 state.stack (top at right)
 [ Round(action phase) | Turn(seat 2) | Attack(ship A, weapon 1) | ReactionWindow(afterRoll) | Prompt ]
                                                                                              ^
                                                              engine returns here with state.pending = Prompt

 engine.step(state, decision):
     validate decision against state.pending
     give it to the top frame -> frame advances (emits events, may push or pop frames)
     keep running frames until a frame needs a decision, or the stack is empty (game over)
```

The same mechanism handles **nested** resolution without special cases: Interceptor Rig's reaction attack is simply an `Attack` frame pushed on top, flagged "reactions not allowed"; Self-destruct chain explosions push `ExplosionRoll` frames; a destroyed ship's on-destruction triggers push `Trigger` frames in a fixed order.

Trade-off, stated plainly: frame-by-frame rules are more verbose than straight-line code. I mitigate it by making combat a **fixed pipeline of named steps** (4.7) so that card behaviour plugs into steps rather than each card authoring frames, and by shipping a debug trace that prints the stack and the last N events.

**Prompts** are plain data:

```
Prompt { id, seat, kind, context, options | constraints, canSkip }
Decision { promptId, payload }       // payload shape depends on kind
```

Two kinds of prompt exist:

- **Enumerable** (yes/no reaction, pick one of these cards, cube or component, which hex to move to). The prompt lists its options; a decision is "option k".
- **Structured** (assign dice among targets, choose any 2 dice to reroll, pay a cost with the 3-for-1 exchange, pick resources of choice). The prompt carries *constraints* and a validator; each kind also has an `enumerateOrSample` function so bots and tests can generate legal answers without a UI.

Because prompt volume is a real UX concern (your "step through every decision" choice), the engine only raises a reaction prompt if the reaction is **actually available** (component installed, cost affordable counting the exchange, trigger condition met). A player with nothing to react with is never asked. An optional "auto-decline reactions I can't make sense of" setting can come later without engine changes, since it is just a decision source (the default policy) answering for the human.

**Costs** are one primitive used everywhere: a list of payments (`resource from pool`, `resource from a ship's cargo`, `exhaust a token`), with a pure `canAfford` that accounts for the 3-for-1 exchange, and a payment prompt that appears only when the exact resources are missing or there is a real choice. "Exhaust a token as a cost" and "perform an Interact action" are distinct kinds in the model, as your Stealth Field ruling requires.

### 4.5 Randomness

- A small, owned, serialisable generator (sfc32 or PCG), as `tooling-decisions.md` says.
- **Named streams** rather than one shared one: `game` (dice, shuffles), `bot` (bot tie-breaks and randomness), and per-simulation derived streams. You said bot randomness uses "the same seeded source as the dice"; separate streams derived from the one game seed keep that spirit (one seed reproduces everything) while ensuring a bot that thinks harder or differently never shifts the dice a human sees. This is the one place I would propose a small change.
- **Simulation seeds are derived, not drawn:** `derive(gameSeed, round, decisionIndex, runIndex)`. Monte Carlo therefore never advances the game's streams, and the same position always evaluates the same way.
- Dice are **rolled inside the engine step and recorded in events** before any animation. The animation never produces randomness.
- **Determinism rules (enforced by lint, `ENF-1`).** No `Date.now`, `new Date`, `Math.random` or `localeCompare` in engine code. Sorting uses explicit comparators on IDs (never locale-dependent string compare, never relying on object key order). State and events are written by a **canonical serialiser** (sorted keys, no `undefined`, no `NaN`) so hashes, replays and saves are byte-stable across browsers. Iteration order over any collection that affects rules is defined (sorted by ID or by ORD-1 key).
- Shuffles and draws operate on the real decks in state. Hidden order is protected by redaction, not by the engine "not knowing."

### 4.6 Hidden information and the per-seat view

```
          full state (engine truth)
   decks in order - face-down tiles - asset cards under enemies
   - set-aside rewards - everyone's peeked info
                     |
        viewFor(state, seat)   <-- the only way a bot or UI reads state
                     |
                     v
   what that seat may know: public board, installed components,
   cargo and pool (as ruled public), own set-aside cards, own peeks,
   deck SIZES but not order, face-down things as opaque placeholders
```

- The same function and the same event redaction serve the human's UI, every bot, and any future networked client.
- **Peeked information (tiles 8, 9, Long-range Sensor Specialist) is stored as knowledge attached to the seat**, as events visible to that seat only, so the view can include it and so the bot can use "earned information" as ruled.
- A cheap, high-value test: run bots with a `viewFor` that deliberately poisons hidden zones. A bot whose decisions change has leaked hidden information.

### 4.7 Combat as a self-contained module

Combat is a frame (4.4) with its own sub-state, built to your V5 rulings, not the simulator's. Three entry modes share the same machinery:

| Mode | Initiated by | Shape |
|---|---|---|
| Tactical attack | A seat, with a Tactical action | Full multi-round combat; context flag `initiatedByOwnerWithTactical = true` (this is what Drone Hangar, Shield Specialist and Bounty Hunter check) |
| Maintenance combat | Enemy cards, in Maintenance | Full multi-round combat; the flag is false |
| Single shot | Beam Projector | One one-sided shot; no rounds, no retreat, no Spoils; the flag is true |

A combat is a **loop of combat rounds run to completion inside the action or Maintenance step that started it** (`CMB-4`). It is **free-for-all**: every ship and token in the hex is a combatant, and `isOpposing(a, b)` (different owners, minus Mercenary-Uplink friendly pairs) decides who may target whom (`CMB-5`). The loop ends when no opposing pair remains. A **safety guard of 100 combat rounds** ends it with a `CombatStalemate` event, which the simulator and tests treat as a bug signal.

Per combat round (**the initiative list is recomputed at the start of every combat round from each combatant's live speed, permanent and temporary, then fixed for that combat round**, `CMB-3`; tokens spawned mid-round first act next combat round):

```
 compute initiative (live speed) -> fixed for this combat round
 declare retreat, SEQUENTIALLY in first-player order (token holder, then
   clockwise); later seats see earlier declarations; a ship may declare
   only if it has a legal destination (one hex across a FULL gate connection)
        |
        v
 for each INITIATIVE GROUP (equal speed), fastest group first:
   (everyone in the group rolls and fires BEFORE any of the group's damage is resolved)
        |
        v
   +---------------------- ATTACK PIPELINE (per weapon) -----------------------+
   | 1 assign targets AND    one declaration: targets (multi-shot dice split),  |
   |   pre-roll commitments  drone launch, Overdrive, Nanite token exhaustion   |
   | 2 pre-roll changes      defenders in seat order (Thermal Sinks). Dice =    |
   |                         (printed + additive bonuses, e.g. Ram-Loader)      |
   |                         x2 if Overdrive, THEN minus Reactive Plating,      |
   |                         minus Sinks, floor 0 (CMB-8)                       |
   | 3 gather to-hit mods    accuracy items, crew, Drone, Spark -1, tile bonus, |
   |                         Railgun speed penalty. Natural 6 hits, 1 misses.   |
   | 4 ROLL                  seeded dice, recorded                              |
   | 5 reroll windows        attacker Temporal Echo -> defender Repulsor Grid   |
   | 6 reactions             Decoy (negate), Interceptor Rig (nested attack,    |
   |                         NOT against a range attack, CMB-10). The owner     |
   |                         orders their own simultaneous effects              |
   | 7 count hits            apply to-hit to each die                           |
   | 8 weapon-level hits     weights (Apocalypse x2, Compressor 6s), Concussion |
   |                         +1, Energy Shields cap per weapon, Phase Lattice   |
   |                         cap per PHYSICAL weapon                            |
   | 8b Gauss test           "exactly 1 hit" judged per weapon on its final     |
   |                         hit count, before any event-level step             |
   | 9 form damage events    group per attacker per target; Gauss exactly-1     |
   |                         splits into its own un-discardable event           |
   | 9b event-level hits     ONCE PER EVENT: Prism +1/-1, then Shield           |
   |                         Specialist last (CMB-9). Shield Calibration        |
   |                         credit accrues sequentially                        |
   | 10 defender chooses     cubes (only if ALL fit) OR which component to lose |
   |                         (LOT-3: defender chooses; Expert Marksman excepted)|
   | 11 apply + after-damage Torpedo effects BEFORE Spoils (defender picks the  |
   |                         cargo, LOT-2), Spoils (once/round/ship), Bounty    |
   |                         Hunter, Salvage, mission events; self-damage is    |
   |                         queued WITH the group's damage events (CMB-11)     |
   | 12 destruction          Self-destruct chain, Extortion, Scavenger, rewards |
   |                         cargo to attacker's pool ONLY if same hex (LOT-1), |
   |                         else general supply; Larva tokens are not ships    |
   +----------------------------------------------------------------------------+
        |
        v
 retreat resolution (evasion contests, one damage event, no Spoils)
        |
        v
 end of combat round: expire per-combat-round effects; loop again while any
   opposing pair remains (else the combat ends); guard at 100 combat rounds
```

Notes that fall straight out of your rulings:

- Steps 3 and 8 are separate on purpose. Your note that "Spark's -1 to hit and Templar's -1 damage are different mechanisms" is exactly the difference between *modifying the roll* and *modifying the hits that land*.
- Step 9's "group all hits from one combatant's attack against one target" is a pure function (hits in, damage events out). The Gauss and Concussion special cases live there.
- Step 10's overflow rule is a validity check on the decision: the prompt simply does not offer "take cubes" if the hits do not all fit, and enemies are never offered "discard component."
- Every step that can prevent hits writes `{source, hitsPrevented}` into the event stream so Shield Calibration and Devastation work without special-casing.
- Initiative is computed from **live speed at the start of each combat round** and then frozen for that combat round (`CMB-3`). This **reverses the first draft**, which ignored temporary speed changes for initiative. Evade, Retreat and Railgun read live speed when they resolve. Solar Flare's +1 is a contest-only modifier (a separate query from initiative speed).
- **Maintenance combat across sectors (`CMB-7`).** The engine snapshots the sectors and participants at the start of the Enemy Combat step; sectors resolve in seat order of the ships in them (token holder first), ties by hex coordinate; retreaters never join another sector's combat that Maintenance. Spawned tokens **persist in their sector across game rounds** (stored in state as enemy-owned token entries on the hex) until the existing Enemy Ship Repair step removes them; while present they are ordinary enemy combatants for the snapshot, for combat and for the reward test. A token spawned mid-combat acts from the next combat round; one spawned during Maintenance combat is not in that step's snapshot.
- **Retreat (`CMB-6`).** Sequential declaration; destination chosen at execution, one adjacent hex across a full connection (an undiscovered hex is flipped and oriented by the retreater under `MAP-6`; an enemy-occupied hex is allowed). A ship with no legal destination cannot declare.
- `isOpposing` is the single relation behind targeting, retreat contests and "who is in this combat". Enemy-faction ships of the same faction never oppose each other. Who an enemy ship targets among several opposing combatants is still an open rule (`design-decisions.md` section 12); the first implementation uses a deterministic placeholder (lowest hull, then seat order) and logs it.
- **Loot and removal.** A destroyed ship's cargo moves to the killer's pool only when a killer ship is in the same hex (`LOT-1`); every other cause sends it to the supply. Cargo is a per-resource count on the ship, capped by capacity; losing capacity discards the excess to supply, the owner choosing which (`LOT-5`, assumed). Hull is a count of intact cubes.
- **Initiative groups (Q4).** Combatants of equal speed are one group. The pipeline steps 1 to 9 run for every member of the group first, with their events recorded, and only then do steps 10 to 12 (damage choice, application, destruction triggers) run for the group's damage events. A ship destroyed by a group-mate's damage therefore still fires, because it already rolled. The order in which the group's damage events are *resolved* still matters (Spoils once per round, Self-destruct chains, first destroyer takes the enemy card) and is covered by the ordering question Q6.

The module can run **without the rest of the game**: given combatants, their pools (for pay-to-react abilities) and a decision policy, it plays to completion. That is what the bot's Monte Carlo strength check uses.

### 4.8 Round structure

**Terms (`TRM-1`).** A **game round** is one Action phase plus one Maintenance phase (the diagram below is one game round). Code uses **gameRound**, **combatRound**, and **turn**; card text says "game round" unless it means a combat round. A bare "round" in older text means game round.

Other lifecycle rulings that land here: **Last Ship Recovery** places the new ship on any Outer Rim Nexus the player picks, pinned if occupied (`REC-1`); **humans may freely discard uncompleted missions** on their own turn (`MSN-2`); a combat in Maintenance runs to completion inside its Enemy Combat step, one sector at a time from a snapshot (`CMB-7`).

```
 GAME START: seed -> build map, decks, markets; deal starting ship + 2 missions per seat
                         |
                         v
   +--------------------------- ROUND ---------------------------+
   |  ACTION PHASE                                               |
   |   first player token holder acts first, then clockwise      |
   |   each turn:  choose ONE of                                 |
   |       Move | Trade | Interact(kind) | Tactical(kind) |      |
   |       Repair | free actions (Mercenary Uplink, ...) | Pass   |
   |   passed seats are skipped; ends when ALL have passed       |
   |   end-of-Action-phase effects (fixed order): Data Siphon,   |
   |       Helium Nebula toll, ...                               |
   |                         |                                   |
   |  MAINTENANCE PHASE (ordered pipeline; each step emits)      |
   |   [Nano Repair Bots at start]                               |
   |   1 Enemy combat          6 Recruitment                     |
   |   2 Enemy ship repair     7 New objectives                  |
   |   3 Enemy escalation      8 Reset counters                  |
   |   4 Market shift          9 New ship (if no ships)          |
   |   5 Nexus replenishment  10 Pass first-player token         |
   |   [Blockade check after Reset; Nanite Station at round end] |
   +-------------------------------------------------------------+
        |  any time a Redeem is taken and VM == target:
        v                                              GAME OVER (immediately)
```

Each Maintenance step is a named function in a **step list** with hook points before and after, so rulings like "Nano Repair Bots at the start of Maintenance" and "Blockade checked at the end" are entries in a list, not edits inside step bodies. The game-over check runs **after every VM change**, so a game-ending Redeem pre-empts the Blockade mission by construction.

### 4.9 Legal actions, movement and the single rulebook of "what is allowed"

- `legalActions(state, seat)` returns *action intents* (ship plus kind plus a target such as destination hex or market card), not fully specified actions. Details (which resources to harvest, how to pay) are sub-prompts. This keeps the list enumerable, which matters for bots, UI highlighting and tests.
- It is the **only** place restrictions are decided, via the query hooks in 4.2. The UI greys out illegal actions by calling it; it never has its own copy of the rules.
- `reachableHexes(state, ship)` handles warp-gate matching using each tile's current rotation (both sides, or half-gate exceptions), speed, "movement ends on flipping a new tile" (a face-down hex is reachable through any source-side gate, since the reveal can always be oriented to meet it, so routes end there), "ends on entering a hex with an opposing ship," and Dense Asteroid costs. The UI uses it for highlights and bots use it for routing.

### 4.10 Effects: data plus registered behaviour

`tooling-decisions.md` and `design-decisions.md` call for a complete effect language designed up front. My concrete proposal is a **hybrid**, because roughly half of your cards are stats or simple modifiers and 25 to 30 are genuine one-offs:

1. **Declarative layer (data).** A card lists effects as structured entries: a hook point (one of the three families), an optional condition, an optional cost, and an operation from a **closed vocabulary** (add to-hit, cap hits, add dice, gain resource, exhaust token, and so on). Common cards are pure data and need no code. Illustration (not final syntax):

```
DecoyLauncher:
  hook:      trigger  attackDeclared
  when:      attack.weaponKind in [missile, drone] and attack.target == self
  cost:      pool 1 TC            // 3-for-1 exchange applies automatically
  prompt:    defender yes/no
  effect:    negateAttack
```

2. **Behaviour layer (code, same hook points).** One-offs whose logic does not fit the vocabulary (Temporal Echo, Mercenary Uplink, Scrap Reclamation Yard's legality check, Self-destruct) are small TypeScript modules registered **by card ID** into the same three hook families. They get the same context object and use the same primitives (costs, prompts, events).
3. **One rule:** the engine core never names a card. If a card needs a change in how the core works, the core grows a new hook point, not an `if`.

Why not a pure DSL: a language expressive enough for Temporal Echo (reroll already-rolled dice, own rolls only, once per global round) *and* Self-destruct (chain explosions) *and* Scrap Reclamation Yard is a programming language, and the maintenance burden is yours alone. Why not pure code: you lose the "design the whole language before building" discipline that protects you from the first-slice-doesn't-stress-it risk you already identified. The hybrid keeps data for the easy majority and makes the exceptions visible and countable.

**Validation of the language** follows your own mitigation: the five hard cards (Interceptor Drone Rig, Mercenary Uplink, Temporal Echo, Self-destruct Protocol, Beam Projector) get implemented as **engine test fixtures** in the first phase, even though they are not in the first content slice. They exercise the hook points that the easy slice never touches. If the hooks survive them, I trust the design.

**Ordering of simultaneous effects** uses one fixed deterministic rule (Q6, decided): the first-player token holder's effects first, then clockwise by seat; within a seat, by the order components were installed; remaining ties by component ID. It matters for Self-destruct chains, end-of-Action-phase effects (Data Siphon versus the Helium toll) and reactions in the same window. Every installed component therefore carries an install sequence number.

### 4.11 Missions as event consumers

Missions never inspect combat internals. A **mission tracker** subscribes to the event stream and updates per-seat progress.

```
 events ---> tracker ---> per-seat, per-mission progress ---> state
                |
                +-- e.g. Devastation: DamageEvent with hits >= 2 (post-defence)
                +-- Evasive Master:   EvadeResolved with rolls > 0 and all passed
                +-- Galactic Tour:    TileEntered (passing through counts)
                +-- Shield Calibration: DefenceApplied with hitsPrevented > 0
```

- Each of the 26 mission types is a small declarative or coded reducer over the events it cares about, plus an optional state check at redeem time (the Build and state missions).
- "After taking this mission" is a timestamp (event index) on the held mission, so earlier events are ignored, and a discard simply deletes the progress, as you ruled.
- Bot nudges (Build and Combat groups) read this same progress through the view; they do not need a second implementation.
- Because missions are only a consumer, **the whole mission deck can be built after combat works** without touching the engine core.

### 4.12 Invariants (checked in tests and in dev builds)

- Every card instance is in exactly one zone.
- The general supply is unlimited (Q2), so there is no conservation total to check. Instead: no resource count is ever negative, resources enter play only through ruled sources (supply grants, harvesting, discovery bonuses, Nexus replenishment) and leave only through ruled sinks (costs, removals), and the engine logs both as events so a drift is traceable.
- Cargo never exceeds capacity; damage cubes never exceed hull capacity except in the instant before a destroy resolves.
- VM exists only as a counter in a seat, and never appears in any payable position.
- Exactly one prompt is pending, or the game is over.
- Replay of the decision log from the starting snapshot yields identical state and event stream.

These run against random legal play at scale (section 10).

---

## 5. Bots

A bot is two pieces layered on a shared base.

```
 +--------------------------------------------------------------------+
 | ACTION-TURN PLANNER (only used for the "choose your action" prompt)|
 |   candidates = legalActions(view)                                  |
 |   scores     = considerations: redeem (top) > strength-building if |
 |                blockaded > planned purchase > trade route >        |
 |                explore (Tactical ready) > attack > evade > pass    |
 |   pick       = seeded weighted choice among the top scores         |
 +----------------------------+---------------------------------------+
                              | everything else (sub-prompts) falls to
                              v
 +--------------------------------------------------------------------+
 | DEFAULT POLICY (answers every other prompt kind)                   |
 |   damage choice, reactions, retreat, targets, payments, picks      |
 |   Same module used as: the bot's combat brain, the opponent model  |
 |   inside Monte Carlo, and the optional "auto" helper for the human |
 +--------------------------------------------------------------------+
```

- **One decision unit.** The planner chooses an *intent* (ship + kind + target). Details come from the default policy answering the sub-prompts. This keeps scoring tractable.
- **Scored-action interface from the start.** Each behaviour (redeem, trade, explore, upgrade, attack/evade, pass) is a module that proposes scored candidates. The first milestone's minimal bot has crude scorers; later milestones replace scorers (route-scored trading, tile ability scores, Monte Carlo strength) without touching the planner. This is your item D resolution made concrete.
- **Bot memory** (next planned purchase, strength-building mode, mission progress timers for the discard rule N, route cache) is stored in the **save envelope next to the state**, not inside the rules state. The rules state stays purely "the game."
- **Decisions are logged.** Replay applies logged decisions and never re-runs bots. This means retuning a bot does not break old saves or replays, which is a significant practical benefit of your decision-source boundary.
- **Monte Carlo strength check** runs in a Web Worker: it takes the bot's view, reconstructs a simulatable state with hidden zones filled by opaque placeholders (the combat module never reads them), then runs the combat module N times with derived seeds and a fixed default policy for the opponent. Because state is immutable plain data, the worker starts from one shared base. Run count and threshold are your tunables. Since decisions are already asynchronous through the decision-source promise, the planner simply awaits the worker.
- **Presentation.** The bot's decision is just a decision; its events flow through the same director as the human's, so "each bot action is shown, one at a time" requires no special code.

---

## 6. Front end

```
 +--------------------------------- apps/web ---------------------------------+
 |                                                                             |
 |   engine events ---> redact ---> ANIMATION DIRECTOR ---> displayed state    |
 |                                     |   |      |             |              |
 |                                     |   |      |             v              |
 |                                     |   |      |      React (Zustand store) |
 |                                     |   |      |      board/cards/HUD/log   |
 |                                     |   |      v                            |
 |                                     |   |   Motion animations (promises)    |
 |                                     |   v                                   |
 |                                     |  EFFECTS RENDERER: dice, beams, glow  |
 |                                     |  (DOM/CSS first; Pixi deferred)       |
 |                                     v                                       |
 |                                  audio (Howler)                             |
 |   one CAMERA (pan/zoom) feeds the board and the effects renderer, so a      |
 |   later Pixi layer reads the same camera and never drifts                   |
 +-----------------------------------------------------------------------------+
```

I adopt the stack in `tooling-decisions.md` with **three deliberate deferrals**. The stack is React + TypeScript + Vite, DOM/SVG with Motion, Zustand for view state, Zod and Vitest. **Deferred (decided): the Pixi overlay, Playwright and Storybook.** Storybook may never be used.

| Deferred | What happens instead | When to revisit |
|---|---|---|
| **Pixi overlay** | Dice and combat effects are done in DOM/CSS and Motion: dice as 2D sprites or CSS 3D cubes landing on the engine's predetermined results, and beams, flashes, shield ripples and destruction as CSS/SVG animation. | Only if the DOM effects look too plain once the game is playable. This is a presentation upgrade, not a rules or architecture change. |
| **Playwright** | Vitest covers rules, replays and invariants. UI is checked by hand and by the dev gallery page (below). | When the UI has stabilised and a browser-level smoke test would pay for itself. |
| **Storybook** | A **dev-only gallery route** in the same Vite app renders every card, prompt kind and dice state from fixtures. | Possibly never. If the gallery page becomes unwieldy, reconsider. |

**The seam that keeps Pixi cheap to add later.** The animation director never calls an effects library directly. It emits abstract **effect commands** (for example "beam from hex A to hex B", "dice throw landing on [4, 6, 1]", "shield ripple on ship X") in shared world coordinates to an **effects renderer interface**. The first implementation draws them with DOM/CSS/SVG. If Pixi is ever wanted, it is a second implementation of the same interface, and nothing in the engine, the director's event handling or the card rendering changes. This is the only cost paid now for the deferral, and it is mostly a naming discipline.

Additions that follow from the engine design:

- **Prompt host.** One React component renders the pending prompt by `kind`, and every prompt kind has a registered component. Prompt kinds are therefore a visible, countable UI backlog. Reaction prompts show their cost and offer the 3-for-1 exchange only when the exact resource is missing.
- **Director contract.** For each event type there is an animation handler returning a promise. The runner waits for the director to be idle before presenting the next *human* prompt, so the screen never asks a question about a state it has not finished showing. Speed and skip are director settings.
- **Displayed state = fold of redacted events.** Skip means applying the remaining events immediately. A human's view of a bot's move is the same events, redacted.
- **Rendering of cards from data.** Start with live HTML/CSS card faces (pattern 1), keep the option of a single data-driven bitmap renderer (pattern 3) if proxy handoff proves fiddly. The engine is unaffected either way.
- **Dice spike first.** Adapted from your own open item now that Pixi is deferred: six or more dice, built in DOM/CSS, landing on predetermined results while a card moves between zones and the board pans. If that looks and performs acceptably, the visual plan holds. If it does not, that is the signal to revisit the Pixi deferral.

---

## 7. Persistence and saves

```
 users/{uid}/games/{gameId}              (Firestore; owner-only security rules)
   meta:      seed, seat config, schemaVersion, rulesVersion, contentVersion,
              createdAt, updatedAt, decisionIndex
   snapshot:  full envelope at the last turn boundary
              { rulesState, rng streams, botMemory[], decisionIndex }
   decisions/{chunkN}:  logged decisions, ~50 per chunk, from the snapshot onward
   summary:   written at game end (rounds to 3 VM, winner, per-seat stats)
```

- **Authoritative save = snapshot**, with the decision log as a companion (replay, debugging, undo, bug reports). This is a change from `tooling-decisions.md`'s "store seed, decision log and rules version." Pure replay saves are brittle: *any* engine change, including a bug fix, can change an old game's outcome, and "finish under starting rules" would require shipping every old engine build. For a solo personal game I recommend: snapshots with **schema migrations**, keep `rulesVersion` in the envelope from day one, and accept that a big rules change may mark old saves as legacy. See Q7.
- **Autosave at turn boundaries and at commit points (`SAV-2`).** A **commit point** is any step that emits an event flagged `revealsHidden` or `usesRandomness` (a tile flip, a draw, a peek, a dice roll). After one, the engine writes the **local** snapshot (IndexedDB) immediately, mid-action if need be, and queues or debounces the cloud write. Without this, reloading the page restores the last turn-boundary snapshot and lets a player scout a tile or reroll a bad result, which undo deliberately forbids (`UX-2`). The resolution stack is serialisable, so a mid-combat snapshot resumes at the exact prompt. **Consequences:** snapshot migrations must handle in-flight stack frames (so every frame kind needs a versioned shape); the save envelope gains `lastCommitDecisionIndex`; and a human reloading mid-combat resumes at the pending prompt rather than at the start of the turn.
- **Local first.** The same envelope is written to IndexedDB, so development and offline use never need an account. Cloud sync is last-writer-wins by `decisionIndex`; if the cloud copy is ahead of the local one, ask the user.
- **Auth:** Firebase Auth (Google sign-in, matching your personal Google project). Rules: a user may read/write only their own games.
- **Undo (decided, Q8 and Q17):** the human can undo back to the start of the current turn, held as an in-memory snapshot taken at the turn boundary. Undo **locks for the rest of the turn as soon as any event with `revealsHidden` or `usesRandomness` is emitted** (a tile flip, a draw, a peek or any dice roll), so it cannot be used to scout or to re-roll. In practice it covers mis-clicked actions and abandoned plans. Bot turns are never undoable.
- **Hosting:** Vite builds to a hashed output directory and `firebase.json` is repointed from the placeholder `public/` (single `main.js` canvas demo) to it. The existing immutable cache header on `js/css` is right for hashed filenames; `index.html` must not be cached that way (the current header pattern already excludes it).

---

## 8. Content pipeline

- **Source of truth:** typed data files in `packages/content`, one per card family (components, crew, enemies, missions, anomaly tiles, planets, nexus decks), validated by Zod when the app builds and when tests run.
- **Seeding the data:** the numeric tables in `card-sheet-tool` (`playerComponents.ts`, `enemyShips.ts`, `combatData.ts`) are a useful starting point, **copied and corrected** rather than imported, per the workspace rule. Because the simulator differs from V5 in many places, every copied entry gets checked against `design-decisions.md` section 7 and V5 before it is trusted, and IDs are kept in sync as `combat-reference.md` advises.
- **Content slices.** Each card carries a slice tag. A game's decks are built only from the active slice (common technologies plus a few uncommon ones, one enemy faction, simple missions). A **coverage test** asserts that every card in the active slice has all its effects registered, so an unimplemented card cannot silently reach a deck.
- **Stable ruling IDs.** Rulings in `design-decisions.md` sections 13 and 14 now carry IDs (for example `MAP-6`, `CMB-1`); older rulings get IDs as tests are written against them. Tests cite them, and a script can list rulings with no test. This is how the document stays authoritative as the code grows.
- **Art:** pictures are referenced by card ID; the data never depends on art being present, so a placeholder renderer works from day one.

---

## 9. Map and board

### 9.1 What the old rulebook's setup pages tell us

The three setup diagrams (pages 3 to 5 of the PDF) resolve most of the map questions I raised in the first draft. They are pointy-top hex grids:

| Seats | Hexes | Row widths (top to bottom) | Composition | Start Nexus positions |
|---|---|---|---|---|
| 2 | 19 (a radius-2 disc) | 3, 4, 5, 4, 3 | 1 Central Nexus + **2** Outer Rim Nexus + 10 planets + 6 Anomalies | Opposite corners: top row leftmost, bottom row rightmost |
| 3 | 28 (**not** a regular hexagon) | 2, 4, 5, 6, 5, 4, 2 | 1 + **3** + 15 + 9 | Top row rightmost, bottom row rightmost, and the **left end of the 6-wide middle row** |
| 4 | 37 (a radius-3 disc) | 4, 5, 6, 7, 6, 5, 4 | 1 + **4** + 20 + 12 | The two ends of row 2 and the two ends of row 6 |

The Central Nexus sits in the middle row (the centre hex for 2 and 4 seats; the fourth hex from the left in the 6-wide row for 3 seats). The counts add up exactly (19, 28, 37), so the discrepancy I flagged earlier was my mistake: **the number of Outer Rim Nexus tiles equals the seat count, not five.** The simplified layouts are in Appendix A.

Consequences for the design:

- **The map must be layout data, not a formula.** The 3-seat board is asymmetric, so I would not generate boards from "radius N". Each seat count gets an explicit table of coordinates with a role per hex (`central`, `start(seatSlot)`, `filler`). Axial coordinates stay the internal system, and the data is authored as rows for readability.
- **Setup is simple and fully seeded:** place the Central Nexus and the Outer Rim Nexus tiles at their fixed hexes, draw the right number of planets and of Anomalies, shuffle all of them together, and deal them **face-down** onto the filler hexes. Face-down tiles have no orientation yet.
- **Warp gates are edges on each tile, and the player orients the tile when it is revealed** (corrected after your note; my first reading was that tiles were fixed). The six sides are named Top Left, Top Right, Right, Bottom Right, Bottom Left, Left, which confirms a pointy-top grid. A tile has 2, 3 or 4 gates in its printed orientation (Appendices B and C list printed edges). **The only restriction on orienting a newly revealed tile is that one of its gates must match the gate the ship came through**, so the edge of the new tile facing the hex the ship came from must carry a gate. Nothing else is checked: other already-revealed neighbours need not line up. Two consequences:
  - **An entry into a face-down hex can always succeed when the move is legal.** Every tile has at least two gates, so some rotation always puts a gate on the facing edge. This answers Q11: for a **normal** move only the *source* side needs a gate, and the destination is oriented to meet it. The same applies to Evade into an undiscovered tile.
  - **Moves that allow half connections are looser (Q14, Q16).** Warp Engineer, Cloaked Slip Drive (Evade) and Graviton Warp Conduit need a gate on **at least one** side of the edge crossed. If the **source** tile has a gate there, the new tile may be oriented **any way at all**, with or without a gate facing back. If the source has **no** gate there, the new tile must be oriented so a gate faces the source. So the engine computes the orientation constraint from two inputs, the movement mode (`normal` or `halfAllowed`) and whether the source has a gate on the crossed edge:

| Mode | Source has a gate on the edge | Legal rotations of the new tile |
|---|---|---|
| normal | yes (required) | Those with a gate facing the source |
| halfAllowed | yes | **Any** rotation |
| halfAllowed | no | Those with a gate facing the source |
| normal | no | The move is not legal at all |
  - **Connectivity is game state, not static data.** A tile's rotation is stored in state once chosen, and `isConnected` reads (tile, rotation) for both sides. The map's shape emerges during play, and **orienting a tile is a real decision** (open it toward your route, keep it a dead end, link it to the Nexus, or cut a rival off).
- **Nexus tiles are fully connected where the map continues.** The Central Nexus has a gate on all six sides. Each Outer Rim Nexus has a gate on every side that faces a neighbouring hex and none facing off the map. So **Outer Rim Nexus gates are derived from the layout, not stored per tile**: `gatesOf(nexusHex) = the directions that have an on-map neighbour`. Computed from the axial layouts: on the 2-seat board each start Nexus sits in a corner and has **3 gates** (N1: R, BR, BL; N2: L, TL, TR); on the 4-seat board each start Nexus has **4 gates** (N1: R, TR, BL, BR; N2: L, TL, BL, BR; N3: R, TR, TL, BR; N4: L, TR, TL, BL). The 3-seat values come from the explicit rows. A start Nexus is therefore never a dead end, but it is not a full hub either, and the 4-seat starts are better connected than the 2-seat corners.
- **Planets are placed face-down too.** The setup says to shuffle planets and Anomalies together and place them all face-down. So until a tile is flipped, nobody (human or bot) knows whether a hex is a planet or an Anomaly, and the bot's public-information rule covers this automatically. It also means the first moves of a game are exploration whether you like it or not, and that Long-range Sensor Specialist's peek has real value.
- **Markets belong to Outer Rim Nexus tiles, and not one-to-one.** The diagrams assign the four sector markets to the start tiles by colour: with 2 seats Red has markets 1 and 2 and Green has 3 and 4; with 3 seats Red has market 1, Green has 2 and 3, Yellow has 4; with 4 seats one each. So a ship that wants a Weapons upgrade must go to *the* Nexus that holds market 1, and for 2 seats each Nexus offers two markets. This is data on the layout (`marketsAtNexus`), and the bot's "planned purchase" naturally includes "go to the right Nexus."
- **Planet pool is the full 20 at 4 seats** (the appendix lists exactly 20), and a random subset of 10 or 15 otherwise. Anomaly pool is 6, 9 or 12 drawn from all **22** tiles (`TIL-2`).

### 9.2 What the map module should do

- Hold layout tables (Appendix A) and the tile catalogue (Appendices B and C) as content data.
- Expose `buildMap(seed, seatCount)`, `neighbours(hex)`, `gatesOf(hexState)` (printed edges rotated by the stored orientation, or derived from the layout for Nexus tiles), the three relation queries below, and the seat-slot to Nexus assignment.
- **Three relation queries between two touching hexes**, all derived from one function `connectionBetween(hexA, hexB)` that returns `none`, `half` or `full`:

| Query | True when | Used by |
|---|---|---|
| `isAdjacent` | The hexes touch. Geometry only; never changes. | Comms Specialist, Beam Projector, Long-range Sensor Specialist (and nothing that moves a ship) |
| `isConnected` | **Both** tiles have a gate on the shared edge (a full connection). | Normal Move, **normal Evade** (the earlier draft wrongly listed Evade destinations under adjacency) and **combat Retreat** (`CMB-6`; half-connections and Slip Drive do not apply to Retreat) |
| `isHalfConnected` | **Exactly one** tile has a gate on the shared edge. | Warp Engineer, Cloaked Slip Drive (Evade), Graviton Warp Conduit, which are allowed to cross this kind of link |

  Effects that may use half connections normally accept **full or half**, so I would add a helper `isConnectedOrHalf` and have each such card name it. A hex with gates on neither side has `none` and nothing crosses it. This keeps the effect text readable ("may move between tiles with a gate on only one side") and puts the connection rules in one place, which is where `reachableHexes` and the Evade check read them.
- Treat **revealing a tile as a two-step resolution** on the frame stack (section 4.4): a `TileFlipped` event shows the tile to every seat (flips are public), then an **orientation prompt** goes to the revealing seat, then a `TileOriented` event fixes the rotation, and only then do the discovery bonus and the enemy draw happen. The prompt lists only legal rotations, computed from the movement mode and the source gate as in the table above. Rotations that produce the same gate set (the two-gate straight tiles 10 and 13 look the same at 180 degrees) are collapsed to one option for the decision, though the stored rotation still drives how the art is drawn.
- Give the bot an **orientation heuristic** as one more scored sub-decision: for example, prefer rotations that keep a path back to the nearest Nexus and keep trade routes open, with seeded tie-breaks. A simple version is fine in the first milestone, since any legal rotation is valid.
- **Assign start slots by a seeded random draw over all seats, human included** (`MAP-3`, decided; the old rules said each player chooses, which no longer applies). Markets differ by slot, so a start can be better or worse for a given plan, and the UI should show clearly which markets the player's start Nexus holds. Because the draw uses the game seed, the same seed always gives the same assignment, which helps replay and tournament runs.

### 9.3 What the PDF does not tell us

- **"Adjacent" versus "connected" are different things.** Tiles can be adjacent without being joined by gates. Comms Specialist (Interact on an adjacent hex), Beam Projector (attack an adjacent sector) and Long-range Sensor Specialist (peek at adjacent unrevealed tiles) all say "adjacent", which means touching only (Q15, owner-confirmed). The engine therefore exposes `isAdjacent`, `isConnected` (both sides have a gate) and `isHalfConnected` (only one side does) as separate queries, and each card's effect names which it uses (section 9.2).

One thing is now settled and simplifies the engine: **a tile is only ever revealed by a ship entering it** (Move, Evade, or a Graviton Warp Conduit move). Comms Specialist uses an Interact on an *already revealed* adjacent tile and cannot reveal a new one, so the orientation prompt always has an entry gate to match.

### 9.4 Connectivity analysis (new in v0.2; finding `CON-1`, resolved by the Nexus Hop `NEX-1`)

**Question.** With face-down tiles oriented by whoever reveals them under `MAP-6` (a gate must face the hex entered from, nothing else is checked) and full-gate-only movement, can a start Nexus always reach the Central Nexus? Redeeming needs the Central Nexus, so an unreachable centre is a soft-lock for that seat. **Outcome:** the owner pointed out the Nexus Hop (an Interact at any Outer Rim Nexus: pay 1 resource, travel to another Outer Rim Nexus, no Move action, never the Central Nexus; `NEX-1`), which I had missed because it is not in the old rulebook text. The analysis below shows the problem it solves and how much is left.

**Method.** `docs/analysis/gate-graph-sim.js` (run with `node`). It builds the 2-seat and 4-seat boards, deals the real planet and Anomaly gate tables (Appendices B and C), and reveals every hex reachable from the start Nexus tiles, orienting each tile by one of three policies. 4000 games per setting. The 3-seat board is not modelled (provisional layout).

**Results** (percent; "linked" means a route of full gate connections exists on the final board):

| Setting | Seats | Start Nexus linked to Central | Every start linked to Central | Dead-end tiles | Route stretch |
|---|---|---|---|---|---|
| Random orientation | 2 | 81.8 | 69.9 | 33.1 | 1.60 |
| Careful orientation (greedy) | 2 | 97.0 | 94.0 | 24.1 | 1.43 |
| Greedy, ring around centre must face it | 2 | 97.5 | 95.0 | 24.8 | 1.42 |
| **Half-connections passable for all normal moves** | 2 | **100.0** | **100.0** | 5.3 | 1.14 |
| Random orientation | 4 | 75.5 | 45.1 | 33.1 | 1.78 |
| Careful orientation (greedy) | 4 | 94.3 | 81.0 | 22.6 | 1.61 |
| Greedy, ring around centre must face it | 4 | 94.3 | 80.3 | 23.0 | 1.60 |
| **Half-connections passable for all normal moves** | 4 | **100.0** | **99.9** | 3.7 | 1.17 |

**Reading it.**
- Even with every tile oriented by a link-maximising player, **about 3% (2 seats) to 6% (4 seats) of start Nexus tiles have no full-gate route to the Central Nexus**, and in **6% (2 seats) to 19% (4 seats) of games at least one seat is cut off**. A real table orients selfishly, so the random rows are the more pessimistic bound.
- Forcing the ring around the Central Nexus to face it changes almost nothing: the breaks occur further out.
- About 3% to 8% of hexes can never be revealed under normal moves, and about 5% (4 seats) to 9% (2 seats) of planets are unreachable on a careful board (both are in the script output).
- Letting a single gate on either side make an edge passable for **all** normal moves removes the problem (about 0% unlinked) and shortens routes, but it changes the meaning of gates and weakens the Warp Engineer, Slip Drive and Warp Conduit cards.
- These numbers ignore the half-connection tools (which may rescue an isolated start), so they overstate the real soft-lock rate somewhat.

**With the Nexus Hop (`NEX-1`).** A ship can move between Outer Rim Nexus tiles regardless of gates, so a seat is stranded only if **no** start Nexus has a full-gate route to the Central Nexus. The script now also reports "at least one start linked to Central":

| Orientation | Seats | At least one start linked to Central | Stranded | Best start's path to Central |
|---|---|---|---|---|
| Careful (greedy) | 2 | 99.95% | 0.05% | 2.15 hexes |
| Careful (greedy) | 4 | 99.92% | 0.08% | 3.03 hexes |
| Random | 2 | 93.70% | 6.30% | 2.39 hexes |
| Random | 4 | 94.53% | 5.47% | 3.22 hexes |

So with careful orientation the Hop reduces the stranded rate from 6% (2 seats) and 19% (4 seats) of games to under 0.1%. Under random orientation about 6% of games would still have no start Nexus connected to the centre. The hop costs an Interact token (general or an officer token on that ship) and 1 resource, and a seat that must hop to reach a connected Nexus pays a few extra game rounds, which the economy simulation should include. Unreachable hexes and planets (3% to 8% and 5% to 9%) stay unreachable by normal moves, which is accepted.

**Resolved (`CON-1` closed by `NEX-1`).** `MAP-6` and `MAP-7` stay unchanged and no orientation mitigation is added. The engine still includes a **soft-lock detector**: when a seat has no ship that can reach the Central Nexus (no gate route from any Outer Rim Nexus and no half-connection tool), surface a "stranded" condition; the residual random-orientation case is watched, not ruled. The Hop is a legal-action kind `nexusHop` (Interact subtype, no Move token). Its Interact event is recorded on the **exit hex only** (mission trackers such as Perimeter Lockdown see an Interact on the exit hex, never on the destination), and a later Interact on the destination is a separate action if a token is available. Assumptions about occupied destinations and pinning are in `NEX-1`.

**Economy side (not yet simulated).** The first task of P1 is an economy-only simulation (section 11) answering whether a game can be won in a sensible number of game rounds given the one general Interact token per fleet per game round (plus officer Interact tokens from crew, `ACT-1`; the slice has Scouts, so run with and without them), planet supply and demand, and the Central Nexus requirement.

---

## 10. Testing strategy

| Layer | Approach |
|---|---|
| Rules | **Scenario tests.** A tiny harness builds a hand-made state (ships, components, pools), scripts a list of decisions, and asserts on events and resulting state. One or more scenarios per ruling in section 7, cited by ruling ID. |
| Determinism | **Replay tests:** run a seeded game with scripted/bot decisions, record the log, replay it, compare state and event stream byte for byte. Run in CI on every change. |
| Invariants | **Random legal play at scale:** thousands of seeded games where every prompt is answered by a random legal option, with the 4.12 invariants checked after every step. This will find most rules bugs you cannot foresee. |
| Bots | **Bot-vs-bot soak and tournament** via `packages/sim`: win rates by seat and by first-player, rounds to 3 VM, stall detection (games that never end). Also the hidden-information poison test (4.6). |
| Monte Carlo | Same position, same seed gives same win rate. Engine speed budget tracked (a regression test on runs per second). |
| Combat guard | Random-play and bot soak runs fail the build on any `CombatStalemate` event (the 100-combatRound guard, `CMB-4`); a scenario test forces one and checks it is reported, not swallowed. |
| Determinism lint | CI runs ESLint with the restricted-API rules (`ENF-1`); a test file containing each banned call must fail lint (a "canary" so the rule cannot silently stop working). A serialiser test checks that key order and `undefined` never change a state hash. |
| Commit-point saves | A test reloads a snapshot taken immediately after each `revealsHidden` / `usesRandomness` event type (including mid-combat) and continues; the continuation must match the uninterrupted game byte for byte (`SAV-2`). |
| Soft-locks | The invariant soak also checks the stranded-seat detector: no seat may sit with zero legal actions other than Pass for more than N game rounds without the condition being flagged. |
| Economy | The economy-only simulation (section 11, P1) runs thousands of seeded games with the crude bot and reports game rounds to a VM win, stalls (`GEN-1`, 200-game-round abort) and Interact-token usage. |
| Connectivity | `docs/analysis/gate-graph-sim.js` is re-run whenever tile data or orientation rules change; later it becomes a map-module test that asserts the stranded rate with the Nexus Hop stays at the measured level (`CON-1`, `NEX-1`). |
| Simulator parity | **Limited on purpose.** Only where V5 and the simulator agree (enemy stat tables, basic dice flow). Everywhere else the rulings win. |
| UI | **No Storybook or Playwright for now (both deferred; Storybook may never be used).** A dev-only gallery route renders cards, prompts and dice from fixtures for visual checks, and the UI is exercised by hand. Revisit a single Playwright smoke test (a seeded game played through the browser) once the UI has stabilised. |

---

## 11. Suggested build order

Relative size only. No dates.

**Staging (proposed, `implementation-plan.md`):** the plan there pulls visual design forward as **Stage 1, before any engine code**: a fixture-driven table, component gallery and motion lab that read one typed `GameView`, so the look and feel can be judged first. The P0 visual spike becomes its motion lab. The phases below still describe the engine and game work; Stage 2 is P0 (minus the spike), Stage 3 and 4 are P1, Stage 5 is P2, Stage 6 is P3.

```
 P0 Foundations ---> P1 Economy and board ---> P2 Exploration and combat  = YOUR FIRST MILESTONE
        |                    |                              |
        |                    +--> P3 Presentation (can start after P1, event stream exists)
        |                                                   |
        +----------------------------> P4 Cloud saves, accounts, summary telemetry
                                                            |
                                          P5 Bot v2 and tuning ---> P6 Content expansion
```

| Phase | Goal | Exit criteria |
|---|---|---|
| **P0 Foundations (M)** | Workspace, ESLint determinism and import-boundary rules (`ENF-1`) plus the no-DOM tsconfig, canonical serialiser, content schemas, RNG, state, events, reducer, resolution-stack driver, prompts, `viewFor`, runner, scenario harness. Two **spikes**: the DOM dice/card/pan spike (no Pixi), and the five hard cards run as engine-only fixtures. | A scripted two-seat toy game replays identically; the hard-card fixtures pass; the visual spike works. |
| **P1 Economy and board (L)** | **First task: an economy-only simulation** (map, Move/Trade/Interact/Pass, Commission, Redeem, upgrades, crude bot, no combat, no enemies) to answer whether a game can be won in a sane number of game rounds and whether the single general Interact token per game round is a bottleneck (crew adds officer tokens, `ACT-1`; run with and without the four-Ensign crew set); **exit criterion: median game length and stall rate are acceptable** (target set by the owner; stalls abort at 200 game rounds, `GEN-1`); the simulation includes the Nexus Hop (`NEX-1`). Then: map from setup data, Move/Trade/Interact/Pass, cargo vs pool, markets and 3-for-1, Maintenance skeleton, common-technology upgrades, new ships, missions with the tracker, **the four plain Ensign crew in the first slice** (costs `CRE-2`; full catalogue and Commander deck composition in content, `DCK-5`, but Commanders stay out of the slice until later milestones), VM and game end. Crude bot (random legal plus redeem priority). Plain functional UI with prompt host. Local save. | Human vs crude bot plays a whole game to a VM win in the browser, ugly but correct. Random-play invariant soak is green. |
| **P2 Exploration and combat (L)** | Anomaly tiles (first slice), enemy deck and one faction, discovery bonuses, full multi-ship combat per V5 rulings, damage and retreat prompts, reward cards, Evade and blockade rules, Beam Projector. Bot gets plain strength heuristic and Evade-when-pinned. | **This is your stated first milestone:** map, actions, trading, upgrades, missions and combat against one bot. |
| **P3 Presentation (L)** | Animation director, DOM/CSS effects behind the effects renderer interface (Pixi deferred), tile flips, card moves, dice, combat log, audio, card visual polish. | A game feels like a board game, not a form. |
| **P4 Cloud (S to M)** | Firebase Auth, Firestore snapshots + log, IndexedDB fallback, migrations, game summary. | Sign in on a second browser and resume a game. |
| **P5 Bot v2 and tuning (L)** | 1 to 3 bots, route-scored trading, scored tile abilities, Monte Carlo strength check in a worker, blockade logic, tournament harness, tuning. | Bot-vs-bot tournaments show sane game lengths with no stalls; you have chosen target numbers. |
| **P6 Content expansion (M per batch)** | More components, tiles, factions, missions in the effect language. | Slices released one at a time, with coverage test. |

Two sequencing points worth saying aloud. First, **a human-playable UI exists from P1**, because rules you cannot play are rules you cannot judge. Second, **the effect language is exercised in P0**, not P6, so a flaw is found when it is cheap.

---

## 12. Where this proposal adds to or departs from your documents

| Topic | Your documents | This proposal | Why |
|---|---|---|---|
| State changes | Engine emits an event stream | Events are the *only* way state changes (reducer) | Removes engine/animation drift; makes director, replay and tracker folds over one source |
| Save format | Seed + decision log + rules version | **Snapshot** authoritative, log as companion; written at turn boundaries **and at commit points** (`SAV-2`) | Replay-only saves break on any engine change; turn-only saves allow reload-scouting and reroll |
| Enforcement of determinism | Not specified ("no DOM lib" in v0.1) | **ESLint restricted globals and properties** plus a no-DOM tsconfig (`ENF-1`) | The DOM lib does not remove `Date.now`, `Math.random` or `localeCompare` |
| Combat model | Combat per V5, initiative "at round start" | N-party free-for-all, **initiative recomputed each combatRound from live speed**, run to completion with a 100-combatRound guard (`CMB-3` to `CMB-5`) | Owner rulings in the second review |
| First build step | P1 starts with the map and economy | P1 **starts with an economy-only simulation** with exit criteria | The largest unknown is whether games are winnable and the length of a game, not combat |
| Bot randomness | Same seeded source as dice | Same *game seed*, separate named streams | A bot that changes cannot shift human dice |
| Prompt mechanism | Not specified | Explicit resolution stack in state | Enables mid-attack saves and Monte Carlo copies; generators cannot be cloned |
| Effect language | Fully designed up front, implemented for the slice | Hybrid: data layer plus registered code for one-offs, same three hook families | Honest about the 25 to 30 one-offs; keeps the core card-free |
| Bot memory | "Next planned purchase" etc. implied | Stored in the save envelope, outside rules state | Keeps rules state pure; allows bot retuning without breaking saves |
| Headless sim package | Not mentioned | Added in P0/P1 | Cheapest route to soak tests and the tuning data you want |
| Undo | Not mentioned | Optional, nearly free | Falls out of snapshot + log |
| Visual design timing | P3, after P1 and P2 | **Proposed (`implementation-plan.md`): Stage 1, before the engine**, from fixtures behind a `GameView` seam; the P0 spike becomes the motion lab | Owner wants to see the look first; also settles `Q18` and the cargo-versus-pool display |
| Pixi, Playwright, Storybook | Part of the chosen stack | **Deferred** (Storybook possibly never); DOM/CSS effects behind an effects renderer interface, a dev gallery route, no browser E2E yet | Smaller first build; the interface keeps Pixi cheap to add later |

---

## 13. Risks, gaps and questions for you

### Top technical risks

1. **The hook model may not survive the hardest cards.** Mitigation: the P0 fixtures and the paper walks your doc already asks for.
2. **Resolution frames are verbose and harder to debug than linear code.** Mitigation: a fixed combat pipeline, a stack/event trace tool, scenario tests per ruling.
3. **Prompt volume could make combat tiresome.** Mitigation: only raise reactions that are available; later, auto-decline helpers via the default policy.
4. **Bot cost.** 1 to 3 real bots, route scoring, tile scoring and Monte Carlo is the largest "least gameplay payoff" item, as you noted. The scored-action interface lets it grow incrementally, and the tournament harness stops you tuning blind.
5. **Rulings drift.** The documents already needed a consistency pass. Ruling IDs and tests citing them are the defence.
6. **Monte Carlo speed in the browser.** Unmeasured. A budget test in P0 and the worker boundary make it a tuning problem, not a redesign.

### Questions raised while drafting (all resolved except the items listed after the table)

| # | Question | Why it matters |
|---|---|---|
| Q1 | **Resolved:** my reading of the three diagrams in Appendix A is accepted ("probably correct"). You also stated a design property: **every start Nexus is the same distance from the Central Nexus**. I will encode that as a layout validation test (all start hexes equidistant from the centre, and a check on how far apart the starts are from each other), so a slip when authoring the layout data is caught. | Layout tables are authored from images, so the test guards against transcription errors. |
| Q10 | ~~Nexus gates.~~ **Resolved:** the Central Nexus has a gate on all six sides. Each Outer Rim Nexus has a gate on every side that faces a neighbouring hex and none facing off the map (section 9.1). | Every tile type now has gate data. |
| Q11 | ~~Moving into a face-down tile.~~ **Resolved:** the revealing player orients the tile freely, subject only to one of its gates matching the gate they entered through. Entry through a gate into a face-down hex therefore always succeeds, and the same holds for Evade. | Routes into unexplored hexes need only a gate on the source side. |
| Q14 | **Resolved.** No reveal happens without an entering ship (Comms Specialist works only on an already revealed tile). For **moves that allow half connections** (Warp Engineer, Cloaked Slip Drive Evade, Graviton Warp Conduit) the rule is looser: at least one of the two tiles must have a gate on the edge crossed. **If the tile you leave has a gate on that edge, the new tile may be oriented any way, gate or not. If it has no gate there, the new tile must be oriented so a gate faces it.** | Gives the orientation constraint in section 9.1. |
| Q15 | **"Adjacent" resolved:** tiles can be adjacent without being connected by gates. **Owner-confirmed: "adjacent" means touching**, and Comms Specialist, Beam Projector and Long-range Sensor Specialist do not need a gate between the hexes. Adjacent and connected are two different concepts. | The engine keeps `isAdjacent` (geometry), `isConnected` (both sides) and `isHalfConnected` (one side) as separate queries, and rules text must say which it uses. |
| Q18 | **3-seat board stagger: DEFERRED by the owner** until the UI can render the board ("easier once the UI is rendering"). The 3-seat drawing in Appendix A is **provisional**. Known facts: row widths 2, 4, 5, 6, 5, 4, 2; N1 top-row right end, N2 left end of the 6-wide row, N3 bottom-row right end; Central Nexus 4th from the left in the 6-wide row. Unsettled: the horizontal offset of rows 1, 2, 4 and 5. | The 2-seat and 4-seat layouts are unaffected. The 3-seat layout data stays a placeholder (and its Outer Rim gate counts are not final) until this is settled. |
| Q16 | **Resolved by Q14.** A half-connection move into a face-down tile from a tile with no gate on that edge **is allowed**; the revealer must then orient the new tile so a gate faces the source. | Warp Engineer, Slip Drive and Conduit can open routes into unexplored space that a normal ship cannot. |
| Q12 | ~~Planet gate patterns.~~ **Resolved:** `cl` = TL, TR, R; `y` = TL, R, BL; `ar` = TL, BL, BR; `al` = TR, BR, BL (Appendix C). | Planets and Anomalies are now fully specified. |
| Q13 | **Resolved: the PDF is right.** With fewer than 4 seats a Nexus tile holds two markets (2 seats: 1 and 2 on N1, 3 and 4 on N2; 3 seats: 1 on N1, 2 and 3 on N2, 4 on N3), and a ship there may buy from either. | The layout carries `marketsAtNexus`. `design-decisions.md` section 7 ("Upgrades at the Outer Rim Nexus") has been corrected (`MAP-4`). |
| Q2 | **Resolved: the general supply is unlimited.** | No supply-exhaustion rule, and the conservation invariant becomes "enter through sources, leave through sinks" (section 4.12). |
| Q3 | **Resolved: cargo and pool are both public.** | The view projection shows them in full. Bots may use rivals' cargo and pool in decisions, and the Monte Carlo strength check can use them as inputs (for pay-to-react abilities). |
| Q4 | **Resolved: tied combatants fire simultaneously.** Combatants with equal speed form an **initiative group**. Everyone in the group rolls and fires before any of their damage is resolved, so tied combatants can destroy each other. Groups act in descending speed order. | Combat round shape (section 4.7). The ordering of the group's damage resolution is covered by Q6. |
| Q5 | **Resolved: Decoy Launcher is used after the attacker rolls**, once the defender can see the result, before damage. | It sits in pipeline step 6 (reactions), after Temporal Echo and Repulsor Grid, as already drawn in section 4.7. |
| Q6 | **Resolved: the first-player token holder's effects resolve first, then clockwise by seat; within one seat, by the order components were installed; remaining ties by component ID.** (Refined by `CMB-10`: the **owner picks** the order of their own simultaneous effects; install order is the default for bots, simulation and tie-breaks.) This applies to simultaneous damage events in an initiative group, Self-destruct chains, end-of-Action-phase effects and same-window reactions, unless a card says otherwise. | The engine's effect collector sorts by this key, so the order is deterministic and replayable. The engine therefore needs to record an **install sequence number** on every installed component. |
| Q7 | **Resolved: snapshots with schema migrations; big rules changes may mark old saves "legacy".** No old engine builds are kept. | `rulesVersion` and `schemaVersion` live in every save envelope from day one; migrations are small functions run on load. |
| Q8 | **Resolved: undo back to the start of the current action/turn only.** | The runner keeps an in-memory snapshot taken at each turn boundary and drops it when the turn ends. The scouting loophole this creates is Q17. |
| Q17 | **Resolved: undo locks the moment anything hidden is revealed or any dice are rolled in the current turn.** Undo therefore only covers harmless mis-clicks and plans, not information gained. | Engine events carry a flag (`revealsHidden` or `usesRandomness`). The runner disables undo for the rest of the turn when it sees one. Peeks (Archives, Sensor Array, Long-range Sensor Specialist), tile flips, card draws and every dice roll set the flag. **The same flag now also triggers an immediate local save (`SAV-2`).** |
| Q19 | **Resolved (second review): terms.** game round, combatRound and turn (`TRM-1`). | Naming in state, events and card data. |
| Q20 | **Resolved: combat model.** Free-for-all among all opposing combatants, initiative recomputed each combatRound from live speed and then frozen, run to completion, 100-combatRound guard, sequential retreat in first-player order to a full-connection hex, Maintenance combat from a start-of-step snapshot (`CMB-3` to `CMB-7`). | Section 4.7. |
| Q21 | **Resolved: attack pipeline order.** Targets and pre-roll commitments together, then defender pre-roll reactions in seat order; dice = (printed + bonuses) x2 then minus reductions; Gauss judged per weapon, Prism and Shield Specialist once per event; Interceptor cannot react to range attacks; owner orders their own simultaneous effects; self-damage queued with group damage; Torpedo before Spoils (`CMB-8` to `CMB-11`). | Section 4.7 pipeline. |
| Q22 | **Resolved: loot and choosers.** Cargo goes to a same-hex killer, otherwise to supply; the defender chooses Spoils cargo and lost components; Larva tokens are not ships (`LOT-1` to `LOT-5`). | Section 4.7 notes. |
| Q23 | **Resolved: decks and rewards.** Immediate refill of markets to 3; empty decks reshuffle; reward cards come from one of the tile's two bonus-resource decks, discoverer picks; install only in that hex (`DCK-1` to `DCK-4`). | Content and Upgrade handling. |
| Q24 | **Resolved: saves, recovery, missions, length.** Commit-point saves, recovery on any Nexus (pinned if occupied), free mission discard, 29-card slice mission deck (`MSN-3`), no game-length limit with a 200-game-round simulation abort (`SAV-2`, `REC-1`, `MSN-2`, `MSN-3`, `GEN-1`). | Sections 4.8 and 7. |
| Q26 | **Resolved: start-Nexus connectivity.** The Nexus Hop (Interact at an Outer Rim Nexus, 1 resource, to another Outer Rim Nexus, no Move action, never the Central Nexus; `NEX-1`) removes the soft-lock found by the gate-graph simulation (stranded in under 0.1% of careful games). | Section 9.4. |
| Q25 | **Resolved: enforcement.** ESLint restricted APIs, not the DOM lib (`ENF-1`). | Section 2. |
| Q9 | **Resolved: no auto-decline.** The human is asked whenever a reaction is available. The engine still suppresses prompts for reactions that cannot be used (not installed, cannot pay even with the 3-for-1 exchange). | Removes the "auto helper for the human" idea from the default-policy module; the default policy is for bots and simulation only. |

**Still open after the second review** (full list in `design-decisions.md` section 12):
1. ~~`CON-1`: start-Nexus connectivity~~ **Resolved by the Nexus Hop (`NEX-1`, section 9.4)**; the details I assumed for occupied destinations and pinned arrival still need confirming (the pool cost and the "Interact on the exit hex only" point are confirmed).
2. Enemy target selection in free-for-all combat (a placeholder is used until ruled).
3. Explore (Comms Specialist) on a hex that already has an enemy: forbid, or allow several enemies per hex.
4. Invalidation of peeked deck knowledge after shuffles and draws.
5. Confirmation of my assumptions in `LOT-5`, `REC-1` (what persists) and the multi-killer loot tie.
6. Real enemy deck counts (`content-data.md` holds placeholders). ~~Per-card crew costs~~ **Resolved (`CRE-2`, `DCK-5`).**

### What I would do first, if you approve the direction

1. Run the P0 DOM dice/card/pan spike and the hard-card fixtures, since those two cheaply retire the biggest visual and rules-model risks.
2. ~~Get answers to the open questions.~~ **Done** except the open list above.
3. ~~Fold the answers into `design-decisions.md`.~~ **Done.** They are in `design-decisions.md` sections 13 to 15 with stable IDs (`MAP-1` to `MAP-9`, `CMB-1` to `CMB-11`, `ORD-1`, `INF-1`, `ECO-1`, `SAV-1`, `SAV-2`, `UX-1` to `UX-3`, `LOT-1` to `LOT-5`, `DCK-1` to `DCK-5`, `CRE-1`, `CRE-2`, `TRM-1` and more). The older sections 1 to 12 are not numbered yet, so the next step is to number them as tests are written against them.
4. Scaffold the workspace and verify library versions and licences, which `tooling-decisions.md` says have not been checked.

---

## Appendix A. Board layouts read from the old rulebook diagrams

Pointy-top hexes. `.` is a filler hex (a face-down planet or Anomaly), `C` the Central Nexus, `N1` to `N4` the start Outer Rim Nexus tiles by seat slot (the PDF colours them Red, Green, Yellow, Purple). **These are my reading of three images; please confirm (Q1).** The market assignment is from the text above each diagram.

```
 2 SEATS (19 hexes)  10 planets + 6 Anomalies          Markets: N1 = 1,2   N2 = 3,4

          N1  .  .
         .  .  .  .
        .  .  C  .  .
         .  .  .  .
           .  .  N2


 3 SEATS (28 hexes)  15 planets + 9 Anomalies          Markets: N1 = 1   N2 = 2,3   N3 = 4
 PROVISIONAL: row widths, starts and centre are right; the horizontal stagger
 of rows 1, 2, 4 and 5 is NOT settled (Q18, deferred until the UI renders).

            .  N1
         .  .  .  .
        .  .  .  .  .
       N2  .  .  C  .  .
        .  .  .  .  .
         .  .  .  .
            .  N3


 4 SEATS (37 hexes)  20 planets + 12 Anomalies         Markets: N1 = 1   N2 = 2   N3 = 3   N4 = 4

           .  .  .  .
         N1  .  .  .  N2
        .  .  .  .  .  .
       .  .  .  C  .  .  .
        .  .  .  .  .  .
         N3  .  .  .  N4
           .  .  .  .
```

In axial coordinates (q, r) with the centre at (0, 0), the regular 2-seat board puts N1 at (0, -2) and N2 at (0, 2), and the 4-seat board puts N1 at (-1, -2), N2 at (3, -2), N3 at (-3, 2) and N4 at (1, 2). The 3-seat board is irregular, so it is stored as explicit rows. All of this is to be re-checked against the images when the layout data is authored.

## Appendix B. Anomaly tiles (seed data from the old PDF)

Gate edges are the **printed orientation**; the player rotates the tile on reveal (section 9.1). TL top left, TR top right, R right, BR bottom right, BL bottom left, L left. **Use only the structural columns.** The effect text in the PDF is superseded by the rulings in `design-decisions.md` (section 7) and some tiles were reworded. The "(Nexus Tile)", "(Chokepoint Tile)" and "(Dense Terrain Tile)" labels are flavour only, as ruled.

| # | Tile | Discovery bonus | Gates | Warp-gate edges |
|---|---|---|---|---|
| 1 | The Scrap Reclamation Yard | 1 TC, 1 PC | 3 | TL, R, BL |
| 2 | Black Market Trading Depot | 1 QP, 1 H3 | 3 | TR, BR, L |
| 3 | EMP Array Substation | 1 PC, 1 QP | 3 | TL, BR, L |
| 4 | Overclocking Relay | 1 PC, 1 H3 | 3 | TR, R, BL |
| 5 | Graviton Warp Conduit | 1 H3, 1 QP | 4 | TL, TR, BR, BL |
| 6 | Automated Nanite Station | 1 TC, 1 QP | 3 | R, BL, L |
| 7 | Solar Flare Sanctuary | 1 H3, 1 PC | 3 | TL, TR, BR |
| 8 | Deep-Space Tactical Sensor Array | 1 QP, 1 TC | 3 | TR, BL, L |
| 9 | Encrypted Archives Station | 1 QP, 1 H3 | 3 | TL, R, BR |
| 10 | System Defence Grid | 1 TC, 1 PC | 2 | TL, BR |
| 11 | Sensor Buoy Network | 1 QP, 1 PC | 3 | TR, R, L |
| 12 | Volatile Helium Nebula | 1 H3, 1 TC | 3 | TL, BR, BL |
| 13 | Dense Asteroid Field | 1 TC, 1 H3 | 2 | R, L |
| 14 | Fleet Command Substation | 1 PC, 1 TC | 3 | TR, BL, L |
| 15 | Free-Trade Logistics Hub | 1 H3, 1 QP | 4 | TL, R, BR, L |
| 16 | Smuggler's Foundry | 1 TC, 1 H3 | 3 | TR, BR, BL |
| 17 | Intelligence Bureau | 1 QP, 1 TC | 3 | TL, R, L |
| 18 | Subspace Disruption Array | 1 PC, 1 QP | 3 | TR, BL, L |
| 19 | System Regulator Node | 1 H3, 1 PC | 3 | TL, R, BR |
| 20 | Personnel Transporter | 1 QP, 1 H3 | 3 | TR, BR, L |
| 21 | Officer Training Command | 1 TC, 1 PC | 3 | TL, R, BL |
| 22 | Commerce Guild Outpost | 1 TC, 1 QP | 3 | TR, BR, BL |

Observations: only tiles 10 and 13 have two gates (the "chokepoint" and "dense terrain" tiles, which makes sense), tiles 5 and 15 have four, and every other tile has three. Each tile's discovery bonus is two different resource types (pairs repeat across tiles, for example QP + H3 appears on tiles 2, 9 and 20). A small property test can verify the data (every edge name valid, gate counts match, discovery resources are two different types).

## Appendix C. Planet tiles (seed data from the old PDF)

Twenty planets in four themed groups of five. Supply and demand numbers are the per-action caps ruled in `design-decisions.md`. The code in brackets is the planet's **warp-gate pattern** (all four confirmed by you, Q12). Usage across the 20 planets: `cl` 6, `ar` 6, `al` 6, `y` 2.

| Code | Gates | Status |
|---|---|---|
| `cl` | TL, TR, R | **Confirmed** |
| `y` | TL, R, BL | **Confirmed** |
| `ar` | TL, BL, BR | **Confirmed** |
| `al` | TR, BR, BL | **Confirmed** (my earlier mirror-image guess was wrong) |

These are **printed orientations**. Every planet has exactly **three** gates, and the player rotates it on reveal like any other tile. The data model is the same as the Anomaly tiles: a set of printed edges per tile, stored as data, plus a rotation in game state. The PDF's resource names: TC titanium carbide, H3 helium-3, PC plasma cells, QP quantum processors.

| Group | Planet (code) | Supply | Demand |
|---|---|---|---|
| High metal | Aethel-9 (cl) | TC 4 | H3 3, QP 2 |
| High metal | Vulkan's Forge (y) | TC 4, H3 2 | PC 2, QP 3 |
| High metal | Gorgon Prime (ar) | TC 5 | H3 3, PC 2 |
| High metal | Caelum Mining Hub (al) | TC 4 | QP 4 |
| High metal | The Iron Ring (cl) | TC 4, PC 2 | H3 4 |
| High fuel | Zephyrus Minor (ar) | H3 4 | TC 4, QP 2 |
| High fuel | Kraken's Breath (al) | H3 5 | TC 3, PC 2 |
| High fuel | Osiris-4 (cl) | H3 4, TC 2 | QP 4 |
| High fuel | Boreas Station (y) | H3 4 | TC 2, PC 3 |
| High fuel | Neptunia Prime (ar) | H3 4, PC 2 | TC 4 |
| High component | Nova Forge (al) | PC 4, TC 2 | H3 4, QP 2 |
| High component | Stallos Prime (cl) | PC 4 | TC 4, H3 2 |
| High component | Ares Citadel (ar) | PC 5, TC 2 | H3 4 |
| High component | Steelhold Alpha (al) | PC 5 | TC 4, QP 3 |
| High component | Vanguard Station (cl) | PC 4, H3 2 | TC 4 |
| High tech | Solaria Prime (ar) | QP 4 | TC 2, H3 4 |
| High tech | Xanadu Core (al) | QP 4, PC 2 | H3 4 |
| High tech | Apex Laboratories (cl) | QP 5 | PC 4 |
| High tech | Elysium Nexus (ar) | QP 4, H3 2 | TC 4 |
| High tech | Chronos Research Outpost (al) | QP 4 | H3 4 |

Two things this data makes visible. First, every planet supplies one or two types and demands one or two *different* types, and no planet demands what it supplies, so a trade route always spans at least two planets, which is exactly what your "route scoring" for the bot has to find. Second, with 10 planets in a 2-seat game, some resource types will be scarce on the board by chance, which the seeded draw makes reproducible and the tournament harness can measure.
