// Load .env before any env-dependent imports (path relative to packages/db/)
import { config } from "dotenv";
config({ path: "../../apps/server/.env" });
import { db } from "./index";
import { categories } from "./schema/categories";

const CATEGORY_SEED = [
  { id: "outdoor_sports",      name: "Outdoor & Thể thao",       nameEn: "Outdoor & Sports",      icon: "bike",    sortOrder: 1 },
  { id: "electronics",         name: "Thiết bị điện tử",          nameEn: "Electronics",           icon: "laptop",  sortOrder: 2 },
  { id: "home_appliances",     name: "Đồ gia dụng",               nameEn: "Home Appliances",       icon: "home",    sortOrder: 3 },
  { id: "fashion_accessories", name: "Trang phục & Phụ kiện",     nameEn: "Fashion & Accessories", icon: "shirt",   sortOrder: 4 },
  { id: "tools_equipment",     name: "Dụng cụ & Thiết bị",        nameEn: "Tools & Equipment",     icon: "wrench",  sortOrder: 5 },
  { id: "musical_instruments", name: "Nhạc cụ",                   nameEn: "Musical Instruments",   icon: "music",   sortOrder: 6 },
  { id: "event_party",         name: "Đồ dùng tiệc & Sự kiện",   nameEn: "Event & Party",         icon: "party",   sortOrder: 7 },
  { id: "other",               name: "Khác",                      nameEn: "Other",                 icon: "more",    sortOrder: 8 },
];

async function seed() {
  console.log("🌱 Seeding categories...");

  // Idempotent: safe to re-run, skips existing rows
  await db.insert(categories).values(CATEGORY_SEED).onConflictDoNothing();

  console.log(`✅ Seeded ${CATEGORY_SEED.length} categories`);
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
