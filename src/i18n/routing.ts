import { defineRouting } from 'next-intl/routing';
export const availableLocales = [
  {
    code : 'pl',
    name: 'Polski',
    flag: '/images/flags/pl.png',
  },
  {
    code: 'en',
    name: 'English',
    flag: '/images/flags/en.png',
  }
 ] as const

export type Locale = typeof availableLocales[number]["code"];

export const getLocaleConfig = (locale: Locale) => {
  return availableLocales.find((l) => l.code === locale);
}

export const getAvailableLocales = () => {
  return availableLocales.map((l) => l.code);
}

export const routing = defineRouting({
  locales: availableLocales.map((l) => l.code),
  defaultLocale: 'pl',
});