import {
  pgTable,
  pgEnum,
  text,
  numeric,
  timestamp,
  date,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { userProfile } from "./users";

// --- Enum ---
export const kycStatusEnum = pgEnum("kyc_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "RESUBMIT", // Admin asks user to re-upload
]);

// --- Table ---
// Separated from users: contains sensitive PII — different access control
export const userKyc = pgTable(
  "user_kyc",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: text("user_id")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "cascade" }),

    // Hashed — never store plaintext ID number
    cccdNumberHash: text("cccd_number_hash").notNull(),

    // Identity info from CCCD
    fullName: text("full_name").notNull(),
    dateOfBirth: date("date_of_birth").notNull(),
    gender: text("gender"),
    address: text("address"), // Encrypted at app layer before storing

    // Private storage bucket URLs (not public CDN)
    cccdFrontUrl: text("cccd_front_url").notNull(),
    cccdBackUrl: text("cccd_back_url").notNull(),
    selfieUrl: text("selfie_url").notNull(),

    // KYC process
    kycStatus: kycStatusEnum("kyc_status").default("PENDING").notNull(),
    rejectionReason: text("rejection_reason"),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),

    // eKYC provider integration (FPT.AI, etc.)
    kycProvider: text("kyc_provider"),       // e.g. "fpt_ai"
    kycProviderRef: text("kyc_provider_ref"), // Provider's reference ID
    kycScore: numeric("kyc_score", { precision: 5, scale: 2 }), // Confidence score

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // 1 user → 1 KYC record
    uniqueIndex("idx_kyc_user_id").on(table.userId),
    // Prevent same CCCD from being approved for multiple accounts
    // Partial unique: only applies to APPROVED records
    uniqueIndex("idx_kyc_cccd_hash")
      .on(table.cccdNumberHash)
      .where(sql`${table.kycStatus} = 'APPROVED'`),
    index("idx_kyc_status").on(table.kycStatus),
  ],
);

// --- Relations ---
export const userKycRelations = relations(userKyc, ({ one }) => ({
  user: one(userProfile, {
    fields: [userKyc.userId],
    references: [userProfile.userId],
  }),
}));
