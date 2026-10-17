/**
 * Catalog service — the ONLY module that reads catalog data files.
 * To swap the data source later, replace the `source` object below.
 */
import itemsData from "@/data/catalog/items.json";
import disastersData from "@/data/catalog/disasters.json";
import referenceData from "@/data/catalog/reference.json";
import allowedSitesData from "@/data/catalog/allowed-sites.json";
import regionsData from "@/data/catalog/regions.json";

export type Priority = "essential" | "important" | "nice-to-have" | "conditional";
export type HouseholdFact = "infant" | "elderly" | "personalAids" | "pet";
export type SourcedText = { text: string; sources: string[] };

export type CatalogItem = {
  name: string;
  scope: "core" | string; // "core" or a disaster name
  category: string;
  shortNote: string;
  shortNoteTeamWritten?: boolean;
  priority: Priority;
  sources: string[];
  stores: string[];
  detailNotes?: string;
  teamNote?: string;
  /** "cataPandaTip" shows the item with the CataPanda Tip label instead of Gov-vetted. */
  badge?: "cataPandaTip";
};
export type Disaster = { name: string; tagline: string; tipsIntro: string; tips: SourcedText[] };
export type Source = {
  code: string; country: string; agency: string; document: string;
  websites: string[]; websiteNote?: string;
};
export type CataPandaTip = {
  name: string; shortNote: string; priority: Priority; category: string;
  stores: string[]; sources: string[]; basis: string;
};
export type HouseholdRule = { item: string; fact: HouseholdFact; shownWhen: string };

type CatalogSource = {
  items: CatalogItem[];
  disasters: Disaster[];
  categories: string[];
  storeTypes: string[];
  priorities: Priority[];
  sources: Source[];
  bagTips: SourcedText[];
  cataPandaTips: CataPandaTip[];
  householdRules: HouseholdRule[];
  topTenFixed: [string, string];
};

const source: CatalogSource = {
  items: itemsData as CatalogItem[],
  disasters: disastersData as Disaster[],
  ...(referenceData as Omit<CatalogSource, "items" | "disasters">),
};

export const catalog = {
  getRegions: (): string[] => [...regionsData],
  getAllowedSites: (): string[] => [...allowedSitesData],
  getDisasters: () => source.disasters,
  getDisaster: (name: string) => source.disasters.find((d) => d.name === name),
  getCategories: () => source.categories,
  getStoreTypes: () => source.storeTypes,
  getPriorities: () => source.priorities,
  getSources: () => source.sources,
  getSource: (code: string) => source.sources.find((s) => s.code === code),
  getBagTips: () => source.bagTips,
  getCataPandaTips: () => source.cataPandaTips,
  getHouseholdRules: () => source.householdRules,
  /** Names fixed at Top 10 #1 and #2. */
  getTopTenFixed: () => source.topTenFixed,
  getAllItems: () => source.items,
  getItem: (name: string) => source.items.find((i) => i.name === name),
  getCoreItems: () => source.items.filter((i) => i.scope === "core"),
  getExtraItems: (disaster: string) => source.items.filter((i) => i.scope === disaster),
};
