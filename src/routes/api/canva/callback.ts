import { createFileRoute } from "@tanstack/react-router";
import { exchangeCodeForToken } from "@/lib/canva-service";

export const Route = createFileRoute("/api/canva/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");
        const errorDesc = url.searchParams.get("error_description");

        if (error) {
          return new Response(
            `<html><body><h2>Canva Authorization Failed</h2><p>${error}: ${errorDesc || ""}</p><a href="/">Return to Home</a></body></html>`,
            {
              status: 400,
              headers: { "Content-Type": "text/html" },
            },
          );
        }

        if (!code) {
          return new Response("Missing authorization code", { status: 400 });
        }

        try {
          await exchangeCodeForToken(code);
          return new Response(null, {
            status: 302,
            headers: {
              Location: "/?canva_connected=true",
            },
          });
        } catch (err: any) {
          return new Response(
            `<html><body><h2>Canva Token Exchange Error</h2><pre>${err?.message || err}</pre><br/><a href="/">Return to Home</a></body></html>`,
            {
              status: 500,
              headers: { "Content-Type": "text/html" },
            },
          );
        }
      },
    },
  },
});

