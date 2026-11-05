import { createFileRoute } from "@tanstack/react-router";
import { generatePptxBuffer } from "@/lib/pptx-builder";

export const Route = createFileRoute("/api/download/pptx")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const title = url.searchParams.get("title") || url.searchParams.get("topic") || "Quarterly Business Review";
          const subtitle = url.searchParams.get("subtitle") || undefined;

          const buffer = await generatePptxBuffer({
            title,
            topic: title,
            subtitle,
          });

          const safeFilename = title.replace(/[^a-zA-Z0-9_-]/g, "_") + ".pptx";
          const uint8 = new Uint8Array(buffer);

          return new Response(uint8, {
            status: 200,
            headers: {
              "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              "Content-Disposition": `attachment; filename="${safeFilename}"`,
              "Content-Length": uint8.byteLength.toString(),
              "Cache-Control": "no-cache",
            },
          });
        } catch (error: any) {
          console.error("PPTX Download error:", error);
          return new Response(JSON.stringify({ error: error?.message || String(error), stack: error?.stack }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
