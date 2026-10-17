import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import mascots from "@/assets/friends-waist.png.asset.json";
import blueBackground from "@/assets/question-blue.webp";
import redBackground from "@/assets/question-red.webp";
import yellowBackground from "@/assets/question-yellow.webp";
import { StackedCard } from "@/components/brand/StackedCard";
import { TextArea } from "@/components/brand/OptionCard";
import { PillButton } from "@/components/brand/PillButton";
import { cn } from "@/lib/utils";
import { clarify } from "@/lib/clarify.functions";
import { session, useSession, clarifyKey, isIntakeReady, isHouseholdReady, DESCRIPTION_MAX } from "@/state/session";
import { startBackgroundSearch } from "@/state/search";

export const Route = createFileRoute("/questions")({
  head: () => ({ meta: [
    { title: "Your household — CataPanda" },
    { name: "description", content: "Tell CataPanda about your household, one question at a time, for personalized disaster prep in Taiwan." },
    { property: "og:title", content: "Your household — CataPanda" },
    { property: "og:description", content: "A few household details for a clear, doable disaster prep checklist." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Questions,
});

export function Questions() {
  const s = useSession();
  const navigate = useNavigate();
  const run = useServerFn(clarify);
  const key = clarifyKey(s);
  const [loading, setLoading] = useState(false);
  const request = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const step = s.formStep;
  const questions = s.clarify?.key === key ? s.clarify.questions : [];
  const q = questions[step - 1];
  const answer = q ? s.answers[q.id] ?? {} : {};
  const other = answer.choice?.toLowerCase() === "other";
  const textQuestion = q?.type === "text" || other;

  useEffect(() => {
    if (!isIntakeReady(s)) void navigate({ to: "/", replace: true });
  }, [s.disasters.length, s.region, navigate]);
  useEffect(() => { heading.current?.focus(); }, [step, loading]);
  useEffect(() => () => { request.current += 1; }, []);

  function nextQuestion() {
    if (step >= questions.length) void navigate({ to: "/options" });
    else session.setFormStep(step + 1);
  }

  async function submitHousehold() {
    if (!isHouseholdReady(s.description) || loading) return;
    if (s.clarify?.key === key) {
      startBackgroundSearch(s.clarify.searchNeeds);
      if (questions.length) session.setFormStep(1);
      else void navigate({ to: "/options" });
      return;
    }
    const id = ++request.current;
    setLoading(true);
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const result = await Promise.race([
        run({ data: { description: s.description.trim(), disasters: s.disasters } }).catch(() => null),
        new Promise<null>((resolve) => { timer = setTimeout(() => resolve(null), 20000); }),
      ]);
      if (id !== request.current) return;
      session.setClarify({ key, questions: result?.questions ?? [], searchNeeds: result?.searchNeeds ?? [] });
      startBackgroundSearch(result?.searchNeeds ?? []);
      if (result?.questions.length) session.setFormStep(1);
      else void navigate({ to: "/options" });
    } finally {
      if (timer) clearTimeout(timer);
      if (id === request.current) setLoading(false);
    }
  }

  function back() {
    if (loading) { request.current += 1; setLoading(false); }
    else if (step > 0) session.setFormStep(step - 1);
    else void navigate({ to: "/" });
  }

  const nextDisabled = step === 0 ? !isHouseholdReady(s.description) : textQuestion ? !answer.text?.trim() : !answer.choice;
  const theme = ["red", "blue", "yellow"][step % 3];
  const background = [redBackground, blueBackground, yellowBackground][step % 3] ?? redBackground;

  return (
    <main className={cn("question-screen relative isolate flex min-h-svh flex-col text-ink", `question-${theme}`)}>
      <img src={background} alt="" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-5 sm:px-10">
        <PillButton onClick={back} aria-label="Back" title="Back" className="h-11 w-11 bg-transparent p-0 text-pale hover:bg-ocean hover:text-snow"><ArrowLeft size={23} /></PillButton>
        <PillButton onClick={() => { request.current += 1; session.reset(); void navigate({ to: "/" }); }} aria-label="Exit form" title="Exit form" className="h-11 w-11 bg-transparent p-0 text-pale hover:bg-ocean hover:text-snow"><X size={23} /></PillButton>
      </div>
      <div className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-12">
        <section key={loading ? "loading" : step} className="question-enter w-full" aria-busy={loading}>
          <StackedCard bottomTab={theme === "yellow" ? "red" : "yellow"}>
          <h1 ref={heading} tabIndex={-1} className="text-2xl leading-tight outline-none sm:text-3xl">{loading ? "A little more about your home…" : step === 0 ? "Tell us about your household" : q?.text ?? "Your checklists are next…"}</h1>
          {loading ? (
            <div className="mt-8" role="status"><img src={mascots.url} alt="" className="cp-bob h-36 w-48 object-contain object-bottom" /><p className="mt-5 text-slate">Just a moment…</p></div>
          ) : step === 0 ? (
            <form id="household-form" onSubmit={(e) => { e.preventDefault(); void submitHousehold(); }}>
              <p className="mt-3 text-base text-slate sm:text-lg">Who's at home? Include pets and any needs you'd like us to keep in mind.</p>
              <TextArea id="household" aria-label="Tell us about your household" aria-describedby="household-hint" className="mt-3 text-base" rows={2} maxLength={DESCRIPTION_MAX} value={s.description} onChange={(e) => session.setDescription(e.target.value)} placeholder="I live with my elderly mother who uses a walker, and we have a cat…" />
              <div id="household-hint" className="mt-3 flex justify-between gap-4 text-sm text-slate"><span>{s.description.trim().length < 10 ? "At least 10 characters." : "Never stored or shared."}</span><span>{s.description.length}/{DESCRIPTION_MAX}</span></div>
            </form>
          ) : q ? (
            <div className="mt-7">
              {q.type !== "text" && <div className="grid gap-3 sm:max-w-lg">{q.options.map((option, index) => (
                <PillButton key={option} aria-pressed={!answer.skipped && answer.choice === option} onClick={() => { session.setAnswer(q.id, { choice: option, text: undefined, skipped: false }); if (option.toLowerCase() !== "other") nextQuestion(); }} className={cn("min-h-14 justify-start whitespace-normal rounded-lg border-2 border-sand bg-snow px-4 py-3 text-left text-ink hover:border-bright hover:bg-pale hover:text-ink", !answer.skipped && answer.choice === option && "border-bright bg-pale text-ink")}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-current text-xs">{String.fromCharCode(65 + index)}</span><span className="flex-1">{option}</span>{!answer.skipped && answer.choice === option && <Check size={18} />}
                </PillButton>
              ))}</div>}
              {textQuestion && <TextArea autoFocus aria-label="Your answer" className="mt-3 text-base" rows={1} maxLength={100} placeholder="Your answer…" value={answer.text ?? ""} onChange={(e) => session.setAnswer(q.id, { text: e.target.value, skipped: false })} />}
            </div>
          ) : null}
          </StackedCard>
          <div className="mt-6 flex justify-start sm:mt-8">
            {!loading && (step === 0 || textQuestion || answer.choice) ? (
              <PillButton type={step === 0 ? "submit" : "button"} form={step === 0 ? "household-form" : undefined} disabled={nextDisabled} onClick={step === 0 ? undefined : nextQuestion} className="question-next">{step === 0 || textQuestion ? "OK" : "Next"}</PillButton>
            ) : null}
          </div>
        </section>
      </div>
      <div className="flex w-full items-center justify-end gap-4 px-6 py-5 text-xs text-pale sm:px-10">
        <div className="flex items-center gap-1.5" aria-label={`Step ${step + 1}`}>
          {Array.from({ length: questions.length + 1 }, (_, i) => <span key={i} className={cn("h-1.5 w-5 rounded-full", i <= step ? (theme === "yellow" ? "bg-brick" : "bg-welcome") : "bg-pale/25")} />)}
        </div>
      </div>
    </main>
  );
}
