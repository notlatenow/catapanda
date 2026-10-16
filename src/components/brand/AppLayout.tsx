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
      <svg aria-hidden="true" viewBox="0 0 400 14" preserveAspectRatio="none" className="absolute inset-x-0 top-full block h-3.5 w-full fill-panda">
        <path d="M0 0 H400 V5 C392 9 386 4 378 7 C368 11 361 6 350 8 C340 10 334 5 322 6 C311 7 305 12 293 10 C282 8 276 4 264 6 C252 8 247 13 235 11 C224 9 219 5 207 6 C195 7 189 11 178 10 C166 9 160 4 148 6 C137 8 131 12 119 10 C108 8 101 5 90 7 C79 9 73 13 61 11 C50 9 44 5 33 6 C22 7 15 11 8 9 C4 8 2 6 0 7 Z" />
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
