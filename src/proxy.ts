import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ── Admin route protection ── */
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.userType !== "admin") {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  /* ── Customer account protection ── */
  if (
    pathname.startsWith("/account") &&
    pathname !== "/account/login" &&
    pathname !== "/account/register"
  ) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.userType !== "customer") {
      const loginUrl = new URL("/account/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
