// logout.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findSessionByRefreshToken, revokeSession, revokeAllSessionsForUser } from "../../../../lib/auth.js";

export async function POST(req) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

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

  // Clear cookies
  ["accessToken", "refreshToken"].forEach((name) => {
    cookieStore.set(name, "", { maxAge: 0, path: "/" });
  });

  return NextResponse.json({
    ok: true,
    message: refreshToken ? "Logged out" : "Already logged out",
  });
}
