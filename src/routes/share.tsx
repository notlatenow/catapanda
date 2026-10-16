import { createFileRoute } from "@tanstack/react-router";
import mascots from "@/assets/web-mascots.png.asset.json";
import { Page, FlowNav, PlaceholderNote } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
import { APP_URL } from "@/config/app";

export const Route = createFileRoute("/share")({
  head: () => ({
    meta: [
      { title: "Share CataPanda" },
      { name: "description", content: "Share CataPanda with family and friends so they can prepare too." },
      { property: "og:title", content: "Share CataPanda" },
      { property: "og:description", content: "Help your people get disaster-ready." },
    ],
  }),
  component: () => (
    <>
      <Page>
        <StackedCard>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl text-ink">Share the prep</h1>
              <p className="mt-2 text-slate">Send CataPanda to the people you care about.</p>
              <p className="mt-2 break-all text-sm text-bright">{APP_URL}</p>
            </div>
            <img src={mascots.url} alt="CataPanda mascots" className="w-20 shrink-0" />
          </div>
        </StackedCard>
        <PlaceholderNote>Share messages arrive in a later stage.</PlaceholderNote>
      </Page>
      <FlowNav back="/checklist" />
    </>
  ),
});
