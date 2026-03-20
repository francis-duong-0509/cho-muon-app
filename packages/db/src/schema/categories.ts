import {
  pgTable,
  text,
  boolean,
  smallint,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// Slug-as-PK pattern: "electronics", "outdoor_sports"
// WHY text slug không phải UUID:
//   - Human readable trong URLs & API: /browse?category=electronics
//   - Admin-defined, stable identifiers
//   - Avoid extra slug column + unique constraint
export const categories = pgTable(
  "categories",
  {
    id: text("id").primaryKey(), // slug: "electronics", "outdoor_sports"
    name: text("name").notNull(),        // "Thiết bị điện tử"
    nameEn: text("name_en"),             // "Electronics"
    icon: text("icon"),                  // icon key for frontend (e.g. "laptop")
    isActive: boolean("is_active").default(true).notNull(),
    sortOrder: smallint("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_categories_active").on(table.sortOrder).where(sql`${table.isActive} = true`),
  ],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  listings: many(listings),
}));

// Seed data — 8 categories từ DATA_MODEL ban đầu
// Chạy sau khi migrate: bun db:seed
export const CATEGORY_SEED = [
  { id: "outdoor_sports",       name: "Outdoor & Thể thao",         nameEn: "Outdoor & Sports",        icon: "🚴",  sortOrder: 1 },
  { id: "electronics",          name: "Thiết bị điện tử",            nameEn: "Electronics",             icon: "💻",  sortOrder: 2 },
  { id: "home_appliances",      name: "Đồ gia dụng",                 nameEn: "Home Appliances",         icon: "🏠",  sortOrder: 3 },
  { id: "fashion_accessories",  name: "Trang phục & Phụ kiện",       nameEn: "Fashion & Accessories",   icon: "👔",  sortOrder: 4 },
  { id: "tools_equipment",      name: "Dụng cụ & Thiết bị",          nameEn: "Tools & Equipment",       icon: "🔧",  sortOrder: 5 },
  { id: "musical_instruments",  name: "Nhạc cụ",                     nameEn: "Musical Instruments",     icon: "🎸",  sortOrder: 6 },
  { id: "event_party",          name: "Đồ dùng tiệc & Sự kiện",      nameEn: "Event & Party",           icon: "🎉",  sortOrder: 7 },
  { id: "other",                name: "Khác",                         nameEn: "Other",                   icon: "📦",  sortOrder: 8 },
] as const;

// Re-export for circular dep resolution
import { listings } from "./listings";
