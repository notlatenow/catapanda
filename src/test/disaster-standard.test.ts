import { afterEach, expect, it, vi } from "vitest";
import { buildDisasterList, buildPersonalized } from "@/lib/checklists";
import { catalog, type CatalogItem } from "@/services/catalog";

afterEach(() => vi.restoreAllMocks());

it.each(["Flood", "Typhoon", "Earthquake"])("removes shared household-only extras from %s without removing standard items", disaster => {
  const checklist = buildDisasterList(disaster);
  expect(checklist.sections).toHaveLength(1);
  const names = checklist.sections.flatMap(s => s.rows.map(r => r.name));
  expect(names).toContain("Drinking water");
  expect(names).not.toContain("Infant supplies");
  expect(names).not.toContain("Pet supplies");
  expect(names).toEqual(expect.arrayContaining(catalog.getExtraItems(disaster).map(i => i.name)));
});

it("keeps a disaster-specific optional item only in its matching list", () => {
  const charcoal: CatalogItem = { name: "Charcoal bags", scope: "Fire", category: "Tools", priority: "conditional", shortNote: "", stores: [], sources: [] };
  const rules = catalog.getHouseholdRules();
  const getExtras = catalog.getExtraItems;
  vi.spyOn(catalog, "getHouseholdRules").mockReturnValue([...rules, { item: charcoal.name, fact: "personalAids", shownWhen: "If applicable" }]);
  vi.spyOn(catalog, "getExtraItems").mockImplementation(disaster => disaster === "Fire" ? [charcoal] : getExtras(disaster));
  expect(buildDisasterList("Fire").sections.flatMap(s => s.rows.map(r => r.name))).toContain("Charcoal bags");
  for (const disaster of ["Flood", "Typhoon", "Earthquake"]) {
    expect(buildDisasterList(disaster).sections.flatMap(s => s.rows.map(r => r.name))).not.toContain("Charcoal bags");
  }
});

it("still includes household-specific supplies in Personal Picks when applicable", () => {
  expect(buildPersonalized(["Flood"], ["infant", "pet"]).sections.flatMap(s => s.rows.map(r => r.name))).toEqual(expect.arrayContaining(["Infant supplies", "Pet supplies"]));
});