/** Plain-logic validation of AI items (runs after every AI step). */
import { catalog } from "@/services/catalog";
import type { AIItem } from "@/lib/personalize-types";

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
export const MAX_AI_ITEMS = 8;
export const MAX_NOTE = 50;

export function validateItems(items: AIItem[]): AIItem[] {
  const cats = new Set(catalog.getCategories());
  const stores = new Set(catalog.getStoreTypes());
  const taken = new Set([...catalog.getAllItems().map((i) => norm(i.name)), ...catalog.getCataPandaTips().map((t) => norm(t.name))]);
  const out: AIItem[] = [];
  for (const i of items) {
    const name = i.name.trim();
    const note = i.shortNote.trim();
    if (!name || name.length > 60 || taken.has(norm(name))) continue;
    if (!cats.has(i.category)) continue;
    if (!["essential", "important", "nice-to-have"].includes(i.priority)) continue;
    if (!i.stores.every((s) => stores.has(s))) continue;
    if (!note || note.length > MAX_NOTE) continue;
    if (i.medical && (!/check with your doctor/i.test(note) || /\d/.test(note))) continue;
    taken.add(norm(name));
    out.push({ ...i, name, shortNote: note, stores: [...new Set(i.stores)] });
    if (out.length >= MAX_AI_ITEMS) break;
  }
  return out;
}
