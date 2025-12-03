import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

/**
 * Parses a Set-Cookie header value into a partial ResponseCookie object.
 * Note: This is a simplified parser. For production-grade parsing of all edge cases,
 * consider using a library like 'set-cookie-parser' or 'cookie'.
 */
export function parseSetCookieHeader(header: string): Partial<ResponseCookie> & { name: string; value: string } | null {
  const parts = header.split(";").map((part) => part.trim());
  const [nameValue, ...options] = parts;
  const [name, value] = nameValue.split("=");

  if (!name || value === undefined) {
    return null;
  }

  const cookie: any = {
    name,
    value,
  };

  options.forEach((option) => {
    const [key, val] = option.split("=");
    const lowerKey = key.toLowerCase();

    switch (lowerKey) {
      case "path":
        cookie.path = val || "/";
        break;
      case "domain":
        cookie.domain = val;
        break;
      case "max-age":
        cookie.maxAge = parseInt(val, 10);
        break;
      case "expires":
        // expires is usually a date string, we might need to parse it if we want to use it
        // but ResponseCookie in next/headers (cookies().set) often prefers maxAge or takes expires as Date
        // For simplicity, we might skip complex date parsing here or pass it as is if the type allows.
        // next/headers cookies().set takes `expires` as number | Date.
        cookie.expires = new Date(val);
        break;
      case "secure":
        cookie.secure = true;
        break;
      case "httponly":
        cookie.httpOnly = true;
        break;
      case "samesite":
        // strict, lax, none
        if (val) {
            const lowerVal = val.toLowerCase();
            if (lowerVal === 'lax' || lowerVal === 'strict' || lowerVal === 'none') {
                cookie.sameSite = lowerVal;
            }
        }
        break;
    }
  });

  return cookie;
}
