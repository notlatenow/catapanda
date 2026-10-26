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
it("groups personal picks into broad categories without changing Top Tips rankings", () => {
  const built = buildAll(["Earthquake"], ["pet", "infant", "personalAids"], null, 4);
  const before = JSON.stringify(built.top10);
  const personal = designPersonalPicks(built.personalized, ["Earthquake"]);
  expect(personal.sections.map(s => s.title)).toEqual(["Food & Water", "Health & Wellness", "Tools & Safety", "Power & Communication", "Documents & Money", "Go-bag"]);
  const food = personal.sections[0]!;
  expect(food.rows.find(r => r.name === "Pet supplies")?.forYou).toBe(true);
  const allNames = flatten(personal.sections.flatMap(s => s.rows)).map(r => r.name);
  expect(allNames).toContain("Pet supplies");
  expect(allNames).toContain("Infant supplies");
  expect(allNames).toContain("Personal aids: vision, hearing, mobility");
  const health = personal.sections[1]!;
  expect(health.rows.map(r => r.name)).toContain("Personal aids: vision, hearing, mobility");
  const water = flatten(personal.sections.flatMap(s => s.rows)).find(r => r.name === "Drinking water");
  expect(water?.shortNote).toBe("For 4 people: ~36 L for 3 days");
  expect(JSON.stringify(built.top10)).toBe(before);
});
it("labels household rows For you and keeps single baby or pet items ungrouped", () => {
  const built = buildAll(["Earthquake"], ["pet"], null, null);
  const personal = designPersonalPicks(built.personalized, ["Earthquake"]);
  const food = personal.sections.find(s => s.title === "Food & Water")!;
  const pet = food.rows.find(r => r.name === "Pet supplies");
  expect(pet?.forYou).toBe(true);
  expect(pet?.displayName).toBe("Pet essentials");
  expect(food.rows.some(r => r.displayName === "Pet care")).toBe(false);
  expect(food.rows.find(r => r.name === "Drinking water")?.forYou).toBe(false);
});
it("bundles multiple pet or baby items into one Pet care or Baby care group", () => {
  const ai = { items: [
    { name: "Dog anxiety wrap", shortNote: "Calms nervous dogs", category: "Household & Special Needs", priority: "nice-to-have" as const, stores: ["Specialty"], sourceUrl: null, specializes: null, medical: false },
    { name: "Baby carrier cover", shortNote: "Weather cover for the carrier", category: "Household & Special Needs", priority: "nice-to-have" as const, stores: ["Specialty"], sourceUrl: null, specializes: null, medical: false },
  ], top: [] };
  const built = buildAll(["Earthquake"], ["pet", "infant"], ai, null);
  const personal = designPersonalPicks(built.personalized, ["Earthquake"]);
  const food = personal.sections.find(s => s.title === "Food & Water")!;
  const petCare = food.rows.find(r => r.displayName === "Pet care");
  expect(petCare?.forYou).toBe(true);
  expect(flatten(petCare ? [petCare] : []).map(r => r.name)).toContain("Dog anxiety wrap");
  const babyCare = food.rows.find(r => r.displayName === "Baby care");
  expect(babyCare?.forYou).toBe(true);
  expect(flatten(babyCare ? [babyCare] : []).map(r => r.name)).toEqual(expect.arrayContaining(["Infant supplies", "Baby wrap / carrier", "Baby carrier cover"]));
  expect(food.rows.filter(r => r.name === "Pet supplies")).toHaveLength(1);
});