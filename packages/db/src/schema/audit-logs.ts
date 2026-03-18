import {
  pgTable,
  text,
  timestamp,
  jsonb,
  index,
  inet,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { userProfile } from "./users";

// Append-only audit trail — never UPDATE or DELETE rows
// WHY: Immutable audit log for compliance, dispute resolution, security forensics
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    // NULL = system-initiated action (scheduled job, webhook)
    actorId: text("actor_id").references(() => userProfile.userId, {
      onDelete: "set null",
    }),

    // e.g. "booking.status_changed", "user.suspended", "listing.approved"
    action: text("action").notNull(),

    // What entity was affected
    entityType: text("entity_type").notNull(), // "booking", "listing", "user"
    entityId: text("entity_id").notNull(),

    // Diff: what changed
    oldValue: jsonb("old_value"),
    newValue: jsonb("new_value"),

    // Request context
    ipAddress: inet("ip_address"),
    userAgent: text("user_agent"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // "Show all changes to booking X" — most common audit query
    index("idx_audit_entity").on(table.entityType, table.entityId, table.createdAt),
    // "Show all actions by user Y"
    index("idx_audit_actor").on(table.actorId, table.createdAt),
  ],
);

// --- Relations ---
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(userProfile, {
    fields: [auditLogs.actorId],
    references: [userProfile.userId],
  }),
}));
