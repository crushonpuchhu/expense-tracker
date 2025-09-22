// middleware.js
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

  try {
    if (accessToken && refreshToken) {
      // Verify session in DB
      const session = await findSessionByRefreshToken(refreshToken);
      if (session && !session.revoked) {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        // Check session belongs to the same user
        if (decoded.sub !== session.userId.toString()) throw new Error("Session mismatch");

        // EXTRA SECURITY: check device + IP
        const requestIp = req.headers.get("x-forwarded-for")?.split(",")[0] || req.ip || "::1";
        const requestDevice = req.headers.get("user-agent") || "unknown";

        if (session.ip !== requestIp || session.deviceInfo !== requestDevice) {
          throw new Error("Token used from another device");
        }

        // If user is already logged in and trying to access home, redirect to dashboard
        if (pathname === "/") {
          url.pathname = "/Dashboard";
          return NextResponse.redirect(url);
        }

        // Restrict /Admin for non-admins
        if (pathname.startsWith("/Admin") && decoded.role !== "admin") {
          url.pathname = "/Dashboard";
          return NextResponse.redirect(url);
        }

        return res;
      }
    }

    // If no valid tokens, clear cookies and redirect to login
    res.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
    res.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
    return NextResponse.redirect(new URL("/LoginPage", req.url));
  } catch (err) {
    // On error, clear cookies and redirect to login
    res.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
    res.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
    return NextResponse.redirect(new URL("/LoginPage", req.url));
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
  ],
  runtime: "nodejs",
};
