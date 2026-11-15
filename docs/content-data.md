# Void Matter Online: content data (PROPOSED, owner review needed)

Status: **draft**. This file fills the content gaps found in the second review (which cards are in which asset deck, how many copies, enemy deck sizes and the first content slice). Rules live in `design-decisions.md`; this file only holds numbers and lists. Every table here is a **proposal** that the owner may overwrite; entries marked *(placeholder)* are tunable by simulation and have no source in V5.

How to use: the game data files live in **`packages/content/data/*.json`** (validated by Zod). Keep this markdown in sync when slice totals or deck sizes change. When a number changes here, change it in the JSON in the same commit.

Hero illustrations live under **`apps/web/src/assets/cards/{s1|s2|s3|s4}/fronts/art/`** (one folder per market in section 1). Slug rules: `assetCardArt.ts` in the web app.

## 1. Sector decks (asset market assignment)

Four asset decks, one per sector and market (`MAP-4`, `DCK-3`): **S1 = Weapons / Offensive (PC), S2 = Propulsion / Utility (H3), S3 = Cargo / Life Support (QP), S4 = Hull / Defensive (TC).** The tile discovery bonus resources map to these (PC to S1, H3 to S2, QP to S3, TC to S4). **Every upgrade card belongs to exactly one of these decks** (no separate common list).

Totals of this proposal: **81 physical market cards** shuffled across S1–S4 below (**57 card types** in sector catalogues).

### S1 Weapons / Offensive (30 cards, 24 types)

The S1 market deck is **every type** in `s1-assets.json` (24 types). Six staples have **2 copies**; all other types have **1 copy** (30 cards total).

| Card | Copies | Kind |
|---|---|---|
| Minigun | 2 | weapon |
| Side-Mounted Laser | 2 | weapon |
| Mass Targeting Array | 2 | special |
| Energy Focus Lens | 2 | special |
| AI Guidance Suite | 2 | special |
| Laser Cannon | 2 | weapon |
| Ram-Loader | 1 | special |
| Drone Hangar | 1 | special |
| Void-Core Overdrive | 1 | special |
| AI-Targeting Turrets | 1 | special |
| Heavy Plasma Cannon | 1 | weapon |
| Disrupter Lance | 1 | weapon |
| Thermal Pyre | 1 | weapon |
| Beam Projector | 1 | weapon |
| Gauss Accelerator | 1 | weapon |
| Railgun | 1 | weapon |
| The Apocalypse | 1 | weapon |
| Compressor | 1 | weapon |
| Flak Scattergun | 1 | weapon |
| Micro-Missile Array | 1 | weapon |
| Torpedo Bay | 1 | weapon |
| Concussion | 1 | weapon |
| Nanite Swarm | 1 | weapon |
| Interceptor Rig | 1 | weapon |

Catalogue JSON holds **one row per type**; copy counts above are shuffled in `packages/content/data/decks/sector-markets.json` (`DCK-3`).

### S2 Propulsion / Utility (15 cards, 11 types)

| Card | Copies |
|---|---|
| Warp Drive Mk I | 5 |
| Impulse Thrusters | 1 |
| Temporal Echo | 1 |
| Gravitic Anchor | 1 |
| Stealth Field | 1 |
| Magnetic Grapple | 1 |
| Cloaked Slip Drive | 1 |
| Nested Overdrive | 1 |
| Nano Repair Bots | 1 |
| Subspace Relay | 1 |
| Self-destruct Protocol | 1 |

Catalogue JSON (`s2-assets.json`) holds **one row per type**; copy counts live in `data/decks/sector-markets.json`.

### S3 Cargo / Life Support (18 cards, 11 types)

The S3 market deck is **every type** below (11 types).

| Card | Copies |
|---|---|
| Compact Storage | 3 |
| Expanded Cargo Bay | 2 |
| Bulk Storage | 2 |
| Cargo Containers | 2 |
| Crew Quarters | 3 |
| Luxury Quarters | 1 |
| Security Credentials | 1 |
| Habitation Block | 1 |
| Smuggler's Hold | 1 |
| Data Siphon | 1 |
| Scavenger Drones | 1 |

