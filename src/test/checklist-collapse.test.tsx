import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

const state = vi.hoisted(() => ({ list: "personalized" }));
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: object) => ({ ...options, useSearch: () => ({ list: state.list }) }),
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));
vi.mock("@/state/session", () => ({ useSession: () => ({ disasters: ["Earthquake"], facts: {} }) }));
vi.mock("@/state/personalize", () => ({ usePersonalization: () => ({ status: "fallback" }), FALLBACK_MESSAGE: "" }));
vi.mock("@/components/brand/AppLayout", () => ({ Page: ({ children }: { children: React.ReactNode }) => <main>{children}</main>, FlowNav: () => null, PlaceholderNote: () => null }));
vi.mock("@/components/brand/ItemPanel", () => ({ ItemPanel: () => null }));
vi.mock("@/components/ListsLoading", () => ({ ListsLoading: () => null }));
vi.mock("@/lib/checklists", () => {
  const list = (id: string, titles: string[]) => ({ id, sections: titles.map(title => ({ title, rows: [{ name: `${title} item`, theme: "checklist", shortNote: "" }] })) });
  return { buildAll: () => ({ top10: list("top10", ["Top Tips"]), personalized: list("personalized", ["Custom", "Combo", "Core"]), perDisaster: [list("Earthquake", ["Earthquake", "If it applies to you"])] }) };
});
import { Route } from "@/routes/checklist";
afterEach(cleanup);

it.each(["personalized", "top10", "Earthquake"])("opens %s with every section collapsed", list => {
  state.list = list;
  const Component = Route.options.component;
  if (!Component) throw new Error("Checklist component missing");
  render(<Component />);
  const sections = screen.getAllByRole("button", { expanded: false });
  expect(sections.length).toBe(list === "personalized" ? 3 : list === "Earthquake" ? 2 : 1);
  expect(screen.queryAllByRole("list")).toHaveLength(0);
  fireEvent.click(sections[0]);
  expect(screen.getAllByRole("list")).toHaveLength(1);
});

it("resets expanded sections when switching away and back", () => {
  state.list = "personalized";
  const Component = Route.options.component;
  if (!Component) throw new Error("Checklist component missing");
  const view = render(<Component />);
  fireEvent.click(screen.getByRole("button", { name: "Core" }));
  expect(screen.getByRole("button", { name: "Core", expanded: true })).toBeTruthy();
  state.list = "Earthquake";
  view.rerender(<Component />);
  state.list = "personalized";
  view.rerender(<Component />);
  expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(3);
  expect(screen.queryAllByRole("list")).toHaveLength(0);
});