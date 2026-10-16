import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { genericSearchNeeds, isAllowedSearchUrl } from "@/lib/search-policy";
import { validateItems } from "@/lib/personalize-validate";
import type { AIItem } from "@/lib/personalize-types";

vi.mock("@tanstack/react-start", () => ({ createServerOnlyFn: (fn: unknown) => fn }));
vi.mock("@/lib/ai.server", () => ({ isAIEnabled: () => !/^(false|off|0)$/i.test(process.env['AI_ENABLED'] ?? "") }));
vi.mock("@/lib/search.functions", () => ({ searchNicheNeed: vi.fn(async () => []) }));
import { runSearch } from "@/lib/search.server";
import { searchNicheNeed } from "@/lib/search.functions";
import { startBackgroundSearch, collectSearchResults } from "@/state/search";
import { session } from "@/state/session";

const link = "https://www.fda.gov/medical-devices/emergency-preparedness";
const item: AIItem = { name: "Compatible oxygen backup power", category: "Light, Power & Communication", priority: "important", shortNote: "Check with your doctor", stores: ["Hardware"], medical: true, specializes: null, sourceUrl: link };

beforeEach(() => { vi.stubEnv("LOVABLE_API_KEY", "test"); vi.stubEnv("PERPLEXITY_API_KEY", "test"); vi.stubEnv("AI_ENABLED", "on"); vi.stubEnv("SEARCH_ENABLED", "on"); session.reset(); vi.clearAllMocks(); });
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("search privacy and sources", () => {
  it("uses only fixed generic needs, never personal identifiers", () => {
    expect(genericSearchNeeds(["My mother Jane, 74, in Taipei uses an oxygen concentrator"])).toEqual(["oxygen concentrator power outage backup"]);
    expect(genericSearchNeeds(["I live alone. Pregnant wife, wheat-free dog food, sensitive skin and vegan diet"])).toEqual([]);
    expect(genericSearchNeeds([], [{ question: "Do you use a CPAP?", answer: "No" }])).toEqual([]);
    expect(genericSearchNeeds([], [{ question: "Any medical equipment?", answer: "My mother uses CPAP" }])).toEqual(["CPAP emergency power outage preparation"]);
  });
  it("rejects lookalike domains and unsafe protocols", () => {
    expect(isAllowedSearchUrl("https://www.mohw.gov.tw/page")).toBe(true);
    for (const bad of ["https://gov.tw.evil.com", "https://evilgov.tw", "http://who.int", "javascript:alert(1)", "https://user@who.int"]) expect(isAllowedSearchUrl(bad)).toBe(false);
  });
  it("accepts only an exact returned official link", () => {
    const results = [{ title: "FDA", link, snippet: "Official guidance" }];
    expect(validateItems([item], results)[0]?.sourceUrl).toBe(link);
    expect(validateItems([item])[0]?.sourceUrl).toBeNull();
    expect(validateItems([{ ...item, sourceUrl: `${link}#other` }], results)[0]?.sourceUrl).toBeNull();
    expect(validateItems([{ ...item, shortNote: "Battery lasts 8 hours" }], results)).toEqual([]);
  });
});

describe("provider boundary", () => {
  it("filters returned URLs and restricts the provider call", async () => {
    const fetcher = vi.fn(async () => Response.json({ results: [{ title: "FDA", url: link, snippet: "Guidance" }, { title: "Bad", url: "https://example.com", snippet: "x" }] }));
    vi.stubGlobal("fetch", fetcher);
    expect(await runSearch("oxygen concentrator power outage backup")).toEqual([{ title: "FDA", link, snippet: "Guidance" }]);
    const body = JSON.parse(fetcher.mock.calls[0]?.[1]?.body as string);
    expect(body.search_domain_filter).toContain("gov.tw");
    expect(body.query).toBe("oxygen concentrator power outage backup");
  });
  it("does not call provider when off or with personal query text", async () => {
    const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
    vi.stubEnv("SEARCH_ENABLED", "false");
    expect(await runSearch("oxygen concentrator power outage backup")).toEqual([]);
    vi.stubEnv("SEARCH_ENABLED", "on"); vi.stubEnv("AI_ENABLED", "false");
    expect(await runSearch("oxygen concentrator power outage backup")).toEqual([]);
    vi.stubEnv("AI_ENABLED", "on");
    expect(await runSearch("Jane's oxygen machine in Taipei")).toEqual([]);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("returns empty on failures and timeout", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("Unavailable", { status: 503 })));
    expect(await runSearch("oxygen concentrator power outage backup")).toEqual([]);
    vi.stubGlobal("fetch", vi.fn(async () => { throw new DOMException("Timeout", "TimeoutError"); }));
    expect(await runSearch("oxygen concentrator power outage backup")).toEqual([]);
  });
});

describe("visit search budget", () => {
  it("shares background work, adds answer needs, and never exceeds three attempts", async () => {
    startBackgroundSearch(["oxygen concentrator power outage backup"]);
    await collectSearchResults("oxygen machine", [{ question: "Equipment?", answer: "CPAP and dialysis" }]);
    await collectSearchResults("ventilator", []);
    expect(searchNicheNeed).toHaveBeenCalledTimes(3);
    startBackgroundSearch(["oxygen concentrator power outage backup"]);
    expect(searchNicheNeed).toHaveBeenCalledTimes(3);
    session.reset(); startBackgroundSearch(["ventilator"]);
    expect(searchNicheNeed).toHaveBeenCalledTimes(4);
  });
});