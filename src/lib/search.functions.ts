import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const searchNicheNeed = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ query: z.string().max(100) }).parse(data))
  .handler(async ({ data }) => {
    const { runSearch } = await import("@/lib/search.server");
    return runSearch(data.query);
  });