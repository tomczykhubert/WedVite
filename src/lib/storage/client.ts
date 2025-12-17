import { S3Client } from "@aws-sdk/client-s3";

const STORAGE_REGION = process.env.STORAGE_REGION || "auto";
const STORAGE_ACCESS_KEY_ID = process.env.STORAGE_ACCESS_KEY_ID;
const STORAGE_SECRET_ACCESS_KEY = process.env.STORAGE_SECRET_ACCESS_KEY;
export const STORAGE_ENDPOINT = process.env.STORAGE_ENDPOINT;
export const STORAGE_BUCKET = process.env.STORAGE_BUCKET_NAME;

if (!STORAGE_BUCKET) {
  throw new Error("STORAGE_BUCKET_NAME environment variable is required");
}

if (!STORAGE_ENDPOINT) {
  throw new Error("STORAGE_ENDPOINT environment variable is required");
}

if (!STORAGE_ACCESS_KEY_ID) {
  throw new Error("STORAGE_ACCESS_KEY_ID environment variable is required");
}

if (!STORAGE_SECRET_ACCESS_KEY) {
  throw new Error("STORAGE_SECRET_ACCESS_KEY environment variable is required");
}

export const s3Client = new S3Client({
  endpoint: STORAGE_ENDPOINT,
  region: STORAGE_REGION,
  credentials: {
    accessKeyId: STORAGE_ACCESS_KEY_ID,
    secretAccessKey: STORAGE_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});
