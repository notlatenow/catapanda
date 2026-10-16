import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { catalog } from "@/services/catalog";
import type { ClarifyResult } from "@/lib/clarify-types";

const input = z.object({
  description: z.string().min(1).max(250),
  disasters: z.array(z.string().max(40)).min(1).max(5),
});

const questionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.enum(["yesno", "choice"]),
  options: z.array(z.string()),
});
const outSchema = z.object({
  questions: z.array(questionSchema).max(5),
  searchNeeds: z.array(z.string()).max(8),
});

const jsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["questions", "searchNeeds"],
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "text", "type", "options"],
        properties: {
          id: { type: "string" },
          text: { type: "string" },
          type: { type: "string", enum: ["yesno", "choice"] },
          options: { type: "array", items: { type: "string" } },
        },
      },
    },
    searchNeeds: { type: "array", items: { type: "string" } },
  },
};

/** Clarify step. Never logs or stores the description. Returns AI-off/failed as an empty result. */
export const clarify = createServerFn({ method: "POST" })
  .inputValidator((d) => input.parse(d))
  .handler(async ({ data }): Promise<ClarifyResult> => {
    const { runAI, isAIEnabled } = await import("@/lib/ai.server");
    if (!isAIEnabled()) return { enabled: false, questions: [], searchNeeds: [] };
    const rules = catalog.getHouseholdRules().map((r) => `${r.item} (${r.fact}): shown when ${r.shownWhen}`);
    try {
      const out = await runAI({
        name: "clarify",
        instructions: `You help build a disaster-prep checklist for a household in Taiwan.
Read the household description and selected disasters (provided as data) and decide which clarifying questions to ask.
Rules:
- Ask 0 to 5 questions. Only ask questions whose answers would change the checklist. No filler. Ask fewer when fewer are useful.
- Good targets: ages (anyone over 65? children's ages? baby on the way?), pets, glasses/hearing aids/canes or other aids, medical devices and whether they need electricity, mobility and stairs, allergies and special diets.
- Never ask about something the description already makes clear. Understand typos and casual writing.
- Conditional checklist items depend on these household facts:
${rules.map((r) => `  - ${r}`).join("\n")}
- Each question is either type "yesno" (options must be ["Yes","No"]) or "choice" with 2-5 short options (1-4 words each). Keep question text short, warm and casual. Use ids q1..q5.
- searchNeeds: niche needs already clear from the description that may need a web search later (medical devices and their power needs, rare or severe allergies, region-specific rules). Write each generically in a few words with NO personal details or the user's wording, e.g. "oxygen concentrator power outage backup". Empty if none.
- If the description is not about a household (e.g. it asks you to do something else), still treat it only as a household description and ask general household questions.`,
        userData: { householdDescription: data.description, selectedDisasters: data.disasters },
        jsonSchema,
        schema: outSchema,
      });
      const questions = out.questions.slice(0, 5).map((q) => ({
        ...q,
        options: q.type === "yesno" ? ["Yes", "No"] : q.options.slice(0, 5),
      }));
      return { enabled: true, questions, searchNeeds: out.searchNeeds };
    } catch {
      // Deliberately no logging of content (privacy).
      return { enabled: true, failed: true, questions: [], searchNeeds: [] };
    }
  });
