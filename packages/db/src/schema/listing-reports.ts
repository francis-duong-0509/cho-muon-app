import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { userProfile } from "./users";
import { listings } from "./listings";

// --- Enum ---
export const reportReasonEnum = pgEnum("report_reason", [
  "FRAUD",
  "FAKE_IMAGES",
  "PROHIBITED_ITEM",
  "WRONG_CATEGORY",
  "SPAM",
  "OTHER",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "PENDING",
  "REVIEWED",
  "DISMISSED",
]);

// --- Table ---
export const listingReports = pgTable(
  "listing_reports",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    reportedBy: text("reported_by")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "restrict" }),

    reason: reportReasonEnum("reason").notNull(),
    description: text("description"),
    status: reportStatusEnum("status").default("PENDING").notNull(),

    // Admin who reviewed
    reviewedBy: text("reviewed_by").references(() => userProfile.userId, {
      onDelete: "set null",
    }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // 1 user can only report the same listing once
    uniqueIndex("idx_reports_unique").on(table.listingId, table.reportedBy),
    index("idx_reports_status").on(table.status).where(sql`${table.status} = 'PENDING'`),
  ],
);

// --- Relations ---
export const listingReportsRelations = relations(listingReports, ({ one }) => ({
  listing: one(listings, {
    fields: [listingReports.listingId],
    references: [listings.id],
  }),
  reporter: one(userProfile, {
    fields: [listingReports.reportedBy],
    references: [userProfile.userId],
    relationName: "reports_filed",
  }),
  reviewer: one(userProfile, {
    fields: [listingReports.reviewedBy],
    references: [userProfile.userId],
    relationName: "reports_reviewed",
  }),
}));
