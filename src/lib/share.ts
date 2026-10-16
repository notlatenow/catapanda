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

/** Email keeps numbered items and the public URL on separate lines. */
export function buildEmailShare(disasters: string[], itemNames: string[]) {
  return {
    subject: `My disaster prep Top 10 for ${SHARE_COUNTRY}`,
    body: `Made for ${disasterPhrase(disasters)} disasters, here's my top 10 list for disaster prep in ${SHARE_COUNTRY}!\r\n\r\n${itemNames.map((name, i) => `${i + 1}. ${name}`).join("\r\n")}\r\n\r\nUse this free tool to prepare your own list: Catastrophic Pandamonium\r\n${APP_URL}`,
  };
}

export function smsShareHref(message: string, ios: boolean): string {
  return `sms:${ios ? "&" : "?"}body=${encodeURIComponent(message)}`;
}

/** X gets a short post: top 5 items, "+N more", then the app URL. */
export function buildXShare(disasters: string[], itemNames: string[]): string {
  const top = itemNames.slice(0, 5).map((n, i) => `${i + 1}. ${n}`).join("\n");
  const more = itemNames.length > 5 ? ` (+${itemNames.length - 5} more)` : "";
  return `My top essentials for ${disasterPhrase(disasters)} prep in ${SHARE_COUNTRY}:\n${top}${more}\n\nMake your own list with CataPanda: ${APP_URL}`;
}

export function xShareHref(disasters: string[], itemNames: string[]): string {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(buildXShare(disasters, itemNames))}`;
}
