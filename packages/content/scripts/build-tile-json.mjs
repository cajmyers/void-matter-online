/** One-off maintainer script: regenerate tile JSON from the canonical tables in this file. */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(root, "data", "tiles");
mkdirSync(dataRoot, { recursive: true });

function slug(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const anomalies = [
  { number: 1, name: "The Scrap Reclamation Yard", bonus: ["tc", "pc"], ability: "interact", gates: ["TL", "R", "BL"] },
  { number: 2, name: "Black Market Trading Depot", bonus: ["qp", "h3"], ability: "interact", gates: ["TR", "BR", "L"] },
  { number: 3, name: "EMP Array Substation", bonus: ["pc", "qp"], ability: "interact", gates: ["TL", "BR", "L"] },
  { number: 4, name: "Overclocking Relay", bonus: ["pc", "h3"], ability: "interact", gates: ["TR", "R", "BL"] },
  { number: 5, name: "Graviton Warp Conduit", bonus: ["h3", "qp"], ability: "interact", gates: ["TL", "TR", "BR", "BL"] },
  { number: 6, name: "Automated Nanite Station", bonus: ["tc", "qp"], ability: "passive", gates: ["R", "BL", "L"] },
  { number: 7, name: "Solar Flare Sanctuary", bonus: ["h3", "pc"], ability: "passive", gates: ["TL", "TR", "BR"] },
  { number: 8, name: "Deep-Space Tactical Sensor Array", bonus: ["qp", "tc"], ability: "interact", gates: ["TR", "BL", "L"] },
  { number: 9, name: "Encrypted Archives Station", bonus: ["qp", "h3"], ability: "interact", gates: ["TL", "R", "BR"] },
  { number: 10, name: "System Defence Grid", bonus: ["tc", "pc"], ability: "passive", gates: ["TL", "BR"] },
  { number: 11, name: "Sensor Buoy Network", bonus: ["qp", "pc"], ability: "passive", gates: ["TR", "R", "L"] },
  { number: 12, name: "Volatile Helium Nebula", bonus: ["h3", "tc"], ability: "passive", gates: ["TL", "BR", "BL"] },
  { number: 13, name: "Dense Asteroid Field", bonus: ["tc", "h3"], ability: "passive", gates: ["R", "L"] },
  { number: 14, name: "Fleet Command Substation", bonus: ["pc", "tc"], ability: "interact", gates: ["TR", "BL", "L"] },
  { number: 15, name: "Free-Trade Logistics Hub", bonus: ["h3", "qp"], ability: "passive", gates: ["TL", "R", "BR", "L"] },
  { number: 16, name: "Smuggler's Foundry", bonus: ["tc", "h3"], ability: "interact", gates: ["TR", "BR", "BL"] },
  { number: 17, name: "Intelligence Bureau", bonus: ["qp", "tc"], ability: "interact", gates: ["TL", "R", "L"] },
  { number: 18, name: "Subspace Disruption Array", bonus: ["pc", "qp"], ability: "interact", gates: ["TR", "BL", "L"] },
  { number: 19, name: "System Regulator Node", bonus: ["h3", "pc"], ability: "interact", gates: ["TL", "R", "BR"] },
  { number: 20, name: "Personnel Transporter", bonus: ["qp", "h3"], ability: "interact", gates: ["TR", "BR", "L"] },
  { number: 21, name: "Officer Training Command", bonus: ["tc", "pc"], ability: "interact", gates: ["TL", "R", "BL"] },
  { number: 22, name: "Commerce Guild Outpost", bonus: ["tc", "qp"], ability: "interact", gates: ["TR", "BR", "BL"] },
].map((row) => ({ id: `anomaly-${row.number}`, ...row }));

const amt = (resource, amount) => ({ resource, amount });
const planets = [
  ["High metal", "Aethel-9", "cl", [amt("tc", 4)], [amt("h3", 3), amt("qp", 2)]],
  ["High metal", "Vulkan's Forge", "y", [amt("tc", 4), amt("h3", 2)], [amt("pc", 2), amt("qp", 3)]],
  ["High metal", "Gorgon Prime", "ar", [amt("tc", 5)], [amt("h3", 3), amt("pc", 2)]],
  ["High metal", "Caelum Mining Hub", "al", [amt("tc", 4)], [amt("qp", 4)]],
  ["High metal", "The Iron Ring", "cl", [amt("tc", 4), amt("pc", 2)], [amt("h3", 4)]],
  ["High fuel", "Zephyrus Minor", "ar", [amt("h3", 4)], [amt("tc", 4), amt("qp", 2)]],
  ["High fuel", "Kraken's Breath", "al", [amt("h3", 5)], [amt("tc", 3), amt("pc", 2)]],
  ["High fuel", "Osiris-4", "cl", [amt("h3", 4), amt("tc", 2)], [amt("qp", 4)]],
  ["High fuel", "Boreas Station", "y", [amt("h3", 4)], [amt("tc", 2), amt("pc", 3)]],
  ["High fuel", "Neptunia Prime", "ar", [amt("h3", 4), amt("pc", 2)], [amt("tc", 4)]],
  ["High component", "Nova Forge", "al", [amt("pc", 4), amt("tc", 2)], [amt("h3", 4), amt("qp", 2)]],
  ["High component", "Stallos Prime", "cl", [amt("pc", 4)], [amt("tc", 4), amt("h3", 2)]],
  ["High component", "Ares Citadel", "ar", [amt("pc", 5), amt("tc", 2)], [amt("h3", 4)]],
  ["High component", "Steelhold Alpha", "al", [amt("pc", 5)], [amt("tc", 4), amt("qp", 3)]],
  ["High component", "Vanguard Station", "cl", [amt("pc", 4), amt("h3", 2)], [amt("tc", 4)]],
  ["High tech", "Solaria Prime", "ar", [amt("qp", 4)], [amt("tc", 2), amt("h3", 4)]],
  ["High tech", "Xanadu Core", "al", [amt("qp", 4), amt("pc", 2)], [amt("h3", 4)]],
  ["High tech", "Apex Laboratories", "cl", [amt("qp", 5)], [amt("pc", 4)]],
  ["High tech", "Elysium Nexus", "ar", [amt("qp", 4), amt("h3", 2)], [amt("tc", 4)]],
  ["High tech", "Chronos Research Outpost", "al", [amt("qp", 4)], [amt("h3", 4)]],
].map(([group, name, pattern, supply, demand]) => ({
  id: `planet-${slug(name)}`,
  name,
  group,
  pattern,
  supply,
  demand,
}));

writeFileSync(join(dataRoot, "anomalies.json"), `${JSON.stringify(anomalies, null, 2)}\n`);
writeFileSync(join(dataRoot, "planets.json"), `${JSON.stringify(planets, null, 2)}\n`);
console.log(`Wrote ${anomalies.length} anomalies and ${planets.length} planets`);
