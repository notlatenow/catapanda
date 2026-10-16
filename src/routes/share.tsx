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

  const links: { label: string; href: string; icon: ReactNode }[] = [
    { label: "Email", href: `mailto:?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`, icon: <Mail className="size-8" strokeWidth={2.5} /> },
    ...(device.mobile ? [{ label: "SMS", href: smsShareHref(msg, device.ios), icon: <MessageCircle className="size-8" strokeWidth={2.5} /> }] : []),
    { label: "WhatsApp", href: `https://wa.me/?text=${enc}`, icon: <WhatsAppIcon /> },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_URL)}`, icon: <FacebookIcon /> },
    { label: "X", href: xShareHref(disasters), icon: <XIcon /> },
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
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-4">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex w-20 flex-col items-center gap-2 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-16 -rotate-2 items-center justify-center rounded-[1.4rem] border-[3px] border-panda bg-snow text-panda shadow-[4px_4px_0_0_var(--panda)] transition-all group-hover:rotate-0 group-hover:text-bright group-active:translate-x-[3px] group-active:translate-y-[3px] group-active:text-brick group-active:shadow-[1px_1px_0_0_var(--panda)]">
                  {l.icon}
                </span>
                <span className="font-display text-sm font-bold text-snow">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </Page>
      <FlowNav back="/checklist" />
    </>
  );
}
