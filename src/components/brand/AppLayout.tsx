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
      <svg aria-hidden="true" viewBox="0 0 400 18" preserveAspectRatio="none" className="absolute inset-x-0 top-full block h-4 w-full fill-panda">
        <path d="M0 0 H400 V5 L400.0 5.3 L392.5 3.0 L382.3 4.9 L372.6 3.7 L364.2 6.5 L352.4 4.1 L332.6 5.5 L329.9 14.3 L328.8 6.5 L316.6 3.5 L298.3 3.2 L297.1 12.0 L296.1 5.7 L283.9 6.3 L262.0 5.8 L255.0 4.9 L233.9 4.8 L218.6 5.8 L207.6 5.6 L205.7 15.6 L204.5 5.0 L196.0 4.7 L188.2 4.2 L170.5 5.1 L155.3 5.8 L136.6 4.8 L121.2 3.9 L119.1 15.1 L118.4 3.3 L103.6 5.6 L88.3 6.3 L77.4 3.4 L76.4 12.7 L75.1 6.9 L62.7 6.8 L46.7 3.5 L27.4 4.3 L26.3 11.4 L25.3 5.0 L18.3 5.1 L11.2 3.6 L0 5 Z" />
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
