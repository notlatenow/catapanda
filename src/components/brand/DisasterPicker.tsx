import * as Select from "@radix-ui/react-select";
import { PillButton } from "./PillButton";
import { catalog } from "@/services/catalog";
import { cn } from "@/lib/utils";

export function InkOutline({ wide = false, name = "Earthquake" }: { wide?: boolean; name?: string }) {
  return (
    <svg aria-hidden="true" className="ink-outline" viewBox={wide ? "0 0 400 48" : "0 0 200 100"} preserveAspectRatio="none">
      {wide ? <>
        <path fillRule="evenodd" d="M15 2 C92 1 157 3 232 2 L384 1 Q397 1 398 12 L399 32 Q400 46 386 46 C293 47 218 45 136 47 L15 47 Q2 47 2 35 L1 15 Q0 2 15 2 Z M15.5 3.7 Q3.7 3.7 3.8 15 L4.3 34.5 Q4.3 43.7 16 43.7 C117 45 213 44.5 303 45 L385 44.3 Q396.4 44.8 397.3 32.5 L396.4 12.5 Q396 3.2 384 3.2 C294 4 205 3.4 124 3.7 Z" />
        <path d="M6 12 Q4.6 24 6 36 Q3.4 24 6 12 Z" />
        <g transform="translate(311.3 56.1) scale(0.09 -0.09)">
          <path d="M385 480 l-50 -5 60 -7 c33 -3 80 -3 105 1 l45 7 -55 5 c-30 2 -77 2 -105 -1z" />
          <path d="M690 474 c61 -10 147 -36 169 -53 16 -13 30 -43 46 -102 l24 -84 0 60 c0 95 -15 125 -78 158 -45 22 -67 27 -120 26 -36 -1 -55 -3 -41 -5z" />
        </g>
      </> : <>
        <path fillRule="evenodd" d="M18 2 C53 1 82 3 116 2 L179 1 Q196 0 197 16 C197 39 198 61 197 80 Q198 97 182 98 C138 99 99 97 59 99 L20 99 Q2 100 2 82 C0 64 3 45 2 26 Q0 2 18 2 Z M18.5 4.2 Q4.8 4.2 5.3 25.5 C5.3 44 4.8 64 5.3 81 Q5.3 95.2 20.5 95.2 C69 96 111 96.3 151 96.8 L181.5 95.8 Q195.3 95.7 195.5 80 L194.8 16.5 Q195 3.3 179.5 3.2 C129 4 81 3.7 49 3.5 Z" />
        {name === "Earthquake" ? <path d="M13 63 Q15.2 72 14.7 81 Q14.8 87 25 87 L35 88 Q23 89.4 15 88 Q11.8 84 13 63 Z M13 47 Q14.6 52 13.5 59 Q12.5 55 13 47 Z M185 14 Q187.3 23 186 37 Q184.5 27 185 14 Z" />
          : name === "Flood" ? <path d="M13 78 Q15.5 83 15.8 85 Q16.5 88 25 87.5 L34 88 Q24 89.8 16 89 Q12.8 86 13 78 Z M42 88 Q46 86.8 50 88.5 Q46 89.5 42 88 Z M185 16 Q187.2 24 186 39 Q184.5 29 185 16 Z M186 44 Q187.5 47 186 51 Q185 48 186 44 Z" />
          : <path d="M24 10 Q37 8.5 50 9.5 Q37 11.2 24 10 Z M149 8 Q157 7.1 164 8 Q158 9.1 149 8 Z M169 8 Q180 6.8 186 10 Q189 13 188 19 Q186.3 15 185.5 12 Q183 8.8 169 8 Z M13 64 Q15.4 73 14.7 84 Q12.8 77 13 64 Z" />}
      </>}
    </svg>
  );
}

function RegionOutline() {
  return (
    <svg aria-hidden="true" className="ink-outline" viewBox="14 24 1003 93" preserveAspectRatio="none">
      <g transform="translate(0 140) scale(0.1 -0.1)">
        <path fillRule="evenodd" d="M7850 1148 c-668 -5 -2628 -10 -4355 -11 -2955 -2 -3143 -3 -3191 -19 -74 -26 -116 -57 -142 -108 -27 -54 -28 -129 -8 -417 16 -216 22 -235 94 -290 90 -69 -23 -66 2059 -59 1821 6 6166 16 7130 17 434 0 487 2 547 18 128 36 179 106 177 246 -1 133 -22 417 -33 460 -14 55 -79 116 -153 146 -60 23 -63 24 -485 25 -234 1 -972 -3 -1640 -8z m2121 -56 c113 -45 125 -75 140 -361 11 -202 11 -226 -5 -276 -19 -62 -79 -122 -143 -145 -78 -27 -2008 -34 -5858 -21 -1975 7 -3624 16 -3667 21 -94 10 -158 37 -188 80 -29 40 -39 133 -41 381 -1 149 2 183 16 213 22 45 68 82 132 104 44 16 383 17 4543 23 5486 6 5000 8 5071 -19z" />
        <path d="M9080 1030 c74 -11 216 -10 175 0 -16 4 -75 8 -130 7 -88 0 -93 -1 -45 -7z M9414 1032 c9 -8 227 -29 328 -31 200 -4 215 -18 234 -211 4 -41 7 -81 7 -87 0 -7 4 -13 8 -13 19 0 23 269 5 299 -8 13 -85 30 -162 36 -77 6 -425 12 -420 7z M254 840 c3 -36 8 -119 11 -185 4 -66 10 -138 15 -160 12 -53 3 236 -11 329 -12 90 -22 99 -15 16z M640 391 c0 -7 25 -11 62 -11 74 0 70 11 -7 17 -35 3 -55 1 -55 -6z M960 388 c0 -11 410 -9 435 2 12 6 -65 9 -207 8 -126 -1 -228 -6 -228 -10z" />
      </g>
    </svg>
  );
}

export function DisasterIcon({ name, selected, small = false }: { name: string; selected: boolean; small?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={cn("max-w-full fill-none stroke-current motion-safe:transition-transform motion-safe:duration-150", small ? "h-7 w-7 shrink-0" : "h-16 w-16", selected ? "rotate-0" : name === "Flood" ? "rotate-[8deg]" : "-rotate-[8deg]", small && "motion-safe:group-active:rotate-[10deg]")} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <g>
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
      </g>
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
            <InkOutline name={name} />
            <DisasterIcon name={name} selected={picked.includes(name)} />
            <span className={cn("font-sans text-sm font-normal", picked.includes(name) ? "text-pitch" : "text-slate")}>{name}</span>
          </PillButton>
        ))}
      </div>
      <Select.Root value={region} onValueChange={(value) => onRegionChange(value === "reset-region" ? "" : value)}>
        <Select.Trigger aria-label="Country" className="doodle-region relative mt-6 flex h-12 w-full items-center justify-between gap-2 px-4 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <RegionOutline />
          <span className={cn("font-sans font-normal", !region && "text-slate")}><Select.Value placeholder="Choose your region." /></span>
          <Select.Icon>
            <svg aria-hidden="true" viewBox="0 0 24 18" className="h-4 w-5 fill-current"><path d="m3 4 18-1-9 12Z" /></svg>
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content position="popper" sideOffset={6} className="relative z-50 min-w-[var(--radix-select-trigger-width)] rounded-lg border-0 bg-card p-2 text-sm text-card-foreground shadow-soft outline-none">
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