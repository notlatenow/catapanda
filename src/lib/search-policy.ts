import { catalog } from "@/services/catalog";
import type { QA } from "@/lib/personalize-types";

export function isAllowedSearchUrl(link: string): boolean {
  try {
    const url = new URL(link);
    return url.protocol === "https:" && !url.username && !url.password &&
      catalog.getAllowedSites().some((d) => url.hostname === d || url.hostname.endsWith(`.${d}`));
  } catch { return false; }
}

// Only these fixed, generic queries ever leave the app. Raw text is never a query.
const NEEDS: { match: RegExp; query: string }[] = [
  { match: /oxygen|concentrator/i, query: "oxygen concentrator power outage backup" },
  { match: /cpap|sleep apn[eo]a/i, query: "CPAP emergency power outage preparation" },
  { match: /ventilator|respirator/i, query: "home ventilator emergency power backup" },
  { match: /dialysis/i, query: "dialysis solution storage emergency preparation" },
  { match: /insulin pump|insulin.*refrigerat/i, query: "insulin pump emergency power and storage" },
  { match: /feeding pump|enteral|tube feed/i, query: "enteral feeding pump power outage preparation" },
  { match: /powered wheelchair|electric wheelchair/i, query: "powered wheelchair emergency power backup" },
  { match: /anaphyla|severe allerg|rare allerg|life.threatening allerg/i, query: "severe allergy emergency supplies disaster preparation" },
  { match: /medical device.*(?:regulation|import)|(?:regulation|import).*medical device/i, query: "Taiwan medical device emergency preparation regulations" },
  // Generic "verify this" queries for item panels. Item names are matched locally;
  // only these fixed query strings ever reach the search provider.
  { match: /glasses|contact lens/i, query: "emergency kit spare glasses contact lenses preparedness" },
  { match: /hearing aid/i, query: "hearing aid batteries emergency preparedness" },
  { match: /cane|walker|crutch|mobility aid/i, query: "mobility aid emergency evacuation preparedness" },
  { match: /dentur/i, query: "denture care emergency kit preparedness" },
  { match: /pet|leash|\bdog\b|\bcat\b/i, query: "pet disaster preparedness kit" },
  { match: /infant|baby|formula|diaper/i, query: "infant emergency kit preparedness" },
  { match: /grab.and.go|go bag|evacuation bag|backpack/i, query: "emergency go bag checklist" },
  { match: /document|insurance|passport|records/i, query: "important documents emergency preparedness" },
  { match: /medication|prescription|medicine/i, query: "emergency medication supply preparedness" },
  { match: /cash|money|atm/i, query: "emergency cash small bills preparedness" },
];

export function genericSearchNeeds(texts: string[], answers: QA[] = []): string[] {
  const affirmative = answers.flatMap((a) => {
    if (/^(no|none|not applicable|don't|do not)\b/i.test(a.answer.trim())) return [];
    // Question text is evidence only when explicitly answered yes; free text stands alone.
    return [/^yes\b/i.test(a.answer) ? `${a.question} ${a.answer}` : a.answer];
  });
  const evidence = [...texts, ...affirmative];
  return NEEDS.filter((n) => evidence.some((t) => n.match.test(t))).map((n) => n.query);
}

export const isGenericSearchQuery = (query: string) => NEEDS.some((n) => n.query === query);