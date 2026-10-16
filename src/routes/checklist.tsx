import { createFileRoute } from "@tanstack/react-router";
import { Page, FlowNav, PlaceholderNote } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
import { catalog } from "@/services/catalog";

export const Route = createFileRoute("/checklist")({
  head: () => ({
    meta: [
      { title: "Your checklist — CataPanda" },
      { name: "description", content: "Your personalized, source-backed disaster prep checklist." },
      { property: "og:title", content: "Your checklist — CataPanda" },
      { property: "og:description", content: "A personalized, source-backed prep checklist." },
    ],
  }),
  component: Checklist,
});

function Checklist() {
  const preview = catalog.getCoreItems().slice(0, 3);
  return (
    <>
      <Page>
        <StackedCard>
          <h1 className="text-2xl text-ink">Your checklist</h1>
          <p className="mt-2 text-slate">Catalog preview, read live from the data files:</p>
          <ul className="mt-3">
            {preview.map((i) => (
              <li key={i.name} className="border-b border-linen py-3 last:border-0">
                <p className="font-bold text-ink">{i.name}</p>
                <p className="text-sm text-slate">{i.shortNote}</p>
              </li>
            ))}
          </ul>
        </StackedCard>
        <PlaceholderNote>Full personalized checklists arrive in a later stage.</PlaceholderNote>
      </Page>
      <FlowNav back="/options" next="/share" nextLabel="Share" />
    </>
  );
}
