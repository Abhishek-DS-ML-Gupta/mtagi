import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { generateCosmosMedia } from "@/lib/nvidia-cosmos";

export const nvidiaCosmosTool = createTool({
  id: "nvidiaCosmos",
  description:
    "Generate Physical AI images, videos, robotics action simulations, and world foundation models using NVIDIA Cosmos3 Nano (16B). Use this tool whenever the user asks for NVIDIA Cosmos, robotics video simulation, physical AI generation, autonomous vehicle trajectories, text-to-video, or image-to-video world generation.",
  inputSchema: z.object({
    prompt: z
      .string()
      .describe(
        "Text prompt describing the Physical AI scene, robot action, autonomous vehicle, or visual simulation.",
      ),
    model_mode: z
      .enum([
        "text2video",
        "text2image",
        "image2video",
        "video2video",
        "forward_dynamics",
        "policy",
        "inverse_dynamics",
      ])
      .optional()
      .describe(
        "Generation mode: text2video (default for video simulation), text2image (for single visual), image2video, etc.",
      ),
    resolution: z
      .string()
      .optional()
      .describe(
        "Resolution tier: 480_16_9 (832x480), 720_16_9 (1280x720), 720_1_1 (720x720), or 256.",
      ),
    num_frames: z
      .number()
      .optional()
      .describe("Number of frames to generate (e.g. 25, 121, 189)."),
    num_inference_steps: z
      .number()
      .optional()
      .describe("Denoising inference steps (e.g. 35, 50)."),
    fps: z.number().optional().describe("Frames per second (e.g. 24)."),
    seed: z.number().optional().describe("Random seed for deterministic output (e.g. 42)."),
    input_reference: z
      .string()
      .optional()
      .describe("Base64 data URI or public media URL for image2video/video2video conditioning."),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    mode: z.string(),
    prompt: z.string(),
    mediaUrl: z.string().optional(),
    format: z.string().optional(),
    isSimulationBlueprint: z.boolean().optional(),
    accessNotice: z.string().optional(),
    message: z.string(),
    specifications: z.object({
      model: z.string(),
      architecture: z.string(),
      resolution: z.string(),
      frames: z.number(),
      fps: z.number(),
      watermarking: z.string(),
    }),
  }),
  execute: async (inputData: any) => {
    const raw = inputData?.context || inputData || {};
    const prompt = raw.prompt || "A robotic arm interacting with physical objects in an industrial environment";
    const mode = raw.model_mode || (prompt.toLowerCase().includes("image") ? "text2image" : "text2video");
    const resolution = raw.resolution || (mode === "text2image" ? "720_1_1" : "480_16_9");
    const num_frames = raw.num_frames || (mode === "text2image" ? 1 : 25);
    const fps = raw.fps || 24;

    const result = await generateCosmosMedia({
      prompt,
      model_mode: mode,
      resolution,
      num_frames,
      num_inference_steps: raw.num_inference_steps,
      fps,
      seed: raw.seed,
      input_reference: raw.input_reference,
    });

    const specifications = {
      model: "NVIDIA Cosmos3-Nano (16B Parameters)",
      architecture: "Mixture-of-Transformers (Physical AI World Foundation Model)",
      resolution,
      frames: num_frames,
      fps,
      watermarking: "SynthID Visual Watermarking enabled",
    };

    return {
      success: true,
      mode: result.mode,
      prompt: result.prompt,
      mediaUrl: result.mediaUrl,
      format: result.format,
      isSimulationBlueprint: result.isSimulationBlueprint,
      accessNotice: result.accessNotice,
      message: result.isSimulationBlueprint
        ? "Physical AI simulation blueprint and visual specifications generated successfully."
        : `Successfully generated ${result.format === "mp4" ? "video" : "image"} via NVIDIA Cosmos3 Nano.`,
      specifications,
    };
  },
});
