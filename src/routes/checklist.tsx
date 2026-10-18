import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Page, FlowNav, PlaceholderNote } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
import { pillVariants } from "@/components/brand/PillButton";
import { ItemPanel } from "@/components/brand/ItemPanel";
import { buildAll, buildDisasterAdvice, type Checklist, type Row } from "@/lib/checklists";
import { DisasterIcon } from "@/components/brand/DisasterPicker";
import { themeIcons } from "@/lib/themes";
import { useSession } from "@/state/session";
import { cn } from "@/lib/utils";
import { usePersonalization, FALLBACK_MESSAGE } from "@/state/personalize";
import { ListsLoading } from "@/components/ListsLoading";
import { Button } from "@/components/ui/button";

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
  component: ChecklistRoute,
});

function ChecklistRoute() {
  const { list = "top10" } = Route.useSearch();
  return <ChecklistPage key={list} />;
}

function ChecklistPage() {
  const { disasters, facts } = useSession();
  const { list = "top10" } = Route.useSearch();
  const personal = usePersonalization();
  const [open, setOpen] = useState<Row | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

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
  const sections = current.id === "top10"
    ? [buildDisasterAdvice(disasters), { title: "Top 10 items", rows: current.sections.flatMap(s => s.rows) }]
    : current.sections;

  function toggleSection(title: string) {
    setExpanded((c) => {
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
        <StackedCard>
          <h1 className="text-2xl text-ink">{current.id === "top10" ? "Top Tips" : current.id === "personalized" ? "Personal Picks" : `${current.id} Basics`}</h1>
          {sections.map((s) => (
                <section key={s.title} className="mt-6">
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => toggleSection(s.title)}
                      aria-expanded={expanded.has(s.title)}
                      className={cn("flex h-auto w-full items-center justify-between gap-2 whitespace-normal rounded-none p-0 text-left hover:bg-snow hover:text-inherit", (s.title === "Custom" || s.title === "Combo" || s.title === "Core") && "-mx-5 w-[calc(100%+2.5rem)] bg-snow px-5 py-4 text-slate hover:text-slate sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6")}
                    >
                      <span className="min-w-0">
                        <h2 className={cn("text-xl", s.title === "Custom" ? "text-custom-heading" : s.title === "Combo" ? "text-combo-heading" : s.title === "Core" ? "text-core-heading" : s.title === "Disaster Dos & Dont's" || s.title === "Top 10 items" || s.title === "Standard items" ? "text-pitch" : "text-ink")}>{s.title}</h2>
                        {collapsible && s.note && <span className="mt-1 block text-sm font-normal text-slate">{s.note}</span>}
                        {s.title === "Combo" && current.overlapLine && expanded.has(s.title) && <span className="mt-1 block text-sm font-bold text-slate">{current.overlapLine}</span>}
                      </span>
                      <ChevronDown size={20} className={cn("shrink-0 transition-transform", needsAI ? "text-slate" : "text-pitch", !expanded.has(s.title) && "-rotate-90")} />
                    </Button>
                  {expanded.has(s.title) && (
                    <>
                      {s.note && s.title !== "Custom" && s.title !== "Combo" && s.title !== "Core" && <p className="mt-1 text-sm text-slate">{s.note}</p>}
                      <Rows rows={s.rows} onOpen={setOpen} blackText={!needsAI} tone={collapsible && s.title === "Custom" ? "custom" : collapsible && s.title === "Combo" ? "combo" : collapsible && s.title === "Core" ? "core" : "default"} />
                    </>
                  )}
                </section>
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

function Rows({ rows, onOpen, tone = "default", blackText = false }: { rows: Row[]; onOpen: (row: Row) => void; tone?: "custom" | "combo" | "core" | "default"; blackText?: boolean }) {
  return (
    <ul className="mt-3">
      {rows.map((r) => (
        <li key={r.name} className="border-b border-linen last:border-0">
          <button
            type="button"
            onClick={() => onOpen(r)}
            className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-pale/60 rounded-none px-2 -mx-2"
          >
            {r.disaster ? <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pale text-ink"><DisasterIcon name={r.disaster} selected small /></span> : <img src={themeIcons[r.theme]} alt="" width={816} height={816} loading="lazy" className={cn("h-11 w-11 shrink-0 object-contain p-1.5", tone === "custom" ? "rounded-full bg-custom-icon" : tone === "combo" ? "rounded-full bg-combo-icon" : tone === "core" ? "rounded-full bg-core-icon" : "rounded-xl bg-pale")} />}
            <span className="min-w-0 flex-1">
              <span className={cn("block font-bold", blackText ? "text-pitch" : "text-ink")}>{r.name}</span>
              <span className={cn("block truncate text-sm", blackText ? "text-pitch" : "text-slate")}>{r.shortNote}</span>
            </span>
            <ChevronRight size={18} className={cn("shrink-0", blackText ? "text-pitch" : "text-slate")} />
          </button>
        </li>
      ))}
    </ul>
  );
}
