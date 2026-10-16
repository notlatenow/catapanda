/** Runs Suggest → Review once per set of inputs. Falls back to plain logic on any failure or after ~25s. */
import { useEffect } from "react";
import { suggestItems, reviewItems } from "@/lib/personalize.functions";
import type { QA } from "@/lib/personalize-types";
import { session, personalKey, useSession, type Personal } from "@/state/session";
import { collectSearchResults } from "@/state/search";

const TIMEOUT_MS = 25000;

function qaPairs(): QA[] {
  const s = session.get();
  return (s.clarify?.questions ?? []).flatMap((q) => {
    const a = s.answers[q.id];
    if (!a || a.skipped) return [];
    const answer = [a.choice, a.text?.trim()].filter(Boolean).join(" — ");
    return answer ? [{ question: q.text.slice(0, 200), answer: answer.slice(0, 200) }] : [];
  });
}

export function ensurePersonalized() {
  const s = session.get();
  if (!s.disasters.length || !s.description.trim()) return;
  const key = personalKey(s);
  if (s.personal?.key === key) return;
  const base: Personal = { key, status: "running", phase: 0, facts: [], items: [], top: [] };
  session.setPersonal(base);
  const current = () => session.get().personal?.key === key;
  const description = s.description.trim();
  const disasters = s.disasters;
  const answers = qaPairs();

  const work = (async () => {
    const searchResults = await collectSearchResults(description, answers);
    if (!current()) return null;
    const sug = await suggestItems({ data: { description, disasters, answers, searchResults } });
    if (!sug.ok || !current()) return null;
    session.setPersonal({ ...base, phase: 1 });
    const rev = await reviewItems({ data: { drafts: sug.drafts, disasters, facts: sug.facts, description, answers, searchResults } });
    if (!rev.ok) return null;
    return { facts: sug.facts, items: rev.items, top: rev.top };
  })().catch(() => null);
  const timeout = new Promise<null>((r) => setTimeout(() => r(null), TIMEOUT_MS));

  void Promise.race([work, timeout]).then((res) => {
    if (!current()) return;
    session.setPersonal(res ? { ...base, status: "done", phase: 1, ...res } : { ...base, status: "fallback" });
  });
}

/** Starts personalization for the current inputs (if needed) and returns its state. */
export function usePersonalization() {
  const s = useSession();
  const key = personalKey(s);
  useEffect(() => { ensurePersonalized(); }, [key]);
  return s.personal?.key === key ? s.personal : null;
}

export const FALLBACK_MESSAGE =
  "Our personalized picks are taking a little nap right now, so here are your trusty gov-vetted lists. They've got you covered!";
