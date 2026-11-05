import fs from "fs";
import path from "path";

export interface CosmosGenerationOptions {
  model_mode?: "text2video" | "text2image" | "image2video" | "video2video" | "forward_dynamics" | "policy" | "inverse_dynamics";
  prompt: string;
  resolution?: string;
  num_frames?: number;
  num_inference_steps?: number;
  fps?: number;
  seed?: number;
  input_reference?: string;
}

export interface CosmosGenerationResult {
  success: boolean;
  mode: string;
  prompt: string;
  mediaUrl?: string;
  filePath?: string;
  format?: "mp4" | "jpeg";
  error?: string;
  details?: any;
}

const COSMOS_DIR = path.resolve(process.cwd(), "public", "cosmos");

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export async function generateCosmosMedia(
  options: CosmosGenerationOptions,
): Promise<CosmosGenerationResult> {
  const apiKey = process.env.NVIDIA_API_KEY || "";
  if (!apiKey) {
    return {
      success: false,
      mode: options.model_mode || "text2video",
      prompt: options.prompt,
      error: "NVIDIA_API_KEY is not configured in environment variables.",
    };
  }

  const endpoint =
    process.env.NVIDIA_COSMOS_URL ||
    "https://ai.api.nvidia.com/v1/cosmos/nvidia/cosmos3-nano";

  const mode = options.model_mode || (options.prompt.toLowerCase().includes("image") ? "text2image" : "text2video");

  const payload: Record<string, any> = {
    model_mode: mode,
    prompt: options.prompt,
    resolution: options.resolution || (mode === "text2image" ? "720_1_1" : "480_16_9"),
    num_frames: options.num_frames || (mode === "text2image" ? 1 : 25),
    num_inference_steps: options.num_inference_steps || (mode === "text2image" ? 50 : 35),
  };

  if (mode !== "text2image") {
    payload.fps = options.fps || 24;
  }

  if (options.seed !== undefined) {
    payload.seed = options.seed;
  } else {
    payload.seed = 42;
  }

  if (options.input_reference) {
    payload.input_reference = options.input_reference;
  }

  ensureDirectoryExists(COSMOS_DIR);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      let parsedErr: any;
      try {
        parsedErr = JSON.parse(errText);
      } catch {
        parsedErr = errText;
      }

      console.warn("NVIDIA Cosmos API response error:", response.status, parsedErr);

      return {
        success: false,
        mode,
        prompt: options.prompt,
        error: `NVIDIA Cosmos API returned HTTP ${response.status}: ${
          typeof parsedErr === "string" ? parsedErr : JSON.stringify(parsedErr)
        }`,
        details: {
          status: response.status,
          endpoint,
          hint:
            response.status === 404
              ? "The hosted endpoint requires organization-level preview allowlisting on NVIDIA Build, or points to your local/enterprise NIM at POST /v1/infer."
              : "Check prompt parameters and safety guardrails.",
        },
      };
    }

    const data: any = await response.json();

    const timestamp = Date.now();
    const id = Math.random().toString(36).substring(2, 8);

    if (data.b64_video) {
      const filename = `cosmos_${timestamp}_${id}.mp4`;
      const filePath = path.join(COSMOS_DIR, filename);
      const videoBuffer = Buffer.from(data.b64_video, "base64");
      fs.writeFileSync(filePath, videoBuffer);

      return {
        success: true,
        mode,
        prompt: options.prompt,
        mediaUrl: `/cosmos/${filename}`,
        filePath,
        format: "mp4",
      };
    }

    if (data.b64_image) {
      const filename = `cosmos_${timestamp}_${id}.jpg`;
      const filePath = path.join(COSMOS_DIR, filename);
      const imgBuffer = Buffer.from(data.b64_image, "base64");
      fs.writeFileSync(filePath, imgBuffer);

      return {
        success: true,
        mode,
        prompt: options.prompt,
        mediaUrl: `/cosmos/${filename}`,
        filePath,
        format: "jpeg",
      };
    }

    return {
      success: true,
      mode,
      prompt: options.prompt,
      details: data,
    };
  } catch (error: any) {
    console.error("NVIDIA Cosmos generation error:", error);
    return {
      success: false,
      mode,
      prompt: options.prompt,
      error: error?.message || String(error),
    };
  }
}
