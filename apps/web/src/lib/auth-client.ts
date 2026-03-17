import { getServerUrl } from "@/lib/server-url";
import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@chomuon/auth";

export const authClient = createAuthClient({
  baseURL: getServerUrl(),
  plugins: [
    adminClient(),
    inferAdditionalFields<typeof auth>()
  ],
});
