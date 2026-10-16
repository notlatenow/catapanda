import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { pillVariants } from "./PillButton";
import { cn } from "@/lib/utils";
import { session } from "@/state/session";

export function SiteHeader() {
  const link = "rounded-full px-4 py-1.5 font-bold text-snow/80 hover:text-snow";
  return (
    <header className="relative z-10 bg-panda">
      <nav className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-xl font-bold text-snow">CataPanda</Link>
        <div className="flex gap-1">
          <Link to="/" className={link} activeProps={{ className: "bg-snow/15 text-snow" }} activeOptions={{ exact: true }}>Home</Link>
          <Link to="/about" className={link} activeProps={{ className: "bg-snow/15 text-snow" }}>About</Link>
        </div>
      </nav>
      <svg aria-hidden="true" viewBox="0 0 400 10" preserveAspectRatio="none" className="absolute inset-x-0 top-full block h-2.5 w-full fill-panda">
        <path d="M0 0 H400 V5 L400.0 6.2 L398.7 6.1 L394.7 3.8 L388.5 5.0 L377.0 4.7 L371.6 8.0 L367.5 6.4 L355.1 5.3 L349.8 7.5 L343.4 7.1 L329.8 4.7 L324.4 5.4 L320.1 6.4 L315.7 6.8 L310.6 5.5 L301.5 4.3 L289.7 3.8 L285.6 4.6 L281.3 6.9 L267.7 5.0 L263.7 4.7 L252.1 6.3 L248.3 5.3 L234.6 5.6 L221.5 4.4 L218.5 7.3 L205.0 5.2 L192.7 5.3 L181.3 3.8 L175.1 4.5 L168.6 6.7 L156.4 8.0 L142.4 4.8 L134.4 6.5 L125.9 6.4 L117.2 7.3 L109.3 5.6 L106.0 4.6 L100.9 3.8 L92.1 3.6 L87.3 6.3 L77.2 7.8 L63.3 3.7 L52.7 7.1 L48.7 4.9 L44.7 7.1 L34.8 5.8 L29.7 6.1 L21.1 5.6 L8.0 6.0 L0 5 Z" />
      </svg>
    </header>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <main className="mx-auto flex max-w-xl flex-col gap-6 px-4 pt-6 pb-4">{children}</main>;
}

type FlowPath = "/" | "/questions" | "/options" | "/checklist" | "/share";

export function FlowNav({ back, next, nextLabel = "Next", nextDisabled }: { back?: FlowPath | undefined; next?: FlowPath | undefined; nextLabel?: string; nextDisabled?: boolean }) {
  const small = "px-4 py-2.5 text-sm";
  return (
    <div className="mx-auto max-w-xl px-4 pb-6">
      <div className="flex items-center justify-between gap-2 py-2.5">
        {back ? (
          <Link to={back} className={cn(pillVariants({ variant: "secondary" }), small)}>Back</Link>
        ) : <span />}
        <Link to="/" onClick={() => session.reset()} className="text-sm font-bold text-pale underline-offset-4 hover:text-snow hover:underline">Start over</Link>
        {next && nextDisabled ? (
          <button type="button" disabled className={cn(pillVariants({ variant: "primary" }), small)}>{nextLabel}</button>
        ) : next ? (
          <Link to={next} className={cn(pillVariants({ variant: "primary" }), small)}>{nextLabel}</Link>
        ) : <span />}
      </div>
    </div>
  );
}

export function PlaceholderNote({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl bg-linen px-4 py-3 text-sm text-slate">{children}</p>;
}

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-xl px-4 pb-8 pt-2 text-center text-sm text-pale">
      Gov-vetted items are checked against government sources. Items marked 'AI' are AI recommendations — check them against your own needs.
    </footer>
  );
}
