import { TranslationValues, useTranslations } from "next-intl";

// Serialize the translation call to a string
export function serializeTranslationCall(
  key: string,
  values?: TranslationValues
): string {
  const serialized = {
    type: "translationCall",
    key,
    values: values || {},
  };
  return JSON.stringify(serialized);
}
export const stc = serializeTranslationCall;

// Deserialize the string back to a translation call and execute it
export function deserializeTranslationCall(
  serialized: string,
  t: ReturnType<typeof useTranslations>
): string {
  if (!isSerializedTranslationCall(serialized)) {
    throw new Error("Invalid serialized translation call");
  }
  const parsed = JSON.parse(serialized);
  return t(parsed.key, parsed.values);
}
export const dtc = deserializeTranslationCall;

// Check if a string is a valid serialized translation call
export function isSerializedTranslationCall(str: string): boolean {
  try {
    const parsed = JSON.parse(str);
    return (
      typeof parsed === "object" &&
      parsed !== null &&
      parsed.type === "translationCall" &&
      typeof parsed.key === "string" &&
      (typeof parsed.values === "object" || parsed.values === undefined)
    );
  } catch {
    return false;
  }
}

export const translate = (
  key: string,
  t: ReturnType<typeof useTranslations>
): string => {
  let translation: string;
  try {
    const isSerialized = isSerializedTranslationCall(key);
    if (isSerialized) {
      translation = deserializeTranslationCall(key, t);
    } else {
      translation = key;
    }
  } catch {
    translation = key;
  }

  return translation;
};
