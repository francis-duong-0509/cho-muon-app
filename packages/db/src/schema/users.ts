import {
  pgTable,
  pgEnum,
  text,
  smallint,
  integer,
  numeric,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

// --- Enums ---
export const userStatusEnum = pgEnum("user_status", [
  "UNVERIFIED",
  "VERIFIED",
  "WARNED",
  "SUSPENDED",
  "BANNED",
]);

export const trustLevelEnum = pgEnum("trust_level", [
  "NEW",
  "TRUSTED",
  "REPUTABLE",
  "RELIABLE",
  "SUPER",
]);

// --- Table ---
export const userProfile = pgTable(
  "user_profile",
  {
    // PK + FK → Better Auth user table
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),

    // Identity
    phone: text("phone").notNull().unique(),
    displayName: text("display_name").notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),

    // Account status
    status: userStatusEnum("status").default("UNVERIFIED").notNull(),
    suspendedUntil: timestamp("suspended_until", { withTimezone: true }),

    // Trust system
    trustScore: smallint("trust_score").default(0).notNull(),
    trustLevel: trustLevelEnum("trust_level").default("NEW").notNull(),

    // Transaction stats (denormalized for fast read)
    totalCompletedAsOwner: integer("total_completed_as_owner").default(0).notNull(),
    totalCompletedAsRenter: integer("total_completed_as_renter").default(0).notNull(),
    avgRatingAsOwner: numeric("avg_rating_as_owner", { precision: 3, scale: 2 }),
    avgRatingAsRenter: numeric("avg_rating_as_renter", { precision: 3, scale: 2 }),
    cancelRate: numeric("cancel_rate", { precision: 5, scale: 2 }).default("0").notNull(),

    // Violation tracking
    disputeLostCount: smallint("dispute_lost_count").default(0).notNull(),
    warningCount: smallint("warning_count").default(0).notNull(),

    // Notifications
    fcmToken: text("fcm_token"),

    // Timestamps
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_user_profile_status").on(table.status),
    index("idx_user_profile_trust_level").on(table.trustLevel),
    index("idx_user_profile_phone").on(table.phone),
  ],
);

// --- Relations ---
export const userProfileRelations = relations(userProfile, ({ one }) => ({
  authUser: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
  }),
}));

