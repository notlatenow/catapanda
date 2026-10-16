import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import mascots from "@/assets/web-mascots.png.asset.json";
import { Page, FlowNav } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
import { TextField } from "@/components/brand/OptionCard";
import { PillButton } from "@/components/brand/PillButton";
import { cn } from "@/lib/utils";
import { clarify } from "@/lib/clarify.functions";
import { session, useSession, clarifyKey } from "@/state/session";
import { startBackgroundSearch } from "@/state/search";

export const Route = createFileRoute("/questions")({
  head: () => ({
    meta: [
      { title: "A few quick questions — CataPanda" },
      { name: "description", content: "Answer a few questions so CataPanda can tailor your disaster prep checklist." },
      { property: "og:title", content: "A few quick questions — CataPanda" },
      { property: "og:description", content: "Tailor your disaster prep checklist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Questions,
});

const TIMEOUT_MS = 20000;

function Questions() {
  const s = useSession();
  const navigate = useNavigate();
  const run = useServerFn(clarify);
  const key = clarifyKey(s);
  const fresh = s.clarify?.key === key;
  const [loading, setLoading] = useState(!fresh);

  useEffect(() => {
    if (!s.disasters.length || !s.description.trim()) { void navigate({ to: "/", replace: true }); return; }
    if (fresh) {
      startBackgroundSearch(s.clarify?.searchNeeds ?? []);
      if (!s.clarify?.questions.length) void navigate({ to: "/options", replace: true });
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    const timeout = new Promise<null>((r) => setTimeout(() => r(null), TIMEOUT_MS));
    Promise.race([run({ data: { description: s.description.trim(), disasters: s.disasters } }), timeout])
      .catch(() => null)
      .then((res) => {
        if (!alive) return;
        session.setClarify({ key, questions: res?.questions ?? [], searchNeeds: res?.searchNeeds ?? [] });
        startBackgroundSearch(res?.searchNeeds ?? []);
        if (!res || !res.questions.length) void navigate({ to: "/options", replace: true });
        else setLoading(false);
      });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (loading || !s.clarify?.questions.length) {
    return (
      <Page>
        <StackedCard>
          <div className="flex flex-col items-center gap-3 py-6 text-center" role="status">
            <img src={mascots.url} alt="" className="w-24 animate-bounce" />
            <h1 className="text-xl text-ink">Getting to know your household…</h1>
            <p className="text-slate">Thinking up a few quick questions. Just a moment!</p>
          </div>
        </StackedCard>
      </Page>
    );
  }

  const { questions } = s.clarify;
  return (
    <>
      <Page>
        <StackedCard>
          <h1 className="text-2xl text-ink">A few quick questions</h1>
          <p className="mt-2 text-sm text-slate">Feel free to skip these questions, but the more info we have, the better your checklists will be.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <PillButton variant="secondary" className="px-4 py-2 text-sm" onClick={() => session.skipAll()} disabled={questions.every((q) => s.answers[q.id]?.skipped)}>Skip all</PillButton>
            {questions.some((q) => s.answers[q.id]?.skipped) && (
              <PillButton variant="secondary" className="px-4 py-2 text-sm" onClick={() => session.undoSkipAll()}>Undo skip all</PillButton>
            )}
          </div>
        </StackedCard>
        {questions.map((q) => {
          const a = s.answers[q.id] ?? {};
          return (
            <StackedCard key={q.id}>
              <div className={cn(a.skipped && "opacity-50")}>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg text-ink">{q.text}</h2>
                  <button type="button" onClick={() => session.setAnswer(q.id, { skipped: !a.skipped })} className="shrink-0 text-sm font-bold text-bright underline-offset-4 hover:underline">
                    {a.skipped ? "Undo skip" : "Skip"}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {q.options.map((o) => (
                    <button
                      key={o}
                      type="button"
                      aria-pressed={a.choice === o}
                      onClick={() => session.setAnswer(q.id, { choice: a.choice === o ? undefined : o, skipped: false })}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-bold transition-colors",
                        a.choice === o ? "border-2 border-bright bg-pale text-ink" : "border-sand bg-snow text-ink hover:border-bright",
                      )}
                    >
                      {o}
                    </button>
                  ))}
                </div>
                <TextField
                  className="mt-3"
                  maxLength={100}
                  placeholder="Anything to add? (optional)"
                  value={a.text ?? ""}
                  onChange={(e) => session.setAnswer(q.id, { text: e.target.value.slice(0, 100), skipped: false })}
                />
              </div>
            </StackedCard>
          );
        })}
      </Page>
      <FlowNav back="/" next="/options" />
    </>
  );
}
