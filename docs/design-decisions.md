# Void Matter Online: design decisions

Status: design discussion only. No implementation has started.
Source rules: **Void Matter Rulebook V5** (PDF provided by the owner).
Reference simulator: `card-sheet-tool` (read-only; see the project rule).

This document records decisions made in conversation, with the reasoning and the risks that were raised. Where it conflicts with `combat-reference.md`, **this document wins**. That file describes the simulator, and the simulator differs from V5 in places (see "Rulebook vs simulator").

---

## 1. Product

| Decision | Detail |
|---|---|
| Shape | Solo play against bot rivals. Not human multiplayer. |
| Bot count | Configurable, 1 to 3 (2 to 4 player boards). |
| Devices | Desktop browsers only. |
| First milestone | The core loop against **one** bot: map, actions, trading, upgrades, missions, combat. |
| First content slice | Common technologies plus a few uncommon ones, one enemy faction, simple missions. |
| Later | A competent AI. Only one hook is built now: a clean boundary between the rules and the source of decisions (human, simple bot or future AI all choose from the same list of legal choices). |

### Known risks accepted
- A full set of 1 to 3 bots with real behaviour is likely the most expensive part of the project and the one with the least gameplay payoff per unit of effort.
- The common-technologies slice does not stress the effect language (see section 5).

---

## 2. Bot rivals

| Topic | Decision |
|---|---|
| Actions | Move, trade, upgrade, explore, take and redeem missions. |
| Presence | Physical ships on the map, under the real rules. |
| Blocking | Accepted. A bot ship in a shared sector blocks **Interact, Repair and Move** for the ships there (a mutual pin, see "Movement and Evade"), but **never blocks Trade**. |
| Winning | **The bot can win** by taking its third VM (the game ends immediately, no ties). Redeeming a mission gives 1 VM, so the bot races you. |
| Starting fights | **The bot can initiate combat whenever its logic chooses** (revised: the earlier "never starts fights" rule was dropped when blockading the Nexus became designed counterplay). Reasons to attack are narrow: Spoils of War, dislodging a blockader, or destroying a ship. VM cannot be stolen. |
| Difficulty | **No difficulty setting in v1.** One tuned level. No target win rate or game length has been chosen yet ("see how it pans out"). Risk: without a target, a tuning change can't be judged as better or worse. Mitigation: have each game log how many rounds the bot needed to reach 3 VM, using the engine's event stream, so data exists when a target is chosen. |
| Decision method | Each turn is one action token. The bot picks its action from a **fixed priority list with some randomness**, so it doesn't play identically each game. The randomness uses the same **seeded** source as the dice, so any game is exactly replayable. |
| Attack trigger | Dislodge a blockader, plus opportunistic attacks when sharing a sector with a player ship and a simple strength comparison favours it. The strength comparison is the one piece of tactical evaluation the v1 bot needs, and it was later decided to be a **seeded Monte Carlo run of the real combat engine** (section 11), not a simple formula, so it is a significant piece of engineering. |
| Counterplay | The race to 3 VM is **not a pure race**. Counterplay is designed in: blockading the Central Nexus (Interact is blocked by opposing ships), destroying the bot's ships, and denying shared missions. The bot needs responses to each. |
| Being attacked | The bot is a full combatant: it fires back, makes damage choices and can retreat. |
| Shared enemy fights | **Free-for-all per V5.** In a sector with an enemy card, the player and bot are both engaged and can target each other. Spoils of War applies. |
| Exploration | The bot gets full discovery bonuses and enemy loot. Explored tiles are revealed publicly. |
| Missions | Real conditions, no timer shortcuts. |
| Mission deck | PvP missions (Asset Seizure x2, Privateer x4, Sabotage) are **removed for everyone**. |
| Presentation | Each bot action is shown, one at a time. |

### Raised and not fully resolved
- "Never initiates combat" but "fights in shared sectors" is an arbitrary line. Watch whether it feels wrong in play.
- With PvP missions removed, there is little reason to attack the bot outside shared enemy fights.
- An invulnerable-style blocking bot on the Central Nexus was a concern. The bot is now attackable, which gives counterplay. *(Resolved in section 11: when the human blockades the Nexus, the bot attacks if its Monte Carlo win rate passes a threshold, otherwise it prioritises upgrades. For a blocking bot, the human can attack it the same way.)*
- Each mission redeemed gives 1 VM. Real mission-completion behaviour is needed for roughly 26 remaining mission types.

---

## 3. Combat rules (V5 is authoritative)

- All ships and tokens in a sector on both sides are engaged. Fleets have up to 3 ships. One initiative list across all combatants. Full V5 multi-ship combat is in scope.
- **Damage events:** group all hits from one combatant's attack against one target. The owner chooses **once**: take cubes (1 per hit, hull upgrade slots first) **or** discard one component to negate the whole event. **No mixing.**
- **Overflow (house ruling):** a ship cannot choose cubes unless **every** hit in the event fits in its free slots. Otherwise it must discard a component. Enemies cannot discard components, so overflow destroys them.
- **Destruction:** only when a ship must resolve a hit with no free slots and no components left.
- **Spoils of War:** at most once per combat round, per damaged defending ship, per attacking player, and only when the defender chose cubes. Not per cube.
- **VM (changed from V5):** redeeming a mission puts 1 VM in the **faction resource pool**, not in a cargo hold. It is therefore never lost to damage or destruction, and cannot be taken by Spoils of War or any other means. VM is **never spendable**: it is not a payable resource, cannot be traded, and does not count as "any resource."
- **Win condition (revised):** **the game ends immediately when a player takes their third VM** (4 or 5 in longer games), not at the end of a round. Redeeming a mission is an action, so only one seat can take a VM at a time and **there can be no ties**. "Across your fleet" no longer applies. *(This replaces the earlier "3 VM in the pool at the end of a round".)*
- **Mission cap:** a player may hold at most 3 missions in total (4 or 5 in longer games), counting completed ones. Completed missions cannot be discarded. Uncompleted missions can be discarded when taking new ones. The cap therefore equals the VM target, so winning means completing every slot.
- **Retreat:** declared at the start of a round, resolved after damage using the evasion contest (d6 + speed per opposing combatant, one hit per failed contest, no Spoils).

### Interaction between decisions
- Single-choice events plus forced component discard on overflow make large salvos strongly component-destroying. This affects balance for every multi-die weapon and for Phase Lattice.

### Combat interactivity
The player makes every combat decision (retreat declaration, weapon targeting, damage choice, retreat attempt). Bot fights resolve automatically through the same decision points.

---

## 3a. Starting ship (Nomad-class Corvette)

The V5 rulebook text does not list the Corvette's stats (they are on the ship card). The owner stated:

| Stat | Value | Simulator |
|---|---|---|
| Cargo | 2 | 2 |
| Crew slots | 1 | 1 |
| Hull | 1 | 1 |
| Weapon | 1 energy weapon, 1 die, hits on 5+ | same |
| Speed | **2** | **1** (differs) |
| Upgrade slots | **4** | 4 |

**Early fragility is intended.** A bare Corvette (hull 1, no components) can be destroyed by its second hit. Players are meant to upgrade quickly and avoid fights early. The bot is subject to the same fragility, which means a bot that attacks too early can lose its only ship.

Consequences of speed 2: the player acts first against every speed-1 enemy (Iron Enforcer, Iron Goliath, Brood Reaper, Hive Mother) and ties with speed-2 enemies (Iron Skiff, Prism Star-Fortress). Warp Drive Mk I takes the ship to speed 3, tying the Swarm Larva and the Prism Templar.

---

## 4. Enemies (decided per card)

| Enemy | Decision | Source |
|---|---|---|
| Iron Enforcer | 2 weapons, 2 dice each, 4+ | V5 |
| Iron Goliath | 2 weapons, **4 dice each**, 5+ | V5 |
| Prism Spark | Player **energy weapons get -1 to hit** against it, plus +1 damage from kinetic and missile hits that scored at least 1 hit | V5 |
| Prism Star-Fortress | Phase Lattice caps hits **per weapon, per round** at 2 | Simulator |

Note: Spark's -1 to hit and Templar's -1 damage are different mechanisms. The engine must distinguish "modifies the attacker's roll" from "modifies the hits that land".

