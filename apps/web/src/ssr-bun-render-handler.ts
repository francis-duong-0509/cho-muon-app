import {
  createStartHandler,
  defaultRenderHandler,
} from "@tanstack/react-start/server";
import { join } from "path";

const startFetch = createStartHandler(defaultRenderHandler);

// Static assets directory: dist/client/ (Vite builds client assets here)
// import.meta.dir is Bun-specific — undefined during Vite dev mode
const clientDir = import.meta.dir ? join(import.meta.dir, "../client") : "";

// Internal API server URL (Docker network or localhost)
const API_TARGET =
  process.env.SERVER_INTERNAL_URL || "http://localhost:3000";

// Bun 1.3.9 uses a C++-level instanceof check on Response — it rejects Response
// subclasses (NodeResponse2 from h3/vinxi bundled inside dist/server).
// Also handles static file serving for dist/client/ assets before SSR fallback.
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    // Proxy API, RPC & API docs requests to internal server
    if (
      url.pathname.startsWith("/api/") ||
      url.pathname.startsWith("/rpc") ||
      url.pathname.startsWith("/api-docs")
    ) {
      try {
        const target = new URL(url.pathname + url.search, API_TARGET);
        return await fetch(target.toString(), {
          method: request.method,
          headers: request.headers,
          body: request.body,
          redirect: "manual",
        });
      } catch (err) {
        console.error("[proxy] Failed to reach API server:", err);
        return new Response("API server unavailable", { status: 502 });
      }
    }

    // Serve static files (JS/CSS/images/fonts) directly from dist/client/
    if (url.pathname !== "/" && !url.pathname.startsWith("/_server")) {
      const filePath = join(clientDir, url.pathname);
      const staticFile = Bun.file(filePath);
      if (await staticFile.exists()) {
        return new Response(staticFile);
      }
    }

    // SSR for all page routes
    const res = await startFetch(request);
    if (res.constructor === Response) return res;
    return new Response(res.body, { status: res.status, headers: res.headers });
  },
};
