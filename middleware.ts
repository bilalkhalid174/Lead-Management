import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get user session token FIRST
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If logged in → block access to login/register
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect /admin route
    if (pathname.startsWith("/admin")) {
    if (token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

  // Allow public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/auth") || // NextAuth routes
    pathname.startsWith("/_next") || // Next.js internals
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // If not logged in → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If logged in → allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};