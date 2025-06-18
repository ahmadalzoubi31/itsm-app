import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export function middleware(req: NextRequest) {
  console.log("Middleware running", req.nextUrl.pathname);

  const token = req.cookies.get("accessToken")?.value;
  console.log("🚀 ~ file: middleware.ts:9 ~ token:", token);

  if (!token) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  // Optionally, verify the JWT token
  try {
    jwt.decode(token);
    const payload = jwt.decode(token) as JwtPayload;

    console.log(payload.exp && payload.exp < Date.now() / 1000);
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
