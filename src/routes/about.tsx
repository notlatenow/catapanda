import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import mascots from "@/assets/web-mascots.png.asset.json";
import { Page } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
import { catalog } from "@/services/catalog";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — CataPanda" },
      { name: "description", content: "How CataPanda builds disaster prep checklists from government-vetted sources." },
      { property: "og:title", content: "About — CataPanda" },
      { property: "og:description", content: "Government-vetted sources behind every CataPanda checklist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: About,
});

function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <StackedCard>
        <h2 className="text-xl text-ink">{title}</h2>
        <div className="mt-3 flex flex-col gap-3 text-slate">{children}</div>
      </StackedCard>
    </section>
  );
}

function About() {
  const sources = catalog.getSources();
  const tips = catalog.getCataPandaTips();
  return (
    <Page>
      <img src={mascots.url} alt="CataPanda mascots" className="mx-auto w-40" />
      <Section title="About CataPanda">
        <p>Hi! CataPanda (short for Catastrophic Pandamonium) helps you get ready for earthquakes, floods and typhoons in Taiwan.</p>
        <p>Pick what you're preparing for, tell us a little about your home, and we'll hand you a clear, doable checklist. No panic, just a plan.</p>
      </Section>

      <h2 className="-mb-2 px-1 text-2xl text-ink">Where our items come from</h2>

      <Section id="gov-vetted" title="Gov-vetted">
        <p>Our "core" items come from a catalog the CataPanda team researched by hand, using official government and civil-defense guidance on disaster prep.</p>
        <p>We read about 30 official documents and checked them against the agencies' own websites. In the end, {sources.length} agencies made the cut as item sources.</p>
        <p>We'll keep updating the catalog as we add more government sources.</p>
        <ul>
          {sources.map((s) => (
            <li key={s.code} className="border-b border-linen py-3 text-sm last:border-0">
              <p className="font-bold text-ink">{s.country} <span className="text-slate">({s.code})</span></p>
              <p>{s.agency}</p>
              {s.websites.map((w) => (
                <a key={w} href={w} target="_blank" rel="noopener noreferrer" className="block break-all text-bright underline-offset-2 hover:underline">{w} ↗</a>
              ))}
            </li>
          ))}
        </ul>
        <p>On your Personalized checklist, both the Combo and Core sections are built from these vetted core items.</p>
      </Section>

      <Section id="catapanda-tips" title="CataPanda Tips">
        <p>We always add these {tips.length === 2 ? "two" : tips.length} items, because they make every other item easier to use:</p>
        <ul className="flex flex-col gap-2">
          {tips.map((t) => (
            <li key={t.name}><span className="font-bold text-ink">{t.name}:</span> {t.shortNote}.</li>
          ))}
        </ul>
        <p>A grab-and-go bag keeps everything together by the door, so you can leave fast. Taiwan's fire agencies build their whole guide around it. A personal medical info card is our own addition. If you can't speak for yourself, it tells helpers your blood type, allergies and medications.</p>
      </Section>

      <Section id="ai" title="AI">
        <p>CataPanda uses AI to tailor your lists to your household. It reads what you told us, figures out who's at home (like a baby, a grandparent or a pet), and suggests a few extra items just for you. It also picks your Top 10 and explains why each one matters for you.</p>
        <p>Every AI item is labeled "AI", so you always know where it came from.</p>
        <h3 id="how-the-tiers-work" className="scroll-mt-20 font-bold text-ink">How the tiers work</h3>
        <ul className="flex flex-col gap-2">
          <li><span className="font-bold text-ink">Tier 1: The vetted catalog.</span> Always used. Every list starts with our gov-vetted items.</li>
          <li><span className="font-bold text-ink">Tier 2: AI reasoning.</span> For common needs like pets, special diets, sensitive skin or pregnancy, AI adds items alongside the catalog.</li>
          <li id="tier-3"><span className="font-bold text-ink">Tier 3: Live web search.</span> Used only for niche needs (such as medical devices and their power backup, severe allergies, or specialized care). It searches only official government and health-authority sites, never sends your personal words or details, and links each item directly to its official source.</li>
        </ul>
        <h3 className="font-bold text-ink">Our guardrails</h3>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>AI never changes, renames or removes vetted items. It only adds alongside them.</li>
          <li>Physical items and supplies only.</li>
          <li>No brand names, store names or medication doses.</li>
          <li>Medical items always say "Check with your doctor".</li>
        </ul>
        <p>Your household description is never stored or shared.</p>
      </Section>

      <Section id="privacy" title="Privacy">
        <p>The household description you enter is used only to build your lists. We don't store it or share it.</p>
      </Section>
    </Page>
  );
}
