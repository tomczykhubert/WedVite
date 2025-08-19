import createMiddleware from 'next-intl/middleware';
import { MiddlewareFactory } from './middlewareFactory';
import { NextFetchEvent, NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

export const withLocale: MiddlewareFactory = (next) => {
  const intlMiddleware = createMiddleware(routing);
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname;
    const isApi = pathname.startsWith("/api/");

    if (isApi) {
      return next(request, _next);
    }
    const intlResponse = intlMiddleware(request);
    if (intlResponse) return intlResponse;

    return next(request, _next);
  };
};

export function removeLocalePrefix(path: string, emptyRoute: string = ''): string {
  if (routing.locales.some((loc) => path === `/${loc}` || path === `/${loc}/`)) {
    return emptyRoute;
  }

  const locale = routing.locales.find((loc) => path.startsWith(`/${loc}/`));

  return locale ? path.replace(`/${locale}/`, "/") : path;
}