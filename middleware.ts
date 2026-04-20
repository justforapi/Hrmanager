import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    (pathname.startsWith("/admin") && pathname !== "/admin/login") ||
    (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login")
  ) {
    const authCookie = request.cookies.get("admin_auth");
    const expiresCookie = request.cookies.get("admin_auth_expires");
    const expiresAt = expiresCookie?.value ? Number(expiresCookie.value) : 0;

    const isExpired = !expiresAt || Number.isNaN(expiresAt) || Date.now() > expiresAt;
    const isValid = authCookie?.value === "authenticated" && !isExpired;

    if (!isValid) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      const response = NextResponse.redirect(url);
      response.cookies.delete("admin_auth");
      response.cookies.delete("admin_auth_expires");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
