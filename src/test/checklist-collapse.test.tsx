import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

const state = vi.hoisted(() => ({ list: "personalized" }));
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: object) => ({ options, useSearch: () => ({ list: state.list }) }),
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));
vi.mock("@/state/session", () => ({ useSession: () => ({ disasters: ["Earthquake"], facts: {} }) }));
vi.mock("@/state/personalize", () => ({ usePersonalization: () => ({ status: "fallback" }), FALLBACK_MESSAGE: "" }));
vi.mock("@/components/brand/AppLayout", () => ({ Page: ({ children }: { children: React.ReactNode }) => <main>{children}</main>, FlowNav: () => null, PlaceholderNote: () => null }));
vi.mock("@/components/brand/ItemPanel", () => ({ ItemPanel: () => null }));
vi.mock("@/components/ListsLoading", () => ({ ListsLoading: () => null }));
vi.mock("@/lib/checklists", () => {
  const list = (id: string, titles: string[]) => ({ id, sections: titles.map(title => ({ title, rows: [{ name: `${title} item`, theme: "checklist", shortNote: "" }] })) });
  return { buildDisasterAdvice: () => list("advice", ["Disaster Dos & Dont's"]).sections[0], buildAll: () => ({ top10: list("top10", ["Top Tips"]), personalized: list("personalized", ["Custom", "Combo", "Core"]), perDisaster: [] }) };
});
vi.mock("@/lib/checklist-design", () => {
  const list = (id: string, titles: string[]) => ({ id, title: id, sections: titles.map(title => ({ title, rows: [{ name: `${title} item`, theme: "checklist", priority: "essential", shortNote: "" }] })) });
  return { designPersonalPicks: () => list("personalized", ["Food & Water", "Health & Wellness"]), buildDisasterBasics: () => list("basics", ["Priority items", "Nice-to-Have"]) };
});
import { Route } from "@/routes/checklist";
afterEach(cleanup);

it.each(["top10", "basics"])("opens %s with every section collapsed", list => {
  state.list = list;
  const Component = Route.options.component;
  if (!Component) throw new Error("Checklist component missing");
  render(<Component />);
  const sections = screen.getAllByRole("button", { expanded: false });
  expect(sections.length).toBe(2);
  expect(screen.queryAllByRole("list")).toHaveLength(0);
  const firstSection = sections[0];
  if (!firstSection) throw new Error("No collapsed section found");
  fireEvent.click(firstSection);
  expect(screen.getAllByRole("list")).toHaveLength(1);
});

it("resets expanded sections when switching away and back", () => {
  state.list = "personalized";
  const Component = Route.options.component;
  if (!Component) throw new Error("Checklist component missing");
  const view = render(<Component />);
  fireEvent.click(screen.getByRole("button", { name: "Health" }));
  expect(screen.getByRole("button", { name: "Health", pressed: true })).toBeTruthy();
  state.list = "basics";
  view.rerender(<Component />);
  state.list = "personalized";
  view.rerender(<Component />);
  expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(6);
  expect(screen.queryAllByRole("list")).toHaveLength(0);
});

it("keeps the personal list empty until a category is selected and empties it on deselection", () => {
  state.list = "personalized";
  const Component = Route.options.component;
  if (!Component) throw new Error("Checklist component missing");
  render(<Component />);
  expect(screen.queryAllByRole("list")).toHaveLength(0);
  fireEvent.click(screen.getByRole("button", { name: "Food" }));
  expect(screen.getByRole("button", { name: "Food & Water item" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Food" }));
  expect(screen.queryAllByRole("list")).toHaveLength(0);
});

it("shows only one personal category at a time", () => {
  state.list = "personalized";
  const Component = Route.options.component;
  if (!Component) throw new Error("Checklist component missing");
  render(<Component />);
  fireEvent.click(screen.getByRole("button", { name: "Food" }));
  fireEvent.click(screen.getByRole("button", { name: "Health" }));
  expect(screen.queryByRole("button", { name: "Food & Water item" })).toBeNull();
  expect(screen.getByRole("button", { name: "Health & Wellness item" })).toBeTruthy();
  expect(screen.getAllByRole("button", { pressed: true })).toHaveLength(1);
});