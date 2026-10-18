import { useEffect, useMemo, useState } from "react";
import mascots from "@/assets/web-mascots.png.asset.json";
import { StackedCard } from "@/components/brand/StackedCard";
import { catalog } from "@/services/catalog";
import { hasSearches } from "@/state/search";

/** Swap in 2–3 hand-drawn frames (the pair digging) here; they cycle automatically. */
const FRAMES: string[] = [mascots.url];

const PHASE_MESSAGES: Record<0 | 1, string[]> = {
  0: ["Reading about your household…", "Checking official health sites…", "Finding items just for you…"],
  1: ["Removing duplicates…", "Ranking your Top Tips…"],
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const on = () => setReduced(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return reduced;
}

function useTick(ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((x) => x + 1), ms);
    return () => clearInterval(t);
  }, [ms]);
  return n;
}

export function ListsLoading({ disasters, phase }: { disasters: string[]; phase: 0 | 1 }) {
  const reduced = useReducedMotion();
  const tick = useTick(3500);
  const frameTick = useTick(400);
  const tips = useMemo(
    () => [
      ...disasters.flatMap((d) => (catalog.getDisaster(d)?.tips ?? []).map((t) => ({ label: `${d} tip`, ...t }))),
      ...catalog.getBagTips().map((t) => ({ label: "Using & maintaining the bag", ...t })),
    ],
    [disasters],
  );
  const searching = useMemo(() => hasSearches(), []);
  const msgs = PHASE_MESSAGES[phase].filter((m) => searching || !m.startsWith("Checking official"));
  const slow = tick >= 4; // ~14s
  const msg = msgs[Math.min(tick, msgs.length - 1)]!;
  const tip = tips.length ? tips[tick % tips.length] : undefined;
  const frame = reduced ? FRAMES[0] : FRAMES[frameTick % FRAMES.length];

  return (
    <StackedCard topTab="blue">
      <div className="flex flex-col items-center gap-3 py-4 text-center" role="status" aria-live="polite">
        <h1 className="text-2xl text-ink">Working hard on your lists</h1>
        <img src={frame} alt="The CataPanda cat and panda hard at work" className={reduced ? "w-32" : "cp-bob w-32"} />
        <p className="font-bold text-ink">{msg}</p>
        {slow && <p className="text-sm text-slate">Taking a little longer than usual. Hang tight, your lists are almost ready!</p>}
        {tip && (
          <div className="mt-2 w-full rounded-2xl bg-linen p-4 text-left text-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate">{tip.label}</p>
            <p className="mt-1 text-ink">{tip.text}</p>
          </div>
        )}
      </div>
    </StackedCard>
  );
}
