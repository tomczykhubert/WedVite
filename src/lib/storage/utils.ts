import { STORAGE_CONFIG } from "./config";

export function isValidImageType(mimeType: string): boolean {
  return STORAGE_CONFIG.ALLOWED_IMAGE_TYPES.includes(
    mimeType.toLowerCase() as (typeof STORAGE_CONFIG.ALLOWED_IMAGE_TYPES)[number]
  );
}

export function isValidFileSize(sizeInBytes: number): boolean {
  return sizeInBytes <= STORAGE_CONFIG.MAX_FILE_SIZE_BYTES;
}

export function toMB(bytes: number): number {
  return bytes / (1024 * 1024);
}

export function toBytes(mb: number): number {
  return mb * 1024 * 1024;
}

export const getFileExtension = (filename: string) => {
  const lastDot = filename.lastIndexOf(".");
  return lastDot > 0 ? filename.slice(lastDot + 1).toLowerCase() : "";
};

export const getFilenameWithoutExtension = (filename: string) => {
  const lastDot = filename.lastIndexOf(".");
  return lastDot > 0 ? filename.slice(0, lastDot) : filename;
};
