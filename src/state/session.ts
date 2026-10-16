/**
 * In-memory session state for this visit only. Never persisted (privacy rule).
 */
import { useSyncExternalStore } from "react";
import type { HouseholdFact } from "@/services/catalog";
import type { Answer, ClarifyQuestion } from "@/lib/clarify-types";
import type { AIItem, TopPick } from "@/lib/personalize-types";

export type Clarify = { key: string; questions: ClarifyQuestion[]; searchNeeds: string[] };

export type Personal = {
  key: string;
  status: "running" | "done" | "fallback";
  phase: 0 | 1; // 0 = Suggest, 1 = Review
  facts: HouseholdFact[];
  items: AIItem[];
  top: TopPick[];
};

export type Session = {
  visit: number;
  disasters: string[]; // in the order selected
  description: string;
  facts: HouseholdFact[]; // supplied by AI in a later stage
  clarify: Clarify | null; // result for the current disasters + description
  answers: Record<string, Answer>;
  personal: Personal | null; // AI personalization for the current inputs
};

const initial: Session = { visit: 0, disasters: [], description: "", facts: [], clarify: null, answers: {}, personal: null };
let state: Session = initial;
const listeners = new Set<() => void>();

function set(next: Partial<Session>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export const personalKey = (s: Session) => JSON.stringify([s.disasters, s.description.trim(), s.clarify?.key ?? null, s.answers]);

export const clarifyKey = (s: Session) => JSON.stringify([s.disasters, s.description.trim()]);

export const session = {
  get: () => state,
  toggleDisaster: (name: string) =>
    set({ disasters: state.disasters.includes(name) ? state.disasters.filter((d) => d !== name) : [...state.disasters, name] }),
  setDescription: (description: string) => set({ description }),
  setFacts: (facts: HouseholdFact[]) => set({ facts }),
  setClarify: (clarify: Clarify) => set({ clarify, answers: {} }),
  setAnswer: (id: string, a: Answer) => set({ answers: { ...state.answers, [id]: { ...state.answers[id], ...a } } }),
  skipAll: () => set({ answers: Object.fromEntries((state.clarify?.questions ?? []).map((q) => [q.id, { ...state.answers[q.id], skipped: true }])) }),
  /** Un-skips every question, restoring any answers given before skipping. */
  undoSkipAll: () => set({ answers: Object.fromEntries(Object.entries(state.answers).map(([id, a]) => [id, { ...a, skipped: false }])) }),
  setPersonal: (personal: Personal) => set({ personal, facts: personal.status === "done" ? personal.facts : [] }),
  reset: () => set({ ...initial, visit: state.visit + 1 }),
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
