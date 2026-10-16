import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page, FlowNav, PlaceholderNote } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
import { PillButton } from "@/components/brand/PillButton";
import { buildAll } from "@/lib/checklists";
import { buildShareMessage } from "@/lib/share";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/share")({
  head: () => ({
    meta: [
      { title: "Share your Top 10 — CataPanda" },
      { name: "description", content: "Share your disaster prep Top 10 by email, text, WhatsApp, Signal or Instagram." },
      { property: "og:title", content: "Share your Top 10 — CataPanda" },
      { property: "og:description", content: "Help your people get disaster-ready." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SharePage,
});

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function SharePage() {
  const { disasters, facts } = useSession();
  const [status, setStatus] = useState("");

  if (!disasters.length) {
    return (
      <>
        <Page><PlaceholderNote>Pick at least one disaster first, then come back to share your Top 10.</PlaceholderNote></Page>
        <FlowNav back="/options" />
      </>
    );
  }

  const names = buildAll(disasters, facts).top10.sections[0]!.rows.map((r) => r.name);
  const msg = buildShareMessage(disasters, names);
  const enc = encodeURIComponent(msg);

  const copyMsg = async (app?: string) => {
    const ok = await copy(msg);
    setStatus(ok ? `Message copied!${app ? ` Open ${app} and paste it in.` : ""}` : "Couldn't copy automatically — select the preview text above and copy it.");
  };

  const shareSheet = async (app: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ text: msg });
        setStatus("");
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    await copyMsg(app);
  };

  const links = [
    { label: "Email", href: `mailto:?subject=${encodeURIComponent("My disaster prep Top 10")}&body=${enc}` },
    { label: "SMS text message", href: `sms:?&body=${enc}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${enc}` },
  ];

  return (
    <>
      <Page>
        <StackedCard>
          <h1 className="text-2xl text-ink">Share your Top 10</h1>
          <p className="mt-2 text-slate">Send your list to the people you care about, so they can prep too.</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate">Message preview</p>
          <p className="mt-1 whitespace-pre-wrap break-words rounded-2xl bg-linen p-4 text-sm text-ink">{msg}</p>
        </StackedCard>
        <div className="flex flex-col gap-3">
          {links.map((l) => (
            <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="contents">
              <PillButton className="w-full" tabIndex={-1}>{l.label}</PillButton>
            </a>
          ))}
          <PillButton className="w-full" onClick={() => shareSheet("Signal")}>Signal</PillButton>
          <PillButton className="w-full" onClick={() => shareSheet("Instagram")}>Instagram</PillButton>
          <PillButton variant="secondary" className="w-full" onClick={() => copyMsg()}>Copy message</PillButton>
          <p role="status" aria-live="polite" className="min-h-5 text-center text-sm font-bold text-ink">{status}</p>
        </div>
      </Page>
      <FlowNav back="/checklist" />
    </>
  );
}
