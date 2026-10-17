import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { clarifyKey, session } from "@/state/session";

const { navigate, run } = vi.hoisted(() => ({ navigate: vi.fn(), run: vi.fn() }));
vi.mock("@tanstack/react-router", () => ({ createFileRoute: () => (options: unknown) => options, useNavigate: () => navigate }));
vi.mock("@tanstack/react-start", () => ({ useServerFn: () => run }));
vi.mock("@/lib/clarify.functions", () => ({ clarify: vi.fn() }));
vi.mock("@/state/search", () => ({ startBackgroundSearch: vi.fn() }));
import { Questions } from "@/routes/questions";

beforeEach(() => {
  vi.clearAllMocks();
  session.reset();
  session.toggleDisaster("Earthquake");
  session.setRegion("Taiwan");
  session.setDescription("Two adults and a cat");
});
afterEach(() => { cleanup(); session.reset(); });

function seed() {
  session.setClarify({ key: clarifyKey(session.get()), searchNeeds: [], questions: [
    { id: "q1", text: "Any mobility aids?", type: "yesno", options: ["Yes", "No"] },
    { id: "q2", text: "Which device?", type: "text", options: [] },
  ] });
}

describe("Sequential household form", () => {
  it("begins at household, then advances directly to the first question", () => {
    seed(); render(<Questions />);
    expect(session.get().formStep).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "OK" }));
    expect(session.get().formStep).toBe(1);
    expect(run).not.toHaveBeenCalled();
  });
  it("option selection immediately advances and Back keeps the answer", () => {
    seed(); session.setFormStep(1); render(<Questions />);
    fireEvent.click(screen.getByRole("button", { name: /Yes/ }));
    expect(session.get().formStep).toBe(2);
    expect(session.get().answers["q1"]).toMatchObject({ choice: "Yes", skipped: false });
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(session.get().formStep).toBe(1);
    expect(session.get().answers["q1"]?.choice).toBe("Yes");
  });
  it("typed answers require confirmation and finish at checklist options", () => {
    seed(); session.setFormStep(2); render(<Questions />);
    expect(screen.getByRole("button", { name: "OK" })).toBeDisabled();
    fireEvent.change(screen.getByRole("textbox", { name: "Your answer" }), { target: { value: "A walker" } });
    expect(session.get().formStep).toBe(2);
    fireEvent.click(screen.getByRole("button", { name: "OK" }));
    expect(session.get().answers["q2"]?.text).toBe("A walker");
    expect(navigate).toHaveBeenCalledWith({ to: "/options" });
  });
  it("Enter confirms a typed clarifying answer like OK", () => {
    seed(); session.setFormStep(2); render(<Questions />);
    const textbox = screen.getByRole("textbox", { name: "Your answer" });
    fireEvent.change(textbox, { target: { value: "A walker" } });
    expect(fireEvent.keyDown(textbox, { key: "Enter" })).toBe(false);
    expect(session.get().answers["q2"]?.text).toBe("A walker");
    expect(navigate).toHaveBeenCalledWith({ to: "/options" });
  });
  it("Enter cannot confirm an empty or whitespace-only answer", () => {
    seed(); session.setFormStep(2); render(<Questions />);
    const textbox = screen.getByRole("textbox", { name: "Your answer" });
    fireEvent.keyDown(textbox, { key: "Enter" });
    fireEvent.change(textbox, { target: { value: "   " } });
    fireEvent.keyDown(textbox, { key: "Enter" });
    expect(navigate).not.toHaveBeenCalled();
    expect(session.get().formStep).toBe(2);
  });
  it("Enter confirms Other text and advances to the next question", () => {
    session.setClarify({ key: clarifyKey(session.get()), searchNeeds: [], questions: [
      { id: "q1", text: "Which aid?", type: "choice", options: ["Walker", "Other"] },
      { id: "q2", text: "Which device?", type: "text", options: [] },
    ] });
    session.setFormStep(1); render(<Questions />);
    fireEvent.click(screen.getByRole("button", { name: "Other" }));
    const textbox = screen.getByRole("textbox", { name: "Your answer" });
    fireEvent.change(textbox, { target: { value: "A cane" } });
    fireEvent.keyDown(textbox, { key: "Enter" });
    expect(session.get().answers["q1"]).toMatchObject({ choice: "Other", text: "A cane" });
    expect(session.get().formStep).toBe(2);
  });
  it("Enter used to finish IME composition does not submit", () => {
    seed(); session.setFormStep(2); render(<Questions />);
    const textbox = screen.getByRole("textbox", { name: "Your answer" });
    fireEvent.change(textbox, { target: { value: "助行器" } });
    fireEvent.keyDown(textbox, { key: "Enter", isComposing: true });
    fireEvent.keyDown(textbox, { key: "Enter", keyCode: 229 });
    expect(navigate).not.toHaveBeenCalled();
    fireEvent.keyDown(textbox, { key: "Enter" });
    expect(navigate).toHaveBeenCalledWith({ to: "/options" });
  });
  it("empty clarification bypasses questions after household Next", async () => {
    run.mockResolvedValue({ enabled: false, questions: [], searchNeeds: [] });
    render(<Questions />);
    fireEvent.click(screen.getByRole("button", { name: "OK" }));
    await waitFor(() => expect(navigate).toHaveBeenCalledWith({ to: "/options" }));
    expect(session.get().clarify?.questions).toEqual([]);
  });
  it("failed clarification falls back to checklist options", async () => {
    run.mockRejectedValue(new Error("Unavailable")); render(<Questions />);
    fireEvent.click(screen.getByRole("button", { name: "OK" }));
    await waitFor(() => expect(navigate).toHaveBeenCalledWith({ to: "/options" }));
  });
});
