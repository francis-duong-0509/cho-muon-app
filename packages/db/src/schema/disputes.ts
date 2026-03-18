import {
  pgTable,
  pgEnum,
  text,
  integer,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { userProfile } from "./users";
import { bookings } from "./bookings";

// --- Enums ---
export const disputeTypeEnum = pgEnum("dispute_type", [
  "ITEM_DAMAGED",
  "ITEM_LOST",
  "ITEM_NOT_AS_DESCRIBED",
  "OWNER_NO_SHOW",
  "DEPOSIT_NOT_RETURNED",
  "OTHER",
]);

export const disputeStatusEnum = pgEnum("dispute_status", [
  "OPEN",          // Mediation phase (48h self-resolve window)
  "UNDER_REVIEW",  // Admin assigned
  "RESOLVED",
  "CLOSED",        // Closed without conclusion
]);

export const disputeResolutionEnum = pgEnum("dispute_resolution", [
  "RESOLVED_MUTUAL",  // Self-mediated
  "OWNER_WIN",
  "RENTER_WIN",
  "PARTIAL",          // Both at fault
  "INCONCLUSIVE",     // Insufficient evidence
]);

// --- Tables ---
export const disputes = pgTable(
  "disputes",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "restrict" }),
    openedBy: text("opened_by")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "restrict" }),
    respondentId: text("respondent_id")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "restrict" }),

    disputeType: disputeTypeEnum("dispute_type").notNull(),
    status: disputeStatusEnum("status").default("OPEN").notNull(),

    // Description minimum 100 chars — enforced at app layer
    description: text("description").notNull(),
    requestedResolution: text("requested_resolution").notNull(),

    // Respondent reply
    respondentResponse: text("respondent_response"),
    respondentRespondedAt: timestamp("respondent_responded_at", { withTimezone: true }),

    // Admin handling
    adminId: text("admin_id").references(() => userProfile.userId, {
      onDelete: "set null",
    }),
    adminNotes: text("admin_notes"),
    resolution: disputeResolutionEnum("resolution"),
    resolutionNotes: text("resolution_notes"),
    compensationAmount: integer("compensation_amount"),

    // Deadlines — drive scheduled job behavior
    mediationDeadline: timestamp("mediation_deadline", { withTimezone: true }).notNull(), // created_at + 48h
    adminDeadline: timestamp("admin_deadline", { withTimezone: true }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // Only 1 active dispute per booking at a time
    // Partial unique: allows multiple RESOLVED/CLOSED on same booking (edge case)
    uniqueIndex("idx_disputes_booking_active")
      .on(table.bookingId)
      .where(sql`${table.status} NOT IN ('RESOLVED', 'CLOSED')`),
    index("idx_disputes_status").on(table.status),
    // Admin dashboard: disputes assigned to me
    index("idx_disputes_admin")
      .on(table.adminId)
      .where(sql`${table.status} = 'UNDER_REVIEW'`),
  ],
);

export const disputeEvidences = pgTable(
  "dispute_evidences",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    disputeId: text("dispute_id")
      .notNull()
      .references(() => disputes.id, { onDelete: "cascade" }),
    uploadedBy: text("uploaded_by")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "restrict" }),
    fileUrl: text("file_url").notNull(),
    fileType: text("file_type").notNull(),       // "image/jpeg", "video/mp4"
    fileSizeBytes: integer("file_size_bytes").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_dispute_evidences_dispute").on(table.disputeId),
  ],
);

// --- Relations ---
export const disputesRelations = relations(disputes, ({ one, many }) => ({
  booking: one(bookings, {
    fields: [disputes.bookingId],
    references: [bookings.id],
  }),
  openedByUser: one(userProfile, {
    fields: [disputes.openedBy],
    references: [userProfile.userId],
    relationName: "disputes_opened",
  }),
  respondent: one(userProfile, {
    fields: [disputes.respondentId],
    references: [userProfile.userId],
    relationName: "disputes_responded",
  }),
  admin: one(userProfile, {
    fields: [disputes.adminId],
    references: [userProfile.userId],
    relationName: "disputes_admin",
  }),
  evidences: many(disputeEvidences),
}));

export const disputeEvidencesRelations = relations(disputeEvidences, ({ one }) => ({
  dispute: one(disputes, {
    fields: [disputeEvidences.disputeId],
    references: [disputes.id],
  }),
  uploadedByUser: one(userProfile, {
    fields: [disputeEvidences.uploadedBy],
    references: [userProfile.userId],
  }),
}));
