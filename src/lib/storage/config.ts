import { toBytes } from "./utils";

export const STORAGE_CONFIG = {
  MAX_FILE_SIZE_MB: 10,

  MAX_FILES_PER_UPLOAD: 10,

  EXPIRATION_TIME_SECONDS: 1800, // 30 minutes

  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ] as const,

  ALLOWED_IMAGE_EXTENSIONS: [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".svg",
  ] as const,

  get MAX_FILE_SIZE_BYTES() {
    return toBytes(this.MAX_FILE_SIZE_MB);
  },
} as const;
