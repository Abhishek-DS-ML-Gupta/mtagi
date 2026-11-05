if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env");
  } catch {
    // ignore
  }
}

// Intercept outgoing fetch requests to Groq to strip unsupported properties such as 'reasoning_content'
const originalFetch = globalThis.fetch;
if (originalFetch) {
  globalThis.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input?.url;
    if (url && url.includes("api.groq.com") && init?.body && typeof init.body === "string") {
      try {
        const parsed = JSON.parse(init.body);
        if (Array.isArray(parsed.messages)) {
          let modified = false;
          for (const msg of parsed.messages) {
            if (msg && typeof msg === "object" && "reasoning_content" in msg) {
              delete msg.reasoning_content;
              modified = true;
            }
          }
          if (modified) {
            init = { ...init, body: JSON.stringify(parsed) };
          }
        }
      } catch {
        // ignore
      }
    }

    let response = await originalFetch.call(this, input, init);

    // Auto-retry once on Groq 429 rate limit using retry-after header
    if (response.status === 429 && url && url.includes("api.groq.com")) {
      const retryAfterHeader = response.headers.get("retry-after");
      const waitSeconds = Math.min(Math.max(parseInt(retryAfterHeader || "5", 10) || 5, 2), 22);
      console.warn(`[Groq TPM rate limit] Auto-retrying after ${waitSeconds}s...`);
      await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
      response = await originalFetch.call(this, input, init);
    }

    return response;
  };
}

import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import {
  DefaultExporter,
  Observability,
  SensitiveDataFilter,
} from "@mastra/observability";
import { assistant } from "./agents/assistant";
import { titler } from "./agents/titler";

export const mtagi = new Mastra({
  agents: { assistant, titler },
  storage: new LibSQLStore({
    id: "mtagi-storage",
    url: "file:./mtagi.db",
  }),
  logger: new PinoLogger({
    name: "Mtagi",
    level: "info",
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: "mtagi",
        exporters: [new DefaultExporter()],
        spanOutputProcessors: [new SensitiveDataFilter()],
      },
    },
  }),
});

export const mastra = mtagi;
