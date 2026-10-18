/** Plain-logic checklist builder (no AI). AI layers on top in later stages. */
import { catalog, type CatalogItem, type HouseholdFact, type Priority } from "@/services/catalog";
import type { AIItem, TopPick } from "@/lib/personalize-types";
import { themeFor, type Theme } from "@/lib/themes";

export type AIInput = { items: AIItem[]; top: TopPick[] } | null;

export type Row = {
  name: string;
  shortNote: string;
  category: string;
  priority: Exclude<Priority, "conditional">;
  kind: "catalog" | "tip" | "ai";
  why?: string;
  stores: string[];
  sourceCount: number;
  sourceUrl?: string | null | undefined;
  theme: Theme;
  detail?: string | undefined;
  sourceCodes: string[];
  medical?: boolean | undefined;
  disaster?: string | undefined;
};

export type Section = { title: string; note?: string; rows: Row[] };
export type Checklist = { id: string; title: string; sections: Section[]; showStores: boolean; overlapLine?: string | undefined };

/** Catalog-backed advice, kept separate from the ten ranked items and sharing. */
export function buildDisasterAdvice(disasters: string[]): Section {
  return {
    title: "Disaster dos & don'ts",
    rows: disasters.flatMap(disaster => (catalog.getDisaster(disaster)?.tips ?? []).slice(0, 3).map(tip => ({
      name: tip.text,
      shortNote: "",
      category: "Disaster advice",
      priority: "important" as const,
      kind: "tip" as const,
      stores: [],
      sourceCount: tip.sources.length,
      sourceCodes: tip.sources,
      theme: "checklist" as const,
      disaster,
    }))),
  };
}

const rank: Record<Row["priority"], number> = { essential: 0, important: 1, "nice-to-have": 2 };

const householdNames = () => new Set(catalog.getHouseholdRules().map((r) => r.item));

function toRow(i: CatalogItem): Row {
  return {
    name: i.name,
    shortNote: i.shortNote,
    category: i.category,
    priority: i.priority === "conditional" ? "important" : i.priority,
    kind: i.badge === "cataPandaTip" ? "tip" : "catalog",
    stores: i.stores,
    sourceCount: i.sources.length,
    theme: themeFor(i.name, i.category),
    detail: i.detailNotes,
    sourceCodes: i.sources,
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
    theme: themeFor(t.name, t.category),
    sourceCodes: t.sources,
  }));
}

function aiRow(i: AIItem): Row {
  return { name: i.name, shortNote: i.shortNote, category: i.category, priority: i.priority, kind: "ai", stores: i.stores, sourceCount: 0, sourceUrl: i.sourceUrl, theme: themeFor(i.name, i.category), sourceCodes: [], medical: i.medical };
}

export function buildDisasterList(disaster: string): Checklist {
  const hh = householdNames();
  const items = itemsFor(disaster);
  const main = sortRows(items.filter((i) => !hh.has(i.name) || i.scope === disaster).map(toRow));
  const sections: Section[] = [{ title: "Standard items", rows: main }];
  return { id: disaster, title: disaster, sections, showStores: false };
}

/** Sized water note when the AI confidently read a household size (3 L/person/day × 3 days). */
const waterNote = (people: number) => `For ${people} ${people === 1 ? "person" : "people"}: ~${people * 9} L for 3 days`;

