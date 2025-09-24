import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { findSessionByRefreshToken } from "./lib/auth.js";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const res = NextResponse.next();
  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  const publicPages = ["/", "/LoginPage", "/CreateAccount"];
  const protectedPaths = ["/Dashboard", "/Profile", "/Transactions", "/Budget", "/Admin"];

  try {
    // 1️⃣ Validate tokens
    if (accessToken && refreshToken) {
      const session = await findSessionByRefreshToken(refreshToken);
      if (session && !session.revoked) {
        let decoded;
        try {
          decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        } catch {
          // Access token invalid, let it fall through
          throw new Error("Invalid access token");
        }

        // Ensure session matches user
        if (decoded.sub !== session.userId.toString()) throw new Error("Session mismatch");

        // EXTRA SECURITY: device + IP check
        const requestIp = req.headers.get("x-forwarded-for")?.split(",")[0] || req.ip || "::1";
        const requestDevice = req.headers.get("user-agent") || "unknown";
        if (session.ip !== requestIp || session.deviceInfo !== requestDevice) {
          throw new Error("Token used from another device");
        }

        // ✅ Redirect logged-in users away from public pages
        if (publicPages.includes(pathname)) {
          url.pathname = "/Dashboard";
          return NextResponse.redirect(url);
        }

        // Admin restriction
        if (pathname.startsWith("/Admin") && decoded.role !== "admin") {
          url.pathname = "/Dashboard";
          return NextResponse.redirect(url);
        }

        return res; // Allow access to protected pages
      }
    }

    // 2️⃣ Guest user trying to access protected page
    if (protectedPaths.some((path) => pathname.startsWith(path))) {
      res.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
      res.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
      return NextResponse.redirect(new URL("/LoginPage", req.url));
    }

    // 3️⃣ Public pages for guests (home, login, create account)
    return res;

  } catch (err) {
    // 4️⃣ On error (invalid session, device mismatch, bad token)
    res.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
    res.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });

    // If trying to access protected page → redirect to login
    if (protectedPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/LoginPage", req.url));
    }

    // If public page → let guest access without redirect loop
    return res;
  }
}

export const config = {
  matcher: [
    "/", 
    "/Dashboard/:path*", 
    "/Profile/:path*", 
    "/Transactions/:path*", 
    "/Budget/:path*", 
    "/Admin/:path*", 
    "/LoginPage", 
    "/CreateAccount"
  ],
  runtime: "nodejs",
};
