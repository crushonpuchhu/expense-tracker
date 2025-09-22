import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let decoded = null;

  try {
    if (accessToken) {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } else if (refreshToken) {
      // call refresh token API
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { cookie: `refreshToken=${refreshToken}` },
      });

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();
      accessToken = data.accessToken;

      // set new access token cookie
      cookieStore.set({
        name: "accessToken",
        value: accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    }
  } catch (err) {
    // clear invalid cookies if tokens are bad
    const res = NextResponse.next();
    res.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
    res.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
    decoded = null; // treat as logged out
  }

  const role = decoded?.role?.toLowerCase();

  // If user hits home page "/"
  if (pathname === "/") {
    if (role) {
      url.pathname = role === "admin" ? "/Admin" : "/Dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next(); // show public home page if logged out
  }

  // Public routes
  const publicRoutes = ["/LoginPage", "/CreateAccount"];
  if (publicRoutes.includes(pathname)) {
    if (role) {
      url.pathname = role === "admin" ? "/Admin" : "/Dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protected routes
  const protectedRoutes = ["/Dashboard", "/Admin", "/Profile", "/Transactions", "/Budget"];
  if (protectedRoutes.some((r) => pathname.startsWith(r))) {
    if (!decoded) {
      url.pathname = "/LoginPage";
      return NextResponse.redirect(url);
    }

    // Admin-only check
    if (pathname.startsWith("/Admin") && role !== "admin") {
      url.pathname = "/Dashboard";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/Dashboard/:path*",
    "/Transactions/:path*",
    "/Budget/:path*",
    "/Profile/:path*",
    "/Admin/:path*",
    "/LoginPage",
    "/CreateAccount",
  ],
  runtime: "nodejs",
};
