const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function getFullUrl(path: string): string {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_BASE_URL environment variable is required");
  }
  return `${BASE_URL}${path}`;
}
