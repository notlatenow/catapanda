import { useEffect, useMemo, useState } from "react";
import pandaBadge from "@/assets/AH-panda-circ-clean.webp.asset.json";
import { StackedCard } from "@/components/brand/StackedCard";
import { catalog } from "@/services/catalog";
import { hasSearches } from "@/state/search";

const PHASE_MESSAGES: Record<0 | 1, string[]> = {
  0: ["Reading about your household…", "Checking official health sites…", "Finding items just for you…"],
  1: ["Removing duplicates…", "Ranking your Top Tips…"],
};

function useTick(ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((x) => x + 1), ms);
    return () => clearInterval(t);
  }, [ms]);
  return n;
}

export function ListsLoading({ disasters, phase }: { disasters: string[]; phase: 0 | 1 }) {
  const tick = useTick(3500);
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
  const msg = msgs[Math.min(tick, msgs.length - 1)] ?? "Working hard on your lists…";
  const tip = tips.length ? tips[tick % tips.length] : undefined;

  return (
    <StackedCard topTab="blue">
      <div className="flex flex-col items-center gap-3 py-4 text-center" role="status" aria-live="polite">
        <h1 className="text-2xl text-ink">Working hard on your lists</h1>
        <div className="relative h-96 w-full overflow-hidden">
          <div className="question-cat-bounce absolute flex aspect-square items-center justify-center">
            <img src={pandaBadge.url} alt="CataPanda panda in a yellow circle" className="question-cat-wobble aspect-square object-contain" />
          </div>
        </div>
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
