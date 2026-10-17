import { createFileRoute, Link } from "@tanstack/react-router";
import backArt from "@/assets/back-wordart.png";
import { useEffect, type ReactNode } from "react";
import { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { Page } from "@/components/brand/AppLayout";
import { StackedCard } from "@/components/brand/StackedCard";
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

const svg = { className: "size-8", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
function WhatsAppIcon() {
  return <svg {...svg}><path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" /><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a4 4 0 0 1-2.2-2.2l.8-1-1-2z" /></svg>;
}
function FacebookIcon() {
  return <svg {...svg}><rect x="3" y="3" width="18" height="18" rx="5" /><path d="M15.5 7.5h-1.8A2.2 2.2 0 0 0 11.5 9.7V21M9 13h6" /></svg>;
}
function XIcon() {
  return (
    <svg {...svg} strokeWidth={2}>
      <path d="M4.2 3.8h4.9l3.1 4.3 3.6-4.3h4l-5.6 6.6 6.1 9.8h-4.9l-3.5-4.9-4.1 4.9h-4l6.1-7.2z" strokeLinejoin="round" />
      <path d="M10.6 12.2l4.8 7.6" />
    </svg>
  );
}

function SharePage() {
  const { disasters, facts, personal } = useSession();
  const [device, setDevice] = useState({ mobile: false, ios: false });

  useEffect(() => {
    const ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setDevice({ mobile: ios || /Android|Mobile/i.test(ua), ios });
  }, []);

  if (!disasters.length) {
    return (
      <Page>
        <StackedCard>
          <h1 className="text-2xl text-ink">Nothing to share yet!</h1>
          <p className="mt-2 text-slate">Head back home and pick at least one disaster first. After that, return here to share your disaster top tips with your loved ones!</p>
          <p className="mt-2 font-bold text-ink">Sharing is caring.</p>
        </StackedCard>
      </Page>
    );
  }

  const ai = personal?.status === "done" ? { items: personal.items, top: personal.top } : null;
  const names = buildAll(disasters, facts, ai).top10.sections[0]?.rows.map((r) => r.name) ?? [];
  const msg = buildShareMessage(disasters, names);
  const enc = encodeURIComponent(msg);
  const email = buildEmailShare(disasters, names);

  const links: { label: string; href: string; icon: ReactNode }[] = [
    device.mobile
      ? { label: "Text", href: smsShareHref(msg, device.ios), icon: <MessageCircle className="size-8" strokeWidth={2.5} /> }
      : { label: "Email", href: `mailto:?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`, icon: <Mail className="size-8" strokeWidth={2.5} /> },
    { label: "WhatsApp", href: `https://wa.me/?text=${enc}`, icon: <WhatsAppIcon /> },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_URL)}`, icon: <FacebookIcon /> },
    { label: "X / Twitter", href: xShareHref(disasters, names), icon: <XIcon /> },
  ];

  return (
    <>
      <Page>
        <StackedCard>
          <h1 className="text-2xl text-ink">Share your top tips!</h1>
          <p className="mt-2 text-slate">Send your list to the people you care about, so they can prep too.</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate">Message preview</p>
          <p className="mt-1 whitespace-pre-wrap break-words rounded-2xl bg-linen p-4 text-sm text-ink">{msg}</p>
        </StackedCard>
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
          {links.flatMap((l, i) => [
            ...(l.label === "Facebook" ? [<li key="back">
          <Link to="/checklist" aria-label="Back" className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <img src={backArt} alt="BACK!" width={96} className="w-24 -rotate-6 transition-transform motion-safe:duration-150 group-hover:rotate-0 group-hover:scale-125 group-active:scale-110" />
          </Link>
        </li>] : []),
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex w-20 flex-col items-center gap-2 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className={`${i % 2 ? "rotate-[7deg]" : "-rotate-[8deg]"} flex size-16 items-center justify-center rounded-[1.4rem] border-[3px] border-panda bg-snow text-panda shadow-[4px_4px_0_0_var(--panda)] transition-all group-hover:rotate-0 group-hover:text-bright group-active:translate-x-[3px] group-active:translate-y-[3px] group-active:text-brick group-active:shadow-[1px_1px_0_0_var(--panda)]`}>
                  {l.icon}
                </span>
                <span className="font-display text-sm font-bold text-snow">{l.label}</span>
              </a>
            </li>,
          ])}
        </ul>
      </Page>
    </>
  );
}
