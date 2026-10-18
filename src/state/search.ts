import { searchNicheNeed } from "@/lib/search.functions";
import { genericSearchNeeds } from "@/lib/search-policy";
import type { SearchResult } from "@/lib/search-types";
import type { QA } from "@/lib/personalize-types";
import { session } from "@/state/session";

let visit = -1;
let searches = new Map<string, Promise<SearchResult[]>>();

function prepare(texts: string[], answers: QA[] = []) {
  if (visit !== session.get().visit) {
    visit = session.get().visit;
    searches = new Map();
  }
  const needs = genericSearchNeeds(texts, answers);
  for (const query of needs) {
    if (searches.has(query) || searches.size >= 3) continue;
    // Cache failed attempts too: back navigation cannot exceed the visit budget.
    searches.set(query, searchNicheNeed({ data: { query } }).catch(() => []));
  }
  return needs.flatMap((query) => {
    const pending = searches.get(query);
    return pending ? [pending] : [];
  });
}

/** True when this visit has official-site searches (for the loading message). */
export function hasSearches() { return visit === session.get().visit && searches.size > 0; }

export function startBackgroundSearch(searchNeeds: string[]) { prepare(searchNeeds); }

/**
 * "Verify this" for item panels: maps an item name to a fixed generic query
 * (never the raw name) and searches within the visit budget. Returns the first
 * official-source result, or null when no generic query matches or the budget
 * is spent.
 */
export async function verifyItemSource(name: string): Promise<SearchResult | null> {
  if (visit !== session.get().visit) {
    visit = session.get().visit;
    searches = new Map();
  }
  const [query] = genericSearchNeeds([name]);
  if (!query) return null;
  if (!searches.has(query)) {
    if (searches.size >= 3) return null;
    searches.set(query, searchNicheNeed({ data: { query } }).catch(() => []));
  }
  const results = await searches.get(query);
  return results?.[0] ?? null;
}

export async function collectSearchResults(description: string, answers: QA[]): Promise<SearchResult[]> {
  const results = (await Promise.all(prepare([description, ...(session.get().clarify?.searchNeeds ?? [])], answers))).flat();
  return [...new Map(results.map((r) => [r.link, r])).values()];
}