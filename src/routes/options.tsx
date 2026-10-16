import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, FlowNav, PlaceholderNote } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
import { OptionCard } from "@/components/brand/OptionCard";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/options")({
  head: () => ({
    meta: [
      { title: "Checklist options — CataPanda" },
      { name: "description", content: "Choose which personalized disaster prep checklist to view." },
      { property: "og:title", content: "Checklist options — CataPanda" },
      { property: "og:description", content: "Choose your personalized checklist." },
    ],
  }),
  component: Options,
});

function Options() {
  const { disasters, clarify } = useSession();
  const hasQuestions = !!clarify?.questions.length;
  const lists = [
    { id: "top10", name: "Top 10", tagline: "The ten things to get first" },
    { id: "personalized", name: "Personalized checklist", tagline: "Everything for your household, in one place" },
    ...disasters.map((d) => ({ id: d, name: d, tagline: `The full ${d.toLowerCase()} list` })),
  ];
  return (
    <>
      <Page>
        <StackedCard>
          <h1 className="text-2xl text-ink">Your checklists</h1>
          <p className="mt-2 text-slate">Pick a checklist to open.</p>
          {disasters.length > 0 && (
            <div className="mt-4 grid gap-3">
              {lists.map((l) => (
                <Link key={l.id} to="/checklist" search={{ list: l.id }}>
                  <OptionCard name={l.name} tagline={l.tagline} />
                </Link>
              ))}
            </div>
          )}
        </StackedCard>
        {disasters.length === 0 && <PlaceholderNote>Head back to the start and pick at least one disaster first.</PlaceholderNote>}
      </Page>
      <FlowNav back={hasQuestions ? "/questions" : "/"} next={disasters.length ? "/checklist" : undefined} />
    </>
  );
}