export function buildPersonalized(disasters: string[], facts: HouseholdFact[], ai: AIInput = null, people: number | null = null): Checklist {
  const lists = disasters.map((d) => itemsFor(d).filter((i) => isVisible(i, facts)));
  const seen = new Set<string>();
  const all: CatalogItem[] = [];
  lists.flat().forEach((i) => {
    if (!seen.has(i.name)) { seen.add(i.name); all.push(i); }
  });
  const inEvery = (i: CatalogItem) => lists.every((l) => l.some((x) => x.name === i.name));
  const multi = disasters.length > 1;

  // AI items: specialization pairs move their catalog item into Custom.
  const byName = new Map(all.map((i) => [i.name, i]));
  const cats = catalog.getCategories();
  const norm = (n: string) => n.trim().toLowerCase();
  const catalogNames = new Set(all.map((i) => norm(i.name)));
  const aiItems = [...(ai?.items ?? [])]
    .map((i) => (i.specializes && !byName.has(i.specializes) ? { ...i, specializes: null } : i))
    // Drop AI picks that duplicate a catalog item already shown in the Basics lists.
    .filter((i, index, arr) =>
      i.specializes ||
      (!catalogNames.has(norm(i.name)) &&
        arr.findIndex((x) => !x.specializes && norm(x.name) === norm(i.name)) === index))
    .sort((a, b) => cats.indexOf(a.category) - cats.indexOf(b.category));
  const paired = new Set(aiItems.map((i) => i.specializes).filter((n): n is string => !!n));
  const custom: Row[] = tipRows();
  const emitted = new Set<string>();
  for (const i of aiItems) {
    if (!i.specializes) { custom.push(aiRow(i)); continue; }
    if (emitted.has(i.specializes)) continue;
    emitted.add(i.specializes);
    custom.push(toRow(byName.get(i.specializes)!), ...aiItems.filter((x) => x.specializes === i.specializes).map(aiRow));
  }
  const rest = all.filter((i) => !paired.has(i.name));
  const combo = multi ? sortRows(rest.filter(inEvery).map(toRow)) : [];
  const core = sortRows(rest.filter((i) => !multi || !inEvery(i)).map(toRow));

  const sections: Section[] = [{ title: "Custom", note: "These are customized items based on the info you shared.", rows: custom }];
  let overlapLine: string | undefined;
  if (multi) {
    sections.push({ title: "Combo", note: "These items overlap between the disasters you chose.", rows: combo });
    const total = combo.length + core.length;
    const pct = total ? Math.round((combo.length / total) * 100) : 0;
    overlapLine = `${pct}% of your items prepare you for ${disasters.length === 2 ? "both" : "all the disasters you chose"}`;
  }
  sections.push({ title: "Core", note: "These are the remaining disaster-specific items.", rows: core });
  if (people && people > 0) {
    for (const s of sections) {
      const w = s.rows.find((r) => r.name === "Drinking water");
      if (w) w.shortNote = waterNote(people);
    }
  }
  return { id: "personalized", title: "Personalized checklist", sections, showStores: true, overlapLine };
}

export function buildTop10(personalized: Checklist, top: TopPick[] = []): Checklist & { aiRanked: boolean } {
  const tips = tipRows();
  const [firstName, secondName] = catalog.getTopTenFixed();
  const shown = new Map(personalized.sections.flatMap((s) => s.rows).map((r) => [r.name, r]));
  const bag = tips.find((t) => t.name === firstName) ?? shown.get(firstName)!;
  const water = shown.get(secondName);
  const names = top.map((t) => t.name);
  const valid = names.length === 8 && new Set(names).size === 8 && names.every((n) => shown.has(n) && n !== firstName && n !== secondName);
  if (valid && water) {
    const rows = [bag, water, ...top.map((t) => ({ ...shown.get(t.name)!, why: t.why }))];
    return { id: "top10", title: "Top Tips", sections: [{ title: "Top Tips", rows }], showStores: false, aiRanked: true };
  }
  const catalogRows = personalized.sections.flatMap((s) => s.rows).filter((r) => r.kind === "catalog");
  const rest = sortRows(catalogRows.filter((r) => r.name !== secondName));
  const rows = [bag, ...(water ? [water] : []), ...rest].slice(0, 10);
  return { id: "top10", title: "Top Tips", sections: [{ title: "Top Tips", rows }], showStores: false, aiRanked: false };
}

export function buildAll(disasters: string[], facts: HouseholdFact[], ai: AIInput = null, people: number | null = null) {
  const personalized = buildPersonalized(disasters, facts, ai, people);
  return { top10: buildTop10(personalized, ai?.top), personalized, perDisaster: disasters.map(buildDisasterList) };
}

export const priorityLabel = (p: Row["priority"]) => ({ essential: "Essential", important: "Important", "nice-to-have": "Nice-to-have" })[p];
