import { env } from "@chomuon/env/web";

/**
 * Returns the correct server URL based on execution context:
 * - Browser: uses VITE_SERVER_URL (empty string = relative URL for proxy)
 * - SSR: uses SERVER_INTERNAL_URL runtime env (Docker internal network)
 */
export function getServerUrl(): string {
  if (typeof window === "undefined") {
    return process.env.SERVER_INTERNAL_URL || "http://localhost:3000";
  }
  return env.VITE_SERVER_URL;
}
