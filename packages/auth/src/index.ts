import { db } from "@chomuon/db";
import * as schema from "@chomuon/db/schema/auth";
import { env } from "@chomuon/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { resetPasswordTemplate, sendEmail, verifyEmailTemplate } from "./email";
import { userProfile } from "@chomuon/db/schema/users";

const isDev = process.env.NODE_ENV === "development";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Đặt lại mật khẩu ChoMuon",
        html: resetPasswordTemplate(url),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Xác minh email ChoMuon",
        html: verifyEmailTemplate(url),
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  advanced: {
    defaultCookieAttributes: {
      sameSite: isDev ? "lax" : "none",
      secure: !isDev,
      httpOnly: true,
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
    }),
  ],

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await db.insert(userProfile).values({
            userId: user.id,
            phone: user.phone,
            displayName: user.name,
          });
        }
      }
    },
  },
});