Catalogue JSON holds **one row per type**; copy counts live in `data/decks/sector-markets.json`.

### S4 Hull / Defensive (18 cards, 11 types)

| Card | Copies |
|---|---|
| Nano Bonding | 4 |
| Magnetic Shields | 2 |
| Energy Shields | 1 |
| Thermal Sinks | 1 |
| Inertial Dampener | 2 |
| Reactive Plating | 1 |
| Pulse Defense Grid | 2 |
| Decoy Launcher | 1 |
| Hull Plating | 2 |
| Diamond Hull | 1 |
| Magnetic Repulsor Grid | 1 |

Slot sizes of the other cards (half-slot items and so on) come from the V5 component tables; capacity is counted in halves (`SLT-1`). Copy counts live in `data/decks/sector-markets.json`.

## 2. First content slice

Purpose: a small, fully playable game to prove the engine, the bot and the simulation before the full content is built. Everything outside this list is **not loaded** in the slice.

| Area | Contents |
|---|---|
| S1 deck | Full S1 market deck (§1): **30 cards**, **24 types** (six types × 2, remainder × 1) |
| S2 deck | Impulse Thrusters, Nested Overdrive (1 each) = 2 cards |
| S3 deck | Compact Storage ×3, Expanded Cargo Bay ×2 = 5 cards (`first-playable.json` `sectorMarketComposition.s3`) |
| S4 deck | Nano Bonding (4), Magnetic Shields (2), Energy Shields, Thermal Sinks, Reactive Plating (1 each) = 9 cards |
| Enemies | **Iron Syndicate only** (Skiff, Enforcer, Goliath), see section 3 |
| Anomaly tiles | all **22** are loaded under their normal rules (`TIL-2` reinstated tile 4). **Tile 20 (Personnel Transporter) does nothing without crew**, so it is inert in the slice. *(Check the other tiles for dependencies on unloaded content when the data files are written.)* |
| Crew | the four plain Ensigns (Pilot, Merchant, Tactical, Scout), section 2a. The Recruit action is enabled. Commander catalogue (`CRE-2`) is not loaded in the slice (scope only). |
| Missions | the 27-card filtered deck, section 4 |
| Bots | the bot design in `design-decisions.md` section 11 (a Monte Carlo strength check against the real engine) |

*Former V5 “always available at upgrade” staples (**Hull Plating, Warp Drive Mk I, Laser Cannon, Cargo Containers, Crew Quarters**) are now normal rows in S4, S2, S1, and S3 respectively; they are not loaded in this slice unless added here.*

### 2a. Crew in the slice (`ACT-1`)

Each crew member brings one action token, usable only on its own ship. Costs are the owner's (each totals 3 resources). Luxury Quarters and Free-Trade Logistics Hub reductions apply as usual.

| Crew | Cost | Action token |
|---|---|---|
| Pilot | 3 H3 | Move |
| Merchant | 1 H3 + 2 QP | Trade |
| Tactical | 3 PC | Tactical |
| Scout | 1 PC + 2 QP | Interact |

**Full game crew deck (`DCK-5`):** **4×** each Ensign + **1×** each Commander = **32** physical cards (`decks/crew-deck.json`). **Slice crew deck:** **4×** each of the four plain Ensigns only = **16** cards (`first-playable.json` `crewComposition`). The crew market shows **4** face-up cards; recruitment refills to 4 (`DCK-2` reshuffles an empty deck). Crew capacity comes from the ship (the Corvette has 1 slot) and **Crew Quarters** (S3 deck).

### 2b. Commander catalogue (not in slice, `CRE-2`)

Sixteen Commander rows in `packages/content/data/crew/commanders.json` (UI and full-game deck build). **Every named character is a Commander card**; Ensigns in `ensigns.json` are the four plain action-token types only. Each Commander recruit costs **5** resources total (splits below). They are **not** in `first-playable.json` `includedCrewIds`.

