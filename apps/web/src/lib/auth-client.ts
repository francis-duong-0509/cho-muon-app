import { getServerUrl } from "@/lib/server-url";
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: getServerUrl(),
  plugins: [adminClient()],
});
