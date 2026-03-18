import {
  pgTable,
  pgEnum,
  text,
  integer,
  smallint,
  boolean,
  timestamp,
  date,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { userProfile } from "./users";
import { listings } from "./listings";

// --- Enums ---
export const bookingStatusEnum = pgEnum("booking_status", [
  "PENDING",    // Chờ owner phản hồi
  "CONFIRMED",  // Owner đã approve
  "ACTIVE",     // Đang trong thời gian thuê
  "OVERDUE",    // Quá hạn trả
  "COMPLETED",  // Hoàn thành
  "CANCELLED",  // Đã huỷ
  "DECLINED",   // Owner từ chối
  "EXPIRED",    // Hết 24h owner không phản hồi
]);

export const returnConditionEnum = pgEnum("return_condition", [
  "GOOD",     // Nguyên vẹn
  "DAMAGED",  // Có hư hỏng
  "LOST",     // Bị mất
]);

// --- Table ---
export const bookings = pgTable(
  "bookings",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    // Parties (owner denormalized from listing for fast query — avoids JOIN)
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "restrict" }),
    ownerId: text("owner_id")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "restrict" }),
    renterId: text("renter_id")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "restrict" }),

    // State machine
    status: bookingStatusEnum("status").default("PENDING").notNull(),

    // Date range
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    totalDays: smallint("total_days").notNull(), // = end_date - start_date + 1

    // Snapshot pricing — immutable after booking created
    // WHY: Owner thay đổi giá sau → booking cũ không bị ảnh hưởng
    pricePerDaySnapshot: integer("price_per_day_snapshot").notNull(),
    totalRentalAmount: integer("total_rental_amount").notNull(), // = snapshot × totalDays
    depositAmountSnapshot: integer("deposit_amount_snapshot").notNull(),

    // Confirmation
    renterMessage: text("renter_message").notNull(),
    declineReason: text("decline_reason"),
    cancelReason: text("cancel_reason"),
    cancelledBy: text("cancelled_by").references(() => userProfile.userId, {
      onDelete: "set null",
    }),

    // Handover lifecycle timestamps (4-step physical handover)
    ownerHandoverAt: timestamp("owner_handover_at", { withTimezone: true }),     // Owner xác nhận giao
    renterReceivedAt: timestamp("renter_received_at", { withTimezone: true }),   // Renter xác nhận nhận
    renterReturnedAt: timestamp("renter_returned_at", { withTimezone: true }),   // Renter xác nhận trả
    ownerReceivedBackAt: timestamp("owner_received_back_at", { withTimezone: true }), // Owner xác nhận nhận lại

    // Return assessment
    itemConditionOnReturn: returnConditionEnum("item_condition_on_return"),
    returnNotes: text("return_notes"),

    // Deposit confirmation (MVP: outside app — manual confirmation flags)
    depositConfirmedByOwner: boolean("deposit_confirmed_by_owner").default(false).notNull(),
    depositConfirmedByRenter: boolean("deposit_confirmed_by_renter").default(false).notNull(),

    // Overdue tracking
    overdueDays: smallint("overdue_days").default(0).notNull(),

    // Request expiry — scheduled job: PENDING → EXPIRED after 24h
    requestExpiresAt: timestamp("request_expires_at", { withTimezone: true }).notNull(),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_bookings_listing").on(table.listingId),
    index("idx_bookings_owner").on(table.ownerId),
    index("idx_bookings_renter").on(table.renterId),
    index("idx_bookings_status").on(table.status),

    // Composite partial index: availability check
    // Query: "listings X có booking nào CONFIRMED/ACTIVE trong khoảng [start, end] không?"
    index("idx_bookings_dates")
      .on(table.listingId, table.startDate, table.endDate)
      .where(sql`${table.status} IN ('CONFIRMED', 'ACTIVE')`),

    // Partial index: scheduled job tìm PENDING sắp expired
    index("idx_bookings_expires")
      .on(table.requestExpiresAt)
      .where(sql`${table.status} = 'PENDING'`),
  ],
);

// --- Relations ---
export const bookingsRelations = relations(bookings, ({ one }) => ({
  listing: one(listings, {
    fields: [bookings.listingId],
    references: [listings.id],
  }),
  owner: one(userProfile, {
    fields: [bookings.ownerId],
    references: [userProfile.userId],
    relationName: "bookings_as_owner",
  }),
  renter: one(userProfile, {
    fields: [bookings.renterId],
    references: [userProfile.userId],
    relationName: "bookings_as_renter",
  }),
  cancelledByUser: one(userProfile, {
    fields: [bookings.cancelledBy],
    references: [userProfile.userId],
    relationName: "bookings_cancelled_by",
  }),
}));
