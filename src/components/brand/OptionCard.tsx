import { cn } from "@/lib/utils";

type Props = { name: string; tagline?: string; selected?: boolean; onClick?: () => void };

export function OptionCard({ name, tagline, selected, onClick }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border bg-snow p-4 text-left transition-colors",
        selected ? "border-2 border-bright bg-pale" : "border-sand hover:border-bright",
      )}
    >
      <span className="block font-display text-lg font-bold text-ink">{name}</span>
      {tagline && <span className="mt-0.5 block text-sm text-slate">{tagline}</span>}
    </button>
  );
}

export function TextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-sand bg-snow px-4 py-3 text-ink placeholder:text-slate focus:border-bright focus:outline-none",
        props.className,
      )}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full resize-none rounded-2xl border border-sand bg-snow px-4 py-3 text-ink placeholder:text-slate focus:border-bright focus:outline-none",
        props.className,
      )}
    />
  );
}
