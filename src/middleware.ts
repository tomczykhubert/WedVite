import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import { Session } from "better-auth";
import { routes } from "./lib/routes/routes";
import PROTECTED_ROUTES from "./lib/routes/protectedRoutes";
import GUEST_ROUTES from "./lib/routes/guestRoutes";

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_ROUTES.some((path) => pathname == path);
  const isGuest = GUEST_ROUTES.some((path) => pathname == path);

  if (!isProtected && !isGuest) {
    return NextResponse.next();
  }

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );
  console.log(`middleware get session: ${pathname}`);
  //case: PROTECTED
  if (isProtected) {
    return handleProtected(request, session);
  }

  // //case: GUEST
  if (isGuest) {
    return handleGuest(request, session);
  }

  //case: PUBLIC
  return NextResponse.next();
}

function handleProtected(request: NextRequest, session: Session | null) {
  return !session
    ? handleAuthenticationRedirect(request, routes.auth.signIn)
    : NextResponse.next();
}

function handleGuest(request: NextRequest, session: Session | null) {
  console.log(session);

  return session
    ? handleAuthenticationRedirect(request, routes.home)
    : NextResponse.next();
}

function handleAuthenticationRedirect(
  request: NextRequest,
  redirectUrl: string
) {
  return request.nextUrl.pathname.startsWith("/api")
    ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    : NextResponse.redirect(new URL(redirectUrl, request.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.webmanifest).*)",
  ],
};
