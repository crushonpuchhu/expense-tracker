import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  findSessionByRefreshToken,
  revokeSession,
  revokeAllSessionsForUser,
} from "../../../../lib/auth.js";
import { clearCookies } from "../../../../lib/cookies.js";

export async function POST(req) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Read query param ?all=true
  const url = new URL(req.url);
  const allDevices = url.searchParams.get("all") === "true";

  if (refreshToken) {
    const session = await findSessionByRefreshToken(refreshToken);

    if (session) {
      if (allDevices) {
        // Revoke all sessions for this user
        await revokeAllSessionsForUser(session.userId);
      } else {
        // Revoke only current session
        await revokeSession(session._id.toString());
      }
    }
  }

  // Clear cookies
  await clearCookies();

  return NextResponse.json({
    ok: true,
    message: allDevices
      ? "Logged out from all devices"
      : "Logged out successfully",
  });
}
