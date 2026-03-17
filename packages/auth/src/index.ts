import { db } from "@chomuon/db";
import * as schema from "@chomuon/db/schema/auth";
import { env } from "@chomuon/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
    }),
  ],
});
