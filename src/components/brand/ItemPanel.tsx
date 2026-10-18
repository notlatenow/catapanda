import { useEffect, useRef, useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { catalog } from "@/services/catalog";
import type { Row } from "@/lib/checklists";
import { themeIcons } from "@/lib/themes";
import { verifyItemSource } from "@/state/search";
import type { SearchResult } from "@/lib/search-types";
import { cn } from "@/lib/utils";

const BAG_NAME = "Grab-and-go bag";
const AIDS_NAME = "Personal aids";

const AID_EXAMPLES = [
  "Spare glasses or contact lenses",
  "Hearing aid batteries",
  "Mobility aids (cane, walker)",
  "Denture care supplies",
];

function kindLabel(row: Row) {
  return row.kind === "tip" ? "CataPanda tip" : row.kind === "ai" ? "AI" : "Gov-vetted";
}

/** Items that contain other items show their contents as a tickable list. */
function includesFor(row: Row): string[] {
  if (row.name === BAG_NAME) return catalog.getBagTips().map((t) => t.text);
  if (row.name === AIDS_NAME) return AID_EXAMPLES;
  return [];
}

export function ItemPanel({ row, onClose }: { row: Row; onClose: () => void }) {
  const [ticked, setTicked] = useState<Set<number>>(new Set());
  const [verified, setVerified] = useState<SearchResult | null | "loading">(
    row.kind === "ai" && !row.sourceUrl ? "loading" : null,
  );
  const closeRef = useRef<HTMLButtonElement>(null);
  const includes = includesFor(row);
  const sources = row.sourceCodes
    .map((code) => catalog.getSource(code))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .sort((a, b) => (a.code === "TW" ? -1 : b.code === "TW" ? 1 : 0));

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (verified !== "loading") return;
    let alive = true;
    void verifyItemSource(row.name).then((r) => { if (alive) setVerified(r); });
    return () => { alive = false; };
  }, [row.name, verified]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={row.name}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-pitch/60" />
      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-snow shadow-soft sm:rounded-3xl">
        <div className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-sand sm:hidden" />
        <div className="flex items-start gap-4 p-5 pb-3">
          <img src={themeIcons[row.theme]} alt="" width={816} height={816} className="h-16 w-16 shrink-0 rounded-2xl bg-pale object-contain p-2" />
          <div className="min-w-0 flex-1">
            <h2 className="text-xl leading-6 text-ink">{row.name}</h2>
            <p className="mt-1 text-sm text-slate">{row.shortNote}</p>
            <span className={cn("mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold", row.kind === "ai" ? "bg-pale text-bright" : row.kind === "tip" ? "bg-linen text-ink" : "bg-pale text-ocean")}>
              {kindLabel(row)}
            </span>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close panel" className="rounded-full p-2 text-slate hover:bg-linen hover:text-ink">
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-6">
          {row.why && <p className="text-sm font-bold text-bright">{row.why}</p>}
          {row.medical && <p className="mt-2 rounded-2xl border border-sand bg-linen p-3 text-sm text-ink">Check with your doctor about the right supplies and amounts for you.</p>}
          {includes.length > 0 && (
            <section className="mt-4">
              <h3 className="text-lg text-ink">What to include</h3>
              <ul className="mt-2 space-y-2">
                {includes.map((line, i) => (
                  <li key={i}>
                    <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
                      <input
                        type="checkbox"
                        checked={ticked.has(i)}
                        onChange={() => setTicked((t) => { const next = new Set(t); if (next.has(i)) next.delete(i); else next.add(i); return next; })}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--bright)]"
                      />
                      <span className={cn(ticked.has(i) && "text-slate line-through")}>{line}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {row.detail && <p className="mt-4 text-sm text-slate">{row.detail}</p>}
          <section className="mt-5">
            <h3 className="text-lg text-ink">Take action</h3>
            {row.stores.length > 0 && (
              <p className="mt-2 text-sm font-bold text-ink">Find at the store: {[...row.stores].sort().join(", ")}</p>
            )}
            {sources.length > 0 && (
              <ul className="mt-3 space-y-2">
                {sources.map((s) => (
                  <li key={s.code} className="rounded-2xl border border-sand bg-pale p-3">
                    <p className="text-sm font-bold text-ink">{s.document}</p>
                    <p className="text-xs text-slate">{s.agency}</p>
                    {s.websites[0] && (
                      <a href={s.websites[0]} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-bright underline-offset-2 hover:underline">
                        Visit source <ExternalLink size={12} />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {row.kind === "ai" && (
              <div className="mt-3">
                {row.sourceUrl ? (
                  <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-2xl border border-sand bg-pale px-3 py-2 text-sm font-bold text-bright underline-offset-2 hover:underline">
                    Verified source <ExternalLink size={14} />
                  </a>
                ) : verified === "loading" ? (
                  <p className="text-sm text-slate" role="status">Checking official sources…</p>
                ) : verified ? (
                  <a href={verified.link} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-sand bg-pale p-3">
                    <p className="text-sm font-bold text-ink">{verified.title}</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-bright underline-offset-2 hover:underline">Visit source <ExternalLink size={12} /></span>
                  </a>
                ) : (
                  <p className="text-sm text-slate">No official source found for this one yet — it's an AI suggestion, so double-check it fits your needs.</p>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
