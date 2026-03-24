import { config } from "dotenv";
config({ path: "../../apps/server/.env" });
import { db } from "./index";
import { categories } from "./schema/categories";
import { listings } from "./schema/listings";
import { userProfile } from "./schema/users";
import { user, account } from "./schema/auth";
import { eq, sql } from "drizzle-orm";
import { scrypt, randomBytes } from "node:crypto";

/**
 * Hash password using the same format as better-auth:
 * scrypt with N=16384, r=16, p=1, dkLen=64 → "salt:hash" in hex
 */
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = await new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      64,
      { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 },
      (err, derivedKey) => (err ? reject(err) : resolve(derivedKey))
    );
  });
  return `${salt}:${key.toString("hex")}`;
}

// --- Super Admin seed ---
const SUPER_ADMIN = {
  email: "admin@gmail.com",
  name: "Super Admin",
  password: "123123123",
  role: "super_admin",
  phone: "0000000000",
};

async function seedSuperAdmin() {
  console.log("🔑 Seeding super admin...");

  // Check if admin already exists
  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, SUPER_ADMIN.email))
    .limit(1);

  if (existing) {
    // Update role to super_admin in case it was different
    await db
      .update(user)
      .set({ role: SUPER_ADMIN.role })
      .where(eq(user.id, existing.id));
    console.log(`✅ Super admin already exists (${SUPER_ADMIN.email}), role updated.`);
    return;
  }

  const adminId = crypto.randomUUID();
  const hashedPassword = await hashPassword(SUPER_ADMIN.password);

  await db.transaction(async (tx) => {
    // 1. Create user record
    await tx.insert(user).values({
      id: adminId,
      name: SUPER_ADMIN.name,
      email: SUPER_ADMIN.email,
      emailVerified: true,
      phone: SUPER_ADMIN.phone,
      role: SUPER_ADMIN.role,
    });

    // 2. Create account record (credential provider)
    await tx.insert(account).values({
      id: crypto.randomUUID(),
      accountId: adminId,
      providerId: "credential",
      userId: adminId,
      password: hashedPassword,
    });

    // 3. Create user profile
    await tx.insert(userProfile).values({
      userId: adminId,
      phone: SUPER_ADMIN.phone,
      displayName: SUPER_ADMIN.name,
    });
  });

  console.log(`✅ Super admin created: ${SUPER_ADMIN.email} / ${SUPER_ADMIN.password}`);
}

// --- Categories with emoji icons ---
const CATEGORY_SEED = [
  { id: "outdoor_sports",       name: "Outdoor & Thể thao",       nameEn: "Outdoor & Sports",      icon: "🚴", sortOrder: 1 },
  { id: "electronics",          name: "Thiết bị điện tử",          nameEn: "Electronics",           icon: "💻", sortOrder: 2 },
  { id: "home_appliances",      name: "Đồ gia dụng",               nameEn: "Home Appliances",       icon: "🏠", sortOrder: 3 },
  { id: "fashion_accessories",  name: "Trang phục & Phụ kiện",     nameEn: "Fashion & Accessories", icon: "👔", sortOrder: 4 },
  { id: "tools_equipment",      name: "Dụng cụ & Thiết bị",        nameEn: "Tools & Equipment",     icon: "🔧", sortOrder: 5 },
  { id: "musical_instruments",  name: "Nhạc cụ",                   nameEn: "Musical Instruments",   icon: "🎸", sortOrder: 6 },
  { id: "event_party",          name: "Đồ dùng tiệc & Sự kiện",   nameEn: "Event & Party",         icon: "🎉", sortOrder: 7 },
  { id: "other",                name: "Khác",                      nameEn: "Other",                 icon: "📦", sortOrder: 8 },
];

