import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}

export function getR2Client(): S3Client | null {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function uploadToR2({
  buffer,
  fileName,
  contentType,
}: {
  buffer: Buffer;
  fileName: string;
  contentType: string;
}): Promise<string> {
  const client = getR2Client();
  const bucketName = process.env.R2_BUCKET_NAME?.trim();

  if (!client || !bucketName) {
    throw new Error(
      "Cloudflare R2 is not fully configured. Missing R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, or R2_BUCKET_NAME."
    );
  }

  // Store in uploads/ prefix within the bucket
  const key = `uploads/${fileName}`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  const publicUrlBase = process.env.R2_PUBLIC_URL?.trim()?.replace(/\/$/, "");
  if (publicUrlBase) {
    return `${publicUrlBase}/${key}`;
  }

  // Fallback: construct public URL or r2.dev URL if R2_PUBLIC_URL was omitted
  return `https://${bucketName}.${process.env.R2_ACCOUNT_ID?.trim()}.r2.cloudflarestorage.com/${key}`;
}
