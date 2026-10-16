import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/web-logo.png.asset.json";
import mascots from "@/assets/web-mascots.png.asset.json";
import { Page, FlowNav } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
import { OptionCard, TextField } from "@/components/brand/OptionCard";
import { PillButton } from "@/components/brand/PillButton";
import { catalog } from "@/services/catalog";
import { APP_TITLE } from "@/config/app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: APP_TITLE },
      { name: "description", content: "Build personalized earthquake, flood and typhoon prep checklists for your household in Taiwan." },
      { property: "og:title", content: APP_TITLE },
      { property: "og:description", content: "Personalized disaster prep checklists for households in Taiwan." },
    ],
  }),
  component: Start,
});

function Start() {
  const disasters = catalog.getDisasters();
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (n: string) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));

  return (
    <>
      <Page>
        <img src={logo.url} alt="Catastrophic Pandamonium" className="mx-auto w-full max-w-md" />
        <StackedCard>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl text-ink">Get ready, together.</h1>
              <p className="mt-2 text-slate">Pick the disasters you're preparing for and tell us about your household. We'll build checklists you can trust.</p>
            </div>
            <img src={mascots.url} alt="CataPanda mascots" className="w-24 shrink-0" />
          </div>
        </StackedCard>

        <StackedCard variant="accent">
          <h2 className="text-xl">What are you preparing for?</h2>
          <p className="mt-1 text-sm">Pick one or more.</p>
          <div className="mt-4 grid gap-3">
            {disasters.map((d) => (
              <OptionCard key={d.name} name={d.name} tagline={d.tagline} selected={picked.includes(d.name)} onClick={() => toggle(d.name)} />
            ))}
          </div>
          <label className="mt-4 block text-sm font-bold">Your household</label>
          <TextField className="mt-1" placeholder="e.g. Two adults, a toddler and a cat" />
          <p className="mt-2 text-xs">Never stored or shared.</p>
        </StackedCard>

        <div className="flex flex-wrap gap-3">
          <Link to="/questions"><PillButton>Let's go</PillButton></Link>
          <Link to="/about"><PillButton variant="secondary">How it works</PillButton></Link>
          <PillButton disabled>Disabled</PillButton>
        </div>
      </Page>
      <FlowNav next="/questions" />
    </>
  );
}
