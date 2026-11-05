import { createFileRoute } from "@tanstack/react-router";
import { buildCanvaAuthUrl } from "@/lib/canva-service";

export const Route = createFileRoute("/api/canva/auth")({
  server: {
    handlers: {
      GET: async () => {
        const authUrl = buildCanvaAuthUrl();
        return new Response(null, {
          status: 302,
          headers: {
            Location: authUrl,
          },
        });
      },
    },
  },
});

