/** Presentation-only grouping: original ranked rows remain intact for Top Tips and sharing. */
import { catalog } from "@/services/catalog";
import { buildDisasterList, sortRows, type Checklist, type Row } from "@/lib/checklists";

export type DetailRow = Row & { displayName?: string | undefined; contents?: DetailRow[]; appliesTo?: string[] };
export type DesignedList = Omit<Checklist, "sections"> & {
  sections: { title: string; note?: string | undefined; rows: DetailRow[] }[];
  overlap?: { shared: number; total: number; percent: number };
};

const aliases: Record<string, string> = {
  "Non-perishable / ready-to-eat food": "Food supplies",
  "Personal aids: vision, hearing, mobility": "Mobility & personal aids",
  "Pet supplies": "Pet essentials",
  "Power bank & charging cable": "Phone power supplies",
  "Copies of ID card & health/insurance card": "Important documents",
};

function decorate(row: Row, disasters: string[]): DetailRow {
  const item = catalog.getItem(row.name);
  return { ...row, displayName: aliases[row.name] ?? row.name, appliesTo: item?.scope && item.scope !== "core" ? disasters.filter(d => d === item.scope) : disasters };
}

/** Bundles keep every underlying catalog row and its source information in their contents. */
export function bundleRows(rows: DetailRow[]): DetailRow[] {
  const used = new Set<string>();
  const groups: { root: string; names: string[]; label?: string }[] = [
    { root: "Grab-and-go bag", names: ["Flashlight or headlamp", "Spare batteries", "Portable radio", "Whistle", "Spare clothing, incl. a raincoat"] },
    { root: "Soap & personal hygiene items", names: ["Hand sanitiser, wet wipes, tissues", "Sanitary pads / diapers"], label: "Hygiene supplies" },
    { root: "Copies of ID card & health/insurance card", names: ["List of essential phone numbers"] },
  ];
  for (const theme of ["aids", "pets"] as const) {
    const members = rows.filter(r => r.theme === theme);
    const first = members[0];
    if (first && members.length > 1) groups.push({ root: first.name, names: members.slice(1).map(r => r.name), label: theme === "aids" ? "Mobility & personal aids" : "Pet essentials" });
  }
  const output = rows.map(row => {
    const group = groups.find(g => g.root === row.name);
    if (!group) return row;
    const contents = rows.filter(r => group.names.includes(r.name));
    contents.forEach(r => used.add(r.name));
    return { ...row, displayName: group.label ?? row.displayName, contents: [...(row.contents ?? []), ...contents] };
  });
  return output.filter(row => !used.has(row.name));
}

export function designPersonalPicks(original: Checklist, disasters: string[]): DesignedList {
  const household = new Set(catalog.getHouseholdRules().map(r => r.item));
  const all = original.sections.flatMap(s => s.rows);
  const customNames = new Set(original.sections.find(s => s.title === "Custom")?.rows.map(r => r.name));
  const forYou = sortRows(all.filter(r => r.name !== "Grab-and-go bag" && (customNames.has(r.name) || household.has(r.name))));
  const standard = sortRows(all.filter(r => r.kind === "catalog" && !customNames.has(r.name) && !household.has(r.name) && r.priority !== "nice-to-have"));
  const bag = all.find(r => r.name === "Grab-and-go bag");
  // Keep the priority shortlist approachable; the complete standard list is in Disaster Basics.
  const essentials = [...(bag ? [bag] : []), ...standard.filter(r => r.priority === "essential" || ["Personal medications", "Power bank & charging cable", "Copies of ID card & health/insurance card", "Spare clothing, incl. a raincoat"].includes(r.name))];
  return { ...original, title: "Personal Picks", sections: [
    { title: "For you", note: "Your household’s priority needs", rows: bundleRows(forYou.map(r => decorate(r, disasters))) },
    { title: "Essentials", note: "The most important shared supplies", rows: bundleRows(essentials.map(r => decorate(r, disasters))) },
  ] };
}

export function buildDisasterBasics(selected: string[]): DesignedList {
  const disasters = [...new Set(selected)];
  const lists = disasters.map(d => buildDisasterList(d).sections.flatMap(s => s.rows));
  const unique = new Map<string, DetailRow>();
  for (const rows of lists) for (const row of rows) {
    const previous = unique.get(row.name);
    if (!previous) unique.set(row.name, decorate(row, disasters));
  }
  const rows = sortRows([...unique.values()]) as DetailRow[];
  const shared = rows.filter(r => lists.every(l => l.some(i => i.name === r.name))).length;
  const priority = rows.filter(r => r.priority !== "nice-to-have");
  const optional = rows.filter(r => r.priority === "nice-to-have");
  // The bag is an existing catalog-backed CataPanda tip, not a new government item.
  if (disasters.length === 1) {
    const tip = catalog.getCataPandaTips().find(t => t.name === "Grab-and-go bag");
    if (tip) priority.unshift({ name: tip.name, shortNote: tip.shortNote, priority: "essential", kind: "tip", category: tip.category, stores: tip.stores, sourceCount: tip.sources.length, sourceCodes: tip.sources, theme: "bag", appliesTo: disasters });
  }
  return { id: "basics", title: "Disaster Basics", showStores: false,
    overlap: { shared, total: rows.length, percent: rows.length ? Math.round(shared / rows.length * 100) : 0 },
    sections: [
      { title: "Priority items", note: disasters.length > 1 ? `One kit for ${disasters.length === 2 ? "both disasters" : "all selected disasters"}` : undefined, rows: disasters.length === 1 ? bundleRows(priority) : priority },
      { title: "Nice-to-Have", rows: disasters.length === 1 ? bundleRows(optional) : optional },
    ] };
}