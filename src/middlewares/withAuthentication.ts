import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse, URLPattern } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import { Session } from "better-auth";
import { MiddlewareFactory } from "./middlewareFactory";
import PUBLIC_ROUTES from "@/lib/routes/publicRoutes";
import GUEST_ROUTES from "@/lib/routes/guestRoutes";
import { PathEntry } from "@/lib/routes/PathEntry";
import { routes } from "@/lib/routes/routes";
import { routing } from "@/i18n/routing";
import { apiRoutes } from "@/lib/routes/apiRoutes";

type AuthMiddlewareParams = {
  request: NextRequest;
  next: NextMiddleware;
  _next: NextFetchEvent;
  session: Session | null;
}

export const withAuthentication: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    let pathname = request.nextUrl.pathname;
    pathname = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    pathname = removeLocalePrefix(pathname);
    const isPublic = checkPaths(PUBLIC_ROUTES, pathname);

    if (isPublic) {
      return next(request, _next);
    }

    const isGuest = checkPaths(GUEST_ROUTES, pathname);

    const { data: session } = await betterFetch<Session>(
      apiRoutes.auth.getSession,
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );
    const middlewareParams = {
      request,
      next,
      _next,
      session,
    }

    if (isGuest) {
      return handleGuest(middlewareParams);
    }
    return handleProtected(middlewareParams);
  }
}

function checkPaths(paths: PathEntry[], pathname: string): boolean {
  return paths.some((path) => {
    if (typeof path === "string") {
      path = path.endsWith("/") ? path.slice(0, -1) : path;
      return pathname === path;
    } else if (typeof path === "function") {
      const pattern = new URLPattern({ pathname: path(":param1", ":param2", ":param3", ":param4") });
      return pattern.test({ pathname });
    }
    return false;
  });
}

function handleProtected(params: AuthMiddlewareParams) {
  return !params.session
    ? handleAuthenticationRedirect(params, routes.auth.signIn)
    : params.next(params.request, params._next);
}

function handleGuest(params: AuthMiddlewareParams) {
  return params.session
    ? handleAuthenticationRedirect(params, routes.home)
    : params.next(params.request, params._next);
}

function handleAuthenticationRedirect(params: AuthMiddlewareParams, redirectUrl: string) {
  return params.request.nextUrl.pathname.startsWith("/api")
    ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    : NextResponse.redirect(new URL(redirectUrl, params.request.url));
}

function removeLocalePrefix(path: string): string {
  if (routing.locales.some((loc) => path === `/${loc}` || path === `/${loc}/`)) {
    return "";
  }

  const locale = routing.locales.find((loc) => path.startsWith(`/${loc}/`));

  return locale ? path.replace(`/${locale}/`, "/") : path;
}
