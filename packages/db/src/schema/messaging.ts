import {
  pgTable,
  pgEnum,
  text,
  boolean,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { userProfile } from "./users";
import { bookings } from "./bookings";

// --- Enum ---
export const messageTypeEnum = pgEnum("message_type", [
  "TEXT",
  "IMAGE",
  "SYSTEM", // Auto-inserted on booking events, sender_id = null
]);

// --- Tables ---

// 1:1 với booking — tạo khi booking CONFIRMED
export const conversations = pgTable(
  "conversations",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "restrict" }),

    // Denormalized for authorization check without JOIN
    ownerId: text("owner_id")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "restrict" }),
    renterId: text("renter_id")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "restrict" }),

    isLocked: boolean("is_locked").default(false).notNull(), // Locked after COMPLETED/CANCELLED
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_conversations_booking").on(table.bookingId),
    index("idx_conversations_owner").on(table.ownerId, table.lastMessageAt),
    index("idx_conversations_renter").on(table.renterId, table.lastMessageAt),
  ],
);

export const messages = pgTable(
  "messages",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),

    // NULL for SYSTEM messages
    senderId: text("sender_id").references(() => userProfile.userId, {
      onDelete: "set null",
    }),

    messageType: messageTypeEnum("message_type").default("TEXT").notNull(),
    content: text("content"),       // null if imageOnly
    imageUrls: text("image_urls").array(), // max 5 enforced at app layer

    // Moderation
    isFlagged: boolean("is_flagged").default(false).notNull(),
    flagReason: text("flag_reason"),

    // Soft delete (sender can delete own message)
    isDeleted: boolean("is_deleted").default(false).notNull(),

    // Read status (simple boolean per role — sufficient for 2-party conversation)
    readByOwner: boolean("read_by_owner").default(false).notNull(),
    readByRenter: boolean("read_by_renter").default(false).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_messages_conversation").on(table.conversationId, table.createdAt),
    index("idx_messages_sender").on(table.senderId),
    // Partial index: unread messages for push notification worker
    index("idx_messages_unread_owner")
      .on(table.conversationId)
      .where(sql`${table.readByOwner} = false AND ${table.isDeleted} = false`),
  ],
);

// Fine-grained read tracking — tracks last_read_message per user
// Avoids updating every single message row on "mark all read"
export const conversationReadReceipts = pgTable(
  "conversation_read_receipts",
  {
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "cascade" }),
    lastReadMessageId: text("last_read_message_id").references(() => messages.id, {
      onDelete: "set null",
    }),
    lastReadAt: timestamp("last_read_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_read_receipts_pk").on(table.conversationId, table.userId),
  ],
);

// --- Relations ---
export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  booking: one(bookings, {
    fields: [conversations.bookingId],
    references: [bookings.id],
  }),
  owner: one(userProfile, {
    fields: [conversations.ownerId],
    references: [userProfile.userId],
    relationName: "conversations_as_owner",
  }),
  renter: one(userProfile, {
    fields: [conversations.renterId],
    references: [userProfile.userId],
    relationName: "conversations_as_renter",
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(userProfile, {
    fields: [messages.senderId],
    references: [userProfile.userId],
  }),
}));
