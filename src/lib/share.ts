import { APP_URL } from "@/config/app";

export const SHARE_COUNTRY = "Taiwan";
export const SHARE_TIPS =
  "Pack a grab-and-go bag, keep it near the door! Have 3 days of food and water per person. Remember your flashlight and first aid kit.";

const MENTIONED = /grab-and-go|water|food|flashlight|first aid/i;

export function disasterPhrase(disasters: string[]): string {
  const d = disasters.map((x) => x.toLowerCase());
  if (d.length <= 1) return d[0] ?? "";
  if (d.length === 2) return `${d[0]} & ${d[1]}`;
  return `${d.slice(0, -1).join(", ")} & ${d[d.length - 1]}`;
}

/** Up to 2 list items not already covered by the fixed tips text. */
export function customItems(itemNames: string[]): string[] {
  return itemNames.filter((n) => !MENTIONED.test(n)).slice(0, 2);
}

function customSentence(itemNames: string[]): string {
  const c = customItems(itemNames);
  return c.length ? ` And my custom items: ${c.join(" and ")}.` : "";
}

const header = (d: string[]) => `My top essentials for ${disasterPhrase(d)} prep in ${SHARE_COUNTRY}:`;
const footer = `Make your own prep list with Catastrophic Pandamonium: ${APP_URL}`;

/** Item names only — never include anything the user typed. */
export function buildShareMessage(disasters: string[], itemNames: string[]): string {
  return `${header(disasters)}\n\n${SHARE_TIPS}${customSentence(itemNames)}\n\n${footer}`;
}

export function buildEmailShare(disasters: string[], itemNames: string[]) {
  return {
    subject: `My disaster prep essentials for ${SHARE_COUNTRY}`,
    body: buildShareMessage(disasters, itemNames).replace(/\n/g, "\r\n"),
  };
}

export function smsShareHref(message: string, ios: boolean): string {
  return `sms:${ios ? "&" : "?"}body=${encodeURIComponent(message)}`;
}

/** X gets a condensed version to fit the post limit. */
export function buildXShare(disasters: string[], itemNames: string[]): string {
  const c = customItems(itemNames);
  const extra = c.length ? ` + ${c.join(", ")}` : "";
  return `${header(disasters)} grab-and-go bag by the door, 3 days of food & water per person, flashlight, first aid kit${extra}.\n\nMake your own prep list: ${APP_URL}`;
}

export function xShareHref(disasters: string[], itemNames: string[]): string {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(buildXShare(disasters, itemNames))}`;
}
