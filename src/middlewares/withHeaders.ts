import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,

} from "next/server";
import { MiddlewareFactory } from "./middlewareFactory";
import { removeLocalePrefix } from "./withLocale";

export const withHeaders: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    request.headers.set("x-current-path", removeLocalePrefix(request.nextUrl.pathname, '/'));
    return next(request, _next);
  };
};
