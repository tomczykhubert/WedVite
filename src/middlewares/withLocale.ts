import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import { i18n } from "@/lib/i18n/config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import { MiddlewareFactory } from "./middlewareFactory";
import Negotiator from "negotiator";

export const withLocale: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname;
    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) =>
        !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );
    const isApi = pathname.startsWith("/api/");

    if (pathnameIsMissingLocale && !isApi) {
      const locale = getLocale(request);

      return NextResponse.redirect(
        new URL(
          `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
          request.url
        )
      );
    }
    return next(request, _next);
  };
};

function getLocale(request: NextRequest): string | undefined {
  const locales: string[] = [...i18n.locales];

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}
