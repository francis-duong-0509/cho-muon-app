import z from "zod";
import { protectedProcedure, publicProcedure } from "..";
import { db } from "@chomuon/db";
import { and, asc, count, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { userKyc } from "@chomuon/db/schema/user-kyc";
import { ORPCError } from "@orpc/server";
import { listingBlockedDates, listings } from "@chomuon/db/schema/listings";
import { categories } from "@chomuon/db/schema/categories";

// Helper function
async function getOwnedListing(listingId: string, userId: string) {
    const listing = await db.query.listings.findFirst({
        where: and(
            eq(listings.id, listingId),
            eq(listings.ownerId, userId),
        )
    });

    if (!listing) {
        throw new ORPCError("NOT_FOUND", { message: "Listing không tồn tại hoặc không thuộc về bạn" });
    }

    return listing;
}

export const create = protectedProcedure
    .input(z.object({
        title: z.string().min(10).max(200),
        description: z.string().min(20).max(5000),
        categoryId: z.string(),
        conditionNotes: z.string().max(500).optional(),
        pricePerDay: z.number().int().positive(),
        depositAmount: z.number().int().min(0),
        estimatedValue: z.number().int().positive(),
        minRentalDays: z.number().int().min(1).default(1),
        maxRentalDays: z.number().int().max(90).default(30),
        noticeHours: z.number().int().min(0).default(0),
        pickupMethod: z.enum(["IN_PERSON", "SHIP_AVAILABLE"]).default("IN_PERSON"),
        province: z.string(),
        district: z.string(),
        ward: z.string().optional(),
    }))
    .output(z.object({id: z.string()}))
    .handler(async ({input, context}) => {
        const userId = context.session.user.id;

        // AuthZ: Just KYC approved can create listings
        const kyc = await db.query.userKyc.findFirst({
            where: eq(userKyc.userId, userId),
            columns: {kycStatus: true}
        });

        if (kyc?.kycStatus !== "APPROVED") {
            throw new ORPCError("FORBIDDEN", { message: "Bạn cần xác minh danh tính trước khi đăng đồ" })
        }

        const [listing] = await db
            .insert(listings)
            .values({ ownerId: userId, ...input })
            .returning({ id: listings.id });

        if (!listing) {
            throw new ORPCError("INTERNAL_ERROR", { message: "Không thể tạo listing" });
        }

        return { id: listing.id };
    })

export const list = publicProcedure
    .input(z.object({
        search: z.string().optional(),
        categoryId: z.string().optional(),
        province: z.string().optional(),
        district: z.string().optional(),
        priceMin: z.number().int().optional(),
        priceMax: z.number().int().optional(),
        sortBy: z.enum(["newest", "price_asc", "price_desc", "rating"]).default("newest"),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(20),
    }))
    .handler(async ({ input }) => {
        const {search, categoryId, province, district, priceMin, priceMax, sortBy, page, limit} = input;
        const offset = (page - 1) * limit;

        // S1: Build WHERE conditions
        const conditions = [eq(listings.status, "ACTIVE")];

        if (categoryId) {
            conditions.push(eq(listings.categoryId, categoryId));
        }

        if (province) {
            conditions.push(eq(listings.province, province));
        }

        if (district) {
            conditions.push(eq(listings.district, district));
        }

        if (priceMin) {
            conditions.push(gte(listings.pricePerDay, priceMin));
        }

        if (priceMax) {
            conditions.push(lte(listings.pricePerDay, priceMax));
        }

        if (search) {
            conditions.push(
                sql`to_tsvector('simple', ${listings.title} || ' ' || ${listings.description}) @@ plainto_tsquery('simple', ${search})`
            );
        }

        const where = and(...conditions);

        // S2: Sort
        const orderMap = {
            newest: desc(listings.createdAt),
            price_asc: asc(listings.pricePerDay),
            price_desc: desc(listings.pricePerDay),
            rating: desc(listings.avgRating),
        } as const;

        // S3: Relational query for enriched items + count query in parallel
        const [items, [totalRow]] = await Promise.all([
            db.query.listings.findMany({
                where,
                orderBy: orderMap[sortBy],
                limit,
                offset,
                columns: {
                    id: true,
                    title: true,
                    thumbnailUrl: true,
                    pricePerDay: true,
                    province: true,
                    district: true,
                    avgRating: true,
                    totalBookings: true,
                    createdAt: true,
                },
                with: {
                    owner: {
                        columns: {
                            displayName: true,
                            avatarUrl: true,
                        },
                    },
                    category: {
                        columns: {
                            id: true,
                            name: true,
                            icon: true,
                        },
                    },
                    images: {
                        columns: { url: true },
                        orderBy: (images, { asc }) => [asc(images.sortOrder)],
                        limit: 1,
                    },
                },
            }),
            db.select({total: count()})
                .from(listings)
                .where(where),
        ]);

        return {
            items,
            total: totalRow?.total ?? 0,
            page,
        };
    })

export const listCategories = publicProcedure
    .handler(async () => {
        const items = await db
            .select({
                id: categories.id,
                name: categories.name,
                nameEn: categories.nameEn,
                icon: categories.icon,
            })
            .from(categories)
            .where(eq(categories.isActive, true))
            .orderBy(asc(categories.sortOrder));

        return { items };
    })

export const getById = publicProcedure
    .input(z.object({id: z.string().uuid()}))
    .handler(async ({input}) => {
        const listing = await db.query.listings.findFirst({
            where: eq(listings.id, input.id),
            with: {
                images: {
                    orderBy: (images, {asc}) => [asc(images.sortOrder)],
                },
                owner: {
                    columns: {
                        userId: true,
                        displayName: true,
                        avatarUrl: true,
                    }
                },
                category: {
                    columns: {
                        id: true,
                        name: true,
                        icon: true,
                    }
                },
                blockedDates: {
                    columns: {
                        blockedDate: true,
                    }
                }
            }
        });

        if (!listing) {
            throw new ORPCError("NOT_FOUND", { message: "Listing không tồn tại" });
        }

        return listing;
    })

export const myListings = protectedProcedure
    .input(z.object({
        status: z.enum(["PENDING_REVIEW", "ACTIVE", "PAUSED", "SUSPENDED"]).optional(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(20),
    }))
    .handler(async ({input, context}) => {
        const userId = context.session.user.id;
        const {status, page, limit} = input;
        const offset = (page - 1) * limit;

        const conditions = [
            eq(listings.ownerId, userId),
            sql`${listings.deletedAt} IS NULL`,
        ];

        if (status) conditions.push(eq(listings.status, status));

        const where = and(...conditions);

        const [items, [totalRow]] = await Promise.all([
            db.select()
                .from(listings)
                .where(where)
                .orderBy(desc(listings.createdAt))
                .limit(limit)
                .offset(offset),
            db.select({total: count()})
                .from(listings)
                .where(where),
        ]);

        return {
            items,
            total: totalRow?.total ?? 0,
            page,
        };
    })

export const update = protectedProcedure
    .input(z.object({
        id: z.string().uuid(),
        title: z.string().min(10).max(200).optional(),
        description: z.string().min(20).max(5000).optional(),
        categoryId: z.string().optional(),
        conditionNotes: z.string().max(500).optional(),
        pricePerDay: z.number().int().positive().optional(),
        depositAmount: z.number().int().min(0).optional(),
        estimatedValue: z.number().int().positive().optional(),
        minRentalDays: z.number().int().min(1).optional(),
        maxRentalDays: z.number().int().max(90).optional(),
        noticeHours: z.number().int().min(0).optional(),
        pickupMethod: z.enum(["IN_PERSON", "SHIP_AVAILABLE"]).optional(),
        province: z.string().optional(),
        district: z.string().optional(),
        ward: z.string().optional(),
    }))
    .handler(async ({input, context}) => {
        const userId = context.session.user.id;
        const {id, ...data} = input;

        await getOwnedListing(id, userId);

        const [updated] = await db
            .update(listings)
            .set({...data, updatedAt: new Date()})
            .where(eq(listings.id, id))
            .returning();

        return updated;
    })

export const pause = protectedProcedure
    .input(z.object({id: z.string().uuid()}))
    .handler(async ({input, context}) => {
        const userId = context.session.user.id;
        const listing = await getOwnedListing(input.id, userId);

        if (listing.status !== "ACTIVE") {
            throw new ORPCError("BAD_REQUEST", { message: "Chỉ có thể pause listing đang ACTIVE" });
        }

        const [updated] = await db
            .update(listings)
            .set({status: "PAUSED", pausedAt: new Date(), updatedAt: new Date()})
            .where(eq(listings.id, input.id))
            .returning();

        return updated;
    })

export const activate = protectedProcedure
    .input(z.object({id: z.string().uuid()}))
    .handler(async ({input, context}) => {
        const userId = context.session.user.id;
        const listing = await getOwnedListing(input.id, userId);

        if (listing.status !== "PAUSED") {
            throw new ORPCError("BAD_REQUEST", { message: "Chỉ có thể activate listing đang PAUSED" });
        }

        const [updated] = await db
            .update(listings)
            .set({status: "ACTIVE", pausedAt: null, updatedAt: new Date()})
            .where(eq(listings.id, input.id))
            .returning();

        return updated;
    })

export const deleteListing = protectedProcedure
    .input(z.object({id: z.string().uuid()}))
    .handler(async ({input, context}) => {
        const userId = context.session.user.id;
        await getOwnedListing(input.id, userId);

        await db
            .update(listings)
            .set({status: "DELETED", deletedAt: new Date(), updatedAt: new Date()})
            .where(eq(listings.id, input.id));
    })

export const blockDates = protectedProcedure
    .input(z.object({
        id: z.string().uuid(),
        dates: z.array(z.string().date()).min(1).max(90),
        reason: z.string().max(200).optional(),
    }))
    .handler(async ({input, context}) => {
        const userId = context.session.user.id;
        await getOwnedListing(input.id, userId);

        await db
            .insert(listingBlockedDates)
            .values(
                input.dates.map(date => ({
                    listingId: input.id,
                    blockedDate: date,
                    reason: input.reason,
                }))
            )
            .onConflictDoNothing();
    })

export const unblockDates = protectedProcedure
    .input(z.object({
        id: z.string().uuid(),
        dates: z.array(z.string().date()).min(1),
    }))
    .handler(async ({input, context}) => {
        const userId = context.session.user.id;
        await getOwnedListing(input.id, userId);

        await db
            .delete(listingBlockedDates)
            .where(
                and(
                    eq(listingBlockedDates.listingId, input.id),
                    inArray(listingBlockedDates.blockedDate, input.dates),
                )
            )
    })

export const checkAvailability = publicProcedure
    .input(z.object({
        id: z.string().uuid(),
        startDate: z.string().date(),
        endDate: z.string().date(),
    }))
    .handler(async ({input}) => {
        const conflicts = await db
            .select({blockDates: listingBlockedDates.blockedDate})
            .from(listingBlockedDates)
            .where(
                and(
                    eq(listingBlockedDates.listingId, input.id),
                    gte(listingBlockedDates.blockedDate, input.startDate),
                    lte(listingBlockedDates.blockedDate, input.endDate),
                )
            )

        return {
            available: conflicts.length === 0,
            conflictDates: conflicts.map(c => c.blockDates),
        }
    })