import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    MAILTRAP_HOST: z.string().min(1),
    MAILTRAP_PORT: z.coerce.number(),
    MAILTRAP_USER: z.string().min(1),
    MAILTRAP_PASS: z.string().min(1),
    MAIL_FROM: z.string().email(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
