import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Page, FlowNav, PlaceholderNote } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
import { PillButton, pillVariants } from "@/components/brand/PillButton";
import { cn } from "@/lib/utils";
import { buildAll } from "@/lib/checklists";
import { buildEmailShare, buildShareMessage, smsShareHref, xShareHref } from "@/lib/share";
import { APP_URL } from "@/config/app";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/share")({
  head: () => ({
    meta: [
      { title: "Share your Top 10 — CataPanda" },
      { name: "description", content: "Share your disaster prep Top 10 by email, text, WhatsApp, Facebook or X." },
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
  const { disasters, facts, personal } = useSession();
  const [status, setStatus] = useState("");
  const [device, setDevice] = useState({ mobile: false, ios: false });

  useEffect(() => {
    const ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setDevice({ mobile: ios || /Android|Mobile/i.test(ua), ios });
  }, []);

  if (!disasters.length) {
    return (
      <>
        <Page><PlaceholderNote>Pick at least one disaster first, then come back to share your Top 10.</PlaceholderNote></Page>
        <FlowNav back="/options" />
      </>
    );
  }

  const ai = personal?.status === "done" ? { items: personal.items, top: personal.top } : null;
  const names = buildAll(disasters, facts, ai).top10.sections[0]?.rows.map((r) => r.name) ?? [];
  const msg = buildShareMessage(disasters, names);
  const enc = encodeURIComponent(msg);
  const email = buildEmailShare(disasters, names);

  const copyMsg = async () => {
    const ok = await copy(msg);
    setStatus(ok ? "Copied! Ready to paste anywhere." : "Copying didn't work. Select the message above and copy it instead.");
  };

  const links = [
    { label: "Email", href: `mailto:?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}` },
    ...(device.mobile ? [{ label: "SMS text message", href: smsShareHref(msg, device.ios) }] : []),
    { label: "WhatsApp", href: `https://wa.me/?text=${enc}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_URL)}` },
    { label: "X", href: xShareHref(disasters) },
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
            <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={cn(pillVariants(), "w-full")}>{l.label}</a>
          ))}
          <PillButton variant="secondary" className="w-full" onClick={() => copyMsg()}>Copy message</PillButton>
          <p role="status" aria-live="polite" className="min-h-5 text-center text-sm font-bold text-snow">{status}</p>
        </div>
      </Page>
      <FlowNav back="/checklist" />
    </>
  );
}
