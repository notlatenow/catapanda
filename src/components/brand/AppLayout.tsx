import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { pillVariants } from "./PillButton";
import { cn } from "@/lib/utils";
import { session } from "@/state/session";

export function SiteHeader() {
  const link = "rounded-full px-4 py-1.5 font-bold text-snow/80 hover:text-snow";
  return (
    <header className="bg-panda">
      <nav className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-xl font-bold text-snow">CataPanda</Link>
        <div className="flex gap-1">
          <Link to="/" className={link} activeProps={{ className: "bg-snow/15 text-snow" }} activeOptions={{ exact: true }}>Home</Link>
          <Link to="/about" className={link} activeProps={{ className: "bg-snow/15 text-snow" }}>About</Link>
        </div>
      </nav>
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
      <div className="flex items-center justify-between gap-2 rounded-full border border-sand bg-snow px-3 py-2.5 shadow-soft">
        {back ? (
          <Link to={back} className={cn(pillVariants({ variant: "secondary" }), small)}>Back</Link>
        ) : <span />}
        <Link to="/" onClick={() => session.reset()} className="text-sm font-bold text-bright underline-offset-4 hover:underline">Start over</Link>
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
    <footer className="mx-auto max-w-xl px-4 pb-28 pt-2 text-center text-sm text-pale">
      Gov-vetted items are checked against government sources. Items marked 'AI' are AI recommendations — check them against your own needs.
    </footer>
  );
}
