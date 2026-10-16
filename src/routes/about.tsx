import { createFileRoute } from "@tanstack/react-router";
import mascots from "@/assets/web-mascots.png.asset.json";
import { Page, PlaceholderNote } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
import { catalog } from "@/services/catalog";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — CataPanda" },
      { name: "description", content: "How CataPanda builds disaster prep checklists from government-vetted sources." },
      { property: "og:title", content: "About — CataPanda" },
      { property: "og:description", content: "Government-vetted sources behind every CataPanda checklist." },
    ],
  }),
  component: About,
});

function About() {
  const sources = catalog.getSources();
  return (
    <Page>
      <img src={mascots.url} alt="CataPanda mascots" className="mx-auto w-40" />
      <StackedCard>
        <h1 className="text-2xl text-ink">About CataPanda</h1>
        <p id="gov-vetted" className="mt-2 scroll-mt-20 text-slate">Every item comes from official disaster-preparedness guidance. Sources:</p>
        <ul className="mt-3">
          {sources.map((s) => (
            <li key={s.code} className="border-b border-linen py-2 text-sm text-ink last:border-0">
              <span className="font-bold">{s.code}</span> · {s.country}
            </li>
          ))}
        </ul>
      </StackedCard>
      <PlaceholderNote>The full About page arrives in a later stage.</PlaceholderNote>
    </Page>
  );
}
