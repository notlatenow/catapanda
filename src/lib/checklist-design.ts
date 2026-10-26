/** Presentation-only grouping: original ranked rows remain intact for Top Tips and sharing. */
import { catalog } from "@/services/catalog";
import { buildDisasterList, sortRows, type Checklist, type Row } from "@/lib/checklists";
import type { Theme } from "@/lib/themes";

export type DetailRow = Row & { displayName?: string | undefined; contents?: DetailRow[]; appliesTo?: string[]; forYou?: boolean | undefined };
export type DesignedList = Omit<Checklist, "sections"> & {
  sections: { title: string; note?: string | undefined; icon?: Theme | undefined; rows: DetailRow[] }[];
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

/** Six broad categories replace the old For you / Essentials split; rows carry a forYou flag instead. */
const CATEGORY_ORDER: { title: string; icon: Theme }[] = [
  { title: "Food & Water", icon: "food" },
  { title: "Health & Wellness", icon: "health" },
  { title: "Tools & Safety", icon: "tools" },
  { title: "Power & Communication", icon: "light" },
  { title: "Documents & Money", icon: "documents" },
  { title: "Go-bag", icon: "bag" },
];

const BABY = /baby|infant|formula|pacifier/i;

const THEME_CATEGORY: Record<Theme, string> = {
  water: "Food & Water", food: "Food & Water", pets: "Food & Water",
  health: "Health & Wellness", hygiene: "Health & Wellness", aids: "Health & Wellness", home: "Health & Wellness",
  tools: "Tools & Safety", clothing: "Tools & Safety", checklist: "Tools & Safety",
  light: "Power & Communication", radio: "Power & Communication",
  documents: "Documents & Money", money: "Documents & Money",
  bag: "Go-bag",
};

const CATALOG_CATEGORY: Record<string, string> = {
  "Water & Food": "Food & Water",
  "First Aid & Medication": "Health & Wellness",
  "Hygiene & Sanitation": "Health & Wellness",
  "Tools & Support Aids": "Tools & Safety",
  "Clothing & Protection": "Tools & Safety",
  "Light, Power & Communication": "Power & Communication",
  "Documents & Money": "Documents & Money",
};

function categoryFor(row: DetailRow): string {
  if (row.name === "Grab-and-go bag" || row.name === "Spare clothing, incl. a raincoat") return "Go-bag";
  if (row.theme === "pets" || BABY.test(row.name)) return "Food & Water";
  return CATALOG_CATEGORY[row.category] ?? THEME_CATEGORY[row.theme];
}

/** Baby and pet supplies collapse into one labelled group each, keeping every member row in contents. */
function makeGroup(label: string, members: DetailRow[], disasters: string[]): DetailRow {
  const sorted = sortRows(members) as DetailRow[];
  const root = sorted[0]!;
  return { ...root, displayName: label, forYou: true, contents: sorted.slice(1), appliesTo: disasters };
}

export function designPersonalPicks(original: Checklist, disasters: string[]): DesignedList {
  const household = new Set(catalog.getHouseholdRules().map(r => r.item));
  const customNames = new Set(original.sections.find(s => s.title === "Custom")?.rows.map(r => r.name));
  const all = original.sections.flatMap(s => s.rows);
  const flagged = bundleRows(all.map(r => ({ ...decorate(r, disasters), forYou: customNames.has(r.name) || household.has(r.name) })));
  const grouped = new Set<string>();
  const bundles: DetailRow[] = [];
  const baby = flagged.filter(r => BABY.test(r.name));
  const pets = flagged.filter(r => r.theme === "pets");
  if (baby.length > 1) { baby.forEach(r => grouped.add(r.name)); bundles.push(makeGroup("Baby care", baby, disasters)); }
  if (pets.length > 1) { pets.forEach(r => grouped.add(r.name)); bundles.push(makeGroup("Pet care", pets, disasters)); }
  const flat = [...flagged.filter(r => !grouped.has(r.name)), ...bundles];
  const sections = CATEGORY_ORDER
    .map(c => ({ title: c.title, icon: c.icon, rows: sortRows(flat.filter(r => categoryFor(r) === c.title)) as DetailRow[] }))
    .filter(s => s.rows.length);
  return { ...original, title: "Personal Picks", sections };
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