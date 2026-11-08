# Void Matter Online: content data (PROPOSED, owner review needed)

Status: **draft**. This file fills the content gaps found in the second review (which cards are in which asset deck, how many copies, enemy deck sizes and the first content slice). Rules live in `design-decisions.md`; this file only holds numbers and lists. Every table here is a **proposal** that the owner may overwrite; entries marked *(placeholder)* are tunable by simulation and have no source in V5.

How to use: the game data files (`content/*.ts` or JSON) are generated from, or checked against, these tables. When a number changes here, change it in the data files in the same commit.

## 1. Sector decks (asset market assignment)

Four asset decks, one per sector and market (`MAP-4`, `DCK-3`): **S1 = Weapons / Offensive (PC), S2 = Propulsion / Utility (H3), S3 = Cargo / Life Support (QP), S4 = Hull / Defensive (TC).** The tile discovery bonus resources map to these (PC to S1, H3 to S2, QP to S3, TC to S4).

Totals of this proposal: **76 cards across 53 card types.**

### S1 Weapons / Offensive (29 cards, 23 types)

| Card | Copies | Kind |
|---|---|---|
| Minigun | 2 | uncommon |
| Side-Mounted Laser | 2 | uncommon |
| Pneumatic Ram-Loader | 2 | uncommon |
| Mass Targeting Array | 2 | uncommon |
| Energy Focus Lens | 2 | uncommon |
| AI Guidance Suite | 2 | uncommon |
| Drone Hangar | 1 | unique |
| Void-Core Overdrive | 1 | unique |
| AI-Targeting Turrets | 1 | unique |
| Heavy Plasma Cannon | 1 | weapon |
| Disrupter Lance | 1 | weapon |
| Thermal Pyre | 1 | weapon |
| Beam Projector | 1 | weapon |
| Gauss | 1 | weapon |
| Railgun | 1 | weapon |
| Apocalypse | 1 | weapon |
| Compressor | 1 | weapon |
| Flak | 1 | weapon |
| Swarm Micro-Missile Pod | 1 | weapon |
| Torpedo Bay | 1 | weapon |
| Concussion | 1 | weapon |
| Nanite Swarm | 1 | weapon |
| Interceptor Rig | 1 | weapon |

### S2 Propulsion / Utility (9 cards, 9 types)

Impulse Thrusters, Temporal Echo, Gravitic Anchor, Scavenger Drones, Stealth Field, Magnetic Grapple, Security Credentials, Cloaked Slip Drive, Nested Overdrive: **1 copy each.** This deck is thin (see section 6).

### S3 Cargo / Life Support (16 cards, 9 types)

| Card | Copies |
|---|---|
| Compact Storage | 4 |
| Expanded Cargo Bay | 4 |
| Bulk Storage | 2 |
| Subspace Relay | 1 |
| Data Siphon | 1 |
| Luxury Quarters | 1 |
| Habitation Block | 1 |
| Smuggler's Hold | 1 |
| Mercenary Uplink | 1 |

### S4 Hull / Defensive (22 cards, 12 types)

| Card | Copies |
|---|---|
| Nano Bonding | 4 |
| Magnetic Shields | 2 |
| Energy Shields | 2 |
| Thermal Sinks | 2 |
| Inertial Dampener | 2 |
| Reactive Plating | 2 |
| Pulse Defense Grid | 2 |
| Decoy Launcher | 2 |
| Diamond Hull | 1 |
| Nano Repair Bots | 1 |
| Self-destruct Protocol | 1 |
| Magnetic Repulsor Grid | 1 |

### Common technologies (not in any deck)

Always available at an upgrade for their printed cost (V5): **Hull Plating, Warp Drive Mk I, Laser Cannon, Cargo Containers, Crew Quarters.** Each takes 1 slot (`SLT-1`).

Slot sizes of the other cards (half-slot items and so on) come from the V5 component tables; capacity is counted in halves (`SLT-1`).

## 2. First content slice

Purpose: a small, fully playable game to prove the engine, the bot and the simulation before the full content is built. Everything outside this list is **not loaded** in the slice.

| Area | Contents |
|---|---|
| Common technologies | all five |
| S1 deck | Minigun, Side-Mounted Laser, Mass Targeting Array, Energy Focus Lens (2 copies each), Heavy Plasma Cannon, Disrupter Lance (1 each) = 10 cards |
| S2 deck | Impulse Thrusters, Nested Overdrive (1 each) = 2 cards |
| S3 deck | Compact Storage, Expanded Cargo Bay (4 copies each) = 8 cards |
| S4 deck | Nano Bonding (4), Magnetic Shields, Energy Shields, Thermal Sinks, Reactive Plating (2 each) = 12 cards |
| Enemies | **Iron Syndicate only** (Skiff, Enforcer, Goliath), see section 3 |
| Anomaly tiles | all 21 are loaded under their normal rules. **Tile 20 (Personnel Transporter) does nothing without crew**, so it is inert in the slice. *(Check the other tiles for dependencies on unloaded content when the data files are written.)* |
| Crew | the four plain Ensigns (Pilot, Merchant, Tactical, Scout), section 2a. The Recruit action is enabled. Other Ensigns and all Commanders are not loaded (costs pending). |
| Missions | the 27-card filtered deck, section 4 |
| Bots | the bot design in `design-decisions.md` section 11 (a Monte Carlo strength check against the real engine) |

### 2a. Crew in the slice (`ACT-1`)

Each crew member brings one action token, usable only on its own ship. Costs are the owner's (each totals 3 resources). Luxury Quarters and Free-Trade Logistics Hub reductions apply as usual.

| Crew | Cost | Action token |
|---|---|---|
| Pilot | 3 H3 | Move |
| Merchant | 1 H3 + 2 QP | Trade |
| Tactical | 3 PC | Tactical |
| Scout | 1 PC + 2 QP | Interact |

Crew deck size is **not specified**; placeholder: **4 copies of each (16 cards)**, with 4 face-up in the crew market (recruitment refills to 4, `DCK-2` reshuffles an empty deck). Crew capacity comes from the ship (the Corvette has 1 slot) and Crew Quarters, so Crew Quarters (a common technology) matters more in this slice.

The slice market decks have fewer cards than the full game, so S2 holds only 2 cards; reshuffle (`DCK-2`) keeps the market full.

## 3. Enemy decks (placeholders, tunable by simulation)

V5 gives the per-faction deck rule but the engine needs concrete numbers. These are **placeholders**.

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

- Deck totals: S1 29, S2 9, S3 16, S4 22 (full game); 10, 2, 8, 12 (slice).
- Every card name appears in exactly one sector deck or in the common list.
- Slice enemy deck sizes: 6 and 5.
- Mission slice size: 27, types 24.
- Crew slice: 4 types, 16 cards (placeholder counts).
- No card in the slice refers to unloaded content (Commander and special Ensign traits, Prism or Hive enemies).

## 6. Known weaknesses of this proposal

- **S2 is thin**: 9 cards, all single copies. In a 4-seat game, rewards from H3-bonus tiles and deck-draw buys would exhaust it quickly, which `DCK-2` turns into a reshuffle loop. Consider duplicating a few S2 cards.
- **S1 is large and S2 is small**, so PC-bonus tiles pay out far more variety than H3-bonus tiles. The price of the 3-resource deck draw is the same for all four markets.
- **Common technologies at 1 slot each** on a 4-slot Corvette leave little room for rewards and purchases, which is intended pressure but unverified.
- **Enemy deck sizes are guesses.** Run the economy simulation (`technical-proposal.md` section 11) before building combat and tune these counts.
