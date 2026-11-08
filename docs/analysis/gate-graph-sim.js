// Gate-graph connectivity analysis for Void Matter Online (CON-1).
// Run with: node docs/analysis/gate-graph-sim.js
//
// What it does: builds the 2-seat (radius-2 disc, 19 hexes) and 4-seat (radius-3 disc, 37 hexes)
// boards, deals planets and Anomalies face-down, then explores every hex reachable from the start
// Nexus tiles. Each time a tile is revealed it is oriented under MAP-6 (a gate must face the hex
// the ship came from) using one of these policies:
//   random  - any legal rotation, uniformly
//   greedy  - the legal rotation that creates the most full links to already revealed neighbours
//   central - like greedy, but links toward the Central Nexus count triple
// Options: { ring1 } forces tiles ringing the Central Nexus to face it when legal;
//          { half } lets half-connections (one gate) count as passable for ALL normal moves.
// Output per setting (4000 games each): share of start Nexus tiles with a full-gate route to the
// Central Nexus, share of games where every start is linked, average path lengths and dead ends.
// It also reports "AT LEAST ONE start linked to Central": with the Nexus Hop (NEX-1, any ship at an
// Outer Rim Nexus may travel to another one), a seat is stranded only if no start Nexus reaches the centre.
// The 3-seat board is not modelled (its layout is provisional, MAP-1).
// Caveats: explores to completion (every reachable hex is revealed), one policy orients every
// tile (a real table orients selfishly), and tools that cross half-connections (Warp Engineer,
// Slip Drive, Warp Conduit) are not modelled, so "unlinked" means "no ordinary-move route".
//
// Original throwaway header follows.
// Throwaway analysis for Void Matter gate connectivity (not part of the repo).
// Directions clockwise: 0 R, 1 BR, 2 BL, 3 L, 4 TL, 5 TR (pointy-top axial).
const DIRS = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];
const N = { R: 0, BR: 1, BL: 2, L: 3, TL: 4, TR: 5 };
const g = (s) => s.split(",").map((x) => N[x.trim()]);

const ANOMALY = {
  1: "TL,R,BL", 2: "TR,BR,L", 3: "TL,BR,L", 5: "TL,TR,BR,BL", 6: "R,BL,L", 7: "TL,TR,BR",
  8: "TR,BL,L", 9: "TL,R,BR", 10: "TL,BR", 11: "TR,R,L", 12: "TL,BR,BL", 13: "R,L",
  14: "TR,BL,L", 15: "TL,R,BR,L", 16: "TR,BR,BL", 17: "TL,R,L", 18: "TR,BL,L",
  19: "TL,R,BR", 20: "TR,BR,L", 21: "TL,R,BL", 22: "TR,BR,BL",
};
const PLANET_CODES = { cl: "TL,TR,R", y: "TL,R,BL", ar: "TL,BL,BR", al: "TR,BR,BL" };
const PLANET_USAGE = [].concat(
  Array(6).fill("cl"), Array(6).fill("ar"), Array(6).fill("al"), Array(2).fill("y"));

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const shuffle = (arr, r) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const key = (q, r) => q + "," + r;

function layout(radius, starts) {
  const hexes = [];
  for (let r = -radius; r <= radius; r++)
    for (let q = Math.max(-radius, -radius - r); q <= Math.min(radius, radius - r); q++) hexes.push([q, r]);
  return { hexes, starts, radius };
}
const L2 = layout(2, [[0, -2], [0, 2]]);
const L4 = layout(3, [[-1, -2], [3, -2], [-3, 2], [1, 2]]);
const PLANETS = { 2: 10, 4: 20 };
const ANOMS = { 2: 6, 4: 12 };

function rotate(set, k) { return set.map((d) => (d + k) % 6); }

