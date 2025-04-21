export type Locale = (typeof locales)[number];

export const locales = ["en", "pl"] as const;
export const defaultLocale: Locale = "en";
