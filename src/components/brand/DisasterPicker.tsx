import * as Select from "@radix-ui/react-select";
import { PillButton } from "./PillButton";
import { catalog } from "@/services/catalog";
import { cn } from "@/lib/utils";

function InkOutline({ wide = false }: { wide?: boolean }) {
  return (
    <svg aria-hidden="true" className="ink-outline" viewBox={wide ? "0 0 400 48" : "0 0 200 100"} preserveAspectRatio="none">
      {wide ? <>
        <path fillRule="evenodd" d="M15 2 C92 1 157 3 232 2 L384 1 Q397 1 398 12 L399 32 Q400 46 386 46 C293 47 218 45 136 47 L15 47 Q2 47 2 35 L1 15 Q0 2 15 2 Z M15.5 3.7 Q3.7 3.7 3.8 15 L4.3 34.5 Q4.3 43.7 16 43.7 C117 45 213 44.5 303 45 L385 44.3 Q396.4 44.8 397.3 32.5 L396.4 12.5 Q396 3.2 384 3.2 C294 4 205 3.4 124 3.7 Z" />
        <path d="M18 37 Q31 35.9 45 37 Q33 38.1 18 37 Z M49 37 Q52 35.9 56 37 Q52 38.1 49 37 Z M367 9 Q380 8.7 388 10 Q381 10.8 367 9 Z" />
      </> : <>
        <path fillRule="evenodd" d="M18 2 C53 1 82 3 116 2 L179 1 Q196 0 197 16 C197 39 198 61 197 80 Q198 97 182 98 C138 99 99 97 59 99 L20 99 Q2 100 2 82 C0 64 3 45 2 26 Q0 2 18 2 Z M18.5 4.2 Q4.8 4.2 5.3 25.5 C5.3 44 4.8 64 5.3 81 Q5.3 95.2 20.5 95.2 C69 96 111 96.3 151 96.8 L181.5 95.8 Q195.3 95.7 195.5 80 L194.8 16.5 Q195 3.3 179.5 3.2 C129 4 81 3.7 49 3.5 Z" />
        <path d="M14 63 Q16.2 70 15.7 80 Q15.7 86.2 25 86 L36 87 Q23 88.5 16 87 Q12.8 84 14 63 Z M42 86 Q47 85 50 87 Q45 88 42 86 Z M184 16 Q187 20 186 39 Q184.7 32 184 16 Z M186 44 Q187.6 47 186 51 Q185 48 186 44 Z M25 11 Q38 9.3 51 10 Q39 11.7 25 11 Z" />
      </>}
    </svg>
  );
}

function DisasterIcon({ name }: { name: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="h-16 w-16 max-w-full fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {name === "Earthquake" ? <>
        <path d="M4 13 15.5 4 28 13 M7 11v15h6 M25 11v15h-5" />
        <path d="m17 10-3 6 5 2-4 6 2 5 M10 16v3 M22 16v3" />
      </> : name === "Flood" ? <>
        <path d="m7 13 9-8 9 8 M10 11v7 M22 11v7 M16 12v3" />
        <path d="M3 21q3-4 6 0t7 0t7 0t6 0 M3 27q3-4 6 0t7 0t7 0t6 0" />
      </> : <g transform="translate(3.5 5.5) scale(0.78)">
        <path d="M7 14a5 5 0 0 1 1-10 6 6 0 0 1 11-1 5 5 0 0 1 7 9" />
        <path d="M4 17h13c6 0 6-8 2-8 M7 22h17c6 0 6-8 2-8 M11 27h7c5 0 7-2 7-5" />
      </g>}
    </svg>
  );
}

export function DisasterPicker({ picked, onToggle, region, onRegionChange }: { picked: string[]; onToggle: (name: string) => void; region: string; onRegionChange: (region: string) => void }) {
  return (
    <>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3" role="group" aria-label="Disasters">
        {catalog.getDisasters().map(({ name }) => (
          <PillButton key={name} type="button" aria-pressed={picked.includes(name)} onClick={() => onToggle(name)}
            className={cn("doodle-disaster relative flex min-w-0 flex-col gap-1 rounded-none px-1 py-4 font-display text-sm font-bold sm:text-base", picked.includes(name) && "doodle-selected")}>
            <InkOutline />
            <DisasterIcon name={name} />
            <span className="font-sans font-normal text-slate">{name}</span>
          </PillButton>
        ))}
      </div>
      <Select.Root value={region} onValueChange={(value) => onRegionChange(value === "reset-region" ? "" : value)}>
        <Select.Trigger aria-label="Country" className="doodle-region relative mt-6 flex h-12 w-full items-center justify-between gap-2 px-4 text-left text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <InkOutline wide />
          <span className={cn("font-sans font-normal", !region && "text-slate")}><Select.Value placeholder="Choose your region." /></span>
          <Select.Icon>
            <svg aria-hidden="true" viewBox="0 0 24 18" className="h-4 w-5 fill-current"><path d="m3 4 18-1-9 12Z" /></svg>
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content position="popper" sideOffset={6} className="relative z-50 min-w-[var(--radix-select-trigger-width)] rounded-lg border-0 bg-card p-2 text-card-foreground shadow-soft outline-none">
            <Select.Viewport>
              <Select.Item value="reset-region" className="cursor-pointer rounded-md px-3 py-2 text-slate outline-none data-[highlighted]:bg-accent"><Select.ItemText>Choose your region.</Select.ItemText></Select.Item>
              {catalog.getRegions().map((country) => <Select.Item key={country} value={country} className="cursor-pointer rounded-md px-3 py-2 outline-none data-[highlighted]:bg-accent"><Select.ItemText>{country}</Select.ItemText></Select.Item>)}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </>
  );
}