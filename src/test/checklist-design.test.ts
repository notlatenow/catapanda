import { expect, it } from "vitest";
import { buildAll } from "@/lib/checklists";
import { buildDisasterBasics, designPersonalPicks, type DetailRow } from "@/lib/checklist-design";
const flatten = (rows: DetailRow[]): DetailRow[] => rows.flatMap(r => [r, ...flatten(r.contents ?? [])]);
it("keeps standard basics independent of household personalization", () => {
  const basics = buildDisasterBasics(["Earthquake", "Typhoon"]);
  const names = basics.sections.flatMap(s => flatten(s.rows).map(r => r.name));
  expect(names).toContain("Drinking water");
  expect(names).not.toContain("Pet supplies");
  expect(names).not.toContain("Infant supplies");
  expect(new Set(names).size).toBe(names.length);
});
it("calculates overlap against the distinct standard union, not bundled rows", () => {
  const a = buildDisasterBasics(["Earthquake"]);
  const b = buildDisasterBasics(["Typhoon"]);
  const names = (list: typeof a) => new Set(list.sections.flatMap(s => flatten(s.rows).filter(r => r.kind === "catalog").map(r => r.name)));
  const aa = names(a); const bb = names(b);
  const shared = [...aa].filter(n => bb.has(n)).length;
  const total = new Set([...aa, ...bb]).size;
  expect(buildDisasterBasics(["Earthquake", "Typhoon"]).overlap).toEqual({ shared, total, percent: Math.round(shared / total * 100) });
});
it("nests bag contents for a single disaster but keeps water visible", () => {
  const list = buildDisasterBasics(["Earthquake"]);
  const rows = list.sections[0]?.rows ?? [];
  expect(rows.find(r => r.name === "Grab-and-go bag")?.contents?.map(r => r.name)).toContain("Flashlight or headlamp");
  expect(rows.map(r => r.name)).toContain("Drinking water");
  expect(rows.map(r => r.name)).not.toContain("Flashlight or headlamp");
});
it("keeps multi-disaster priority items flat and optional applicability in data", () => {
  const list = buildDisasterBasics(["Earthquake", "Typhoon"]);
  expect(list.sections[0]?.rows.find(r => r.name === "Flashlight or headlamp")).toBeDefined();
  const gloves = list.sections[1]?.rows.find(r => r.name === "Gloves");
  expect(gloves?.appliesTo).toEqual(["Earthquake", "Typhoon"]);
  expect(list.sections[1]?.rows.every(r => r.priority === "nice-to-have")).toBe(true);
});
it("puts household needs in For you without changing Top Tips rankings", () => {
  const built = buildAll(["Earthquake"], ["pet", "personalAids"], null, 4);
  const before = JSON.stringify(built.top10);
  const personal = designPersonalPicks(built.personalized, ["Earthquake"]);
  expect(personal.sections.map(s => s.title)).toEqual(["For you", "Essentials"]);
  expect(personal.sections[0]?.rows.map(r => r.name)).toContain("Pet supplies");
  expect(personal.sections[0]?.rows.map(r => r.name)).toContain("Personal aids: vision, hearing, mobility");
  expect(personal.sections[1]?.rows.find(r => r.name === "Drinking water")?.shortNote).toBe("For 4 people: ~36 L for 3 days");
  expect(JSON.stringify(built.top10)).toBe(before);
});