// --- Listing seed data ---
const LISTING_TEMPLATES = [
  // Electronics
  { categoryId: "electronics", title: "MacBook Pro M3 14-inch",             description: "MacBook Pro M3 14\" RAM 18GB SSD 512GB. Phù hợp làm việc, edit video, design. Pin 11h, màn hình Liquid Retina XDR. Kèm sạc 67W USB-C. Máy mới 98%, đã dán dẻo toàn thân.",                          pricePerDay: 500000,  depositAmount: 10000000, estimatedValue: 35000000, province: "TP. Hồ Chí Minh", district: "Quận 1",       thumbnailUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600" },
  { categoryId: "electronics", title: "Máy chiếu mini Xiaomi Mi Projector", description: "Máy chiếu mini 1080p, sáng 500 lumens. Kết nối WiFi, Bluetooth, HDMI. Phù hợp xem phim, thuyết trình, party. Kèm remote, túi đựng và dây HDMI 2m.",                                                pricePerDay: 180000,  depositAmount: 1500000,  estimatedValue: 8000000,  province: "TP. Hồ Chí Minh", district: "Bình Thạnh",   thumbnailUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600" },
  { categoryId: "electronics", title: "iPad Pro M4 13-inch + Apple Pencil", description: "iPad Pro M4 13 inch 256GB WiFi + Apple Pencil Pro. Phù hợp vẽ digital art, ghi note, xem phim. Màn hình Ultra Retina XDR, chip M4 mạnh mẽ. Kèm Smart Folio và adapter USB-C.",                     pricePerDay: 350000,  depositAmount: 8000000,  estimatedValue: 30000000, province: "TP. Hồ Chí Minh", district: "Quận 3",       thumbnailUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600" },

  // Outdoor & Sports
  { categoryId: "outdoor_sports", title: "Lều cắm trại 4 người Naturehike",    description: "Lều 4 mùa Naturehike P-Series, chịu gió mạnh và mưa to. Trọng lượng nhẹ 2.1kg, dựng trong 5 phút. Đã đi Tà Năng, Đà Lạt, Phú Quốc. Bao gồm cọc lều, dây căng, túi đựng.",              pricePerDay: 120000,  depositAmount: 500000,   estimatedValue: 3500000,  province: "TP. Hồ Chí Minh", district: "Quận 7",       thumbnailUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600" },
  { categoryId: "outdoor_sports", title: "Xe đạp địa hình Trek Marlin 5",      description: "Xe MTB Trek Marlin 5 size M. Phuộc Suntour, đề Shimano Altus 21 tốc độ. Phù hợp trails, đường đất. Đã thay lốp và xích mới. Kèm đèn trước + sau.",                                        pricePerDay: 150000,  depositAmount: 2000000,  estimatedValue: 12000000, province: "TP. Hồ Chí Minh", district: "Quận 2",       thumbnailUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600" },
  { categoryId: "outdoor_sports", title: "Bộ dụng cụ leo núi đầy đủ",          description: "Bộ gear leo núi: dây chính 60m 9.8mm UIAA, harness Black Diamond M/L, helmet Petzl Boreo, thiết bị bảo hộ. Phù hợp leo cơ bản đến trung cấp. Đã kiểm tra an toàn định kỳ.",              pricePerDay: 200000,  depositAmount: 1500000,  estimatedValue: 8000000,  province: "TP. Hồ Chí Minh", district: "Quận 10",      thumbnailUrl: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600" },
  { categoryId: "outdoor_sports", title: "Bộ đồ lặn Scuba đầy đủ",             description: "Gear lặn biển: mặt nạ, ống thở, chân vịt size 40-44, áo neoprene 3mm, bình khí 12L + regulator. Cần có chứng chỉ PADI OW. Lý tưởng cho tour Phú Quốc, Côn Đảo.",                          pricePerDay: 250000,  depositAmount: 3000000,  estimatedValue: 15000000, province: "TP. Hồ Chí Minh", district: "Quận 4",       thumbnailUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600" },

  // Home Appliances
  { categoryId: "home_appliances", title: "Nồi chiên không dầu Philips XXL 7L",  description: "Philips HD9270 dung tích 7L, công suất 2000W. Màn hình cảm ứng, 7 chương trình nấu sẵn. Lý tưởng cho bữa tiệc nhỏ hoặc nấu đám giỗ gia đình. Bảo quản sạch sẽ.",                      pricePerDay: 90000,   depositAmount: 600000,   estimatedValue: 4000000,  province: "TP. Hồ Chí Minh", district: "Quận 6",       thumbnailUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600" },
  { categoryId: "home_appliances", title: "Máy pha cà phê De'Longhi Magnifica", description: "Máy pha cà phê tự động De'Longhi Magnifica Evo. Tự xay hạt, tạo crema hoàn hảo. Pha espresso, cappuccino, latte. Phù hợp văn phòng, sự kiện. Kèm bình sữa và cọ vệ sinh.",             pricePerDay: 200000,  depositAmount: 2000000,  estimatedValue: 12000000, province: "TP. Hồ Chí Minh", district: "Tân Bình",     thumbnailUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600" },
  { categoryId: "home_appliances", title: "Máy xay sinh tố Vitamix E310",        description: "Máy xay công nghiệp Vitamix E310 1400W / 2HP. Xay trơn mịn sinh tố, soup, kem. Kèm 2 cốc 1.4L. Phù hợp tiệc buffet, quán cafe nhỏ thuê ngắn hạn.",                                     pricePerDay: 120000,  depositAmount: 800000,   estimatedValue: 7000000,  province: "TP. Hồ Chí Minh", district: "Quận 10",      thumbnailUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600" },
  { categoryId: "home_appliances", title: "Robot hút bụi Roborock S8 Pro Ultra", description: "Robot hút bụi lau nhà Roborock S8 Pro Ultra. Tự giặt giẻ, tự đổ rác, lực hút 6000Pa. Map nhà thông minh, điều khiển qua app. Cho thuê ngắn hạn khi dọn nhà, sự kiện.",                   pricePerDay: 150000,  depositAmount: 3000000,  estimatedValue: 25000000, province: "TP. Hồ Chí Minh", district: "Quận 7",       thumbnailUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600" },

  // Musical Instruments
  { categoryId: "musical_instruments", title: "Guitar Acoustic Yamaha F310",         description: "Guitar acoustic Yamaha F310 chuẩn, âm thanh tốt cho người mới đến trung cấp. Dây mới thay, cần đàn thẳng. Kèm bao đựng, capo và picks.",                                              pricePerDay: 80000,   depositAmount: 300000,   estimatedValue: 2500000,  province: "TP. Hồ Chí Minh", district: "Quận 3",       thumbnailUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600" },
  { categoryId: "musical_instruments", title: "Keyboard Roland FP-90X 88 phím",     description: "Piano điện Roland FP-90X 88 phím PHA-50. Âm thanh SuperNATURAL, 350 âm sắc, Bluetooth MIDI. Kèm chân đứng, pedal 3 chân. Dành cho biểu diễn và thu âm.",                                pricePerDay: 300000,  depositAmount: 5000000,  estimatedValue: 35000000, province: "TP. Hồ Chí Minh", district: "Quận 3",       thumbnailUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600" },
  { categoryId: "musical_instruments", title: "Trống Cajon Meinl Artisan Edition",  description: "Trống cajon Meinl Artisan gỗ birch, snare wire điều chỉnh. Âm bass ấm, snare giòn. Phù hợp acoustic session, café music. Nhẹ 5.8kg dễ vận chuyển.",                                    pricePerDay: 80000,   depositAmount: 400000,   estimatedValue: 3000000,  province: "TP. Hồ Chí Minh", district: "Quận 1",       thumbnailUrl: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600" },

  // Event & Party
  { categoryId: "event_party", title: "Bộ bàn ghế tiệc 10 người",              description: "Bàn tròn D150 + 10 ghế fold. Chất liệu thép sơn tĩnh điện, mặt bàn nhựa ABS. Giao tận nơi trong bán kính 5km Q1-Q3. Phù hợp tiệc tại nhà, sinh nhật, liên hoan.",                       pricePerDay: 250000,  depositAmount: 500000,   estimatedValue: 5000000,  province: "TP. Hồ Chí Minh", district: "Quận 1",       thumbnailUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600" },
  { categoryId: "event_party", title: "Bộ dàn âm thanh JBL EON615",             description: "Loa PA JBL EON615 2 chiếc + mixer Yamaha MG10XU. Công suất 2000W tổng. Phù hợp tiệc 50-100 người, sinh nhật, workshop. Giao và nhận tận nơi Q1-Q5.",                                       pricePerDay: 800000,  depositAmount: 3000000,  estimatedValue: 30000000, province: "TP. Hồ Chí Minh", district: "Quận 5",       thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600" },
  { categoryId: "event_party", title: "Máy khói + đèn laser sự kiện",           description: "Combo máy tạo khói 1500W + 2 đèn laser RGB. Hiệu ứng sân khấu chuyên nghiệp cho tiệc, sự kiện, Halloween, Tết. Kèm dung dịch tạo khói 2L.",                                                pricePerDay: 350000,  depositAmount: 1500000,  estimatedValue: 8000000,  province: "TP. Hồ Chí Minh", district: "Quận 1",       thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600" },

  // Tools & Equipment  
  { categoryId: "tools_equipment", title: "Máy khoan Bosch GSB 16 RE",           description: "Máy khoan động lực Bosch GSB 16 RE 750W. Khoan bê tông, gỗ, kim loại. Kèm bộ mũi khoan 15 chi tiết và hộp đựng. Phù hợp sửa chữa nhà, lắp đặt.",                                       pricePerDay: 80000,   depositAmount: 500000,   estimatedValue: 3000000,  province: "TP. Hồ Chí Minh", district: "Gò Vấp",       thumbnailUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600" },
  { categoryId: "tools_equipment", title: "Máy rửa xe cao áp Karcher K5",       description: "Máy phun rửa áp lực cao Karcher K5 Full Control Plus. Áp lực 145 bar, phù hợp rửa xe, sân vườn, tường nhà. Kèm đầu phun xoay và bình tạo bọt.",                                              pricePerDay: 120000,  depositAmount: 1000000,  estimatedValue: 8000000,  province: "TP. Hồ Chí Minh", district: "Thủ Đức",      thumbnailUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600" },

  // Fashion & Accessories
  { categoryId: "fashion_accessories", title: "Bộ vest cưới nam cao cấp size L",  description: "Vest cưới nam 3 mảnh (áo vest + quần + gile) chất liệu wool blend, màu navy. Size L (chest 100, waist 84). Đã giặt hấp. Kèm cà vạt lụa và pocket square.",                                pricePerDay: 300000,  depositAmount: 2000000,  estimatedValue: 8000000,  province: "TP. Hồ Chí Minh", district: "Quận 1",       thumbnailUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600" },
  { categoryId: "fashion_accessories", title: "Túi xách Gucci Marmont Medium",    description: "Túi xách Gucci GG Marmont Medium size, màu đen, da thật. Phù hợp cho sự kiện, chụp ảnh, quay content. Authentic 100%, kèm dustbag và hộp.",                                                  pricePerDay: 500000,  depositAmount: 5000000,  estimatedValue: 50000000, province: "TP. Hồ Chí Minh", district: "Quận 1",       thumbnailUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600" },
];

async function seed() {
  // Seed super admin first
  await seedSuperAdmin();

  console.log("🌱 Seeding categories...");

  // Upsert categories — update icon if already exists
  for (const cat of CATEGORY_SEED) {
    await db
      .insert(categories)
      .values(cat)
      .onConflictDoUpdate({
        target: categories.id,
        set: { icon: cat.icon, name: cat.name, nameEn: cat.nameEn },
      });
  }
  console.log(`✅ Seeded ${CATEGORY_SEED.length} categories`);

  // Find the first user in the system to use as owner
  const [firstUser] = await db
    .select({ userId: userProfile.userId })
    .from(userProfile)
    .limit(1);

  if (!firstUser) {
    console.log("⚠️  No user found in user_profile. Skipping listings seed.");
    console.log("   Register a user first, then re-run: pnpm db:seed");
    return;
  }

  const ownerId = firstUser.userId;
  console.log(`👤 Using owner: ${ownerId}`);

  // Check how many listings already exist
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(listings);

  if (count > 0) {
    console.log(`ℹ️  ${count} listings already exist. Skipping listing seed.`);
    return;
  }

  console.log("🌱 Seeding listings...");

  const listingValues = LISTING_TEMPLATES.map((tpl) => ({
    ownerId,
    title: tpl.title,
    description: tpl.description,
    categoryId: tpl.categoryId,
    pricePerDay: tpl.pricePerDay,
    depositAmount: tpl.depositAmount,
    estimatedValue: tpl.estimatedValue,
    province: tpl.province,
    district: tpl.district,
    thumbnailUrl: tpl.thumbnailUrl,
    status: "ACTIVE" as const,
    minRentalDays: 1,
    maxRentalDays: 30,
  }));

  await db.insert(listings).values(listingValues);

  console.log(`✅ Seeded ${listingValues.length} listings`);
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
