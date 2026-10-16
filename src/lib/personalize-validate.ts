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
      const suffix = " (Check with your doctor)";
      const room = MAX_NOTE - suffix.length;
      let base = note.replace(/[.\s]+$/, "");
      if (base.length > room) {
        base = base.slice(0, room);
        const cut = base.lastIndexOf(" ");
        if (cut > room / 2) base = base.slice(0, cut);
        base = base.replace(/[\s,;:.–-]+$/, "");
      }
      note = base ? `${base}${suffix}` : "Check with your doctor";
    }
    if (!name || name.length > 60 || taken.has(norm(name))) continue;
    if (!cats.has(i.category)) continue;
    if (!["essential", "important", "nice-to-have"].includes(i.priority)) continue;
    const validStores = [...new Set(i.stores.filter((s) => stores.has(s)))];
    if (!note || note.length > MAX_NOTE) continue;
    if (i.medical && (!DOCTOR.test(note) || DOSE.test(note))) continue;
    taken.add(norm(name));
    out.push({ ...i, name, shortNote: note, stores: validStores });
    if (out.length >= MAX_AI_ITEMS) break;
  }
  return out;
}
