import { env } from "@chomuon/env/web";

/**
 * Returns the correct server URL based on execution context:
 * - SSR (server): uses SERVER_INTERNAL_URL runtime env (Docker internal network)
 * - Browser with VITE_SERVER_URL set: uses that explicit URL
 * - Browser without VITE_SERVER_URL (proxy mode): uses window.location.origin
 *   so that RPCLink can always construct absolute URLs (new URL("/rpc", origin))
 */
export function getServerUrl(): string {
  if (typeof window === "undefined") {
    return process.env.SERVER_INTERNAL_URL || "http://localhost:3000";
  }
  return env.VITE_SERVER_URL || window.location.origin;
}
