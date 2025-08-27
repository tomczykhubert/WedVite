import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { parsePhoneNumberFromString, isValidPhoneNumber } from "libphonenumber-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Waliduje numer telefonu.
 * @param phone - numer telefonu w dowolnym formacie
 * @returns true jeśli numer jest poprawny, false w przeciwnym wypadku
 */
export const validatePhoneNumber = (phone?: string): boolean => {
  if (!phone) return false;

  try {
    const parsed = parsePhoneNumberFromString(phone);
    const result = parsed?.isValid() ?? false;
    return result;
  } catch {
    return false;
  }
};

/**
 * Normalizuje numer telefonu do formatu E.164 (np. +48123456789)
 * @param phone - numer telefonu w dowolnym formacie
 * @returns znormalizowany numer lub pusty string, jeśli niepoprawny
 */
export const normalizePhoneNumber = (phone?: string): string => {
  if (!phone) return "";

  try {
    const parsed = parsePhoneNumberFromString(phone);
    return parsed?.isValid() ? parsed.number : "";
  } catch {
    return "";
  }
};

export const getEnumKeys = <
    T extends string,
    TEnumValue extends string | number,
>(enumVariable: { [key in T]: TEnumValue }) => {
    return Object.keys(enumVariable) as Array<T>;
}