| Commander | Cost | Action token |
|---|---|---|
| Black Marketeer | 2 H3 + 2 QP + 1 TC | Trade |
| Bounty Hunter | 3 PC + 2 QP | Tactical |
| Comms Specialist | 2 QP + 2 PC + 1 H3 | Interact |
| Expert Marksman | 3 PC + 1 TC + 1 QP | Tactical |
| Logistics Officer | 2 H3 + 2 QP + 1 TC | Trade |
| Long-range Sensor Specialist | 2 QP + 2 PC + 1 H3 | Move |
| Piloting Ace | 3 H3 + 1 PC + 1 QP | Move |
| Profit-Chaser | 2 H3 + 2 QP + 1 PC | Trade |
| Quartermaster | 2 TC + 2 QP + 1 H3 | Interact |
| Salvage Expert | 2 TC + 2 PC + 1 H3 | Tactical |
| Shield Specialist | 3 PC + 2 TC | Tactical |
| Trade Expert | 3 H3 + 2 QP | Trade |
| Void Scout | 3 H3 + 2 QP | Move |
| Warp Engineer | 3 H3 + 2 QP | Move |
| Weapons Officer | 4 PC + 1 TC | Tactical |
| Xeno Scientist | 2 PC + 2 QP + 1 H3 | Interact |

The slice market decks have fewer cards than the full game, so S2 holds only 2 cards; reshuffle (`DCK-2`) keeps the market full.

## 3. Enemy decks (placeholders, tunable by simulation)

V5 gives the per-action deck rule but the engine needs concrete numbers. These are **placeholders**.

### Full game, per faction

| Deck | Contents |
|---|---|
| Level 1 (exploration) | 4 of each Tier-1 scout card (3 scouts per faction) = 12 cards |
| Reinforcement | 3 of each Tier-2 card (3 types) + 2 of each Tier-3 card (3 types) = 15 cards |

### Slice (Iron Syndicate only)

| Deck | Contents |
|---|---|
| Level 1 | Skiff x 6 |
| Reinforcement | Enforcer x 3, Goliath x 2 |

### Reward cards per defeated enemy (V5 level rule, confirm)

| Enemy level | Face-down reward cards placed |
|---|---|
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |

Reward cards are drawn from the markets matching the tile's discovery bonus (`DCK-3`).

## 4. Slice mission deck (27 cards, 24 types)

The full deck after removing the 7 PvP missions is 29 cards of 26 types. The slice removes **Prismatic Salvage, Hive Cleansing** (no Prism or Hive enemies in the slice), leaving **27 cards of 24 types** (`MSN-3`). All Aboard (2 or more crew on one ship) and Full Roster (3 different crew types across the fleet) stay because the four Ensigns cover Move, Trade, Tactical and Interact.

The bot's mission nudge groups (design-decisions section 11) become **Build/state: 8 cards, Combat: 6 cards**. The per-card lists come from the V5 mission table; whoever edits the data files keeps this file in sync.

## 5. Verification checklist for the data files

- Deck totals: S1 30, S2 15, S3 18, S4 18 (full game, `decks/sector-markets.json`); 30, 2, 5, 9 (slice, `first-playable.json`).
- Every card name appears in exactly one sector deck (S1–S4).
- Slice enemy deck sizes: 6 and 5.
- Mission slice size: 27, types 24.
- Crew: full game 20 types / 32 cards (`DCK-5`); slice 4 types / 16 cards (4× Ensign only).
- No card in the slice refers to unloaded content (Commander and special Ensign traits, Prism or Hive enemies).

## 6. Known weaknesses of this proposal

- **S2 variety vs volume**: most S2 types are single copies; **Warp Drive Mk I ×5** bulk is intentional. Other H3 rewards may still thin the deck quickly in a 4-seat game (`DCK-2` reshuffle).
- **S1 is large and S2 is small**, so PC-bonus tiles pay out far more variety than H3-bonus tiles. The price of the 3-resource deck draw is the same for all four markets.
- **Starter staples at 1 slot each** on a 4-slot Corvette leave little room for rewards and purchases, which is intended pressure but unverified.
- **Enemy deck sizes are guesses.** Run the economy simulation (`technical-proposal.md` section 11) before building combat and tune these counts.