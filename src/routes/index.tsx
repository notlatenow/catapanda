import { createFileRoute, useNavigate } from "@tanstack/react-router";
import logo from "@/assets/web-logo.png.asset.json";
import { Page } from "@/components/brand/AppLayout";
import { PillButton } from "@/components/brand/PillButton";
import letsGoButton from "@/assets/lets-go-button-clean.png";
import { StackedCard } from "@/components/brand/StackedCard";
import { DisasterPicker } from "@/components/brand/DisasterPicker";
import { APP_TITLE } from "@/config/app";
import { catalog } from "@/services/catalog";
import { session, useSession, isIntakeReady } from "@/state/session";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: APP_TITLE },
      { name: "description", content: "Build personalized earthquake, flood and typhoon prep checklists for your household in Taiwan." },
      { property: "og:title", content: APP_TITLE },
      { property: "og:description", content: "Personalized disaster prep checklists for households in Taiwan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Start,
});

function Start() {
  const navigate = useNavigate();
  const { disasters: picked, region } = useSession();
  const ready = isIntakeReady({ disasters: picked, region });

  return (
    <>
      <div className="pointer-events-none relative z-20 -mt-36 flex justify-center overflow-hidden" >
        <img src={logo.url} alt="Catastrophic Pandamonium" className="w-[120%] max-w-none shrink-0 sm:w-full sm:max-w-2xl" />
      </div>
      <Page>
        <StackedCard variant="welcome">
          <h1 className="text-2xl text-snow">Let's get your home ready.</h1>
          <p className="mt-2 text-snow">We get it: nobody wants natural disasters. But when one comes, you'll know how to prepare thanks to our gov-backed checklist. Sourced from {catalog.getSources().length} official government resources across Asia, so you know it's legit. Tell us what you're prepping for and who's at home...</p>
        </StackedCard>

        <StackedCard bottomTab="yellow">
          <h2 className="text-xl text-ink">What are you preparing for?</h2>
          <p className="mt-1 text-sm text-slate">Pick at least one to get started.</p>
          <DisasterPicker picked={picked} onToggle={session.toggleDisaster} region={region} onRegionChange={session.setRegion} />
        </StackedCard>

      </Page>
      <div className="mx-auto flex max-w-xl justify-center px-4 pb-6">
        <PillButton
          type="button"
          aria-label="Let's go!"
          disabled={!ready}
          onClick={() => { if (ready) { session.setFormStep(0); void navigate({ to: "/questions" }); } }}
          className="h-36 w-60 max-w-full rounded-none bg-transparent p-0 hover:bg-transparent active:bg-transparent transition-transform duration-100 ease-out hover:rotate-12 active:scale-95 disabled:opacity-50 disabled:grayscale motion-reduce:hover:rotate-0 motion-reduce:active:scale-100 motion-reduce:transform-none motion-reduce:transition-none"
        >
          <img src={letsGoButton} alt="" className="h-full w-full object-contain" />
        </PillButton>
      </div>
    </>
  );
}
