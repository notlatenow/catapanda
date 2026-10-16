/** Plain-logic checklist builder (no AI). AI layers on top in later stages. */
import { catalog, type CatalogItem, type HouseholdFact, type Priority } from "@/services/catalog";

export type Row = {
  name: string;
  shortNote: string;
  category: string;
  priority: Exclude<Priority, "conditional">;
  kind: "catalog" | "tip";
  stores: string[];
  sourceCount: number;
};

export type Section = { title: string; note?: string; rows: Row[] };
export type Checklist = { id: string; title: string; sections: Section[]; showStores: boolean; overlapLine?: string | undefined };

const rank: Record<Row["priority"], number> = { essential: 0, important: 1, "nice-to-have": 2 };

const householdNames = () => new Set(catalog.getHouseholdRules().map((r) => r.item));

function toRow(i: CatalogItem): Row {
  return {
    name: i.name,
    shortNote: i.shortNote,
    category: i.category,
    priority: i.priority === "conditional" ? "important" : i.priority,
    kind: "catalog",
    stores: i.stores,
    sourceCount: i.sources.length,
  };
}

export function sortRows(rows: Row[]): Row[] {
  return [...rows].sort((a, b) => rank[a.priority] - rank[b.priority] || b.sourceCount - a.sourceCount);
}

function itemsFor(disaster: string): CatalogItem[] {
  return [...catalog.getCoreItems(), ...catalog.getExtraItems(disaster)];
}

function isVisible(i: CatalogItem, facts: HouseholdFact[]) {
  const rule = catalog.getHouseholdRules().find((r) => r.item === i.name);
  return !rule || facts.includes(rule.fact);
}

function tipRows(): Row[] {
  return catalog.getCataPandaTips().map((t) => ({
    name: t.name,
    shortNote: t.shortNote,
    category: t.category,
    priority: t.priority === "conditional" ? "important" : t.priority,
    kind: "tip",
    stores: t.stores,
    sourceCount: t.sources.length,
  }));
}

export function buildDisasterList(disaster: string): Checklist {
  const hh = householdNames();
  const items = itemsFor(disaster);
  const main = sortRows(items.filter((i) => !hh.has(i.name)).map(toRow));
  const ruleOrder = catalog.getHouseholdRules().map((r) => r.item);
  const extra = items.filter((i) => hh.has(i.name)).sort((a, b) => ruleOrder.indexOf(a.name) - ruleOrder.indexOf(b.name)).map(toRow);
  const sections: Section[] = [{ title: disaster, rows: main }];
  if (extra.length) sections.push({ title: "If it applies to you", rows: extra });
  return { id: disaster, title: disaster, sections, showStores: false };
}

export function buildPersonalized(disasters: string[], facts: HouseholdFact[]): Checklist {
  const lists = disasters.map((d) => itemsFor(d).filter((i) => isVisible(i, facts)));
  const seen = new Set<string>();
  const all: CatalogItem[] = [];
  lists.flat().forEach((i) => {
    if (!seen.has(i.name)) { seen.add(i.name); all.push(i); }
  });
  const inEvery = (i: CatalogItem) => lists.every((l) => l.some((x) => x.name === i.name));
  const multi = disasters.length > 1;
  const combo = multi ? sortRows(all.filter(inEvery).map(toRow)) : [];
  const core = sortRows(all.filter((i) => !multi || !inEvery(i)).map(toRow));

  const sections: Section[] = [{ title: "Custom", note: "These are customized items based on the info you shared.", rows: tipRows() }];
  let overlapLine: string | undefined;
  if (multi) {
    sections.push({ title: "Combo", note: "These items overlap between the disasters you chose.", rows: combo });
    const total = combo.length + core.length;
    const pct = total ? Math.round((combo.length / total) * 100) : 0;
    overlapLine = `${pct}% of your items prepare you for ${disasters.length === 2 ? "both" : "all the disasters you chose"}`;
  }
  sections.push({ title: "Core", note: "These are the remaining disaster-specific items.", rows: core });
  return { id: "personalized", title: "Personalized checklist", sections, showStores: true, overlapLine };
}

export function buildTop10(personalized: Checklist): Checklist {
  const tips = tipRows();
  const bag = tips.find((t) => t.name === "Grab-and-go bag")!;
  const catalogRows = personalized.sections.filter((s) => s.title !== "Custom").flatMap((s) => s.rows);
  const water = catalogRows.find((r) => r.name === "Drinking water");
  const rest = sortRows(catalogRows.filter((r) => r.name !== "Drinking water"));
  const rows = [bag, ...(water ? [water] : []), ...rest].slice(0, 10);
  return { id: "top10", title: "Top 10", sections: [{ title: "Top 10", rows }], showStores: false };
}

export function buildAll(disasters: string[], facts: HouseholdFact[]) {
  const personalized = buildPersonalized(disasters, facts);
  return { top10: buildTop10(personalized), personalized, perDisaster: disasters.map(buildDisasterList) };
}

export const priorityLabel = (p: Row["priority"]) => ({ essential: "Essential", important: "Important", "nice-to-have": "Nice-to-have" })[p];
