import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = { children: ReactNode; variant?: "standard" | "accent" | "welcome"; bottomTab?: "gold" | "yellow"; className?: string };

/** Signature layered card: Panda Black tab above, Sunset Gold (or White on accent) tab below. */
export function StackedCard({ children, variant = "standard", bottomTab = "gold", className }: Props) {
  const accent = variant === "accent";
  const welcome = variant === "welcome";
  return (
    <div className={cn("relative py-2", className)}>
      <div aria-hidden className="absolute inset-x-4 top-0 h-8 rounded-3xl bg-panda" />
      <div aria-hidden className={cn("absolute inset-x-4 bottom-0 h-8 rounded-3xl", accent || welcome ? "bg-snow" : bottomTab === "yellow" ? "bg-welcome" : "bg-gold")} />
      <div
        className={cn(
          "relative rounded-3xl p-5 sm:p-6",
          !welcome && !accent && bottomTab !== "yellow" && "shadow-soft",
          accent ? "bg-brick text-snow [&_h1]:text-panda [&_h2]:text-panda [&_h3]:text-panda" : welcome ? "bg-welcome text-ink" : "bg-card text-card-foreground",
        )}
      >
        {children}
      </div>
    </div>
  );
}