function run(L, seats, policy, r, opts = {}) {
  const hexes = L.hexes, byKey = new Map(hexes.map((h) => [key(h[0], h[1]), h]));
  const nbr = (h, d) => { const x = byKey.get(key(h[0] + DIRS[d][0], h[1] + DIRS[d][1])); return x; };
  const gates = new Map(); // key -> array of dir indices or null (face-down)
  const kind = new Map();
  const centre = byKey.get("0,0");
  gates.set("0,0", [0, 1, 2, 3, 4, 5]); kind.set("0,0", "C");
  L.starts.forEach((s, i) => {
    const ds = []; for (let d = 0; d < 6; d++) if (nbr(s, d)) ds.push(d);
    gates.set(key(s[0], s[1]), ds); kind.set(key(s[0], s[1]), "N");
  });
  // deal tiles
  const planets = shuffle(PLANET_USAGE, r).slice(0, PLANETS[seats]).map((c) => ({ t: "P", gates: g(PLANET_CODES[c]) }));
  const anoms = shuffle(Object.keys(ANOMALY), r).slice(0, ANOMS[seats]).map((id) => ({ t: "A", gates: g(ANOMALY[id]) }));
  const deck = shuffle(planets.concat(anoms), r);
  const fill = hexes.filter((h) => !gates.has(key(h[0], h[1])));
  const tile = new Map();
  fill.forEach((h, i) => tile.set(key(h[0], h[1]), deck[i]));
  const has = (h, d) => { const gs = gates.get(key(h[0], h[1])); return gs && gs.includes(d); };

  const component = () => {
    const seen = new Set(); const q = [];
    L.starts.forEach((s) => { seen.add(key(s[0], s[1])); q.push(s); });
    while (q.length) {
      const h = q.pop();
      for (let d = 0; d < 6; d++) {
        const n = nbr(h, d); if (!n) continue;
        const nk = key(n[0], n[1]); if (seen.has(nk)) continue;
        if (gates.get(nk) && (opts.half ? (has(h, d) || has(n, (d + 3) % 6)) : (has(h, d) && has(n, (d + 3) % 6)))) { seen.add(nk); q.push(n); }
      }
    }
    return seen;
  };

  for (;;) {
    const comp = component();
    const options = [];
    for (const k of comp) {
      const h = byKey.get(k);
      for (let d = 0; d < 6; d++) {
        const n = nbr(h, d); if (!n) continue;
        if (!gates.has(key(n[0], n[1])) && has(h, d)) options.push([h, d, n]);
      }
    }
    if (!options.length) break;
    const [h, d, n] = options[Math.floor(r() * options.length)];
    const t = tile.get(key(n[0], n[1]));
    const back = (d + 3) % 6; // edge of new tile facing the source
    const legal = [];
    for (let k = 0; k < 6; k++) if (rotate(t.gates, k).includes(back)) legal.push(k);
    if (opts.ring1) {
      const cd = [0,1,2,3,4,5].find((dd) => { const m = nbr(n, dd); return m && m[0] === 0 && m[1] === 0; });
      if (cd !== undefined) {
        const better = legal.filter((k) => rotate(t.gates, k).includes(cd));
        if (better.length) { legal.length = 0; better.forEach((k) => legal.push(k)); }
      }
    }
    let pick;
    if (policy === "random") pick = legal[Math.floor(r() * legal.length)];
    else {
      const geoC = (h) => (Math.abs(h[0]) + Math.abs(h[1]) + Math.abs(h[0] + h[1])) / 2;
      let best = -1, bestK = [];
      for (const k of legal) {
        const rg = rotate(t.gates, k); let score = 0;
        for (const dd of rg) {
          const m = nbr(n, dd); if (!m) continue;
          const mg = gates.get(key(m[0], m[1]));
          if (mg && mg.includes((dd + 3) % 6)) score += (policy === 'central' && geoC(m) < geoC(n)) ? 3 : 1;
        }
        if (score > best) { best = score; bestK = [k]; } else if (score === best) bestK.push(k);
      }
      pick = bestK[Math.floor(r() * bestK.length)];
    }
    gates.set(key(n[0], n[1]), rotate(t.gates, pick));
    kind.set(key(n[0], n[1]), t.t);
  }

  // metrics
  const comp = component();
  const total = hexes.length;
  const revealed = [...gates.keys()].length;
  let edges = 0, degSum = 0, dead = 0, nonNexus = 0;
  const adj = new Map();
  for (const k of gates.keys()) adj.set(k, []);
  for (const k of gates.keys()) {
    const h = byKey.get(k);
    for (let d = 0; d < 6; d++) {
      const n = nbr(h, d); if (!n) continue; const nk = key(n[0], n[1]);
      if (gates.has(nk) && (opts.half ? (has(h, d) || has(n, (d + 3) % 6)) : (has(h, d) && has(n, (d + 3) % 6)))) adj.get(k).push(nk);
    }
  }
  const bfs = (s) => {
    const dist = new Map([[s, 0]]); const q = [s];
    while (q.length) { const x = q.shift(); for (const y of adj.get(x)) if (!dist.has(y)) { dist.set(y, dist.get(x) + 1); q.push(y); } }
    return dist;
  };
  let deadEnds = 0, tiles = 0;
  for (const k of comp) {
    if (kind.get(k) === "N" || kind.get(k) === "C") continue;
    tiles++; if (adj.get(k).length === 1) deadEnds++; degSum += adj.get(k).length;
  }
  const startKeys = L.starts.map((s) => key(s[0], s[1]));
  const dC = bfs("0,0");
  const startToC = startKeys.map((s) => dC.get(s));
  const d0 = bfs(startKeys[0]);
  const startPairs = [];
  for (let i = 1; i < startKeys.length; i++) startPairs.push(d0.get(startKeys[i]));
  const planetsInComp = [...comp].filter((k) => kind.get(k) === "P").length;
  const planetsRevealed = [...gates.keys()].filter((k) => kind.get(k) === "P").length;
  // average shortest path between all pairs of tiles in component (route stretch)
  let sumPath = 0, sumGeo = 0, pairs = 0;
  const arr = [...comp];
  const geo = (a, b) => {
    const dq = a[0] - b[0], dr = a[1] - b[1]; return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
  };
  for (const a of arr) {
    const da = bfs(a);
    for (const b of arr) {
      if (a >= b) continue;
      if (!da.has(b)) continue;
      sumPath += da.get(b); sumGeo += geo(byKey.get(a), byKey.get(b)); pairs++;
    }
  }
  return {
    revealedFrac: revealed / total, degAvg: tiles ? degSum / tiles : 0, deadFrac: tiles ? deadEnds / tiles : 0,
    startToC, startPairs, planetsInComp, planetsRevealed, planetsTotal: PLANETS[seats],
    stretch: sumGeo ? sumPath / sumGeo : 1, startsConnected: startPairs.every((x) => x !== undefined),
    allStartsToC: startToC.every((x) => x !== undefined),
    anyStartToC: startToC.some((x) => x !== undefined),
    bestStartToC: Math.min(...startToC.map((x) => (x === undefined ? Infinity : x))),
  };
}

