import { useState } from "react";
import { Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DesignedList, DetailRow } from "@/lib/checklist-design";
import documentsLight from "@/assets/documents-light.webp";
import documentsMedium from "@/assets/documents-medium.webp";
import documentsDark from "@/assets/documents-dark.webp";

const categories = [
  { label: "Go-Bag", title: "Go-bag" },
  { label: "Food", title: "Food & Water" },
  { label: "Documents", title: "Documents & Money" },
  { label: "Health", title: "Health & Wellness" },
  { label: "Safety", title: "Tools & Safety" },
  { label: "Utilities", title: "Power & Communication" },
];

export function PersonalPicksHeader({ disasters }: { disasters: string[] }) {
  return <header className="text-center">
    <div className="flex items-center justify-center gap-3 text-custom-heading">
      <ActionLines />
      <h1 className="personal-picks-title text-4xl sm:text-5xl">Personal Picks</h1>
      <ActionLines flipped />
    </div>
    <p className="mt-3 text-sm text-snow">{disasters.join(" + ")}</p>
  </header>;
}

function ActionLines({ flipped = false }: { flipped?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 48" className={`h-10 w-5 shrink-0 sm:h-12 sm:w-6 ${flipped ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
    <path d="M6 6 15 13M3 24 14 24M6 42 15 35" />
  </svg>;
}

/** Exclusive, visit-only category selection; deselecting leaves the white body empty. */
export function PersonalPicks({ list, onOpen }: { list: DesignedList; onOpen: (row: DetailRow) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const rows = list.sections.find(s => s.title === selected)?.rows ?? [];
  function chooseCategory(title: string) {
    if (title === "Go-bag") {
      const bag = list.sections.find(s => s.title === title)?.rows.find(r => r.name === "Grab-and-go bag");
      if (bag) { onOpen(bag); return; }
    }
    setSelected(old => old === title ? null : title);
  }
  return <div className="flex flex-col gap-7">
    <div role="group" aria-label="Personal Picks categories" className="grid grid-cols-2 gap-x-3 gap-y-3 px-2 sm:gap-x-4">
      {categories.map(c => <Button key={c.title} variant="ghost" aria-pressed={selected === c.title} aria-controls="personal-picks-items" onClick={() => chooseCategory(c.title)} className={`personal-category-pill h-10 min-w-0 justify-start rounded-full border-2 border-snow px-4 text-base font-extrabold sm:h-12 sm:px-5 sm:text-lg ${c.label === "Documents" ? "documents-category-pill" : ""}`}>
        {c.label === "Documents" && <span aria-hidden="true" className="documents-artwork absolute inset-0 overflow-hidden rounded-full">
          <img src={documentsLight} alt="" className="documents-light absolute inset-0 h-full w-full" />
          <img src={documentsMedium} alt="" className="documents-medium absolute inset-0 h-full w-full" />
          <img src={documentsDark} alt="" className="documents-dark absolute inset-0 h-full w-full" />
        </span>}
        <span className="relative z-10">{c.label}</span>
      </Button>)}
    </div>
    <div className="personal-picks-body relative py-2">
      <div aria-hidden="true" className="absolute inset-x-4 inset-y-0 rounded-3xl bg-pitch" />
      <div id="personal-picks-items" role="region" aria-label={selected ? `${categories.find(c => c.title === selected)?.label} items` : "Personal Picks items"} className="relative min-h-72 overflow-hidden rounded-3xl bg-snow py-3 text-pitch sm:min-h-80">
        {!selected && <p className="px-5 py-4 text-base text-slate sm:px-6">We've picked a checklist just for you and your unique needs. Click through the categories to prep for success!</p>}
        {selected && rows.length > 0 && <ul>{rows.map(r => <li key={r.name} className="personal-picks-row">
          <Button variant="ghost" onClick={() => onOpen(r)} className="group h-auto min-h-16 w-full justify-start gap-3 whitespace-normal rounded-none px-5 py-4 text-left text-pitch hover:bg-border sm:min-h-18 sm:px-6">
            <span className="min-w-0 flex-1 text-base font-extrabold">{r.displayName ?? r.name}</span>
            {r.forYou && <Star aria-label="For you" className="personal-picks-star h-6 w-6 shrink-0 fill-sun text-pitch" strokeWidth={1.5} />}
            <ChevronRight aria-hidden="true" size={20} className="shrink-0 text-slate" />
          </Button>
        </li>)}</ul>}
      </div>
    </div>
  </div>;
}