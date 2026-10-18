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
  people: number | null; // confident household size from AI, else null
};

export type Session = {
  visit: number;
  disasters: string[]; // in the order selected
  region: string;
  description: string;
  facts: HouseholdFact[]; // supplied by AI in a later stage
  clarify: Clarify | null; // result for the current disasters + description
  answers: Record<string, Answer>;
  personal: Personal | null; // AI personalization for the current inputs
  formStep: number; // 0 = household; subsequent steps are clarifying questions
};

const initial: Session = { visit: 0, disasters: [], region: "", description: "", facts: [], clarify: null, answers: {}, personal: null, formStep: 0 };
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
  setRegion: (region: string) => set({ region }),
  setFormStep: (formStep: number) => set({ formStep: Math.max(0, formStep) }),
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

export function isIntakeReady(s: Pick<Session, "disasters" | "region">): boolean {
  return s.disasters.length > 0 && s.region.length > 0;
}

export function isHouseholdReady(description: string): boolean {
  const length = description.trim().length;
  return length >= DESCRIPTION_MIN && length <= DESCRIPTION_MAX;
}
