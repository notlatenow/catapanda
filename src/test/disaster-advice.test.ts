import { expect, it } from "vitest";
import { buildAll, buildDisasterAdvice } from "@/lib/checklists";
import { catalog } from "@/services/catalog";

it.each(["Earthquake", "Flood", "Typhoon"])("shows three catalog tips for %s with its disaster icon", disaster => {
  const advice = buildDisasterAdvice([disaster]);
  expect(advice.rows).toHaveLength(3);
  expect(advice.rows.map(row => row.disaster)).toEqual([disaster, disaster, disaster]);
  expect(advice.rows.map(row => row.name)).toEqual(catalog.getDisaster(disaster)?.tips.slice(0, 3).map(tip => tip.text));
});

it("shows three tips per selected disaster without changing the ten ranked items", () => {
  const disasters = ["Earthquake", "Flood", "Typhoon"];
  expect(buildDisasterAdvice(disasters).rows).toHaveLength(9);
  expect(buildAll(disasters, []).top10.sections.flatMap(section => section.rows)).toHaveLength(10);
});