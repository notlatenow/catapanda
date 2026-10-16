import { createFileRoute } from "@tanstack/react-router";
import { Page, FlowNav, PlaceholderNote } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";

export const Route = createFileRoute("/options")({
  head: () => ({
    meta: [
      { title: "Checklist options — CataPanda" },
      { name: "description", content: "Choose which personalized disaster prep checklist to view." },
      { property: "og:title", content: "Checklist options — CataPanda" },
      { property: "og:description", content: "Choose your personalized checklist." },
    ],
  }),
  component: () => (
    <>
      <Page>
        <StackedCard>
          <h1 className="text-2xl text-ink">Your checklists</h1>
          <p className="mt-2 text-slate">Pick a checklist to open.</p>
        </StackedCard>
        <PlaceholderNote>Checklist options arrive in a later stage.</PlaceholderNote>
      </Page>
      <FlowNav back="/questions" next="/checklist" />
    </>
  ),
});
