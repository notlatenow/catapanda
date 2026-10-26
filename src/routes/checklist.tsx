import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Page, FlowNav, PlaceholderNote } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
import { pillVariants } from "@/components/brand/PillButton";
import { ItemPanel } from "@/components/brand/ItemPanel";
import { buildAll, buildDisasterAdvice, type Row } from "@/lib/checklists";
import { buildDisasterBasics, designPersonalPicks, type DesignedList, type DetailRow } from "@/lib/checklist-design";
import { DisasterIcon } from "@/components/brand/DisasterPicker";
import { themeIcons } from "@/lib/themes";
import { useSession } from "@/state/session";
import { cn } from "@/lib/utils";
import { usePersonalization, FALLBACK_MESSAGE } from "@/state/personalize";
import { ListsLoading } from "@/components/ListsLoading";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checklist")({
  validateSearch: (s: Record<string, unknown>): { list?: string } => typeof s["list"] === "string" ? { list: s["list"] } : {},
  head: () => ({ meta: [
    { title: "Your disaster checklists — CataPanda" },
    { name: "description", content: "Personal Picks for your household and one Disaster Basics kit for your selected disasters." },
    { property: "og:title", content: "Your disaster checklists — CataPanda" },
    { property: "og:description", content: "Source-backed supplies, clear priorities, and packing details when you need them." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: ChecklistRoute,
});
function ChecklistRoute() { const { list = "top10" } = Route.useSearch(); return <ChecklistPage key={list} />; }
function ChecklistPage() {
  const { disasters, facts } = useSession();
  const { list = "top10" } = Route.useSearch();
  const personal = usePersonalization();
  const [open, setOpen] = useState<DetailRow | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [more, setMore] = useState(false);
  if (!disasters.length) return <><Page><PlaceholderNote>Head back to the start and pick at least one disaster first.</PlaceholderNote></Page><FlowNav back="/options" startOver={false} /></>;
  const ai = personal?.status === "done" ? { items: personal.items, top: personal.top } : null;
  const built = buildAll(disasters, personal?.status === "done" ? personal.facts : facts, ai, personal?.status === "done" ? personal.people : null);
  const isPersonal = list === "personalized";
  const isTop = list === "top10";
  const current = isTop ? built.top10 : isPersonal ? designPersonalPicks(built.personalized, disasters) : buildDisasterBasics(disasters);
  const sections: DesignedList["sections"] = isTop ? [buildDisasterAdvice(disasters), { title: "Top 10 items", rows: current.sections.flatMap(s => s.rows) }] : current.sections;
  const waiting = (isTop || isPersonal) && (!personal || personal.status === "running");
  function toggle(title: string) { setExpanded(old => { const next = new Set(old); if (next.has(title)) next.delete(title); else next.add(title); return next; }); }
  return <>
    <Page>
      <nav aria-label="Your lists" className="flex flex-wrap justify-center gap-2">{[{ id: "top10", name: "Top Tips" }, { id: "personalized", name: "Personal Picks" }, { id: "basics", name: "Disaster Basics" }].map(c => <Link key={c.id} to="/checklist" search={{ list: c.id }} className={cn("rounded-full border-2 px-3 py-2 text-sm font-bold", (c.id === list || c.id === "basics" && !isTop && !isPersonal) ? "border-pitch bg-custom-icon text-pitch" : "border-snow bg-snow text-ink")}>{c.name}</Link>)}</nav>
      {waiting ? <ListsLoading disasters={disasters} phase={personal?.phase ?? 0} /> : <>
        {(isTop || isPersonal) && personal?.status === "fallback" && <p role="status" className="rounded-xl bg-pale p-4 text-sm text-ink">{FALLBACK_MESSAGE}</p>}
        {!isTop && <header className="text-center"><h1 className="font-display text-3xl text-custom-heading">{current.title}</h1><p className="mt-2 text-sm text-snow">{disasters.join(" + ")}</p></header>}
        {!isTop && !isPersonal && "overlap" in current && current.overlap && disasters.length > 1 && <div className="text-center"><p className="font-display text-3xl text-custom-heading">{current.overlap.percent}% shared</p><p className="mt-1 text-snow">{current.overlap.shared} of {current.overlap.total} items cover {disasters.length === 2 ? "both" : "all three"}.</p><p className="text-sm text-snow">One kit, {disasters.length === 2 ? "two" : "three"} disasters.</p></div>}
        <StackedCard>
          {isTop && <h1 className="text-2xl text-ink">Top Tips</h1>}
          {sections.map(s => {
            const opened = expanded.has(s.title);
            let visible: DetailRow[] = s.rows;
            if (!isTop && !isPersonal && s.title === "Priority items" && !more) visible = s.rows.slice(0, 4);
            return <section key={s.title} className={cn("border-b border-linen last:border-0", isPersonal ? "py-2" : "py-4")}>
              <Button variant="ghost" onClick={() => toggle(s.title)} aria-expanded={opened} className="h-auto w-full justify-between gap-3 whitespace-normal rounded-none p-0 py-2 text-left hover:bg-snow hover:text-inherit">
                {isPersonal && s.icon && <img src={themeIcons[s.icon]} alt="" width={56} height={56} className="h-14 w-14 shrink-0 rounded-full bg-linen object-contain p-2" />}
                <span className="min-w-0 flex-1"><h2 className={cn("text-xl", isPersonal ? "text-pitch" : "text-slate")}>{s.title}</h2>{isPersonal && s.note && <span className="mt-1 block text-sm font-normal text-slate">{s.note}</span>}</span>
                <ChevronDown size={20} className={cn("shrink-0 text-pitch", !opened && "-rotate-90")} />
              </Button>
              {opened && <>
                {!isPersonal && s.note && <p className="mt-1 text-sm text-slate">{s.note}</p>}
                <Rows rows={visible} onOpen={setOpen} namesOnly={!isTop} hideIcon={isPersonal} />
                {!isPersonal && !isTop && s.title === "Priority items" && s.rows.length > 4 && <Button variant="ghost" onClick={() => setMore(!more)} aria-expanded={more} className="mt-2 w-full justify-end text-ink">{more ? "Show fewer priorities" : "Show more priorities"}<Plus size={16} /></Button>}
              </>}
            </section>;
          })}
        </StackedCard>
        {isPersonal && <Link to="/checklist" search={{ list: "basics" }} className="self-center text-sm text-snow underline underline-offset-4">View Disaster Basics →</Link>}
        {isTop && <Link to="/share" className={cn(pillVariants({ variant: "primary" }), "self-center")}>Share your Top Tips</Link>}
      </>}
    </Page>
    {open && <ItemPanel key={open.name} row={open} onClose={() => setOpen(null)} fullScreen={!isTop} listTitle={isTop ? "Top Tips" : current.title} />}
  </>;
}
function Rows({ rows, onOpen, namesOnly, hideIcon }: { rows: DetailRow[]; onOpen: (row: Row) => void; namesOnly: boolean; hideIcon: boolean }) {
  return <ul className="mt-3">{rows.map(r => <li key={r.name} className="border-b border-linen last:border-0"><Button variant="ghost" onClick={() => onOpen(r)} className="h-auto w-full justify-start gap-3 whitespace-normal rounded-none px-0 py-3 text-left hover:bg-pale/60">
    {!hideIcon && (r.disaster ? <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linen text-ink"><DisasterIcon name={r.disaster} selected small /></span> : <img src={themeIcons[r.theme]} alt="" width={44} height={44} loading="lazy" className="h-11 w-11 shrink-0 rounded-full bg-linen object-contain p-1.5" />)}
    <span className="min-w-0 flex-1"><span className={cn("block", r.disaster ? "font-sans text-sm font-normal text-pitch" : namesOnly ? "font-display text-lg text-pitch" : "font-bold text-ink")}>{namesOnly ? r.displayName ?? r.name : r.name}</span>{!namesOnly && <span className={cn("block text-sm font-normal", r.disaster ? "text-pitch" : "text-slate")}>{r.shortNote}</span>}</span>
    {hideIcon && (r.forYou || r.priority === "essential") && <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold", r.forYou ? "bg-custom-icon text-pitch" : "bg-combo-heading text-snow")}>{r.forYou ? "For you" : "Essential"}</span>}
    <ChevronRight size={18} className="shrink-0 text-pitch" />
  </Button></li>)}</ul>;
}
