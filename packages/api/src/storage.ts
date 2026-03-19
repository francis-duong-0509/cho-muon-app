import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@chomuon/env/server";

export const s3 = new S3Client({
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
});

export async function presignUpload(bucket: string, key: string, contentType: string) {
    return getSignedUrl(
        s3,
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            ContentType: contentType,
        }),
        {
            expiresIn: 300, // seconds
        },
    );
}

export async function presignDownload(bucket: string, key: string) {
    return getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        }),
        { expiresIn: 900 }, //seconds
    );
}

export function kycKey(userId: string, type: "front" | "back" | "selfie"): string {
    return `kyc/${userId}/${type}.jpg`;
}