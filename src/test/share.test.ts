import { describe, expect, it } from "vitest";
import { APP_URL } from "@/config/app";
import { buildEmailShare, buildShareMessage, customItems, smsShareHref, xShareHref } from "@/lib/share";

const names = ["Grab-and-go bag", "Drinking water", "Flashlight", "Whistle", "First aid kit", "Pet food", "Raincoat", "Radio"];

describe("Share formatting", () => {
  it("picks 2 custom items not already in the tips text", () => {
    expect(customItems(names)).toEqual(["Whistle", "Raincoat"]);
  });
  it("builds the main message", () => {
    expect(buildShareMessage(["Flood", "Earthquake"], names)).toBe(
      `My top essentials for flood & earthquake prep in Taiwan:\n\nPack a grab-and-go bag, keep it near the door! Have 3 days of food and water per person. Remember your flashlight and first aid kit. And my custom items: Whistle and Raincoat.\n\nMake your own prep list with Catastrophic Pandamonium: ${APP_URL}`,
    );
  });
  it("email uses the same text with CRLF and URL last", () => {
    const email = buildEmailShare(["Flood"], names);
    expect(email.body.split("\r\n").at(-1)).toContain(APP_URL);
  });
  it("uses platform-specific SMS separators", () => {
    const msg = buildShareMessage(["Flood"], names);
    expect(smsShareHref(msg, true)).toBe(`sms:&body=${encodeURIComponent(msg)}`);
    expect(smsShareHref(msg, false)).toBe(`sms:?body=${encodeURIComponent(msg)}`);
  });
  it("X post stays under 280 characters", () => {
    const text = new URL(xShareHref(["Earthquake", "Flood", "Typhoon"], names)).searchParams.get("text") ?? "";
    expect(text.length).toBeLessThan(280);
    expect(text.endsWith(APP_URL)).toBe(true);
  });
});
