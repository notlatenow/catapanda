import { describe, expect, it } from "vitest";
import { buildPersonalized } from "@/lib/checklists";

const waterRow = (people: number | null) =>
  buildPersonalized(["Earthquake"], [], null, people)
    .sections.flatMap((s) => s.rows)
    .find((r) => r.name === "Drinking water");

describe("water sizing from household count", () => {
  it("sizes the water note for a known household size (3 L/person/day × 3 days)", () => {
    expect(waterRow(4)?.shortNote).toBe("For 4 people: ~36 L for 3 days");
  });

  it("uses singular wording for one person", () => {
    expect(waterRow(1)?.shortNote).toBe("For 1 person: ~9 L for 3 days");
  });

  it("keeps the generic catalog note when the count is unknown", () => {
    expect(waterRow(null)?.shortNote).toBe("3 L per person, per day");
    expect(waterRow(0)?.shortNote).toBe("3 L per person, per day");
  });
});
