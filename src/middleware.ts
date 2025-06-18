import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  // Optionally, verify the JWT token
  try {
    const payload = jwtDecode(token);
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  return NextResponse.next();
}

// Place the matcher config here!
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth/sign-in|auth/sign-up|assets).*)",
  ],
};