Other enemies are unchanged between sources (Iron Skiff, Prism Templar, Prism Star-Fortress's Absorber, the whole Hive faction), checked line by line against the simulator's `enemyShips.ts`. The Prism Spark in the simulator uses "Prismatic Refraction" instead of V5's "Prismatic Resistance", already ruled above. **Underworld Extortion** is ruled below and changes "cargo" to the pool.

---

### Iron Syndicate: Underworld Extortion (V5 ruled)
When an Iron Syndicate ship is destroyed (Skiff 1, Enforcer 2, Goliath 3), the **player who dealt the destroying damage event** (including Beam Projector kills and Self-destruct explosions) pays that many resources **from their Faction Resource Pool** (not cargo). The **paying player chooses** which (never VM) and they **return to the general supply**. If the pool has fewer, they **lose what they have** and the rest is waived. This is a cost of killing Syndicate ships and interacts with the Spoils and pool rules (the pool can be drained by this but not by Spoils).

## 5. Content and effects

- **Card data is the source of truth.** Cards are rendered from structured data. Artwork is only the picture.
- **Effects:** a complete effect language, designed in full before building, then implemented only for the first content slice.
- Roughly 55 components. About half are plain stats or simple modifiers. 25 to 30 are one-offs, many acting at unusual moments (out-of-turn reactions, on-destruction triggers, cross-sector attacks, rule rewrites).

### Mitigation for the risk of an unvalidated language
When designing the language, walk the hardest cards through it **on paper** even though they are not in the first release:
- Interceptor Drone Rig (out-of-turn reaction attack)
- Mercenary Uplink (rewrites who counts as an opponent)
- Temporal Echo (rerolls already-rolled dice)
- Self-destruct Protocol (triggers on destruction, rolls against other ships)
- Beam Projector (attacks an adjacent sector)

---

## 6. Technical direction (no implementation yet)

- **Persistence:** cloud saves with sign-in. The stated reason is a possible stepping stone to human multiplayer.
- **Engine location:** runs in the browser for v1, **written to be portable to a server** later. It must not depend on the screen, the clock or anything outside the game state.
- **Event stream:** the engine should produce a sequence of discrete events (moves, rolls, draws) rather than only final states. This serves animation, the combat log, replay and any future AI.
- **Save versioning:** rules will change (V5 vs simulator already differs), so saves need a versioning or "finish under starting rules" policy.

### Challenged, partly open
- Cloud accounts and server state for hypothetical multiplayer is speculative. Local autosave plus export would be cheaper. The owner chose cloud anyway.

---

## 7. Rulebook vs simulator

Case-by-case policy: the owner decides each discrepancy. Enemies are settled in section 4.

### Components (settled)

| Component | Ruling | Simulator differed by |
|---|---|---|
| Decoy Launcher | Spend **1 TC from the faction pool** to negate a missile or drone attack | spent 1 cargo of any type |
| Thermal Sinks | Spend **1 H3 from the faction pool**, remove up to 2 dice, **can reduce a weapon to zero dice** | spent 1 cargo, always -2, at least 1 die kept |
| Energy Shields | Each energy weapon's hits are reduced to at most **1, per weapon** | capped the total across the whole attack |
| Magnetic Shields, Inertial Dampener, Pulse Defense Grid | "Apply -1" means **-1 to the hit roll** for each die | removed 1 hit from the total after rolling |
| Pulse Defense Grid | **Included**: 1/2 slot, -1 to hit for missile and drone attacks | had no equivalent |
| Inertial Dampener | **1/2 slot** | 1 slot |
| Magnetic Grapple (redesigned) | When an enemy attempts an **Evade or a Retreat** in the Grapple's hex, the owner rolls a die. On a **5+**, the whole attempt is cancelled (no movement, no contest dice). **No once-per-turn limit.** One roll per attempt. | V5 said once per turn |
| Cloaked Slip Drive | +1 speed. Spend **1 QP from the faction pool** to automatically succeed at the tactical **Evade** action. **Does not apply to Retreat.** May evade through half-connected tiles. If the attempt is cancelled by a Magnetic Grapple, **the QP is not spent** (the Grapple rolls first, then the owner decides whether to pay). | simulator applied it to retreat and spent 1 cargo |
| Gravitic Anchor (redesigned) | Passive: a ship in the **same sector** as this component must pay **2 resources from its pool** (evader's choice of type, never VM) to use the tactical **Evade** action. The owner takes 1 of the resources paid and the other returns to the general supply. **Does not affect combat Retreat.** | V5 wording was "pay 2TC", with no payout to the owner |

### Weapons and unique technologies (settled)

**The simulator implements only part of the component list.** Its engine has logic for plain stats and dice, Apocalypse's double hits, Pneumatic Ram-Loader, Drone Hangar, Cloaked Slip Drive, the accuracy items and the defences. Most weapon passives and unique technologies exist only as card text with no behaviour behind them (Gauss, Rapid-Fire Railgun, Compressor Gun, Concussion Missiles, Torpedo cargo effect, Nanite Swarm, Interceptor Drone Rig, Thermal Pyre speed penalty, Beam Projector, Void-Core Overdrive, Auto-Loader Turrets, Temporal Echo, Self-destruct, Stealth Field, Scavenger Drones, Nano Repair Bots, Impulse Thrusters). The simulator is also missing Mercenary Uplink. For these, the rulebook wording is the starting point and each is a new ruling.

| Component | Ruling |
|---|---|
| Heavy Gauss Accelerator | If this weapon scores **exactly 1 hit** (judged per weapon, not per event), that hit is resolved as **its own separate damage event**, and the defender **cannot discard a component** for it: it must take a damage cube. If the target has no free hull slot, the ship is **destroyed**. The attacker's other hits remain a normal damage event. This is a deliberate exception to "one damage event per attacker per target." |
| Rapid-Fire Railgun | 5 dice, 4+. Additional **-1 to hit for each point of the target's current speed** (including temporary effects such as Impulse Thrusters and the Thermal Pyre penalty). A natural 6 still hits (the general dice rule). Effective only against slow targets. |
| Speed changes mid-round | **Initiative order is fixed at the start of the round.** Temporary speed changes affect only things that compare speed (Railgun penalty, Evade and Retreat contests). They expire at the end of the round and do not carry into the next round's initiative. |
| Impulse Thrusters | Spend **1 H3 from the pool** on the owner's **action turn** to add +1 speed to the ship. Once per **global round**. The boost **ends when Maintenance begins**, so it helps Move range, Evade rolls and Attack-initiated combat during the Action phase, but **not** Maintenance enemy combat. |
| Pneumatic Ram-Loader | 1/2 slot, up to 2 copies. Mass weapons gain +1 die and +1 to hit. If **any** mass attack die is a natural 1, the owner takes **1 damage once per attack action** (not per die). The simulator charged 1 per natural 1. |
| Concussive Compressor Gun | 4 dice, 5+. If it rolls **1 or more natural 1s**, the owner takes **1 damage once per firing of this weapon**. Each natural 6 hits for 2 damage. |
| Self-damage (general) | Counts as a damage event for the owner (cubes or component discard, owner's choice). Does not grant Spoils of War to anyone. |
| Torpedo Bay (simulator: Cluster Torpedo Battery) | 2 dice, 5+. On each hit, the attacker may spend **1 H3 from the faction pool** to make the target remove 1 resource from its cargo hold. **The target chooses which resource.** It returns to the general supply, and the attacker gains nothing. No effect on enemies (they have no cargo). Works even if the defender chose a component discard. |
| Nanite Swarm Drones | 2 dice, 5+. May exhaust ready action tokens for **+1 to hit per token**. Eligible tokens: the **general tokens** (Trade, Interact, Tactical) and **tokens belonging to this ship** (its Move token and any officer tokens on it). Gives **no bonus in Maintenance combat**, because everyone has passed and all tokens are exhausted. That is its trade-off. |
| Interceptor Drone Rig | Reaction: when attacked by a Mass Accelerator, Missile or Drone weapon, may make a 1 die, 5+ attack with this weapon. Timing: **after the attacker rolls, before damage is chosen and applied**, so a ship that would be destroyed still reacts. Triggers **once per qualifying weapon** that fires at the ship (two mass weapons give two reactions). Reaction attacks **cannot trigger further reactions** (no chains). A reaction is **free**: it doesn't use the weapon's normal shot, and firing normally doesn't prevent reacting. Target is the attacker. |
| Thermal Pyre Cannon | 2 dice, 4+. Any ship **damaged** by it has Speed -1 for the remainder of the round. This is a temporary speed change under the existing rule: initiative stays fixed at round start and the effect expires at end of round. *(Earlier I wrongly described it as a penalty on the firing ship.)* |
| Beam Projector | 1 die, 4+. Tactical attack action against an **opposing ship in an adjacent sector tile**, either a rival (player/bot) ship or an enemy faction ship. It is a **single one-sided shot**: no combat rounds, no return fire, no retreat. The target resolves it as a normal damage event (cube or component). **No Spoils of War** (Spoils belong to combat rounds). **One Beam Projector per Tactical action** even if the ship has several. If it destroys an enemy ship, the **shooter takes the killed enemy ship card** (usable for missions) but **does not get the reward cards**; those **stay on the hex and go to the next player to enter it** (the shooter included). The same applies **whenever enemy rewards end up with no claimant in the hex**. The race to enter is accepted as the trade-off for sniping. **Entering means ending a move in the hex** (passing through does not count), and set-aside cards have no limit (see "Enemy kills and reward cards"). A destroyed rival ship's **components go to the component discard pile** and its **cargo returns to the general supply**. |
| Flak-Burst Scattergun, Apocalypse Mass Driver, Disrupter Lance, Swarm Micro-Missile Pod | **Confirmed as written in V5.** Flak: 6 dice, hits only on natural 6 regardless of bonuses. Apocalypse: 5 dice, 6+, every hit counts as 2 hits (feeds the overflow rule and Energy Shields' max 1 hit as already decided). Disrupter Lance: 1 die, 3+. Swarm Pod: 5 dice, 6+. No other passives. |
| Temporal Echo | Once per **global round** (Action + Maintenance, not per combat round), after the owner rolls dice for any action, may reroll **all** those dice once. Scope: **any roll the owner makes for an action** (attacks, Evade, Retreat, Grapple, mission and exploration rolls). **Own rolls only**: cannot reroll dice rolled by someone else against you. The reroll **replaces** the original result entirely, so natural 1 self-damage (Ram-Loader, Compressor Gun) is judged on the new dice only. **General note: "once per round" in card text means the global round unless a card says "combat round".** |
| Subspace Relay | **Reworded:** once per global round, when this ship uses a Trade action, **one** other ship of the **same fleet** may also use a Trade action. The bonus trade is **free** (no Trade token spent) but the other ship **still needs a valid trade location where it is**. Only one other ship per Relay trigger. |
| Self-destruct Protocol | Reaction on this ship's destruction, **from any cause** (including its own self-damage): roll 4 combat dice, hit on 4+, **for each opposing ship in the same hex**. **Chain reactions allowed**: if an explosion destroys another ship with Self-destruct, that one explodes too. Hits resolve as a **normal damage event** on each target (target chooses cube or component), **no Spoils of War**. **No defences apply** (no shields, no to-hit penalties, flat 4+). *Note for the engine: the ship's own owner makes no choices, so this is automatic.* |
| Drone Hangar | On an attack action, spend 1 TC to deploy a Drone (one per Hangar). It gives **+1 to hit on all attack rolls of this ship's weapons** and is discarded when **combat ends** (the "rest of the round" wording is superseded). **One drone per Hangar** (a second deployment does nothing), but **multiple Hangars, or other components that add drones, stack**. **Deployment is only allowed when the owner initiates combat with a Tactical attack action.** In combats started by enemies in Maintenance or by rivals, the Hangar does nothing. This is accepted as a deliberate limit. A **Beam Projector shot counts**: spend 1 TC for +1 to its roll, and the drone is discarded immediately because that one-shot "combat" ends. |
| Stealth Field | Rival players/bots cannot initiate combat against this ship unless they also **exhaust an Interact token to locate it**. *(Ruled: exhausting the token is a **cost**, not an Interact action, so the opposing-ship restriction on Interact does not apply and a ship in the same hex can locate it. No Interact effect happens.)* The locate lasts **only for that one combat** the locator initiates. **Enemy faction ships are not affected** and attack it normally. A **Beam Projector cannot target it** (no way to locate from an adjacent sector, so untargetable from range). Once any combat starts in the hex, the stealthed ship is **engaged like everyone else** (whether started by a rival against another ship, or by an enemy in Maintenance). Stealth only stops it being picked as the target that starts combat. |
| Mercenary Uplink | **Not in the simulator.** On your own turn, as a **free action** (no token), pay any 2 resources from your pool (**to the general supply**, never VM) and select a rival player/bot (**not enemy faction ships**). Can be repeated for different opponents by paying again. For the rest of the **global round**, that opponent treats this ship as **"friendly" and not "opposing"** for every rule: movement is not blocked, neither can target the other, and **the blockade restriction ("cannot Interact in sectors containing opposing ships") no longer applies, so it effectively cancels a blockade, including at the Central Nexus**. If a third party starts combat in the hex, both ships are still engaged, but **neither can target the other and neither gets Spoils from the other**. |
| Void-Core Overdrive | Per weapon, **per combat round** it fires: pay 1 H3 from the pool, double that weapon's dice for that round's attack, and the ship then takes 1 damage after that attack. The damage is the **standard self-damage event** (owner chooses cube or component, no Spoils, can destroy the ship, which triggers Self-destruct if fitted). **Each doubled weapon costs 1 H3 and causes 1 damage** (two doubled weapons = 2 H3 and 2 damage). **Works on the Beam Projector's shot too.** |
| AI-Targeting Turrets | Gives all the ship's weapons Multi-Shot. **Before rolling**, the owner assigns each weapon's dice among targets, then rolls. Each target's defences apply to its own dice. **Each target has its own separate damage event**, and special weapon rules (Gauss exactly 1 hit, Apocalypse x2, Concussion) apply **per target**. Targets can be **any legal mix** of rival and enemy ships. A 1-die weapon gets no benefit. |
| Nano Repair Bots | **Reworded:** at the **start** of the Maintenance phase (before enemy combat), remove 1 damage **cube** from this ship. Cannot restore lost components. **Stacks** with other repair sources (Nanite Station tile, crew traits). |
| Scavenger Drones | Whenever the **owner's fleet** delivers the destroying damage event to any ship (enemy or rival, including by Beam Projector or a Self-destruct explosion), gain +1 resource of choice from the general supply into the cargo of **the ship carrying the Drones**, even if another of the owner's ships made the kill. |
| Cargo full (Scavenger Drones, Data Siphon, any cargo gain) | If the cargo hold is full, the owner may **discard another cargo resource to make room**, otherwise the new resource is lost. |
| Data Siphon | **Reworded:** at the **end of the Action phase** (once everyone has passed, before Maintenance), if this ship is in an **Anomaly sector**, gain 1 resource of choice from the general supply into its cargo (see cargo full rule). Once per global round. |
| Security Credentials | **Replaced.** "Hub Security" is not defined in V5, so the damage penalty does not exist. New effect: this ship may use Interact actions at the **Central Nexus** even if opposing ships (**enemy faction ships and rivals**) are present. It beats a blockade of the hub only. Cost 2 H3, 2 TC, 1/2 slot unchanged. *Also remove "Hub Security" from the damage-source list in the Taking Damage wording.* |
| Slot costs and prices (all components) | **V5 rulebook values win everywhere** for slot costs (e.g. half-slot Temporal Echo, Nano Repair Bots, Self-destruct, Drone Hangar, Magnetic Grapple, Void-Core Overdrive, AI-Targeting Turrets, Security Credentials) and for resource costs on standard upgrades (e.g. Hull Plating 2TC 1PC, Warp Drive 1TC 2H3 1PC), unless a ruling in this document says otherwise. The simulator's values are not used. |
| Magnetic Repulsor Grid | Reaction when attacked by a **Mass Accelerator** weapon: the **defender** picks **any 2 attack dice** after seeing the roll and the attacker rerolls them, **new results replace the old**. Happens **once per attacking weapon**. Order: the attacker's **Temporal Echo (if used) resolves first**, then the defender reacts to the final roll. Simulator's "2 lowest hit dice, automatic" is superseded. **Several Grids stack**: each Grid forces 2 dice rerolled (two Grids = 4 dice against one weapon). |
| Smuggler's Hold | +1 cargo space. The **one resource stored in it** is skipped by Spoils of War **and** Torpedo Bay. If the ship is **destroyed**, the attacker takes it with the rest of the cargo as normal. |
| Mercenary Uplink: balance flag | The V5 rulebook itself marks it **"Overpowered?"**. Decision: **keep it exactly as ruled** and judge balance in play. Added to the watch list. |
| Crew: "during a Tactical action" (general) | Traits worded this way apply **only in a combat the owner starts with a Tactical attack action**, for **every combat round of that combat**. They do nothing in combats started by enemies in Maintenance or by rivals. Accepted limit, same as Drone Hangar. |
| Shield Specialist (Commander) | Within that scope: **once per damage event**, reduce the total hits in that event by 1 (minimum 0), applied **after all other defences**. |
| Bounty Hunter (Commander) | **Reworded:** within that scope, whenever a **rival player or bot** discards a **component** (takes component loss) in a combat with this ship, gain 1 resource of any type. Enemy ships have no components, so enemy kills never trigger it. The resource comes from the general supply into the **Faction Resource Pool** (never VM). **Ruled: it also pays out when a Beam Projector shot makes a rival discard a component** (no once-per-round limit). Watch: the target cannot fire back, so Beam Projector plus Bounty Hunter is a safe income engine (see section 9). |
| Weapons Officer (Commander) | +1 to attack rolls of **every weapon on this ship, always** (a passive bonus, not limited to combats the owner starts). **Stacks** with other Weapons Officers and accuracy items, with no limit beyond crew slots. Subject to the natural 6 / natural 1 rules. Since only the Flak-Burst Scattergun says it ignores bonuses, **+1 bonuses do improve other 6+ weapons** (a 6+ weapon with +1 hits on 5+). |
| Expert Marksman (Commander) | A **passive that always applies** (not limited to combats the owner starts). Applies only to **rival ships that choose to lose a component** (or are forced to by the overflow rule). Enemies never lose components, so it does nothing against them. When it applies, the target's installed components are shuffled and **split into two piles as evenly as possible** (an odd component goes to either pile; with 1 component, one pile has it and the other is empty), the attacker looks, **chooses one pile**, and **a random component from that pile is lost** instead of the defender's choice. Installed components are public information. The attacker can choose a pile, so empty-pile outcomes are the attacker's choice. |
| Salvage Expert (Commander) | When a component is **lost in combat**, gain 2 resources of choice from the general supply into the **Faction Resource Pool**. **Voluntary discards (upgrades, making room) do not count.** Only the **owner's own ship's** components count, and it is **2 resources for each component lost**, with no per-round cap. |
| Quartermaster (Commander) | On each upgrade action for this ship, remove 1 resource of the owner's choice from the cost (minimum 0), whatever the type. **Several Quartermasters stack.** |
| Profit-Chaser (Ensign/Commander) | +1 speed while the ship's cargo hold is full. A **normal speed effect**: counted at round start for initiative, checked at move time for movement. |
| Logistics Officer | +1 cargo capacity. As written in V5. |
| Black Marketeer (Commander) | In a Trade action, deliver one resource to a planet that does **not** demand it; it simply goes into the Faction Resource Pool. **No price and no market effect.** |
| Trade Expert (Commander) | Once per Trade action (whatever the number of resources delivered), when delivering **demand**, gain 1 extra resource into the pool, which must be one of the resources being traded. |
| Xeno Scientist (Commander) | When **exploring** with an Interact action on an Anomaly hex, draw **2 enemy cards** and **choose 1** to face. The other goes back to the enemy deck, which is reshuffled. The chosen card's level and asset cards come with it. |
| Comms Specialist (Commander) | During an Interact action, may use the Interact effect of an **adjacent hex** (Anomaly or Nexus) **with no restrictions**: it works **even if opposing ships are in that hex**, and **including the Nexus hexes**. *Watch: this can be used against a Central Nexus blockade from an adjacent hex, and to Redeem or recruit remotely.* |
| Void Scout (Commander) | After completing a Move action, take a **free** Interact action at the destination hex (no Interact token). **All normal Interact conditions apply** (including the opposing-ship restrictions). Once per Move action. |
| Long-range Sensor Specialist, Piloting Ace, Warp Engineer, Pilot, Tactical, Scout, Merchant (Ensigns) | **As written in V5** (peek at two unrevealed adjacent tiles before a Move; +1 speed; once per Move action move between tiles that have a warp gate on only one side; plain action tokens). Long-range peeks are visible to the human only if they own the ship, and the bot's information is public-only as already ruled. |
| Concussion Missiles | On 1 or more hits, if the target has **3 or more total hull slots** (base plus hull upgrades), add **1 extra hit in total** (once per attack, not per hit). The simulator's text ("+1 hit if no shields") was wrong. |

### Enemy kills and reward cards (changes from V5)
- **V5 "Anomaly Interactions (Collect)" is removed.** There is no Interact action to buy reward cards on a hex.
- **When a player destroys an enemy ship, they receive its reward cards** (the asset cards under the enemy card, which are component cards) **directly**, and take the enemy ship card (used by some missions).
- **When several fleets fight the same enemy, the fleet that dealt the destroying damage event takes the reward cards.**
- **Range kills (Beam Projector):** the shooter takes the **enemy ship card** but not the reward cards. The reward cards stay on the hex and go to the **next player to enter it**.
- **Reward cards install for free.** The taker may install any of them **immediately** on a ship with room, or **set one or more aside** and install them later during **any future upgrade Interact action at no cost**. **There is no limit** on how many set-aside cards a player holds. Set-aside cards are **hidden** to rivals (information rules apply to the bot too).
- **Claiming left-behind rewards:** the next player to **end a move in the hex** takes them. **Passing through does not count.** Unclaimed cards **stay on the hex until claimed** (no end-of-round discard). If someone **explores the hex with an Interact action without entering it**, the new reward cards are **added to the cards already there**. *Interpretation to confirm: leftover cards accumulate with new reward cards, and whoever then kills the new enemy or next ends a move there claims the whole stack.*
- A ranged kill's **enemy ship card goes to the shooter** (needed for the faction missions), as ruled under Beam Projector.
- "Explores the hex without entering it" only happens via the Comms Specialist exploring an adjacent Anomaly; new cards are added to any already there.

### Dice rules (settled)
- A **natural 6 always hits** and a **natural 1 always misses**, regardless of modifiers.
- Consequences: weapons that hit on 6+ ignore all to-hit penalties. To-hit penalties have a floor of 1 in 6, so stacking defences has diminishing returns.

### Consequences to remember
- Thermal Sinks can negate any Prism enemy weapon (all have 2 dice or fewer) for 1 H3. It is close to a hard counter to the faction. **Softened by the 3-for-1 exchange** (see "Trade and markets"): any pool cost can be paid with 3 other resources, so "needs a specific resource in the pool" is only a price, not a hard requirement.
- Resource-cost reactions are **interrupts**: the engine must pause during the attacker's turn and ask the defender before dice are rolled. With the "step through every decision" choice, one attack can prompt several times.
- The cost resource and location matter: pool resources cannot be stolen by Spoils of War, but cargo can.

### Corrections to earlier statements
- Slot costs: only the Inertial Dampener differs from the simulator (and the accuracy items match). Earlier text that said "several" defences differ was wrong.

### Superseded simulator behaviours
The simulator resolves damage per hit and awards Spoils per cube, both overridden by section 3. `combat-reference.md` still describes them and carries a warning note.

All weapons, unique technologies, defences, cargo items and crew traits in the V5 rulebook have now been ruled on. The standard and uncommon accuracy/cargo items were checked only for cost and slots (V5 values win, see above). The enemy cards, including their on-destruction effects, have also been compared and ruled (section 4).

---

### Game end (ruled)
- The game ends **immediately** when a player takes their third VM (the Redeem action). No ties are possible. The **Blockade** mission is checked at the end of Maintenance, so a game-ending redeem can simply come first, and the mission is not reached. The UI shows every seat's VM and completed missions as public information, and **no extra warning** is given when the bot is one redeem from winning.

### Anomaly tiles (22 in V5; a game uses 6 / 9 / 12 for 2 / 3 / 4 seats)
- **Scope:** all 22 tile effects will be ruled before the effect language is designed. **The bot uses tile abilities**: each Interact effect gets a small usefulness score in its priority list. Passive effects apply to whichever ships are in range, bot or human.
- **All 22 tiles are now ruled except #4 (deferred).** The labels "(Nexus Tile)", "(Chokepoint Tile)" and "(Dense Terrain Tile)" are **flavour only**: all are ordinary Anomaly tiles, drawn and placed like the rest. The Anomaly Resonance mission therefore counts any of the 22 Activate abilities, and **passive tiles (6, 7, 10, 11, 12, 13, 15) have no Activate action**. *Check: Anomaly Resonance says "unique Activate action", so it can only be completed with Interact tiles (1, 2, 3, 4, 5, 8, 9, 14, 16 to 22).*
- Rulings per tile follow below.
- **15 Free-Trade Logistics Hub (passive):** while the owner has **a ship in this sector**, **any purchase made by that owner** (upgrades, crew, new ships, for any ship, anywhere) has **1 resource of the buyer's choice removed from its total cost** (minimum 0), **once per purchase**. It stacks with Quartermaster and Luxury Quarters. **Ability costs (Decoy, Torpedo and so on) are not purchases and are never reduced (ruled).**
- **6 Automated Nanite Station (passive):** **at the end of the global round** (after Maintenance, so after enemy combat), **each ship in this sector repairs 1 damage cube** (never restores components). It works **regardless of opposing ships** (a passive of the tile, not a Repair action). A ship destroyed in Maintenance does not benefit.
- **7 Solar Flare Sanctuary (passive):** every ship that was **in this sector at the start of the global round** (the start of the Action phase) gets **+1 to its attack dice** (an accuracy bonus, subject to the natural 6 / natural 1 and floor rules) and **+1 speed for all evasion checks** (Evade and Retreat contests), for the **whole round, even if it leaves the sector**. A ship arriving later gets nothing until next round. Applies to rivals and bots alike. Speed here is a temporary effect, so initiative stays fixed.
- **10 System Defence Grid (passive, chokepoint tile):** if **any ship (player, bot or enemy card)** is already in the sector, **ships belonging to a different owner** must **exhaust one Tactical token as a cost before the Move that enters it** (also when merely passing through, since that is entering). With **no ready Tactical token**, they cannot enter. A player's **own** ships can enter freely. *Note for the bot: a ready Tactical token is needed both here and for the exploration rule, so Tactical tokens are a contested resource in its priorities.*
- **11 Sensor Buoy Network (passive):** while the owner has a ship in this sector, **every draw the owner makes by their own action** is **draw two, keep one**: random asset deck draws at an Outer Rim Nexus, enemy card draws when exploring (Move onto a new tile or the Explore Interact), and the Intelligence Bureau's mission replacement. **Market refills in Maintenance are not affected.** **The card not kept is discarded (ruled)** to its normal discard pile (component discard pile, enemy discard pile, mission discard pile). *Consequence: each use burns an extra card, so it speeds up emptying the enemy deck, which disables Explore, and does not reveal anything about future draws.*
- **12 Volatile Helium Nebula (passive, reworded by the owner):** "When entering this sector, a ship may gain 1 H3 into its cargo hold. If a ship ends the global round in this sector, it must remove a resource from its cargo hold or take 1 damage." **Ruled:** the entry gain happens on **every entry**, with **no limit** (accepted: the cost of the extra moves and tokens is the only limit). The toll is checked **at the end of the Action phase, before Maintenance combat**: the owner **chooses to remove any 1 resource from that ship's cargo (back to supply), or take 1 damage** as a standard damage event (cube or component, no Spoils). With an empty hold it must take the damage. *Ordering note: Data Siphon also fires at the end of the Action phase, so a fixed order among end-of-Action-phase effects is needed in the engine.*
- **13 Dense Asteroid Field (passive, dense terrain tile):** **leaving by Move costs 1 extra point of Speed** (a Speed 2 ship moves 1 hex, and a Speed 1 ship cannot leave by Move at all, only by Evade). **Evade and Retreat from this sector always succeed** against every opposing ship (no contests, no damage), and a ship **may Evade here even with no opposing ship present**. **Magnetic Grapple cannot cancel it.** The effect applies to **any ship in the sector**, so a rival here gets it too, which makes pinning here weak. **The Gravitic Anchor's 2-resource payment still applies (ruled)** to a tactical Evade from here, even when no opposing ship is present: the Anchor taxes the action, Dense only makes it succeed.
- **14 Fleet Command Substation (Interact):** gives **all of the owner's other ships** (not the ship using the Interact) **+1 to attack dice** (an accuracy bonus) for the **rest of the global round**. Useless for a one-ship fleet, which is accepted.
- **16 Smuggler's Foundry (Interact):** the using ship **takes any number of damage cubes onto its own hull slots, limited to its free hull slots** (so it can never be destroyed by this tile), and **for each cube moves 1 resource from that ship's cargo into the pool**. No other limit (accepted: it converts cargo to pool without a demand planet, paid for in hull slots, a strong tile).
- **8 Deep-Space Tactical Sensor Array (Interact):** look at the **top 2 enemy cards** and put them back on top or bottom in any order. **9 Encrypted Archives Station (Interact):** the owner **chooses one of the 4 sector asset decks**, looks at its **top 5 cards** and puts them back in any order. **Peeked information is private to the seat that peeked** and the engine's per-player view must include it. **The bot may use what it peeked** (earned information).
- **5 Graviton Warp Conduit (Interact):** costs only the **Interact token** plus **1 resource from the hold of one of the owner's ships in this sector**, which then takes a **Move action without needing a Move token** at **+1 speed**, may move between sectors with **only a half warp gate**, and is **not stopped by enemy ships** in sectors it passes through or enters. The ship that pays and moves can be **any of the owner's ships in this sector** (not necessarily the one making the Interact). It **cannot start a Move here with opposing ships present**, because Interact itself is blocked by them.
- **4 Overclocking Relay (Interact):** **ruling deferred.** The owner said "not sure we need this now". It is a free type-converter (net zero tokens) that is strictly better than Officer Training, so it is **out of the first content slice** until decided. It still needs a decision before the effect language is considered complete.
- **3 EMP Array Substation (Interact):** **each other player chooses one of their own ready tokens** (any ship's, general or officer) **and exhausts it**. With none ready (including players who have already passed), nothing happens. A player still acting loses one ready token, which may force them to pass sooner.
- **2 Black Market Trading Depot (Interact):** swap **up to 2** resources in the using ship's cargo hold for **any 2 resources of the user's choice** (never VM) from the general supply. The old resources return to the supply, and net hold size is unchanged. With an empty hold it does nothing.
- **1 Scrap Reclamation Yard (Interact, reworded by the owner):** "**Swap any two components on any ship you own.**" The two ships can be **anywhere on the board** (only the using ship must be here). The swap is **illegal** if either ship would have more installed than its slots or capacities allow afterwards (**no loss is permitted**), including slot sizes (1/2, 1, 2), cargo space holding resources, crew capacity and hull slots holding cubes. Free of cost.
- **22 Commerce Guild Outpost (Interact and passive):** the hex **starts empty**. **In Maintenance, 1 resource is placed on the hex, and the first-player token holder chooses its type**; the hex never holds more than one of each type (so at most 4). The **Interact** takes **1 resource of the user's choice from the hex into their Faction Resource Pool**. *The bot, as first player, needs a rule for which type to place (e.g. the type it is lacking for its planned purchase).*
- **21 Officer Training Command (Interact):** pay **2 resources from the pool** to **turn over one of the owner's own exhausted action tokens** (general, a ship's Move token, or an officer token), **once per Interact**. The Interact token spent to use the tile **may itself be the token turned back over**. *Consequence worth knowing: using the tile exhausts the Interact token, so flipping a different token back is a net-zero in total tokens and only converts the type of action available (e.g. Interact into Move or Tactical). Flipping the Interact token itself achieves nothing. It is a type-conversion tool, not extra actions.* **Confirmed intent: keep it.**
- **20 Personnel Transporter (Interact):** move **any number of crew members between any two of the owner's ships anywhere on the board** (the ships need not be in this sector, and only the user ship must be here), subject to the destination's crew capacity (the owner may remove another crew member to make room). A moved officer's **action token keeps its state** (ready or exhausted) and now belongs to the new ship.
- **19 System Regulator Node (Interact):** the user targets **any planetary system on the board** (no ship needed there) and **adds or removes 1 damage cube on its supply area and/or 1 on its demand area**. Adding locks the area, removing unlocks one cube's worth. **Cubes can stack with no cap** (adding repeatedly can lock a planet for many rounds, since Market Shift removes only 1 per Maintenance). **The user gains nothing directly.** *Watch: this tile is a strong denial tool against the bot's trade routing (and vice versa), so the bot's cube-lock check must account for it, and it can lock a planet for very long.*
- **18 Subspace Disruption Array (Interact):** the using ship pays **1 QP from its own cargo** (back to the general supply, and the 3-for-1 exchange does **not** apply because it is a cargo cost, not a pool cost). **Each other player chooses 2 of their own ready Move tokens** (any ship) to exhaust. If they have fewer than 2 ready, they exhaust what they have. They stay exhausted until Maintenance.
- **17 Intelligence Bureau (Interact):** choose **1 card in the shared mission market** (the face-up row, never a held mission); it is **discarded for the game** and **immediately replaced from the top of the Mission Deck**. No limit beyond the Interact action. **When the Mission Deck is empty, no replacement is drawn**: the market shrinks and refills stop (New Objectives too), so missions can run out for the whole game. *Watch: with 29 cards, 2 starting missions per seat and completed missions kept in play areas, a long game could run dry and stall the VM race, and Bureau use speeds that up.*

### Passing and the Action phase (ruled)
- Players alternate **one action at a time**, starting with the first player. A player may **pass at any time**, which flips all their remaining tokens to exhausted and takes 1 resource from the Central Nexus. **Passing is final for the round**: a passed player is **skipped** until Maintenance resets tokens. The remaining players keep taking turns (one player may end up acting alone) until **everyone has passed**. A player must pass when all their tokens are exhausted.
- Board size by seat count (V5): **2 seats** 10 planet tiles and 6 anomaly tiles, **3 seats** 15 and 9, **4 seats** 20 and 12.

### Maintenance phase: enemy ship tokens (ruled)
- **"Enemy ship tokens" are only spawned tokens**, such as the Hive's Swarm Larva. The Maintenance step "if no damage was repaired in a sector containing enemy ship tokens, remove one ship token" therefore **clears leftover larva** from sectors where no repair happened. Normal enemy cards are not tokens and are never removed by that step.
- **Maintenance order (V5):** Enemy Combat, Enemy Ship Repair (1 cube from every damaged enemy, then the token rule), Enemy Escalation (shuffle one random reinforcement card into the enemy deck), Market Shift, Nexus Replenishment, Recruitment, New Objectives, Reset Counters, New Ship (for a player with no ships), Pass the First Player token. *Rulings that touch it: Nano Repair Bots at the start of Maintenance, Data Siphon at the end of the Action phase, Impulse Thrusters end when Maintenance begins, Blockade checks at the end of Maintenance.*

### Enemy decks (ruled)
- **The "kill an enemy: shuffle two Level 2/3 cards into the enemy deck" rule is removed (an old rule).** Only the Maintenance Escalation step adds reinforcements: one random card per round from the reinforcement deck.
- **When the reinforcement deck is empty, Escalation adds nothing.**
- **When the enemy deck is empty, the Explore Interact action can no longer be used.** An undiscovered Anomaly tile entered by Move still **flips and gives its discovery bonus** (and movement still ends), but there is **no enemy and no reward cards**. The loss of the reward-card source for the rest of the game is **intended** late-game pressure: upgrades then come only from the Outer Rim markets.
- The starting enemy deck is the V5 deck for every seat count (it does not scale with seats).

### Movement and Evade (V5 read, rulings marked)
- **Move:** one ship moves up to its Speed in hexes along warp gate connections (gates must match on both sides, apart from Warp Engineer and Cloaked Slip Drive which allow half-connected). **Ruled: Move can only be used if the ship starts in a sector with no opposing ships (rival ships included).** Otherwise it must use Evade. Movement **ends on flipping a new undiscovered hex**, and Reference Card 1 says it ends on entering a hex containing another ship. A ship with 0 Speed cannot Move but can still Evade. **Ruled: movement ends immediately on entering any hex that contains an opposing ship (rival or enemy)**, so a ship can pin another by entering its hex, and the entering ship must then Evade or Attack to act (Move is blocked for it too). This matches Mercenary Uplink's "movement is not blocked" wording, where a friendly ship is not an opposing ship. **Enemy faction ships never sit in planetary sectors, only in Anomaly sectors, and they never move.**
- **Entering a new Anomaly hex:** immediate discovery bonus (2 different printed resources) and draw an enemy card, with 1, 2 or 3 face-down asset cards placed under it according to the enemy's level. Reward asset cards come only from the markets matching the discovery bonus resource types.
- **Evade (tactical action, uses a token):** moves the ship **1 adjacent sector regardless of Speed**, and **must follow warp gate connections** (ruled: gates required on both sides, Cloaked Slip Drive allows half-connected). Roll **once per opposing ship in the sector**: d6 + your Speed vs d6 + their Speed, equal or higher = no effect, lower = 1 failed evasion (1 hit); total all failed contests into **one damage event**. The ship completes the move unless destroyed. **The destination can be any legal adjacent sector, including one with enemy ships** (combat there happens in Maintenance) **and an undiscovered tile** (it is flipped, and the discovery bonus and enemy card apply as for Move). Evade is not a combat Retreat.
- **Restrictions by opposing ships (ruled):** **Interact, Repair and Move** cannot be used by a ship in a hex with **opposing ships** (rivals or enemies). **Trade is never blocked** (no ships block Trade: enemy factions are never in planetary sectors, and rivals do not block it). This overrides Reference Card 1's wording on Trade.
- **Consequence:** two rival fleets in one hex **lock each other out of Interact, Repair and Move** (a mutual trap): the only ways out are **Evade** (a contested roll that can cost hits), **Attack**, or the other fleet leaving. Trade still works if it is a planet. **A standoff is a legitimate state** and Maintenance does not force a fight.
- **Bot when locked out:** it **uses the strength check**: attack if it expects to win, otherwise **Evade** (Move is also blocked while pinned, so Evade is the only exit). It never just waits. *Note: this makes pinning a real threat. A bot's Evade can fail and cost hits, and Evade needs a Tactical token (the same token the exploration rule keeps ready).*

### Upgrades at the Outer Rim Nexus (V5 read, rulings marked)
- Each Outer Rim Nexus is numbered 1 to 4 and tied to an asset type and resource: **Sector 1** Weapons / Offensive Tech (PC), **Sector 2** Propulsion / Utility (H3), **Sector 3** Cargo / Life Support (QP), **Sector 4** Hull / Defensive (TC). Each has a deck and **3 face-up market cards**.
- An **Upgrade Interact** buys **one** asset card **for a ship in that sector**, either by paying the **printed cost of one of the 3 face-up cards**, or by **paying 3 of the sector's resource to draw a random card from its deck**. (The 3-for-1 exchange applies.)
- **Deck draw (ruled):** you receive the random card (for the ship), then you **discard one of the 3 face-up cards (your choice) and refill from the deck**, so the market stays at 3 and rotates. **The flat 3-resource price replaces the printed cost**, so it is the cheap-but-random option.
- Common technologies are always available during an upgrade action by paying the printed cost.
- **Fit (ruled):** the card goes on a ship with a free upgrade slot. If it doesn't fit, the owner may **discard an installed component from that ship to make room** (voluntary, part of the same action, so Salvage Expert does **not** pay). Otherwise the card cannot be taken.
- **Set-aside reward cards:** installed free during an upgrade Interact, **any number in one action** as long as ships have room. **The ship must be at an Outer Rim Nexus** (it is an upgrade Interact, so it is blocked if opposing ships are in the hex).
- **Random draw that doesn't fit (ruled):** if the buyer cannot or will not make room, the card is **discarded and the resources are lost**. That is the gamble.
- **Bot buying:** the bot **scores the 3 face-up cards** with a simple value function (weapon dice, defences, hull, cargo, plus mission nudges) against price and takes the best affordable one. It uses a **random draw only when no face-up card is worth its price**. *The value function needs authoring per component; unlisted exotic components default to a low score so the bot mostly ignores them unless told otherwise.*

### Building new ships (ruled)
- **Only the Nomad-class Corvette exists as a buildable ship.** A fleet is **up to 3 ships**, and variety comes from upgrades. Other classes are not in scope.
- **A new Corvette costs 10 resources in total.** **Mix (ruled, adjustable): 3 H3, 3 TC, 2 QP, 2 PC.** Missing types can be paid with the 3-for-1 exchange. *Resource names: Titanium Carbide (TC), Helium-3 (H3), Plasma Cells (PC), Quantum Processors (QP).* Built with an Interact action at an Outer Rim Nexus (blocked by opposing ships). The starting ship is free.
- *Pace check for later: with cargo 2 a bare Corvette moves about 2 resources into the pool per delivery cycle, so a second ship is a mid-game purchase (and the Armada mission is correspondingly hard early).*

### Crew (V5 read, rulings marked)
- **Recruitment cost (ruled): Ensigns cost 3 resources and Commanders cost 5 resources in total.** The Appendix's per-card costs (Pilot 4 H3, Tactical 4 PC, Scout 2 QP + 2 PC, Merchant 2 QP + 2 H3, and the Commanders at 6 to 9 resources) are **out of date. The user will update them so each totals 3 (Ensigns) or 5 (Commanders).** *Pending: the updated per-card cost lists. Do not build crew costs from the V5 appendix.*
- **Luxury Quarters:** reduces the recruit cost of any crew member **for that ship** by **any 2 resources of the buyer's choice** (minimum 0).
- **Recruitment:** an Interact action at **any Nexus** (Central or Outer Rim) buys one of the 4 face-up crew cards into a ship with free crew capacity, and the owner **may remove another crew member to make capacity**. Officer action tokens work only on their own ship. In Maintenance the oldest (leftmost) crew card is discarded and the market refills to 4.

### Trade and markets (V5 read, with one interpretation)
- **Harvest:** a ship takes **any number** of resources matching the planet's supply type into its cargo, **up to cargo capacity**, **for free**. It then places **2 damage cubes** on the supply area, and cannot harvest while any cube is there. **The number on the card is a cap per action** (one harvest takes at most that many of that type).
- **Fulfil demand:** the ship moves **any number** of matching resources from its cargo to the **Faction Resource Pool**, up to the demand number per type (a cap per action), then places **2 damage cubes** on the demand area. Blocked while any cube is there.
- **Both in one action:** one Trade action can harvest and fulfil demand together. It **cannot be used if enemy ships are in the hex** (note: enemy faction ships block Trade, while the Interact restriction is "opposing ships"; rivals do not block Trade as V5 is written).
- **Market Shift (Maintenance):** removes **1 cube** from every supply and demand area on each planetary sector, so a used area is **locked for 2 Maintenance steps** (usable again in the round after next).
- **The pool** is the only spendable store (upgrades, crew, new ships). **Cargo cannot be spent until delivered.** Purchases may **exchange 3 resource cubes for 1 resource of any type**.
- **3-for-1 exchange (ruled):** it can be used **any number of times** for any cost paid from the pool: for each missing resource, spend 3 other pool resources of any types (never VM). It applies to **purchases and also to ability costs** (Decoy Launcher's TC, Torpedo Bay's H3, Impulse Thrusters' H3, Cloaked Slip Drive's QP, Mercenary Uplink, Gravitic Anchor, and so on). *Consequence: the "needs a specific resource" counters (e.g. Thermal Sinks needing H3 in the pool) are softer than earlier notes assumed, since 3 other resources can stand in. The interrupt UI must offer the exchange when the exact resource is missing.*
- **Passing (ruled):** a player who passes takes **1 resource of their choice from what remains** of the Central Nexus supply, **wherever their ships are** (no blockade or location effect). The Nexus resets to 1 of each type during Maintenance. Ruled as **"it can never be empty"**: each seat passes once per round and there are at most 4 seats against 4 resources, so a passer always gets something, but **later passers may not find their preferred type**, which makes passing order matter. **The game must cap at 4 seats (1 human plus up to 3 bots)** for this to hold, which already matches the product decision.
- *Consequences to remember:* cargo capacity is the throttle on income (a bare Corvette has cargo 2); both areas of a planet are shared between the human and every bot, so planets are contested; pool income otherwise comes only from Pass (1 resource from the Central Nexus, which resets to 1 of each type each Maintenance), discovery bonuses and card effects.

## 8. Information and recovery (settled)

- **Bot information:** the bot decides using **public information only**, exactly what a human player would know, and the engine enforces this. The engine must therefore produce a **per-player view** of the game state (what each player may see). Hidden information includes face-down tiles, the asset cards under enemy cards, set-aside reward cards and shuffled decks. **There are no secret missions**: all missions are public (V5's "secret mission" wording is stale). This is the same boundary human multiplayer would need later.
- **Last Ship Recovery:** as V5. A basic ship appears at the next Maintenance on any Outer Rim Nexus tile with no opposing ships. Only pool resources and completed missions persist. V5 does not say what happens if no such tile exists, so a lockout is possible in rare cases (known gap).

## 9. Watch during play (no decision needed now)

1. **Balance consequences of the VM change:** nobody can take or destroy a rival's VM, so the only way to stop a leader is to win first or blockade the Central Nexus. Fighting the bot has little strategic purpose beyond blockades and shared enemy fights.
2. **Nexus lockout:** can a bot hold the Central Nexus indefinitely, and what dislodges it? (Attack, per the bot attack rules.)
3. **No free Outer Rim Nexus tile:** V5 doesn't say what happens if Last Ship Recovery finds no free tile.
4. **Cargo versus pool in the interface:** the rules already say cargo can't be spent until moved to the pool, and the specific costs are settled. Only how the interface shows the two stores remains.
5. **Crew and action tokens for the bot:** a lone Corvette has 4 tokens (Move, Trade, Interact, Tactical), and officer tokens work only on their own ship. How the bot uses them is a build detail.
6. **Blockade-breaking tools:** Security Credentials (Central Nexus only), Mercenary Uplink (flagged "Overpowered?" in V5, kept as ruled) and Comms Specialist (any adjacent Anomaly or Nexus hex, no restrictions) all bypass the "cannot Interact with opposing ships present" rule. Together they may make blockades, which the bot design relies on as counterplay, too weak.
7. **Range kills and rewards:** Beam Projector kills leave reward cards on the hex for the next player to enter. Could produce odd bot behaviour (racing to the hex) and unclear hand/slot limits.
8. **Tactical-initiated traits:** Drone Hangar, Shield Specialist and Bounty Hunter only work when the owner starts combat. A player-heavy-defence build gets no benefit from them, and enemies attack in Maintenance, so these will rarely trigger in solo play.
9. **Beam Projector plus Bounty Hunter:** the Beam Projector shot is one-sided, and Bounty Hunter pays on its hits, so a ship with both can farm resources from rivals with no retaliation. Watch in play and playtest the Beam Projector's price.

## 10. Needed before building (not optional)

1. ~~Rulings for the remaining components.~~ **Done** (see section 7). The complete effect language can now be designed against settled text. Enemy cards have also been compared and ruled (section 4, including Underworld Extortion).
2. ~~How the bot completes missions.~~ **Done at design level** (see section 11): incidental completion with nudges for Build and Combat missions, scoring-based taking, timer-based discarding, redeeming as top priority, Monte Carlo strength check, and all mission text ambiguities ruled. What remains are tunables (N rounds, threshold, run count, base ratings) to set during the build.

### Bot trading
- **Route scoring:** the bot evaluates **short routes** (harvest at a reachable planet, deliver to a matching demand) and picks the best by **pool gain per action and travel cost**, with seeded randomness breaking ties. It does **not** plan by need: purchases are handled separately by the priority list, using the 3-for-1 exchange for missing types.
- **Contested planets:** the bot **checks the cube lock before committing to a move** and will not head to a locked planet unless the lock will clear by the time it arrives (Market Shift removes 1 cube per Maintenance).
- **Tunable:** route length horizon (how many moves ahead), tie-break randomness.
- **Passing:** the bot passes when it has **no useful action left** (every remaining action scores below a floor), **or earlier** if the Central Nexus holds a resource type it badly needs **for a planned purchase** and a rival is likely to take it first. *Consequence: the bot needs a notion of a "next planned purchase" (a target component, crew or ship) even though trade routing is not need-driven. That target comes from the priority list and the mission nudges.*
- **Enemy ships on its route:** the bot **fights an enemy if the strength check passes** (enemies are targets for combat missions and rewards), and **otherwise avoids** that hex when routing.
- **Exploring (ruled, replaces "no safety check"):** the bot **explores using Move actions only while its Tactical token is still ready**, so that if the revealed enemy fails the strength check it can **Evade** away on its next turn. It does not explore with the Tactical token exhausted. Evade can fail (each failed contest is a hit), so this reduces but does not remove the risk of losing the ship. A discovered enemy that passes the strength check is fought.
- **First player:** random in round 1 (seeded), then the token passes around the seats each Maintenance as in V5.

## 11. Bot and missions (settled; tunables remain)

- **Approach: incidental completion.** The bot follows its general priority list (trade, explore, upgrade, fight, with seeded randomness). Missions complete when their conditions happen to be met, with nudges for two mission groups (see below). **No per-mission planners.** Accepted cost: pace is unpredictable.
- **Taking a mission:** when a slot is free, the bot scores the visible missions by **how close its current fleet already is to the condition** and takes the best one, with seeded randomness among ties.
- **Scoring:** each mission type has a **fixed base difficulty rating** (set once, tunable), **adjusted by a simple state check where one exists** (e.g. Armada scores higher if the bot already has 2 ships). Event missions ("after taking this mission") use the base rating only.
- **Discard rule (completed missions can never be discarded, and "after taking this mission" progress is lost on discard):** the bot may discard an uncompleted mission only if it has had **no new progress for N global rounds**, counted from when it was taken or from its last progress (N tuned later). Then, if a visible mission scores clearly better than it, it swaps. This prevents churn and still lets a stalled mission go. Accepted: the bot may hold a mission it will almost never complete for N rounds. (The engine tracks mission progress for every player, human or bot.)
- **Nudges:** only the two largest mission groups get explicit nudges while the bot holds a mission of that group: **Build/state** missions (All Aboard, Full Roster, Balanced Design, Armada, Standardisation, Master Engineer, Resource Tycoon, Cargo Kingpin: 8 cards) bias upgrades, recruiting and ship purchases toward the condition, and **Combat** missions (Devastation, Sector Pacification x3, Ironclad Survivor, Syndicate Bust, Prismatic Salvage, Hive Cleansing: 8 cards) bias which enemies to hunt. **Trade (4 cards), Exploration (5), Shield Calibration / Evasive Master / Industrial Titan (3) and Blockade (1) get no nudges**: they complete incidentally or not at all, which is an accepted consequence. Deck composition after removing the PvP missions is 29 cards of 26 types.
- **Mission rulings (apply to humans and bots):**
  - **Blockade:** the **same ship** must be in the Central Nexus tile at the **start of the Action phase** and at the **end of Maintenance** (after the Reset step), and **cannot leave and return** in between. It must survive Maintenance combat there. The mission must be **taken before that round starts**.
  - **Devastation:** **2 or more hits delivered to one ship in a single damage event**, on **any ship (enemy or rival)**. It does not matter whether the defender takes it as cubes or components. "Hits" are counted **after defences and bonuses** (e.g. the Prism +1 counts). Beam Projector shots count (a one-shot damage event).
  - **Sector Pacification (x3):** a **cumulative total of 2 damage** across any Level 2/3 enemy ships (may be split between ships, events and rounds) after taking the mission. Damage is counted as in Devastation (after defences and bonuses).
  - **Ironclad Survivor:** a combat counts as won when it **ends with all opposing ships destroyed or retreated** (the player retreating does not count as a win), and **at that moment** one of the player's ships in the combat has **2 or more damage cubes** on its hull.
  - **Evasive Master:** counts **active tactical Evade actions started from a sector containing an opposing ship**, where **at least one evade roll was made and every roll passed** (so no damage). Retreats in combat do not count, and neither do automatic successes with no roll. Two such actions after taking the mission. The two **need not be consecutive**.
  - **Shield Calibration:** any **installed defensive component** that results in **fewer hits than there would have been without it** counts: Energy Shields, Thermal Sinks, Decoy Launcher, Reactive Plating, Magnetic Repulsor Grid rerolls that turn a hit into a miss, and **to-hit penalties** (Magnetic Shields, Inertial Dampener, Pulse Defense Grid) **if the penalty actually turned at least one die from hit to miss**. **Crew traits (Shield Specialist) do not count.** A defence that triggers but changes nothing does not count. *Engine note: this means defence effects must report "hits prevented" to the mission tracker.*
  - **Syndicate Bust / Prismatic Salvage / Hive Cleansing:** state check at redeem time. **Any** defeated enemy card of that faction in the player's play area counts, **including ones taken before the mission was taken**. On redeeming, the **2 cards used are discarded** (they cannot count toward another mission). **Whoever deals the destroying damage event takes the card**, including **Beam Projector** kills and **Self-destruct** explosions.
  - **Galactic Tour:** the **same ship** visits **2 + player count** different Anomaly tiles after taking the mission. **Player count = all seats, bots included.** **Passing through a tile counts as entering it** (per the card). **If the ship is destroyed, progress is lost.** Note this differs from claiming range-kill rewards, where passing through does **not** count.
  - **Stellar Cartographer:** enter 3 different Anomaly tiles in a **single global round** (Action phase plus Maintenance), **passing through counts**, and the tiles may be split across the player's ships.
  - **Warp Pioneer:** 2 or more Move actions with the **same ship in a single global round**, **by any means** (a second Move token, a flipped Move token, tile effects, Void Scout, and so on).
  - **Industrial Titan:** **5 or more resources spent on ship components across the whole global round**, counted as the **actual amount paid** after reductions (Quartermaster), with free reward-card installs counting as 0.
  - **Perimeter Lockdown:** 2 Interact actions on **different Outer Rim Nexus tiles within one global round** (the same or different ships), after taking the mission.
  - **Anomaly Resonance:** the unique Activate effect used on 2 different Anomaly sectors after taking the mission. **Using an adjacent hex's effect remotely through Comms Specialist counts.**
  - **Trade Negotiator:** on each of **3 different planets** (**4** in games with **3 or more seats, bots included**), deliver **at least 2 demand in a single Trade action**, after taking the mission.
  - **Market Saturation:** in one Trade action, take the planet's **printed maximum supply** or satisfy its **printed maximum demand** (all of one type). A market already depleted by earlier trades **cannot** satisfy it, even if everything left is taken. *Watch: this can make the mission hard or impossible on a worn market.*
  - **Tri-System Supply Run (x2):** deliver demand to **2 different planet tiles within one global round**; **each planet tile counts as a system**.
  - **Balanced Design:** a ship with **3 different component categories** installed (weapon, defence, cargo, hull, crew, drive/utility). The printed base hull and weapon do not count.
  - **Master Engineer:** a ship with **4 or more installed components** (the printed hull and base weapon do not count), duplicates included.
  - **Standardisation:** the **same named component** installed on two different ships.
  - **All Aboard, Full Roster, Armada, Resource Tycoon, Cargo Kingpin:** **as written in V5** (state checks at redeem time). **Cargo Kingpin counts cargo only** (the pool does not count, and VM can no longer sit in cargo). Resource Tycoon counts the pool's four resource types, and VM is not one of them.
  - **Where missions are taken and redeemed:** missions are **taken at the Outer Rim Nexus locations** and **redeemed at the Central Nexus**, where the player gets the VM into the pool. **This matches V5**: a ship at an Outer Rim Nexus takes 1 mission from the face-up market (4 cards) with an Interact action (the Interact token, and normal opposing-ship restrictions apply); the market refills to 4 during Maintenance ("New Objectives"). A Central Nexus blockade therefore blocks **redeeming** but not **taking** missions.
  - **Starting missions:** each player (and bot) starts with **2 public missions** and can redeem only **one**: **redeeming one discards the other** (the only case where a held mission is discarded other than by the uncompleted-mission discard rule). **Both count toward the 3-mission cap**, so a player starts with 1 free slot. **There are no secret missions** (V5's "secret mission" wording is stale). The bot's choice between its two starting missions is made by the same scoring rule, just by completing whichever it can first.
- **Redeeming:** once a held mission is complete, **redeeming is the bot's top priority**. It heads for the Central Nexus and redeems as soon as possible.
- **Blockaded Nexus:** if a rival holds the Central Nexus, the bot **attacks if it is at least as strong** (using the simple strength comparison from section 2). If it is **not** strong enough, it **works toward getting stronger** (a strength-building mode that changes its priorities, e.g. upgrades and weapons).
- **Strength measure: seeded Monte Carlo.** The bot runs the **real combat engine** a number of times on the current public state and attacks if its win rate is **above a threshold** (number of runs and threshold to be tuned). Consequences: the engine must be **fast, side-effect free and runnable on a copy of the state**; simulations must use a **separate derived seed** so they never disturb the game's RNG sequence; the simulation uses **public information only** (installed components are public, set-aside reward cards are not); and the opponent's decisions inside the simulation (damage choice, reactions) need a **fixed default policy**, because the human's choices are unknown.
- **"Getting stronger":** when blockaded and too weak, **upgrading and weapon/defence purchases move to the top of the bot's priority list** until it passes the strength check, then it attacks.

## 12. Pending items (owner's input or later decisions)

**Data the owner said they will provide**
1. **Crew recruitment costs** updated so each Ensign totals 3 resources and each Commander totals 5 (the V5 appendix costs are out of date).
2. **New Corvette cost mix: RESOLVED** at 3 H3, 3 TC, 2 QP, 2 PC (tunable).

**Conflicts found in the consistency pass (need a ruling)**
A. **Stealth Field vs the Interact restriction: RESOLVED.** Locating costs an exhausted Interact token, which is a cost, not an Interact action, so it is not blocked by opposing ships. *(Engine note: "exhaust a token as a cost" and "perform an Interact action" must be separate concepts in the effect language.)*
B. **"Explore the hex without entering it": RESOLVED.** It happens only through the Comms Specialist exploring an adjacent Anomaly. The new enemy card and reward cards are added to whatever is already in the hex.
C. **Bounty Hunter and Beam Projector hits: RESOLVED** (it pays, see item 7).
D. **Scope tension: RESOLVED.** The **first milestone ships a minimal bot**: move, explore, trade, upgrade and redeem with simple scoring and a plain strength heuristic. The Monte Carlo strength check, route-scored trading and scored tile abilities arrive in later milestones. The engine must still be built so these can be added without rework (engine copy for simulation, derived seed, scored-action interface).

**Rulings deferred**
3. **Tile 4, Overclocking Relay:** deferred and out of the first content slice.
4. **Gravitic Anchor and Dense Asteroid Field: RESOLVED.** The payment still applies.
5. **Free-Trade Logistics Hub: RESOLVED.** Purchases only.
6. **Sensor Buoy Network: RESOLVED.** The card not kept is discarded.
7. **Bounty Hunter and Beam Projector: RESOLVED.** It pays out on Beam Projector hits.
8. **Mission deck running dry:** accepted for now, but could stall a long game (watch list).

**Tunables to set during the build**
- Bot: mission discard timer N, mission base ratings, Monte Carlo run count and win-rate threshold, route horizon, tie-break randomness, per-component value table, tile usefulness scores.

**Watch list (see section 9):** blockade-breaking tools may weaken blockades, tactical-initiated traits rarely trigger, range-kill reward races, Market Saturation on worn markets, Regulator Node denial, Smuggler's Foundry strength, Mercenary Uplink ("Overpowered?").
