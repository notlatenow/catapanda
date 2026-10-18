import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
import { RegionOutline, DisasterIcon } from "@/components/brand/DisasterPicker";
import { useSession } from "@/state/session";
import { usePersonalization } from "@/state/personalize";
import { ListsLoading } from "@/components/ListsLoading";
import topTipsArt from "@/assets/top-tips-wordart.png";
import darkBackground from "@/assets/question-dark.webp";
import personalPicksArt from "@/assets/personal-picks-wordart.png";

export const Route = createFileRoute("/options")({
  head: () => ({
    meta: [
      { title: "Checklist options — CataPanda" },
      { name: "description", content: "Choose which personalized disaster prep checklist to view." },
      { property: "og:title", content: "Checklist options — CataPanda" },
      { property: "og:description", content: "Choose your personalized checklist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Options,
});

function Options() {
  const { disasters } = useSession();
  const personal = usePersonalization();
  const waiting = !personal || personal.status === "running";
  const featured = [
    { id: "top10", name: "Top Tips", art: topTipsArt, tilt: "-rotate-[5deg]" },
    { id: "personalized", name: "Personal Picks", art: personalPicksArt, tilt: "rotate-[10deg]" },
  ];
  const lists = disasters.map((d) => ({ id: d, name: `${d} Basics` }));
  const featuredText = "font-display block py-2 text-center text-3xl leading-tight text-slate sm:text-4xl";
  if (disasters.length > 0 && waiting) {
    return (
      <main className="relative isolate flex min-h-svh flex-1 text-ink">
        <img src={darkBackground} alt="" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="m-auto w-full max-w-xl px-4 py-12">
          <ListsLoading disasters={disasters} phase={personal?.phase ?? 0} />
        </div>
      </main>
    );
  }
  return (
    <>
      <Page>
        <StackedCard>
          {disasters.length ? (
            <h1 className="text-2xl text-ink">Choose a checklist:</h1>
          ) : (
            <>
              <h1 className="text-2xl text-ink">CataPanda Prep</h1>
              <p className="mt-2 text-slate">Head back home and pick at least one disaster first.</p>
            </>
          )}
          {disasters.length > 0 && (
            <>
              <div className="mt-4 grid grid-cols-2 items-center gap-3 [&>*]:min-w-0">
                {featured.map((l) =>
                  waiting ? (
                    <span key={l.id} className={`${featuredText} opacity-60`} aria-disabled="true">{l.art ? <img src={l.art} alt={l.name} className={`mx-auto h-auto w-[80%] ${l.tilt}`} /> : l.name}</span>
                  ) : (
                    <Link key={l.id} to="/checklist" search={{ list: l.id }} className={`${featuredText} group hover:text-ink`}>{l.art ? <img src={l.art} alt={l.name} className={`mx-auto h-auto w-[80%] ${l.tilt} motion-safe:transition-transform group-hover:rotate-0 group-hover:scale-125`} /> : l.name}</Link>
                  ),
                )}
              </div>
              <div className="mt-4 grid gap-3">
                {lists.map((l) => (
                  <Link key={l.id} to="/checklist" search={{ list: l.id }}
                    className="doodle-disaster doodle-pill group relative flex items-center gap-3 rounded-none px-4 py-3">
                    <RegionOutline />
                    <DisasterIcon name={l.id} selected={false} small />
                    <span className="font-sans text-sm font-bold">{l.name}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </StackedCard>
      </Page>
    </>
  );
}
