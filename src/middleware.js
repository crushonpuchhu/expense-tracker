import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  let decoded;

  try {
    // ✅ Verify access token first
    if (accessToken) {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } 
    // ✅ Try refresh token if access token is missing or expired
    else if (refreshToken) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh`,
        {
          method: "POST",
          headers: { cookie: `refreshToken=${refreshToken}` },
        }
      );

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();
      decoded = jwt.verify(data.accessToken, process.env.JWT_SECRET);

      // Set new access token cookie
      const response = NextResponse.next();
      response.cookies.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 15, // 15 minutes
        path: "/",
      });

      return response;
    }
  } catch (err) {
    console.error("Token verification/refresh failed:", err.message);

    // Clear invalid cookies and redirect to LoginPage
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/LoginPage";
    const res = NextResponse.redirect(loginUrl);

    res.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
    res.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });

    return res;
  }

  const role = decoded?.role?.toLowerCase();

  // ✅ Public routes
  const publicRoutes = ["/LoginPage", "/CreateAccount"];
  if (publicRoutes.includes(pathname)) {
    if (role) {
      url.pathname = role === "admin" ? "/Admin" : "/Dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ✅ Homepage redirect
  if (pathname === "/") {
    if (role) {
      url.pathname = role === "admin" ? "/Admin" : "/Dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ✅ Protected routes
  const protectedRoutes = [
    "/Dashboard",
    "/Admin",
    "/Profile",
    "/Transactions",
    "/Budget",
  ];

  if (protectedRoutes.some((r) => pathname.startsWith(r))) {
    if (!decoded) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/LoginPage";
      return NextResponse.redirect(loginUrl);
    }

    // Admin-only route check
    if (pathname.startsWith("/Admin") && role !== "admin") {
      url.pathname = "/Dashboard";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // Default allow for all other routes
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
