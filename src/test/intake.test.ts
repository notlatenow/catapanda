import { afterEach, describe, expect, it } from "vitest";
import { isIntakeReady, isHouseholdReady, session } from "@/state/session";

const valid = { disasters: ["Earthquake"], region: "Taiwan", description: "Two adults at home" };

afterEach(() => session.reset());

describe("Required homepage inputs", () => {
  it("requires a selected region", () => {
    expect(isIntakeReady({ ...valid, region: "" })).toBe(false);
    expect(isIntakeReady(valid)).toBe(true);
  });
  it("disables Next when the region is cleared while keeping other input", () => {
    session.toggleDisaster("Earthquake");
    session.setDescription(valid.description);
    session.setRegion("Taiwan");
    expect(isIntakeReady(session.get())).toBe(true);
    session.setRegion("");
    expect(isIntakeReady(session.get())).toBe(false);
    expect(session.get()).toMatchObject({ region: "", disasters: ["Earthquake"], description: valid.description });
  });
  it("requires at least one disaster", () => {
    expect(isIntakeReady({ ...valid, disasters: [] })).toBe(false);
    expect(isIntakeReady(valid)).toBe(true);
  });
  it("unlocks Let's go with region and disaster before household text", () => {
    expect(isIntakeReady({ disasters: ["Earthquake"], region: "Taiwan" })).toBe(true);
    expect(isHouseholdReady("")).toBe(false);
  });
  it("requires at least 10 trimmed characters on the household step", () => {
    expect(isHouseholdReady(" 123456789 ")).toBe(false);
    expect(isHouseholdReady("1234567890")).toBe(true);
  });
  it("allows no more than 250 characters", () => {
    expect(isHouseholdReady("a".repeat(250))).toBe(true);
    expect(isHouseholdReady("a".repeat(251))).toBe(false);
  });
  it("clears region, disasters and household text on Start over", () => {
    session.setRegion("Taiwan");
    session.toggleDisaster("Earthquake");
    session.setDescription(valid.description);
    expect(isIntakeReady(session.get())).toBe(true);
    session.reset();
    expect(session.get()).toMatchObject({ region: "", disasters: [], description: "" });
    expect(isIntakeReady(session.get())).toBe(false);
  });
});