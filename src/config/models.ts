import type { ModelSelectorLogoProps } from "@/components/ai-elements/model-selector";

type ProviderSlug = ModelSelectorLogoProps["provider"];

export const MODEL_GROUPS = ["Groq"] as const;

export type ModelOption = {
  chef: (typeof MODEL_GROUPS)[number];
  chefSlug: ProviderSlug;
  id: string;
  name: string;
};

export const MODELS = [
  {
    chef: "Groq",
    chefSlug: "groq",
    id: "groq/qwen/qwen3.8-27b",
    name: "Qwen 3.8 27B",
  },
  {
    chef: "Groq",
    chefSlug: "groq",
    id: "groq/openai/gpt-oss-120b",
    name: "GPT-OSS 120B",
  },
  {
    chef: "Groq",
    chefSlug: "groq",
    id: "groq/openai/gpt-oss-20b",
    name: "GPT-OSS 20B",
  },
] as const satisfies ReadonlyArray<ModelOption>;

export type ModelId = (typeof MODELS)[number]["id"];

export const DEFAULT_MODEL_ID: ModelId = "groq/qwen/qwen3.8-27b";
