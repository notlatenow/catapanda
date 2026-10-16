import { createServerOnlyFn } from "@tanstack/react-start";
import { catalog } from "@/services/catalog";
import { isAllowedSearchUrl, isGenericSearchQuery } from "@/lib/search-policy";
import type { SearchResult } from "@/lib/search-types";
import { isAIEnabled } from "@/lib/ai.server";

/** The only search-provider boundary. Never logs queries, results, or personal data. */
export const runSearch = createServerOnlyFn(async (query: string): Promise<SearchResult[]> => {
  if (!isAIEnabled() || /^(false|off|0|no)$/i.test(process.env['SEARCH_ENABLED'] ?? "")) return [];
  if (!isGenericSearchQuery(query)) return [];
  const key = process.env['LOVABLE_API_KEY'];
  const connection = process.env['PERPLEXITY_API_KEY'];
  if (!key || !connection) return [];
  try {
    const response = await fetch("https://connector-gateway.lovable.dev/perplexity/search", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "X-Connection-Api-Key": connection, "Content-Type": "application/json" },
      body: JSON.stringify({ query, max_results: 3, search_domain_filter: catalog.getAllowedSites() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return [];
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("results" in data) || !Array.isArray(data.results)) return [];
    return data.results.flatMap((r: unknown) => {
      if (!r || typeof r !== "object" || !("url" in r) || typeof r.url !== "string" || !isAllowedSearchUrl(r.url)) return [];
      if (!("title" in r) || typeof r.title !== "string") return [];
      const snippet = "snippet" in r && typeof r.snippet === "string" ? r.snippet : "";
      return [{ title: r.title.slice(0, 300), link: r.url, snippet: snippet.slice(0, 1500) }];
    }).slice(0, 3);
  } catch { return []; }
});