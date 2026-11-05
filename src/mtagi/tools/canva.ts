import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { isCanvaConnected, createCanvaDesign } from "@/lib/canva-service";

const CANVA_DESIGN_PRESETS: Record<
  string,
  {
    slug: string;
    width: number;
    height: number;
    label: string;
    suggestedFonts: string;
    defaultPalette: { name: string; hex: string }[];
  }
> = {
  presentation: {
    slug: "presentations",
    width: 1920,
    height: 1080,
    label: "Presentation (16:9)",
    suggestedFonts: "Montserrat (Headings) + Inter (Body)",
    defaultPalette: [
      { name: "Primary Dark", hex: "#0F172A" },
      { name: "Accent Blue", hex: "#3B82F6" },
      { name: "Vibrant Cyan", hex: "#06B6D4" },
      { name: "Neutral Light", hex: "#F8FAFC" },
    ],
  },
  instagram_post: {
    slug: "instagram-posts",
    width: 1080,
    height: 1080,
    label: "Instagram Post (Square)",
    suggestedFonts: "Playfair Display (Headline) + Plus Jakarta Sans (Body)",
    defaultPalette: [
      { name: "Earthy Brown", hex: "#3D2314" },
      { name: "Warm Latte", hex: "#C89D7C" },
      { name: "Creamy Foam", hex: "#F5EBE0" },
      { name: "Rich Espresso", hex: "#1E0F08" },
    ],
  },
  instagram_story: {
    slug: "instagram-stories",
    width: 1080,
    height: 1920,
    label: "Instagram Story",
    suggestedFonts: "Syne (Title) + DM Sans (Body)",
    defaultPalette: [
      { name: "Deep Violet", hex: "#1E1B4B" },
      { name: "Electric Purple", hex: "#8B5CF6" },
      { name: "Soft Glow", hex: "#EDE9FE" },
    ],
  },
  youtube_thumbnail: {
    slug: "youtube-thumbnails",
    width: 1280,
    height: 720,
    label: "YouTube Thumbnail",
    suggestedFonts: "Anton (Impact Header) + Montserrat ExtraBold",
    defaultPalette: [
      { name: "Punchy Yellow", hex: "#FACC15" },
      { name: "High Contrast Red", hex: "#EF4444" },
      { name: "Pure Black", hex: "#000000" },
      { name: "Pure White", hex: "#FFFFFF" },
    ],
  },
  poster: {
    slug: "posters",
    width: 1587,
    height: 2245,
    label: "Poster",
    suggestedFonts: "Bebas Neue + Roboto",
    defaultPalette: [
      { name: "Charcoal", hex: "#18181B" },
      { name: "Neon Orange", hex: "#F97316" },
      { name: "Off White", hex: "#FAFAFA" },
    ],
  },
  flyer: {
    slug: "flyers",
    width: 2480,
    height: 3508,
    label: "Flyer (A4)",
    suggestedFonts: "Poppins (Bold) + Open Sans",
    defaultPalette: [
      { name: "Navy Blue", hex: "#1E3A8A" },
      { name: "Bright Gold", hex: "#EAB308" },
      { name: "Clean White", hex: "#FFFFFF" },
    ],
  },
  logo: {
    slug: "logos",
    width: 500,
    height: 500,
    label: "Logo",
    suggestedFonts: "Cinzel / Space Grotesk",
    defaultPalette: [
      { name: "Monochrome Black", hex: "#111827" },
      { name: "Gold Foil", hex: "#D4AF37" },
      { name: "Minimalist Gray", hex: "#9CA3AF" },
    ],
  },
};

export const canvaTool = createTool({
  id: "canva",
  description:
    "Generate Canva design blueprints, downloadable presentation templates (.pptx), design specifications, and direct links. Use this whenever the user asks to create, download, or design presentations, posters, social media posts, thumbnails, flyers, banners, or logos on Canva.",
  inputSchema: z.object({
    designType: z
      .string()
      .optional()
      .describe("Type of design: presentation, instagram_post, instagram_story, youtube_thumbnail, poster, flyer, logo."),
    title: z.string().optional().describe("Title or topic of the design project."),
    query: z.string().optional().describe("Search keywords or specific style for templates."),
    width: z.number().optional().describe("Custom width in pixels."),
    height: z.number().optional().describe("Custom height in pixels."),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    designType: z.string(),
    title: z.string(),
    dimensions: z.string(),
    suggestedFonts: z.string(),
    colorPalette: z.array(z.object({ name: z.string(), hex: z.string() })),
    downloadUrl: z.string().describe("Direct URL to download the generated presentation (.pptx) file"),
    canvaCreateUrl: z.string().describe("Direct URL to open and edit in Canva"),
    canvaTemplateUrl: z.string().describe("URL to browse matching templates on Canva"),
    canvaConnectUrl: z.string().describe("1-Click OAuth Connect link to link user's Canva account"),
    apiDesignEditUrl: z.string().optional().describe("Live design edit link if Canva account is connected"),
  }),
  execute: async (inputData: any) => {
    const raw = inputData?.context || inputData || {};
    const typeKey = (raw.designType || "presentation").toLowerCase().replace(/[\s-]/g, "_");
    const preset = CANVA_DESIGN_PRESETS[typeKey] || {
      slug: "presentations",
      width: raw.width || 1920,
      height: raw.height || 1080,
      label: raw.designType || "Presentation (16:9)",
      suggestedFonts: "Montserrat + Inter",
      defaultPalette: [
        { name: "Primary Dark", hex: "#0F172A" },
        { name: "Accent Blue", hex: "#3B82F6" },
        { name: "Vibrant Cyan", hex: "#06B6D4" },
        { name: "Neutral Light", hex: "#F8FAFC" },
      ],
    };

    const title = raw.title || raw.query || "Quarterly Business Review";
    const encodedTitle = encodeURIComponent(title);
    const encodedQuery = encodeURIComponent(raw.query || title);

    const downloadUrl = `http://localhost:3000/api/download/pptx?title=${encodedTitle}`;
    const canvaCreateUrl = `https://www.canva.com/create/${preset.slug}/?query=${encodedQuery}`;
    const canvaTemplateUrl = `https://www.canva.com/templates/?query=${encodedQuery}`;
    const canvaConnectUrl = `http://localhost:3000/api/canva/auth`;

    let apiDesignEditUrl: string | undefined;

    // If the user has authenticated their Canva account, create the design directly on Canva REST API
    if (isCanvaConnected()) {
      try {
        const canvaDesign = await createCanvaDesign(title, preset.slug === "presentations" ? "presentation" : "presentation");
        apiDesignEditUrl = canvaDesign?.design?.urls?.edit_url;
      } catch (e) {
        console.warn("Canva API design creation note:", e);
      }
    }

    const width = raw.width || preset.width;
    const height = raw.height || preset.height;

    return {
      success: true,
      designType: preset.label,
      title,
      dimensions: `${width} x ${height} px`,
      suggestedFonts: preset.suggestedFonts,
      colorPalette: preset.defaultPalette,
      downloadUrl,
      canvaCreateUrl,
      canvaTemplateUrl,
      canvaConnectUrl,
      apiDesignEditUrl,
    };
  },
});
