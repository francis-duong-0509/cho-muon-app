import {
  pgTable,
  text,
  smallint,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Short-lived OTP records — expires in minutes, no relations needed
// Purposely not linked to userProfile: OTP exists before user is created (REGISTER flow)
export const userOtp = pgTable(
  "user_otp",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    phoneNumber: text("phone_number").notNull(),
    otpHash: text("otp_hash").notNull(), // Never store plaintext OTP

    // Purpose drives validation rules at app layer
    purpose: text("purpose").notNull(), // "LOGIN" | "REGISTER" | "RESET"

    attemptCount: smallint("attempt_count").default(0).notNull(), // Lock after N failures
    isUsed: boolean("is_used").default(false).notNull(),

    // Set at insert: created_at + 5 minutes
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // Lookup: "is there a valid OTP for this phone?"
    // Partial: only index unused OTPs — used ones never queried
    index("idx_otp_phone_expires")
      .on(table.phoneNumber, table.expiresAt)
      .where(sql`${table.isUsed} = false`),
  ],
);
