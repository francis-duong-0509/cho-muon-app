import {
  pgTable,
  pgEnum,
  text,
  smallint,
  boolean,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { userProfile } from "./users";
import { bookings } from "./bookings";
import { listings } from "./listings";

// --- Enum ---
export const userBookingRoleEnum = pgEnum("user_booking_role", ["OWNER", "RENTER"]);

// --- Table ---
export const reviews = pgTable(
  "reviews",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "restrict" }),
    reviewerId: text("reviewer_id")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "restrict" }),
    revieweeId: text("reviewee_id")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "restrict" }),

    // Denormalized from booking — avoids JOIN to get listing context
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "restrict" }),

    reviewerRole: userBookingRoleEnum("reviewer_role").notNull(),
    rating: smallint("rating").notNull(), // 1–5, CHECK enforced at app layer + migration

    // Comment required if rating ≤ 2 (enforced at application layer)
    comment: text("comment"),
    tags: text("tags").array(),

    // Blind review — not visible until both parties submit OR 72h passed
    // WHY: Prevents anchoring bias — each party reviews independently
    isVisible: boolean("is_visible").default(false).notNull(),

    // Moderation
    isFlagged: boolean("is_flagged").default(false).notNull(),
    flagReason: text("flag_reason"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // 1 reviewer can write exactly 1 review per booking
    uniqueIndex("idx_reviews_booking_reviewer").on(table.bookingId, table.reviewerId),
    // Fetch reviews for a user's profile page
    index("idx_reviews_reviewee").on(table.revieweeId, table.isVisible),
    // Fetch reviews for a listing page
    index("idx_reviews_listing").on(table.listingId, table.isVisible),
  ],
);

// --- Relations ---
export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
  reviewer: one(userProfile, {
    fields: [reviews.reviewerId],
    references: [userProfile.userId],
    relationName: "reviews_written",
  }),
  reviewee: one(userProfile, {
    fields: [reviews.revieweeId],
    references: [userProfile.userId],
    relationName: "reviews_received",
  }),
  listing: one(listings, {
    fields: [reviews.listingId],
    references: [listings.id],
  }),
}));
