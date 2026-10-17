import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, FlowNav } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
import { OptionCard } from "@/components/brand/OptionCard";
import { useSession } from "@/state/session";
import { usePersonalization } from "@/state/personalize";
import { ListsLoading } from "@/components/ListsLoading";
import topTipsArt from "@/assets/top-tips-wordart.png";
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
  const { disasters, clarify } = useSession();
  const hasQuestions = !!clarify?.questions.length;
  const personal = usePersonalization();
  const waiting = !personal || personal.status === "running";
  const featured = [
    { id: "top10", name: "Top Tips", art: topTipsArt, tilt: "-rotate-[25deg]" },
    { id: "personalized", name: "Personal Picks", art: personalPicksArt, tilt: "rotate-[10deg]" },
  ];
  const lists = disasters.map((d) => ({ id: d, name: d, tagline: `The full ${d.toLowerCase()} list` }));
  const featuredText = "font-display block py-6 text-center text-3xl leading-tight text-slate sm:text-4xl";
  return (
    <>
      <Page>
        {disasters.length > 0 && waiting && <ListsLoading disasters={disasters} phase={personal?.phase ?? 0} />}
        <StackedCard>
          <h1 className="text-2xl text-ink">CataPanda Prep</h1>
          <p className="mt-2 text-slate">{disasters.length ? "Pick a checklist to open." : "Head back home and pick at least one disaster first."}</p>
          {disasters.length > 0 && (
            <>
              <div className="mt-4 grid grid-cols-2 items-center gap-3">
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
                  <Link key={l.id} to="/checklist" search={{ list: l.id }}>
                    <OptionCard name={l.name} tagline={l.tagline} />
                  </Link>
                ))}
              </div>
            </>
          )}
        </StackedCard>
      </Page>
      {disasters.length > 0 && <FlowNav back={hasQuestions ? "/questions" : "/"} next="/checklist" />}
    </>
  );
}
