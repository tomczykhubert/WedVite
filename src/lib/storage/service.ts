import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, STORAGE_BUCKET } from "./client";
import { STORAGE_CONFIG } from "./config";

export interface UploadOptions {
  key: string;
  body: Buffer | Uint8Array | ReadableStream;
  contentType: string;
  metadata?: Record<string, string>;
}

export interface PresignedUploadUrlOptions {
  key: string;
  contentType: string;
  expiresIn?: number;
}

export interface PresignedUrlOptions {
  key: string;
  expiresIn?: number;
}

export async function getPresignedUploadUrl(
  options: PresignedUploadUrlOptions
): Promise<{ url: string; key: string }> {
  const command = new PutObjectCommand({
    Bucket: STORAGE_BUCKET,
    Key: options.key,
    ContentType: options.contentType,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: options.expiresIn ?? STORAGE_CONFIG.EXPIRATION_TIME_SECONDS,
  });

  return { url, key: options.key };
}

export async function getPresignedUrl(
  options: PresignedUrlOptions
): Promise<{ url: string; key: string }> {
  const command = new GetObjectCommand({
    Bucket: STORAGE_BUCKET,
    Key: options.key,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: options.expiresIn ?? STORAGE_CONFIG.EXPIRATION_TIME_SECONDS,
  });

  return { url, key: options.key };
}

export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: STORAGE_BUCKET,
    Key: key,
  });

  await s3Client.send(command);
}

export function getImageKey(eventId: string, imageId: string): string {
  return `${eventId}/${imageId}`;
}
