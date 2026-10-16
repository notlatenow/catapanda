/** Plain-logic validation of AI items (runs after every AI step). */
import { catalog } from "@/services/catalog";
import type { AIItem } from "@/lib/personalize-types";

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
export const MAX_AI_ITEMS = 8;
export const MAX_NOTE = 50;
const DOCTOR = /check with your doctor/i;
/** Quantities, dosages or runtimes (e.g. "500 mg", "8 hours", "2 tablets"). Plain digits are fine. */
const DOSE = /\d+(\.\d+)?\s*(mg|mcg|µg|ml|g|iu|units?|tablets?|pills?|capsules?|doses?|hours?|hrs?|h|minutes?|mins?|days?|%|mah|wh)\b/i;

export function validateItems(items: AIItem[]): AIItem[] {
  const cats = new Set(catalog.getCategories());
  const stores = new Set(catalog.getStoreTypes());
  const taken = new Set([...catalog.getAllItems().map((i) => norm(i.name)), ...catalog.getCataPandaTips().map((t) => norm(t.name))]);
  const out: AIItem[] = [];
  for (const i of items) {
    const name = i.name.trim();
    let note = i.shortNote.trim();
    if (i.medical && !DOCTOR.test(note)) {
      const withDoctor = `${note.replace(/[.\s]+$/, "")}. Check with your doctor`;
      if (withDoctor.length <= MAX_NOTE) note = withDoctor;
    }
    if (!name || name.length > 60 || taken.has(norm(name))) continue;
    if (!cats.has(i.category)) continue;
    if (!["essential", "important", "nice-to-have"].includes(i.priority)) continue;
    if (!i.stores.every((s) => stores.has(s))) continue;
    if (!note || note.length > MAX_NOTE) continue;
    if (i.medical && (!DOCTOR.test(note) || DOSE.test(note))) continue;
    taken.add(norm(name));
    out.push({ ...i, name, shortNote: note, stores: [...new Set(i.stores)] });
    if (out.length >= MAX_AI_ITEMS) break;
  }
  return out;
}
