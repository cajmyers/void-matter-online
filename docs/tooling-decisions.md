# Void Matter Online: tooling and rendering decisions

Status: design discussion only. No implementation has started and no code has been written.
Companion to `design-decisions.md` (rules and product). This document covers the front-end technology direction.

Library versions and licences have **not** been verified. Check them when the project is scaffolded.

---

## 1. Goal

A polished 2D, desktop-only web board game with card, dice and tile animations. React is preferred but not mandatory. Expected animations: flipping hex tiles, turning over cards, moving cards between zones, throwing dice, and combat effects.

## 2. What the design implies

- **Cards are rendered from structured data.** About 55 components plus missions, crew and enemies, all with dense text. HTML and CSS handle text layout, zoom and templating well. Canvas handles them badly.
- **The engine emits an event stream.** Animation plays those events back and never drives the rules.
- **Dice outcomes are decided first.** Results come from the seeded RNG before anything animates, so animations must land on a known result. Physics-based dice are a poor fit.
- **The board is small.** At most about 32 tiles, a few ships, plus cubes and tokens. That is far below DOM performance limits.
- **The game is prompt-heavy.** Reaction interrupts, damage choices and the 3-for-1 exchange make this mostly a UI problem, which suits React.
- **Monte Carlo bots need a fast, DOM-free engine** that can run in a Web Worker.
- **Hosting is already Firebase.** Firebase Auth and Firestore are the natural fit for cloud saves.

## 3. Rendering options considered

| Option | Strengths | Weaknesses | Verdict |
|---|---|---|---|
| **A. React + DOM/SVG + Motion** | Best cards and text. Layout animations for card moves. Easy to build, test and inspect. | Heavy glow, bloom and particle effects are harder. | **Default choice** |
| **B. A + PixiJS overlay** | Everything in A, plus GPU effects (beams, explosions, trails, starfield). | Two coordinate spaces to keep in sync. | **Direction kept, but DEFERRED:** not part of the first build (see the deferral note below) |
| **C. Full canvas (Phaser or Pixi)** | Maximum effects and performance. | Card text, tooltips, zoom and accessibility become custom work. | Rejected |
| **D. Godot or Unity web export** | Strong tooling. | Large bundles, awkward text-heavy UI, poor fit with a TypeScript engine and Firebase. | Rejected |
| **E. Svelte or Solid instead of React** | Svelte's built-in transitions are nice. | Smaller game and animation ecosystem. | Fine, no advantage over React here |

**Decision:** React + TypeScript + Vite, with the board, cards and HUD in DOM and SVG, animated with Motion. A PixiJS canvas **would be used for effects and dice only**, but **that is deferred**. If the whole board is ever wanted on the GPU, only the board layer moves to Pixi. The engine and card rendering stay unchanged.

### Deferrals (decided later, owner)

- **Pixi overlay: deferred.** Dice and combat effects are built first in DOM/CSS and Motion (dice as 2D sprites or CSS 3D cubes landing on predetermined results, effects as CSS/SVG animation). To keep Pixi cheap to add later, the animation director emits abstract **effect commands** in shared world coordinates to an **effects renderer interface**; the first implementation is DOM/CSS, and Pixi would be a second implementation. Revisit only if the DOM effects look too plain once the game is playable. Everything in sections 4 to 6 and 10 that mentions Pixi describes that **future option**, not the first build.
- **Playwright: deferred.** Vitest covers rules, replays and invariants. Consider one smoke test (a seeded game played through the browser) once the UI has stabilised.
- **Storybook: deferred, and may never be used.** A dev-only gallery route in the same Vite app renders cards, prompt kinds and dice from fixtures instead.

## 4. Can React render into a canvas for Pixi to animate?

No, not directly. Browsers have no stable API that turns live DOM into a canvas or texture. The Chromium "HTML-in-Canvas" proposal is, as far as is known, still experimental and should not be depended on. Libraries that fake it (`html-to-image`, `html2canvas`) are asynchronous, take tens of milliseconds per element, are unreliable with web fonts and CSS effects, and can flicker on swap. They suit one-off caching, not per-frame work.

### Three workable patterns

1. **Pixi overlay for effects only (start here).**
   - A transparent Pixi canvas sits above the DOM with `pointer-events: none`.
   - DOM elements animate themselves (Motion, CSS 3D).
   - React passes screen or world coordinates to Pixi, which draws beams, explosions, particles, dice trails, glow, shimmer and screen shake.
   - Cheapest and most robust.
2. **Proxy handoff for hero moments.**
   - Before the animation, rasterise the card or tile face to a cached texture (during idle time).
   - Hide the DOM element and place a Pixi sprite at the same screen rectangle.
   - Animate with shaders (foil, dissolve, page curl, destruction burn), then swap back.
   - Use only for a few cinematic cases.
3. **One card renderer, two outputs.**
   - Draw each card face once from its data (SVG or Canvas 2D) into a bitmap.
   - The DOM shows that bitmap and Pixi uses the same bitmap as a texture.
   - No conversion at animation time.
   - Cost: card text is no longer live HTML, so tooltips, search and accessibility need separate handling. This matters less for a desktop-only game. It fits the "cards rendered from data" decision.
   - Consider this if pattern 2 proves fiddly.

