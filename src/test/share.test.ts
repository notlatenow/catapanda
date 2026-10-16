import { describe, expect, it } from "vitest";
import { APP_URL } from "@/config/app";
import { buildEmailShare, buildShareMessage, smsShareHref, xShareHref } from "@/lib/share";

describe("Share formatting", () => {
  it("formats email with separate numbered lines and a standalone URL", () => {
    const email = buildEmailShare(["Flood", "Earthquake"], ["Grab-and-go bag", "Drinking water"]);
    expect(email.subject).toBe("My disaster prep Top 10 for Taiwan");
    expect(email.body).toContain("flood & earthquake disasters");
    expect(email.body.split("\r\n")).toContain("1. Grab-and-go bag");
    expect(email.body.split("\r\n")).toContain("2. Drinking water");
    expect(email.body.split("\r\n").at(-1)).toBe(APP_URL);
  });
  it("uses platform-specific SMS separators and preserves encoded text", () => {
    const msg = buildShareMessage(["Flood"], ["Drinking water"]);
    expect(smsShareHref(msg, true)).toBe(`sms:&body=${encodeURIComponent(msg)}`);
    expect(smsShareHref(msg, false)).toBe(`sms:?body=${encodeURIComponent(msg)}`);
  });
  it("prefills X with concise text and the configured public URL", () => {
    const url = new URL(xShareHref(["Flood", "Earthquake"]));
    expect(url.searchParams.get("url")).toBe(APP_URL);
    expect(url.searchParams.get("text")).toContain("flood & earthquake");
    expect((url.searchParams.get("text") ?? "").length + 24).toBeLessThan(280);
  });
});