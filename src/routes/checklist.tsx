import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Page, FlowNav, PlaceholderNote } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
import { pillVariants } from "@/components/brand/PillButton";
import { ItemPanel } from "@/components/brand/ItemPanel";
import { buildAll, type Checklist, type Row } from "@/lib/checklists";
import { themeIcons } from "@/lib/themes";
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
  const [open, setOpen] = useState<Row | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  if (!disasters.length) {
    return (
      <>
        <Page><PlaceholderNote>Head back to the start and pick at least one disaster first.</PlaceholderNote></Page>
        <FlowNav back="/options" startOver={false} />
      </>
    );
  }

  const ai = personal?.status === "done" ? { items: personal.items, top: personal.top } : null;
  const built = buildAll(disasters, personal?.status === "done" ? personal.facts : facts, ai, personal?.status === "done" ? personal.people : null);
  const all: Checklist[] = [built.top10, built.personalized, ...built.perDisaster];
  const current = all.find((c) => c.id === list) ?? built.top10;
  const needsAI = current.id === "top10" || current.id === "personalized";
  const waiting = needsAI && (!personal || personal.status === "running");
  const showFallback = needsAI && personal?.status === "fallback";
  const collapsible = current.id === "personalized";

  function toggleSection(title: string) {
    setCollapsed((c) => {
      const next = new Set(c);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

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
              {c.id === "top10" ? "Top Tips" : c.id === "personalized" ? "Personal Picks" : c.id}
            </Link>
          ))}
        </nav>
        {waiting ? <ListsLoading disasters={disasters} phase={personal?.phase ?? 0} /> : <>
        {showFallback && <p role="status" className="rounded-2xl border border-sand bg-pale p-4 text-sm text-ink">{FALLBACK_MESSAGE}</p>}
        {current.id === "top10" && (
          <Link to="/share" className={cn(pillVariants({ variant: "primary" }), "self-center")}>Share your Top Tips</Link>
        )}
        <StackedCard>
          <h1 className="text-2xl text-ink">{current.id === "top10" ? "Top Tips" : current.id === "personalized" ? "Personal Picks" : `${current.id} Basics`}</h1>
          {current.sections.map((s) => (
            <Fragment key={s.title}>
              {(current.sections.length > 1 || s.note) && (
                <section className="mt-6">
                  {collapsible ? (
                    <button
                      type="button"
                      onClick={() => toggleSection(s.title)}
                      aria-expanded={!collapsed.has(s.title)}
                      className="flex w-full items-center justify-between gap-2 text-left"
                    >
                      <h2 className="text-xl text-ink">{s.title}</h2>
                      <ChevronDown size={20} className={cn("shrink-0 text-slate transition-transform", collapsed.has(s.title) && "-rotate-90")} />
                    </button>
                  ) : (
                    <h2 className="text-xl text-ink">{s.title}</h2>
                  )}
                  {!collapsed.has(s.title) && (
                    <>
                      {s.note && <p className="mt-1 text-sm text-slate">{s.note}</p>}
                      {s.title === "Combo" && current.overlapLine && <p className="mt-1 text-sm font-bold text-ink">{current.overlapLine}</p>}
                      <Rows rows={s.rows} onOpen={setOpen} />
                    </>
                  )}
                </section>
              )}
              {current.sections.length === 1 && !s.note && <Rows rows={s.rows} onOpen={setOpen} />}
            </Fragment>
          ))}
        </StackedCard>
        {current.id === "top10" && (
          <Link to="/share" className={cn(pillVariants({ variant: "primary" }), "self-center")}>Share your Top Tips</Link>
        )}
        </>}
      </Page>
      {open && <ItemPanel row={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function Rows({ rows, onOpen }: { rows: Row[]; onOpen: (row: Row) => void }) {
  return (
    <ul className="mt-3">
      {rows.map((r) => (
        <li key={r.name} className="border-b border-linen last:border-0">
          <button
            type="button"
            onClick={() => onOpen(r)}
            className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-pale/60 rounded-2xl px-2 -mx-2"
          >
            <img src={themeIcons[r.theme]} alt="" width={816} height={816} loading="lazy" className="h-11 w-11 shrink-0 rounded-xl bg-pale object-contain p-1.5" />
            <span className="min-w-0 flex-1">
              <span className="block font-bold text-ink">{r.name}</span>
              <span className="block truncate text-sm text-slate">{r.shortNote}</span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-slate" />
          </button>
        </li>
      ))}
    </ul>
  );
}
