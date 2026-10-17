import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PillButton, pillVariants } from "./PillButton";
import { cn } from "@/lib/utils";
import { session } from "@/state/session";
import logoAsset from "@/assets/web-logo.png.asset.json";

const INK_EDGE = "polygon(0 0, 100% 0, 100.00% calc(100% - 7.4px), 99.67% calc(100% - 7.4px), 98.67% calc(100% - 7.5px), 97.12% calc(100% - 7.2px), 94.25% calc(100% - 7.2px), 92.90% calc(100% - 5.3px), 91.88% calc(100% - 4.8px), 88.78% calc(100% - 2.1px), 87.45% calc(100% - 2.7px), 85.85% calc(100% - 3.0px), 82.45% calc(100% - 3.7px), 81.10% calc(100% - 4.6px), 80.03% calc(100% - 7.2px), 78.92% calc(100% - 7.0px), 77.65% calc(100% - 7.4px), 75.38% calc(100% - 7.7px), 72.42% calc(100% - 7.5px), 71.40% calc(100% - 7.7px), 70.33% calc(100% - 7.7px), 66.92% calc(100% - 4.6px), 65.92% calc(100% - 3.4px), 63.02% calc(100% - 3.2px), 62.08% calc(100% - 2.4px), 58.65% calc(100% - 6.1px), 55.38% calc(100% - 7.2px), 54.62% calc(100% - 7.2px), 51.25% calc(100% - 7.5px), 48.17% calc(100% - 7.5px), 45.33% calc(100% - 9.9px), 43.77% calc(100% - 8.8px), 42.15% calc(100% - 5.3px), 39.10% calc(100% - 3.2px), 35.60% calc(100% - 8.3px), 33.60% calc(100% - 5.6px), 31.48% calc(100% - 5.8px), 29.30% calc(100% - 4.3px), 27.32% calc(100% - 7.0px), 26.50% calc(100% - 8.6px), 25.23% calc(100% - 9.9px), 23.02% calc(100% - 10.2px), 21.82% calc(100% - 5.9px), 19.30% calc(100% - 3.5px), 15.82% calc(100% - 10.1px), 13.18% calc(100% - 4.6px), 12.18% calc(100% - 8.2px), 11.18% calc(100% - 4.6px), 8.70% calc(100% - 6.7px), 7.42% calc(100% - 6.2px), 5.28% calc(100% - 7.0px), 2.00% calc(100% - 6.4px), 0.00% calc(100% - 8.0px))";

export function SiteHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const home = pathname === "/";
  const link = "rounded-full px-2 py-1.5 text-sm sm:px-4 sm:text-base font-bold text-sun hover:text-snow active:text-sky";
  return (
    <header className={cn("halftone-ink relative z-10", home ? "pb-20" : "pb-4")} style={{ clipPath: INK_EDGE }}>
      <nav className="mx-auto flex max-w-xl items-center justify-end gap-2 px-4 py-4">
        {(pathname === "/options" || pathname === "/share") && (
          <img src={logoAsset.url} alt="CataPanda" className={cn("mr-auto h-auto shrink-0 object-contain", pathname === "/share" ? "max-h-15 w-35 sm:w-40" : "max-h-12 w-28 sm:w-32")} />
        )}
        <div className="flex shrink-0 gap-1">
          <Link to="/" onClick={() => session.reset()} className={link} activeOptions={{ exact: true }}>Home</Link>
          <Link to="/about" className={link}>About</Link>
          <Link to="/share" className={link}>Share</Link>
        </div>
      </nav>
    </header>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <main className="mx-auto flex max-w-xl flex-col gap-6 px-4 pt-6 pb-4">{children}</main>;
}

type FlowPath = "/" | "/questions" | "/options" | "/checklist" | "/share";

export function FlowNav({ back, next, nextLabel = "Next", nextDisabled, startOver = true }: { back?: FlowPath | undefined; next?: FlowPath | undefined; nextLabel?: string; nextDisabled?: boolean; startOver?: boolean }) {
  const small = "px-4 py-2.5 text-sm";
  const enabled = "border-2 border-transparent bg-panda text-snow hover:border-flow-hover hover:bg-flow-hover hover:text-flow-hover-text active:bg-flow-hover active:text-flow-hover-text";
  return (
    <div className="mx-auto max-w-xl px-4 pb-6">
      <div className={cn("flex items-center gap-2 py-2.5", !back && !startOver ? "justify-center" : "justify-between")}>
        {back ? (
          <Link to={back} className={cn(pillVariants({ variant: "primary" }), small, enabled)}>Back</Link>
        ) : startOver ? <span /> : null}
        {startOver ? <Link to="/" onClick={() => session.reset()} className="text-sm font-bold text-dusk hover:text-snow active:text-sun">Start over</Link> : back ? <span /> : null}
        {next && nextDisabled ? (
          <PillButton type="button" disabled className={cn(small, "border-2 border-dusk bg-sky text-dusk disabled:opacity-100")}>{nextLabel}</PillButton>
        ) : next ? (
          <Link to={next} className={cn(pillVariants({ variant: "primary" }), small, enabled)}>{nextLabel}</Link>
        ) : <span />}
      </div>
    </div>
  );
}

export function PlaceholderNote({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl bg-linen px-4 py-3 text-sm text-slate">{children}</p>;
}

export function SiteFooter() {
  const home = useRouterState({ select: (state) => state.location.pathname === "/" });
  return (
    <footer className="mx-auto max-w-xl px-4 pb-8 pt-2 text-center text-sm text-pale">
      {home
        ? "Your privacy is protected. The household description you enter is used only to build your lists. We don't store it or share it."
        : "Gov-vetted items are checked against government sources. Items marked 'AI' are AI recommendations — check them against your own needs."}
    </footer>
  );
}
