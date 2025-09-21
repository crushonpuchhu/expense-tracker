import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const accessToken = req.cookies.get("accessToken")?.value;

  // Public routes that anyone can access
  const publicRoutes = ["/", "/LoginPage", "/CreateAccount"];
  if (publicRoutes.includes(pathname)) return NextResponse.next();

  let decoded;

  try {
    if (accessToken) {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } else {
      // No token → user is new / not logged in
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/LoginPage"; // Only redirect if trying protected route
      return NextResponse.redirect(loginUrl);
    }
  } catch (err) {
    // Invalid token → redirect to login for protected pages
    const res = NextResponse.redirect(new URL("/LoginPage", req.url));
    res.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
    res.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
    return res;
  }

  // Role-based redirects for logged-in users
  const role = decoded?.role?.toLowerCase();
  if (pathname === "/" && role) {
    url.pathname = role === "admin" ? "/Admin" : "/Dashboard";
    return NextResponse.redirect(url);
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
};
