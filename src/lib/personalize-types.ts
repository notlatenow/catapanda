import type { HouseholdFact } from "@/services/catalog";

export type AIPriority = "essential" | "important" | "nice-to-have";
export type AIItem = {
  name: string;
  category: string;
  priority: AIPriority;
  shortNote: string;
  stores: string[];
  medical: boolean;
  specializes: string | null;
};
export type TopPick = { name: string; why: string };
export type QA = { question: string; answer: string };
export type SuggestResult = { ok: boolean; facts: HouseholdFact[]; drafts: AIItem[] };
export type ReviewResult = { ok: boolean; items: AIItem[]; top: TopPick[] };
