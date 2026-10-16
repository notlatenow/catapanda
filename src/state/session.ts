/**
 * In-memory session state for this visit only. Never persisted (privacy rule).
 */
import { useSyncExternalStore } from "react";
import type { HouseholdFact } from "@/services/catalog";

export type Session = {
  disasters: string[]; // in the order selected
  description: string;
  facts: HouseholdFact[]; // supplied by AI in a later stage
};

const initial: Session = { disasters: [], description: "", facts: [] };
let state: Session = initial;
const listeners = new Set<() => void>();

function set(next: Partial<Session>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export const session = {
  get: () => state,
  toggleDisaster: (name: string) =>
    set({ disasters: state.disasters.includes(name) ? state.disasters.filter((d) => d !== name) : [...state.disasters, name] }),
  setDescription: (description: string) => set({ description }),
  setFacts: (facts: HouseholdFact[]) => set({ facts }),
  reset: () => set(initial),
};

export function useSession(): Session {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => initial,
  );
}

export const DESCRIPTION_MIN = 10;
export const DESCRIPTION_MAX = 250;
