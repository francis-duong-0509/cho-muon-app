import {
  pgTable,
  pgEnum,
  text,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { userProfile } from "./users";

// --- Enum ---
export const notificationTypeEnum = pgEnum("notification_type", [
  "BOOKING_REQUEST",
  "BOOKING_CONFIRMED",
  "BOOKING_DECLINED",
  "BOOKING_EXPIRED",
  "BOOKING_CANCELLED",
  "BOOKING_REMINDER_PICKUP",
  "BOOKING_RETURN_REMINDER",
  "BOOKING_OVERDUE",
  "BOOKING_COMPLETED",
  "NEW_MESSAGE",
  "REVIEW_REQUEST",
  "REVIEW_RECEIVED",
  "DISPUTE_OPENED",
  "DISPUTE_RESOLVED",
  "KYC_APPROVED",
  "KYC_REJECTED",
  "ACCOUNT_WARNING",
  "LISTING_APPROVED",
  "LISTING_SUSPENDED",
]);

// --- Table ---
export const notifications = pgTable(
  "notifications",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: text("user_id")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "cascade" }),

    type: notificationTypeEnum("type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),

    // Flexible metadata: booking_id, listing_id, etc.
    // JSONB: query individual fields, GIN-indexable
    data: jsonb("data"),

    isRead: boolean("is_read").default(false).notNull(),
    readAt: timestamp("read_at", { withTimezone: true }),

    // Delivery channels: ["push"], ["push", "email"], ["sms"]
    channel: text("channel").array().default(sql`'{push}'`).notNull(),

    // Delivery tracking (null = not yet attempted)
    sentAt: timestamp("sent_at", { withTimezone: true }),
    failedAt: timestamp("failed_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_notifications_user").on(table.userId, table.createdAt),
    // Partial index: unread only — inbox badge count
    index("idx_notifications_unread")
      .on(table.userId)
      .where(sql`${table.isRead} = false`),
    // Partial index: delivery worker picks up unsent notifications
    index("idx_notifications_unsent")
      .on(table.createdAt)
      .where(sql`${table.sentAt} IS NULL AND ${table.failedAt} IS NULL`),
  ],
);

// --- Relations ---
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(userProfile, {
    fields: [notifications.userId],
    references: [userProfile.userId],
  }),
}));
