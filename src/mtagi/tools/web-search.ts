import { createTool } from "@mastra/core/tools";
import Exa from "exa-js";
import { z } from "zod";

export const webSearchTool = createTool({
  id: "web-search",
  description:
    "Search the web for real-time and up-to-date information. Use this whenever the user asks about current events, recent news, today's headlines, weather, or recent facts.",
  inputSchema: z.object({
    query: z.string().min(1).describe("The search query"),
  }),
  outputSchema: z.array(
    z.object({
      title: z.string().nullable(),
      url: z.string(),
      content: z.string(),
    }),
  ),
  execute: async (inputData: any) => {
    const query = inputData?.query || inputData?.context?.query || "";
    if (!query) {
      return [];
    }

    const apiKey = process.env.EXA_API_KEY || "907b0324-2aaf-44e2-8ec0-f6db12cdd7bb";
    const exa = new Exa(apiKey);

    try {
      const { results } = await exa.searchAndContents(query, {
        type: "auto",
        numResults: 4,
        text: true,
      });

      return (results || []).map((result) => ({
        title: result.title ?? "",
        content: (result.text ?? "").slice(0, 1500),
        url: result.url ?? "",
      }));
    } catch (error) {
      console.error("Exa web search error:", error);
      return [];
    }
  },
});
