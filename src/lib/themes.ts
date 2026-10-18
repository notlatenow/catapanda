/** Theme icons: every checklist item maps to one hand-drawn theme icon. */
import water from "@/assets/icons/theme-water.webp";
import food from "@/assets/icons/theme-food.webp";
import health from "@/assets/icons/theme-health.webp";
import hygiene from "@/assets/icons/theme-hygiene.webp";
import light from "@/assets/icons/theme-light.webp";
import radio from "@/assets/icons/theme-radio.webp";
import documents from "@/assets/icons/theme-documents.webp";
import money from "@/assets/icons/theme-money.webp";
import clothing from "@/assets/icons/theme-clothing.webp";
import tools from "@/assets/icons/theme-tools.webp";
import home from "@/assets/icons/theme-home.webp";
import bag from "@/assets/icons/theme-bag.webp";
import pets from "@/assets/icons/theme-pets.webp";
import aids from "@/assets/icons/theme-aids.webp";
import checklist from "@/assets/icons/theme-checklist.webp";

export type Theme =
  | "water" | "food" | "health" | "hygiene" | "light" | "radio" | "documents"
  | "money" | "clothing" | "tools" | "home" | "bag" | "pets" | "aids" | "checklist";

export const themeIcons: Record<Theme, string> = {
  water, food, health, hygiene, light, radio, documents, money, clothing, tools, home, bag, pets, aids, checklist,
};

const NAME_RULES: { match: RegExp; theme: Theme }[] = [
  { match: /grab.and.go|go bag|evacuation bag|backpack/i, theme: "bag" },
  { match: /pet|leash|\bdog\b|\bcat\b/i, theme: "pets" },
  { match: /personal aid|glasses|hearing|cane|walker|dentur|mobility|wheelchair/i, theme: "aids" },
  { match: /water|hydrat|purif|filter/i, theme: "water" },
  { match: /cash|money|atm/i, theme: "money" },
  { match: /document|identification|insurance|passport|info card|copies|records/i, theme: "documents" },
  { match: /radio|phone|charger|power bank|whistle|signal/i, theme: "radio" },
  { match: /flashlight|headlamp|lantern|candle|batter|light/i, theme: "light" },
  { match: /first aid|medication|medicine|medical|mask|thermometer|prescription/i, theme: "health" },
  { match: /hygiene|soap|toilet|sanit|towel|wipes|diaper/i, theme: "hygiene" },
  { match: /cloth|shoe|jacket|rain|blanket|glove|overall|warm/i, theme: "clothing" },
  { match: /tool|wrench|tape|extinguisher|rope|knife|opener/i, theme: "tools" },
  { match: /food|meal|formula|ration|snack/i, theme: "food" },
  { match: /home|house|smoke|shut.?off|furniture|anchor|bed/i, theme: "home" },
];

const CATEGORY_THEMES: Record<string, Theme> = {
  "Water & Food": "food",
  "First Aid & Medication": "health",
  "Hygiene & Sanitation": "hygiene",
  "Light, Power & Communication": "light",
  "Documents & Money": "documents",
  "Clothing & Protection": "clothing",
  "Tools & Support Aids": "tools",
  "Household & Special Needs": "home",
};

/** Pick the theme for an item by name first, then catalog category, then the checklist catch-all. */
export function themeFor(name: string, category?: string): Theme {
  const byName = NAME_RULES.find((r) => r.match.test(name));
  if (byName) return byName.theme;
  if (category && CATEGORY_THEMES[category]) return CATEGORY_THEMES[category];
  return "checklist";
}