## 5. Where each animation lives

| Animation | Layer | Reason |
|---|---|---|
| Flipping hex tiles | **DOM** (CSS 3D, Motion) | A real 3D flip with `backface-visibility` is trivial. Pixi can only fake it by squashing `scaleX`, unless mesh perspective is added. |
| Turning over cards | **DOM** | Same reason. Add a Pixi shimmer or glow on reveal. |
| Moving cards between zones | **DOM** (Motion layout animations) | Zones are DOM containers. Pixi adds trails or glow. |
| Throwing dice | **Pixi** | Dice are textures with no text. Gives arcs, bounces, shadows, motion blur and trails, with many dice at once, scripted to land on the engine's result. |
| Combat effects | **Pixi** | Beams, missiles, explosions, shield ripples, destruction. |

Dice alternatives if a 3D look is wanted: pre-rendered frames from Blender, or a CSS 3D cube. Both can be scripted to land on the engine's result.

## 6. Pitfalls to plan for

- **Coordinate sync with pan and zoom.** If the board is a DOM or SVG layer with a camera transform, Pixi effects must use the same world-to-screen mapping. Keep one camera as the single source of truth and have both layers read it.
- **Resizing and device pixel ratio.** The overlay must follow window size and handle high-DPI screens.
- **Idle cost.** Use one shared Pixi `Application` and stop its ticker when nothing is animating.
- **Layering.** An overlay can only draw on top. Effects that belong under a card (for example a glow behind it) need a second canvas beneath the cards, or must be accepted as top-only.
- **Framework glue.** `@pixi/react` can declare the Pixi scene from React, but the preferred approach is to drive the overlay imperatively from the animation director, which needs no component tree.
- **DOM performance.** Animate only `transform` and `opacity`. Be careful with Motion layout animations in deep trees, and with many blurred or shadowed elements.

## 7. Animation tools

- **Motion** (formerly Framer Motion): main tool. Layout and shared-element animation for card moves. Its imperative `animate()` returns promises, which suits sequencing the event stream.
- **GSAP**: alternative or addition. Strong timelines and a Flip plugin. Believed to be free to use now, but verify the licence.
- **Rive or Lottie**: optional, for polished UI motion such as damage or victory effects.
- **Howler.js**: audio. Sound is a large part of perceived polish and easy to forget.

## 8. Supporting tooling

- **Language and build:** TypeScript (strict) and Vite.
- **Engine:** a separate pure TypeScript module with no DOM imports, enforced by a lint boundary or pnpm workspace. A tiny serialisable seeded PRNG that the project owns (for example PCG or sfc32) rather than a dependency.
- **UI state:** Zustand for view state and the animation queue. Engine state must not live in React. XState is optional for the prompt and interrupt flow, but may be overkill.
- **Validation:** Zod for card data and save files. It also supports the save-versioning policy.
- **Tests:** Vitest for rules, plus replay tests (rerun a seed and decision log and compare results). **Playwright (end-to-end and visual checks) and Storybook (cards, dice and animations in isolation) are deferred**; a dev-only gallery route stands in for Storybook.
- **Bots:** Monte Carlo runs in a Web Worker (Comlink makes this easy).
- **Saves:** store seed, decision log and rules version in Firestore. Saves are tiny and replay deterministically.
- **boardgame.io: not used.** It would constrain the interrupt-heavy flow, and the project wants its own effect language, event stream and bot boundary. It mainly pays off for multiplayer, which is deferred.

## 9. Architecture rule to settle early: the animation director

Keep an **animation director** between the engine and the UI.

- It consumes engine events and plays one promise-returning animation per event.
- It supports speed and skip controls.
- The UI shows a **displayed state** that trails the engine's real state.
- It emits DOM animations and Pixi effect commands (for example "beam from A to B" or "dice throw landing on [4, 6, 1]") in shared world coordinates.

Most of the difference between a polished and a janky digital board game comes from this layer, not from the animation library.

## 10. Staged adoption plan

1. **Tier 1 (first build):** DOM/CSS and Motion do all moves, flips, dice and effects, behind the effects renderer interface. **A Pixi overlay for particles, beams, dice and glow is deferred** until wanted.
2. **Tier 2:** add proxy handoff (pattern 2, or pattern 3 if easier) for specific hero moments such as card reveal with foil, tile flip with shimmer, and enemy destruction.
3. **Tier 3 (only if wanted):** move the board layer into Pixi.

## 11. Open items

- How cinematic combat should look. Dice, cards and flips work fine in the DOM; glowing beams, explosions and nebula backdrops are what justify the Pixi overlay.
- Whether card faces stay live HTML (patterns 1 and 2) or move to a single data-driven bitmap renderer (pattern 3).
- Design of the effects API and animation-director contract.
- A small throwaway spike to test the riskiest piece: 6 or more dice landing on predetermined results alongside a card moving between zones while the board pans. **Now built in DOM/CSS, since Pixi is deferred.** If it looks or performs badly, that is the signal to revisit the Pixi deferral.
