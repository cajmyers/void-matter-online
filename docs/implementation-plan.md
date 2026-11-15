# Void Matter Online: staged implementation plan

Status: **draft v0.2.** Stage 0 is built locally; sub-stage **1a is built** and still refined with the owner; sub-stage **1b slices 1–2 are built** (tiles, tokens, ships, cards at hand and inspect widths); **1b slice 3 onward, 1c to 1f, and Stage 2 onward are not started** (see the progress table). This plan sequences the work in `technical-proposal.md` section 11 (phases P0 to P6) and **pulls the look and feel forward to Stage 1**, before any rules code. It is a plan, not a ruling: `design-decisions.md` stays authoritative for rules, and `technical-proposal.md` and `tooling-decisions.md` stay authoritative for architecture and stack until you accept the departures listed in section 3.

Sizes are relative (S, M, L), as in the technical proposal. No dates.

## Progress

| Stage | State |
|---|---|
| 0 Scaffold and preview deploy | **Built locally** (scaffold, `firebase.json` → `apps/web/dist`, old `public/` removed; `pnpm test`, `lint`, `typecheck` pass). **Not done:** first `pnpm deploy:preview` (needs Firebase login in the README). Until then, `void-matter-online.web.app` still serves the pre-scaffold placeholder, not this app. |
| 1a Style direction | **Holo tactical chosen; the other two themes are deleted.** Owner action icons and resource tokens are in. `#/dev/style`: tokens, vision simulator, game palette, motion samples, and a **2-seat specimen board** from real fixtures (owner planet/Nexus/anomaly art, pinned rival ships, damage-choice prompt mock). Hex **selected** (Vulkan's Forge) and **hover** rim on interactive tiles. Still refined one area at a time with the owner. |
| 1b Component gallery | **Slices 1–2 built** at `#/dev/gallery`: resources and markers; action tokens (general and officer, ready and exhausted); **tiles** (face-down, both Nexus kinds, all 20 planets, locked areas, all 21 Anomalies with owner art, rotation, full/half/no connections) at **board scale and inspector detail scale** for every tile kind; ships (four seat colours, hovered, selected, pinned); **cards** (`CardScalesFigure`, 118px hand / 220px inspect): four sector rims, half / 1 / 2 slots, weapon stats and defences, unique and common technology, four Ensigns, missions (in progress and complete), Iron Syndicate enemies with reward stack, Corvette ship card with half slots, reference card, slice deck backs. **Still to build (slice 3):** zones, dice, the 14 prompt kinds, chrome. Tile slice 1 is **done** (gates, Interact/passive marker, art at both scales). No extra chokepoint or dense-terrain graphics: gate count on the hex is enough (tiles 10 and 13 have two gates; 5 and 15 have four). |
| 1c to 1f | Not started |
| 2 onward | Not started |

---

## 1. The idea in one paragraph

You want to see the game before the game exists. So the first real stage builds a **fixture-driven table**: the whole play screen (board, ships, cards, markets, player mat, prompts, combat) rendered from hand-written data, with a dev toolbar to jump between situations (fresh board, mid-game, blockade, a damage-choice prompt, game over). Nothing in it knows any rules. It reads one typed **view model** (`GameView`) and emits one kind of callback (a `Decision`), which is exactly the seam the real engine will later fill (`viewFor(state, seat)` and `engine.step`, technical proposal sections 3 and 4.6). Because the UI only ever sees a view, the same components are reused unchanged when the engine arrives, so Stage 1 is not throwaway work.

## 2. Stage map

```
 Stage 0  Scaffold and preview deploy          (S)
    |
 Stage 1  LOOK AND FEEL  (no rules, no engine) (M to L)     <-- your first milestone
    |        1a style direction   1b component kit   1c the table
    |        1d scenario switcher 1e motion lab     1f sign-off
    |
 Stage 2  Engine foundations + content data    (M)          = technical proposal P0
    |
 Stage 3  Economy simulation (go/no-go gate)   (M)          = P1, first task
    |
 Stage 4  Playable economy game                (L)          = P1, remainder
    |
 Stage 5  Exploration and combat               (L)          = P2  (your stated first game milestone)
    |
 Stage 6  Presentation wiring                  (M)          = P3, but the design is already done
    |
 Stage 7  Cloud saves                          (S to M)     = P4
 Stage 8  Bot v2 and tuning                    (L)          = P5
 Stage 9  Content expansion                    (M per batch)= P6
```

Stage 7 can start any time after Stage 4. Stage 6 needs Stage 4's event stream. Everything else is sequential.

| Stage | You can look at or do | Maps to |
|---|---|---|
| 0 | A deployed empty shell on a Firebase preview URL | P0 (first part) |
| 1 | The whole game's look: gallery, a static table in any of a dozen situations, an animation lab | new (replaces the visual spike in P0) |
| 2 | Nothing new visually; the gallery now renders real card data; tests pass | P0 |
| 3 | A table of simulated game lengths and stall rates | P1 |
| 4 | Play a whole game against a crude bot, ugly but correct, with no combat | P1 |
| 5 | Play a whole game with exploration, enemies and combat | P2 |
| 6 | The game animates like a board game | P3 |
| 7 | Sign in elsewhere and resume | P4 |
| 8 | Smarter bots, tournament numbers | P5 |
| 9 | More cards, tiles, factions | P6 |

---

## 3. Where this departs from the technical proposal

| Topic | Technical proposal | This plan | Why |
|---|---|---|---|
| Visual design timing | P3, after P1 and P2 | **Stage 1, before any engine** | You asked to see the look first; it also settles two items the docs deferred to "when the UI renders" (`Q18`, cargo versus pool display) |
| The visual spike | One of two P0 spikes | Becomes Stage 1e, the **motion lab**, and widens from "dice, card, pan" to every animation family | Cheapest place to retire the Pixi-deferral risk, and the look needs motion anyway |
| First task of the build | P0 foundations | **Stage 0 scaffold, then Stage 1** | Needs only `apps/web`; the engine packages and their lint boundary arrive in Stage 2 |
| Gallery route | Dev-only route for visual checks | Kept, but it also ships in a **preview build** so you can review on a URL | You review it on a real screen, not only on the dev machine |

Nothing else in the technical proposal changes. If you accept this, mirror it into `technical-proposal.md` sections 11 and 12 (`docs-editing.mdc`).

---

## 4. Stage 0: scaffold and preview deploy (S)

Goal: an empty but real app, deployable to a Firebase preview channel, so every later stage can be reviewed on a URL.

| Task | Notes |
|---|---|
| pnpm workspace with `apps/web` only | **Done.** pnpm 10 through `corepack` (pnpm 12 does not run under this machine's corepack). Engine packages (`content`, `engine`, `bots`, `sim`) are **not** created yet. |
| Vite, React, TypeScript strict, Vitest, ESLint | **Done.** Versions and licences verified and recorded in `tooling-decisions.md`. Two were held back: Vitest 4 (Vitest 5 needs Node 22) and TypeScript 6 (`typescript-eslint` does not support 7). |
| Repoint `firebase.json` from `public/` to `apps/web/dist` | Hashed `js` and `css` keep the immutable cache header; `index.html` must not (the existing pattern already excludes it). Remove the placeholder `public/main.js` canvas demo. |
| Preview deploys | `pnpm deploy:preview` builds the preview build (which keeps the `/dev/*` pages; the production build strips them, checked) and runs `firebase hosting:channel:deploy review --expires 30d`. **Written but not yet run.** Production deploy stays manual (`pnpm deploy:release`). |
| Styling approach | **Decided by the owner:** CSS Modules for components, plus one global `theme.css` with a Material UI style palette, typography, gaps and the rest, read by the whole site. No UI framework. Recorded in `tooling-decisions.md` and `.cursor/rules/web-styling.mdc`. |
| Tiny hash router | **Done.** Routes `#/`, `#/dev/style`, `#/dev/gallery`, `#/dev/lab`. No router library. |

Exit: a page deploys to a preview URL from one command; `pnpm test`, `pnpm lint` and `pnpm typecheck` pass. (Local build, test, lint and typecheck pass; the preview URL and production hosting still await the first successful `deploy:preview` or `deploy:release`.)

---

## 5. Stage 1: look and feel (M to L)

Goal: you can judge, on screen, what the finished game will look like and feel like to operate. **No rules, no engine, no RNG, no saves.** Everything comes from fixtures.

### 5.0 Ground rules for this stage

1. **The view-model seam.** Define `GameView` and `Prompt`/`Decision` types in `apps/web/src/view/`. They follow the shapes in technical proposal sections 4.1, 4.4 and 4.6 (seats, ships, map with rotation, markets, public pool and cargo per `INF-1`, deck sizes but not order, one pending prompt). Components take view slices and a `decide(payload)` callback. **No component imports anything from an engine**, and there is no game logic in `apps/web` beyond layout and geometry.
2. **Fixtures are typed and hand-written** under `apps/web/src/fixtures/`. Card and tile numbers are copied from `content-data.md` and technical proposal appendices B and C (structural data only).
3. **The reconciliation cost is accepted.** `GameView` is authored before the engine, so Stage 2 will adjust it. Stage 2 re-homes the type to the engine's `viewFor` output and makes every fixture type-check against it. That is a planned small cost, paid to get the look early.
4. **Desktop only** (`design-decisions.md` section 1). Design at 1440 by 900 and 1920 by 1080, check up to 2560 by 1440. No mobile, no touch layout.
5. **Placeholder art, except what the owner supplies.** Procedural SVG glyphs and CSS for ships and seats; the owner's action icons and resource tokens replace the placeholders for those. Real card art is referenced by card ID later and never required (`technical-proposal.md` section 8).
6. **Vocabulary** (`TRM-1`): the UI says globalRound, combatRound, turn. No bare "round".

### 5.1 Sub-stage 1a: style direction (S) (built, **Holo tactical chosen**)

Built `/dev/style`: a single page of design tokens. It first offered three switchable themes so the direction could be picked by looking rather than by reading. **The owner chose Holo tactical; Frontier industrial and Star chart, the theme switcher and their fonts have been deleted.**

| Token family | Contents |
|---|---|
| Direction (chosen) | **Holo tactical**: dark, thin cyan linework, glass panels. (The other two candidates, Frontier industrial and Star chart, were dropped.) |
| Colour | Background layers, panel surfaces, text, borders; four **resource colours** (TC, H3, PC, QP) plus a VM accent; four **seat colours** (the owner's: **yellow, white, red and blue**; the old PDF used Red, Green, Yellow, Purple; the colour-to-slot order red, blue, yellow, white is confirmed by the owner); three **faction colours** (Iron Syndicate, Prism, Hive); state colours (ready, exhausted, locked, pinned, danger). |
| Colour accessibility | Seats and resources must also differ by **shape or pattern**, not colour alone. Checked in this sub-stage, not retrofitted. |
| Type | One display face, one text face, one numeric face: **Orbitron, Rajdhani and Share Tech Mono**, self-hosted (offline play, `IndexedDB` local-first). |
| Scale | Spacing, radii, borders, elevation, panel chrome, icon grid. |
| Motion principles | A short list of durations and easings (tile flip, card move, dice, UI feedback) and a global speed multiplier, which the animation director will later own (`technical-proposal.md` section 6). |
| Sound mood | A one-line brief only. Audio itself is Stage 6. |

**As built.** `apps/web/src/theme/theme.css` is the global theme file, with the tokens above as CSS custom properties named after the Material UI theme (`--palette-primary-main`, `--palette-grey-500`, `--palette-text-secondary`, `--palette-background-paper`, `--palette-action-hover`), plus `--spacing-*` and `--gap-*`, `--shape-*`, `--shadow-*`, `--transitions-*`, `--motion-*`, `--z-index-*` and the `--game-*` tokens (including `--game-state-hover` for hex pointer-over). There is one theme in that file; `theme.test.ts` fails if any `var()` uses an undefined variable. `#/dev/style` shows the palette (with resolved hex), game colours, the owner's action icons and resource tokens, typography, controls, spacing, shape, elevation, motion (with a speed multiplier and a tile flip), a **vision simulator** (protanopia, deuteranopia, tritanopia, greyscale) and **Specimen: the table** (`SpecimenBoard`): a 2-seat `MAP-1` disc from appendices B/C, alternating face-down hexes, fixture-backed planets and Anomalies with bundled owner art, two Outer Rim Nexuses and the Central Nexus, connected gates, and two pinned rival ships on one hex. One planet is shown **selected**; every hex on the specimen board uses **interactive** hover on the rim. Side panels (commander, rival, turn, decks, ship, hand cards, prompt dock) are layout mocks using the same Panel/Button/Card shells. The reusable parts built here (hex geometry and tiles, resource cubes, seat marks, action tokens, panel, button, typography, `SpaceBackdrop`) carry into 1b and 1c.

Exit: **met** for direction (Holo tactical chosen; other themes deleted). Still being refined with the owner: Holo palette tweaks, specimen layout, and any remaining token or component polish before 1f sign-off.

### 5.2 Sub-stage 1b: component kit gallery (M)

Build `/dev/gallery`: every visual object in the game, in every state, from fixtures. This is also the "countable UI backlog" the technical proposal asks for.

**As built (slices 1–2).** Owner art under `apps/web/src/assets/tiles/` (planets, Nexus, anomalies; see each folder's README for slug rules). `HexTileDetailPreview` / `TileScalesFigure` show board scale (`hexTileSizeGalleryBoard`) and inspector scale (`hexTileSizeDetail`) together. Fallback procedural art remains when a file is missing. `CardsSection` uses `fixtures/cards.ts` and extended `ComponentCard` plus `CrewCard`, `MissionCard`, `EnemyCard`, `ShipCard`, and `ReferenceCard`. Gallery pending sections (Zones, Dice, Prompts, Chrome) stay stubbed in the nav until slice 3.

| Group | Items |
|---|---|
| Resources and markers | TC, H3, PC, QP cubes; VM marker; damage cube; locked-area cubes on supply and demand; Swarm Larva token; first-player token |
| Action tokens | Move, Trade, Interact, Tactical, each ready and exhausted; **officer tokens bound to a ship** (`ACT-1`) shown distinctly from the general fleet tokens |
| Tiles | Face-down; Central Nexus (six gates); Outer Rim Nexus with gates derived from position (`MAP-5`); a planet from each group with supply and demand numbers; all 21 Anomaly tiles with printed gates, discovery bonus (top), and **Interact vs passive** marker (bottom); gates drawn so rotation and a **half connection** are obvious (`MAP-5`). *(No separate chokepoint or dense-terrain art: two-gate tiles read from the gates alone.)* |
| Ships | Corvette token in four seat colours; damage shown as cubes against hull; pinned marker; selected and hovered |
| Cards | Component cards (all four sector types, 1, half and 2 slot sizes, weapon dice, defence, unique), common technologies, crew Ensign (the four plain ones), mission card (in progress, complete), enemy card (Skiff, Enforcer, Goliath) with its reward stack, ship card with 4 slots in halves (`SLT-1`) plus crew, cargo and hull, reference cards |
| Zones | Sector markets (3 face-up plus deck pile, refilling), crew market (4), mission market (4), discard pile, deck pile with size but not order |
| Dice | Faces 1 to 6; resting, thrown, hit, miss, rerolled; natural 6 and natural 1 treatments |
| Prompt kinds (mocks) | See list below |
| Chrome | Phase banner, VM tracker per seat, turn indicator, pass button, undo button (with its locked state, `UX-2`), speed and skip controls, combat log row types |

**Prompt kinds to mock** (each is a prompt-host component the engine will later target, technical proposal section 6):

1. Choose an action (Move, Trade, Interact kind, Tactical kind, Repair, free action, Pass)
2. Yes or no reaction (Decoy Launcher, Interceptor Rig, Temporal Echo, Repulsor Grid) with its cost and the **3-for-1 exchange** offered only when the exact resource is missing
3. Pick one of N (card, market card, mission, crew, enemy target)
4. Pick a hex (move destination, retreat destination, Nexus Hop destination, new ship placement `REC-1`)
5. **Orient a revealed tile** (legal rotations only, `MAP-6` and `MAP-7`)
6. Damage choice: take cubes or discard which component (`LOT-3`), with the overflow rule hiding the cube option
7. Assign dice among targets
8. Choose two dice to reroll
9. Pay a cost, with the 3-for-1 exchange
10. Choose resources of choice (Spoils `LOT-2`, Black Market swap, Commerce Guild)
11. Order simultaneous effects (`CMB-10`)
12. Declare retreat (sequential, sees earlier declarations, `CMB-6`)
13. Fit or make room: discard an installed component, crew or cargo (`LOT-5`)
14. Confirm or abandon

Exit: the gallery renders everything above in the chosen theme, with no layout bugs at 1440 by 900 and 1920 by 1080, and every card is legible at **hand size** and at **inspect zoom**.

### 5.3 Sub-stage 1c: the table (L)

Build `/`: the full play screen from a fixture, with a real **camera** (pan and zoom) as the single source of truth for world coordinates (`technical-proposal.md` section 6, so a later Pixi layer reads the same camera).

| Region | Contents | Notes |
|---|---|---|
| Board (centre) | Pointy-top hex map, SVG, camera-driven | 2-seat and 4-seat layouts from Appendix A; the 3-seat board is shown in **several candidate staggers** (see below) |
| Top bar | globalRound, phase and step, first-player token, whose turn, every seat's VM and completed missions (public, no extra warning, section "Game end") | |
| Rival strips | One per bot: colour, VM, pool and cargo (public, `INF-1`), fleet summary, tokens ready or passed | Collapsible |
| Player mat (bottom) | **Pool** and **cargo** drawn as two clearly different stores, action tokens, held missions (cap 3), set-aside reward cards | Resolves `design-decisions.md` section 9 item 4, "how the interface shows the two stores" |
| Fleet panel | Ship cards for the selected fleet with slots in halves, hull cubes, crew | |
| Markets drawer | Four sector markets (with the start Nexus's markets highlighted, `MAP-3`, `MAP-4`), crew, missions | Opens when a ship is at a Nexus |
| Inspector | Hover or select any card, tile or ship for a zoomed view, with the ruling text that applies | |
| Log | Combat and event log rows grouped by cause | |
| Prompt host | The pending prompt, docked so it never hides the board region it asks about | |

Two deferred decisions get answered here, by looking:

- **`Q18`, the 3-seat board stagger**, deferred "until the UI can render the board". Render two or three plausible staggers of rows 1, 2, 4 and 5 and pick one. This produces a ruling update to `MAP-1` and Appendix A.
- **`Q1`, the layouts read from images.** Seeing all three boards rendered, with the start Nexus positions and the "every start Nexus is equidistant from the centre" property drawn, is the cheapest check against transcription errors.

Exit: a 4-seat board fits the screen at default zoom at 1440 by 900 without feeling cramped (or pans comfortably); you can tell in about two seconds whose turn it is, which phase, and what a prompt is asking.

### 5.4 Sub-stage 1d: scenario switcher (S to M)

A dev toolbar on `/` that swaps the fixture. This is what lets you see the game "without the actual game in place".

| Scenario | Shows |
|---|---|
| `setup2Seat`, `setup4Seat` | Fresh boards, everything face-down, start Nexus tiles |
| `midGame2Seat` | Revealed tiles with chosen rotations, locked cubes, cargo and pool, upgrades installed |
| `blockade` | An opposing ship on the Central Nexus, pinned markers, blocked actions greyed |
| `tileOrientation` | The orientation prompt after a flip, with the legal rotations previewed |
| `damageChoice` | The cubes-or-component prompt, including a forced-overflow case |
| `reactionWindow` | A Decoy Launcher reaction with the 3-for-1 exchange offered |
| `payment3for1` | A purchase short by one resource |
| `botTurnPlayback` | A bot action banner, one action at a time (`design-decisions.md` section 2) |
| `maintenanceStep` | The ten-step Maintenance list with the current step lit |
| `combatInProgress` | A multi-ship free-for-all with initiative groups and the log |
| `gameOver` | Third VM taken, immediate end |
| `stranded` | The soft-lock "stranded" condition banner (`CON-1`) |

Exit: each scenario loads from the toolbar and looks right. You can screenshot any of them.

### 5.5 Sub-stage 1e: motion lab (M)

Build `/dev/lab`: buttons that fire each animation family against fixtures, behind an **effects renderer interface** and an **animation director** shell, so the later wiring is not a redesign. The effects are DOM, CSS, SVG and Motion (Pixi stays deferred, `tooling-decisions.md` section 3).

| Family | Examples | Layer |
|---|---|---|
| Tile | Flip with perspective, orient preview, hover | DOM (CSS 3D) |
| Card | Turn over, move between zones (market to ship, deck to market, ship to discard) | DOM (Motion layout) |
| Dice | Throw of 6 or more dice landing on a **predetermined** result, reroll of selected dice | DOM (CSS 3D or 2D sprites) |
| Combat | Beam from hex A to hex B, missile, shield ripple, hit flash, destruction | SVG and CSS |
| Camera | Pan and zoom to a hex, shake on a heavy hit | Camera store |
| UI | Token exhaust, resource moving cargo to pool, VM gained | DOM |

This is the technical proposal's **dice spike**, widened. Its pass or fail test is the one the proposal already states: six or more dice landing on predetermined results while a card moves between zones and the board pans. **Proposed target (not yet measured): no visible stutter, about 55 frames per second or better on your machine, no long tasks over 50 ms during the throw.** If it fails, that is the signal to revisit the Pixi deferral, and you will know before any engine exists.

Also here: the **director contract** stub (one promise-returning handler per event type, speed multiplier, skip). The handlers take fake events. In Stage 6 they take real ones.

### 5.6 Sub-stage 1f: sign-off (S)

| Task | Output |
|---|---|
| Deploy the preview build to a Firebase preview channel | A URL you open on your own screen |
| Walk the checklist below | A short list of changes, done, then re-deployed |
| Delete the rejected themes and dead fixtures | A clean base |
| Record decisions | `docs/ui-style-guide.md` (tokens, type, colour, motion, component rules) and a new section in `design-decisions.md` with stable IDs (proposed prefix `VIS-`), plus the `Q18` ruling in `MAP-1` and the cargo-versus-pool display ruling. Mirror per `docs-editing.mdc`. |

**Sign-off checklist**

- Whose turn, which phase, and every seat's VM are readable in about two seconds
- Pool and cargo cannot be confused, and a first-time viewer can tell which one is spendable
- Four seat colours and three faction colours stay distinguishable without colour (shape or pattern secondary)
- Hex gates are legible at default zoom, rotation is unmistakable, and half connections read as half
- Cards are legible at hand size and at inspect zoom; a dense component card does not overflow
- A 4-seat board is comfortable at 1440 by 900
- Each prompt kind is understandable without a manual, and the 3-for-1 exchange appears only when it applies
- The motion lab meets its target, and speed and skip feel right
- The look still holds with rival strips collapsed and expanded

**Stage 1 exit:** you have signed off the look; `ui-style-guide.md` exists; the preview URL is current. **Engine work does not start until you say so.**

---

## 6. Stage 2: engine foundations and content data (M)

Technical proposal P0, minus the visual spike (now Stage 1e). Introduces the engine packages and their purity boundary.

| Task | Notes |
|---|---|
| Add `packages/content`, `engine`, `bots`, `sim` | Dependencies point one way only (technical proposal section 2) |
| **ENF-1 lint with canary tests** | `no-restricted-globals`, `no-restricted-properties`, `no-restricted-syntax`, import boundary, no-DOM `tsconfig`; a canary file containing each banned call must fail lint |
| Canonical serialiser, seeded RNG with named streams (`game`, `bot`) | sfc32 or PCG, owned; tests that key order and `undefined` never change a hash |
| Content package | Zod schemas; tile and planet data from appendices B and C; board layouts from Appendix A (with the `Q18` result from Stage 1c); the slice cards and enemies from `content-data.md`; the verification checklist in `content-data.md` section 5 as tests; the layout test that every start Nexus is equidistant from the centre (`Q1`) |
| State, events, reducer | Events are the only way state changes (technical proposal section 4.3); events carry `revealsHidden` and `usesRandomness` flags |
| Resolution-stack driver, prompts, `viewFor`, runner, scenario harness | The resumable stack is the part to prototype first (section 4.4) |
| **Hard-card fixtures** | Interceptor Rig, Mercenary Uplink, Temporal Echo, Self-destruct Protocol, Beam Projector, run as engine-only fixtures to prove the hook families |
| **Reconcile the seam** | Move `GameView` to the engine's `viewFor` output type; every Stage 1 fixture must type-check against it; fix what breaks |
| Gallery now reads real content | Every slice card renders from `packages/content`; the slice coverage test asserts each card has registered effects |

Exit: a scripted two-seat toy game replays byte for byte; the hard-card fixtures pass; the gallery renders the slice from real data; lint canary is green.

---

## 7. Stage 3: economy simulation, the go/no-go gate (M)

Technical proposal P1, first task. **Do this before building the playable game**, because the largest unknown is whether a game can be won in a sane number of globalRounds, not combat.

| Task | Notes |
|---|---|
| Map from setup data, Move, Trade, Interact, Pass | No combat, no enemies, no Anomaly effects beyond the discovery bonus |
| Cargo versus pool, markets and the 3-for-1 exchange, Commission, Redeem, upgrades, Nexus Hop (`NEX-1`) | |
| Crude bot (random legal plus redeem priority) | |
| `packages/sim` headless runner, thousands of seeded games | Abort at 200 globalRounds and record "stalled" (`GEN-1`) |
| Run with and without the four-Ensign crew set | Tests whether the single general Interact token per globalRound is a bottleneck (`ACT-1`, `design-decisions.md` section 9 item 11) |

**Needs from you before it can finish:** a target for median game length and acceptable stall rate. Without one the gate cannot pass or fail. The result may change content numbers (`content-data.md` section 6), so keep the tables tunable.

Exit: median length and stall rate reported and accepted by you.

---

## 8. Stage 4: playable economy game (L)

Technical proposal P1 remainder. The Stage 1 components are now wired to the real engine through `viewFor`. Ugly-but-correct is no longer the goal, because the look already exists; the goal is correctness.

| Sub-stage | Adds | Check |
|---|---|---|
| 4a Map and movement | Board from real state, Move, `reachableHexes`, tile flip, **orientation prompt** (`MAP-6`, `MAP-7`), camera | Scenario tests citing `MAP-5` to `MAP-9` |
| 4b Trade and pool | Harvest and fulfil with cube locks, Pass and the Central Nexus supply, Market Shift | Cargo cannot be spent (type-level), invariants |
| 4c Nexus actions | Upgrade (markets, deck draw, `DCK-1`, `DCK-2`), Commission, Recruit, Build, Nexus Hop, Fit and make-room prompts | `SLT-1` slot tests |
| 4d Missions and victory | Mission tracker as an event consumer, the 27-card slice deck, Redeem, VM, immediate game end | Each mission with a scenario test |
| 4e Maintenance, bot, save | Ten-step Maintenance pipeline, crude bot, IndexedDB local save with **commit-point saves** (`SAV-2`), undo with its lock (`UX-1`, `UX-2`) | Replay test, reload-at-commit-point test |

Exit: **human versus crude bot plays a whole game to a VM win in the browser.** The random-legal-play invariant soak is green (technical proposal section 10).

---

## 9. Stage 5: exploration and combat (L)

Technical proposal P2, your stated first game milestone: map, actions, trading, upgrades, missions and combat against one bot.

| Sub-stage | Adds |
|---|---|
| 5a Anomalies and enemies | The 21 tiles' passive and Interact effects, enemy deck (Iron Syndicate only), discovery bonuses, reward cards on the hex (`RWD-1`, `DCK-3`, `DCK-4`) |
| 5b Combat core | One weapon, dice, to-hit, damage events, the cubes-or-component choice, destruction, loot (`LOT-1` to `LOT-5`) |
| 5c Multi-ship free-for-all | Initiative groups and recomputed initiative (`CMB-1`, `CMB-3`), `isOpposing`, retreat (`CMB-6`), Evade, Spoils, the 100-combatRound guard (`CMB-4`) |
| 5d Slice components, then the rest of the pipeline | Slice cards first; the full attack pipeline (`CMB-8` to `CMB-11`) and reaction windows; Beam Projector |
| 5e Maintenance combat | Snapshot of sectors, ordered resolution, spawned-token persistence (`CMB-7`) |
| 5f Bot gets a plain strength heuristic and Evade-when-pinned | |

**Open items to settle first** (`design-decisions.md` section 12): enemy target selection in free-for-all combat, explore on an occupied hex, deck-knowledge invalidation. A placeholder is acceptable and must be logged.

Exit: a full game against one bot, with combat, in the browser; bot-soak runs have no `CombatStalemate` events.

---

## 10. Stages 6 to 9, in brief

| Stage | Plan |
|---|---|
| 6 Presentation wiring (M) | Feed real redacted events to the Stage 1e director. Tile flips, card moves, dice and combat effects on real data. Add audio (Howler). Card art hooks. The design is already signed off, so this is wiring and polish. |
| 7 Cloud saves (S to M) | Firebase Auth (Google), Firestore snapshots plus decision log, `IndexedDB` fallback, schema migrations including in-flight stack frames, game summary at end. |
| 8 Bot v2 and tuning (L) | 1 to 3 bots, route-scored trading, tile ability scores, Monte Carlo strength check in a Web Worker, blockade logic, tournament harness. You set target numbers. |
| 9 Content expansion (M per batch) | More components, tiles, factions, missions through the effect language, one slice at a time, each gated by the coverage test. |

---

## 11. Cross-cutting rules

- **Docs stay in sync.** Any ruling change follows `docs-editing.mdc`: search for stale text, put the ruling in `design-decisions.md` with a stable ID, mirror it where needed.
- **Cite ruling IDs** in code comments, tests and fixtures from Stage 2 on.
- **Review on a URL every stage.** Each stage ends with a preview-channel deploy.
- **Tests per stage.** Stage 1: type-check and a small snapshot or smoke test only (no Playwright, deferred). Stage 2 on: Vitest as in technical proposal section 10.
- **The reference tool stays read-only.** `card-sheet-tool` is only a reference for visual starting points (its Rajdhani font, its card, hex and token renderers, and four Ensign images in `public/assets`). Copy, never edit, and **confirm the Ensign images are yours to reuse** before relying on them.

## 12. Risks to this plan

| Risk | Mitigation |
|---|---|
| `GameView` guessed before the engine is wrong in places | Accepted and bounded: reconciled in Stage 2 by type-checking every fixture. Keep it a plain data shape, no logic. |
| Stage 1 balloons (art direction has no natural end) | Fixed exit checklist (5.6); placeholder art only; three themes at most, then one. |
| The DOM effects look too plain | Found in Stage 1e, not after the engine exists. Pixi stays an additive second implementation of the effects interface. |
| Dense cards overflow at hand size | Gallery tests every card at both sizes in 1b; the slice coverage test in Stage 2 keeps new cards honest. |
| Pace unknown until Stage 3 | The sim gate is explicit; content tables stay tunable. |
| The 3-seat layout is still provisional | Settled in 1c by choosing from rendered candidates. |

## 13. Decisions

**Settled by the owner**

1. **Art direction.** **Holo tactical**, with changes the owner is supplying piece by piece. Owner-supplied art so far: the four action icons (Move, Trade, Interact, Tactical) and the five resource tokens (TC silver square, H3 green circle, PC red triangle, QP blue diamond, VM purple star). Trade, Interact and Tactical are general (faction) tokens; only Move belongs to a ship (`ACT-1`). The look is steered by three owner-supplied reference screenshots (space backdrop, lit tiles, glowing-rim cards, big End Turn button); they show the mood, not the features. **The owner has a lot of further art (backdrops, planets, ships, card art, portraits) and will supply it later.** Until then the procedural placeholders stay: `SpaceBackdrop`, the lit spheres and nebulae in `HexTile`, the card art windows in `ComponentCard`, and the commander portrait. Each is a single swap point, so real art replaces it without touching layout.
2. **Look-and-feel rulings (owner, answered in turn).** (a) **Table backdrop:** the violet and teal nebula (`violet.webp`, 2752×1536); the orange, blue and magenta one (`nebula.webp`, 2560×1440) is kept for a menu or title screen. (b) **Seat colours by slot:** seat 1 red, 2 blue, 3 yellow, 4 white (confirmed; no longer *(assumed)*). (c) **Move** stays green inside the green ready ring. (d) **Tokens:** all four action tokens share one round shape; where they sit (faction bar or ship panel) tells general from ship tokens. (e) **Seat red and blue** stay as they are against the PC and QP art; shape already separates them. (f) **VM star** is lightened and given a thin pale outline on dark surfaces (`--game-vm-filter`). These are proposed `VIS-` rulings, to be written into `design-decisions.md` at 1f.
3. **Styling:** CSS Modules for components, with a single global `theme.css` (Material UI style palette, typography, gaps and the rest) used by the whole site.
4. **Preview builds** include the `/dev/*` pages and are viewable on a URL in a browser. Production builds strip them.

**Still open**

4. **Fonts:** self-hosted from Fontsource (done): Orbitron, Rajdhani and Share Tech Mono, following the Holo tactical choice.
5. **Stage 3 target:** what median game length (in globalRounds) and what stall rate would you call acceptable? Not needed until Stage 3.
6. **Sequencing:** Stage 1 before the engine, as proposed. If you would rather interleave (for example start Stage 2 content data in parallel), say so.
