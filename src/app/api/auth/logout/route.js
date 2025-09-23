import { NextResponse } from "next/server";
import { findSessionByRefreshToken, revokeSession, revokeAllSessionsForUser } from "../../../../lib/auth.js";

export async function POST(req) {
  const cookieHeader = req.headers.get("cookie") || "";
  const refreshToken = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("refreshToken="))
    ?.split("=")[1];

  if (refreshToken) {
    const session = await findSessionByRefreshToken(refreshToken);

    if (session) {
      const url = new URL(req.url);
      const allDevices = url.searchParams.get("all") === "true";

      if (allDevices) {
        await revokeAllSessionsForUser(session.userId);
      } else {
        await revokeSession(session._id.toString());
      }
    }
  }

  // Use NextResponse to clear cookies
  const response = NextResponse.json({
    ok: true,
    message: refreshToken ? "Logged out" : "Already logged out",
  });

  // Clear cookies
  response.cookies.set("accessToken", "", { path: "/", maxAge: 0 });
  response.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });

  return response;
}
