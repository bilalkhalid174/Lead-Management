import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ IMPORTANT: Never run middleware on NextAuth APIs
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Get user session token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 🔥 REAL EXPIRY CHECK
  const isExpired =
    token?.exp && Date.now() / 1000 > (token.exp as number);

  if (isExpired) {
    const url = new URL("/login", req.url);
    url.searchParams.set("expired", "true");
    return NextResponse.redirect(url);
  }

  // If logged in → block login/register
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Protect /admin
  if (pathname.startsWith("/admin")) {
    if (token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Allow public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // If not logged in → redirect
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};