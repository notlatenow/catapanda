import { APP_URL } from "@/config/app";

export const SHARE_COUNTRY = "Taiwan";

export function disasterPhrase(disasters: string[]): string {
  const d = disasters.map((x) => x.toLowerCase());
  if (d.length <= 1) return d[0] ?? "";
  if (d.length === 2) return `${d[0]} & ${d[1]}`;
  return `${d.slice(0, -1).join(", ")} & ${d[d.length - 1]}`;
}

/** Item names only — never include anything the user typed. */
export function buildShareMessage(disasters: string[], itemNames: string[]): string {
  const list = itemNames.map((n, i) => `(${i + 1}) ${n}`).join(", ");
  return `Made for ${disasterPhrase(disasters)} disasters, here's my top 10 list for disaster prep in ${SHARE_COUNTRY}! Use this free tool to prepare your own list: Catastrophic Pandamonium ${APP_URL}\n\n${list}`;
}
