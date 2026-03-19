import z from "zod";
import { adminProcedure, protectedProcedure } from "../index";
import { kycKey, presignDownload, presignUpload } from "../storage";
import { env } from "@chomuon/env/server";
import { db } from "@chomuon/db";
import { userKyc } from "@chomuon/db/schema/user-kyc";
import { createHash } from "crypto";
import { eq } from "drizzle-orm";
import { userProfile } from "@chomuon/db/schema/users";
import { ORPCError } from "@orpc/server";

export const getUploadUrls = protectedProcedure
  .output(
    z.object({
      front: z.string().url(),
      back: z.string().url(),
      selfie: z.string().url(),
    }),
  )
  .handler(async ({ context }) => {
    const userId = context.session.user.id;

    // Call presignUpload 3 times
    const [front, back, selfie] = await Promise.all([
      presignUpload(env.S3_BUCKET_NAME, kycKey(userId, "front"), "image/jpeg"),
      presignUpload(env.S3_BUCKET_NAME, kycKey(userId, "back"), "image/jpeg"),
      presignUpload(env.S3_BUCKET_NAME, kycKey(userId, "selfie"), "image/jpeg"),
    ]);

    return { front, back, selfie };
  });

export const submit = protectedProcedure
  .input(
    z.object({
      fullName: z.string().min(2).max(100),
      dateOfBirth: z.string().date(),
      gender: z.enum(["male", "female", "other"]).optional(),
      address: z.string().max(500).optional(),
      cccdNumber: z.string().min(9).max(12),
    }),
  )
  .output(z.object({ status: z.string() }))
  .handler(async ({ input, context }) => {
    const userId = context.session.user.id;

    const existing = await db.query.userKyc.findFirst({ where: eq(userKyc.userId, userId) });
    // Allow resubmit only if previously REJECTED — PENDING/APPROVED cannot resubmit
    if (existing && existing.kycStatus !== "REJECTED") {
        throw new ORPCError("CONFLICT", { message: `KYC already ${existing.kycStatus.toLowerCase()}` });
    }

    const cccdNumberHash = createHash("sha256").update(input.cccdNumber).digest("hex");

    await db.insert(userKyc).values({
        userId,
        fullName: input.fullName,
        dateOfBirth: input.dateOfBirth,
        gender: input.gender,
        address: input.address,
        cccdFrontUrl: kycKey(userId, "front"),
        cccdBackUrl: kycKey(userId, "back"),
        selfieUrl: kycKey(userId, "selfie"),
        cccdNumberHash,
        kycStatus: "PENDING",
    })
    // REJECTED user resubmits → update existing record instead of inserting duplicate
    .onConflictDoUpdate({
        target: userKyc.userId,
        set: {
            fullName: input.fullName,
            dateOfBirth: input.dateOfBirth,
            gender: input.gender,
            address: input.address,
            cccdFrontUrl: kycKey(userId, "front"),
            cccdBackUrl: kycKey(userId, "back"),
            selfieUrl: kycKey(userId, "selfie"),
            cccdNumberHash,
            kycStatus: "PENDING",
            rejectionReason: null,
            updatedAt: new Date(),
        },
    });

    return {
        status: "PENDING",
    }
  });

export const getStatus = protectedProcedure
  .output(z.object({ status: z.string(), rejectionReason: z.string().nullable().optional() }))
  .handler(async ({ context }) => {
    const userId = context.session.user.id;
    
    const kyc = await db.query.userKyc.findFirst({
      where: eq(userKyc.userId, userId),
      columns: {kycStatus: true, rejectionReason: true},
    });
    return {
      status: kyc?.kycStatus ?? "NOT_SUBMITTED",
      rejectionReason: kyc?.rejectionReason,
    };
  });

export const getDetail = adminProcedure
  .input(z.object({ userId: z.string() }))
  .handler(async ({ input }) => {
    const kyc = await db.query.userKyc.findFirst({
      where: eq(userKyc.userId, input.userId),
    });

    if (!kyc) {
      throw new ORPCError("NOT_FOUND", { message: "KYC not found" });
    }

    const [front, back, selfie] = await Promise.all([
      presignDownload(env.S3_BUCKET_NAME, kyc.cccdFrontUrl),
      presignDownload(env.S3_BUCKET_NAME, kyc.cccdBackUrl),
      presignDownload(env.S3_BUCKET_NAME, kyc.selfieUrl),
    ]);

    return { ...kyc, cccdFrontUrl: front, cccdBackUrl: back, selfieUrl: selfie }
  });

export const listPending = adminProcedure
  .output(z.array(z.object({
    userId: z.string(),
    fullName: z.string(),
    dateOfBirth: z.string(),
    createdAt: z.date(),
  })))
  .handler(async () => {
    const kycList = await db.query.userKyc.findMany({
      where: eq(userKyc.kycStatus, "PENDING"),
      columns: {userId: true, fullName: true, dateOfBirth: true, createdAt: true},
      orderBy: (t, { asc }) => [asc(t.createdAt)], // FIFO queue
    });
    return kycList;
  });
    
export const approve = adminProcedure
  .input(z.object({ userId: z.string() }))
  .output(z.object({ status: z.string() }))
  .handler(async ({input}) => {
    const existing = await db.query.userKyc.findFirst({ where: eq(userKyc.userId, input.userId) });
    if (!existing) {
        throw new ORPCError("NOT_FOUND", {message: "KYC not found"});
    }

    await db.transaction(async (tx) => {
        await tx
        .update(userKyc)
        .set({ kycStatus: "APPROVED", verifiedAt: new Date() })
        .where(eq(userKyc.userId, input.userId));
        
        await tx
        .update(userProfile)
        .set({ status: "VERIFIED" })
        .where(eq(userProfile.userId, input.userId));
    });

    return { status: "APPROVED" };
  });

export const reject = adminProcedure
  .input(z.object({ userId: z.string(), reason: z.string().min(10).max(500) }))
  .output(z.object({ status: z.string() }))
  .handler(async ({input}) => {
    const existing = await db.query.userKyc.findFirst({ where: eq(userKyc.userId, input.userId) });
    if (!existing) {
        throw new ORPCError("NOT_FOUND", {message: "KYC not found"});
    }

    await db
    .update(userKyc)
    .set({
        kycStatus: "REJECTED",
        rejectionReason: input.reason,
    })
    .where(eq(userKyc.userId, input.userId));

    return { status: "REJECTED" };
  });