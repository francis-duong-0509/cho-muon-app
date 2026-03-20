import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@chomuon/env/server";

function getS3Client(): S3Client {
    if (!env.S3_ENDPOINT || !env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY) {
        throw new Error("S3 is not configured. Please set S3_ENDPOINT, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY.");
    }
    return new S3Client({
        endpoint: env.S3_ENDPOINT,
        region: env.S3_REGION,
        credentials: {
            accessKeyId: env.S3_ACCESS_KEY_ID,
            secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        },
        forcePathStyle: true,
    });
}

let _s3: S3Client | null = null;
export function getS3(): S3Client {
    if (!_s3) _s3 = getS3Client();
    return _s3;
}

export async function presignUpload(bucket: string, key: string, contentType: string) {
    return getSignedUrl(
        getS3(),
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
        getS3(),
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