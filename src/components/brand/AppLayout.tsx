import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { pillVariants } from "./PillButton";
import { cn } from "@/lib/utils";
import { session } from "@/state/session";

const INK_EDGE = "polygon(0 0, 100% 0, 100.00% calc(100% - 4.6px), 99.67% calc(100% - 4.6px), 98.67% calc(100% - 4.7px), 97.12% calc(100% - 4.5px), 94.25% calc(100% - 4.5px), 92.90% calc(100% - 3.3px), 91.88% calc(100% - 3.0px), 88.78% calc(100% - 1.3px), 87.45% calc(100% - 1.7px), 85.85% calc(100% - 1.9px), 82.45% calc(100% - 2.3px), 81.10% calc(100% - 2.9px), 80.03% calc(100% - 4.5px), 78.92% calc(100% - 4.4px), 77.65% calc(100% - 4.6px), 75.38% calc(100% - 4.8px), 72.42% calc(100% - 4.7px), 71.40% calc(100% - 4.8px), 70.33% calc(100% - 4.8px), 66.92% calc(100% - 2.9px), 65.92% calc(100% - 2.1px), 63.02% calc(100% - 2.0px), 62.08% calc(100% - 1.5px), 58.65% calc(100% - 3.8px), 55.38% calc(100% - 4.5px), 54.62% calc(100% - 4.5px), 51.25% calc(100% - 4.7px), 48.17% calc(100% - 4.7px), 45.33% calc(100% - 6.2px), 43.77% calc(100% - 5.5px), 42.15% calc(100% - 3.3px), 39.10% calc(100% - 2.0px), 35.60% calc(100% - 5.2px), 33.60% calc(100% - 3.5px), 31.48% calc(100% - 3.6px), 29.30% calc(100% - 2.7px), 27.32% calc(100% - 4.4px), 26.50% calc(100% - 5.4px), 25.23% calc(100% - 6.2px), 23.02% calc(100% - 6.4px), 21.82% calc(100% - 3.7px), 19.30% calc(100% - 2.2px), 15.82% calc(100% - 6.3px), 13.18% calc(100% - 2.9px), 12.18% calc(100% - 5.1px), 11.18% calc(100% - 2.9px), 8.70% calc(100% - 4.2px), 7.42% calc(100% - 3.9px), 5.28% calc(100% - 4.4px), 2.00% calc(100% - 4.0px), 0.00% calc(100% - 5.0px))";

export function SiteHeader() {
  const link = "rounded-full px-4 py-1.5 font-bold text-snow/80 hover:text-snow";
  return (
    <header className="halftone-ink relative z-10 pb-2.5" style={{ clipPath: INK_EDGE }}>
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
