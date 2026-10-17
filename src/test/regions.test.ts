import { describe, expect, it } from "vitest";
import { catalog } from "@/services/catalog";

describe("Country choices", () => {
  it("offers Taiwan as the only country", () => {
    expect(catalog.getRegions()).toEqual(["Taiwan"]);
  });
});