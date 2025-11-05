import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  try {
    const payload = jwtDecode<{ exp: number }>(token);

    if (payload.exp && payload.exp < Date.now() / 1000) {
      // If expired, redirect to session-expired with redirect param
      const refreshToken = req.cookies.get("refreshToken")?.value || "";
      const sessionExpiredUrl = new URL("/auth/session-expired", req.url);
      sessionExpiredUrl.searchParams.set("redirect", req.nextUrl.pathname);
      sessionExpiredUrl.searchParams.set("refreshToken", refreshToken);

      return NextResponse.redirect(sessionExpiredUrl);
    }
  } catch {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth/sign-in|auth/sign-up|auth/session-expired|auth/refresh|assets).*)",
  ],
};
