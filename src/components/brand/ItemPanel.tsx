import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink, ArrowLeft } from "lucide-react";
import { catalog } from "@/services/catalog";
import type { DetailRow } from "@/lib/checklist-design";
import { themeIcons } from "@/lib/themes";
import { verifyItemSource } from "@/state/search";
import type { SearchResult } from "@/lib/search-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ItemPanel({ row, onClose, fullScreen = false, listTitle = "Personal Picks" }: { row: DetailRow; onClose: () => void; fullScreen?: boolean; listTitle?: string }) {
  const [tab, setTab] = useState("pack");
  const [verified, setVerified] = useState<SearchResult | null | "loading">(row.kind === "ai" && !row.sourceUrl ? "loading" : null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeCallback = useRef(onClose);
  closeCallback.current = onClose;
  const bag = row.name === "Grab-and-go bag";
  const bundle = bag || !!row.contents?.length || ["food", "health", "hygiene", "documents", "pets", "aids"].includes(row.theme) || row.displayName === "Phone power supplies";
  const sources = [...new Set([...row.sourceCodes, ...(row.contents ?? []).flatMap(r => r.sourceCodes)])].map(code => catalog.getSource(code)).filter(s => !!s).sort((a, b) => a.code === "TW" ? -1 : b.code === "TW" ? 1 : 0);
  useEffect(() => {
    const scrollY = window.scrollY;
    const previous = { overflow: document.body.style.overflow, position: document.body.style.position, top: document.body.style.top, width: document.body.style.width };
    const focus = document.activeElement;
    Object.assign(document.body.style, { overflow: "hidden", position: "fixed", top: `-${scrollY}px`, width: "100%" });
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCallback.current();
      if (e.key === "Tab") {
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]');
        const first = nodes?.[0]; const last = nodes?.[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); Object.assign(document.body.style, previous); window.scrollTo(0, scrollY); if (focus instanceof HTMLElement) focus.focus({ preventScroll: true }); };
  }, []);
  useEffect(() => {
    if (verified !== "loading") return;
    let alive = true;
    void verifyItemSource(row.name).then(r => { if (alive) setVerified(r); });
    return () => { alive = false; };
  }, [row.name, verified]);
  if (typeof document === "undefined") return null;
  const showWhy = !fullScreen || !bundle || tab === "why";
  const label = row.disaster ? "Gov-vetted" : row.kind === "ai" ? "AI" : row.kind === "tip" ? "CataPanda tip" : "Gov-vetted";
  return createPortal(
    <div className={cn("fixed inset-0 z-50 flex justify-center", fullScreen ? "bg-snow" : "items-end bg-pitch/60 sm:items-center sm:p-6")}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={row.displayName ?? row.name} className={cn("relative flex w-full max-w-xl flex-col overflow-hidden bg-snow text-ink", fullScreen ? "h-dvh" : "max-h-[85dvh] rounded-t-3xl sm:rounded-3xl")}>
        <div className="flex shrink-0 items-center justify-between px-4 py-3">
          <Button variant="ghost" onClick={onClose} className="gap-2 text-ink"><ArrowLeft size={18} />{listTitle}</Button>
          <Button ref={closeRef} variant="ghost" size="icon" onClick={onClose} aria-label="Close panel"><X size={22} /></Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-8 sm:px-8">
          <header className={cn("pb-5", fullScreen && "text-center")}>
            <img src={themeIcons[row.theme]} alt="" width={80} height={80} className={cn("h-20 w-20 rounded-full bg-linen object-contain p-3", fullScreen && "mx-auto")} />
            <h2 className={cn("mt-3 text-2xl text-sky", row.disaster && "font-sans text-sm font-normal text-pitch")}>{row.displayName ?? row.name}</h2>
            <span className="mt-2 inline-block rounded-full bg-pitch px-3 py-1 text-xs font-bold text-snow">{label}</span>
            <p className={cn("mt-3 text-sm", row.disaster ? "text-pitch" : "text-ink")}>{row.shortNote}</p>
          </header>
          {fullScreen && bundle && <div role="tablist" aria-label="Item details" className="mb-5 grid grid-cols-2 border-b border-linen">
            {[{ id: "pack", label: "What to Pack" }, { id: "why", label: "Why" }].map(t => <Button key={t.id} id={`tab-${t.id}`} role="tab" aria-selected={tab === t.id} aria-controls="item-content" variant="ghost" onClick={() => setTab(t.id)} className={cn("h-12 rounded-none border-b-4 font-display text-xl", tab === t.id ? "border-sky text-sky" : "border-transparent text-slate")}>{t.label}</Button>)}
          </div>}
          <div id="item-content" role={fullScreen && bundle ? "tabpanel" : undefined} aria-labelledby={fullScreen && bundle ? `tab-${tab}` : undefined}>
            {!showWhy && <>
              {row.detail && <p className="mb-4 text-sm text-ink">{row.detail}</p>}
              {!!row.contents?.length && <ul className="divide-y divide-linen">{row.contents.map(child => <li key={child.name} className="flex items-start gap-3 py-4"><img src={themeIcons[child.theme]} alt="" className="h-11 w-11 shrink-0 rounded-full bg-linen object-contain p-2" /><div><h3 className="text-lg">{child.displayName ?? child.name}</h3><p className="mt-1 text-sm text-slate">{child.shortNote}</p>{child.detail && <p className="mt-1 text-sm text-slate">{child.detail}</p>}</div></li>)}</ul>}
              {!bag && !row.detail && !row.contents?.length && <p className="text-sm">{row.shortNote}</p>}
            </>}
            {showWhy && <>
              <section><h3 className="text-xl text-pitch">Why it matters</h3><p className="mt-2 text-sm">{row.why ?? row.detail ?? row.shortNote}</p>
                {bag && <ul className="mt-3 divide-y divide-linen">{catalog.getBagTips().map(t => <li key={t.text} className="py-3 text-sm">{t.text}</li>)}</ul>}
                {!!row.appliesTo?.length && <div className="mt-4 rounded-xl bg-linen p-3"><span className="inline-block rounded-full bg-pitch px-2.5 py-1 text-xs font-bold text-snow">{row.appliesTo.length > 1 ? "Shared" : row.appliesTo[0]}</span><p className="mt-2 text-sm">{row.appliesTo.join(" + ")}</p></div>}
                {row.medical && <p className="mt-3 rounded-xl bg-linen p-3 text-sm">Check with your doctor about the right supplies and amounts for you.</p>}
              </section>
              <section className="mt-6 border-t border-linen pt-5"><h3 className="text-xl text-pitch">Helpful resources</h3>
                <ul className="mt-3 space-y-2">{sources.map(s => <li key={s.code} className="rounded-xl bg-linen p-3"><p className="text-sm font-bold">{s.document}</p><p className="text-xs text-slate">{s.agency}</p>{s.websites[0] && <a href={s.websites[0]} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-sky underline">Visit source <ExternalLink size={14} /></a>}</li>)}</ul>
                {row.kind === "ai" && <div className="mt-3">{row.sourceUrl || (verified && verified !== "loading") ? <a href={row.sourceUrl ?? (verified && verified !== "loading" ? verified.link : "")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-linen p-3 text-sm text-sky">Verified source <ExternalLink size={14} /></a> : <p className="text-sm text-slate" role="status">{verified === "loading" ? "Checking official sources…" : "No official source found for this one yet — it's an AI suggestion, so double-check it fits your needs."}</p>}</div>}
                {!!row.stores.length && <p className="mt-4 text-sm"><strong>Find at the store:</strong> {[...row.stores].sort().join(", ")}</p>}
              </section>
            </>}
          </div>
        </div>
      </div>
    </div>, document.body,
  );
}
