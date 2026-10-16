import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment } from "react";
import { Page, FlowNav, PlaceholderNote } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
import { PillButton } from "@/components/brand/PillButton";
import { buildAll, priorityLabel, type Checklist, type Row } from "@/lib/checklists";
import { useSession } from "@/state/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checklist")({
  validateSearch: (s: Record<string, unknown>): { list?: string } => (typeof s["list"] === "string" ? { list: s["list"] } : {}),
  head: () => ({
    meta: [
      { title: "Your checklist — CataPanda" },
      { name: "description", content: "Your personalized, source-backed disaster prep checklist." },
      { property: "og:title", content: "Your checklist — CataPanda" },
      { property: "og:description", content: "A personalized, source-backed prep checklist." },
    ],
  }),
  component: ChecklistPage,
});

function ChecklistPage() {
  const { disasters, facts } = useSession();
  const { list = "top10" } = Route.useSearch();

  if (!disasters.length) {
    return (
      <>
        <Page><PlaceholderNote>Head back to the start and pick at least one disaster first.</PlaceholderNote></Page>
        <FlowNav back="/options" />
      </>
    );
  }

  const built = buildAll(disasters, facts);
  const all: Checklist[] = [built.top10, built.personalized, ...built.perDisaster];
  const current = all.find((c) => c.id === list) ?? built.top10;

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
          <Link to="/share" className="self-center"><PillButton>Share your Top 10</PillButton></Link>
        )}
      </Page>
      <FlowNav back="/options" next="/share" nextLabel="Share" />
    </>
  );
}

function Rows({ rows, showStores }: { rows: Row[]; showStores: boolean }) {
  return (
    <ul className="mt-3">
      {rows.map((r) => (
        <li key={r.name} className="border-b border-linen py-3 last:border-0">
          <p className="font-bold text-ink">{r.name}</p>
          <p className="text-sm text-slate">{r.shortNote}</p>
          <p className="mt-0.5 text-xs text-slate">
            {r.category} | {priorityLabel(r.priority)} |{" "}
            {r.kind === "tip" ? "CataPanda Tip" : (
              <>Gov-vetted: <Link to="/about" hash="gov-vetted" className="text-bright underline-offset-2 hover:underline">Source ↗</Link></>
            )}
            {showStores && r.stores.length > 0 && <> | Find at {[...r.stores].sort().join(", ")}</>}
          </p>
        </li>
      ))}
    </ul>
  );
}
