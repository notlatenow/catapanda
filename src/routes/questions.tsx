import { createFileRoute } from "@tanstack/react-router";
import { Page, FlowNav, PlaceholderNote } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";

export const Route = createFileRoute("/questions")({
  head: () => ({
    meta: [
      { title: "A few quick questions — CataPanda" },
      { name: "description", content: "Answer a few questions so CataPanda can tailor your disaster prep checklist." },
      { property: "og:title", content: "A few quick questions — CataPanda" },
      { property: "og:description", content: "Tailor your disaster prep checklist." },
    ],
  }),
  component: () => (
    <>
      <Page>
        <StackedCard>
          <h1 className="text-2xl text-ink">A few quick questions</h1>
          <p className="mt-2 text-slate">We'll ask a couple of things to fit your checklist to your household.</p>
        </StackedCard>
        <PlaceholderNote>Clarifying questions arrive in a later stage.</PlaceholderNote>
      </Page>
      <FlowNav back="/" next="/options" />
    </>
  ),
});
