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
    if (!accessToken || !refreshToken) throw new Error("Tokens missing");

    // Verify JWT
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Verify session in DB
    const session = await findSessionByRefreshToken(refreshToken);
    if (!session || session.revoked) throw new Error("Invalid session");

    // Optional: verify session belongs to same user
    if (decoded.sub !== session.userId.toString()) throw new Error("Session mismatch");

    // Everything is valid
    return res;
  } catch (err) {
    // Invalid token or session → clear cookies & redirect to login
    res.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
    res.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
    return NextResponse.redirect(new URL("/LoginPage", req.url));
  }
}

// Routes to protect
export const config = {
  matcher: [
    "/Dashboard/:path*",
    "/Profile/:path*",
    "/Transactions/:path*",
    "/Budget/:path*",
    "/Admin/:path*",
  ],
  runtime: "nodejs",
};
