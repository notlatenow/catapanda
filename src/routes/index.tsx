import { createFileRoute, useNavigate } from "@tanstack/react-router";
import logo from "@/assets/web-logo.png.asset.json";
import mascots from "@/assets/web-mascots.png.asset.json";
import { Page } from "@/components/brand/AppLayout";
import { PillButton } from "@/components/brand/PillButton";
import letsGoButton from "@/assets/lets-go-button.png";
import { StackedCard } from "@/components/brand/StackedCard";
import { TextArea } from "@/components/brand/OptionCard";
import { DisasterPicker } from "@/components/brand/DisasterPicker";
import { APP_TITLE } from "@/config/app";
import { session, useSession, isIntakeReady, DESCRIPTION_MIN, DESCRIPTION_MAX } from "@/state/session";

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
  const { disasters: picked, description, region } = useSession();
  const len = description.trim().length;
  const ready = isIntakeReady({ disasters: picked, description, region });

  return (
    <>
      <Page>
        <img src={logo.url} alt="Catastrophic Pandamonium" className="mx-auto w-full max-w-md" />
        <StackedCard>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl text-ink">Let's get your home ready.</h1>
              <p className="mt-2 text-slate">Tell us what you're prepping for and who's at home. We'll put together a friendly, government-backed checklist made just for you.</p>
            </div>
            <img src={mascots.url} alt="CataPanda mascots" className="w-24 shrink-0" />
          </div>
        </StackedCard>

        <StackedCard>
          <h2 className="text-xl text-ink">What are you preparing for?</h2>
          <p className="mt-1 text-sm text-slate">Pick at least one to get started.</p>
          <DisasterPicker picked={picked} onToggle={session.toggleDisaster} region={region} onRegionChange={session.setRegion} />
        </StackedCard>

        <StackedCard variant="accent">
          <label htmlFor="household" className="block font-display text-xl font-bold text-panda">Tell us about your household</label>
          <TextArea
            id="household"
            className="mt-3"
            rows={4}
            maxLength={DESCRIPTION_MAX}
            value={description}
            onChange={(e) => session.setDescription(e.target.value.slice(0, DESCRIPTION_MAX))}
            placeholder="Describe your home (ex: I live with my elderly mother who uses a walker, we have a cat)"
          />
          <div className="mt-2 flex justify-between text-xs">
            <span>{len < DESCRIPTION_MIN ? `Tell us a little more (at least ${DESCRIPTION_MIN} characters).` : description.length >= DESCRIPTION_MAX ? "That's the limit. Short and sweet works great!" : "Never stored or shared."}</span>
            <span aria-live="polite">{description.length}/{DESCRIPTION_MAX}</span>
          </div>
        </StackedCard>
      </Page>
      <div className="mx-auto flex max-w-xl justify-center px-4 pb-6">
        <PillButton
          type="button"
          aria-label="Let's go!"
          disabled={!ready}
          onClick={() => { if (ready) void navigate({ to: "/questions" }); }}
          className="h-36 w-60 max-w-full rounded-none bg-transparent p-0 hover:bg-transparent active:bg-transparent transition-transform duration-100 ease-out hover:rotate-12 active:scale-95 disabled:opacity-50 disabled:grayscale motion-reduce:hover:rotate-0 motion-reduce:active:scale-100 motion-reduce:transform-none motion-reduce:transition-none"
        >
          <img src={letsGoButton} alt="" className="h-full w-full object-contain" />
        </PillButton>
      </div>
    </>
  );
}