function summarize(L, seats, policy, n, opts = {}, label = '') {
  const r = rng(12345 + seats * 7 + (policy === "random" ? 1 : policy === "greedy" ? 2 : 3));
  const acc = { revealedFrac: 0, degAvg: 0, deadFrac: 0, stretch: 0, startsConnected: 0, allStartsToC: 0, anyStartToC: 0, bestSum: 0, bestN: 0, planetsInComp: 0, planetsRevealed: 0, startToC: 0, startToCn: 0, pair: 0, pairN: 0, unreachablePlanets: 0 };
  for (let i = 0; i < n; i++) {
    const m = run(L, seats, policy, r, opts);
    acc.revealedFrac += m.revealedFrac; acc.degAvg += m.degAvg; acc.deadFrac += m.deadFrac; acc.stretch += m.stretch;
    acc.startsConnected += m.startsConnected ? 1 : 0; acc.allStartsToC += m.allStartsToC ? 1 : 0; acc.anyStartToC += m.anyStartToC ? 1 : 0;
    if (m.anyStartToC) { acc.bestSum += m.bestStartToC; acc.bestN++; }
    acc.planetsInComp += m.planetsInComp / m.planetsTotal;
    for (const x of m.startToC) if (x !== undefined) { acc.startToC += x; acc.startToCn++; }
    for (const x of m.startPairs) if (x !== undefined) { acc.pair += x; acc.pairN++; }
  }
  const f = (x) => (x / n).toFixed(3);
  console.log(`${seats} seats, ${policy} orientation${label}, ${n} games`);
  console.log(`  hexes revealed by full exploration: ${(100 * acc.revealedFrac / n).toFixed(1)}%`);
  console.log(`  per-start Nexus linked to Central: ${(100 * acc.startToCn / (n * L.starts.length)).toFixed(1)}%`);
  console.log(`  planets in start-connected network:  ${(100 * acc.planetsInComp / n).toFixed(1)}%`);
  console.log(`  avg tile degree (full links): ${f(acc.degAvg)}   dead-end tiles: ${(100 * acc.deadFrac / n).toFixed(1)}%`);
  console.log(`  every start Nexus linked to Central: ${(100 * acc.allStartsToC / n).toFixed(1)}%   all starts linked to start0: ${(100 * acc.startsConnected / n).toFixed(1)}%`);
  console.log(`  AT LEAST ONE start linked to Central (Nexus hop rescues the rest): ${(100 * acc.anyStartToC / n).toFixed(2)}%   best start's path to Central: ${(acc.bestSum / Math.max(1, acc.bestN)).toFixed(2)} hexes`);
  console.log(`  avg gate-path length start->Central: ${(acc.startToC / acc.startToCn).toFixed(2)} hexes   start0->other starts: ${(acc.pair / acc.pairN).toFixed(2)}`);
  console.log(`  route stretch (gate path / straight distance): ${f(acc.stretch)}`);
}

for (const [L, sc] of [[L2, 2], [L4, 4]]) {
  for (const p of ["random", "greedy", "central"]) summarize(L, sc, p, 4000);
  summarize(L, sc, "greedy", 4000, { ring1: true }, " + ring-1 tiles must face Central");
  summarize(L, sc, "greedy", 4000, { half: true }, " + half-connections passable for ALL normal moves");
}
