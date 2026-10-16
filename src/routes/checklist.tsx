import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment } from "react";
import { Page, FlowNav, PlaceholderNote } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
import { PillButton } from "@/components/brand/PillButton";
import { buildAll, priorityLabel, type Checklist, type Row } from "@/lib/checklists";
import { useSession } from "@/state/session";
import { cn } from "@/lib/utils";
import { usePersonalization, FALLBACK_MESSAGE } from "@/state/personalize";
import { ListsLoading } from "@/components/ListsLoading";

export const Route = createFileRoute("/checklist")({
  validateSearch: (s: Record<string, unknown>): { list?: string } => (typeof s["list"] === "string" ? { list: s["list"] } : {}),
  head: () => ({
    meta: [
      { title: "Your checklist — CataPanda" },
      { name: "description", content: "Your personalized, source-backed disaster prep checklist." },
      { property: "og:title", content: "Your checklist — CataPanda" },
      { property: "og:description", content: "A personalized, source-backed prep checklist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChecklistPage,
});

function ChecklistPage() {
  const { disasters, facts } = useSession();
  const { list = "top10" } = Route.useSearch();
  const personal = usePersonalization();

  if (!disasters.length) {
    return (
      <>
        <Page><PlaceholderNote>Head back to the start and pick at least one disaster first.</PlaceholderNote></Page>
        <FlowNav back="/options" />
      </>
    );
  }

  const ai = personal?.status === "done" ? { items: personal.items, top: personal.top } : null;
  const built = buildAll(disasters, personal?.status === "done" ? personal.facts : facts, ai);
  const all: Checklist[] = [built.top10, built.personalized, ...built.perDisaster];
  const current = all.find((c) => c.id === list) ?? built.top10;
  const needsAI = current.id === "top10" || current.id === "personalized";
  const waiting = needsAI && (!personal || personal.status === "running");
  const showFallback = needsAI && personal?.status === "fallback";

  return (
    <>
      <Page>
        <nav aria-label="Your lists" className="flex flex-wrap gap-2">
          {all.map((c) => (
            <Link
              key={c.id}
              to="/checklist"
              search={{ list: c.id }}
              className={cn("rounded-full border px-4 py-1.5 text-sm font-bold", c.id === current.id ? "border-panda bg-panda text-snow" : "border-sand bg-snow text-ink")}
            >
              {c.title}
            </Link>
          ))}
        </nav>
        {waiting ? <ListsLoading disasters={disasters} phase={personal?.phase ?? 0} /> : <>
        {showFallback && <p role="status" className="rounded-2xl border border-sand bg-pale p-4 text-sm text-ink">{FALLBACK_MESSAGE}</p>}
        {current.id === "top10" && (
          <Link to="/share" className={cn(pillVariants({ variant: "primary" }), "self-center")}>Share your Top 10</Link>
        )}
        <StackedCard>
          <h1 className="text-2xl text-ink">{current.title}</h1>
          {current.sections.map((s) => (
            <Fragment key={s.title}>
              {(current.sections.length > 1 || s.note) && (
                <section className="mt-6">
                  <h2 className="text-xl text-ink">{s.title}</h2>
                  {s.note && <p className="mt-1 text-sm text-slate">{s.note}</p>}
                  {s.title === "Combo" && current.overlapLine && <p className="mt-1 text-sm font-bold text-ink">{current.overlapLine}</p>}
                  <Rows rows={s.rows} showStores={current.showStores} />
                </section>
              )}
              {current.sections.length === 1 && !s.note && <Rows rows={s.rows} showStores={current.showStores} />}
            </Fragment>
          ))}
        </StackedCard>
        {current.id === "top10" && (
          <Link to="/share" className={cn(pillVariants({ variant: "primary" }), "self-center")}>Share your Top 10</Link>
        )}
        </>}
      </Page>
      <FlowNav back="/options" />
    </>
  );
}

function Rows({ rows, showStores }: { rows: Row[]; showStores: boolean }) {
  return (
    <ul className="mt-3">
      {rows.map((r) => (
        <li key={r.name} className="border-b border-linen py-3 last:border-0">
          <p className="font-bold text-ink">{r.name}</p>
          {r.why && <p className="text-sm font-bold text-bright">{r.why}</p>}
          <p className="text-sm text-slate">{r.shortNote}</p>
          <p className="mt-0.5 text-xs text-slate">
            {r.category} | {priorityLabel(r.priority)} |{" "}
            {r.kind === "tip" ? "CataPanda Tip" : r.kind === "ai" ? (
              <>AI: {r.sourceUrl ? (
                <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-bright underline-offset-2 hover:underline">Source ↗</a>
              ) : <Link to="/about" hash="how-the-tiers-work" target="_blank" rel="noopener noreferrer" className="text-bright underline-offset-2 hover:underline">Source ↗</Link>}</>
            ) : (
              <>Gov-vetted: <Link to="/about" hash="gov-vetted" target="_blank" rel="noopener noreferrer" className="text-bright underline-offset-2 hover:underline">Source ↗</Link></>
            )}
            {showStores && r.stores.length > 0 && <> | Find at the store: {[...r.stores].sort().join(", ")}</>}
          </p>
        </li>
      ))}
    </ul>
  );
}
