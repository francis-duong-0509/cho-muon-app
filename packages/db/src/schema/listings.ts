import {
  pgTable,
  pgEnum,
  text,
  integer,
  smallint,
  numeric,
  boolean,
  timestamp,
  date,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { userProfile } from "./users";
import { categories } from "./categories";


// --- Enums ---
export const listingStatusEnum = pgEnum("listing_status", [
  "PENDING_REVIEW",
  "ACTIVE",
  "PAUSED",
  "SUSPENDED",
  "DELETED",
]);

export const pickupMethodEnum = pgEnum("pickup_method", [
  "IN_PERSON",
  "SHIP_AVAILABLE",
]);


// --- Tables ---
export const listings = pgTable(
  "listings",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    ownerId: text("owner_id")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "restrict" }),

    // Content
    title: text("title").notNull(),
    description: text("description").notNull(),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    conditionNotes: text("condition_notes"),
    thumbnailUrl: text("thumbnail_url"),


    // Status
    status: listingStatusEnum("status").default("PENDING_REVIEW").notNull(),
    pausedAt: timestamp("paused_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),

    // Pricing
    pricePerDay: integer("price_per_day").notNull(),
    depositAmount: integer("deposit_amount").notNull(),
    estimatedValue: integer("estimated_value").notNull(),

    // Rental rules
    minRentalDays: smallint("min_rental_days").default(1).notNull(),
    maxRentalDays: smallint("max_rental_days").default(30).notNull(),
    noticeHours: smallint("notice_hours").default(0).notNull(),
    pickupMethod: pickupMethodEnum("pickup_method").default("IN_PERSON").notNull(),

    // Location
    province: text("province").notNull(),
    district: text("district").notNull(),
    ward: text("ward"),

    // Denormalized stats (updated incrementally)
    viewCount: integer("view_count").default(0).notNull(),
    totalBookings: integer("total_bookings").default(0).notNull(),
    avgRating: numeric("avg_rating", { precision: 3, scale: 2 }),

    // Featured (Phase 2)
    isFeatured: boolean("is_featured").default(false).notNull(),
    featuredUntil: timestamp("featured_until", { withTimezone: true }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_listings_owner").on(table.ownerId),
    // Partial indexes — only index relevant rows
    index("idx_listings_status").on(table.status).where(sql`${table.deletedAt} IS NULL`),
    index("idx_listings_category").on(table.categoryId).where(sql`${table.status} = 'ACTIVE'`),
    index("idx_listings_district").on(table.province, table.district).where(sql`${table.status} = 'ACTIVE'`),
    index("idx_listings_price").on(table.pricePerDay).where(sql`${table.status} = 'ACTIVE'`),
    // Full-text search index (GIN)
    index("idx_listings_search").using("gin", sql`to_tsvector('simple', ${table.title} || ' ' || ${table.description})`),
  ],
);

export const listingImages = pgTable(
  "listing_images",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    sortOrder: smallint("sort_order").default(0).notNull(), // 0 = thumbnail
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_listing_images_listing").on(table.listingId, table.sortOrder),
  ],
);

export const listingBlockedDates = pgTable(
  "listing_blocked_dates",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    blockedDate: date("blocked_date").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // Composite unique: same listing cannot block same date twice
    uniqueIndex("idx_blocked_dates_unique").on(table.listingId, table.blockedDate),
    index("idx_blocked_dates_lookup").on(table.listingId, table.blockedDate),
  ],
);

// --- Relations ---
export const listingsRelations = relations(listings, ({ one, many }) => ({
  owner: one(userProfile, {
    fields: [listings.ownerId],
    references: [userProfile.userId],
  }),
  category: one(categories, {
    fields: [listings.categoryId],
    references: [categories.id],
  }),
  images: many(listingImages),
  blockedDates: many(listingBlockedDates),
}));


export const listingImagesRelations = relations(listingImages, ({ one }) => ({
  listing: one(listings, {
    fields: [listingImages.listingId],
    references: [listings.id],
  }),
}));

export const listingBlockedDatesRelations = relations(listingBlockedDates, ({ one }) => ({
  listing: one(listings, {
    fields: [listingBlockedDates.listingId],
    references: [listings.id],
  }),
}));