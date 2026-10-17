import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = { children: ReactNode; variant?: "standard" | "accent" | "welcome"; bottomTab?: "gold" | "yellow" | "blue"; className?: string };

/** Signature layered card: Panda Black tab above, yellow or white tab below, without shadows. */
export function StackedCard({ children, variant = "standard", bottomTab = "yellow", className }: Props) {
  const accent = variant === "accent";
  const welcome = variant === "welcome";
  return (
    <div className={cn("relative py-2", className)}>
      <div aria-hidden className="absolute inset-x-4 top-0 h-8 rounded-3xl bg-panda" />
      <div aria-hidden className={cn("absolute inset-x-4 bottom-0 h-8 rounded-3xl", accent || welcome ? "bg-snow" : bottomTab === "yellow" ? "bg-intake-tab" : bottomTab === "blue" ? "bg-bright" : "bg-gold")} />
      <div
        className={cn(
          "relative rounded-3xl p-5 sm:p-6",
          accent ? "bg-brick text-snow [&_h1]:text-panda [&_h2]:text-panda [&_h3]:text-panda" : welcome ? "bg-welcome text-ink" : "bg-card text-card-foreground",
        )}
      >
        {children}
      </div>
    </div>
  );
}
